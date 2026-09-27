import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  ShoppingCart,
  Zap,
  Star,
  CheckCircle2,
  ShieldCheck,
  Truck,
  MessageCircle,
  Layers,
  ArrowRight
} from 'lucide-react';

export const ProductQuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    closeQuickView,
    addToCart,
    setCurrentPage,
    openWhatsAppEnquiry
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    closeQuickView();
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    closeQuickView();
    setCurrentPage('checkout');
  };

  const handleViewFullDetails = () => {
    closeQuickView();
    setCurrentPage('product', { slug: product.slug });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={closeQuickView}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        <button
          onClick={closeQuickView}
          className="absolute top-3.5 right-3.5 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors z-20"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[85vh] overflow-y-auto">
          {/* Images Section */}
          <div className="p-6 bg-gray-50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-200">
            <div className="relative aspect-square rounded-xl bg-white p-4 flex items-center justify-center border border-gray-200 overflow-hidden shadow-2xs">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-contain"
              />
              {product.discountPercentage > 0 && (
                <span className="absolute top-3 left-3 bg-[#E87500] text-white text-xs font-black px-2 py-0.5 rounded">
                  {product.discountPercentage}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail selector */}
            {product.images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-14 h-14 rounded-lg border-2 p-1 bg-white shrink-0 transition-all ${
                      selectedImageIndex === idx ? 'border-[#124DA6] ring-2 ring-[#124DA6]/20' : 'border-gray-200'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details Section */}
          <div className="p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="font-bold text-[#124DA6] uppercase tracking-wider">
                  {product.brand}
                </span>
                <span>SKU: {product.sku}</span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <span className="text-xs font-bold text-gray-800">{product.rating.toFixed(1)}</span>
                <span className="text-xs text-gray-400">({product.reviewsCount} customer reviews)</span>
              </div>

              {/* Pricing */}
              <div className="flex items-baseline gap-3 py-1">
                <span className="text-2xl font-black text-[#083B82]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.mrp > product.price && (
                  <span className="text-sm text-gray-400 line-through">
                    ₹{product.mrp.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-xs font-bold text-emerald-600">
                  Save ₹{(product.mrp - product.price).toLocaleString('en-IN')}
                </span>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                {product.description}
              </p>

              {/* Specifications preview */}
              <div className="bg-gray-50 p-2.5 rounded-lg text-xs space-y-1 border border-gray-100">
                <p>
                  <strong className="text-gray-700">Material:</strong> {product.material}
                </p>
                {product.finish && (
                  <p>
                    <strong className="text-gray-700">Finish:</strong> {product.finish}
                  </p>
                )}
                {product.dimensions && (
                  <p>
                    <strong className="text-gray-700">Dimensions:</strong> {product.dimensions}
                  </p>
                )}
              </div>

              {/* Bulk Tier preview if available */}
              {product.bulkPricing && product.bulkPricing.length > 0 && (
                <div className="bg-amber-50/70 border border-amber-200/60 p-2 rounded-lg text-xs">
                  <p className="font-bold text-amber-900 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Contractor Bulk Pricing:</span>
                  </p>
                  <div className="flex gap-3 mt-1 text-[11px] text-amber-800 font-semibold">
                    {product.bulkPricing.map((tier, idx) => (
                      <span key={idx}>
                        {tier.minQty}+ units: ₹{tier.price}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions Bottom Bar */}
            <div className="pt-4 border-t border-gray-200 space-y-3 mt-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-xs font-bold text-gray-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-sm font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleAddToCart}
                  className="py-2.5 px-3 bg-[#124DA6] hover:bg-[#083B82] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="py-2.5 px-3 bg-[#E87500] hover:bg-[#F28C00] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  <span>Buy Now</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  onClick={() => openWhatsAppEnquiry(product)}
                  className="text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>Ask on WhatsApp</span>
                </button>
                <button
                  onClick={handleViewFullDetails}
                  className="text-[#124DA6] hover:underline font-bold flex items-center gap-1"
                >
                  <span>Full Specifications</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
