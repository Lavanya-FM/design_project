import React from 'react';
import axios from 'axios';
import CONFIG from '../../config';
import { useToast } from '../../components/Toast';

const VendorAddFabricModal = ({ setShowAddFabric, setFabrics }) => {
    const { showToast } = useToast();

    const handleAddFabric = async (e) => {
        e.preventDefault();
        const formData = {
            name: e.target.name.value,
            materialType: e.target.type.value,
            color: e.target.color.value,
            stockQuantity: e.target.stock.value,
            pricePerMeter: e.target.price.value,
            imageUrl: e.target.imageUrl.value,
            merchantId: 'VENDOR-001'
        };
        try {
            await axios.post(`${CONFIG.API_URL}/fabrics`, formData);
            showToast('Fabric added successfully!', 'success');
            setShowAddFabric(false);
            const res = await axios.get(`${CONFIG.API_URL}/fabrics`);
            setFabrics(res.data);
        } catch (err) {
            console.error(err);
            showToast('Failed to add fabric', 'error');
        }
    };

    return (
        <div className="modal-overlay" onClick={() => setShowAddFabric(false)}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Add New Fabric</h3>
                    <button className="modal-close" onClick={() => setShowAddFabric(false)}>×</button>
                </div>
                <form onSubmit={handleAddFabric}>
                    <div className="modal-body">
                        <div className="modal-form-grid">
                            <div className="form-group">
                                <label>Fabric Name</label>
                                <input type="text" name="name" className="form-input" placeholder="e.g. Royal Tussar Silk" required />
                            </div>
                            <div className="form-group">
                                <label>Material Type</label>
                                <select name="type" className="form-input" required>
                                    <option>Raw Silk</option>
                                    <option>Velvet</option>
                                    <option>Cotton Silk</option>
                                    <option>Net/Lace</option>
                                    <option>Brocade</option>
                                    <option>Georgette</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Color</label>
                                <input type="text" name="color" className="form-input" placeholder="e.g. Dusty Rose" required />
                            </div>
                            <div className="form-group">
                                <label>Stock (meters)</label>
                                <input type="number" name="stock" className="form-input" placeholder="50" required />
                            </div>
                            <div className="form-group">
                                <label>Price per Meter (₹)</label>
                                <input type="number" name="price" className="form-input" placeholder="850" required />
                            </div>
                            <div className="form-group">
                                <label>Image URL</label>
                                <input type="text" name="imageUrl" className="form-input" placeholder="https://..." required />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline" onClick={() => setShowAddFabric(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Add Fabric</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VendorAddFabricModal;
