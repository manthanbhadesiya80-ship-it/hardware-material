import React, { useState } from 'react';
import { Order, OrderStatus } from '../../types';
import { api } from '../../services/api';
import { useStore } from '../../context/StoreContext';
import { ConfirmModal } from '../common/ConfirmModal';
import {
  Search,
  Filter,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  ExternalLink,
  Edit3,
  X,
  Save,
  Package,
  Trash2
} from 'lucide-react';

interface AdminOrdersTabProps {
  orders: Order[];
  onRefresh: () => void;
}

const ALL_STATUSES: OrderStatus[] = [
  'Order Placed',
  'Confirmed',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled'
];

export const AdminOrdersTab: React.FC<AdminOrdersTabProps> = ({ orders, onRefresh }) => {
  const { showToast } = useStore();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('Confirmed');
  const [statusNote, setStatusNote] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [courierName, setCourierName] = useState('Blue Dart Express');
  const [isUpdating, setIsUpdating] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [isDeletingOrder, setIsDeletingOrder] = useState(false);

  const filtered = orders.filter(o => {
    if (filterStatus && o.orderStatus !== filterStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q) ||
        o.customerEmail.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenStatusModal = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setTrackingNumber(order.trackingNumber || '');
    setCourierName(order.courierName || 'Blue Dart Express');
    setStatusNote('');
  };

  const handleConfirmDeleteOrder = async () => {
    if (!orderToDelete) return;
    setIsDeletingOrder(true);
    try {
      await api.deleteOrder(orderToDelete.id);
      showToast(`Order #${orderToDelete.orderNumber} deleted successfully`, 'info');
      setOrderToDelete(null);
      onRefresh();
    } catch {
      showToast('Failed to delete order', 'error');
    } finally {
      setIsDeletingOrder(false);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setIsUpdating(true);
    try {
      await api.updateOrderStatus(
        selectedOrder.id,
        newStatus,
        statusNote || `Updated status to ${newStatus}`,
        trackingNumber || undefined,
        courierName || undefined
      );
      showToast(`Order #${selectedOrder.orderNumber} status updated to ${newStatus}`, 'success');
      setSelectedOrder(null);
      onRefresh();
    } catch {
      showToast('Failed to update order status', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
        <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by Order ID, customer phone or name..."
              className="w-full text-xs pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:outline-hidden focus:border-[#124DA6]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="text-xs px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:outline-hidden"
          >
            <option value="">All Statuses ({orders.length})</option>
            {ALL_STATUSES.map(s => (
              <option key={s} value={s}>
                {s} ({orders.filter(o => o.orderStatus === s).length})
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs text-gray-500 font-medium">
          Showing <strong>{filtered.length}</strong> orders
        </span>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Hardware Items</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Amount & Mode</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(order => (
                <tr key={order.id} className="hover:bg-blue-50/30">
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-[#124DA6] text-xs block">
                      {order.orderNumber}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-gray-900">{order.customerName}</div>
                    <div className="text-[10px] text-gray-500">{order.customerPhone}</div>
                    {order.customerEmail && <div className="text-[10px] text-gray-400 truncate max-w-[120px]">{order.customerEmail}</div>}
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-gray-900 font-semibold">{order.items.length} items</div>
                    <div className="text-[10px] text-gray-500 truncate max-w-[150px]">
                      {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-gray-800">{order.shippingAddress.city}, {order.shippingAddress.state}</div>
                    <div className="text-[10px] text-gray-400">PIN: {order.shippingAddress.pincode}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-black text-[#083B82] text-xs">
                      ₹{order.total.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[9px] uppercase font-bold text-gray-500 bg-gray-100 px-1 py-0.2 rounded">
                      {order.paymentMethod} · {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      order.orderStatus === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.orderStatus === 'Shipped'
                        ? 'bg-blue-100 text-blue-800'
                        : order.orderStatus === 'Cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenStatusModal(order)}
                        className="bg-gray-100 hover:bg-[#124DA6] hover:text-white text-gray-700 text-[11px] font-bold py-1.5 px-3 rounded-lg transition-colors cursor-pointer"
                      >
                        Update Status
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrderToDelete(order)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-200 hover:border-red-200 cursor-pointer"
                        title="Delete Unnecessary / Cancelled Order"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Order Status Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 z-10 text-xs">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Manage Order #{selectedOrder.orderNumber}
                </h3>
                <p className="text-[11px] text-gray-500">Customer: {selectedOrder.customerName} ({selectedOrder.customerPhone})</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1 rounded-full text-gray-400 hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Update Status *</label>
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value as OrderStatus)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-semibold"
                >
                  {ALL_STATUSES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Courier Partner</label>
                  <input
                    type="text"
                    value={courierName}
                    onChange={e => setCourierName(e.target.value)}
                    placeholder="e.g. Blue Dart, Delhivery"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">AWB Tracking Number</label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={e => setTrackingNumber(e.target.value)}
                    placeholder="e.g. BLUEDART-48920194"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Dispatch / Progress Note</label>
                <textarea
                  rows={2}
                  value={statusNote}
                  onChange={e => setStatusNote(e.target.value)}
                  placeholder="e.g. Sealed crate dispatched from Rajkot Hub via surface express."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-2 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 bg-[#124DA6] text-white rounded-lg font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>{isUpdating ? 'Saving...' : 'Update & Notify'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Order Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(orderToDelete)}
        title="Delete Order Entry?"
        message={`Are you sure you want to permanently delete Order #${orderToDelete?.orderNumber} for customer ${orderToDelete?.customerName}? This will remove it from all records.`}
        confirmText="Yes, Delete Order"
        cancelText="Cancel"
        confirmVariant="danger"
        isLoading={isDeletingOrder}
        onConfirm={handleConfirmDeleteOrder}
        onCancel={() => setOrderToDelete(null)}
      />
    </div>
  );
};
