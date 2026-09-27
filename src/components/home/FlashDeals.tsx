import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { ProductCard } from '../product/ProductCard';
import { useStore } from '../../context/StoreContext';
import { Flame, Clock, ArrowRight } from 'lucide-react';

interface FlashDealsProps {
  products: Product[];
}

export const FlashDeals: React.FC<FlashDealsProps> = ({ products }) => {
  const { setCurrentPage } = useStore();

  // Mock deal countdown timer to end of day
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 25, seconds: 40 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dealProducts = products.filter(p => p.isOffer || p.discountPercentage >= 30).slice(0, 4);

  if (dealProducts.length === 0) return null;

  return (
    <section className="py-8 sm:py-12 bg-gradient-to-b from-orange-50/60 to-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E87500] text-white flex items-center justify-center shadow-md">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#083B82] tracking-tight">
                  Today's Super Deals
                </h2>
                <span className="bg-[#E87500] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                  Up to 35% OFF
                </span>
              </div>
              <p className="text-xs text-gray-500">Limited warehouse clearance & bulk trade promotions</p>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2 self-start sm:self-auto bg-white border border-orange-200/80 rounded-xl px-3 py-1.5 shadow-2xs">
            <Clock className="w-4 h-4 text-[#E87500]" />
            <span className="text-xs font-bold text-gray-700">Ends in:</span>
            <div className="flex items-center gap-1 text-xs font-mono font-black text-[#083B82]">
              <span className="bg-gray-100 px-1.5 py-0.5 rounded">{String(timeLeft.hours).padStart(2, '0')}h</span>
              <span>:</span>
              <span className="bg-gray-100 px-1.5 py-0.5 rounded">{String(timeLeft.minutes).padStart(2, '0')}m</span>
              <span>:</span>
              <span className="bg-gray-100 px-1.5 py-0.5 rounded">{String(timeLeft.seconds).padStart(2, '0')}s</span>
            </div>
          </div>
        </div>

        {/* Deals Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {dealProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => setCurrentPage('offers')}
            className="inline-flex items-center gap-1.5 bg-[#E87500] hover:bg-[#F28C00] text-white text-xs sm:text-sm font-bold py-2.5 px-6 rounded-lg shadow-sm transition-colors"
          >
            <span>View All Today's Offers & Coupons</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
