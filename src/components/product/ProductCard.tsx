import React from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import {
  Heart,
  Eye,
  ShoppingCart,
  Star,
  Zap,
  CheckCircle2,
  AlertTriangle,
  MessageCircle
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const {
    setCurrentPage,
    addToCart,
    openQuickView,
    toggleWishlist,
    isInWishlist,
    openWhatsAppEnquiry
  } = useStore();

  const isFavorite = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setCurrentPage('checkout');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleCardClick = () => {
    setCurrentPage('product', { slug: product.slug });
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative bg-white border border-gray-200 hover:border-[#124DA6]/40 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md flex flex-col cursor-pointer ${className}`}
    >
      {/* Badges Bar (Top Left) */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5 items-start pointer-events-none">
        {product.discountPercentage > 0 && (
          <span className="bg-[#E87500] text-white text-[11px] font-extrabold px-2 py-0.5 rounded shadow-xs tracking-wide">
            {product.discountPercentage}% OFF
          </span>
        )}
        {product.isBestSeller && (
          <span className="bg-[#083B82] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs uppercase tracking-wider">
            Best Seller
          </span>
        )}
      </div>

      {/* Wishlist Button (Top Right) */}
      <div className="absolute top-2.5 right-2.5 z-10">
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`p-2 rounded-full transition-colors shadow-xs ${
            isFavorite
              ? 'bg-red-50 text-red-600'
              : 'bg-white/90 backdrop-blur-xs text-gray-500 hover:text-red-500 hover:bg-white'
          }`}
          aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Product Image with Quick View Trigger */}
      <div className="relative aspect-square w-full bg-gray-50 overflow-hidden flex items-center justify-center p-3">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />

        {/* Hover Quick View overlay on desktop */}
        <div className="hidden md:flex absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center p-4">
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              openQuickView(product);
            }}
            className="bg-white/95 hover:bg-white text-gray-900 text-xs font-bold py-2 px-3.5 rounded-lg shadow-md flex items-center gap-1.5 transition-transform transform translate-y-2 group-hover:translate-y-0"
          >
            <Eye className="w-3.5 h-3.5 text-[#124DA6]" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Details Content */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Stock Pill */}
          <div className="flex items-center justify-between gap-1 text-[11px] text-gray-500 mb-1">
            <span className="font-semibold text-[#124DA6] uppercase tracking-wider truncate">
              {product.brand}
            </span>
            {isOutOfStock ? (
              <span className="text-red-600 font-bold flex items-center gap-0.5">
                <AlertTriangle className="w-3 h-3" /> Out of stock
              </span>
            ) : isLowStock ? (
              <span className="text-amber-600 font-bold">Only {product.stock} left</span>
            ) : (
              <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3" /> In Stock
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2 leading-snug group-hover:text-[#124DA6] transition-colors mb-1.5">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-bold text-gray-800">{product.rating.toFixed(1)}</span>
            <span className="text-[11px] text-gray-400">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Pricing & CTAs */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-baseline gap-2 mb-2.5">
            <span className="text-base sm:text-lg font-extrabold text-[#083B82]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.mrp > product.price && (
              <span className="text-xs text-gray-400 line-through">
                ₹{product.mrp.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Large, unmistakable Action Buttons */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className={`py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                isOutOfStock
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-50 text-[#124DA6] hover:bg-[#124DA6] hover:text-white border border-[#124DA6]/20'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>

            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleBuyNow}
              className={`py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                isOutOfStock
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-[#E87500] hover:bg-[#F28C00] text-white shadow-2xs'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Buy Now</span>
            </button>
          </div>

          {/* Quick WhatsApp Ask */}
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              openWhatsAppEnquiry(product);
            }}
            className="w-full mt-2 py-1 text-[11px] font-medium text-emerald-700 hover:text-emerald-800 flex items-center justify-center gap-1 hover:underline"
          >
            <MessageCircle className="w-3 h-3 text-[#25D366]" />
            <span>Ask on WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
