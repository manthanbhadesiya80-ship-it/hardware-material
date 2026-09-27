import React, { useState } from 'react';
import { ProductReview } from '../../types';
import { api } from '../../services/api';
import { useStore } from '../../context/StoreContext';
import { ConfirmModal } from '../common/ConfirmModal';
import { Star, CheckCircle2, XCircle, Trash2, X, Save } from 'lucide-react';

export const AdminReviewsTab: React.FC<{
  reviews: ProductReview[];
  onRefresh: () => void;
}> = ({ reviews, onRefresh }) => {
  const { showToast } = useStore();
  const [reviewToDelete, setReviewToDelete] = useState<ProductReview | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    customerName: '',
    productName: 'Devshree Hydraulic Bed Lift Mechanism',
    productId: 'prod-1',
    rating: 5,
    headline: '',
    comment: ''
  });

  const handleToggleApprove = async (id: string) => {
    try {
      await api.toggleApproveReview(id);
      showToast('Review status updated', 'success');
      onRefresh();
    } catch {
      showToast('Failed to update review status', 'error');
    }
  };

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.submitReview({
        ...newReview,
        isApproved: true
      } as any);
      showToast('New testimonial created and published', 'success');
      setIsAddModalOpen(false);
      setNewReview({
        customerName: '',
        productName: 'Devshree Hydraulic Bed Lift Mechanism',
        productId: 'prod-1',
        rating: 5,
        headline: '',
        comment: ''
      });
      onRefresh();
    } catch {
      showToast('Failed to save review', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!reviewToDelete) return;
    setIsDeleting(true);
    try {
      await api.deleteReview(reviewToDelete.id);
      showToast('Review removed', 'info');
      setReviewToDelete(null);
      onRefresh();
    } catch {
      showToast('Failed to delete review', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900">Customer & Carpenter Reviews ({reviews.length})</h3>
          <p className="text-[11px] text-gray-500">Moderate product testimonials, feedback ratings, and verified purchases.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#124DA6] hover:bg-[#083B82] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 self-start sm:self-auto cursor-pointer transition-colors"
        >
          <span>+ Add New Testimonial</span>
        </button>
      </div>

      <div className="space-y-3">
        {reviews.map(rev => (
          <div key={rev.id} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <strong className="text-xs text-gray-900">{rev.headline}</strong>
                {rev.isApproved ? (
                  <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.2 rounded">
                    Approved & Live
                  </span>
                ) : (
                  <span className="text-[9px] bg-gray-100 text-gray-600 font-bold px-1.5 py-0.2 rounded">
                    Hidden
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 italic">"{rev.comment}"</p>
              <div className="text-[11px] text-gray-400">
                By <strong>{rev.customerName}</strong> on <strong>{rev.productName}</strong> · {new Date(rev.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleToggleApprove(rev.id)}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-colors ${
                  rev.isApproved
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {rev.isApproved ? 'Hide Review' : 'Approve & Publish'}
              </button>
              <button
                type="button"
                onClick={() => setReviewToDelete(rev)}
                className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
                title="Delete Review"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Review Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 z-10 text-xs">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Add Customer / Carpenter Review
                </h3>
                <p className="text-[11px] text-gray-500">
                  Publish verified trade testimonials directly to the storefront reviews section.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReview} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Customer / Carpenter Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newReview.customerName}
                    onChange={e => setNewReview({ ...newReview, customerName: e.target.value })}
                    placeholder="e.g. Ramesh Patel (Contractor, Surat)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Star Rating (1 to 5)
                  </label>
                  <select
                    value={newReview.rating}
                    onChange={e => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                  >
                    <option value={5}>5 Stars - Outstanding</option>
                    <option value={4}>4 Stars - Very Good</option>
                    <option value={3}>3 Stars - Average</option>
                    <option value={2}>2 Stars - Poor</option>
                    <option value={1}>1 Star - Terrible</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Product Name / Fitted Item *
                </label>
                <input
                  type="text"
                  required
                  value={newReview.productName}
                  onChange={e => setNewReview({ ...newReview, productName: e.target.value })}
                  placeholder="e.g. Heavy-Duty Hydraulic Bed Lift Mechanism 150Kg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Review Headline / Summary *
                </label>
                <input
                  type="text"
                  required
                  value={newReview.headline}
                  onChange={e => setNewReview({ ...newReview, headline: e.target.value })}
                  placeholder="e.g. Solid mechanism, zero mattress shaking!"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Full Comment / Experience *
                </label>
                <textarea
                  required
                  rows={3}
                  value={newReview.comment}
                  onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Detailed feedback from site installation..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#124DA6] text-white rounded-lg font-bold flex items-center gap-1.5 shadow-sm hover:bg-[#083B82] transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Publish Testimonial</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Review Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(reviewToDelete)}
        title="Delete Customer Review?"
        message="Are you sure you want to permanently delete this testimonial from the database?"
        confirmText="Yes, Delete Review"
        cancelText="Cancel"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setReviewToDelete(null)}
      />
    </div>
  );
};
