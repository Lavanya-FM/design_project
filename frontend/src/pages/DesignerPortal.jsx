import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useToast } from '../components/Toast';
import CONFIG from '../config';
import DesignerStats from '../features/designer/DesignerStats';
import DesignerUploadForm from '../features/designer/DesignerUploadForm';
import DesignerPortfolio from '../features/designer/DesignerPortfolio';
import '../styles/Operational.css';

const DesignerPortal = () => {
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState('studio');
    const [uploadPreview, setUploadPreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [myDesigns, setMyDesigns] = useState([]);

    const fetchMyDesigns = async () => {
        try {
            const res = await axios.get(`${CONFIG.API_URL}/designs`);
            setMyDesigns(Array.isArray(res.data) ? res.data : (res.data.designs || []));
        } catch (err) {
            console.error("Fetch Error:", err);
        }
    };

    useEffect(() => {
        fetchMyDesigns();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadPreview(URL.createObjectURL(file));
            setSelectedFile(file);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            showToast("Please upload a design image", "error");
            return;
        }
        setLoading(true);

        try {
            // 1. Upload Image
            const formDataImage = new FormData();
            formDataImage.append('image', selectedFile);
            formDataImage.append('folder', 'designs');
            
            const uploadRes = await axios.post(`${CONFIG.API_URL}/upload/single`, formDataImage, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            const imageUrl = uploadRes.data.url;

            // 2. Submit Design Details
            const formData = {
                name: e.target['des-name'].value,
                category: e.target['des-cat'].value,
                price: e.target['des-price'].value,
                description: e.target['des-desc'].value,
                neck: [e.target['des-neck'].value],
                sleeve: [e.target['des-sleeve'].value],
                fabric: [e.target['des-fabric'].value],
                work_type: e.target['des-work'].value,
                tags: [e.target['des-cat'].value.toLowerCase(), e.target['des-work'].value.toLowerCase()],
                props: e.target['des-props'].value.split(',').map(s => s.trim()),
                image: imageUrl,
                status: 'Active'
            };

            await axios.post(`${CONFIG.API_URL}/designs`, formData);
            showToast("Design Published Successfully!", "success");
            e.target.reset();
            setUploadPreview(null);
            setSelectedFile(null);
            fetchMyDesigns();
            setActiveTab('portfolio');
        } catch (err) {
            showToast("Failed to publish design. Please try again.", "error");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getFullImageUrl = (url) => {
        if (!url) return 'https://via.placeholder.com/400x500?text=No+Image';
        if (url.startsWith('http')) return url;
        const cleanUrl = url.startsWith('/') ? url : `/${url}`;
        return `${CONFIG.API_URL.replace('/api', '')}${cleanUrl}`;
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
                        <DesignerStats designCount={myDesigns.length} />

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
                        <DesignerUploadForm 
                            loading={loading}
                            uploadPreview={uploadPreview}
                            handleFileChange={handleFileChange}
                            handleUpload={handleUpload}
                        />
                    </div>
                )}

                {activeTab === 'portfolio' && (
                    <DesignerPortfolio 
                        designs={myDesigns}
                        getFullImageUrl={getFullImageUrl}
                        setActiveTab={setActiveTab}
                    />
                )}
            </main>
            <Footer />
        </div>
    );
};

export default DesignerPortal;
