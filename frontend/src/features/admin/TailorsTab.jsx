import React from 'react';

const TailorsTab = ({ tailors }) => {
    return (
        <div className="animate-me">
            <div className="tailor-list-card">
                {tailors.map(tailor => (
                    <div key={tailor.id} className="tailor-item">
                        <div className="tailor-avatar">{tailor.name.charAt(0)}</div>
                        <div className="tailor-info">
                            <h4>{tailor.name}</h4>
                            <p>{tailor.specialty} Specialist • {tailor.jobs} Active Jobs</p>
                        </div>
                        <div className="tailor-load">
                            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{tailor.load}% Capacity</span>
                            <div className="load-bar-wrap">
                                <div className="load-bar-fill" style={{ width: `${tailor.load}%`, background: tailor.load > 80 ? '#D02F44' : '#27AE60' }}></div>
                            </div>
                        </div>
                        <button className="btn btn-outline btn-sm">View Jobs</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TailorsTab;
