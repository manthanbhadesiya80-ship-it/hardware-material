import React, { useState } from 'react';
import { Coupon, Offer } from '../../types';
import { api } from '../../services/api';
import { useStore } from '../../context/StoreContext';
import { ConfirmModal } from '../common/ConfirmModal';
import { Plus, Tag, Trash2, X, Sparkles } from 'lucide-react';

interface AdminCouponsOffersTabProps {
  coupons: Coupon[];
  offers: Offer[];
  onRefresh: () => void;
}

export const AdminCouponsOffersTab: React.FC<AdminCouponsOffersTabProps> = ({
  coupons,
  offers,
  onRefresh
}) => {
  const { showToast } = useStore();
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState<Offer | null>(null);
  const [isDeletingOffer, setIsDeletingOffer] = useState(false);
  const [newCoupon, setNewCoupon] = useState<Partial<Coupon>>({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 999,
    maxDiscount: 500
  });

  const handleConfirmDeleteCoupon = async () => {
    if (!couponToDelete) return;
    setIsDeleting(true);
    try {
      await api.deleteCoupon(couponToDelete.id);
      showToast(`Coupon "${couponToDelete.code}" removed`, 'info');
      setCouponToDelete(null);
      onRefresh();
    } catch {
      showToast('Failed to delete coupon', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConfirmDeleteOffer = async () => {
    if (!offerToDelete) return;
    setIsDeletingOffer(true);
    try {
      await api.deleteOffer(offerToDelete.id);
      showToast(`Offer banner "${offerToDelete.title}" removed`, 'info');
      setOfferToDelete(null);
      onRefresh();
    } catch {
      showToast('Failed to delete offer', 'error');
    } finally {
      setIsDeletingOffer(false);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code || !newCoupon.discountValue) return;

    try {
      await api.createCoupon({
        ...newCoupon,
        startDate: new Date().toISOString(),
        endDate: '2026-12-31'
      });
      showToast('Coupon created successfully', 'success');
      setIsCouponModalOpen(false);
      onRefresh();
    } catch {
      showToast('Failed to create coupon', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Coupons Section */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#124DA6]" />
              <span>Promotional Discount Coupons</span>
            </h3>
            <p className="text-[11px] text-gray-500">
              Create promotional discount vouchers for online orders and contractor cart discounts.
            </p>
          </div>
          <button
            onClick={() => setIsCouponModalOpen(true)}
            className="bg-[#124DA6] text-white text-xs font-bold py-2 px-3.5 rounded-xl flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create Coupon</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {coupons.map(coupon => (
            <div
              key={coupon.id}
              className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 flex flex-col justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-black text-[#083B82]">{coupon.code}</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                    Active
                  </span>
                </div>
                <p className="text-xs text-gray-700 font-semibold">{coupon.description}</p>
                <p className="text-[11px] text-gray-500">
                  {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `Flat ₹${coupon.discountValue} OFF`}
                  {' · '}Min Order: ₹{coupon.minOrderValue}
                </p>
                <p className="text-[10px] text-gray-400">Used {coupon.usageCount} times</p>
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-end">
                <button
                  type="button"
                  onClick={() => setCouponToDelete(coupon)}
                  className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                  title="Delete Coupon"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Offers Section */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#E87500]" />
            <span>Active Campaign Banners ({offers.length})</span>
          </h3>
          <p className="text-[11px] text-gray-500">
            Promotional banners featured on the special deals and offers page.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offers.map(off => (
            <div key={off.id} className="relative rounded-xl overflow-hidden border border-gray-200 h-36 flex items-end p-4 text-white group shadow-2xs hover:shadow-md transition-shadow">
              <img src={off.bannerImage} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
              <button
                type="button"
                onClick={() => setOfferToDelete(off)}
                className="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-red-600 text-white rounded-lg transition-colors z-20 cursor-pointer shadow-sm"
                title="Delete Offer Campaign"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <div className="relative z-10">
                <span className="text-[9px] bg-[#E87500] font-black px-1.5 py-0.2 rounded uppercase mb-1 inline-block">
                  {off.discountTag}
                </span>
                <h4 className="text-sm font-bold truncate">{off.title}</h4>
                <p className="text-[11px] text-gray-200 truncate">{off.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Coupon Modal */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsCouponModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 z-10 text-xs">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-base font-bold text-gray-900">New Promo Coupon</h3>
              <button onClick={() => setIsCouponModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={newCoupon.code}
                  onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. FESTIVE20"
                  className="w-full px-3 py-2 border rounded-lg font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  required
                  value={newCoupon.description}
                  onChange={e => setNewCoupon({ ...newCoupon, description: e.target.value })}
                  placeholder="e.g. 20% off on all furniture hardware"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Type</label>
                  <select
                    value={newCoupon.discountType}
                    onChange={e => setNewCoupon({ ...newCoupon, discountType: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={newCoupon.discountValue}
                    onChange={e => setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Min Order (₹)</label>
                  <input
                    type="number"
                    value={newCoupon.minOrderValue}
                    onChange={e => setNewCoupon({ ...newCoupon, minOrderValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Max Discount (₹)</label>
                  <input
                    type="number"
                    value={newCoupon.maxDiscount}
                    onChange={e => setNewCoupon({ ...newCoupon, maxDiscount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsCouponModalOpen(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#124DA6] text-white rounded-lg font-bold">Save Coupon</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Coupon Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(couponToDelete)}
        title="Delete Promo Coupon?"
        message={`Are you sure you want to delete coupon code "${couponToDelete?.code}"? It will no longer be usable by customers at checkout.`}
        confirmText="Yes, Delete Coupon"
        cancelText="Cancel"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDeleteCoupon}
        onCancel={() => setCouponToDelete(null)}
      />

      {/* Delete Offer Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(offerToDelete)}
        title="Delete Offer Campaign?"
        message={`Are you sure you want to delete campaign "${offerToDelete?.title}"? It will be removed from the offers page.`}
        confirmText="Yes, Delete Offer"
        cancelText="Cancel"
        confirmVariant="danger"
        isLoading={isDeletingOffer}
        onConfirm={handleConfirmDeleteOffer}
        onCancel={() => setOfferToDelete(null)}
      />
    </div>
  );
};
