import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { api } from '../services/api';
import { Order, OrderStatus } from '../types';
import {
  Package,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  Phone,
  MessageCircle,
  ArrowRight
} from 'lucide-react';

const STATUS_STEPS: OrderStatus[] = [
  'Order Placed',
  'Confirmed',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered'
];

export const MyOrdersPage: React.FC = () => {
  const { customerInfo, pageParams, setCurrentPage, openWhatsAppEnquiry } = useStore();
  const [phoneSearch, setPhoneSearch] = useState(pageParams.phone || customerInfo.phone || '');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchOrders = async (phone: string) => {
    if (!phone.trim()) return;
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await api.getOrders({ customerPhone: phone.trim() });
      setOrders(res);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (phoneSearch) {
      fetchOrders(phoneSearch);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders(phoneSearch);
  };

  const getStepIndex = (currentStatus: OrderStatus) => {
    const idx = STATUS_STEPS.indexOf(currentStatus);
    return idx === -1 ? 0 : idx;
  };

  return (
    <div className="py-6 sm:py-10 bg-[#F7F9FC] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8 text-center sm:text-left">
          <h1 className="text-xl sm:text-3xl font-extrabold text-[#083B82]">
            Track Orders & History
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Check the live shipment progress of your hardware order using your registered mobile number.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-2xs mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="tel"
                value={phoneSearch}
                onChange={e => setPhoneSearch(e.target.value)}
                placeholder="Enter 10-digit mobile number (e.g. 9825144521)"
                className="w-full text-xs pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-hidden focus:border-[#124DA6]"
              />
              <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#124DA6] hover:bg-[#083B82] text-white text-xs font-bold py-2.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'Finding Orders...' : 'Find My Orders'}</span>
            </button>
          </form>
        </div>

        {/* Orders Results */}
        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-[#124DA6] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map(order => {
              const currentStepIdx = getStepIndex(order.orderStatus);

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden"
                >
                  {/* Order Top Bar */}
                  <div className="bg-gray-50 p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-gray-400 block text-[10px]">ORDER NUMBER</span>
                      <strong className="text-sm font-black text-[#124DA6]">{order.orderNumber}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">ORDER DATE</span>
                      <span className="font-semibold text-gray-700">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">TOTAL AMOUNT</span>
                      <span className="font-black text-[#083B82]">₹{order.total.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">CURRENT STATUS</span>
                      <span className="font-extrabold text-[#E87500] uppercase tracking-wider">
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>

                  {/* Status Timeline */}
                  <div className="p-5 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-900 mb-4">Shipment Progress:</p>
                    <div className="relative flex justify-between items-center text-[10px] sm:text-xs">
                      {/* Connecting Line */}
                      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-200 z-0" />
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 z-0 transition-all duration-500"
                        style={{
                          width: `${(currentStepIdx / (STATUS_STEPS.length - 1)) * 100}%`
                        }}
                      />

                      {STATUS_STEPS.map((stepName, sIdx) => {
                        const isDone = sIdx <= currentStepIdx;
                        const isCurrent = sIdx === currentStepIdx;

                        return (
                          <div key={sIdx} className="relative z-10 flex flex-col items-center">
                            <div
                              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center border-2 transition-colors ${
                                isDone
                                  ? 'bg-emerald-600 border-emerald-600 text-white'
                                  : 'bg-white border-gray-300 text-gray-400'
                              } ${isCurrent ? 'ring-4 ring-emerald-100' : ''}`}
                            >
                              {isDone ? (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              ) : (
                                <span className="text-[10px] font-bold">{sIdx + 1}</span>
                              )}
                            </div>
                            <span
                              className={`mt-1.5 hidden sm:block text-center max-w-[80px] font-medium leading-tight ${
                                isCurrent
                                  ? 'text-emerald-700 font-bold'
                                  : isDone
                                  ? 'text-gray-900'
                                  : 'text-gray-400'
                              }`}
                            >
                              {stepName}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {order.trackingNumber && (
                      <div className="mt-4 p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-[#124DA6]" />
                          <span>
                            Courier: <strong>{order.courierName || 'Blue Dart Express'}</strong> · AWB Tracking: <strong>{order.trackingNumber}</strong>
                          </span>
                        </div>
                        <span className="text-[#124DA6] font-bold">In Transit</span>
                      </div>
                    )}
                  </div>

                  {/* Items Ordered */}
                  <div className="p-5 space-y-3">
                    <p className="text-xs font-bold text-gray-900">Hardware Package Content:</p>
                    <div className="divide-y divide-gray-100">
                      {order.items.map((item, i) => (
                        <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <img src={item.image} alt="" className="w-10 h-10 rounded object-cover border border-gray-200" />
                            <div>
                              <h5 className="font-bold text-gray-900">{item.name}</h5>
                              <p className="text-[11px] text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                            </div>
                          </div>
                          <span className="font-black text-gray-900">₹{item.total.toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Footer Action */}
                  <div className="bg-gray-50 p-3.5 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Need delivery updates?
                    </span>
                    <button
                      onClick={() =>
                        openWhatsAppEnquiry(
                          undefined,
                          `Namaste Devshree! Please update me on Order #${order.orderNumber} sent to ${order.customerName}.`
                        )
                      }
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-4 h-4 text-[#25D366]" />
                      <span>WhatsApp Support</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : hasSearched ? (
          <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center shadow-2xs">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-gray-900">No orders found for this number</h3>
            <p className="text-xs text-gray-500 mt-1 mb-4">
              Please double check the phone number used during checkout, or contact our Rajkot office.
            </p>
            <button
              onClick={() => setCurrentPage('shop')}
              className="bg-[#124DA6] text-white text-xs font-bold py-2.5 px-5 rounded-lg"
            >
              Browse Hardware Catalog
            </button>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center shadow-2xs">
            <Package className="w-12 h-12 text-[#124DA6]/40 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-gray-900">Track Your Consignment</h3>
            <p className="text-xs text-gray-500 mt-1">
              Enter your mobile number above to view all current dispatches and delivered orders.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
