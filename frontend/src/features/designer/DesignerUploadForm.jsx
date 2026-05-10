import React from 'react';

const DesignerUploadForm = ({ loading, uploadPreview, handleFileChange, handleUpload }) => {
    return (
        <div className="dash-card" style={{ padding: '40px' }}>
            <form onSubmit={handleUpload}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div className="form-group">
                        <label className="form-label">Design Name</label>
                        <input type="text" name="des-name" className="form-input" placeholder="e.g. Royal Bridal V-Neck" required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Occasion Category</label>
                        <select name="des-cat" className="form-input">
                            <option>Bridal</option>
                            <option>Party</option>
                            <option>Workwear</option>
                            <option>Everyday</option>
                        </select>
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label className="form-label">Primary Craft/Work</label>
                        <input type="text" name="des-work" className="form-input" placeholder="e.g. Hand Zardosi, Stone Work" required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Ideal Fabric</label>
                        <select name="des-fabric" className="form-input">
                            <option>Raw Silk</option>
                            <option>Velvet</option>
                            <option>Organza</option>
                            <option>Brocade</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Base Price (₹)</label>
                        <input type="number" name="des-price" className="form-input" placeholder="2500" required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Neck Styling</label>
                        <select name="des-neck" className="form-input">
                            <option>Deep U</option>
                            <option>V Neck</option>
                            <option>Sweetheart</option>
                            <option>Boat Neck</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Sleeve Detail</label>
                        <select name="des-sleeve" className="form-input">
                            <option>Sleeveless</option>
                            <option>Short Sleeves</option>
                            <option>Elbow Length</option>
                            <option>Full Sleeves</option>
                        </select>
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label className="form-label">Included Props (e.g. Latkans, Beads)</label>
                        <input type="text" name="des-props" className="form-input" placeholder="Comma separated list" />
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label className="form-label">Design Inspiration & Details</label>
                        <textarea name="des-desc" className="form-input" rows="4"></textarea>
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label className="form-label">High-Res Design Photo</label>
                        <div className="upload-zone" style={{ minHeight: '200px' }} onClick={() => document.getElementById('des-file').click()}>
                            <input type="file" id="des-file" hidden onChange={handleFileChange} accept="image/*" />
                            {uploadPreview ? (
                                <img src={uploadPreview} style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', borderRadius: '12px' }} />
                            ) : (
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '2.5rem' }}>📸</div>
                                    <p>Click to upload design image</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '30px', padding: '18px' }} disabled={loading}>
                    {loading ? 'Publishing Design...' : '✨ Publish to Global Gallery'}
                </button>
            </form>
        </div>
    );
};

export default DesignerUploadForm;
