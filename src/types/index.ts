export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  brand: string;
  category: string;
  subcategory?: string;
  price: number;
  mrp: number;
  discountPercentage: number;
  stock: number;
  lowStockThreshold: number;
  images: string[];
  description: string;
  shortDescription: string;
  material: string;
  finish?: string;
  dimensions?: string;
  weight?: string;
  specifications: Record<string, string>;
  features: string[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isOffer?: boolean;
  bulkPricing?: { minQty: number; price: number }[];
  rating: number;
  reviewsCount: number;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  iconName: string;
  subcategories: string[];
  itemCount: number;
  displayOrder: number;
  isActive: boolean;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  tagline: string;
  isActive: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  desktopImage: string;
  mobileImage: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  themeColor: string;
  order: number;
  isActive: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email?: string;
  houseFlat: string;
  streetArea: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  addressType: 'home' | 'work' | 'site';
  companyName?: string;
  gstNumber?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  sku: string;
  price: number;
  mrp: number;
  quantity: number;
  image: string;
  total: number;
}

export type OrderStatus =
  | 'Order Placed'
  | 'Confirmed'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Refunded';

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cod';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  estimatedGst: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pending' | 'cod_pending' | 'failed';
  paymentId?: string;
  orderStatus: OrderStatus;
  timeline: { status: OrderStatus; timestamp: string; note: string }[];
  trackingNumber?: string;
  courierName?: string;
  estimatedDeliveryDate: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  applicableCategory?: string;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usageCount: number;
  isActive: boolean;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  bannerImage: string;
  badge: string;
  discountTag: string;
  link: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface BulkEnquiry {
  id: string;
  name: string;
  companyName: string;
  phone: string;
  email: string;
  city: string;
  productsRequired: string;
  estimatedQuantity: string;
  status: 'new' | 'contacted' | 'quoted' | 'closed';
  notes?: string;
  createdAt: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  rating: number;
  headline: string;
  comment: string;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  createdAt: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Orders & Delivery' | 'Bulk & Contractor' | 'Products & Warranty' | 'Payment & Returns';
  displayOrder: number;
  isActive: boolean;
}

export interface HomepageSection {
  id: string;
  name: string;
  title: string;
  isEnabled: boolean;
  order: number;
}

export interface StoreSettings {
  businessName: string;
  tagline: string;
  logoUrl?: string;
  phone: string;
  alternatePhone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstNumber: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  isCodEnabled: boolean;
  isRazorpayTestMode: boolean;
  announcementText: string;
  isAnnouncementEnabled: boolean;
  chatbotEnabled: boolean;
  chatbotWelcomeMsg: string;
  whatsappSellerNotificationEnabled?: boolean;
  whatsappSellerNotificationNumber?: string;
}
