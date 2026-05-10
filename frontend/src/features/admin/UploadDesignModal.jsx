import React from 'react';

const UploadDesignModal = ({
    designModal, setDesignModal,
    newDesign, setNewDesign,
    uploadedImages, setUploadedImages, handleImageUpload, addUploadSlot, removeUploadSlot,
    handleAddDesign
}) => {
    if (!designModal) return null;
    return (
        <div className="modal-overlay" onClick={() => setDesignModal(false)}>
            <div className="modal-card" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Upload New Atelier Design</h3>
                    <button className="modal-close" onClick={() => setDesignModal(false)}>×</button>
                </div>
                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Configure proper property tagging so the new garment appears natively in the customer Collections filters.</p>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>GARMENT NAME</label>
                        <input type="text" className="form-control" placeholder="e.g. Royal Sovereign V-Neck" value={newDesign.name} onChange={e => setNewDesign({ ...newDesign, name: e.target.value })} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>MASTER CATEGORY</label>
                            <select className="form-control" value={newDesign.category} onChange={e => setNewDesign({ ...newDesign, category: e.target.value })}>
                                <option>Bridal</option>
                                <option>Reception</option>
                                <option>Festive</option>
                                <option>Cocktail</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>BASE PRICE (₹)</label>
                            <input type="number" className="form-control" value={newDesign.price} onChange={e => setNewDesign({ ...newDesign, price: e.target.value })} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>NECK STRUCTURE</label>
                            <select className="form-control" value={newDesign.neck} onChange={e => setNewDesign({ ...newDesign, neck: e.target.value })}>
                                <option>Deep U</option><option>Sweetheart</option><option>Boat Neck</option><option>High Neck</option><option>Halter Neck</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>SLEEVE STYLE</label>
                            <select className="form-control" value={newDesign.sleeve} onChange={e => setNewDesign({ ...newDesign, sleeve: e.target.value })}>
                                <option>Sleeveless</option><option>Short Sleeves</option><option>Elbow Length</option><option>Full Sleeves</option><option>Puff Sleeves</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>BACK DESIGN</label>
                            <select className="form-control" value={newDesign.back_design} onChange={e => setNewDesign({ ...newDesign, back_design: e.target.value })}>
                                <option>Tied Dori</option><option>Sheer Net</option><option>Deep U</option><option>Square</option><option>Keyhole</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>FABRIC MATERIAL</label>
                            <select className="form-control" value={newDesign.fabric} onChange={e => setNewDesign({ ...newDesign, fabric: e.target.value })}>
                                <option>Silk</option><option>Velvet</option><option>Brocade</option><option>Net/Lace</option><option>Organza</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>BORDERS & EDGES</label>
                            <select className="form-control" value={newDesign.border} onChange={e => setNewDesign({ ...newDesign, border: e.target.value })}>
                                <option>Plain Border</option><option>Zari Border</option><option>Temple Border</option><option>Cutwork</option><option>Pearl Scallop</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>TASSELS & EXTRAS</label>
                            <select className="form-control" value={newDesign.tassels} onChange={e => setNewDesign({ ...newDesign, tassels: e.target.value })}>
                                <option>None</option><option>Standard Latkans</option><option>Heavy Pearls</option><option>Thread Tassels</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>EMBROIDERY / WORK TYPE</label>
                            <select className="form-control" value={newDesign.work_type} onChange={e => setNewDesign({ ...newDesign, work_type: e.target.value })}>
                                <option>Zari Work</option><option>Aari Embroidery</option><option>Maggam Work</option><option>Mirror Work</option><option>Plain</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>PRIMARY COLOR HEX</label>
                            <input type="text" className="form-control" placeholder="e.g. #0A192F" value={newDesign.color} onChange={e => setNewDesign({ ...newDesign, color: e.target.value })} />
                        </div>
                    </div>

                    <div style={{ padding: '16px', border: '1px dashed #C5A059', borderRadius: '4px', background: '#fdfbf7' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#C5A059' }}>MULTI-ANGLE IMAGE UPLOADS</label>
                            <button className="btn btn-outline btn-sm" style={{ padding: '4px 8px', fontSize: '0.7rem' }} onClick={addUploadSlot}>+ Add Angle</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {uploadedImages.map((imgObj, index) => (
                                <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'center', background: '#fff', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '2px' }}>
                                    {imgObj.preview ? (
                                        <img src={imgObj.preview} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '2px', border: '1px solid #e2e8f0' }} alt="Preview" />
                                    ) : (
                                        <div style={{ width: '50px', height: '50px', background: '#f1f5f9', border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: '#94a3b8' }}>No Img</div>
                                    )}

                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={e => handleImageUpload(e, index)}
                                            style={{ fontSize: '0.75rem' }}
                                        />
                                        <select
                                            className="form-control"
                                            style={{ padding: '4px', fontSize: '0.75rem', height: 'auto' }}
                                            value={imgObj.tag}
                                            onChange={e => {
                                                const newArr = [...uploadedImages];
                                                newArr[index].tag = e.target.value;
                                                setUploadedImages(newArr);
                                            }}
                                        >
                                            <option>Front View</option>
                                            <option>Sleeve / Side</option>
                                            <option>Back Design</option>
                                            <option>Close-up Work</option>
                                        </select>
                                    </div>

                                    {index > 0 && (
                                        <button style={{ background: 'none', border: 'none', color: '#D02F44', cursor: 'pointer', fontSize: '1rem' }} onClick={() => removeUploadSlot(index)}>×</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <button className="btn btn-primary btn-block" style={{ marginTop: '10px', padding: '16px', letterSpacing: '1px' }} onClick={handleAddDesign}>
                        PUBLISH MULTI-ANGLE DESIGN
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadDesignModal;
