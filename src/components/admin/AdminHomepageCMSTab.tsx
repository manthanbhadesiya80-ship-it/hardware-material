import React, { useState } from 'react';
import { HomepageSection, Banner } from '../../types';
import { api } from '../../services/api';
import { useStore } from '../../context/StoreContext';
import { ConfirmModal } from '../common/ConfirmModal';
import { INITIAL_HOMEPAGE_SECTIONS } from '../../data/initialData';
import {
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Layers,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';

interface AdminHomepageCMSTabProps {
  sections: HomepageSection[];
  banners: Banner[];
  onRefresh: () => void;
}

export const AdminHomepageCMSTab: React.FC<AdminHomepageCMSTabProps> = ({
  sections,
  banners,
  onRefresh
}) => {
  const { showToast } = useStore();
  const [localSections, setLocalSections] = useState<HomepageSection[]>(sections);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Partial<Banner> | null>(null);
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Section Editing & Deleting
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<HomepageSection | null>(null);
  const [sectionToDelete, setSectionToDelete] = useState<HomepageSection | null>(null);
  const [isDeletingSection, setIsDeletingSection] = useState(false);

  // Sync sections when prop changes
  React.useEffect(() => {
    setLocalSections(sections);
  }, [sections]);

  const handleOpenEditSection = (sec: HomepageSection) => {
    setEditingSection({ ...sec });
    setIsSectionModalOpen(true);
  };

  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection) return;

    const updated = localSections.map(s => (s.id === editingSection.id ? editingSection : s));
    setLocalSections(updated);
    setIsSectionModalOpen(false);

    try {
      await api.updateHomepageSections(updated);
      showToast(`Homepage section "${editingSection.title}" updated`, 'success');
      onRefresh();
    } catch {
      showToast('Failed to save section changes', 'error');
    }
  };

  const handleConfirmDeleteSection = async () => {
    if (!sectionToDelete) return;
    setIsDeletingSection(true);
    try {
      const updated = localSections.filter(s => s.id !== sectionToDelete.id);
      setLocalSections(updated);
      await api.updateHomepageSections(updated);
      showToast(`Section "${sectionToDelete.title}" removed from homepage sequence`, 'info');
      setSectionToDelete(null);
      onRefresh();
    } catch {
      showToast('Failed to remove section', 'error');
    } finally {
      setIsDeletingSection(false);
    }
  };

  // Section Toggle
  const toggleSection = async (index: number) => {
    const updated = [...localSections];
    updated[index].isEnabled = !updated[index].isEnabled;
    setLocalSections(updated);
    try {
      await api.updateHomepageSections(updated);
      showToast(`Section "${updated[index].title}" toggled`, 'success');
    } catch {
      showToast('Could not save section configuration', 'error');
    }
  };

  // Reorder Sections
  const moveSection = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === localSections.length - 1)
    ) {
      return;
    }

    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const updated = [...localSections];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIdx, 0, moved);

    // Update order property
    const normalized = updated.map((sec, i) => ({ ...sec, order: i + 1 }));
    setLocalSections(normalized);

    try {
      await api.updateHomepageSections(normalized);
      showToast('Homepage layout order updated', 'success');
    } catch {
      showToast('Failed to save layout order', 'error');
    }
  };

  // Banner Actions
  const handleOpenAddBanner = () => {
    setEditingBanner({
      title: 'New Hardware Campaign',
      subtitle: 'Premium certified fittings direct from factory.',
      badge: 'LIMITED TIME DEAL',
      desktopImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1600&auto=format&fit=crop&q=80',
      mobileImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
      ctaText: 'SHOP NOW',
      ctaLink: '/shop',
      themeColor: '#124DA6',
      isActive: true,
      order: banners.length + 1
    });
    setIsBannerModalOpen(true);
  };

  const handleOpenEditBanner = (b: Banner) => {
    setEditingBanner({ ...b });
    setIsBannerModalOpen(true);
  };

  const handleConfirmDeleteBanner = async () => {
    if (!bannerToDelete) return;
    setIsDeleting(true);
    try {
      await api.deleteBanner(bannerToDelete.id);
      showToast('Banner removed successfully', 'info');
      setBannerToDelete(null);
      onRefresh();
    } catch {
      showToast('Could not delete banner', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner?.title || !editingBanner?.desktopImage) return;

    try {
      if (editingBanner.id) {
        await api.updateBanner(editingBanner.id, editingBanner);
        showToast('Hero banner updated', 'success');
      } else {
        await api.createBanner(editingBanner);
        showToast('New hero banner created', 'success');
      }
      setIsBannerModalOpen(false);
      onRefresh();
    } catch {
      showToast('Could not save banner', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Hero Carousel Banners Manager */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#124DA6]" />
              <span>Hero Carousel Banners (CMS)</span>
            </h3>
            <p className="text-[11px] text-gray-500">
              Manage the rotating banners, promotional texts, and button destination links on the homepage.
            </p>
          </div>
          <button
            onClick={handleOpenAddBanner}
            className="bg-[#124DA6] hover:bg-[#083B82] text-white text-xs font-bold py-2 px-3.5 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Banner</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {banners.map((ban, idx) => (
            <div
              key={ban.id}
              className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
                  <img src={ban.desktopImage} alt="" className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    Slide #{idx + 1}
                  </span>
                  {!ban.isActive && (
                    <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      Disabled
                    </span>
                  )}
                </div>

                <div className="p-3 space-y-1">
                  <span className="text-[10px] font-black text-[#E87500] uppercase block truncate">
                    {ban.badge || 'PROMOTION'}
                  </span>
                  <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{ban.title}</h4>
                  <p className="text-[11px] text-gray-500 line-clamp-2">{ban.subtitle}</p>
                  <p className="text-[10px] text-[#124DA6] font-semibold pt-1">
                    CTA: "{ban.ctaText}" → {ban.ctaLink}
                  </p>
                </div>
              </div>

              <div className="p-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleOpenEditBanner(ban)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-[#124DA6] hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors cursor-pointer"
                  title="Make Changes to Banner"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Make Changes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBannerToDelete(ban)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete Banner"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Homepage Section Reordering & Toggles */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#E87500]" />
              <span>Homepage Section Sequence & Visibility ({localSections.length})</span>
            </h3>
            <p className="text-[11px] text-gray-500">
              Enable or disable sections, re-order sequence, edit public headings, or remove unnecessary section entries.
            </p>
          </div>
          <button
            type="button"
            onClick={async () => {
              setLocalSections(INITIAL_HOMEPAGE_SECTIONS);
              await api.updateHomepageSections(INITIAL_HOMEPAGE_SECTIONS);
              showToast('Homepage sections restored to default layout', 'info');
              onRefresh();
            }}
            className="text-[11px] font-bold text-[#124DA6] hover:text-[#083B82] bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors self-start sm:self-auto cursor-pointer"
            title="Restore all standard Devshree homepage sections"
          >
            Reset Default Layout
          </button>
        </div>

        <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
          {localSections.map((sec, idx) => (
            <div
              key={sec.id}
              className={`p-3.5 flex items-center justify-between text-xs transition-colors ${
                sec.isEnabled ? 'bg-white hover:bg-gray-50' : 'bg-gray-50/70 text-gray-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 text-center font-bold text-gray-400">{idx + 1}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-900">{sec.title}</h4>
                    {sec.name && (
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
                        {sec.name}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400">ID: {sec.id}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Make Changes Button */}
                <button
                  type="button"
                  onClick={() => handleOpenEditSection(sec)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-200 hover:border-[#124DA6] bg-blue-50/70 hover:bg-[#124DA6] text-[#124DA6] hover:text-white font-bold text-xs transition-colors cursor-pointer shadow-2xs"
                  title="Make Changes to Section Heading, Title & Settings"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Make Changes</span>
                </button>

                {/* Move UP */}
                <button
                  onClick={() => moveSection(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>

                {/* Move DOWN */}
                <button
                  onClick={() => moveSection(idx, 'down')}
                  disabled={idx === localSections.length - 1}
                  className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>

                {/* Enable/Disable Toggle */}
                <button
                  onClick={() => toggleSection(idx)}
                  className={`py-1 px-2.5 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-colors ${
                    sec.isEnabled
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                  title={sec.isEnabled ? 'Disable Section' : 'Enable Section'}
                >
                  {sec.isEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{sec.isEnabled ? 'Active' : 'Hidden'}</span>
                </button>

                {/* Delete / Remove Section Entry */}
                <button
                  type="button"
                  onClick={() => setSectionToDelete(sec)}
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer"
                  title="Remove / Delete Section Entry"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Banner Modal */}
      {isBannerModalOpen && editingBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsBannerModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 z-10 text-xs">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
              <h3 className="text-base font-bold text-gray-900">
                {editingBanner.id ? 'Edit Hero Banner' : 'Create New Hero Banner'}
              </h3>
              <button onClick={() => setIsBannerModalOpen(false)} className="p-1 rounded-full text-gray-400 hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-3.5">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Badge Tag</label>
                <input
                  type="text"
                  value={editingBanner.badge || ''}
                  onChange={e => setEditingBanner({ ...editingBanner, badge: e.target.value })}
                  placeholder="e.g. FACTORY DIRECT / LIMITED DEAL"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Banner Heading *</label>
                <input
                  type="text"
                  required
                  value={editingBanner.title || ''}
                  onChange={e => setEditingBanner({ ...editingBanner, title: e.target.value })}
                  placeholder="e.g. Heavy Hydraulic Bed Lift Fitting"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Subtitle Description</label>
                <textarea
                  rows={2}
                  value={editingBanner.subtitle || ''}
                  onChange={e => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                  placeholder="Brief descriptive message..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Desktop Image URL *</label>
                  <input
                    type="url"
                    required
                    value={editingBanner.desktopImage || ''}
                    onChange={e => setEditingBanner({ ...editingBanner, desktopImage: e.target.value, mobileImage: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={editingBanner.ctaText || 'SHOP NOW'}
                    onChange={e => setEditingBanner({ ...editingBanner, ctaText: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Destination URL / Route</label>
                <input
                  type="text"
                  value={editingBanner.ctaLink || '/shop'}
                  onChange={e => setEditingBanner({ ...editingBanner, ctaLink: e.target.value })}
                  placeholder="/shop or /category/bed-fittings"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={Boolean(editingBanner.isActive)}
                  onChange={e => setEditingBanner({ ...editingBanner, isActive: e.target.checked })}
                />
                <span className="font-bold text-gray-800">Enable this banner on storefront</span>
              </label>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#124DA6] text-white rounded-lg font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Banner</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Section Modal */}
      {isSectionModalOpen && editingSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsSectionModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 z-10 text-xs">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Edit Section Details
                </h3>
                <span className="text-[10px] text-gray-400">ID: {editingSection.id}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsSectionModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSection} className="space-y-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Section Public Heading / Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingSection.title}
                  onChange={e => setEditingSection({ ...editingSection, title: e.target.value })}
                  placeholder="e.g. Featured Hardware Collections"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Badge / Tagline / Subtitle
                </label>
                <input
                  type="text"
                  value={editingSection.name}
                  onChange={e => setEditingSection({ ...editingSection, name: e.target.value })}
                  placeholder="e.g. Architectural Standard or Top Brands"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={editingSection.isEnabled}
                  onChange={e => setEditingSection({ ...editingSection, isEnabled: e.target.checked })}
                />
                <span className="font-bold text-gray-800">Section visible on storefront</span>
              </label>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSectionModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#124DA6] text-white rounded-lg font-bold flex items-center gap-1.5 shadow-sm hover:bg-[#083B82] transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Banner Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(bannerToDelete)}
        title="Delete Hero Banner?"
        message={`Are you sure you want to remove "${bannerToDelete?.title}" from the homepage hero carousel?`}
        confirmText="Yes, Delete Banner"
        cancelText="Cancel"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDeleteBanner}
        onCancel={() => setBannerToDelete(null)}
      />

      {/* Section Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(sectionToDelete)}
        title="Remove Homepage Section?"
        message={`Are you sure you want to remove "${sectionToDelete?.title}" from the homepage sequence? You can re-enable or modify sections anytime.`}
        confirmText="Yes, Remove Section"
        cancelText="Cancel"
        confirmVariant="danger"
        isLoading={isDeletingSection}
        onConfirm={handleConfirmDeleteSection}
        onCancel={() => setSectionToDelete(null)}
      />
    </div>
  );
};
