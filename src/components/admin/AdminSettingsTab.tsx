import React, { useState, useRef } from 'react';
import { StoreSettings } from '../../types';
import { useStore } from '../../context/StoreContext';
import { DevshreeLogo } from '../common/DevshreeLogo';
import { safeOpenUrl } from '../../utils/whatsappOrderNotifier';
import {
  Save,
  Settings,
  Phone,
  MapPin,
  Truck,
  Bot,
  Megaphone,
  ShieldCheck,
  Image as ImageIcon,
  Upload,
  RotateCcw,
  Check,
  Eye
} from 'lucide-react';

export const AdminSettingsTab: React.FC = () => {
  const { settings, updateSettings, showToast } = useStore();
  const [formData, setFormData] = useState<StoreSettings>({ ...settings });
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file (PNG, JPG, SVG, WebP)', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('File size must be less than 5MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFormData(prev => ({ ...prev, logoUrl: result }));
      showToast('New logo image loaded. Click "Save Settings" to publish!', 'info');
    };
    reader.readAsDataURL(file);
  };

  const handleResetToDefaultLogo = () => {
    setFormData(prev => ({ ...prev, logoUrl: '' }));
    showToast('Reset to original authentic Devshree vector logo', 'info');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings(formData);
    } catch {
      showToast('Failed to save settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-xs">
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
        <div>
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#124DA6]" />
            <span>Store Configuration & Policies</span>
          </h3>
          <p className="text-[11px] text-gray-500">
            Control brand logo, hotlines, GST details, shipping rules, and AI chatbot prompts.
          </p>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="bg-[#124DA6] hover:bg-[#083B82] text-white text-xs font-bold py-2.5 px-6 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {/* 0. Brand Logo Management */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-5">
        <div className="flex items-center justify-between border-b pb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#E87500]" />
            <span>Store Logo & Brand Insignia</span>
          </h4>
          {formData.logoUrl && (
            <button
              type="button"
              onClick={handleResetToDefaultLogo}
              className="text-[11px] font-bold text-[#E87500] hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to Original Devshree Logo</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Logo Upload & URL Options (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Upload New Logo File (PNG, JPG, SVG, WebP)
              </label>
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-4 py-2.5 rounded-xl border border-gray-300 flex items-center gap-2 text-xs transition-colors"
                >
                  <Upload className="w-4 h-4 text-[#124DA6]" />
                  <span>Choose Logo File...</span>
                </button>
                <span className="text-[11px] text-gray-400">
                  Recommended height: 60px – 120px (transparent PNG or SVG)
                </span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Or Enter Public Logo Image URL
              </label>
              <input
                type="url"
                value={formData.logoUrl || ''}
                onChange={e => setFormData({ ...formData, logoUrl: e.target.value })}
                placeholder="https://example.com/my-hardware-logo.png"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:bg-white focus:border-[#124DA6]"
              />
              <p className="text-[10px] text-gray-400 mt-1">
                Leave empty to use the built-in authentic Devshree vector identity.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={async () => {
                  setIsSaving(true);
                  try {
                    await updateSettings({ ...settings, logoUrl: formData.logoUrl });
                    showToast('Logo published across storefront and admin!', 'success');
                  } catch {
                    showToast('Failed to save logo', 'error');
                  } finally {
                    setIsSaving(false);
                  }
                }}
                disabled={isSaving}
                className="bg-[#124DA6] hover:bg-[#083B82] text-white text-xs font-bold py-2 px-4 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Publish Logo Now</span>
              </button>
            </div>
          </div>

          {/* Live Preview Panel (5 cols) */}
          <div className="lg:col-span-5 bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
              Live Preview across surfaces
            </span>

            {/* Light Surface Preview (Storefront Header) */}
            <div className="bg-white p-3.5 rounded-xl border border-gray-200 flex flex-col items-center justify-center min-h-[75px] shadow-2xs">
              <span className="text-[9px] text-gray-400 mb-1.5 self-start">Storefront Header (Light):</span>
              <DevshreeLogo customLogoUrl={formData.logoUrl} size="md" />
            </div>

            {/* Dark Surface Preview (Admin Sidebar & Footer) */}
            <div className="bg-[#083B82] p-3.5 rounded-xl border border-blue-900 flex flex-col items-center justify-center min-h-[75px]">
              <span className="text-[9px] text-blue-200 mb-1.5 self-start">Admin Sidebar & Footer (Dark):</span>
              <DevshreeLogo customLogoUrl={formData.logoUrl} size="md" inverted={true} />
            </div>
          </div>
        </div>
      </div>

      {/* 1. Contact & Identity */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2 border-b pb-2">
          <Phone className="w-4 h-4 text-[#124DA6]" />
          <span>Brand Identity & Contact Hotlines</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Brand Name</label>
            <input
              type="text"
              value={formData.businessName}
              onChange={e => setFormData({ ...formData, businessName: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block font-bold text-gray-700 mb-1">Tagline</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={e => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Primary Hotline Phone</label>
            <input
              type="text"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block font-bold text-gray-700 mb-1">WhatsApp Business Number</label>
            <input
              type="text"
              value={formData.whatsappNumber}
              onChange={e => setFormData({ ...formData, whatsappNumber: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block font-bold text-gray-700 mb-1">Official Support Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        {/* WhatsApp Checkout Notification Config */}
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 space-y-3 mt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200/60 pb-2.5">
            <div>
              <h5 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Buyer Checkout WhatsApp Notification to Seller</span>
              </h5>
              <p className="text-[11px] text-emerald-800">
                When any buyer confirms checkout, complete hardware order slips (items, quantities, price, shipping address) are immediately routed to this WhatsApp number.
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer self-start sm:self-auto shrink-0">
              <input
                type="checkbox"
                checked={formData.whatsappSellerNotificationEnabled ?? true}
                onChange={e => setFormData({ ...formData, whatsappSellerNotificationEnabled: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <span className="text-xs font-bold text-emerald-950">Auto-Notify Seller</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-bold text-emerald-900 mb-1">
                Seller WhatsApp Order Alert Number
              </label>
              <input
                type="text"
                value={formData.whatsappSellerNotificationNumber || formData.whatsappNumber || ''}
                onChange={e => setFormData({ ...formData, whatsappSellerNotificationNumber: e.target.value })}
                placeholder="+918128040556"
                className="w-full px-3.5 py-2 bg-white border border-emerald-300 rounded-lg text-xs font-mono font-bold text-emerald-950 focus:border-emerald-600 focus:outline-hidden"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => {
                  const num = (formData.whatsappSellerNotificationNumber || formData.whatsappNumber || '+918128040556').replace(/[^0-9]/g, '');
                  const testText = encodeURIComponent(
                    `🔔 *DEVSHREE HARDWARE - TEST SELLER WHATSAPP ALERT*\n` +
                    `Store: ${formData.businessName || 'Devshree - The Hardware Gallery'}\n` +
                    `✅ WhatsApp order notification dispatch is active and verified.\n` +
                    `Buyer orders from checkout will be forwarded directly here.`
                  );
                  safeOpenUrl(`https://wa.me/${num}?text=${testText}`);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                Send Test WhatsApp Alert
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Physical Location & GST */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2 border-b pb-2">
          <MapPin className="w-4 h-4 text-[#E87500]" />
          <span>Warehouse Location & GSTIN</span>
        </h4>

        <div>
          <label className="block font-bold text-gray-700 mb-1">Gallery / Warehouse Address</label>
          <input
            type="text"
            value={formData.address}
            onChange={e => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block font-bold text-gray-700 mb-1">City</label>
            <input
              type="text"
              value={formData.city}
              onChange={e => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block font-bold text-gray-700 mb-1">State</label>
            <input
              type="text"
              value={formData.state}
              onChange={e => setFormData({ ...formData, state: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block font-bold text-gray-700 mb-1">Pincode</label>
            <input
              type="text"
              value={formData.pincode}
              onChange={e => setFormData({ ...formData, pincode: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block font-bold text-gray-700 mb-1">GSTIN Number</label>
            <input
              type="text"
              value={formData.gstNumber}
              onChange={e => setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })}
              className="w-full px-3 py-2 border rounded-lg font-mono"
            />
          </div>
        </div>
      </div>

      {/* 3. Shipping & Payments */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2 border-b pb-2">
          <Truck className="w-4 h-4 text-emerald-600" />
          <span>Shipping Charges & Payment Methods</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Free Delivery Min Order (₹)</label>
            <input
              type="number"
              value={formData.freeShippingThreshold}
              onChange={e => setFormData({ ...formData, freeShippingThreshold: Number(e.target.value) })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block font-bold text-gray-700 mb-1">Standard Surface Shipping Fee (₹)</label>
            <input
              type="number"
              value={formData.standardShippingFee}
              onChange={e => setFormData({ ...formData, standardShippingFee: Number(e.target.value) })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
            <input
              type="checkbox"
              checked={formData.isCodEnabled}
              onChange={e => setFormData({ ...formData, isCodEnabled: e.target.checked })}
            />
            <span>Enable Cash on Delivery (COD)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
            <input
              type="checkbox"
              checked={formData.isRazorpayTestMode}
              onChange={e => setFormData({ ...formData, isRazorpayTestMode: e.target.checked })}
            />
            <span>Razorpay Sandbox / Test Mode</span>
          </label>
        </div>
      </div>

      {/* 4. Top Announcement Bar */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2 border-b pb-2">
          <Megaphone className="w-4 h-4 text-amber-600" />
          <span>Top Announcement Bar</span>
        </h4>

        <div>
          <label className="block font-bold text-gray-700 mb-1">Announcement Message</label>
          <input
            type="text"
            value={formData.announcementText}
            onChange={e => setFormData({ ...formData, announcementText: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-xs"
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
          <input
            type="checkbox"
            checked={formData.isAnnouncementEnabled}
            onChange={e => setFormData({ ...formData, isAnnouncementEnabled: e.target.checked })}
          />
          <span>Show announcement bar on header</span>
        </label>
      </div>

      {/* 5. AI Shopping Chatbot */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2 border-b pb-2">
          <Bot className="w-4 h-4 text-[#124DA6]" />
          <span>Devshree AI Hardware Shopping Assistant</span>
        </h4>

        <div>
          <label className="block font-bold text-gray-700 mb-1">Assistant Welcome Message</label>
          <textarea
            rows={2}
            value={formData.chatbotWelcomeMsg}
            onChange={e => setFormData({ ...formData, chatbotWelcomeMsg: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-xs"
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
          <input
            type="checkbox"
            checked={formData.chatbotEnabled}
            onChange={e => setFormData({ ...formData, chatbotEnabled: e.target.checked })}
          />
          <span>Enable AI Hardware Assistant widget on storefront</span>
        </label>
      </div>
    </form>
  );
};
