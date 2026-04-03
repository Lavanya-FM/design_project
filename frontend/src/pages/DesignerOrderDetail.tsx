import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CONFIG from '../config';

const DesignerOrderDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchOrderDetails(id);
            fetchMessages(id);
        }
    }, [id]);

    const fetchOrderDetails = async (orderId: string) => {
        try {
            // Note: Reuse for now or add specific detail api
            const res = await axios.get(`${CONFIG.API_URL}/orders/${orderId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
            });
            setOrder(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (orderId: string) => {
        try {
            const res = await axios.get(`${CONFIG.API_URL}/fulfillment/${orderId}/messages`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
            });
            setMessages(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !id) return;
        try {
            await axios.post(`${CONFIG.API_URL}/fulfillment/${id}/messages`, { text: newMessage }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
            });
            setNewMessage('');
            fetchMessages(id);
        } catch (err) {
            alert('Failed to send message');
        }
    };

    if (loading) return <div className="p-10 font-black">Crafting Details...</div>;
    if (!order) return <div className="p-10 text-center">Order not found</div>;

    return (
        <div className="min-h-screen bg-white">
            <header className="p-8 border-b border-gray-100 flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-black">
                   ← Back to Atelier
                </button>
                <h1 className="text-xl font-black">Project: {id?.slice(0, 8)}</h1>
                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-purple-50 text-purple-600`}>
                    {order.status}
                </span>
            </header>

            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-0 h-[calc(100vh-100px)]">
                {/* Left: Specs & Measurements */}
                <div className="lg:col-span-2 p-12 border-r border-gray-100 overflow-y-auto space-y-12">
                    <section>
                        <h2 className="text-4xl font-black mb-8 tracking-tighter">Artisan Specifications</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="aspect-[3/4] bg-gray-50 rounded-3xl overflow-hidden shadow-xl">
                                <img src={order.reference_image_url || 'https://via.placeholder.com/600x800'} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div className="space-y-8">
                                <div>
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Body Measurements</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        {order.items?.[0]?.measurement_snapshot && Object.entries(order.items[0].measurement_snapshot).map(([key, val]: any) => (
                                            <div key={key} className="bg-gray-50 p-4 rounded-2xl">
                                                <span className="block text-[9px] uppercase font-bold text-gray-400 mb-1">{key.replace('_', ' ')}</span>
                                                <span className="font-black text-lg">{val}"</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-black text-white p-10 rounded-[40px] space-y-6 shadow-2xl">
                        <h3 className="text-xl font-black mb-4">Designer's Notes & Customization</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white/10 p-6 rounded-2xl">
                                <span className="block text-[10px] uppercase font-bold opacity-50 mb-1">Neck Tweak</span>
                                <span className="font-bold text-sm">Deep Sweetheart Pattern</span>
                            </div>
                            <div className="bg-white/10 p-6 rounded-2xl">
                                <span className="block text-[10px] uppercase font-bold opacity-50 mb-1">Sleeve Length</span>
                                <span className="font-bold text-sm">11" Elbow Length</span>
                            </div>
                            <div className="bg-white/10 p-6 rounded-2xl">
                                <span className="block text-[10px] uppercase font-bold opacity-50 mb-1">Add-ons</span>
                                <span className="font-bold text-sm">Pearl Tassels on Back</span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right: Messages / Chat */}
                <div className="bg-gray-50 flex flex-col h-full overflow-hidden">
                    <div className="p-8 border-b border-gray-100 bg-white">
                        <h3 className="text-sm font-black uppercase tracking-widest">Customer Liaison</h3>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 space-y-6">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex flex-col ${m.sender_id === order.designer_id ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[85%] p-5 rounded-3xl text-sm leading-relaxed ${m.sender_id === order.designer_id ? 'bg-purple-600 text-white rounded-tr-none shadow-lg' : 'bg-white text-black rounded-tl-none shadow-sm'}`}>
                                    {m.message_text}
                                </div>
                                <span className="text-[10px] text-gray-400 mt-2 font-bold">{m.sender_name} • {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        ))}
                    </div>

                    <div className="p-8 bg-white border-t border-gray-100">
                        <div className="relative group">
                            <input 
                                type="text" 
                                placeholder="Message customer..." 
                                className="w-full bg-gray-50 p-6 rounded-3xl pr-20 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all font-bold"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <button 
                                onClick={handleSendMessage}
                                className="absolute right-4 top-4 bg-purple-600 text-white p-3 rounded-2xl hover:bg-black transition-colors shadow-lg"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DesignerOrderDetail;
