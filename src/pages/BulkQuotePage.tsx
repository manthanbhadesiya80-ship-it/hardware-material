import React, { useState } from 'react';
import { api } from '../services/api';
import { useStore } from '../context/StoreContext';
import {
  Building2,
  FileCheck,
  Truck,
  CheckCircle2,
  Phone,
  Send,
  Sparkles,
  Layers,
  Award
} from 'lucide-react';

export const BulkQuotePage: React.FC = () => {
  const { settings, showToast, openWhatsAppEnquiry } = useStore();
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
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.productsRequired) {
      showToast('Please provide your name, phone, and requirements', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.submitBulkEnquiry(formData);
      setIsSuccess(true);
      showToast('Bulk enquiry submitted! Our B2B manager will contact you promptly.', 'success');
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
      showToast('Error submitting quote. Please connect on WhatsApp directly.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-8 sm:py-12 bg-[#F7F9FC] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 bg-[#E87500] text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>Contractor & Architect Trade Desk</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#083B82] tracking-tight">
            Wholesale Hardware Quotations
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
            Direct warehouse pallet pricing, guaranteed authentic stock, and 100% compliant GST input invoices for builders, contractors, modular furniture factories, and project consultants.
          </p>
        </div>

        {/* 3 Pillars for Bulk Buyers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#124DA6] flex items-center justify-center mb-3">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">Tiered Wholesale Rates</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Substantial discounts for box and crate quantities on hydraulic bed lifts, hinges, screws, and adhesives.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#E87500] flex items-center justify-center mb-3">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">GST Tax Input Credit</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Every bulk consignment is dispatched with a legitimate GST tax invoice featuring your firm's GSTIN.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">Pallet Logistics Across India</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Safe crating and direct surface freight transit right to your factory or construction project site.
            </p>
          </div>
        </div>

        {/* Quote Form Container */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-6 sm:p-10">
          {isSuccess ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Bulk Quotation Request Received!
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
                Thank you for considering Devshree as your supply partner. Our wholesale hardware desk will analyze your bill of quantities and contact you via phone or WhatsApp within 2 hours.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={() => setIsSuccess(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold py-2.5 px-6 rounded-xl"
                >
                  Submit Another Project
                </button>
                <button
                  onClick={() => openWhatsAppEnquiry(undefined, 'Namaste! I just submitted a bulk quotation on the website.')}
                  className="bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold py-2.5 px-6 rounded-xl flex items-center justify-center gap-2"
                >
                  <span>Follow Up on WhatsApp</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-lg font-bold text-gray-900">Contractor Quotation Form</h2>
                <p className="text-xs text-gray-500">
                  Fill in your details below or send your bill of quantities / blueprint photos directly.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramesh Patel"
                    className="w-full text-xs px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-hidden focus:border-[#124DA6]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Company / Firm / Studio Name
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="e.g. Patel Modular Furniture"
                    className="w-full text-xs px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-hidden focus:border-[#124DA6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                    className="w-full text-xs px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-hidden focus:border-[#124DA6]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. ramesh@firm.com"
                    className="w-full text-xs px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-hidden focus:border-[#124DA6]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Project City / Destination
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Rajkot, Surat, Ahmedabad"
                    className="w-full text-xs px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-hidden focus:border-[#124DA6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Required Hardware Items & Specifications *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.productsRequired}
                  onChange={e => setFormData({ ...formData, productsRequired: e.target.value })}
                  placeholder="Please list items: e.g.
1. Devshree Hydraulic Bed Lift Mechanism 1500N - 25 Pairs
2. Soft-Close 3D Clip-On Hinges - 300 Pcs
3. 18-Inch Telescopic Slides - 50 Pairs
4. Black Drywall Screws 1.25 Inch - 15 Boxes"
                  className="w-full text-xs px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-hidden focus:border-[#124DA6]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Target Delivery Timeline / Estimated Order Value
                </label>
                <input
                  type="text"
                  value={formData.estimatedQuantity}
                  onChange={e => setFormData({ ...formData, estimatedQuantity: e.target.value })}
                  placeholder="e.g. Need within 5 days / Order budget approx ₹75,000"
                  className="w-full text-xs px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-hidden focus:border-[#124DA6]"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-[#E87500] hover:bg-[#F28C00] text-white font-extrabold text-xs sm:text-sm py-3 px-8 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting Specification...' : 'SUBMIT BULK QUOTE REQUEST'}</span>
                </button>

                <span className="text-xs text-gray-400">or</span>

                <button
                  type="button"
                  onClick={() => openWhatsAppEnquiry(undefined, 'Namaste! I would like to request a bulk wholesale hardware quote for my project.')}
                  className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span>Send Bill of Quantities via WhatsApp</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
