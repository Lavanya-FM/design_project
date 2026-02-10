import React, { useState } from 'react';
import Navbar from '../components/Navbar';
// Using Navbar from layout to demonstrate structure, but currently it's in components
// Let's adjust import to be consistent. Navbar is in components.
import '../styles/Consultation.css';

const Consultation = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        date: '',
        mode: 'virtual',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Booking Request Sent! (Simulation)');
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="consultation-page">
            <div className="consultation-bg"></div>
            <div className="consultation-card fade-in">
                <div className="consultation-header">
                    <h2>Book Your Bespoke Experience</h2>
                    <p>Meet with our master stylists to craft your perfect fit.</p>
                </div>

                <form onSubmit={handleSubmit} className="consultation-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                className="form-input"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-input"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Preferred Date</label>
                            <input
                                type="date"
                                className="form-input"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Consultation Mode</label>
                            <select
                                className="form-input"
                                name="mode"
                                value={formData.mode}
                                onChange={handleChange}
                            >
                                <option value="virtual">Virtual (Zoom/Meet)</option>
                                <option value="studio">In-Studio Visit</option>
                                <option value="home">Home Service (Premium)</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Tell us about your requirements</label>
                        <textarea
                            className="form-input"
                            rows="4"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="I'm looking for a bridal blouse with heavy embroidery..."
                        ></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block">
                        Confirm Booking Request
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Consultation;
