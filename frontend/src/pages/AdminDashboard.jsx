import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CONFIG from '../config';
import Navbar from '../components/Navbar';
import { useToast } from '../components/Toast';
import '../styles/Operational.css';
import { useSocket } from '../components/SocketContext';

// Import newly split feature components
import CockpitTab from '../features/admin/CockpitTab';
import OrdersTab from '../features/admin/OrdersTab';
import TailorsTab from '../features/admin/TailorsTab';
import DisputesTab from '../features/admin/DisputesTab';
import GalleryTab from '../features/admin/GalleryTab';
import AiForecasterTab from '../features/admin/AiForecasterTab';
import AssignModal from '../features/admin/AssignModal';
import UploadDesignModal from '../features/admin/UploadDesignModal';

// --- MOCK DATA FOR DEMO ---
const TAILORS = [
    { id: 't1', name: 'Master Ramesh', specialty: 'Bridal', load: 85, jobs: 12 },
    { id: 't2', name: 'Master Sunil', specialty: 'Designer V-Neck', load: 40, jobs: 5 },
    { id: 't3', name: 'Master Anita', specialty: 'Embroidery', load: 10, jobs: 1 },
    { id: 't4', name: 'Master Jatin', specialty: 'Classic Cuts', load: 65, jobs: 9 },
];

const ALTERATIONS = [
    { id: 'alt_101', orderId: 'FF-2401', customer: 'Customer A', type: 'Fit Issue', desc: 'Sleeves are 0.5 inch too tight.', status: 'pending', date: ' Feb 08', img: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400' },
];

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const socket = useSocket();
    const [activeTab, setActiveTab] = useState('cockpit');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [designs, setDesigns] = useState([]);
    const [liveStream, setLiveStream] = useState([]);

    useEffect(() => {
        if (!socket) return;

        socket.emit('join_role', 'ADMIN');

        socket.on('admin_update', (data) => {
            console.log("Real-time Admin Ping:", data);
            showToast(`LIVE: ${data.payload.message}`, 'info');
            setLiveStream(prev => [{
                id: Date.now(),
                time: new Date().toLocaleTimeString(),
                msg: data.payload.message
            }, ...prev].slice(0, 5));
        });

        return () => {
            socket.off('admin_update');
        };
    }, [socket]);

    // UI States
    const [selectedTailor, setSelectedTailor] = useState(null);
    const [assignModal, setAssignModal] = useState(null); // stores orderId

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ordersRes, designsRes] = await Promise.all([
                    axios.get(`${CONFIG.API_URL}/orders`).catch(() => ({ data: [] })),
                    axios.get(`${CONFIG.API_URL}/designs`).catch(() => ({ data: [] }))
                ]);
                setOrders(ordersRes.data);

                // Sanitize incoming admin designs
                const backendBase = CONFIG.API_URL.replace('/api', '');
                const safeDesigns = designsRes.data.map(d => {
                    let safeImage = d.image || d.image_url || '';
                    if (safeImage.startsWith('/static/uploads/')) {
                        safeImage = `${backendBase}${safeImage}`;
                    } else if (safeImage.includes('unsplash')) {
                        safeImage = '/bridal_hero.png';
                    }
                    return { ...d, image: safeImage || '/classic_embroidery.png' };
                });
                setDesigns(safeDesigns);
            } catch (err) {
                console.error("Admin fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleAssign = (orderId, tailorId) => {
        showToast(`Order ${orderId} assigned to ${TAILORS.find(t => t.id === tailorId).name}`, 'success');
        setAssignModal(null);
    };

    const handleAlteration = (id, action) => {
        showToast(`Alteration ${id} ${action === 'approve' ? 'Approved' : 'Rejected'}`, action === 'approve' ? 'success' : 'info');
    };

    // Design Management State
    const [designModal, setDesignModal] = useState(false);
    const [newDesign, setNewDesign] = useState({
        name: '', category: 'Bridal', price: 4500, image_url: '/modern_blouse.png',
        neck: 'Deep U', sleeve: 'Short Sleeves', back_design: 'Tied Dori', fabric: 'Silk',
        color: '#0A192F', border: 'Zari Border', work_type: 'Plain', tassels: 'None'
    });

    const [uploadedImages, setUploadedImages] = useState([
        { preview: '', tag: 'Front View' }
    ]);

    const handleImageUpload = async (e, index) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Let's integrate the proper upload logic instead of base64
        const formData = new FormData();
        formData.append('image', file);
        formData.append('folder', 'designs');

        try {
            const res = await axios.post(`${CONFIG.API_URL}/upload/single`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const newArr = [...uploadedImages];
            newArr[index].preview = res.data.url;
            setUploadedImages(newArr);
        } catch (err) {
            console.error(err);
            showToast('Failed to upload image', 'error');
        }
    };

    const addUploadSlot = () => setUploadedImages([...uploadedImages, { preview: '', tag: 'Sleeve / Side' }]);
    const removeUploadSlot = (index) => setUploadedImages(uploadedImages.filter((_, i) => i !== index));

    const [aiSurge, setAiSurge] = useState(false);

    const handleAddDesign = async () => {
        if (!newDesign.name) return showToast('Please provide a Design Name', 'error');
        if (!uploadedImages[0]?.preview) return showToast('You must upload at least one Front View image.', 'warning');
        try {
            const mainImg = uploadedImages[0].preview;
            const payload = {
                title: newDesign.name,
                category: newDesign.category,
                price: Number(newDesign.price),
                image: mainImg,
                neck_type: newDesign.neck,
                sleeve_type: newDesign.sleeve,
                fabric: newDesign.fabric,
                work_type: newDesign.work_type,
                tags: ['new-arrival', newDesign.category.toLowerCase(), newDesign.color, newDesign.border, newDesign.back_design, newDesign.tassels, JSON.stringify(uploadedImages.map(u => ({ url: u.preview, tag: u.tag })))]
            };

            const res = await axios.post(`${CONFIG.API_URL}/designs`, payload);
            if (res.data) {
                const backendBase = CONFIG.API_URL.replace('/api', '');
                let finalImg = res.data.image || mainImg;
                if (finalImg.startsWith('/static/uploads/')) finalImg = `${backendBase}${finalImg}`;

                const publishedDesign = {
                    ...res.data,
                    image: finalImg,
                    name: newDesign.name,
                    category: newDesign.category,
                    price: Number(newDesign.price)
                };
                setDesigns([publishedDesign, ...designs]);
                showToast('Brand New Design Published to Collections!', 'success');
                setDesignModal(false);
                setNewDesign({
                    name: '', category: 'Bridal', price: 4500, image_url: '/modern_blouse.png',
                    neck: 'Deep U', sleeve: 'Short Sleeves', back_design: 'Tied Dori', fabric: 'Silk',
                    color: '#0A192F', border: 'Zari Border', work_type: 'Plain', tassels: 'None'
                });
                setUploadedImages([{ preview: '', tag: 'Front View' }]);
            }
        } catch (err) {
            showToast('Failed to deploy design to production.', 'error');
        }
    };

    return (
        <div className="admin-dashboard">
            <Navbar />

            <header className="admin-header">
                <h2>Fit & Flare Operations Control</h2>
                <div className="admin-tabs">
                    <button className={`admin-tab ${activeTab === 'cockpit' ? 'active' : ''}`} onClick={() => setActiveTab('cockpit')}>Cockpit</button>
                    <button className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>Order Manager</button>
                    <button className={`admin-tab ${activeTab === 'tailors' ? 'active' : ''}`} onClick={() => setActiveTab('tailors')}>Tailor Hub</button>
                    <button className={`admin-tab ${activeTab === 'disputes' ? 'active' : ''}`} onClick={() => setActiveTab('disputes')}>Alterations</button>
                    <button className={`admin-tab ${activeTab === 'gallery' ? 'active' : ''}`} onClick={() => setActiveTab('gallery')}>Design Studio</button>
                    <button className={`admin-tab ${activeTab === 'ai' ? 'active' : ''}`} onClick={() => setActiveTab('ai')}>AI Forecaster ✨</button>
                </div>
            </header>

            <main className="admin-content container">
                {activeTab === 'cockpit' && <CockpitTab orders={orders} liveStream={liveStream} />}
                {activeTab === 'orders' && <OrdersTab orders={orders} setAssignModal={setAssignModal} />}
                {activeTab === 'tailors' && <TailorsTab tailors={TAILORS} />}
                {activeTab === 'disputes' && <DisputesTab alterations={ALTERATIONS} handleAlteration={handleAlteration} />}
                {activeTab === 'gallery' && <GalleryTab designs={designs} setDesignModal={setDesignModal} />}
                {activeTab === 'ai' && <AiForecasterTab aiSurge={aiSurge} setAiSurge={setAiSurge} />}
            </main>

            <AssignModal assignModal={assignModal} setAssignModal={setAssignModal} tailors={TAILORS} handleAssign={handleAssign} />
            
            <UploadDesignModal 
                designModal={designModal} setDesignModal={setDesignModal}
                newDesign={newDesign} setNewDesign={setNewDesign}
                uploadedImages={uploadedImages} setUploadedImages={setUploadedImages}
                handleImageUpload={handleImageUpload} addUploadSlot={addUploadSlot} removeUploadSlot={removeUploadSlot}
                handleAddDesign={handleAddDesign}
            />
        </div>
    );
};

export default AdminDashboard;
