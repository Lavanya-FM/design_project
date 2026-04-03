import React, { useState, useEffect, useCallback, useRef } from 'react';
import { designAPI, Blouse } from '../services/api';
import { useNavigate } from 'react-router-dom';
import CONFIG from '../config';
import Skeleton from './Skeleton';

const Gallery: React.FC = () => {
    const [designs, setDesigns] = useState<Blouse[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [wishlist, setWishlist] = useState<string[]>([]);
    
    // Load wishlist
    useEffect(() => {
        const saved = localStorage.getItem('wishlist');
        if (saved) setWishlist(JSON.parse(saved));
    }, []);

    const toggleWishlist = (id: string | number) => {
        const idStr = id.toString();
        const isAdding = !wishlist.includes(idStr);
        const updated = isAdding 
            ? [...wishlist, idStr]
            : wishlist.filter(i => i !== idStr);
            
        setWishlist(updated);
        localStorage.setItem('wishlist', JSON.stringify(updated));
        window.dispatchEvent(new Event('wishlistUpdate'));

        if (isAdding) {
            designAPI.trackWishlist(id).catch(console.error);
        }
    };
    interface Filters {
        neck: string;
        sleeve: string;
        work: string;
        occasion: string;
        fabric: string;
        [key: string]: string;
    }

    const [filters, setFilters] = useState<Filters>({
        neck: '',
        sleeve: '',
        work: '',
        occasion: '',
        fabric: ''
    });

    const navigate = useNavigate();
    const observer = useRef<IntersectionObserver | null>(null);
    const lastDesignElementRef = useCallback((node: HTMLDivElement) => {
        if (loading || loadingMore) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, loadingMore, hasMore]);

    const [totalCount, setTotalCount] = useState(0);

    const loadDesigns = async (currentPage: number, currentFilters: any, reset = false) => {
        try {
            if (reset) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }

            const response = await designAPI.getDesigns({
                ...currentFilters,
                page: currentPage,
                limit: 12
            });

            const newDesigns = response.designs.map(d => ({
                ...d,
                // Ensure images is an array
                images: typeof d.images === 'string' ? JSON.parse(d.images) : d.images
            }));

            setTotalCount(response.total);
            setDesigns(prev => {
                const updated = reset ? newDesigns : [...prev, ...newDesigns];
                setHasMore(updated.length < response.total);
                return updated;
            });
            setError('');
        } catch (err: any) {
            console.error('Error loading designs:', err);
            setError('Unable to load designs. Showing sample data.');
            if (reset) setDesigns(SAMPLE_DATA);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // Load initial data
    useEffect(() => {
        loadDesigns(page, filters, true);
    }, [filters]);

    // Handle initial scroll/mounting and page changes
    useEffect(() => {
        if (page > 1) {
            loadDesigns(page, filters, false);
        }
    }, [page]);

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: prev[key] === value ? '' : value }));
        setPage(1); // Reset to first page
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm) {
            setPage(1);
            loadDesigns(1, filters, true);
            return;
        }
        try {
            setLoading(true);
            const results = await designAPI.searchDesigns(searchTerm);
            setDesigns(results.map(d => ({
                ...d,
                images: typeof d.images === 'string' ? JSON.parse(d.images) : d.images
            })));
            setHasMore(false);
        } catch (err) {
            setError('Search failed');
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (images: any) => {
        const url = Array.isArray(images) && images.length > 0 ? images[0] : 'https://via.placeholder.com/400x500';
        if (url.startsWith('http')) return url;
        return `${CONFIG.API_URL.replace('/api', '')}${url}`;
    };

    return (
        <div className="min-h-screen bg-[#FDFBF9] text-[#2D2D2D] font-sans">
            {/* Header / Navbar */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-12">
                        <h1 className="text-2xl font-black tracking-tighter text-purple-900 cursor-pointer" onClick={() => navigate('/')}>
                            ATELIER <span className="font-light text-gray-400">FIT & FLARE</span>
                        </h1>
                        <nav className="hidden lg:flex gap-8 text-sm font-medium text-gray-500 uppercase tracking-widest">
                            <a href="#" className="hover:text-purple-600 transition">Collections</a>
                            <a href="#" className="hover:text-purple-600 transition">Customizer</a>
                            <a href="#" className="hover:text-purple-600 transition">Atelier</a>
                        </nav>
                    </div>

                    <div className="flex items-center gap-6">
                        <form onSubmit={handleSearch} className="relative group">
                            <input 
                                type="text" 
                                placeholder="Search designs..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-gray-100 rounded-full px-6 py-2 pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all w-64 group-hover:w-80"
                            />
                            <svg className="absolute left-4 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </form>
                        <button className="relative">
                            <svg className="w-6 h-6 text-gray-700" fill={wishlist.length > 0 ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {wishlist.length > 0 && <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full pulse">{wishlist.length}</span>}
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12 flex gap-10">
                {/* Filters Sidebar */}
                <aside className="w-64 flex-shrink-0 hidden lg:block">
                    <div className="sticky top-28 space-y-10">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xs uppercase tracking-widest font-black text-gray-400">Filters</h2>
                            <button 
                                onClick={() => { setFilters({ neck: '', sleeve: '', work: '', occasion: '', fabric: '' }); setPage(1); }}
                                className="text-[10px] uppercase font-bold text-purple-600 hover:text-purple-800"
                            >
                                Reset
                            </button>
                        </div>

                        {FILTER_SECTIONS.map(section => (
                            <div key={section.id} className="space-y-4">
                                <h3 className="text-sm font-bold">{section.title}</h3>
                                <div className="space-y-2">
                                    {section.options.map(opt => (
                                        <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                                            <input 
                                                type="checkbox" 
                                                className="w-4 h-4 rounded border-gray-200 text-purple-600 focus:ring-purple-200 transition-all"
                                                checked={filters[section.id as keyof typeof filters] === opt.value}
                                                onChange={() => handleFilterChange(section.id, opt.value)}
                                            />
                                            <span className={`text-sm tracking-tight transition-colors ${filters[section.id as keyof typeof filters] === opt.value ? 'text-purple-600 font-bold' : 'text-gray-500 group-hover:text-gray-900'}`}>
                                                {opt.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Design Grid */}
                <section className="flex-1">
                    <div className="mb-10 flex items-end justify-between">
                        <div>
                            <h1 className="text-4xl font-black tracking-tight mb-2">Curated Designs</h1>
                            <p className="text-gray-500 max-w-lg">Discover master-crafted blouse designs, tailored to perfection by our expert artisans.</p>
                        </div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Showing <span className="text-black">{designs.length} of {totalCount}</span> Masterpieces
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="space-y-4">
                                    <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                            {designs.map((design, index) => (
                                <div 
                                    key={design.id} 
                                    ref={index === designs.length - 1 ? lastDesignElementRef : null}
                                    className="group cursor-pointer"
                                    onClick={() => navigate(`/designs/${design.id}`)}
                                >
                                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100 mb-4 shadow-sm group-hover:shadow-xl transition-all duration-500">
                                        <img 
                                            src={getImageUrl(design.images)} 
                                            alt={design.title}
                                            loading="lazy"
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = `https://picsum.photos/seed/${design.id}/800/1000`;
                                            }}
                                        />
                                        <div className="absolute top-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); toggleWishlist(design.id); }}
                                                className={`backdrop-blur p-3 rounded-full transition-colors ${wishlist.includes(design.id.toString()) ? 'bg-purple-600 text-white' : 'bg-white/90 text-gray-700 hover:bg-purple-600 hover:text-white'}`}
                                            >
                                                <svg className="w-5 h-5" fill={wishlist.includes(design.id.toString()) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                            </button>
                                        </div>
                                        {design.price && (
                                            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-xs font-black shadow-sm">
                                                ₹ {design.price}
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-black group-hover:text-purple-600 transition-colors">{design.title}</h3>
                                            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">{design.occasion}</span>
                                        </div>
                                        <p className="text-gray-500 text-sm line-clamp-1">{design.description}</p>
                                        <div className="flex gap-2 pt-2">
                                            {design.work_type && <span className="text-[9px] bg-purple-50 text-purple-700 px-2 py-1 rounded font-bold uppercase">{design.work_type}</span>}
                                            {design.fabric && <span className="text-[9px] bg-gray-100 text-gray-600 px-2 py-1 rounded font-bold uppercase">{design.fabric}</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {loadingMore && (
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="space-y-4">
                                    <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
                                    <Skeleton className="h-6 w-3/4" />
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

const FILTER_SECTIONS = [
    {
        id: 'neck',
        title: 'Neck Type',
        options: [
            { label: 'Boat Neck', value: 'boat' },
            { label: 'Deep Back', value: 'deep_back' },
            { label: 'Halter', value: 'halter' },
            { label: 'V-Neck', value: 'v_neck' }
        ]
    },
    {
        id: 'sleeve',
        title: 'Sleeve',
        options: [
            { label: 'Sleeveless', value: 'sleeveless' },
            { label: 'Short Sleeve', value: 'short' },
            { label: 'Elbow Length', value: 'elbow' },
            { label: 'Full Sleeve', value: 'full' }
        ]
    },
    {
        id: 'work',
        title: 'Work Type',
        options: [
            { label: 'Aari Work', value: 'aari' },
            { label: 'Embroidery', value: 'embroidery' },
            { label: 'Zari', value: 'zari' },
            { label: 'Plain', value: 'plain' }
        ]
    },
    {
        id: 'occasion',
        title: 'Occasion',
        options: [
            { label: 'Bridal', value: 'bridal' },
            { label: 'Reception', value: 'reception' },
            { label: 'Party', value: 'party' },
            { label: 'Casual', value: 'casual' }
        ]
    }
];

const SAMPLE_DATA: Blouse[] = [
    {
        id: 's1',
        title: 'Royal Bridal Aari',
        description: 'Deep red silk blouse with heavy gold aari work and peacock motifs.',
        price: 4500,
        images: ['https://picsum.photos/seed/bridal1/800/1000'],
        occasion: 'bridal',
        work_type: 'aari',
        fabric: 'silk'
    },
    {
        id: 's2',
        title: 'Modern Silver Halter',
        description: 'Contemporary silver tissue blouse with minimal sequin finish.',
        price: 2800,
        images: ['https://picsum.photos/seed/halter1/800/1000'],
        occasion: 'reception',
        work_type: 'embroidery',
        fabric: 'tissue'
    }
];

export default Gallery;
