import React from 'react';

const CompareModal = ({ compareTarget, setCompareTarget, config, totalPrice }) => {
    if (!compareTarget) return null;

    return (
        <div className="compare-modal-overlay" onClick={() => setCompareTarget(null)}>
            <div className="compare-modal-content" onClick={e => e.stopPropagation()}>
                <header className="compare-modal-header">
                    <h2>Expert Style Comparison</h2>
                    <button className="close-modal" onClick={() => setCompareTarget(null)}>✕</button>
                </header>
                <div className="compare-table-container">
                    <table className="compare-table">
                        <thead>
                            <tr>
                                <th>Attribute</th>
                                <th>Current Customization</th>
                                <th>{compareTarget.title}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Neck Line</td>
                                <td>{config['Neck Design']}</td>
                                <td>{compareTarget.neck_type}</td>
                            </tr>
                            <tr>
                                <td>Sleeve Style</td>
                                <td>{config['Sleeve Style']}</td>
                                <td>{compareTarget.sleeve_type}</td>
                            </tr>
                            <tr>
                                <td>Fabric</td>
                                <td>{config['Fabric Material']}</td>
                                <td>{compareTarget.fabric}</td>
                            </tr>
                            <tr>
                                <td>Estimate</td>
                                <td>₹{totalPrice}</td>
                                <td>₹{compareTarget.price}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CompareModal;
