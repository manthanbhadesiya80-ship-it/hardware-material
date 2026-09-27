import React, { useState } from 'react';
import { Product, Brand, ProductReview, FAQItem } from '../../types';
import { ProductCard } from '../product/ProductCard';
import { useStore } from '../../context/StoreContext';
import {
  ShieldCheck,
  Truck,
  Sparkles,
  Headphones,
  Award,
  Layers,
  ChevronDown,
  CheckCircle2,
  Star,
  Quote,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';

// -------------------------------------------------------------
// 1. BEST SELLERS SECTION
// -------------------------------------------------------------
export const BestsellersSection: React.FC<{ products: Product[] }> = ({ products }) => {
  const { setCurrentPage } = useStore();
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);

  return (
    <section className="py-8 sm:py-12 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 sm:mb-8">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#E87500]">
              Customer & Carpenter Favorites
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#083B82] tracking-tight">
              Best Selling Hardware
            </h2>
          </div>
          <button
            onClick={() => setCurrentPage('shop', { bestSeller: true })}
            className="text-xs sm:text-sm font-bold text-[#124DA6] hover:text-[#083B82] flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>View All Bestsellers</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {bestSellers.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

// -------------------------------------------------------------
// 2. FEATURED ARCHITECTURAL HARDWARE
// -------------------------------------------------------------
export const FeaturedHardwareSection: React.FC<{
  products: Product[];
  title?: string;
  subtitle?: string;
  badge?: string;
}> = ({ products, title, subtitle, badge }) => {
  const { setCurrentPage } = useStore();
  const featured = products.filter(p => p.isFeatured).slice(0, 4);

  return (
    <section className="py-10 sm:py-16 bg-gradient-to-b from-[#F7F9FD] via-white to-[#F7F9FD] border-b border-blue-100/70 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/90 text-[#083B82] text-[11px] font-black uppercase tracking-wider mb-2.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#E87500]" />
              <span>{badge || 'Architectural Standard'}</span>
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#083B82] tracking-tight">
              {title || 'Featured Hardware Collections'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-xl mt-1.5 leading-relaxed">
              {subtitle || 'Curated high-grade hydraulic mechanisms, solid brass profiles, and certified heavy-duty fittings.'}
            </p>
          </div>

          <button
            onClick={() => setCurrentPage('shop', { featured: true })}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-[#083B82] text-[#083B82] hover:text-white border border-blue-200 hover:border-[#083B82] text-xs font-bold shadow-xs hover:shadow-md transition-all duration-200 group self-start sm:self-auto cursor-pointer"
          >
            <span>Explore All Featured</span>
            <ArrowRight className="w-4 h-4 text-[#E87500] group-hover:text-white group-hover:translate-x-1 transition-all" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-6">
          {featured.length > 0 ? (
            featured.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            products.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

// -------------------------------------------------------------
// 3. POPULAR BRANDS
// -------------------------------------------------------------
export const BrandsRow: React.FC<{
  brands: Brand[];
  title?: string;
  subtitle?: string;
  badge?: string;
}> = ({ brands, title, subtitle, badge }) => {
  const { setCurrentPage } = useStore();

  return (
    <section className="py-10 sm:py-16 bg-white border-b border-slate-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/90 text-[#E87500] text-[11px] font-black uppercase tracking-wider mb-2.5 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#E87500]" />
            <span>{badge || 'Authorized Hardware Partners'}</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#083B82] tracking-tight">
            {title || 'Top Brands You Trust'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5 leading-relaxed">
            {subtitle || 'Direct procurement from certified Indian & global hardware manufacturers with 100% genuine factory warranty.'}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {brands.map(brand => (
            <div
              key={brand.id}
              onClick={() => setCurrentPage('shop', { brand: brand.name })}
              className="bg-slate-50/70 hover:bg-white border border-slate-200/80 hover:border-[#083B82] rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1 group relative"
            >
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200/80 p-1.5 flex items-center justify-center mb-2.5 shadow-2xs group-hover:scale-105 group-hover:border-blue-200 transition-all overflow-hidden">
                <img src={brand.logo} alt={brand.name} className="w-full h-full object-cover rounded-xl" />
              </div>
              <h4 className="text-xs font-black text-slate-900 group-hover:text-[#083B82] transition-colors line-clamp-1">
                {brand.name}
              </h4>
              <p className="text-[10px] text-slate-400 truncate max-w-full font-medium mt-0.5">
                {brand.tagline}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// -------------------------------------------------------------
// 4. WHY CHOOSE DEVSHREE
// -------------------------------------------------------------
export const WhyChooseUs: React.FC = () => {
  const pillars = [
    {
      icon: <Award className="w-6 h-6 text-[#124DA6]" />,
      title: '100% Genuine Hardware',
      desc: 'Direct factory partnerships with Godrej, Europa, Polyfix, Devshree Pro.'
    },
    {
      icon: <Truck className="w-6 h-6 text-[#E87500]" />,
      title: '24-Hour Dispatch',
      desc: 'Swift express surface shipping with heavy packaging designed for metal fittings.'
    },
    {
      icon: <Layers className="w-6 h-6 text-[#124DA6]" />,
      title: 'Contractor Trade Pricing',
      desc: 'Special tiered wholesale rates and bulk crate deliveries across India.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#E87500]" />,
      title: 'GST Input Tax Invoices',
      desc: 'Eligible for 100% GST input credit for registered builders and interior firms.'
    },
    {
      icon: <Headphones className="w-6 h-6 text-[#124DA6]" />,
      title: 'Expert Carpenter Guidance',
      desc: 'Guidance on hydraulic piston weight, hinge angles, and lock backsets via WhatsApp.'
    },
    {
      icon: <Sparkles className="w-6 h-6 text-[#E87500]" />,
      title: 'Hassle-Free 7-Day Returns',
      desc: 'Instant replacement support if any fitting arrives damaged or incorrect.'
    }
  ];

  return (
    <section className="py-10 sm:py-14 bg-[#F7F9FC] border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span className="text-xs font-black uppercase tracking-wider text-[#E87500]">
            The Devshree Difference
          </span>
          <h2 className="text-xl sm:text-3xl font-extrabold text-[#083B82] tracking-tight mt-1">
            Why Contractors & Homeowners Choose Devshree
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Combining traditional hardware gallery trust with modern e-commerce reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {pillars.map((item, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs hover:border-[#124DA6]/40 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-center mb-3">
                {item.icon}
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// -------------------------------------------------------------
// 5. EASY 3-STEP ORDERING PROCESS
// -------------------------------------------------------------
export const OrderProcess: React.FC = () => {
  return (
    <section className="py-8 sm:py-12 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-black uppercase tracking-wider text-[#124DA6]">
            Friction-Free Ordering
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#083B82]">
            How Ordering Works at Devshree
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <div className="bg-[#F7F9FC] p-6 rounded-xl border border-gray-200 text-center relative">
            <div className="w-10 h-10 rounded-full bg-[#124DA6] text-white font-extrabold flex items-center justify-center mx-auto mb-3 text-sm shadow-xs">
              1
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">Pick Your Hardware</h3>
            <p className="text-xs text-gray-600">
              Browse bed fittings, hinges, locks, or send your material list on WhatsApp.
            </p>
          </div>

          <div className="bg-[#F7F9FC] p-6 rounded-xl border border-gray-200 text-center relative">
            <div className="w-10 h-10 rounded-full bg-[#E87500] text-white font-extrabold flex items-center justify-center mx-auto mb-3 text-sm shadow-xs">
              2
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">Instant Checkout or COD</h3>
            <p className="text-xs text-gray-600">
              Pay securely via UPI / Cards or select Cash on Delivery. Add GST number if applicable.
            </p>
          </div>

          <div className="bg-[#F7F9FC] p-6 rounded-xl border border-gray-200 text-center relative">
            <div className="w-10 h-10 rounded-full bg-[#083B82] text-white font-extrabold flex items-center justify-center mx-auto mb-3 text-sm shadow-xs">
              3
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">Delivered to Site</h3>
            <p className="text-xs text-gray-600">
              Dispatched in heavy damage-proof cartons with real-time tracking updates.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// -------------------------------------------------------------
// 6. CUSTOMER & CONTRACTOR REVIEWS
// -------------------------------------------------------------
export const TestimonialsSection: React.FC<{
  reviews: ProductReview[];
  title?: string;
  subtitle?: string;
  badge?: string;
}> = ({ reviews, title, subtitle, badge }) => {
  const displayedReviews = reviews.slice(0, 3);

  return (
    <section className="py-12 sm:py-18 bg-gradient-to-b from-[#F7F9FC] via-[#EEF4FB]/50 to-[#F7F9FC] border-b border-slate-200/90 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-blue-100/30 blur-3xl pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/90 text-[#E87500] text-[11px] font-black uppercase tracking-wider mb-2.5 shadow-2xs">
            <Award className="w-3.5 h-3.5 text-[#E87500]" />
            <span>{badge || 'Tested on Real Indian Sites'}</span>
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#083B82] tracking-tight">
            {title || 'What Carpenters & Builders Say'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5 leading-relaxed">
            {subtitle || 'Real feedback from master craftsmen, interior contractors, and modular furniture fabricators across India.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {displayedReviews.map(rev => (
            <div
              key={rev.id}
              className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-blue-300 transition-all duration-300 flex flex-col justify-between relative group"
            >
              <Quote className="w-12 h-12 text-blue-50 group-hover:text-blue-100/80 absolute top-5 right-5 pointer-events-none transition-colors" />

              <div className="relative z-10">
                <div className="flex items-center justify-between gap-2 mb-3.5">
                  <div className="flex items-center gap-1">
                    <div className="flex text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current drop-shadow-2xs" />
                      ))}
                    </div>
                    <span className="text-xs font-black text-slate-700 ml-1">
                      {rev.rating}.0
                    </span>
                  </div>
                  {rev.isVerifiedPurchase && (
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Verified Buyer</span>
                    </span>
                  )}
                </div>

                <h4 className="text-sm sm:text-base font-extrabold text-slate-900 mb-2 leading-snug">
                  "{rev.headline}"
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic mb-5">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#083B82] to-[#124DA6] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                  {rev.customerName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-slate-900 truncate">
                    {rev.customerName}
                  </p>
                  <p className="text-[10px] font-semibold text-[#124DA6] truncate mt-0.5">
                    {rev.productName}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// -------------------------------------------------------------
// 7. FREQUENTLY ASKED QUESTIONS
// -------------------------------------------------------------
export const FAQSection: React.FC<{ faqs: FAQItem[] }> = ({ faqs }) => {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  const toggle = (id: string) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <section className="py-10 sm:py-14 bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <span className="text-xs font-black uppercase tracking-wider text-[#124DA6]">
            Got Questions?
          </span>
          <h2 className="text-xl sm:text-3xl font-extrabold text-[#083B82] tracking-tight mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map(faq => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="border border-gray-200 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  className="w-full text-left p-4 sm:p-4.5 bg-gray-50 hover:bg-blue-50/50 flex items-center justify-between gap-4 transition-colors"
                >
                  <span className="text-xs sm:text-sm font-bold text-gray-900">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-[#124DA6]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="p-4 sm:p-4.5 bg-white text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
