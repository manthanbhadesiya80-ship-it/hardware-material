import React, { useState } from 'react';
import { BulkEnquiry } from '../../types';
import { api } from '../../services/api';
import { useStore } from '../../context/StoreContext';
import { ConfirmModal } from '../common/ConfirmModal';
import { Building2, Phone, Mail, CheckCircle2, MessageCircle, Clock, Trash2 } from 'lucide-react';

export const AdminEnquiriesTab: React.FC<{
  enquiries: BulkEnquiry[];
  onRefresh: () => void;
}> = ({ enquiries, onRefresh }) => {
  const { showToast, openWhatsAppEnquiry } = useStore();
  const [enquiryToDelete, setEnquiryToDelete] = useState<BulkEnquiry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdateStatus = async (id: string, status: BulkEnquiry['status']) => {
    try {
      await api.updateBulkEnquiry(id, { status });
      showToast(`Enquiry marked as ${status}`, 'success');
      onRefresh();
    } catch {
      showToast('Failed to update enquiry status', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!enquiryToDelete) return;
    setIsDeleting(true);
    try {
      await api.deleteBulkEnquiry(enquiryToDelete.id);
      showToast(`Contractor enquiry for "${enquiryToDelete.name}" deleted successfully`, 'info');
      setEnquiryToDelete(null);
      onRefresh();
    } catch {
      showToast('Failed to delete enquiry', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-gray-900">Contractor & B2B Wholesale Enquiries ({enquiries.length})</h3>
          <p className="text-[11px] text-gray-500">
            Quotations requested by builders, furniture factories, and interior architects. Remove unnecessary or test entries anytime.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {enquiries.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center text-xs text-gray-500 space-y-2">
            <Building2 className="w-8 h-8 text-gray-300 mx-auto" />
            <p className="font-semibold text-gray-600">No contractor enquiries found.</p>
            <p className="text-[11px] text-gray-400">New quotation requests from builders and carpenters will appear here.</p>
          </div>
        ) : (
          enquiries.map(enq => (
            <div key={enq.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs hover:shadow-md transition-shadow space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#E87500] border border-orange-200/60 flex items-center justify-center font-bold text-xs shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                      {enq.name} {enq.companyName ? `(${enq.companyName})` : ''}
                    </h4>
                    <span className="text-[11px] text-gray-400">
                      City: {enq.city || 'Not specified'} · {new Date(enq.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={enq.status}
                    onChange={e => handleUpdateStatus(enq.id, e.target.value as any)}
                    className="text-xs font-semibold px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer"
                  >
                    <option value="new">Status: New</option>
                    <option value="contacted">Status: Contacted</option>
                    <option value="quoted">Status: Quoted</option>
                    <option value="closed">Status: Closed</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => setEnquiryToDelete(enq)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-200 hover:border-red-200 cursor-pointer"
                    title="Delete Unnecessary / Spam Enquiry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Requirements */}
              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 text-xs">
                <span className="font-bold text-gray-700 block mb-1">Requested Hardware Bill of Materials:</span>
                <p className="text-gray-800 whitespace-pre-line leading-relaxed font-medium">
                  {enq.productsRequired}
                </p>
                {enq.estimatedQuantity && (
                  <p className="text-[11px] text-[#083B82] font-bold mt-2 flex items-center gap-1.5">
                    <span>Estimated Scale:</span>
                    <span className="bg-blue-50 text-[#083B82] px-2 py-0.5 rounded font-mono">{enq.estimatedQuantity}</span>
                  </p>
                )}
              </div>

              {/* Contact actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
                <div className="flex items-center gap-4 text-gray-600">
                  <a href={`tel:${enq.phone.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-1 hover:text-[#124DA6] font-semibold">
                    <Phone className="w-3.5 h-3.5 text-[#124DA6]" />
                    <span>{enq.phone}</span>
                  </a>
                  {enq.email && (
                    <a href={`mailto:${enq.email}`} className="flex items-center gap-1 hover:text-[#124DA6]">
                      <Mail className="w-3.5 h-3.5 text-[#124DA6]" />
                      <span>{enq.email}</span>
                    </a>
                  )}
                </div>

                <button
                  onClick={() => openWhatsAppEnquiry(undefined, `Hello ${enq.name}, this is Devshree - The Hardware Gallery regarding your bulk hardware quotation request.`)}
                  className="bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold py-1.5 px-3 rounded-lg flex items-center gap-1 text-[11px] shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Contractor</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Enquiry Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(enquiryToDelete)}
        title="Delete Contractor Enquiry?"
        message={`Are you sure you want to permanently remove the enquiry from "${enquiryToDelete?.name}" (${enquiryToDelete?.companyName || 'Individual'})? This action cannot be undone.`}
        confirmText="Yes, Delete Enquiry"
        cancelText="Cancel"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setEnquiryToDelete(null)}
      />
    </div>
  );
};
