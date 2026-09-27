import React, { useState, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { DevshreeLogo } from '../common/DevshreeLogo';
import {
  X,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  Check,
  Save,
  Link
} from 'lucide-react';

interface ChangeLogoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangeLogoModal: React.FC<ChangeLogoModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings, showToast } = useStore();
  const [logoUrl, setLogoUrl] = useState<string>(settings.logoUrl || '');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file (PNG, JPG, SVG, WebP)', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('File size must be under 5MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setLogoUrl(result);
      showToast('New logo loaded into preview. Click "Save & Publish" to update across the storefront!', 'info');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveLogo = async () => {
    setIsSaving(true);
    try {
      await updateSettings({ ...settings, logoUrl });
      showToast('Storefront and admin logo updated successfully!', 'success');
      onClose();
    } catch {
      showToast('Failed to update logo', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefault = async () => {
    setLogoUrl('');
    setIsSaving(true);
    try {
      await updateSettings({ ...settings, logoUrl: '' });
      showToast('Reset to original Devshree brand vector logo', 'info');
      onClose();
    } catch {
      showToast('Failed to reset logo', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={isSaving ? undefined : onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 z-10 text-xs animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-[#124DA6] rounded-xl">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Change Storefront & Admin Logo</h3>
              <p className="text-[11px] text-gray-500">
                Upload your company insignia or switch back to Devshree default vector
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {/* File Upload Option */}
          <div>
            <label className="block font-bold text-gray-700 mb-1.5">
              Option 1: Upload Image File (PNG, SVG, JPG, WebP)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-4 py-2.5 rounded-xl border border-gray-300 flex items-center gap-2 text-xs transition-colors"
              >
                <Upload className="w-4 h-4 text-[#124DA6]" />
                <span>Choose Image File...</span>
              </button>
              <span className="text-[11px] text-gray-400">
                Transparent PNG or SVG recommended
              </span>
            </div>
          </div>

          {/* URL Input Option */}
          <div>
            <label className="block font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Link className="w-3.5 h-3.5 text-gray-400" />
              <span>Option 2: Or Paste Public Image URL</span>
            </label>
            <input
              type="url"
              value={logoUrl}
              onChange={e => setLogoUrl(e.target.value)}
              placeholder="https://example.com/logo.png"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:bg-white focus:border-[#124DA6]"
            />
          </div>

          {/* Live Preview Surfaces */}
          <div className="space-y-2 pt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
              Live Real-Time Preview
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Light surface */}
              <div className="bg-white p-3.5 rounded-xl border border-gray-200 flex flex-col items-center justify-center min-h-[85px] shadow-2xs">
                <span className="text-[9px] text-gray-400 mb-1 self-start font-semibold">Storefront Header (Light):</span>
                <DevshreeLogo customLogoUrl={logoUrl} size="md" />
              </div>

              {/* Dark surface */}
              <div className="bg-[#083B82] p-3.5 rounded-xl border border-blue-900 flex flex-col items-center justify-center min-h-[85px]">
                <span className="text-[9px] text-blue-200 mb-1 self-start font-semibold">Admin & Footer (Dark):</span>
                <DevshreeLogo customLogoUrl={logoUrl} size="md" inverted={true} />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-5 mt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={handleResetToDefault}
            disabled={isSaving || !settings.logoUrl}
            className="text-[11px] font-bold text-[#E87500] hover:text-[#C76400] disabled:text-gray-300 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Original Logo</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveLogo}
              disabled={isSaving}
              className="px-5 py-2 bg-[#124DA6] hover:bg-[#083B82] text-white rounded-xl font-bold flex items-center gap-1.5 shadow-sm transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              <span>Save & Publish Logo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
