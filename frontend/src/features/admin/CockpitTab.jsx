import React from 'react';

const CockpitTab = ({ orders, liveStream }) => {
    return (
        <div className="animate-me">
            <section className="op-stats-grid">
                <div className="op-stat-card primary">
                    <h4>Today's Revenue</h4>
                    <div className="op-stat-val">₹42,500</div>
                    <p style={{ fontSize: '0.75rem', color: '#27AE60', marginTop: '4px' }}>↑ 12% from yesterday</p>
                </div>
                <div className="op-stat-card success">
                    <h4>Jobs in Stitching</h4>
                    <div className="op-stat-val">24</div>
                    <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '4px' }}>Across 8 tailors</p>
                </div>
                <div className="op-stat-card warning">
                    <h4>Pending Assignment</h4>
                    <div className="op-stat-val">5</div>
                    <p style={{ fontSize: '0.75rem', color: '#D02F44', marginTop: '4px' }}>Needs attention</p>
                </div>
                <div className="op-stat-card">
                    <h4>QC Ready</h4>
                    <div className="op-stat-val">8</div>
                    <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '4px' }}>Final verification</p>
                </div>
            </section>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' }}>
                <div className="admin-table-wrap">
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                        <h3 style={{ fontSize: '1rem' }}>Critical Deliveries (Next 48h)</h3>
                        <span style={{ fontSize: '0.8rem', color: '#D02F44' }}>5 Urgent</span>
                    </div>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order</th>
                                <th>Customer</th>
                                <th>Status</th>
                                <th>Deadline</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { id: 'FF-2401', user: 'Customer A.', status: 'Stitching', date: 'Tomorrow' },
                                { id: 'FF-2405', user: 'Sneha R.', status: 'Fabric Sourced', date: 'Feb 12' },
                                { id: 'FF-2398', user: 'Anjali M.', status: 'QC Pending', date: 'Today' },
                            ].map(o => (
                                <tr key={o.id}>
                                    <td><strong>#{o.id}</strong></td>
                                    <td>{o.user}</td>
                                    <td><span className={`status-pill ${o.status.toLowerCase().replace(' ', '-')}`}>{o.status}</span></td>
                                    <td>{o.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="dash-card" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>Live Engagement Stream</h3>
                    <div className="live-stream-items" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {liveStream.length === 0 && <p style={{ fontSize: '0.8rem', color: '#999', fontStyle: 'italic' }}>Waiting for user signals...</p>}
                        {liveStream.map(stream => (
                            <div key={stream.id} className="stream-item" style={{ borderLeft: '3px solid #D02F44', paddingLeft: '12px', background: '#fdfaf5', padding: '8px 12px', borderRadius: '4px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span style={{ fontSize: '0.65rem', fontWeight: 800 }}>{stream.time}</span>
                                    <span style={{ fontSize: '0.6rem', color: '#D02F44', fontWeight: 900 }}>TRENDING</span>
                                </div>
                                <p style={{ fontSize: '0.78rem', margin: 0, fontWeight: 600 }}>{stream.msg}</p>
                            </div>
                        ))}
                    </div>

                    <h3 style={{ fontSize: '1rem', margin: '32px 0 16px' }}>Network Status</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {[
                            { label: 'Tailor Studio', status: 'Online', color: '#27AE60' },
                            { label: 'Fabric Merchants', status: '8 Active', color: '#27AE60' },
                            { label: 'Payment Gateway', status: 'Operational', color: '#27AE60' },
                            { label: 'Delivery Partner', status: 'High Volume', color: '#F39C12' },
                        ].map((s, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{s.label}</span>
                                <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: `${s.color}15`, color: s.color, fontWeight: 700 }}>{s.status}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CockpitTab;
