import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { useAdmin } from '../context/AdminContext';
import { api } from '../services/api';
import { Product, ProductReview } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import { ConfirmModal } from '../components/common/ConfirmModal';
import {
  Star,
  ShoppingCart,
  Zap,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  MessageCircle,
  FileSpreadsheet,
  Layers,
  MapPin,
  Share2,
  Check,
  Send,
  Plus,
  Trash2
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const {
    pageParams,
    setCurrentPage,
    addToCart,
    toggleWishlist,
    isInWishlist,
    openWhatsAppEnquiry,
    showToast
  } = useStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeChecked, setPincodeChecked] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'desc' | 'shipping' | 'reviews'>('specs');
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAdmin();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // New review form
  const [reviewForm, setReviewForm] = useState({
    customerName: '',
    rating: 5,
    headline: '',
    comment: ''
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const slug = pageParams.slug || pageParams.id;

  useEffect(() => {
    async function loadProduct() {
      if (!slug) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const prod = await api.getProductByIdOrSlug(slug);
        setProduct(prod);

        // Fetch reviews and related items
        const [revs, allProds] = await Promise.all([
          api.getReviews(prod.id),
          api.getProducts({ category: prod.category })
        ]);
        setReviews(revs);
        setRelatedProducts(allProds.filter(p => p.id !== prod.id).slice(0, 4));
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#124DA6] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-gray-600">Loading Product Specifications...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Product Not Found</h2>
        <p className="text-xs text-gray-500 mb-6">The hardware item you requested may have been archived or moved.</p>
        <button
          onClick={() => setCurrentPage('shop')}
          className="bg-[#124DA6] text-white text-xs font-bold py-2.5 px-6 rounded-lg"
        >
          Return to Hardware Shop
        </button>
      </div>
    );
  }

  const isFavorite = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    setCurrentPage('checkout');
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6) {
      setPincodeChecked(true);
      showToast('Express delivery available at pincode ' + pincode, 'success');
    } else {
      showToast('Please enter a valid 6-digit Indian PIN code', 'error');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.customerName || !reviewForm.headline || !reviewForm.comment) {
      showToast('Please fill all review fields', 'error');
      return;
    }
    setIsSubmittingReview(true);
    try {
      const newRev = await api.submitReview({
        productId: product.id,
        productName: product.name,
        customerName: reviewForm.customerName,
        rating: reviewForm.rating,
        headline: reviewForm.headline,
        comment: reviewForm.comment
      });
      setReviews(prev => [newRev, ...prev]);
      showToast('Thank you! Your verified review has been submitted.', 'success');
      setReviewForm({ customerName: '', rating: 5, headline: '', comment: '' });
    } catch {
      showToast('Failed to submit review', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} at Devshree - The Hardware Gallery`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard', 'info');
    }
  };

  const handleDeleteProduct = async () => {
    if (!product) return;
    setIsDeleting(true);
    try {
      await api.deleteProduct(product.id);
      showToast(`Product "${product.name}" deleted from database`, 'info');
      setCurrentPage('shop');
    } catch {
      showToast('Failed to delete product', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="py-6 sm:py-10 bg-[#F7F9FC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Quick Action Bar (Visible when admin is authenticated) */}
        {isAuthenticated && (
          <div className="mb-5 bg-amber-50/90 border border-amber-200 rounded-2xl p-3.5 px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2.5 text-xs text-amber-950 font-bold">
              <ShieldCheck className="w-4 h-4 text-[#124DA6]" />
              <span>Admin Hardware Controls:</span>
              <span className="text-gray-500 font-medium">SKU: {product.sku} · Stock: {product.stock} units</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage('admin')}
                className="px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl transition-colors"
              >
                Open in Admin Panel
              </button>
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
                title="Delete this hardware product"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Product</span>
              </button>
            </div>
          </div>
        )}

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6 flex-wrap">
          <button onClick={() => setCurrentPage('home')} className="hover:underline">
            Home
          </button>
          <span>/</span>
          <button
            onClick={() => setCurrentPage('category', { slug: product.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') })}
            className="hover:underline"
          >
            {product.category}
          </button>
          <span>/</span>
          <span className="text-gray-900 font-semibold truncate max-w-xs">{product.name}</span>
        </div>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white p-5 sm:p-8 rounded-2xl border border-gray-200 shadow-2xs mb-10">
          {/* Gallery Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-square rounded-2xl bg-gray-50 p-4 border border-gray-200 overflow-hidden flex items-center justify-center">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
              />

              {product.discountPercentage > 0 && (
                <span className="absolute top-3 left-3 bg-[#E87500] text-white text-xs font-black px-2.5 py-1 rounded shadow-xs">
                  {product.discountPercentage}% OFF
                </span>
              )}

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-3 right-3 p-2.5 rounded-full transition-colors shadow-xs ${
                  isFavorite ? 'bg-red-50 text-red-600' : 'bg-white text-gray-500 hover:text-red-500'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl border-2 p-1 bg-white shrink-0 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-[#124DA6] ring-2 ring-[#124DA6]/20'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Badges Bar */}
            <div className="grid grid-cols-3 gap-2 pt-3 text-center border-t border-gray-100">
              <div className="p-2 bg-gray-50 rounded-lg">
                <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-gray-700 block">100% Genuine</span>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg">
                <RotateCcw className="w-4 h-4 text-[#124DA6] mx-auto mb-1" />
                <span className="text-[10px] font-bold text-gray-700 block">7-Day Return</span>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg">
                <FileSpreadsheet className="w-4 h-4 text-[#E87500] mx-auto mb-1" />
                <span className="text-[10px] font-bold text-gray-700 block">GST Invoice</span>
              </div>
            </div>
          </div>

          {/* Details Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-[#124DA6]">
                  {product.brand} · {product.category}
                </span>
                <button
                  onClick={handleShare}
                  className="text-xs font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>

              <h1 className="text-lg sm:text-2xl font-extrabold text-gray-900 leading-snug">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                  <span className="font-extrabold text-amber-900">{product.rating.toFixed(1)}</span>
                  <span className="text-gray-400">({product.reviewsCount} reviews)</span>
                </div>
                <span className="text-gray-400">SKU: <strong className="text-gray-700">{product.sku}</strong></span>
                {product.stock > 0 ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> In Stock ({product.stock} units ready)
                  </span>
                ) : (
                  <span className="text-red-600 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Out of stock
                  </span>
                )}
              </div>

              {/* Price Block */}
              <div className="bg-[#F7F9FC] p-4 rounded-xl border border-gray-200 flex flex-wrap items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-black text-[#083B82]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.mrp > product.price && (
                  <span className="text-sm sm:text-base text-gray-400 line-through">
                    ₹{product.mrp.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-xs font-black text-[#E87500] bg-orange-100/70 px-2 py-0.5 rounded">
                  SAVE ₹{(product.mrp - product.price).toLocaleString('en-IN')} ({product.discountPercentage}% OFF)
                </span>
                <span className="w-full text-[11px] text-gray-500">
                  (Inclusive of all taxes & standard warranty)
                </span>
              </div>

              {/* Bulk Contractor Tier Price Table */}
              {product.bulkPricing && product.bulkPricing.length > 0 && (
                <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3.5">
                  <h4 className="text-xs font-extrabold text-amber-900 flex items-center gap-1.5 mb-2">
                    <Layers className="w-4 h-4 text-[#E87500]" />
                    <span>Contractor & Bulk Tier Pricing</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <div className="bg-white p-2 rounded-lg border border-amber-200 text-center">
                      <span className="text-[10px] text-gray-500 block">1 - 4 units</span>
                      <strong className="text-xs text-gray-900 font-bold">₹{product.price} / unit</strong>
                    </div>
                    {product.bulkPricing.map((tier, idx) => (
                      <div key={idx} className="bg-white p-2 rounded-lg border border-amber-300 text-center shadow-2xs">
                        <span className="text-[10px] text-amber-800 font-bold block">{tier.minQty}+ units</span>
                        <strong className="text-xs text-[#083B82] font-black">₹{tier.price} / unit</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector & Main Buttons */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-gray-700">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white shadow-2xs">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-sm font-bold"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 text-xs font-black text-gray-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-sm font-bold"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-gray-500">
                    Total: <strong className="text-[#083B82]">₹{(product.price * quantity).toLocaleString('en-IN')}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    disabled={isOutOfStock}
                    onClick={handleAddToCart}
                    className={`py-3.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all ${
                      isOutOfStock
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-[#124DA6] hover:bg-[#083B82] text-white shadow-md'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>ADD TO CART</span>
                  </button>

                  <button
                    disabled={isOutOfStock}
                    onClick={handleBuyNow}
                    className={`py-3.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all ${
                      isOutOfStock
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-[#E87500] hover:bg-[#F28C00] text-white shadow-md'
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    <span>BUY NOW</span>
                  </button>
                </div>

                {/* WhatsApp Direct Product Enquiry */}
                <button
                  onClick={() => openWhatsAppEnquiry(product)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>Enquire on WhatsApp (Send Details & Get Bulk Quotation)</span>
                </button>
              </div>

              {/* Delivery Pincode Checker */}
              <div className="border-t border-gray-200 pt-4">
                <form onSubmit={handleCheckPincode} className="flex items-center gap-2 max-w-sm">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      maxLength={6}
                      value={pincode}
                      onChange={e => setPincode(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 6-digit Pincode"
                      className="w-full text-xs pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#124DA6]"
                    />
                    <MapPin className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                  <button
                    type="submit"
                    className="bg-gray-800 hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                  >
                    Check
                  </button>
                </form>
                {pincodeChecked && (
                  <p className="text-[11px] text-emerald-700 font-semibold mt-1.5 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Delivery in 2-3 business days to PIN {pincode} (Gujarat standard 24-48 hrs).</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden mb-12">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 overflow-x-auto text-xs font-bold uppercase tracking-wider">
            <button
              onClick={() => setActiveTab('specs')}
              className={`py-3.5 px-6 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'specs'
                  ? 'border-[#124DA6] text-[#124DA6] bg-blue-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Technical Specifications
            </button>
            <button
              onClick={() => setActiveTab('desc')}
              className={`py-3.5 px-6 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'desc'
                  ? 'border-[#124DA6] text-[#124DA6] bg-blue-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Description & Features
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`py-3.5 px-6 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'shipping'
                  ? 'border-[#124DA6] text-[#124DA6] bg-blue-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Shipping & 7-Day Returns
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-3.5 px-6 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'reviews'
                  ? 'border-[#124DA6] text-[#124DA6] bg-blue-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Verified Reviews ({reviews.length})
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {activeTab === 'specs' && (
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-gray-900">
                  Engineering & Material Specifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100 text-xs">
                    <span className="text-gray-500">Material</span>
                    <span className="font-bold text-gray-900">{product.material}</span>
                  </div>
                  {product.finish && (
                    <div className="flex justify-between py-2 border-b border-gray-100 text-xs">
                      <span className="text-gray-500">Finish / Coating</span>
                      <span className="font-bold text-gray-900">{product.finish}</span>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="flex justify-between py-2 border-b border-gray-100 text-xs">
                      <span className="text-gray-500">Dimensions</span>
                      <span className="font-bold text-gray-900">{product.dimensions}</span>
                    </div>
                  )}
                  {product.weight && (
                    <div className="flex justify-between py-2 border-b border-gray-100 text-xs">
                      <span className="text-gray-500">Net Weight</span>
                      <span className="font-bold text-gray-900">{product.weight}</span>
                    </div>
                  )}
                  {Object.entries(product.specifications || {}).map(([key, val]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100 text-xs">
                      <span className="text-gray-500">{key}</span>
                      <span className="font-bold text-gray-900">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'desc' && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2">Product Overview</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>

                {product.features && product.features.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">
                      Key Highlights
                    </h4>
                    <ul className="space-y-2">
                      {product.features.map((feat, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-gray-700">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4 max-w-2xl text-xs text-gray-600 leading-relaxed">
                <h3 className="text-sm font-bold text-gray-900">Delivery & Return Terms</h3>
                <p>
                  <strong>Dispatch:</strong> Orders placed before 3:00 PM are dispatched on the same business day from Devshree Warehouse in Rajkot, Gujarat.
                </p>
                <p>
                  <strong>Packaging:</strong> All metal fittings, hydraulic pumps, and locksets are wrapped in multi-layer bubble wrap and impact-resistant cartons to prevent scratching or transit damage.
                </p>
                <p>
                  <strong>7-Day Replacement Guarantee:</strong> If the product arrives with manufacturing defects or transit damage, we offer prompt doorstep pickup and free replacement.
                </p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8">
                {/* Reviews List */}
                <div className="space-y-4">
                  {reviews.length > 0 ? (
                    reviews.map(rev => (
                      <div key={rev.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex text-amber-500">
                            {[...Array(rev.rating)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-current" />
                            ))}
                          </div>
                          <span className="text-[10px] text-gray-400">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-gray-900 mb-1">{rev.headline}</h4>
                        <p className="text-xs text-gray-600 leading-relaxed italic">{rev.comment}</p>
                        <p className="text-[11px] font-semibold text-[#124DA6] mt-2">
                          — {rev.customerName}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500">Be the first carpenter or homeowner to review this product!</p>
                  )}
                </div>

                {/* Write Review Form */}
                <div className="border-t border-gray-200 pt-6 max-w-xl">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Leave a Verified Review</h3>
                  <form onSubmit={handleReviewSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Your Name (e.g. Ramesh Carpenter)
                      </label>
                      <input
                        type="text"
                        required
                        value={reviewForm.customerName}
                        onChange={e => setReviewForm({ ...reviewForm, customerName: e.target.value })}
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#124DA6]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Rating (Stars)
                      </label>
                      <select
                        value={reviewForm.rating}
                        onChange={e => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#124DA6]"
                      >
                        <option value={5}>5 Stars - Excellent Quality</option>
                        <option value={4}>4 Stars - Very Good</option>
                        <option value={3}>3 Stars - Average</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Review Headline
                      </label>
                      <input
                        type="text"
                        required
                        value={reviewForm.headline}
                        onChange={e => setReviewForm({ ...reviewForm, headline: e.target.value })}
                        placeholder="e.g. Heavy duty quality, very smooth lift"
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#124DA6]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Your Feedback
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={reviewForm.comment}
                        onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        placeholder="Share your practical experience with this hardware..."
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#124DA6]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="bg-[#124DA6] hover:bg-[#083B82] text-white text-xs font-bold py-2.5 px-5 rounded-lg flex items-center gap-1.5 shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmittingReview ? 'Submitting...' : 'Post Review'}</span>
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <div className="mb-12">
            <h3 className="text-base sm:text-xl font-extrabold text-[#083B82] mb-6">
              Frequently Bought Together in {product.category}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete Product Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Hardware Product?"
        message={`Are you sure you want to permanently delete "${product.name}" (SKU: ${product.sku}) from the catalog? This action will remove it from all storefront listings.`}
        confirmText="Yes, Delete Product"
        cancelText="Cancel"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={handleDeleteProduct}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};
