import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { designAPI, Blouse } from '../services/api';
import CONFIG from '../config';
import '../styles/Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [trending, setTrending] = React.useState<Blouse[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadTrending();
  }, []);

  const loadTrending = async () => {
    try {
      const data = await designAPI.getTrendingDesigns();
      setTrending(data);
    } catch (err) {
      console.error(err);
    }
  };

  const getImageUrl = (images: any) => {
    const url = Array.isArray(images) && images.length > 0 ? images[0] : (typeof images === 'string' && images.startsWith('[') ? JSON.parse(images)[0] : images);
    if (!url || typeof url !== 'string') return 'https://via.placeholder.com/400x500';
    if (url.startsWith('http')) return url;
    return `${CONFIG.API_URL.replace('/api', '')}${url}`;
  };

  return (
    <div className="landing-wrapper">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-video-bg"></div>
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="hero-content animate-me">
            <span className="hero-badge">Exquisite Tailoring</span>
            <h1>Where Tradition Meets Contemporary Elegance</h1>
            <p>
              Bespoke blouse designs that celebrate your unique style. From heritage
              hand-woven silks to modern minimalist cuts, each piece is crafted
              with precision and passion.
            </p>
            <div className="hero-actions">
              <Link to="/collections" className="btn-hero-primary">Explore Collections</Link>
              <Link to="/auth/role-selection" className="btn-hero-outline">Book Consultation</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Styles Section */}
      <section id="signature" className="featured-section">
        <div className="container">
          <div className="featured-header">
            <h2>Signature Styles</h2>
            <div className="premium-underline"></div>
          </div>

          <div className="category-grid">
            <div className="category-card" onClick={() => navigate('/collections?category=Bridal')}>
              <img src="https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?w=800&q=80" alt="Bridal" className="category-img" />
              <div className="category-overlay">
                <h3>Royal Bridal</h3>
                <p>Heavy maggam and zardozi masterpieces for your big day.</p>
                <button className="btn-view-style">View Collection →</button>
              </div>
            </div>

            <div className="category-card" onClick={() => navigate('/collections?category=Reception')}>
              <img src="https://images.unsplash.com/photo-1594144400267-0ef6d628795c?w=800&q=80" alt="Cocktail" className="category-img" />
              <div className="category-overlay">
                <h3>Cocktail Chic</h3>
                <p>Modern silhouettes and experimental cuts for evening glam.</p>
                <button className="btn-view-style">View Collection →</button>
              </div>
            </div>

            <div className="category-card" onClick={() => navigate('/collections?category=Festive')}>
              <img src="https://images.unsplash.com/photo-1615392601002-3ef72f9a706f?w=800&q=80" alt="Festive" className="category-img" />
              <div className="category-overlay">
                <h3>Heritage Festive</h3>
                <p>Timeless silk classics with intricate threadwork and motifs.</p>
                <button className="btn-view-style">View Collection →</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="trending-section">
        <div className="container">
          <div className="featured-header">
            <h2>Trending Bridal Designs</h2>
            <p className="text-gray-400 text-sm mt-2 font-bold uppercase tracking-widest">Most Viewed This Week</p>
            <div className="premium-underline"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10">
            {trending.map((design) => (
              <div key={design.id} className="trending-card group cursor-pointer" onClick={() => navigate(`/designs/${design.id}`)}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100 shadow-sm group-hover:shadow-2xl transition-all">
                  <img 
                    src={getImageUrl(design.images)} 
                    alt={design.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black">
                    TRENDING #{(trending.indexOf(design) + 1)}
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="text-lg font-black">{design.title}</h4>
                  <p className="text-sm text-gray-500 uppercase font-black tracking-widest">₹ {design.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="process" className="process-section">
        <div className="container">
          <div className="featured-header">
            <h2>Our Crafting Journey</h2>
            <div className="premium-underline"></div>
          </div>

          <div className="process-grid">
            <div className="process-step">
              <div className="step-num">01</div>
              <h3>Personal Consult</h3>
              <p>One-on-one sessions to understand your silhouette, fabric choices, and design vision.</p>
            </div>

            <div className="process-step">
              <div className="step-num">02</div>
              <h3>Artisanal Design</h3>
              <p>Our master artists sketch and prepare your pattern with surgical precision for a perfect fit.</p>
            </div>

            <div className="process-step">
              <div className="step-num">03</div>
              <h3>The Unveiling</h3>
              <p>Meticulous stitching followed by 3-stage quality checks before reaching your doorstep.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <div className="container">
        <section className="cta-banner">
          <h2>Ready to Wear Your Dream?</h2>
          <p>Schedule a consultation with our design team and let us create the perfect blouse for your special occasion.</p>
          <Link to="/auth/role-selection" className="btn-hero-outline" style={{ background: 'white', color: 'var(--color-primary)' }}>
            Book Your Consultation Today
          </Link>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
