import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useToast } from '../components/Toast';
import CONFIG from '../config';
import '../styles/Operational.css';

const DesignerPortal = () => {
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState('studio');
    const [uploadPreview, setUploadPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [myDesigns, setMyDesigns] = useState([]);

    useEffect(() => {
        const fetchMyDesigns = async () => {
            try {
                const res = await axios.get(`${CONFIG.API_URL}/designs`);
                setMyDesigns(res.data.slice(0, 4)); // Mocking just a few as "mine"
            } catch (err) {
                console.error("Fetch Error:", err);
            }
        };
        fetchMyDesigns();
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = {
            name: e.target['des-name'].value,
            category: e.target['des-cat'].value,
            price: e.target['des-price'].value,
            description: e.target['des-desc'].value,
            neck: [e.target['des-neck'].value],
            sleeve: [e.target['des-sleeve'].value],
            fabric: [e.target['des-fabric'].value],
            work_type: e.target['des-work'].value,
            props: e.target['des-props'].value.split(',').map(s => s.trim()),
            image: uploadPreview,
            status: 'Active'
        };

        try {
            await axios.post(`${CONFIG.API_URL}/designs`, formData);
            showToast("Design Published Successfully!", "success");
            e.target.reset();
            setUploadPreview(null);
            setActiveTab('portfolio');
        } catch (err) {
            showToast("Failed to publish design. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-dashboard">
            <Navbar />

            <header className="admin-header">
                <h2>Designer Studio Portal</h2>
                <div className="admin-tabs">
                    <button className={`admin-tab ${activeTab === 'studio' ? 'active' : ''}`} onClick={() => setActiveTab('studio')}>Studio Hub</button>
                    <button className={`admin-tab ${activeTab === 'upload' ? 'active' : ''}`} onClick={() => setActiveTab('upload')}>New Design</button>
                    <button className={`admin-tab ${activeTab === 'portfolio' ? 'active' : ''}`} onClick={() => setActiveTab('portfolio')}>My Portfolio</button>
                </div>
            </header>

            <main className="admin-content container">
                {activeTab === 'studio' && (
                    <div className="animate-me">
                        <section className="op-stats-grid">
                            <div className="op-stat-card primary">
                                <h4>Total Designs</h4>
                                <div className="op-stat-val">12</div>
                                <p style={{ fontSize: '0.75rem', color: '#666' }}>8 Active in Gallery</p>
                            </div>
                            <div className="op-stat-card success">
                                <h4>Order Hits</h4>
                                <div className="op-stat-val">156</div>
                                <p style={{ fontSize: '0.75rem', color: '#27AE60' }}>↑ 4 this week</p>
                            </div>
                            <div className="op-stat-card">
                                <h4>Trending Style</h4>
                                <div className="op-stat-val" style={{ fontSize: '1.2rem' }}>Royal Deep U</div>
                                <p style={{ fontSize: '0.75rem', color: '#666' }}>Most saved by users</p>
                            </div>
                        </section>

                        <div className="dash-card" style={{ padding: '32px', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✨</div>
                            <h3>Welcome back, Artisan!</h3>
                            <p style={{ maxWidth: '500px', margin: '12px auto', color: '#666' }}>
                                Your designs are currently reaching 15,000+ potential customers.
                                Keep uploading fresh styles to stay relevant in the trending section.
                            </p>
                            <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={() => setActiveTab('upload')}>Upload New Work</button>
                        </div>
                    </div>
                )}

                {activeTab === 'upload' && (
                    <div className="animate-me">
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
                                            <input type="file" id="des-file" hidden onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) setUploadPreview(URL.createObjectURL(file));
                                            }} />
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
                    </div>
                )}

                {activeTab === 'portfolio' && (
                    <div className="animate-me">
                        <div className="op-stats-grid">
                            {myDesigns.map(design => (
                                <div key={design.id} className="dash-card" style={{ padding: 0, overflow: 'hidden' }}>
                                    <div style={{ position: 'relative' }}>
                                        <img src={design.image} style={{ width: '100%', height: '200px', objectFit: 'cover' }} alt="" />
                                        <span className="status-pill active" style={{ position: 'absolute', top: '10px', right: '10px' }}>Active</span>
                                    </div>
                                    <div style={{ padding: '16px' }}>
                                        <h4 style={{ marginBottom: '8px' }}>{design.name}</h4>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>₹{design.price}</span>
                                            <button className="btn-text btn-sm" style={{ padding: 0 }}>Edit Details</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {myDesigns.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '60px' }}>
                                <p style={{ color: '#999' }}>No designs in your portfolio yet.</p>
                                <button className="btn btn-outline" onClick={() => setActiveTab('upload')}>Upload Your First Design</button>
                            </div>
                        )}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default DesignerPortal;
