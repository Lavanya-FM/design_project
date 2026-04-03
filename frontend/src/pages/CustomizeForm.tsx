import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { designAPI, Blouse } from '../services/api';
import CONFIG from '../config';

const CustomizeForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [design, setDesign] = useState<Blouse | null>(null);
    const [loading, setLoading] = useState(true);

    // Dynamic State
    const [config, setConfig] = useState({
        neck_tweak: 'standard',
        sleeve_length: 'regular',
        back_style: 'original',
        lining: 'cotton'
    });

    const [measurements, setMeasurements] = useState({
        chest: '',
        waist: '',
        shoulder: '',
        blouse_length: '',
        sleeve_around: ''
    });

    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (id) loadDesign(id);
    }, [id]);

    const loadDesign = async (designId: string) => {
        try {
            const data = await designAPI.getDesignById(designId);
            setDesign(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // --- Dynamic Pricing Logic (PHASE 5) ---
    const calculatePrice = () => {
        if (!design) return 0;
        let total = Number(design.price) || 1500;
        
        // Add work complexity premium
        if (config.neck_tweak !== 'standard') total += 300;
        if (config.sleeve_length === 'full') total += 500;
        if (config.lining === 'silk') total += 800;

        return total;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = {
                design_id: id,
                config,
                measurements,
                notes,
                price_estimated: calculatePrice()
            };
            await designAPI.saveCustomization(payload);
            alert('Customization saved! Our stylist will contact you for a final review.');
            navigate('/gallery');
        } catch (err) {
            alert('Failed to save customization. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="text-center py-20">Loading Customizer...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Left: Design Preview */}
            <div className="hidden lg:block w-1/3 bg-white border-r border-gray-200 sticky top-0 h-screen overflow-hidden">
                {design && (
                    <div className="p-12 space-y-8">
                        <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                            <img 
                                src={Array.isArray(design.images) ? design.images[0] : JSON.parse(design.images as string)[0]} 
                                className="w-full h-full object-cover" 
                                alt="Preview"
                            />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black mb-2">{design.title}</h2>
                            <p className="text-gray-500 text-sm">Customizing your artisan fit.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Right: Customization Form */}
            <div className="flex-1 p-6 lg:p-24 overflow-y-auto">
                <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-16">
                    <section>
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-purple-600 mb-8">1. Style Tweaks</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                            <div>
                                <label className="block font-bold mb-3">Neck Modification</label>
                                <select 
                                    className="w-full p-4 rounded-xl border border-gray-200 bg-white"
                                    value={config.neck_tweak}
                                    onChange={(e) => setConfig({...config, neck_tweak: e.target.value})}
                                >
                                    <option value="standard">Original Pattern</option>
                                    <option value="deeper">Make it Deeper (+₹300)</option>
                                    <option value="higher">Make it Higher (+₹300)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block font-bold mb-3">Sleeve Length</label>
                                <select 
                                    className="w-full p-4 rounded-xl border border-gray-200 bg-white"
                                    value={config.sleeve_length}
                                    onChange={(e) => setConfig({...config, sleeve_length: e.target.value})}
                                >
                                    <option value="regular">As Sample</option>
                                    <option value="elbow">Elbow (10")</option>
                                    <option value="full">Full Sleeve (+₹500)</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-purple-600 mb-8">2. Accurate Measurements (Inches)</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {Object.keys(measurements).map((key) => (
                                <div key={key}>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{key.replace('_', ' ')}</label>
                                    <input 
                                        type="number"
                                        placeholder="0.0"
                                        step="0.1"
                                        required
                                        className="w-full p-4 rounded-xl border border-gray-200 bg-white font-bold"
                                        value={measurements[key as keyof typeof measurements]}
                                        onChange={(e) => setMeasurements({...measurements, [key]: e.target.value})}
                                    />
                                </div>
                            ))}
                        </div>
                        <p className="mt-4 text-[11px] text-gray-400 italic">Unsure? Our tailor will call you for a virtual measurement guide.</p>
                    </section>

                    <section>
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-purple-600 mb-8">3. Final Notes</h3>
                        <textarea 
                            placeholder="Add any specific instructions (e.g. want more tassels, specific padding preference...)"
                            className="w-full h-32 p-6 rounded-2xl border border-gray-200 bg-white text-sm"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </section>

                    {/* Bottom Sticky Action */}
                    <div className="flex items-center justify-between pt-10 border-t border-gray-100">
                        <div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Estimated Total</span>
                            <span className="text-4xl font-black">₹ {calculatePrice()}</span>
                        </div>
                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-purple-600 text-white px-12 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl hover:shadow-purple-200 disabled:opacity-50"
                        >
                            {isSubmitting ? 'PROCESSING...' : 'CONFIRM CUSTOMIZATION'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CustomizeForm;
