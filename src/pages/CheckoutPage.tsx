import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { api } from '../services/api';
import { ShippingAddress, PaymentMethod } from '../types';
import { sendOrderDetailsToSellerWhatsApp } from '../utils/whatsappOrderNotifier';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  AlertCircle,
  Building2,
  Sparkles,
  Smartphone,
  Banknote,
  MessageCircle
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    couponDiscount,
    appliedCoupon,
    clearCart,
    setCurrentPage,
    setLastOrder,
    settings,
    customerInfo,
    setCustomerInfo,
    savedAddress,
    setSavedAddress,
    showToast
  } = useStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [name, setName] = useState(customerInfo.name || '');
  const [phone, setPhone] = useState(customerInfo.phone || '');
  const [email, setEmail] = useState(customerInfo.email || '');
  const [companyName, setCompanyName] = useState('');
  const [gstNumber, setGstNumber] = useState('');

  // Address
  const [houseFlat, setHouseFlat] = useState(savedAddress?.houseFlat || '');
  const [streetArea, setStreetArea] = useState(savedAddress?.streetArea || '');
  const [landmark, setLandmark] = useState(savedAddress?.landmark || '');
  const [city, setCity] = useState(savedAddress?.city || 'Rajkot');
  const [state, setState] = useState(savedAddress?.state || 'Gujarat');
  const [pincode, setPincode] = useState(savedAddress?.pincode || '360002');
  const [addressType, setAddressType] = useState<'home' | 'work' | 'site'>('site');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  const freeShippingThreshold = settings.freeShippingThreshold || 999;
  const isFreeShipping = cartSubtotal >= freeShippingThreshold;
  const shippingFee = isFreeShipping || cart.length === 0 ? 0 : settings.standardShippingFee || 79;
  const taxableSubtotal = Math.max(0, cartSubtotal - couponDiscount);
  const finalTotal = taxableSubtotal + shippingFee;

  if (cart.length === 0) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-bold">Your cart is empty</h2>
        <button
          onClick={() => setCurrentPage('shop')}
          className="mt-4 bg-[#124DA6] text-white text-xs font-bold py-2.5 px-6 rounded-lg"
        >
          Browse Hardware
        </button>
      </div>
    );
  }

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      showToast('Please enter your full name and mobile number', 'error');
      return;
    }
    setCustomerInfo({ name, phone, email });
    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!houseFlat.trim() || !streetArea.trim() || pincode.length !== 6) {
      showToast('Please complete all address fields and a valid 6-digit pincode', 'error');
      return;
    }
    const address: ShippingAddress = {
      fullName: name,
      phone,
      email,
      houseFlat,
      streetArea,
      landmark,
      city,
      state,
      pincode,
      addressType,
      companyName: companyName || undefined,
      gstNumber: gstNumber || undefined
    };
    setSavedAddress(address);
    setStep(3);
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      const address: ShippingAddress = {
        fullName: name,
        phone,
        email,
        houseFlat,
        streetArea,
        landmark,
        city,
        state,
        pincode,
        addressType,
        companyName: companyName || undefined,
        gstNumber: gstNumber || undefined
      };

      const orderPayload = {
        items: cart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
          name: item.product.name,
          mrp: item.product.mrp,
          image: item.product.images[0]
        })),
        customer: { name, phone, email },
        shippingAddress: address,
        paymentMethod,
        couponCode: appliedCoupon?.code
      };

      const response = await api.placeOrder(orderPayload);
      if (response.success && response.order) {
        setLastOrder(response.order);
        clearCart();
        showToast('Order confirmed! Sending details to seller WhatsApp...', 'success');

        // Automatically dispatch order details to Seller WhatsApp
        if (settings.whatsappSellerNotificationEnabled !== false) {
          sendOrderDetailsToSellerWhatsApp(response.order, settings);
        }

        setCurrentPage('order-success', { orderId: response.order.id });
      }
    } catch (err: any) {
      showToast(err.message || 'Payment processing error. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="py-6 sm:py-10 bg-[#F7F9FC] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#083B82]">
              Secure Hardware Checkout
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              100% Secure & Encrypted Transaction
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <Lock className="w-3.5 h-3.5" />
            <span>256-Bit SSL Safe</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Checkout Steps (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Step 1: Customer Details */}
            <div className={`bg-white rounded-2xl border p-5 sm:p-6 transition-all ${
              step === 1 ? 'border-[#124DA6] shadow-sm' : 'border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full text-xs font-extrabold flex items-center justify-center ${
                    step > 1 ? 'bg-emerald-600 text-white' : 'bg-[#124DA6] text-white'
                  }`}>
                    {step > 1 ? <CheckCircle2 className="w-4 h-4" /> : '1'}
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">Contact Information</h3>
                </div>
                {step > 1 && (
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs font-bold text-[#124DA6] hover:underline"
                  >
                    Edit
                  </button>
                )}
              </div>

              {step === 1 ? (
                <form onSubmit={handleStep1Submit} className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Bhavesh Patel"
                        className="w-full text-xs px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#124DA6]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Mobile Number (For Delivery SMS & WhatsApp) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+91 98250 XXXXX"
                        className="w-full text-xs px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#124DA6]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Email Address (For Tax Invoice & Receipt)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="e.g. bhavesh@gmail.com"
                      className="w-full text-xs px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#124DA6]"
                    />
                  </div>

                  {/* B2B Optional GST Section */}
                  <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-200/70 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#083B82]">
                      <Building2 className="w-4 h-4 text-[#E87500]" />
                      <span>Are you purchasing for a Business / Firm? (Optional GST Credit)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={companyName}
                        onChange={e => setCompanyName(e.target.value)}
                        placeholder="Company / Workshop Name"
                        className="w-full text-xs px-3 py-2 bg-white border border-gray-300 rounded-lg"
                      />
                      <input
                        type="text"
                        value={gstNumber}
                        onChange={e => setGstNumber(e.target.value.toUpperCase())}
                        placeholder="GSTIN (15 Digits)"
                        className="w-full text-xs px-3 py-2 bg-white border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-[#124DA6] hover:bg-[#083B82] text-white text-xs font-bold py-2.5 px-6 rounded-lg shadow-sm"
                  >
                    Continue to Delivery Address →
                  </button>
                </form>
              ) : (
                <div className="text-xs text-gray-600">
                  <p className="font-semibold text-gray-900">{name} ({phone})</p>
                  {email && <p>{email}</p>}
                  {gstNumber && <p className="text-[#083B82]">GSTIN: {gstNumber}</p>}
                </div>
              )}
            </div>

            {/* Step 2: Delivery Address */}
            <div className={`bg-white rounded-2xl border p-5 sm:p-6 transition-all ${
              step === 2 ? 'border-[#124DA6] shadow-sm' : 'border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full text-xs font-extrabold flex items-center justify-center ${
                    step > 2 ? 'bg-emerald-600 text-white' : step === 2 ? 'bg-[#124DA6] text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step > 2 ? <CheckCircle2 className="w-4 h-4" /> : '2'}
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">Delivery Address</h3>
                </div>
                {step > 2 && (
                  <button
                    onClick={() => setStep(2)}
                    className="text-xs font-bold text-[#124DA6] hover:underline"
                  >
                    Edit
                  </button>
                )}
              </div>

              {step === 2 ? (
                <form onSubmit={handleStep2Submit} className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        House / Flat / Shop / Site No. *
                      </label>
                      <input
                        type="text"
                        required
                        value={houseFlat}
                        onChange={e => setHouseFlat(e.target.value)}
                        placeholder="e.g. Shop 4 / Plot 12"
                        className="w-full text-xs px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#124DA6]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Street, Area & Road *
                      </label>
                      <input
                        type="text"
                        required
                        value={streetArea}
                        onChange={e => setStreetArea(e.target.value)}
                        placeholder="e.g. Near Patel Chowk, 80 Feet Road"
                        className="w-full text-xs px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#124DA6]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        City / District *
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#124DA6]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        required
                        value={state}
                        onChange={e => setState(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#124DA6]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={pincode}
                        onChange={e => setPincode(e.target.value.replace(/\D/g, ''))}
                        className="w-full text-xs px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#124DA6]"
                      />
                    </div>
                  </div>

                  {/* Address Type */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Address Type
                    </label>
                    <div className="flex gap-4 text-xs">
                      {(['site', 'work', 'home'] as const).map(type => (
                        <label key={type} className="flex items-center gap-1.5 cursor-pointer capitalize">
                          <input
                            type="radio"
                            name="addressType"
                            checked={addressType === type}
                            onChange={() => setAddressType(type)}
                            className="text-[#124DA6]"
                          />
                          <span>{type === 'site' ? 'Construction Site / Workshop' : type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-[#124DA6] hover:bg-[#083B82] text-white text-xs font-bold py-2.5 px-6 rounded-lg shadow-sm"
                  >
                    Proceed to Payment Options →
                  </button>
                </form>
              ) : step > 2 ? (
                <div className="text-xs text-gray-600">
                  <p>{houseFlat}, {streetArea}</p>
                  <p>{city}, {state} - <strong>{pincode}</strong></p>
                </div>
              ) : (
                <p className="text-xs text-gray-400">Complete contact info first.</p>
              )}
            </div>

            {/* Step 3: Payment Options */}
            <div className={`bg-white rounded-2xl border p-5 sm:p-6 transition-all ${
              step === 3 ? 'border-[#124DA6] shadow-sm' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-7 h-7 rounded-full text-xs font-extrabold flex items-center justify-center ${
                  step === 3 ? 'bg-[#124DA6] text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  3
                </div>
                <h3 className="text-sm font-bold text-gray-900">Select Payment Method</h3>
              </div>

              {step === 3 && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-2.5">
                    {/* UPI */}
                    <label
                      className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors ${
                        paymentMethod === 'upi' ? 'border-[#124DA6] bg-blue-50/50' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="upi"
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                        className="mt-1 text-[#124DA6]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                            <Smartphone className="w-4 h-4 text-[#124DA6]" />
                            <span>Instant UPI (Google Pay, PhonePe, Paytm, BHIM)</span>
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                            Fastest
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Pay directly from any mobile UPI application or scan QR.
                        </p>
                      </div>
                    </label>

                    {/* Credit / Debit Cards */}
                    <label
                      className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors ${
                        paymentMethod === 'card' ? 'border-[#124DA6] bg-blue-50/50' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="mt-1 text-[#124DA6]"
                      />
                      <div className="flex-1">
                        <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4 text-[#124DA6]" />
                          <span>Credit / Debit Cards (Visa, MasterCard, RuPay)</span>
                        </span>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Secure 3D-Secure authentication with OTP.
                        </p>
                      </div>
                    </label>

                    {/* Cash on Delivery (COD) */}
                    {settings.isCodEnabled && (
                      <label
                        className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors ${
                          paymentMethod === 'cod' ? 'border-[#124DA6] bg-blue-50/50' : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="mt-1 text-[#124DA6]"
                        />
                        <div className="flex-1">
                          <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                            <Banknote className="w-4 h-4 text-emerald-600" />
                            <span>Cash on Delivery (Pay at time of delivery)</span>
                          </span>
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            Inspect your sealed hardware crate and pay cash or UPI to the delivery executive.
                          </p>
                        </div>
                      </label>
                    )}
                  </div>

                    {/* Seller WhatsApp Dispatch Notice */}
                    <div className="bg-emerald-50/90 border border-emerald-200 rounded-xl p-3.5 flex items-start gap-2.5 text-emerald-900 shadow-2xs">
                      <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="text-[11px] leading-relaxed">
                        <span className="font-extrabold text-emerald-950 block">Instant Seller WhatsApp Dispatch Active:</span>
                        All hardware line items, customer mobile, and delivery destination details will be routed to Devshree seller WhatsApp (<span className="font-mono font-bold text-emerald-800">{settings.whatsappSellerNotificationNumber || settings.whatsappNumber}</span>) immediately upon order confirmation for crate packing and priority dispatch.
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={handlePlaceOrder}
                        disabled={isProcessing}
                        className="w-full bg-[#E87500] hover:bg-[#F28C00] text-white text-sm font-extrabold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all transform hover:scale-[1.01] cursor-pointer"
                      >
                      {isProcessing ? (
                        <span>Validating Order with Server...</span>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>PAY & CONFIRM ORDER (₹{finalTotal.toLocaleString('en-IN')})</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar (4 cols) */}
          <div className="lg:col-span-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-4 sticky top-28">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-3">
                Items In Order ({cart.length})
              </h3>

              <div className="max-h-56 overflow-y-auto divide-y divide-gray-100 pr-1">
                {cart.map(item => (
                  <div key={item.product.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={item.product.images[0]}
                        alt=""
                        className="w-10 h-10 rounded object-cover border border-gray-100 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{item.product.name}</p>
                        <p className="text-[10px] text-gray-500">Qty: {item.quantity} × ₹{item.product.price}</p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900 shrink-0 ml-2">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-100 pt-3 space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-[#E87500]">
                    <span>Coupon ({appliedCoupon?.code})</span>
                    <span className="font-bold">-₹{couponDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Express Shipping</span>
                  <span className="font-bold">
                    {shippingFee === 0 ? <span className="text-emerald-600">FREE</span> : `₹${shippingFee}`}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between items-baseline text-sm">
                  <span className="font-bold text-gray-900">Grand Total</span>
                  <span className="text-xl font-black text-[#083B82]">
                    ₹{finalTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
