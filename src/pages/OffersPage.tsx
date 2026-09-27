import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Coupon, Offer, Product } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import { useStore } from '../context/StoreContext';
import { Tag, Sparkles, Copy, Check, ArrowRight, Flame } from 'lucide-react';

export const OffersPage: React.FC = () => {
  const { applyCouponCode, setCurrentPage, showToast } = useStore();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [dealProducts, setDealProducts] = useState<Product[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    async function loadOffers() {
      try {
        const [c, o, p] = await Promise.all([
          api.getCoupons(),
          api.getOffers(),
          api.getProducts({ offer: true })
        ]);
        setCoupons(c.filter(item => item.isActive));
        setOffers(o.filter(item => item.isActive));
        setDealProducts(p);
      } catch (err) {
        console.error('Error fetching offers:', err);
      }
    }
    loadOffers();
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Coupon code ${code} copied!`, 'info');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleApplyToCart = async (code: string) => {
    handleCopy(code);
    await applyCouponCode(code);
    setCurrentPage('cart');
  };

  return (
    <div className="py-8 sm:py-12 bg-[#F7F9FC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 bg-[#E87500] text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Special Promotional Deals</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#083B82] tracking-tight">
            Today's Coupons & Offers
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Use verified coupon codes at checkout for instant savings on hardware, bed fittings, and tools.
          </p>
        </div>

        {/* Coupons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {coupons.map(coupon => (
            <div
              key={coupon.id}
              className="bg-white rounded-2xl border-2 border-dashed border-[#124DA6]/40 p-5 shadow-2xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-[#124DA6] px-2 py-0.5 rounded">
                    {coupon.discountType === 'percentage'
                      ? `${coupon.discountValue}% DISCOUNT`
                      : `FLAT ₹${coupon.discountValue} OFF`}
                  </span>
                  <Tag className="w-4 h-4 text-[#E87500]" />
                </div>

                <div className="pt-2">
                  <h3 className="text-lg font-black text-[#083B82] font-mono tracking-wider">
                    {coupon.code}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {coupon.description}
                  </p>
                </div>

                <p className="text-[11px] text-gray-400">
                  Minimum Order Value: <strong>₹{coupon.minOrderValue}</strong>
                  {coupon.maxDiscount && ` · Max Discount: ₹${coupon.maxDiscount}`}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center gap-2">
                <button
                  onClick={() => handleCopy(coupon.code)}
                  className="flex-1 py-2 px-3 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedCode === coupon.code ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleApplyToCart(coupon.code)}
                  className="flex-1 py-2 px-3 bg-[#E87500] hover:bg-[#F28C00] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-colors"
                >
                  <span>Apply & Shop</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Promotional Banners */}
        {offers.length > 0 && (
          <div className="mb-12">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#E87500]" />
              <span>Category Special Campaigns</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {offers.map(off => (
                <div
                  key={off.id}
                  onClick={() => {
                    if (off.link.startsWith('/category/')) {
                      setCurrentPage('category', { slug: off.link.replace('/category/', '') });
                    } else {
                      setCurrentPage('shop');
                    }
                  }}
                  className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-md h-56 flex items-end p-6 text-white"
                >
                  <img
                    src={off.bannerImage}
                    alt={off.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                  <div className="relative z-10 space-y-1.5">
                    <span className="bg-[#E87500] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded inline-block">
                      {off.discountTag}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold">{off.title}</h3>
                    <p className="text-xs text-gray-200 line-clamp-2">{off.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products on Sale */}
        {dealProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg sm:text-2xl font-bold text-[#083B82]">
                Discounted Hardware Products
              </h2>
              <button
                onClick={() => setCurrentPage('shop', { offer: true })}
                className="text-xs font-bold text-[#124DA6] hover:underline"
              >
                View all offers →
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {dealProducts.slice(0, 8).map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
