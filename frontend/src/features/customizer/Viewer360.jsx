import React, { useState } from 'react';

const Viewer360 = ({ mainDisplayImage, uploadedAngles, angleLabels, basePrice }) => {
    const [angleIndex, setAngleIndex] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [lastX, setLastX] = useState(0);

    const angles = uploadedAngles.length > 0 
        ? uploadedAngles.map(a => a.path)
        : [
            mainDisplayImage, 
            '/classic_embroidery.png', 
            '/bridal_hero.png', 
            '/modern_blouse.png' 
        ];

    const currentLabels = uploadedAngles.length > 0 
        ? uploadedAngles.map(a => a.tag)
        : angleLabels;

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setLastX(e.clientX);
    };

    const handleMouseMoveDrag = (e) => {
        if (!isDragging) return;
        const delta = e.clientX - lastX;
        
        if (Math.abs(delta) > 40) {
            if (delta > 0) {
                setAngleIndex(prev => (prev + 1) % angles.length);
            } else {
                setAngleIndex(prev => (prev - 1 + angles.length) % angles.length);
            }
            setLastX(e.clientX);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <div className="preview-container">
            <div className="preview-card">
                <div className="preview-label">Live True 360° Studio</div>
                
                <div 
                    className="interactive-3d-viewer"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMoveDrag}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    style={{ 
                        cursor: isDragging ? 'grabbing' : 'grab',
                        overflow: 'hidden',
                        position: 'relative'
                    }}
                >
                    <div className="viewer-hint">↔ Drag to Spin 360° | {currentLabels[angleIndex]}</div>
                    
                    <img 
                        key={angleIndex} 
                        src={angles[angleIndex]}
                        alt="Blouse Render Angle"
                        className="customizer-target-img fade-in-angle"
                        draggable="false"
                        style={{
                            transform: `scale(${zoom})`,
                            transition: 'transform 0.1s ease-out'
                        }}
                    />
                    
                    <div style={{ position: 'absolute', bottom: '15px', display: 'flex', gap: '8px' }}>
                        {angles.map((_, i) => (
                            <div key={i} style={{
                                width: '8px', height: '8px', borderRadius: '50%',
                                background: i === angleIndex ? '#0A192F' : '#cbd5e1',
                                border: i === angleIndex ? '2px solid #C5A059' : 'none'
                            }}/>
                        ))}
                    </div>
                </div>

                <div className="zoom-controls">
                    <span className="zoom-label">Zoom Level</span>
                    <input 
                        type="range" 
                        className="zoom-slider"
                        min="1" 
                        max="3" 
                        step="0.1" 
                        value={zoom} 
                        onChange={(e) => setZoom(e.target.value)} 
                    />
                </div>

                <div className="preview-meta" style={{marginTop: '15px'}}>
                    <span style={{color: '#C5A059', fontWeight: 800}}>Base Fitting: ₹{basePrice}</span>
                </div>
            </div>
        </div>
    );
};

export default Viewer360;
