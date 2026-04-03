import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CONFIG from '../config';

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await axios.get(`${CONFIG.API_URL}/fulfillment/admin/stats`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
            });
            setStats(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getTotalOrders = () => stats.reduce((acc, curr) => acc + parseInt(curr.count), 0);

    const getStatusPercentage = (count: string) => {
        const total = getTotalOrders();
        return total === 0 ? 0 : (parseInt(count) / total) * 100;
    };

    if (loading) return <div className="p-10 font-bold">Aggregating Studio Data...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-black text-white p-12">
                <div className="max-w-7xl mx-auto flex justify-between items-end">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-50 mb-2 block">Control Panel</span>
                        <h1 className="text-5xl font-black tracking-tighter">Studio Overview</h1>
                    </div>
                    <div className="text-right">
                        <span className="text-4xl font-black">{getTotalOrders()}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest block opacity-50">Total Projects</span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map(s => (
                        <div key={s.status} className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 flex flex-col justify-between h-64">
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{s.status}</h3>
                                <span className="text-5xl font-black">{s.count}</span>
                            </div>
                            <div className="space-y-2">
                                <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden">
                                    <div 
                                        className="bg-purple-600 h-full transition-all duration-1000" 
                                        style={{ width: `${getStatusPercentage(s.count)}%` }}
                                    ></div>
                                </div>
                                <span className="text-[10px] font-bold text-gray-400">{getStatusPercentage(s.count).toFixed(1)}% of total</span>
                            </div>
                        </div>
                    ))}
                </div>

                <section className="mt-24 bg-white rounded-[60px] p-16 shadow-2xl">
                    <h2 className="text-3xl font-black mb-12 tracking-tight">Active Monitoring</h2>
                    <div className="space-y-8">
                        {/* Static Monitoring Rules per Priority 8 */}
                        <div className="flex items-center justify-between p-8 bg-red-50 rounded-3xl border border-red-100">
                           <div className="flex items-center gap-6">
                               <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-black animate-pulse">!</div>
                               <div>
                                   <h4 className="font-black text-red-900">Potential Bottleneck: Stitching</h4>
                                   <p className="text-xs text-red-600 font-bold uppercase tracking-widest mt-1">3 orders stuck in production &gt; 48 hours</p>
                               </div>
                           </div>
                           <button className="bg-white text-red-600 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">Notify Designer</button>
                        </div>

                        <div className="flex items-center justify-between p-8 bg-green-50 rounded-3xl border border-green-100">
                           <div className="flex items-center gap-6">
                               <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-black">✓</div>
                               <div>
                                   <h4 className="font-black text-green-900">Logistics Healthy</h4>
                                   <p className="text-xs text-green-600 font-bold uppercase tracking-widest mt-1">12 orders successfully dispatched today</p>
                               </div>
                           </div>
                           <button className="bg-white text-green-600 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">View Manifest</button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AdminDashboard;
