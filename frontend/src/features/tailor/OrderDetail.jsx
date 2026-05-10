import React from 'react';

const OrderDetail = ({
    selectedOrder,
    setSelectedOrder,
    STATUS_MAP,
    uploadPreview,
    setUploadPreview,
    updateNote,
    setUpdateNote,
    handleProgressUpload,
    handleStatusUpdate
}) => {
    return (
        <div className="order-detail-view">
            <button className="back-btn" onClick={() => setSelectedOrder(null)}>← Back to Orders</button>

            <div className="detail-header">
                <h1>Order #{selectedOrder.id}</h1>
                <span className="status-pill" style={{
                    background: STATUS_MAP[selectedOrder.status]?.bg,
                    color: STATUS_MAP[selectedOrder.status]?.color
                }}>
                    {STATUS_MAP[selectedOrder.status]?.label}
                </span>
            </div>

            <div className="detail-grid">
                {/* Design Reference */}
                <div className="detail-card design-ref-card">
                    <h3>📸 Design Reference</h3>
                    <img src={selectedOrder.image} alt="Design" className="ref-image" />
                    <h4>{selectedOrder.design}</h4>
                    <p>Customer: <strong>{selectedOrder.customer_name || selectedOrder.customer}</strong></p>
                </div>

                {/* Measurements */}
                <div className="detail-card">
                    <h3>📏 Measurements (Inches)</h3>
                    <div className="measurements-detail-grid">
                        {Object.entries(selectedOrder.measurements || {}).map(([key, val]) => (
                            <div key={key} className="m-detail-tile">
                                <span className="m-key">{key.replace(/([A-Z])/g, ' $1')}</span>
                                <span className="m-value">{val}"</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Customizations */}
                <div className="detail-card">
                    <h3>🎨 Customization Details</h3>
                    <div className="custom-detail-list">
                        {Object.entries(selectedOrder.customizations || {}).map(([key, val]) => (
                            <div key={key} className="custom-item">
                                <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                                <strong>{val}</strong>
                            </div>
                        ))}
                    </div>
                    <div className="fabric-info">
                        <span>Fabric:</span>
                        <strong>{selectedOrder.fabric}</strong>
                    </div>
                </div>

                {/* Special Instructions */}
                <div className="detail-card instructions-card">
                    <h3>📝 Special Instructions</h3>
                    <p>{selectedOrder.instructions || 'No special instructions.'}</p>
                </div>

                {/* Progress Tracker */}
                <div className="detail-card progress-card">
                    <h3>📊 Stitching Progress</h3>
                    <div className="progress-timeline">
                        {selectedOrder.progress?.map((step, i) => (
                            <div key={i} className={`timeline-step ${step.done ? 'completed' : ''}`}>
                                <div className="step-marker">{step.done ? '✓' : (i + 1)}</div>
                                <div className="step-content">
                                    <span className="step-name">{step.step}</span>
                                    {step.date && <span className="step-date">{step.date}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upload Progress */}
                <div className="detail-card upload-card">
                    <h3>📸 Upload Progress Photo</h3>
                    <p className="upload-desc">Share live stitching updates with the customer.</p>
                    <div className="upload-zone" onClick={() => document.getElementById('tailor-upload').click()}>
                        <input type="file" id="tailor-upload" hidden onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) setUploadPreview(URL.createObjectURL(file));
                        }} />
                        {uploadPreview ? (
                            <img src={uploadPreview} alt="Preview" className="upload-preview" />
                        ) : (
                            <div className="upload-placeholder">
                                <span>📷</span>
                                <p>Click to upload photo</p>
                            </div>
                        )}
                    </div>
                    <textarea
                        className="form-input update-note"
                        placeholder="Add a note for the customer (e.g., 'Front panels stitched, starting embroidery...')"
                        value={updateNote}
                        onChange={(e) => setUpdateNote(e.target.value)}
                    />
                    <button className="btn btn-primary btn-block" onClick={handleProgressUpload}>
                        📤 Send Update to Customer
                    </button>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="detail-actions">
                <button className="btn btn-primary" onClick={() => handleStatusUpdate(selectedOrder.id, 'Next Stage')}>
                    ✅ Mark Current Step Done
                </button>
                <button className="btn btn-outline" style={{ borderColor: '#E74C3C', color: '#E74C3C' }}>
                    ⚠️ Report Issue
                </button>
            </div>
        </div>
    );
};

export default OrderDetail;
