import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isLanding = location.pathname === '/';
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    // Check user session
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const userRole = user?.role || 'guest';
    const isLoggedIn = !!user;

    const SUGGESTIONS = ['Deep back blouse', 'Boat neck', 'Wedding blouse', 'Puff sleeve', 'Silk blouse', 'Zardosi work'];

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/collections?search=${encodeURIComponent(searchQuery.trim())}`);
            setShowSuggestions(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
        window.location.reload();
    };

    const navbarClass = `navbar ${isLanding && !scrolled ? 'transparent' : 'solid'} ${menuOpen ? 'menu-open' : ''}`;

    // Helper to get role workspace path
    const getWorkspacePath = () => {
        switch (userRole) {
            case 'admin': return '/admin';
            case 'designer': return '/designer';
            case 'tailor': return '/tailor';
            case 'vendor': return '/vendor';
            case 'customer': return '/dashboard';
            default: return '/dashboard';
        }
    };

    return (
        <nav className={navbarClass}>
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <span className="logo-sparkle">✨</span>Fit & Flare<sup className="logo-studio">Studio</sup>
                </Link>

                {!isLanding && (
                    <div className="navbar-search">
                        <div className="search-input-wrapper" style={{ width: '100%', position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Search designs (e.g., boat neck, bridal)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                                onFocus={() => setShowSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            />
                        </div>
                        {showSuggestions && (
                            <div className="search-suggestions">
                                <p className="suggestion-label">Popular Searches</p>
                                {SUGGESTIONS.map(s => (
                                    <div key={s} className="suggestion-item" onClick={() => {
                                        setSearchQuery(s);
                                        navigate(`/collections?search=${encodeURIComponent(s)}`);
                                        setShowSuggestions(false);
                                    }}>
                                        <span>🔍</span> {s}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Hamburger for mobile */}
                <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
                    <span></span><span></span><span></span>
                </button>

                <div className={`navbar-nav-group ${menuOpen ? 'open' : ''}`}>
                    <div className="navbar-links">
                        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
                        <Link to="/collections" onClick={() => setMenuOpen(false)}>Styles</Link>
                        <Link to="/customizer" onClick={() => setMenuOpen(false)}>Design Studio</Link>

                        {/* Strictly Role-based workspace link */}
                        {isLoggedIn && (
                            <Link to={getWorkspacePath()} style={{ fontWeight: 700, color: 'var(--color-primary)' }} onClick={() => setMenuOpen(false)}>
                                {userRole === 'customer' ? 'My Layout' : 'Workspace'}
                            </Link>
                        )}
                    </div>

                    <div className="navbar-actions">
                        {isLoggedIn ? (
                            <div className="user-menu">
                                <span className="user-avatar" style={{ fontSize: '1.2rem' }}>
                                    {userRole === 'admin' ? '⚖️' : userRole === 'designer' ? '🎨' : userRole === 'tailor' ? '🪡' : userRole === 'vendor' ? '🧵' : '👤'}
                                </span>
                                <div className="user-info">
                                    <span className="user-name">{user.email?.split('@')[0] || 'Member'}</span>
                                    <span style={{ fontSize: '0.65rem', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#888' }}>{userRole}</span>
                                </div>
                                <button className="btn-logout" onClick={handleLogout} style={{ marginLeft: '15px' }}>Logout</button>
                            </div>
                        ) : (
                            <Link to="/auth/role-selection" className="btn pill" onClick={() => setMenuOpen(false)}>Login / Signup</Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
