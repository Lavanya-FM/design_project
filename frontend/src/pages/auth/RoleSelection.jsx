import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import '../../styles/Auth.css';

const ROLES = [
    {
        id: 'customer',
        title: 'Customer',
        icon: '👗',
        desc: 'Shop the latest designs, customize your blouse, and track your orders live.',
        path: '/auth/customer/login'
    },
    {
        id: 'designer',
        title: 'Designer',
        icon: '🎨',
        desc: 'Upload your latest craftsmanship, manage your portfolio, and track hits.',
        path: '/auth/designer/login'
    },
    {
        id: 'tailor',
        title: 'Master Tailor',
        icon: '🪡',
        desc: 'Access stitching jobs, view measurements, and update live progress.',
        path: '/auth/tailor/login'
    },
    {
        id: 'vendor',
        title: 'Fabric Vendor',
        icon: '🧵',
        desc: 'Manage your fabric inventory and supply to our master studios.',
        path: '/auth/vendor/login'
    },
    {
        id: 'admin',
        title: 'Platform Admin',
        icon: '⚖️',
        desc: 'Operational control, analytics cockpit, and dispute resolution hub.',
        path: '/auth/admin/login'
    }
];

const RoleSelection = () => {
    const navigate = useNavigate();

    return (
        <>
            <Navbar />
            <div className="auth-page">
                <div className="auth-container">
                    <header className="auth-header animate-me">
                        <h1>Login to Fit & Flare Studio</h1>
                        <p>Select your workspace to continue</p>
                    </header>

                    <div className="role-grid">
                        {ROLES.map((role, index) => (
                            <div
                                key={role.id}
                                className="role-card animate-me"
                                style={{ animationDelay: `${index * 0.1}s` }}
                                onClick={() => navigate(role.path)}
                            >
                                <span className="role-icon">{role.icon}</span>
                                <h3>{role.title}</h3>
                                <p>{role.desc}</p>
                                <button className="btn-role">Continue as {role.title}</button>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '60px', textAlign: 'center', color: '#999', fontSize: '0.85rem' }}>
                        <p>Not a member yet? Choose your role above to find the appropriate signup path.</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RoleSelection;
