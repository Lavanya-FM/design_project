import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm">
        <div className="container">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-gray-900">FIT & FLARE STUDIO</h1>
              <nav className="hidden md:flex space-x-8">
                <a href="#signature" className="text-gray-600 hover:text-gray-900 transition">Signature Styles</a>
                <a href="#process" className="text-gray-600 hover:text-gray-900 transition">Our Process</a>
                <a href="#contact" className="text-gray-600 hover:text-gray-900 transition">Contact</a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/gallery')}
                className="text-gray-600 hover:text-gray-900 transition"
              >
                View Lookbook
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Book Consultation
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="relative py-20 text-center text-white"
        style={{
          background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
          minHeight: '600px'
        }}
      >
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">
              Where Tradition Meets Contemporary Elegance
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Bespoke blouse designs that celebrate your unique style. From heritage hand-woven silks to modern minimalist cuts, each piece is crafted with precision and passion.
            </p>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => navigate('/gallery')}
                className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Explore Collections
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition"
              >
                Book Consultation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Styles Section */}
      <section id="signature" className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Signature Styles</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our curated collection of bespoke designs, each telling a unique story of craftsmanship and style.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover-lift">
              <div className="h-64 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                <i className="fas fa-gem text-6xl text-purple-600"></i>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-3">Classic Elegance</h3>
                <p className="text-gray-600 mb-4">
                  Timeless designs featuring traditional craftsmanship with modern silhouettes. Perfect for weddings and special occasions.
                </p>
                <button 
                  onClick={() => navigate('/gallery')}
                  className="text-purple-600 font-semibold hover:text-purple-800 transition"
                >
                  View Collection →
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover-lift">
              <div className="h-64 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                <i className="fas fa-palette text-6xl text-indigo-600"></i>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-3">Contemporary Fusion</h3>
                <p className="text-gray-600 mb-4">
                  Modern designs that blend East and West. Bold patterns, innovative cuts, and experimental fabrics for fashion-forward.
                </p>
                <button 
                  onClick={() => navigate('/gallery')}
                  className="text-purple-600 font-semibold hover:text-purple-800 transition"
                >
                  View Collection →
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover-lift">
              <div className="h-64 bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                <i className="fas fa-leaf text-6xl text-emerald-600"></i>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-3">Sustainable Luxury</h3>
                <p className="text-gray-600 mb-4">
                  Eco-conscious designs using organic fabrics and natural dyes. Style that respects both tradition and environment.
                </p>
                <button 
                  onClick={() => navigate('/gallery')}
                  className="text-purple-600 font-semibold hover:text-purple-800 transition"
                >
                  View Collection →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Process</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From consultation to delivery, we ensure every step of your journey is personalized and perfect.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="text-2xl font-semibold mb-3">Consult</h3>
              <p className="text-gray-600">
                Personal consultation to understand your style, preferences, and requirements. We listen to your vision.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-2xl font-semibold mb-3">Design</h3>
              <p className="text-gray-600">
                Custom design creation with detailed measurements, fabric selection, and style adjustments to your needs.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-2xl font-semibold mb-3">Deliver</h3>
              <p className="text-gray-600">
                Meticulous craftsmanship and quality checks ensure your perfect piece is delivered with care and precision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-red-600 text-white">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Begin Your Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Schedule a consultation with our design team and let us create the perfect blouse for your special occasion.
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="bg-white text-red-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition"
          >
            Book Your Consultation Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">FIT & FLARE STUDIO</h3>
              <p className="text-gray-400">
                Premium bespoke tailoring for the modern woman who values tradition and style.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#signature" className="text-gray-400 hover:text-white transition">Signature Styles</a></li>
                <li><a href="#process" className="text-gray-400 hover:text-white transition">Our Process</a></li>
                <li><button onClick={() => navigate('/gallery')} className="text-gray-400 hover:text-white transition">Lookbook</button></li>
                <li><button onClick={() => navigate('/login')} className="text-gray-400 hover:text-white transition">Book Consultation</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>123 Fashion Street</li>
                <li>Mumbai, Maharashtra 400001</li>
                <li>Phone: +91 98765 43210</li>
                <li>Email: hello@fitandflarestudio.com</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition">
                  <i className="fab fa-pinterest"></i>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Fit & Flare Studio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
