import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Truck,
  Tag,
  X
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    cartCount,
    cartSubtotal,
    cartSavings,
    appliedCoupon,
    couponDiscount,
    applyCouponCode,
    removeCoupon,
    setCurrentPage,
    settings
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const freeShippingThreshold = settings.freeShippingThreshold || 999;
  const isFreeShipping = cartSubtotal >= freeShippingThreshold;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  const shippingFee = isFreeShipping || cart.length === 0 ? 0 : settings.standardShippingFee || 79;
  const finalDiscount = couponDiscount;
  const taxableSubtotal = Math.max(0, cartSubtotal - finalDiscount);
  const finalTotal = taxableSubtotal + shippingFee;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplyingCoupon(true);
    await applyCouponCode(couponInput.trim().toUpperCase());
    setIsApplyingCoupon(false);
    setCouponInput('');
  };

  if (cart.length === 0) {
    return (
      <div className="py-20 px-4 bg-[#F7F9FC] min-h-[70vh] flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-gray-200 text-center shadow-2xs">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-[#124DA6] flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Your Hardware Cart is Empty</h2>
          <p className="text-xs text-gray-500 mb-6">
            Browse our wide collection of bed fittings, cabinet handles, hydraulic hinges, and tools.
          </p>
          <button
            onClick={() => setCurrentPage('shop')}
            className="w-full bg-[#124DA6] hover:bg-[#083B82] text-white text-xs font-bold py-3 px-6 rounded-xl shadow-sm transition-colors"
          >
            Start Shopping Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-10 bg-[#F7F9FC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-xl sm:text-3xl font-extrabold text-[#083B82] mb-6">
          Shopping Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
        </h1>

        {/* Free Shipping Progress Alert */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs mb-6">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="flex items-center gap-1.5 text-gray-800">
              <Truck className="w-4 h-4 text-[#124DA6]" />
              {isFreeShipping ? (
                <span className="text-emerald-700 font-extrabold">
                  🎉 Congratulations! You have unlocked FREE Express Delivery!
                </span>
              ) : (
                <span>
                  Add <strong className="text-[#E87500]">₹{amountNeededForFreeShipping}</strong> more for FREE Delivery!
                </span>
              )}
            </span>
            <span className="text-gray-500">{progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isFreeShipping ? 'bg-emerald-500' : 'bg-[#E87500]'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items List (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden divide-y divide-gray-100">
              {cart.map(item => {
                const prod = item.product;
                const linePrice = prod.price * item.quantity;

                return (
                  <div
                    key={prod.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    {/* Image & Title */}
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-contain bg-gray-50 border border-gray-200 p-1 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold uppercase text-[#124DA6] tracking-wider block">
                          {prod.brand}
                        </span>
                        <h3
                          onClick={() => setCurrentPage('product', { slug: prod.slug })}
                          className="text-xs sm:text-sm font-bold text-gray-900 truncate hover:text-[#124DA6] cursor-pointer"
                        >
                          {prod.name}
                        </h3>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          SKU: {prod.sku} {prod.dimensions ? `· ${prod.dimensions}` : ''}
                        </p>
                        <div className="flex items-center gap-2 mt-1 sm:hidden">
                          <span className="text-sm font-black text-[#083B82]">
                            ₹{prod.price.toLocaleString('en-IN')}
                          </span>
                          {prod.mrp > prod.price && (
                            <span className="text-[10px] text-gray-400 line-through">
                              ₹{prod.mrp.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quantity modifier and Line Price */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={() => updateCartQuantity(prod.id, item.quantity - 1)}
                          className="p-1.5 sm:p-2 bg-gray-100 hover:bg-gray-200 text-gray-700"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-gray-900">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(prod.id, item.quantity + 1)}
                          className="p-1.5 sm:p-2 bg-gray-100 hover:bg-gray-200 text-gray-700"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="hidden sm:block text-right min-w-[90px]">
                        <span className="text-sm font-black text-[#083B82] block">
                          ₹{linePrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          (₹{prod.price} each)
                        </span>
                      </div>

                      <button
                        onClick={() => removeFromCart(prod.id)}
                        className="text-gray-400 hover:text-red-600 p-1.5 transition-colors"
                        title="Remove item"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage('shop')}
              className="text-xs font-bold text-[#124DA6] hover:underline flex items-center gap-1.5 pt-2"
            >
              <span>← Continue Hardware Shopping</span>
            </button>
          </div>

          {/* Bill Summary Column (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-5">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-3">
                Order Summary
              </h2>

              {/* Coupon Code Input */}
              <div>
                {appliedCoupon ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-extrabold text-emerald-800 flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5" /> {appliedCoupon.code} applied!
                      </span>
                      <span className="text-[11px] text-emerald-600 block mt-0.5">
                        Saved ₹{couponDiscount} with this code
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-emerald-800 hover:text-red-600 p-1 font-bold"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Coupon (e.g. WELCOME10)"
                      className="flex-1 text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#124DA6]"
                    />
                    <button
                      type="submit"
                      disabled={isApplyingCoupon || !couponInput.trim()}
                      className="bg-gray-800 hover:bg-black text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
              </div>

              {/* Bill Details */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Bag Subtotal</span>
                  <span className="font-bold text-gray-900">
                    ₹{cartSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {cartSavings > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Retail MRP Discount</span>
                    <span className="font-bold">-₹{cartSavings.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {finalDiscount > 0 && (
                  <div className="flex justify-between text-[#E87500]">
                    <span>Coupon Discount</span>
                    <span className="font-bold">-₹{finalDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Express Shipping</span>
                  <span className="font-bold">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600">FREE</span>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-gray-500 text-[11px] pt-1">
                  <span>Estimated GST (18% included)</span>
                  <span>₹{Math.round(taxableSubtotal * 0.18).toLocaleString('en-IN')}</span>
                </div>

                <div className="border-t border-gray-200 pt-3 flex justify-between items-baseline text-sm">
                  <span className="font-bold text-gray-900">Total Payable</span>
                  <span className="text-xl font-black text-[#083B82]">
                    ₹{finalTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => setCurrentPage('checkout')}
                className="w-full bg-[#E87500] hover:bg-[#F28C00] text-white font-extrabold py-3.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all transform hover:scale-[1.01]"
              >
                <span>PROCEED TO SECURE CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center text-[11px] text-gray-500 space-y-1">
                <p className="flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-bit Bank Grade Encrypted Payment</span>
                </p>
                <p>Supports UPI, Cards, Net Banking & Cash on Delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
