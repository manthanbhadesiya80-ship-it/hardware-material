import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Phone, ShieldCheck, Truck, Sparkles } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { settings, setCurrentPage } = useStore();

  if (!settings.isAnnouncementEnabled) return null;

  return (
    <div className="bg-[#083B82] text-white text-xs font-medium py-1.5 px-4 border-b border-[#083B82]/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left trust badges */}
        <div className="hidden lg:flex items-center gap-5 text-blue-100">
          <span className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-[#F28C00]" />
            Free Delivery on orders above ₹{settings.freeShippingThreshold}
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            100% Genuine Branded Hardware
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            GST Tax Invoices for Contractors
          </span>
        </div>

        {/* Center / Marquee on mobile */}
        <div className="flex-1 lg:flex-none text-center truncate px-2 font-medium tracking-wide">
          <span>{settings.announcementText}</span>
        </div>

        {/* Right direct hotline & Contractor CTA */}
        <div className="hidden sm:flex items-center gap-4 text-xs">
          <a
            href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
            className="flex items-center gap-1.5 text-blue-100 hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#F28C00]" />
            <span className="font-semibold">{settings.phone}</span>
          </a>
          <button
            onClick={() => setCurrentPage('bulk-quote')}
            className="bg-[#E87500] hover:bg-[#F28C00] text-white font-bold px-2.5 py-0.5 rounded text-[11px] uppercase tracking-wider transition-colors shadow-sm"
          >
            Bulk Orders
          </button>
        </div>
      </div>
    </div>
  );
};
