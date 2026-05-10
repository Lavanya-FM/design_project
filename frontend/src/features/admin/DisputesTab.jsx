import React from 'react';

const DisputesTab = ({ alterations, handleAlteration }) => {
    return (
        <div className="animate-me">
            {alterations.map(alt => (
                <div key={alt.id} className="dispute-card">
                    <div className="dispute-meta">
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D02F44' }}>ALTERATION REQUEST</span>
                        <h3 style={{ margin: '8px 0' }}>Order #{alt.orderId}</h3>
                        <p style={{ fontSize: '0.88rem', color: '#666' }}>Customer: <strong>{alt.customer}</strong></p>
                        <p style={{ fontSize: '0.88rem', color: '#666' }}>Issue: {alt.type}</p>
                        <p style={{ fontSize: '0.82rem', marginTop: '12px', background: '#f8f8f8', padding: '12px', borderRadius: '8px', fontStyle: 'italic' }}>
                            "{alt.desc}"
                        </p>
                    </div>
                    <div className="dispute-content">
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <div style={{ flex: 1 }}>
                                <h4>Client Image Reference</h4>
                                <img src={alt.img} className="dispute-img" alt="Dispute" />
                            </div>
                            <div style={{ width: '240px', display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
                                <button className="btn btn-primary btn-block" onClick={() => handleAlteration(alt.id, 'approve')}>Approve Free Alteration</button>
                                <button className="btn btn-outline btn-block" onClick={() => handleAlteration(alt.id, 'reject')}>Discuss with Client</button>
                                <p style={{ fontSize: '0.72rem', color: '#999', textAlign: 'center' }}>
                                    Approved alterations trigger a merchant fabric request and tailor assignment.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DisputesTab;
