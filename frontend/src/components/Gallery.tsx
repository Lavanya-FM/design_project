import React, { useState, useEffect } from 'react';
import { blouseAPI, categoryAPI, Blouse, Category } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Gallery: React.FC = () => {
  const [blouses, setBlouses] = useState<Blouse[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedFabric, setSelectedFabric] = useState('All Fabrics');
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [selectedFabric, selectedOccasions]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [blousesData, categoriesData] = await Promise.all([
        blouseAPI.getBlouses({
          fabric_type: selectedFabric,
          occasion: selectedOccasions.join(','),
        }),
        categoryAPI.getCategories(),
      ]);
      
      setBlouses(blousesData);
      setCategories(categoriesData);
    } catch (err: any) {
      setError('Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFabricChange = (fabric: string) => {
    setSelectedFabric(fabric);
  };

  const handleOccasionToggle = (occasion: string) => {
    setSelectedOccasions(prev =>
      prev.includes(occasion)
        ? prev.filter(o => o !== occasion)
        : [...prev, occasion]
    );
  };

  const clearFilters = () => {
    setSelectedFabric('All Fabrics');
    setSelectedOccasions([]);
    setSearchTerm('');
  };

  const fabricCategories = categories.filter(cat => cat.type === 'fabric');
  const occasionCategories = categories.filter(cat => cat.type === 'occasion');

  // Sample data for demonstration with proper images
  const sampleBlouses: Blouse[] = [
    {
      id: 1,
      title: "Traditional Silks",
      description: "Rich Banarasi and Kanjeevaram textures adorned with meticulous Zardozi handwork.",
      image_url: "https://picsum.photos/seed/silk1/400/500.jpg",
    },
    {
      id: 2,
      title: "Contemporary Cottons",
      description: "Breathable, organic weaves featuring modern silhouettes and understated wooden button details.",
      image_url: "https://picsum.photos/seed/cotton1/400/500.jpg",
    },
    {
      id: 3,
      title: "Designer Backs",
      description: "A focus on the unexpected. Geometric cut-outs, tie-up latkans, and sheer panelling.",
      image_url: "https://picsum.photos/seed/designer1/400/500.jpg",
    },
    {
      id: 4,
      title: "Ethereal Organza",
      description: "Light-as-air fabrics paired with delicate floral appliques and glass bead embroidery.",
      image_url: "https://picsum.photos/seed/organza1/400/500.jpg",
    },
    {
      id: 5,
      title: "Velvet Nights",
      description: "Rich, plush velvets in jewel tones, perfect for winter weddings and grand galas.",
      image_url: "https://picsum.photos/seed/velvet1/400/500.jpg",
    },
    {
      id: 6,
      title: "Indigo Tales",
      description: "Hand-block printed Ajrakh and Dabu cottons celebrating ancient dyeing traditions.",
      image_url: "https://picsum.photos/seed/indigo1/400/500.jpg",
    },
    {
      id: 7,
      title: "Royal Brocade",
      description: "Opulent brocade patterns with gold and silver threads, fit for royalty.",
      image_url: "https://picsum.photos/seed/brocade1/400/500.jpg",
    },
    {
      id: 8,
      title: "Minimalist Chic",
      description: "Clean lines and subtle elegance for the modern woman who appreciates simplicity.",
      image_url: "https://picsum.photos/seed/minimal1/400/500.jpg",
    },
    {
      id: 9,
      title: "Bohemian Rhapsody",
      description: "Free-spirited designs with tassels, mirrors, and ethnic embroidery patterns.",
      image_url: "https://picsum.photos/seed/boho1/400/500.jpg",
    },
  ];

  const displayBlouses = blouses.length > 0 ? blouses : sampleBlouses;

  const filteredBlouses = displayBlouses.filter(blouse =>
    blouse.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blouse.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="navbar sticky" style={{position: 'sticky', top: '0', zIndex: 40}}>
        <div className="container">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-gray-800">FIT & FLARE STUDIO</h1>
              <nav className="nav-links" style={{display: 'flex', gap: '1.5rem'}}>
                <button onClick={() => navigate('/')} className="text-gray-600 hover:text-gray-900">Home</button>
                <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">How it Works</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search collections..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                  style={{paddingLeft: '2.5rem', outline: 'none', border: '1px solid #d1d5db', width: '250px'}}
                />
                <i className="fas fa-search absolute left-3 top-3 text-gray-400" style={{position: 'absolute', left: '0.75rem', top: '0.75rem'}}></i>
              </div>
              <button 
                onClick={() => navigate('/login')}
                className="btn btn-primary"
              >
                Book Consultation
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6" style={{position: 'sticky', top: '6rem'}}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-purple-600 hover:text-purple-800 transition"
                >
                  Clear All
                </button>
              </div>

              {/* Fabric Type */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-gray-900">FABRIC TYPE</h3>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="fabric"
                      value="All Fabrics"
                      checked={selectedFabric === 'All Fabrics'}
                      onChange={(e) => handleFabricChange(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-gray-700">All Fabrics</span>
                  </label>
                  {fabricCategories.map(category => (
                    <label key={category.id} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="fabric"
                        value={category.name}
                        checked={selectedFabric === category.name}
                        onChange={(e) => handleFabricChange(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-gray-700">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Occasion */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-gray-900">OCCASION</h3>
                <div className="flex flex-wrap gap-2">
                  {occasionCategories.map(category => (
                    <button
                      key={category.id}
                      className={`px-3 py-1 border rounded-full text-sm transition ${
                        selectedOccasions.includes(category.name)
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'border-gray-300 hover:bg-purple-600 hover:text-white hover:border-purple-600'
                      }`}
                      onClick={() => handleOccasionToggle(category.name)}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Our Promise */}
              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">OUR PROMISE</h4>
                <p className="text-sm text-purple-700">
                  Each design can be customized to your specific measurements and fabric preferences during your consultation.
                </p>
              </div>
            </div>
          </aside>

          {/* Gallery Content */}
          <main className="lg:w-3/4">
            {/* Gallery Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Artisan Blouse Gallery</h1>
              <p className="text-gray-600 max-w-3xl mb-8">
                Explore our curated selection of bespoke blouse designs, from heritage hand-woven silks to contemporary minimalist cuts. Each piece is a testament to premium hand-crafted tailoring.
              </p>
              <div className="flex items-center justify-between">
                <p className="text-gray-600">
                  Showing <span className="font-semibold">{filteredBlouses.length}</span> designs
                </p>
                <select className="border border-gray-300 rounded-lg px-4 py-2">
                  <option>Sort by: Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest First</option>
                </select>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center py-12">
                <div className="spinner"></div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {/* Blouse Grid */}
            {!loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {filteredBlouses.map(blouse => (
                  <div key={blouse.id} className="bg-white rounded-lg shadow-md overflow-hidden hover-lift">
                    <div className="image-hover" style={{height: '20rem'}}>
                      <img
                        src={blouse.image_url}
                        alt={blouse.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://picsum.photos/seed/blouse${blouse.id}/400/500.jpg`;
                        }}
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 text-gray-900">{blouse.title}</h3>
                      <p className="text-gray-600 mb-4">{blouse.description}</p>
                      <div className="flex space-x-2">
                        <button
                          className="flex-1 btn btn-primary"
                          onClick={() => alert(`View details for: ${blouse.title}`)}
                        >
                          View Details
                        </button>
                        <button
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                          onClick={() => alert(`Save ${blouse.title} to favorites`)}
                        >
                          <i className="far fa-heart"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* The Art of the Stitch Section */}
            <section className="bg-gray-50 rounded-lg p-8 mb-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">The Art of the Stitch</h2>
                  <p className="text-gray-600 mb-6">
                    At FIT & FLARE STUDIO, we believe a blouse is more than just a garment; it's the anchor of your ensemble. Our master tailors bring over three decades of experience to every cut and every stitch. From the precise placement of a dart to the hand-finished edging of a neckline, our craftsmanship is obsessed with the details that define luxury.
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">15+</div>
                      <div className="text-sm text-gray-600">MASTER TAILORS</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">100%</div>
                      <div className="text-sm text-gray-600">CUSTOM FIT</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">48h</div>
                      <div className="text-sm text-gray-600">CONSULTATION TURNAROUND</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <img
                    src="https://picsum.photos/seed/tailorcraft/400/300.jpg"
                    alt="Craftsmanship"
                    className="rounded-lg shadow-md"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://picsum.photos/seed/craft/400/300.jpg`;
                    }}
                  />
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
