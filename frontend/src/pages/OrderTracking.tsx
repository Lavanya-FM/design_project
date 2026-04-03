import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CONFIG from '../config';

const OrderTracking: React.FC = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const STEPS = [
        { id: 'placed', label: 'Order Placed', desc: 'Awaiting designer approval' },
        { id: 'accepted', label: 'Accepted', desc: 'Design reviewed by artisan' },
        { id: 'stitching', label: 'In Production', desc: 'Master tailor at work' },
        { id: 'ready', label: 'Quality Check', desc: 'Final finishing in progress' },
        { id: 'shipped', label: 'En Route', desc: 'Handed over to courier' },
        { id: 'delivered', label: 'Delivered', desc: 'Enjoy your artisan blouse!' }
    ];

    useEffect(() => {
        fetchUserOrders();
    }, []);

    const fetchUserOrders = async () => {
        try {
            const res = await axios.get(`${CONFIG.API_URL}/orders`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
            });
            setOrders(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getActiveStep = (status: string) => {
        const idx = STEPS.findIndex(s => s.id === status);
        return idx === -1 ? 0 : idx;
    };

    if (loading) return <div className="p-10 text-center font-black">Tracking Your Artisan Garments...</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <header className="p-12 text-center space-y-4">
                <h1 className="text-5xl font-black tracking-tighter">Your Creations</h1>
                <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-xs">Tracking the journey from sketch to stitch</p>
            </header>

            <main className="max-w-4xl mx-auto px-6 space-y-12">
                {orders.map(order => (
                    <div key={order.id} className="bg-white rounded-[40px] p-12 shadow-2xl space-y-12">
                        <div className="flex justify-between items-start border-b border-gray-100 pb-8">
                            <div>
                                <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest block mb-2">Order ID: #{order.id.slice(0, 8)}</span>
                                <h3 className="text-2xl font-black">Design: {order.items?.[0]?.customization_details?.neck || 'Artisan Blouse'}</h3>
                            </div>
                            <div className="text-right">
                                <span className="text-sm font-black block">Est. Delivery</span>
                                <span className="text-gray-400 font-bold text-xs">Oct 24, 2026</span>
                            </div>
                        </div>

                        {/* Tracker Timeline */}
                        <div className="relative">
                            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-100 -translate-y-1/2"></div>
                            <div className="grid grid-cols-6 gap-2 relative z-10">
                                {STEPS.map((step, i) => {
                                    const active = getActiveStep(order.status);
                                    const isCompleted = i < active;
                                    const isCurrent = i === active;
                                    
                                    return (
                                        <div key={step.id} className="flex flex-col items-center text-center space-y-4 group">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${isCompleted ? 'bg-purple-600 text-white' : isCurrent ? 'bg-black text-white scale-125 shadow-xl' : 'bg-white border-2 border-gray-100 text-gray-300'}`}>
                                                {isCompleted ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> : <span className="text-[10px] font-black">{i + 1}</span>}
                                            </div>
                                            <div className="hidden md:block">
                                                <h5 className={`text-[10px] font-black uppercase tracking-tighter mb-1 ${isCurrent ? 'text-black' : 'text-gray-300'}`}>{step.label}</h5>
                                                {isCurrent && <p className="text-[8px] font-bold text-purple-500 animate-pulse">{step.desc}</p>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-8">
                           <div className="flex -space-x-4">
                               <div className="w-12 h-12 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-lg"></div>
                               <div className="w-12 h-12 rounded-full border-4 border-white bg-purple-600 flex items-center justify-center text-white text-[10px] font-black shadow-lg">MS</div>
                           </div>
                           <button className="text-[10px] font-black uppercase tracking-widest border border-gray-100 px-6 py-3 rounded-full hover:bg-black hover:text-white transition">
                               Message Stylist
                           </button>
                        </div>
                    </div>
                ))}
            </main>
        </div>
    );
};

export default OrderTracking;
