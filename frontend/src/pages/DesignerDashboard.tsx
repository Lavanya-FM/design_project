import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CONFIG from '../config';

interface Order {
  id: string;
  status: string;
  customer_name: string;
  total_amount: number;
  created_at: string;
  items: any[];
}

const DesignerDashboard: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await axios.get(`${CONFIG.API_URL}/fulfillment/designer/orders`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
            });
            setOrders(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        try {
            await axios.patch(`${CONFIG.API_URL}/fulfillment/${orderId}/status`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
            });
            fetchOrders();
        } catch (err) {
            alert('Status update failed');
        }
    };

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'placed': return 'bg-blue-100 text-blue-700';
            case 'accepted': return 'bg-indigo-100 text-indigo-700';
            case 'stitching': return 'bg-yellow-100 text-yellow-700';
            case 'ready': return 'bg-green-100 text-green-700';
            case 'delivered': return 'bg-gray-100 text-gray-700';
            default: return 'bg-pink-50 text-pink-700';
        }
    };

    if (loading) return <div className="p-10 font-bold">Checking Artisan Workflow...</div>;

    return (
        <div className="min-h-screen bg-[#fafafa]">
            <header className="bg-white border-b border-gray-100 p-8">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Atelier Execution</h1>
                        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-1">Order Fulfillment & Craftsmanship</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-right">
                            <span className="text-[10px] font-black text-gray-400 uppercase block">Active Projects</span>
                            <span className="text-xl font-black">{orders.length}</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-8">
                <div className="grid grid-cols-1 gap-6">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                            <div className="space-y-4 flex-1">
                                <div className="flex items-center gap-3">
                                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                    <span className="text-gray-300">/</span>
                                    <span className="text-xs font-bold text-gray-400">ID: {order.id.slice(0, 8)}</span>
                                </div>
                                <h3 className="text-2xl font-black">Assignee: {order.customer_name}</h3>
                                <div className="flex flex-wrap gap-4">
                                    {order.items?.map((item: any, i: number) => (
                                        <div key={i} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl">
                                            <div className="w-8 h-10 bg-gray-200 rounded-md overflow-hidden">
                                                {item.reference_image_url && <img src={item.reference_image_url} className="w-full h-full object-cover" alt="" />}
                                            </div>
                                            <span className="text-xs font-bold">{item.customization_details?.neck || 'Pattern Item'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-6 w-full md:w-auto">
                                <div className="text-right">
                                    <span className="text-[10px] font-black text-gray-400 uppercase block tracking-widest">Order Value</span>
                                    <span className="text-2xl font-black">₹ {order.total_amount}</span>
                                </div>
                                
                                <div className="flex gap-2">
                                    {order.status === 'placed' && (
                                        <button 
                                            onClick={() => handleStatusUpdate(order.id, 'accepted')}
                                            className="bg-black text-white px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-purple-600 transition"
                                        >
                                            Accept Project
                                        </button>
                                    )}
                                    {order.status === 'accepted' && (
                                        <button 
                                            onClick={() => handleStatusUpdate(order.id, 'stitching')}
                                            className="bg-purple-600 text-white px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition"
                                        >
                                            Start Stitching
                                        </button>
                                    )}
                                    {order.status === 'stitching' && (
                                        <button 
                                            onClick={() => handleStatusUpdate(order.id, 'ready')}
                                            className="bg-green-600 text-white px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition"
                                        >
                                            Mark as Ready
                                        </button>
                                    )}
                                    <button 
                                        className="bg-white border border-gray-200 text-black px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:border-black transition"
                                        onClick={() => window.location.href = `/designer/orders/${order.id}`}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {orders.length === 0 && (
                        <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
                            <p className="text-gray-400 font-bold">No active artisan projects found.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DesignerDashboard;
