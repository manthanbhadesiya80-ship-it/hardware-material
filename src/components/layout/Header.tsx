import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { DevshreeLogo } from '../common/DevshreeLogo';
import { api } from '../../services/api';
import { Product, Category } from '../../types';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  PhoneCall,
  Package,
  Layers,
  ChevronDown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Mic,
  MicOff
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    setCurrentPage,
    cartCount,
    cartSubtotal,
    wishlist,
    settings,
    customerInfo
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  // Fetch categories for mega-menu
  useEffect(() => {
    api.getCategories().then(setCategories).catch(console.error);
  }, []);

  // Live search debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timeout = setTimeout(async () => {
      try {
        const results = await api.getProducts({ search: searchQuery.trim() });
        setSearchResults(results.slice(0, 6));
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // Click outside listener for search & account dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchOpen(false);
    setCurrentPage('shop', { search: searchQuery.trim() });
  };

  // Voice Search feature
  const handleVoiceSearch = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice recognition is not supported in this browser. Please type your search.');
      return;
    }

    if (isListening) return;

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);
      recognition.start();

      recognition.onresult = (event: any) => {
        const speechResult = event.results[0][0].transcript;
        setSearchQuery(speechResult);
        setIsListening(false);
        setIsSearchOpen(true);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } catch {
      setIsListening(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-xs">
      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3.5">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          {/* Mobile Categories Toggle & Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsMegaMenuOpen(prev => !prev)}
              className="lg:hidden p-2 text-gray-700 hover:text-[#124DA6] hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle Category Menu"
            >
              {isMegaMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <button
              onClick={() => setCurrentPage('home')}
              className="flex items-center focus:outline-hidden"
              aria-label="Devshree Home"
            >
              <DevshreeLogo size="md" />
            </button>
          </div>

          {/* Desktop Search Bar */}
          <div ref={searchRef} className="relative flex-1 max-w-2xl hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  placeholder="Search bed fittings, hydraulic lift, hinges, door locks, screws..."
                  className="w-full pl-11 pr-24 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-[#15191F] placeholder-gray-500 focus:outline-hidden focus:border-[#124DA6] focus:ring-2 focus:ring-[#124DA6]/15 transition-all shadow-2xs"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />

                {/* Voice Search Button */}
                <button
                  type="button"
                  onClick={handleVoiceSearch}
                  title="Search by Voice"
                  className={`absolute right-14 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-colors ${
                    isListening ? 'text-red-500 bg-red-50 animate-pulse' : 'text-gray-400 hover:text-[#124DA6]'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                {/* Submit Search Button */}
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#124DA6] hover:bg-[#083B82] text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Live Autocomplete Dropdown */}
            {isSearchOpen && (searchQuery.trim().length > 0 || searchResults.length > 0) && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                {isSearching ? (
                  <div className="p-4 text-center text-sm text-gray-500">Searching Devshree catalog...</div>
                ) : searchResults.length > 0 ? (
                  <div>
                    <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-xs text-gray-500 font-semibold uppercase">
                      <span>Products ({searchResults.length})</span>
                      <span>Instant Results</span>
                    </div>
                    <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                      {searchResults.map(prod => (
                        <div
                          key={prod.id}
                          onClick={() => {
                            setIsSearchOpen(false);
                            setCurrentPage('product', { slug: prod.slug });
                          }}
                          className="flex items-center gap-3 p-3 hover:bg-blue-50/60 cursor-pointer transition-colors"
                        >
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="w-12 h-12 rounded object-cover border border-gray-100 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-semibold text-gray-900 truncate">{prod.name}</h4>
                            <p className="text-[11px] text-gray-500 truncate">
                              {prod.category} · SKU: {prod.sku}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs font-bold text-[#083B82]">₹{prod.price}</span>
                              <span className="text-[10px] text-gray-400 line-through">₹{prod.mrp}</span>
                              <span className="text-[10px] font-bold text-[#E87500]">
                                {prod.discountPercentage}% OFF
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400 shrink-0" />
                        </div>
                      ))}
                    </div>
                    <div className="p-2.5 bg-gray-50 border-t border-gray-100 text-center">
                      <button
                        onClick={handleSearchSubmit}
                        className="text-xs font-bold text-[#124DA6] hover:underline"
                      >
                        View all results for "{searchQuery}" →
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-sm font-semibold text-gray-800">No hardware found for "{searchQuery}"</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Try searching for 'hydraulic', 'hinges', 'channel', 'screws' or 'bed fitting'
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Icons & Bulk Button */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Bulk Contractor Quote Button */}
            <button
              onClick={() => setCurrentPage('bulk-quote')}
              className="hidden lg:flex items-center gap-1.5 border border-[#124DA6] text-[#124DA6] hover:bg-[#124DA6] hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Bulk / Contractor Quote</span>
            </button>

            {/* Wishlist */}
            <button
              onClick={() => setCurrentPage('shop', { wishlistOnly: true })}
              className="relative p-2 text-gray-700 hover:text-[#124DA6] hover:bg-gray-100 rounded-lg transition-colors"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-[#E87500] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* User Account / Orders Menu */}
            <div ref={accountRef} className="relative">
              <button
                onClick={() => setIsAccountMenuOpen(prev => !prev)}
                className="flex items-center gap-1.5 p-2 text-gray-700 hover:text-[#124DA6] hover:bg-gray-100 rounded-lg transition-colors"
                title="Account"
                aria-label="Account Menu"
              >
                <User className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="hidden xl:inline text-xs font-semibold text-left">
                  <span className="block text-[10px] text-gray-400 font-normal">Welcome</span>
                  {customerInfo.name ? customerInfo.name.split(' ')[0] : 'My Account'}
                </span>
                <ChevronDown className="w-3 h-3 text-gray-400 hidden xl:block" />
              </button>

              {/* Account Dropdown */}
              {isAccountMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-lg shadow-xl border border-gray-200 py-1.5 z-50 animate-in fade-in">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-900">
                      {customerInfo.name || 'Valued Customer'}
                    </p>
                    <p className="text-[11px] text-gray-500 truncate">
                      {customerInfo.phone || 'Welcome to Devshree'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsAccountMenuOpen(false);
                      setCurrentPage('my-orders');
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-blue-50 flex items-center gap-2"
                  >
                    <Package className="w-4 h-4 text-[#124DA6]" />
                    <span>My Orders & Tracking</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsAccountMenuOpen(false);
                      setCurrentPage('bulk-quote');
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-blue-50 flex items-center gap-2"
                  >
                    <Building2 className="w-4 h-4 text-[#E87500]" />
                    <span>Contractor Wholesale Enquiry</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsAccountMenuOpen(false);
                      setCurrentPage('admin');
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 flex items-center gap-2 border-t border-gray-100"
                  >
                    <ShieldCheck className="w-4 h-4 text-gray-600" />
                    <span>Admin Portal</span>
                  </button>
                </div>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setCurrentPage('cart')}
              className="flex items-center gap-2 bg-[#124DA6] hover:bg-[#083B82] text-white px-3 sm:px-3.5 py-2 rounded-lg font-bold transition-all shadow-sm group"
              aria-label="View Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 group-hover:scale-105 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#E87500] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-bold">
                {cartCount > 0 ? `₹${cartSubtotal.toLocaleString('en-IN')}` : 'Cart'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Row */}
        <div className="mt-2.5 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search hardware, bed fitting, locks..."
              className="w-full pl-10 pr-20 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs text-[#15191F] placeholder-gray-500 focus:outline-hidden focus:border-[#124DA6]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <button
              type="button"
              onClick={handleVoiceSearch}
              className="absolute right-12 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-[#124DA6]"
            >
              <Mic className="w-3.5 h-3.5" />
            </button>
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#124DA6] text-white text-[11px] font-bold px-2 py-1 rounded"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Category Navigation Bar (Desktop) */}
      <div className="hidden lg:block bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* All Categories Mega Menu Button */}
            <div className="relative">
              <button
                onClick={() => setIsMegaMenuOpen(prev => !prev)}
                className="flex items-center gap-2 bg-[#124DA6] hover:bg-[#083B82] text-white text-xs font-bold uppercase tracking-wider py-2.5 px-4 transition-colors"
              >
                <Menu className="w-4 h-4" />
                <span>All Categories</span>
                <ChevronDown className="w-3.5 h-3.5 ml-1" />
              </button>

              {/* Mega Menu Dropdown */}
              {isMegaMenuOpen && (
                <div
                  onMouseLeave={() => setIsMegaMenuOpen(false)}
                  className="absolute left-0 top-full w-80 bg-white shadow-2xl border border-gray-200 py-2 z-50 animate-in fade-in"
                >
                  <div className="px-4 py-2 border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    Hardware Departments
                  </div>
                  <div className="divide-y divide-gray-50 max-h-[70vh] overflow-y-auto">
                    {categories.map(cat => (
                      <div
                        key={cat.id}
                        onClick={() => {
                          setIsMegaMenuOpen(false);
                          setCurrentPage('category', { slug: cat.slug });
                        }}
                        className="px-4 py-2.5 hover:bg-blue-50/70 flex items-center justify-between cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-7 h-7 rounded object-cover border border-gray-200"
                          />
                          <span className="text-xs font-semibold text-gray-800 group-hover:text-[#124DA6]">
                            {cat.name}
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-400 group-hover:text-[#124DA6]">
                          {cat.itemCount} items →
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Category Links */}
            <nav className="flex items-center space-x-6 text-xs font-semibold text-gray-700">
              <button
                onClick={() => setCurrentPage('category', { slug: 'bed-fittings' })}
                className="hover:text-[#124DA6] transition-colors py-2.5"
              >
                Bed Fittings
              </button>
              <button
                onClick={() => setCurrentPage('category', { slug: 'furniture-hardware' })}
                className="hover:text-[#124DA6] transition-colors py-2.5"
              >
                Furniture Hardware
              </button>
              <button
                onClick={() => setCurrentPage('category', { slug: 'cabinet-hardware' })}
                className="hover:text-[#124DA6] transition-colors py-2.5"
              >
                Cabinet Handles
              </button>
              <button
                onClick={() => setCurrentPage('category', { slug: 'door-hardware' })}
                className="hover:text-[#124DA6] transition-colors py-2.5"
              >
                Door Locks
              </button>
              <button
                onClick={() => setCurrentPage('category', { slug: 'fasteners' })}
                className="hover:text-[#124DA6] transition-colors py-2.5"
              >
                Fasteners & Screws
              </button>
              <button
                onClick={() => setCurrentPage('category', { slug: 'adhesives' })}
                className="hover:text-[#124DA6] transition-colors py-2.5"
              >
                Polyfix & Adhesives
              </button>
              <button
                onClick={() => setCurrentPage('category', { slug: 'clamps' })}
                className="hover:text-[#124DA6] transition-colors py-2.5"
              >
                Clamps & Vices
              </button>
              <button
                onClick={() => setCurrentPage('offers')}
                className="text-[#E87500] hover:text-[#F28C00] font-bold flex items-center gap-1 py-2.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Today's Offers</span>
              </button>
            </nav>

            {/* Right Hotline indicator */}
            <a
              href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
              className="flex items-center gap-1.5 text-xs font-bold text-[#083B82] hover:text-[#124DA6]"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#E87500]" />
              <span>Order Hotline: {settings.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Category Drawer */}
      {isMegaMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsMegaMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left">
            <div className="p-4 bg-[#083B82] text-white flex items-center justify-between">
              <DevshreeLogo size="sm" inverted={true} />
              <button
                onClick={() => setIsMegaMenuOpen(false)}
                className="text-white hover:text-gray-300 p-1"
                aria-label="Close Menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Browse Hardware
                </p>
                <div className="space-y-1">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setIsMegaMenuOpen(false);
                        setCurrentPage('category', { slug: cat.slug });
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-lg text-left hover:bg-blue-50 text-xs font-semibold text-gray-800 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <img src={cat.image} alt={cat.name} className="w-7 h-7 rounded object-cover" />
                        <span>{cat.name}</span>
                      </div>
                      <span className="text-[11px] text-gray-400">{cat.itemCount}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Quick Actions
                </p>
                <button
                  onClick={() => {
                    setIsMegaMenuOpen(false);
                    setCurrentPage('bulk-quote');
                  }}
                  className="w-full bg-[#E87500] text-white font-bold py-2.5 px-3 rounded-lg text-xs flex items-center justify-center gap-2 shadow-sm"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Contractor Wholesale Quote</span>
                </button>
                <button
                  onClick={() => {
                    setIsMegaMenuOpen(false);
                    setCurrentPage('offers');
                  }}
                  className="w-full bg-blue-50 text-[#124DA6] font-bold py-2.5 px-3 rounded-lg text-xs flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#E87500]" />
                  <span>Today's Deals & Coupons</span>
                </button>
                <button
                  onClick={() => {
                    setIsMegaMenuOpen(false);
                    setCurrentPage('my-orders');
                  }}
                  className="w-full border border-gray-200 text-gray-700 font-bold py-2.5 px-3 rounded-lg text-xs flex items-center justify-center gap-2"
                >
                  <Package className="w-4 h-4 text-[#124DA6]" />
                  <span>Track My Order</span>
                </button>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-600">
              <p className="font-semibold text-gray-900">Need Hardware Help?</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Call our Rajkot support desk:</p>
              <a
                href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                className="font-bold text-[#124DA6] block mt-1"
              >
                {settings.phone}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
