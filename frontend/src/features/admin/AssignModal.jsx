import React from 'react';

const AssignModal = ({ assignModal, setAssignModal, tailors, handleAssign }) => {
    if (!assignModal) return null;
    return (
        <div className="modal-overlay" onClick={() => setAssignModal(null)}>
            <div className="modal-card" style={{ maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Assign Tailor for #{assignModal}</h3>
                    <button className="modal-close" onClick={() => setAssignModal(null)}>×</button>
                </div>
                <div className="modal-body">
                    <p style={{ marginBottom: '20px', fontSize: '0.9rem' }}>Select a master tailor to handle this custom stitching job.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {tailors.map(t => (
                            <div
                                key={t.id}
                                className="selection-card"
                                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                onClick={() => handleAssign(assignModal, t.id)}
                            >
                                <div style={{ textAlign: 'left' }}>
                                    <h4 style={{ margin: 0 }}>{t.name}</h4>
                                    <span style={{ fontSize: '0.75rem', color: '#666' }}>{t.specialty} • {t.load}% Load</span>
                                </div>
                                <button className="btn btn-primary btn-sm">Select</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignModal;
