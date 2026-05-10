import React from 'react';
import axios from 'axios';
import CONFIG from '../../config';

const VendorRequests = ({ requests, setRequests }) => {
    const handleDispatch = async (orderId) => {
        try {
            await axios.post(`${CONFIG.API_URL}/fabrics/requests/${orderId}/dispatch`);
            alert(`Dispatched fabric for order #${orderId}`);
            // Refresh requests locally
            if (setRequests) {
                setRequests(prev => prev.map(r => r.orderId === orderId ? { ...r, status: 'dispatched' } : r));
            }
        } catch (err) {
            console.error("Dispatch failed:", err);
            alert("Dispatch failed.");
        }
    };

    return (
        <div className="vendor-content-section">
            <div className="section-top-bar">
                <div>
                    <h1>Material Requests</h1>
                    <p>Pending fabric dispatch requests from tailor stations</p>
                </div>
            </div>

            <div className="requests-table-wrap">
                <table className="vendor-table">
                    <thead>
                        <tr>
                            <th>Request ID</th>
                            <th>Order Ref</th>
                            <th>Fabric Required</th>
                            <th>Quantity</th>
                            <th>Destination</th>
                            <th>Urgency</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.length > 0 ? requests.map(req => (
                            <tr key={req.id}>
                                <td><strong>{req.id}</strong></td>
                                <td>#{req.orderId}</td>
                                <td>{req.fabric}</td>
                                <td>{req.qty}</td>
                                <td>{req.tailor}</td>
                                <td>
                                    <span className={`urgency-badge ${req.urgency}`}>
                                        {req.urgency === 'high' ? '🔴' : req.urgency === 'medium' ? '🟡' : '🟢'} {req.urgency}
                                    </span>
                                </td>
                                <td>
                                    <span className={`status-pill ${req.status}`}>
                                        {req.status === 'pending' ? 'Awaiting' : 'Dispatched'}
                                    </span>
                                </td>
                                <td>
                                    {req.status === 'pending' ? (
                                        <button className="btn btn-primary btn-sm" onClick={() => handleDispatch(req.orderId)}>
                                            📦 Dispatch
                                        </button>
                                    ) : (
                                        <span style={{ color: '#27AE60', fontWeight: 600, fontSize: '0.8rem' }}>✓ Sent</span>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="8" style={{textAlign: 'center', padding: '40px', color: '#999'}}>No pending material requests.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VendorRequests;
