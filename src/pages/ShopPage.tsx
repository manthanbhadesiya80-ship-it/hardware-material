import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { Product, Category, Brand } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import { useStore } from '../context/StoreContext';
import {
  Filter,
  SlidersHorizontal,
  X,
  Check,
  ChevronDown,
  LayoutGrid,
  List,
  Search,
  RotateCcw
} from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { pageParams, setCurrentPage, wishlist } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>(pageParams.category || '');
  const [selectedBrand, setSelectedBrand] = useState<string>(pageParams.brand || '');
  const [searchQuery, setSearchQuery] = useState<string>(pageParams.search || '');
  const [priceRange, setPriceRange] = useState<number>(3000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [onlyOffers, setOnlyOffers] = useState<boolean>(Boolean(pageParams.offer));
  const [onlyBestsellers, setOnlyBestsellers] = useState<boolean>(Boolean(pageParams.bestSeller));
  const [onlyWishlist, setOnlyWishlist] = useState<boolean>(Boolean(pageParams.wishlistOnly));
  const [sortBy, setSortBy] = useState<string>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    async function loadShopData() {
      try {
        const [p, c, b] = await Promise.all([
          api.getProducts(),
          api.getCategories(),
          api.getBrands()
        ]);
        setProducts(p);
        setCategories(c);
        setBrands(b);
      } catch (err) {
        console.error('Error loading shop catalog:', err);
      } finally {
        setLoading(false);
      }
    }
    loadShopData();
  }, []);

  // Update filters if pageParams change
  useEffect(() => {
    if (pageParams.category) setSelectedCategory(pageParams.category);
    if (pageParams.brand) setSelectedBrand(pageParams.brand);
    if (pageParams.search) setSearchQuery(pageParams.search);
    if (pageParams.wishlistOnly) setOnlyWishlist(true);
    if (pageParams.bestSeller) setOnlyBestsellers(true);
  }, [pageParams]);

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category filter
      if (selectedCategory) {
        const matchesCategory =
          product.category.toLowerCase() === selectedCategory.toLowerCase() ||
          product.subcategory?.toLowerCase() === selectedCategory.toLowerCase();
        if (!matchesCategory) return false;
      }

      // Brand filter
      if (selectedBrand && product.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          product.name.toLowerCase().includes(q) ||
          product.description.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q) ||
          product.brand.toLowerCase().includes(q) ||
          product.sku.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Price filter
      if (product.price > priceRange) {
        return false;
      }

      // Stock filter
      if (inStockOnly && product.stock <= 0) {
        return false;
      }

      // Deals filter
      if (onlyOffers && (!product.isOffer && product.discountPercentage < 25)) {
        return false;
      }

      // Best sellers filter
      if (onlyBestsellers && !product.isBestSeller) {
        return false;
      }

      // Wishlist filter
      if (onlyWishlist && !wishlist.includes(product.id)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'discount') return b.discountPercentage - a.discountPercentage;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return b.rating * b.reviewsCount - a.rating * a.reviewsCount; // popular default
    });
  }, [
    products,
    selectedCategory,
    selectedBrand,
    searchQuery,
    priceRange,
    inStockOnly,
    onlyOffers,
    onlyBestsellers,
    onlyWishlist,
    sortBy,
    wishlist
  ]);

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setSearchQuery('');
    setPriceRange(3000);
    setInStockOnly(false);
    setOnlyOffers(false);
    setOnlyBestsellers(false);
    setOnlyWishlist(false);
    setSortBy('popular');
  };

  const isAnyFilterActive =
    Boolean(selectedCategory) ||
    Boolean(selectedBrand) ||
    Boolean(searchQuery) ||
    priceRange < 3000 ||
    inStockOnly ||
    onlyOffers ||
    onlyBestsellers ||
    onlyWishlist;

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-2.5">
          Categories
        </h4>
        <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
          <button
            onClick={() => setSelectedCategory('')}
            className={`w-full text-left text-xs py-1.5 px-2 rounded-lg flex items-center justify-between transition-colors ${
              !selectedCategory ? 'bg-blue-50 text-[#124DA6] font-bold' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span>All Categories</span>
            <span className="text-[11px] text-gray-400">{products.length}</span>
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`w-full text-left text-xs py-1.5 px-2 rounded-lg flex items-center justify-between transition-colors ${
                selectedCategory === cat.name
                  ? 'bg-blue-50 text-[#124DA6] font-bold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="truncate">{cat.name}</span>
              <span className="text-[11px] text-gray-400">
                {products.filter(p => p.category === cat.name).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Slider */}
      <div className="border-t border-gray-100 pt-5">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
            Max Price
          </h4>
          <span className="text-xs font-extrabold text-[#083B82]">
            ₹{priceRange.toLocaleString('en-IN')}
          </span>
        </div>
        <input
          type="range"
          min="100"
          max="3000"
          step="50"
          value={priceRange}
          onChange={e => setPriceRange(Number(e.target.value))}
          className="w-full accent-[#124DA6] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>₹100</span>
          <span>₹3,000+</span>
        </div>
      </div>

      {/* Brand Filter */}
      <div className="border-t border-gray-100 pt-5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-2.5">
          Brands
        </h4>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          <button
            onClick={() => setSelectedBrand('')}
            className={`w-full text-left text-xs py-1.5 px-2 rounded-lg flex items-center justify-between transition-colors ${
              !selectedBrand ? 'bg-blue-50 text-[#124DA6] font-bold' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span>All Brands</span>
          </button>
          {brands.map(brand => (
            <button
              key={brand.id}
              onClick={() => setSelectedBrand(brand.name)}
              className={`w-full text-left text-xs py-1.5 px-2 rounded-lg flex items-center justify-between transition-colors ${
                selectedBrand === brand.name
                  ? 'bg-blue-50 text-[#124DA6] font-bold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>{brand.name}</span>
              <span className="text-[11px] text-gray-400">
                {products.filter(p => p.brand === brand.name).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Checkbox Toggles */}
      <div className="border-t border-gray-100 pt-5 space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-2">
          Availability & Offers
        </h4>
        <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={e => setInStockOnly(e.target.checked)}
            className="rounded text-[#124DA6] focus:ring-[#124DA6]"
          />
          <span>In Stock Only</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700">
          <input
            type="checkbox"
            checked={onlyOffers}
            onChange={e => setOnlyOffers(e.target.checked)}
            className="rounded text-[#124DA6] focus:ring-[#124DA6]"
          />
          <span>Discount Deals & Offers</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700">
          <input
            type="checkbox"
            checked={onlyBestsellers}
            onChange={e => setOnlyBestsellers(e.target.checked)}
            className="rounded text-[#124DA6] focus:ring-[#124DA6]"
          />
          <span>Best Sellers</span>
        </label>
        {wishlist.length > 0 && (
          <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700">
            <input
              type="checkbox"
              checked={onlyWishlist}
              onChange={e => setOnlyWishlist(e.target.checked)}
              className="rounded text-[#124DA6] focus:ring-[#124DA6]"
            />
            <span>My Wishlist ({wishlist.length})</span>
          </label>
        )}
      </div>

      {/* Reset button */}
      {isAnyFilterActive && (
        <button
          onClick={clearAllFilters}
          className="w-full py-2 px-3 border border-gray-300 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-100 flex items-center justify-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Filters</span>
        </button>
      )}
    </div>
  );

  return (
    <div className="py-6 sm:py-8 bg-[#F7F9FC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Title */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <button onClick={() => setCurrentPage('home')} className="hover:underline">
              Home
            </button>
            <span>/</span>
            <span className="text-gray-900 font-semibold">
              {selectedCategory || (onlyWishlist ? 'My Wishlist' : 'All Hardware Products')}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-3xl font-extrabold text-[#083B82]">
                {selectedCategory ? `${selectedCategory} Gallery` : 'All Hardware & Building Materials'}
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Showing {filteredProducts.length} verified products available for instant dispatch
              </p>
            </div>

            {/* Mobile Filter Trigger Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="flex-1 sm:flex-none bg-white border border-gray-300 text-gray-800 text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#124DA6]" />
                <span>Filters {isAnyFilterActive && '•'}</span>
              </button>

              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-white border border-gray-300 text-gray-800 text-xs font-semibold py-2 px-3 rounded-lg focus:outline-hidden"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="discount">Biggest Discount</option>
                <option value="rating">Top Rated</option>
                <option value="newest">New Arrivals</option>
              </select>
            </div>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs h-fit sticky top-28">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#124DA6]" />
                <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                  Filter Catalog
                </h3>
              </div>
              {isAnyFilterActive && (
                <button
                  onClick={clearAllFilters}
                  className="text-[11px] font-bold text-[#E87500] hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>
            <FilterPanel />
          </div>

          {/* Products List Area */}
          <div className="lg:col-span-3">
            {/* Desktop Sort & View Toggle Bar */}
            <div className="hidden lg:flex items-center justify-between bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs mb-6">
              <span className="text-xs text-gray-500 font-medium">
                Found <strong className="text-gray-900">{filteredProducts.length}</strong> items
              </span>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-600">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-xs font-semibold py-1.5 px-3 rounded-lg focus:outline-hidden focus:border-[#124DA6]"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="discount">Biggest Discount</option>
                    <option value="rating">Top Customer Rated</option>
                    <option value="newest">New Arrivals</option>
                  </select>
                </div>

                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 ${viewMode === 'grid' ? 'bg-[#124DA6] text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                    title="Grid view"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 ${viewMode === 'list' ? 'bg-[#124DA6] text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                    title="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid or Empty State */}
            {loading ? (
              <div className="py-20 flex justify-center">
                <div className="w-10 h-10 border-4 border-[#124DA6] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredProducts.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5'
                    : 'space-y-4'
                }
              >
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 text-center shadow-2xs">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-[#124DA6] flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                  No hardware matches your criteria
                </h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto mb-6">
                  We could not find any products with your current active filters. Try expanding your price range or clearing search tags.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-[#124DA6] hover:bg-[#083B82] text-white text-xs font-bold py-2.5 px-5 rounded-lg shadow-sm transition-colors"
                >
                  Clear All Filters & Show Full Catalog
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Bottom Sheet Modal */}
      {isMobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative bg-white rounded-t-2xl shadow-2xl max-h-[85vh] overflow-y-auto p-5 z-10 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#124DA6]" />
                <span>Filter Hardware Catalog</span>
              </h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <FilterPanel />

            <div className="mt-6 pt-3 border-t border-gray-200 flex gap-2">
              <button
                onClick={clearAllFilters}
                className="flex-1 py-2.5 border border-gray-300 text-gray-700 text-xs font-bold rounded-lg"
              >
                Clear
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2.5 bg-[#124DA6] text-white text-xs font-bold rounded-lg shadow-sm"
              >
                Show Results ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
