import { Order, StoreSettings } from '../types';

/**
 * Formats full order details into a clean, professional WhatsApp message
 * designed specifically for the store seller/warehouse dispatch team.
 */
export function formatSellerOrderWhatsAppMessage(order: Order, settings?: Partial<StoreSettings>): string {
  const storeName = settings?.businessName || 'Devshree - The Hardware Gallery';
  const lines: string[] = [];

  lines.push(`🔔 *NEW HARDWARE ORDER RECEIVED!* 🛒`);
  lines.push(`🏪 Store: *${storeName}*`);
  lines.push(`📋 Order ID: *#${order.orderNumber}*`);
  lines.push(
    `📅 Date: ${new Date(order.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })} at ${new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  );
  lines.push(``);

  lines.push(`👤 *CUSTOMER DETAILS:*`);
  lines.push(`• Name: *${order.customerName}*`);
  lines.push(`• Phone: *${order.customerPhone}*`);
  if (order.customerEmail && !order.customerEmail.includes('@devshree.in')) {
    lines.push(`• Email: ${order.customerEmail}`);
  }
  if (order.shippingAddress.companyName) {
    lines.push(`• Firm / Company: ${order.shippingAddress.companyName}`);
  }
  if (order.shippingAddress.gstNumber) {
    lines.push(`• GSTIN: ${order.shippingAddress.gstNumber}`);
  }
  lines.push(``);

  lines.push(`📍 *DELIVERY / SITE ADDRESS:*`);
  lines.push(`• ${order.shippingAddress.houseFlat}, ${order.shippingAddress.streetArea}`);
  if (order.shippingAddress.landmark) {
    lines.push(`• Landmark: ${order.shippingAddress.landmark}`);
  }
  lines.push(`• City: ${order.shippingAddress.city}, ${order.shippingAddress.state}`);
  lines.push(`• PIN Code: *${order.shippingAddress.pincode}*`);
  lines.push(`• Address Type: ${order.shippingAddress.addressType.toUpperCase()}`);
  lines.push(``);

  lines.push(`📦 *ITEMS ORDERED (${order.items.length}):*`);
  order.items.forEach((item, index) => {
    lines.push(`${index + 1}. *${item.name}*`);
    if (item.sku) {
      lines.push(`   SKU: ${item.sku}`);
    }
    lines.push(
      `   Qty: *${item.quantity}* × ₹${item.price.toLocaleString('en-IN')} = ₹${item.total.toLocaleString('en-IN')}`
    );
  });
  lines.push(``);

  lines.push(`💰 *PAYMENT & BILLING SUMMARY:*`);
  lines.push(`• Items Subtotal: ₹${order.subtotal.toLocaleString('en-IN')}`);
  if (order.discount > 0) {
    lines.push(`• Coupon Discount: -₹${order.discount.toLocaleString('en-IN')} (${order.couponCode || 'PROMO'})`);
  }
  lines.push(`• Shipping: ${order.shippingFee === 0 ? 'FREE' : '₹' + order.shippingFee}`);
  lines.push(`• *TOTAL PAYABLE: ₹${order.total.toLocaleString('en-IN')}*`);
  lines.push(
    `• Payment Mode: *${order.paymentMethod.toUpperCase()}* (${
      order.paymentStatus === 'paid' ? '✅ Paid Online' : '⏳ Cash on Delivery (COD)'
    })`
  );
  lines.push(``);

  lines.push(`🚚 *DISPATCH TARGET:*`);
  lines.push(`• Estimated Delivery: ${order.estimatedDeliveryDate}`);
  lines.push(``);
  lines.push(`_Automated order alert from Devshree Storefront._`);

  return lines.join('\n');
}

/**
 * Returns the wa.me URL targeting the seller's configured WhatsApp phone number.
 */
export function getSellerWhatsAppUrl(order: Order, settings: StoreSettings): string {
  const sellerNumber = (
    settings.whatsappSellerNotificationNumber ||
    settings.whatsappNumber ||
    '+918128040556'
  ).replace(/[^0-9]/g, '');

  const message = formatSellerOrderWhatsAppMessage(order, settings);
  return `https://wa.me/${sellerNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Safely opens an external URL even within sandboxed iframes without throwing errors.
 */
export function safeOpenUrl(url: string): boolean {
  try {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return true;
  } catch {
    try {
      const win = window.open(url, '_blank', 'noopener,noreferrer');
      return !!win;
    } catch {
      return false;
    }
  }
}

/**
 * Dispatches the order details directly to the seller's WhatsApp in a new tab/window.
 */
export function sendOrderDetailsToSellerWhatsApp(order: Order, settings: StoreSettings): boolean {
  try {
    const url = getSellerWhatsAppUrl(order, settings);
    return safeOpenUrl(url);
  } catch {
    return false;
  }
}
