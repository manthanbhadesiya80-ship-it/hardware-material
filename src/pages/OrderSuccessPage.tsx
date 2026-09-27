import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import confetti from 'canvas-confetti';
import {
  formatSellerOrderWhatsAppMessage,
  getSellerWhatsAppUrl,
  safeOpenUrl
} from '../utils/whatsappOrderNotifier';
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  MessageCircle,
  Printer,
  Calendar,
  MapPin,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Eye,
  EyeOff
} from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const { lastOrder, setCurrentPage, openWhatsAppEnquiry, settings } = useStore();
  const [showMsgPreview, setShowMsgPreview] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Fire festive celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}
  }, []);

  if (!lastOrder) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-bold">No recent order found</h2>
        <button
          onClick={() => setCurrentPage('shop')}
          className="mt-4 bg-[#124DA6] text-white text-xs font-bold py-2.5 px-6 rounded-lg"
        >
          Go to Hardware Catalog
        </button>
      </div>
    );
  }

  const order = lastOrder;
  const sellerPhoneDisplay = settings.whatsappSellerNotificationNumber || settings.whatsappNumber || '+91 81280 40556';
  const whatsappMsgText = formatSellerOrderWhatsAppMessage(order, settings);

  const handleOpenSellerWhatsApp = () => {
    const url = getSellerWhatsAppUrl(order, settings);
    safeOpenUrl(url);
  };

  const handleCopySlip = () => {
    navigator.clipboard.writeText(whatsappMsgText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="py-8 sm:py-14 bg-[#F7F9FC] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden p-6 sm:p-10 space-y-7">
          {/* Top Success Badge */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-600">
                Payment & Order Confirmed
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#083B82]">
                Order Placed Successfully!
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">
                Thank you, <strong className="text-gray-900">{order.customerName}</strong>! Your order is registered in our system and ready for fulfillment.
              </p>
            </div>
          </div>

          {/* Seller WhatsApp Dispatch Highlight Card */}
          <div className="bg-gradient-to-br from-emerald-50 via-green-50/80 to-emerald-100/60 border-2 border-emerald-300/80 rounded-2xl p-5 shadow-xs space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-extrabold text-emerald-950">
                      Order Details Sent to Seller WhatsApp
                    </h3>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                      Auto Dispatch Active
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-800 font-medium mt-0.5 leading-relaxed">
                    Seller WhatsApp: <strong className="font-mono font-bold text-emerald-950">{sellerPhoneDisplay}</strong>. All hardware items, quantities, pricing, and destination have been formatted for instant packing.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-stretch sm:self-auto">
                <button
                  type="button"
                  onClick={handleOpenSellerWhatsApp}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-black shadow-sm hover:shadow-md transition-all cursor-pointer"
                  title="Open Seller WhatsApp with complete Order Slip"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send to Seller WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </button>
              </div>
            </div>

            {/* Message controls */}
            <div className="pt-2 border-t border-emerald-200/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-emerald-900">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Includes customer mobile, shipping address, line items & bill breakdown</span>
              </span>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCopySlip}
                  className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-950 font-bold transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Slip Copied!' : 'Copy WhatsApp Slip'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowMsgPreview(!showMsgPreview)}
                  className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-950 font-bold transition-colors cursor-pointer"
                >
                  {showMsgPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showMsgPreview ? 'Hide Text' : 'View Dispatched Text'}</span>
                </button>
              </div>
            </div>

            {/* Dispatched WhatsApp text preview */}
            {showMsgPreview && (
              <div className="mt-2 bg-white/95 rounded-xl p-3.5 border border-emerald-300 font-mono text-[11px] text-slate-800 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto shadow-inner">
                {whatsappMsgText}
              </div>
            )}
          </div>

          {/* Quick Order Info Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs">
            <div>
              <span className="text-gray-400 block text-[11px]">Order Reference</span>
              <strong className="text-sm font-black text-[#124DA6]">{order.orderNumber}</strong>
            </div>
            <div>
              <span className="text-gray-400 block text-[11px]">Estimated Delivery</span>
              <strong className="text-gray-900 font-bold flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-[#E87500]" />
                <span>{new Date(order.estimatedDeliveryDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </strong>
            </div>
            <div>
              <span className="text-gray-400 block text-[11px]">Payment Mode</span>
              <strong className="text-gray-900 font-bold uppercase">{order.paymentMethod} ({order.paymentStatus})</strong>
            </div>
          </div>

          {/* Items Summary */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 text-xs font-bold text-gray-700 uppercase tracking-wider flex justify-between">
              <span>Items Ordered</span>
              <span>Amount</span>
            </div>
            <div className="divide-y divide-gray-100 p-4 max-h-60 overflow-y-auto">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt="" className="w-10 h-10 rounded object-cover border border-gray-200" />
                    <div>
                      <h4 className="font-bold text-gray-900">{item.name}</h4>
                      <p className="text-[11px] text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                    </div>
                  </div>
                  <span className="font-black text-gray-900">₹{item.total.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-4 border-t border-gray-200 text-xs space-y-1.5">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-[#E87500] font-semibold">
                  <span>Discount</span>
                  <span>-₹{order.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-gray-900 pt-2 border-t border-gray-200">
                <span>Total Paid</span>
                <span className="text-[#083B82] text-base">₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Delivery Address Box */}
          <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 text-xs text-gray-700 flex items-start gap-3">
            <MapPin className="w-4 h-4 text-[#124DA6] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-gray-900">Delivery Address:</p>
              <p>{order.shippingAddress.houseFlat}, {order.shippingAddress.streetArea}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
              <p className="mt-1 text-gray-500">Mobile: {order.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={() => setCurrentPage('my-orders', { phone: order.customerPhone })}
              className="w-full sm:flex-1 bg-[#124DA6] hover:bg-[#083B82] text-white text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>Track Order Status</span>
            </button>

            <button
              onClick={() => openWhatsAppEnquiry(undefined, `Hello Devshree, I placed order #${order.orderNumber} for ₹${order.total}. Please share dispatch updates!`)}
              className="w-full sm:flex-1 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat with Store on WhatsApp</span>
            </button>

            <button
              onClick={handlePrint}
              className="w-full sm:w-auto p-3 border border-gray-300 hover:bg-gray-100 rounded-xl text-gray-700 transition-colors cursor-pointer"
              title="Print Receipt"
              aria-label="Print Receipt"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => setCurrentPage('shop')}
              className="text-xs font-bold text-[#124DA6] hover:underline cursor-pointer"
            >
              ← Continue Hardware Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
