import React from 'react';

const AiForecasterTab = ({ aiSurge, setAiSurge }) => {
    return (
        <div className="animate-me">
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
                <div className="dash-card">
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#0A192F' }}>Atelier Trend Predictor AI</h3>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '24px' }}>Machine learning analysis based on last 10,000 customer interactions.</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ padding: '16px', borderLeft: '4px solid #C5A059', background: '#f8fafc' }}>
                            <h4 style={{ margin: 0, color: '#C5A059' }}>Upcoming Surge: Velvet Fabric</h4>
                            <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#334155' }}>Search volume for "Velvet Blouse" is up 42%. Recommend stocking up on Velvet inventory for Master Ramesh.</p>
                        </div>
                        <div style={{ padding: '16px', borderLeft: '4px solid #27AE60', background: '#f8fafc' }}>
                            <h4 style={{ margin: 0, color: '#27AE60' }}>Optimized: Sweetheart Necklines</h4>
                            <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#334155' }}>Currently converting at the highest rate (28%). Consider highlighting these in the main gallery.</p>
                        </div>
                        <div style={{ padding: '16px', borderLeft: '4px solid #D02F44', background: '#f8fafc' }}>
                            <h4 style={{ margin: 0, color: '#D02F44' }}>Warning: Tailor Bottleneck Detected</h4>
                            <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#334155' }}>Bridal specialties are nearing 90% capacity. AI suggests shifting non-urgent bridal work to Master Jatin.</p>
                        </div>
                    </div>
                </div>

                <div className="dash-card">
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#0A192F' }}>Dynamic Pricing Engine</h3>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '24px' }}>Automatically adjust base base customizer prices based on current studio demand.</p>

                    <div style={{ padding: '24px', background: aiSurge ? '#0A192F' : '#f1f5f9', color: aiSurge ? 'white' : '#0A192F', borderRadius: '4px', textAlign: 'center', transition: 'all 0.3s' }}>
                        <h4 style={{ fontSize: '1.5rem', margin: '0 0 10px 0' }}>{aiSurge ? 'Surge Active (+15%)' : 'Standard Pricing'}</h4>
                        <p style={{ fontSize: '0.8rem', margin: '0 0 20px 0', opacity: 0.8 }}>Tailor load is at 85%. AI recommends activating surge pricing to manage demand.</p>
                        <button
                            onClick={() => setAiSurge(!aiSurge)}
                            style={{ background: aiSurge ? '#C5A059' : '#0A192F', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '2px', cursor: 'pointer', fontWeight: 700 }}
                        >
                            {aiSurge ? 'DEACTIVATE SURGE' : 'ACTIVATE SURGE PRICING'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AiForecasterTab;
