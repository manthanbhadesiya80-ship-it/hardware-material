import React from 'react';
import { useStore } from '../../context/StoreContext';
import { DevshreeLogo } from '../common/DevshreeLogo';
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Truck,
  ArrowUp,
  CreditCard,
  MessageCircle,
  Clock,
  Sparkles
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, setCurrentPage, openWhatsAppEnquiry } = useStore();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0f172a] text-gray-300 pt-12 pb-24 md:pb-12 border-t-4 border-[#124DA6]">
      {/* Top Value Proposition Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 border-b border-gray-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#124DA6]/20 border border-[#124DA6]/40 flex items-center justify-center text-[#F28C00] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Fast Dispatch</h4>
              <p className="text-[11px] text-gray-400">24-Hour Dispatch across India</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#124DA6]/20 border border-[#124DA6]/40 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">100% Genuine</h4>
              <p className="text-[11px] text-gray-400">Direct Factory Sourced</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#124DA6]/20 border border-[#124DA6]/40 flex items-center justify-center text-amber-400 shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Safe Payment & COD</h4>
              <p className="text-[11px] text-gray-400">UPI, Cards & Cash on Delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#124DA6]/20 border border-[#124DA6]/40 flex items-center justify-center text-[#25D366] shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Direct WhatsApp Help</h4>
              <p className="text-[11px] text-gray-400">Immediate Contractor Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <DevshreeLogo size="lg" inverted={true} />
            <p className="text-xs leading-relaxed text-gray-400 max-w-sm">
              Devshree - The Hardware Gallery is India's premier wholesale and retail destination for architectural hardware, heavy-duty hydraulic bed fittings, soft-close hinges, mortise locks, adhesives, and contractor fasteners.
            </p>
            <div className="pt-2 text-xs space-y-1 text-gray-400">
              <p className="flex items-center gap-2">
                <span className="text-[#F28C00] font-semibold">GSTIN:</span> {settings.gstNumber}
              </p>
              <p className="flex items-center gap-2">
                <span className="text-[#F28C00] font-semibold">Operating Hub:</span> Rajkot, Gujarat, India
              </p>
            </div>
          </div>

          {/* Quick Departments */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Hardware Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setCurrentPage('category', { slug: 'bed-fittings' })}
                  className="hover:text-white transition-colors"
                >
                  Bed Fittings & Hydraulic Lifts
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('category', { slug: 'furniture-hardware' })}
                  className="hover:text-white transition-colors"
                >
                  Soft-Close Hinges & Channels
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('category', { slug: 'cabinet-hardware' })}
                  className="hover:text-white transition-colors"
                >
                  Cabinet Handles & Profile Pulls
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('category', { slug: 'door-hardware' })}
                  className="hover:text-white transition-colors"
                >
                  Mortise Locks & Door Closers
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('category', { slug: 'fasteners' })}
                  className="hover:text-white transition-colors"
                >
                  Drywall Screws & Fasteners
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('category', { slug: 'adhesives' })}
                  className="hover:text-white transition-colors"
                >
                  Polyfix Instant Glues & Sealants
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service & Contractor */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Customer & Contractor
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setCurrentPage('bulk-quote')}
                  className="text-[#F28C00] hover:underline font-semibold flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Request Bulk Contractor Quote</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('my-orders')}
                  className="hover:text-white transition-colors"
                >
                  Track Order Status
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('offers')}
                  className="hover:text-white transition-colors"
                >
                  Coupons & Special Deals
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('faq')}
                  className="hover:text-white transition-colors"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('policies', { type: 'shipping' })}
                  className="hover:text-white transition-colors"
                >
                  Shipping & Delivery Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('policies', { type: 'returns' })}
                  className="hover:text-white transition-colors"
                >
                  7-Day Replacement Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('policies', { type: 'privacy' })}
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy & Terms
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Contact Devshree
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#F28C00] shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {settings.address}, {settings.city}, {settings.state} - {settings.pincode}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#F28C00] shrink-0" />
                <a href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-white">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#F28C00] shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white">
                  {settings.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#F28C00] shrink-0" />
                <span>Mon - Sat: 9:00 AM - 8:30 PM</span>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => openWhatsAppEnquiry()}
                  className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-2 text-xs transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <p>© {new Date().getFullYear()} DEVSHREE - The Hardware Gallery. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <button
            onClick={() => setCurrentPage('admin')}
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            Admin Access
          </button>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
