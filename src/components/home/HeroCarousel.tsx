import React, { useState, useEffect } from 'react';
import { Banner } from '../../types';
import { useStore } from '../../context/StoreContext';
import { safeOpenUrl } from '../../utils/whatsappOrderNotifier';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';

interface HeroCarouselProps {
  banners: Banner[];
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ banners }) => {
  const { setCurrentPage } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeBanners = banners.filter(b => b.isActive).sort((a, b) => a.order - b.order);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activeBanners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) return null;

  const current = activeBanners[currentIndex] || activeBanners[0];

  const handleCtaClick = (link: string) => {
    if (link.startsWith('http')) {
      safeOpenUrl(link);
    } else if (link.startsWith('/category/')) {
      const slug = link.replace('/category/', '');
      setCurrentPage('category', { slug });
    } else if (link === '/bulk-quote') {
      setCurrentPage('bulk-quote');
    } else if (link === '/offers') {
      setCurrentPage('offers');
    } else {
      setCurrentPage('shop');
    }
  };

  return (
    <div className="relative w-full overflow-hidden bg-gray-900 aspect-[16/9] sm:aspect-[21/9] max-h-[520px]">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0">
        <img
          src={current.desktopImage}
          alt={current.title}
          className="w-full h-full object-cover object-center transition-all duration-700 transform scale-100"
        />
        {/* Dual tone rich gradient for Indian brand presence */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#083B82]/95 via-[#083B82]/80 to-transparent" />
      </div>

      {/* Slide Content */}
      <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div className="max-w-xl text-white space-y-3 sm:space-y-4 animate-in fade-in slide-in-from-left-4 duration-500">
          {current.badge && (
            <div className="inline-flex items-center gap-1.5 bg-[#E87500] text-white text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded shadow-xs">
              <Sparkles className="w-3 h-3" />
              <span>{current.badge}</span>
            </div>
          )}

          <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight drop-shadow-xs">
            {current.title}
          </h1>

          <p className="text-xs sm:text-sm lg:text-base text-blue-100 font-medium leading-relaxed max-w-lg">
            {current.subtitle}
          </p>

          <div className="pt-2 sm:pt-3 flex flex-wrap items-center gap-2.5 sm:gap-4">
            <button
              onClick={() => handleCtaClick(current.ctaLink)}
              className="bg-[#E87500] hover:bg-[#F28C00] text-white text-xs sm:text-sm font-extrabold py-2.5 sm:py-3 px-5 sm:px-6 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg flex items-center gap-2"
            >
              <span>{current.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {current.secondaryCtaText && current.secondaryCtaLink && (
              <button
                onClick={() => handleCtaClick(current.secondaryCtaLink!)}
                className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-xs border border-white/30 text-xs sm:text-sm font-bold py-2.5 sm:py-3 px-4 sm:px-5 rounded-lg transition-colors"
              >
                {current.secondaryCtaText}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Carousel Controls */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex(prev => (prev === 0 ? activeBanners.length - 1 : prev - 1))}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white transition-colors backdrop-blur-xs"
            aria-label="Previous Banner"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={() => setCurrentIndex(prev => (prev + 1) % activeBanners.length)}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white transition-colors backdrop-blur-xs"
            aria-label="Next Banner"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  currentIndex === idx ? 'w-6 bg-[#E87500]' : 'w-2 bg-white/60 hover:bg-white'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
