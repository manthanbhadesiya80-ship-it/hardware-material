import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { api } from '../services/api';
import { FAQItem } from '../types';
import { DevshreeLogo } from '../components/common/DevshreeLogo';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Award,
  Truck,
  Building2,
  ChevronDown,
  Search,
  MessageCircle,
  CheckCircle2,
  Send
} from 'lucide-react';

// -------------------------------------------------------------
// ABOUT US PAGE
// -------------------------------------------------------------
export const AboutPage: React.FC = () => {
  const { setCurrentPage } = useStore();

  return (
    <div className="py-8 sm:py-14 bg-[#F7F9FC] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-6 sm:p-10 space-y-8">
          <div className="text-center space-y-4">
            <DevshreeLogo size="lg" className="mx-auto" />
            <h1 className="text-2xl sm:text-3xl font-black text-[#083B82]">
              The Story of Devshree - The Hardware Gallery
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Rooted in Rajkot, Gujarat — India's renowned engineering and hardware manufacturing heartland — Devshree represents trust, precision metallurgy, and reliable supply for the architectural and carpentry community.
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-6">
            <p>
              Founded with the vision to eliminate substandard hardware from the Indian furniture industry, <strong>Devshree - The Hardware Gallery</strong> bridges the gap between master carpenters, contractors, and authentic hardware manufacturers.
            </p>
            <p>
              Whether you are crafting a luxury king-size storage bed requiring heavy 1500N nitrogen hydraulic lifters, installing silent soft-close concealed hinges in a modular kitchen, or securing a family home with high-security brass mortise locks, Devshree delivers certified products directly to your doorstep with total quality transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 text-center">
              <Award className="w-6 h-6 text-[#124DA6] mx-auto mb-2" />
              <h4 className="font-bold text-gray-900 text-xs">Direct Factory Sourcing</h4>
              <p className="text-[11px] text-gray-500 mt-1">Zero middlemen, guaranteed genuine authentic fittings.</p>
            </div>
            <div className="p-4 bg-orange-50/60 rounded-xl border border-orange-100 text-center">
              <Building2 className="w-6 h-6 text-[#E87500] mx-auto mb-2" />
              <h4 className="font-bold text-gray-900 text-xs">Contractor Wholesale</h4>
              <p className="text-[11px] text-gray-500 mt-1">Special tiered trade rates and 100% compliant GST input invoices.</p>
            </div>
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 text-center">
              <Truck className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
              <h4 className="font-bold text-gray-900 text-xs">Pan-India Freight</h4>
              <p className="text-[11px] text-gray-500 mt-1">Surface logistics, crate packaging, and live shipment updates.</p>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-xs font-bold text-gray-900">Have a commercial project or inquiry?</p>
              <p className="text-[11px] text-gray-500">Our senior hardware specialists are ready to help.</p>
            </div>
            <button
              onClick={() => setCurrentPage('contact')}
              className="bg-[#124DA6] text-white text-xs font-bold py-2.5 px-6 rounded-xl hover:bg-[#083B82] transition-colors"
            >
              Contact Our Gallery Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// CONTACT US PAGE
// -------------------------------------------------------------
export const ContactPage: React.FC = () => {
  const { settings, showToast, openWhatsAppEnquiry } = useStore();
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      showToast('Please fill all required fields', 'error');
      return;
    }
    setSent(true);
    showToast('Your message has been received! We will connect within 24 hours.', 'success');
  };

  return (
    <div className="py-8 sm:py-12 bg-[#F7F9FC] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#083B82]">
            Contact Devshree Gallery
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Reach out for orders, bulk trade quotations, technical hardware sizing, or customer support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Details Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-2xs space-y-6">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Rajkot Gallery & Central Hub</h2>

            <div className="space-y-4 text-xs text-gray-600">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#E87500] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-900 block">Warehouse & Gallery Address:</strong>
                  <span>{settings.address}, {settings.city}, {settings.state} - {settings.pincode}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#124DA6] shrink-0" />
                <div>
                  <strong className="text-gray-900 block">Order Hotline:</strong>
                  <a href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`} className="hover:underline">
                    {settings.phone} / {settings.alternatePhone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#124DA6] shrink-0" />
                <div>
                  <strong className="text-gray-900 block">Email Support:</strong>
                  <a href={`mailto:${settings.email}`} className="hover:underline">
                    {settings.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400 shrink-0" />
                <div>
                  <strong className="text-gray-900 block">Working Hours:</strong>
                  <span>Monday - Saturday: 9:00 AM - 8:30 PM (IST)</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => openWhatsAppEnquiry()}
                className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs shadow-md transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat Instantly on WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Quick Message Form */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-2xs">
            {sent ? (
              <div className="text-center py-12 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-base font-bold text-gray-900">Message Received!</h3>
                <p className="text-xs text-gray-500">Thank you for getting in touch. We will reply shortly.</p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-2 text-xs font-bold text-[#124DA6] hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-base sm:text-lg font-bold text-gray-900">Send an Online Inquiry</h2>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-hidden focus:border-[#124DA6]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-hidden focus:border-[#124DA6]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-hidden focus:border-[#124DA6]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Your Message or Query *</label>
                  <textarea
                    rows={3}
                    required
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Ask about product sizing, delivery, or prices..."
                    className="w-full text-xs px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-hidden focus:border-[#124DA6]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#124DA6] hover:bg-[#083B82] text-white text-xs font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message to Devshree</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// FAQ PAGE
// -------------------------------------------------------------
export const FAQPage: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    api.getFaqs().then(setFaqs).catch(console.error);
  }, []);

  const categories = ['All', 'Orders & Delivery', 'Bulk & Contractor', 'Products & Warranty', 'Payment & Returns'];

  const filteredFaqs = faqs.filter(f => {
    if (selectedCat !== 'All' && f.category !== selectedCat) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="py-8 sm:py-12 bg-[#F7F9FC] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#083B82]">
            Help Center & FAQ
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Answers to common customer and contractor hardware purchasing questions.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search questions (e.g. bed fitting, delivery, COD, GST)..."
            className="w-full text-xs pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl shadow-2xs focus:outline-hidden focus:border-[#124DA6]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 text-xs">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`py-1.5 px-3.5 rounded-full font-bold whitespace-nowrap transition-colors ${
                selectedCat === cat
                  ? 'bg-[#124DA6] text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-3">
          {filteredFaqs.map(faq => {
            const isOpen = openId === faq.id;
            return (
              <div key={faq.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full text-left p-4 sm:p-4.5 flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-gray-900 hover:bg-blue-50/30"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-[#124DA6]' : ''}`} />
                </button>
                {isOpen && (
                  <div className="p-4 sm:p-4.5 bg-gray-50 border-t border-gray-100 text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// POLICIES PAGE
// -------------------------------------------------------------
export const PoliciesPage: React.FC = () => {
  const { pageParams } = useStore();
  const [activePolicy, setActivePolicy] = useState<'shipping' | 'returns' | 'privacy' | 'terms'>(
    pageParams.type || 'shipping'
  );

  useEffect(() => {
    if (pageParams.type) setActivePolicy(pageParams.type);
  }, [pageParams]);

  return (
    <div className="py-8 sm:py-12 bg-[#F7F9FC] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Policy Tab Switcher */}
        <div className="flex border-b border-gray-200 bg-white rounded-t-2xl px-4 overflow-x-auto text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActivePolicy('shipping')}
            className={`py-3.5 px-4 border-b-2 whitespace-nowrap transition-colors ${
              activePolicy === 'shipping' ? 'border-[#124DA6] text-[#124DA6]' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Shipping Policy
          </button>
          <button
            onClick={() => setActivePolicy('returns')}
            className={`py-3.5 px-4 border-b-2 whitespace-nowrap transition-colors ${
              activePolicy === 'returns' ? 'border-[#124DA6] text-[#124DA6]' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            7-Day Replacement Policy
          </button>
          <button
            onClick={() => setActivePolicy('privacy')}
            className={`py-3.5 px-4 border-b-2 whitespace-nowrap transition-colors ${
              activePolicy === 'privacy' ? 'border-[#124DA6] text-[#124DA6]' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setActivePolicy('terms')}
            className={`py-3.5 px-4 border-b-2 whitespace-nowrap transition-colors ${
              activePolicy === 'terms' ? 'border-[#124DA6] text-[#124DA6]' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Terms & Conditions
          </button>
        </div>

        {/* Content Body */}
        <div className="bg-white p-6 sm:p-10 rounded-b-2xl border-x border-b border-gray-200 shadow-xl text-xs sm:text-sm text-gray-600 leading-relaxed space-y-4">
          {activePolicy === 'shipping' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Pan-India Hardware Shipping Policy</h2>
              <p>
                At Devshree - The Hardware Gallery, we dispatch all catalog items directly from our warehouse hub in Rajkot, Gujarat.
              </p>
              <h4 className="font-bold text-gray-900 text-xs sm:text-sm">Dispatch Timelines:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Orders confirmed before 3:00 PM are dispatched on the same business day.</li>
                <li>Delivery within Gujarat (Rajkot, Ahmedabad, Surat, Vadodara, Morbi) generally takes 24 to 48 hours.</li>
                <li>Rest of India deliveries take 3 to 5 business days via surface express logistics (Blue Dart, Delhivery, V-Trans for heavy pallets).</li>
              </ul>
              <h4 className="font-bold text-gray-900 text-xs sm:text-sm">Free Delivery Threshold:</h4>
              <p>Orders above ₹999 qualify for 100% Free Express Delivery across India.</p>
            </div>
          )}

          {activePolicy === 'returns' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">7-Day Replacement Guarantee</h2>
              <p>
                We stand behind the engineering quality of every fitting we supply. If any item arrives damaged, defective, or incorrect:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Contact our WhatsApp support team at +91 81280 40556 within 7 days of delivery.</li>
                <li>Provide a photo of the received fitting and outer box packaging.</li>
                <li>We arrange free pickup and immediate dispatch of a brand new replacement unit.</li>
              </ul>
            </div>
          )}

          {activePolicy === 'privacy' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Privacy Policy</h2>
              <p>
                Devshree respects your personal data. Customer contact details and delivery addresses are utilized solely to process shipments, generate GST tax invoices, and communicate tracking milestones via SMS and WhatsApp.
              </p>
              <p>
                We never sell, rent, or distribute customer information to third-party telemarketers. All online payment data is encrypted using PCI-DSS certified gateway protocols.
              </p>
            </div>
          )}

          {activePolicy === 'terms' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Terms & Conditions</h2>
              <p>
                By placing an order on Devshree - The Hardware Gallery website, you agree to our standard trade conditions. Prices and availability are subject to periodic market steel and brass index updates. Invoices issued include applicable Goods and Services Tax (GST).
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
