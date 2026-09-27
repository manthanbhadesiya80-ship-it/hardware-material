import React, { useState } from 'react';
import { api } from '../../services/api';
import { useStore } from '../../context/StoreContext';
import {
  Building2,
  FileSpreadsheet,
  Truck,
  CheckCircle2,
  Send,
  Sparkles,
  Phone
} from 'lucide-react';

export const ContractorBulkSection: React.FC = () => {
  const { showToast, settings } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    phone: '',
    email: '',
    city: '',
    productsRequired: '',
    estimatedQuantity: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.productsRequired) {
      showToast('Please provide your name, phone number, and required hardware items', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.submitBulkEnquiry(formData);
      setIsSubmitted(true);
      showToast('Bulk quote request sent! Our Rajkot desk will contact you within 2 hours.', 'success');
      setFormData({
        name: '',
        companyName: '',
        phone: '',
        email: '',
        city: '',
        productsRequired: '',
        estimatedQuantity: ''
      });
    } catch {
      showToast('Could not submit inquiry right now. Please call or WhatsApp us directly.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-10 sm:py-16 bg-[#083B82] text-white relative overflow-hidden">
      {/* Decorative Blueprint Grid background */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Info Column */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 bg-[#E87500] text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded">
              <Building2 className="w-3.5 h-3.5" />
              <span>B2B & Contractor Supply Program</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Direct Wholesale Supply for Contractors, Carpenters & Builders
            </h2>

            <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
              Equipping hotel projects, multi-flat apartments, and bespoke furniture workshops with authentic certified hardware at factory direct trade rates.
            </p>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-white">
                <CheckCircle2 className="w-5 h-5 text-[#F28C00] shrink-0" />
                <span>Tiered Wholesale Discounts</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-white">
                <FileSpreadsheet className="w-5 h-5 text-[#F28C00] shrink-0" />
                <span>100% Valid GST Tax Invoice</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-white">
                <Truck className="w-5 h-5 text-[#F28C00] shrink-0" />
                <span>Pallet & Crate Logistics</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-white">
                <Sparkles className="w-5 h-5 text-[#F28C00] shrink-0" />
                <span>Custom Size & Specs Sourcing</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-4 py-2 rounded-lg text-xs transition-colors"
              >
                <Phone className="w-4 h-4 text-[#F28C00]" />
                <span>Direct B2B Hotline: {settings.phone}</span>
              </a>
            </div>
          </div>

          {/* Right Quote Request Form */}
          <div className="lg:col-span-6 bg-white text-[#15191F] p-6 sm:p-8 rounded-2xl shadow-2xl border border-blue-200">
            {isSubmitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Quotation Request Received!</h3>
                <p className="text-xs text-gray-600 max-w-sm mx-auto">
                  Thank you! Our senior hardware consultant will review your material specifications and WhatsApp/call you with competitive trade pricing and delivery schedules.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-3 text-xs font-bold text-[#124DA6] hover:underline"
                >
                  Submit another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="border-b border-gray-100 pb-2">
                  <h3 className="text-base sm:text-lg font-extrabold text-[#083B82]">
                    Request a Contractor Wholesale Quote
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Get custom pallet pricing within 2 working hours.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rajesh Suthar"
                      className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#124DA6]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Company / Workshop Name
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="e.g. Om Modular Interiors"
                      className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#124DA6]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Mobile Number (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98250 XXXXX"
                      className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#124DA6]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      City / Project Location
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Rajkot, Surat, Mumbai"
                      className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#124DA6]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Hardware Items Required *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formData.productsRequired}
                    onChange={e => setFormData({ ...formData, productsRequired: e.target.value })}
                    placeholder="e.g. 50 pairs 1500N Hydraulic Bed Lifts, 400 Soft-Close Hinges, 20 boxes Drywall Screws..."
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#124DA6]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Estimated Quantity / Budget
                  </label>
                  <input
                    type="text"
                    value={formData.estimatedQuantity}
                    onChange={e => setFormData({ ...formData, estimatedQuantity: e.target.value })}
                    placeholder="e.g. 100 units / Approx ₹50,000"
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#124DA6]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#E87500] hover:bg-[#F28C00] text-white font-bold py-2.5 px-4 rounded-lg text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending Request...' : 'REQUEST BULK QUOTE NOW'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
