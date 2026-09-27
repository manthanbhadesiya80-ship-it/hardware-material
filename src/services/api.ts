import {
  Product,
  Category,
  Brand,
  Banner,
  Coupon,
  Offer,
  HomepageSection,
  StoreSettings,
  ProductReview,
  FAQItem,
  Order,
  BulkEnquiry,
  ShippingAddress
} from '../types';
import {
  INITIAL_SETTINGS,
  INITIAL_CATEGORIES,
  INITIAL_BRANDS,
  INITIAL_PRODUCTS,
  INITIAL_BANNERS,
  INITIAL_COUPONS,
  INITIAL_OFFERS,
  INITIAL_HOMEPAGE_SECTIONS,
  INITIAL_REVIEWS,
  INITIAL_FAQS,
  INITIAL_ORDERS
} from '../data/initialData';

const BASE_URL = '/api';

// Safe fetch wrapper with timeout
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const token = localStorage.getItem('devshree_admin_token');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    let errorMsg = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMsg = errorData.error || errorData.message || errorMsg;
    } catch {
      errorMsg = `Server error (${response.status})`;
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export const api = {
  // Store Settings
  async getSettings(): Promise<StoreSettings> {
    try {
      return await request<StoreSettings>('/settings');
    } catch {
      return INITIAL_SETTINGS;
    }
  },
  async updateSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
    return request<StoreSettings>('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  },

  // Products
  async getProducts(params?: {
    category?: string;
    brand?: string;
    search?: string;
    featured?: boolean;
    bestSeller?: boolean;
    offer?: boolean;
    sort?: string;
  }): Promise<Product[]> {
    try {
      const query = new URLSearchParams();
      if (params?.category) query.set('category', params.category);
      if (params?.brand) query.set('brand', params.brand);
      if (params?.search) query.set('search', params.search);
      if (params?.featured) query.set('featured', 'true');
      if (params?.bestSeller) query.set('bestSeller', 'true');
      if (params?.offer) query.set('offer', 'true');
      if (params?.sort) query.set('sort', params.sort);

      return await request<Product[]>(`/products?${query.toString()}`);
    } catch {
      return INITIAL_PRODUCTS;
    }
  },

  async getProductByIdOrSlug(idOrSlug: string): Promise<Product> {
    try {
      return await request<Product>(`/products/${idOrSlug}`);
    } catch {
      const found = INITIAL_PRODUCTS.find(p => p.id === idOrSlug || p.slug === idOrSlug);
      if (found) return found;
      throw new Error('Product not found');
    }
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    return request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(product)
    });
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    return request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product)
    });
  },

  async deleteProduct(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/products/${id}`, {
      method: 'DELETE'
    });
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    try {
      return await request<Category[]>('/categories');
    } catch {
      return INITIAL_CATEGORIES;
    }
  },

  async createCategory(cat: Partial<Category>): Promise<Category> {
    return request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(cat)
    });
  },

  async updateCategory(id: string, cat: Partial<Category>): Promise<Category> {
    return request<Category>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cat)
    });
  },

  async deleteCategory(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/categories/${id}`, {
      method: 'DELETE'
    });
  },

  // Brands
  async getBrands(): Promise<Brand[]> {
    try {
      return await request<Brand[]>('/brands');
    } catch {
      return INITIAL_BRANDS;
    }
  },

  // Banners
  async getBanners(): Promise<Banner[]> {
    try {
      return await request<Banner[]>('/banners');
    } catch {
      return INITIAL_BANNERS;
    }
  },

  async createBanner(banner: Partial<Banner>): Promise<Banner> {
    return request<Banner>('/banners', {
      method: 'POST',
      body: JSON.stringify(banner)
    });
  },

  async updateBanner(id: string, banner: Partial<Banner>): Promise<Banner> {
    return request<Banner>(`/banners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(banner)
    });
  },

  async deleteBanner(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/banners/${id}`, {
      method: 'DELETE'
    });
  },

  // Homepage CMS Sections
  async getHomepageSections(): Promise<HomepageSection[]> {
    try {
      return await request<HomepageSection[]>('/homepage-sections');
    } catch {
      return INITIAL_HOMEPAGE_SECTIONS;
    }
  },

  async updateHomepageSections(sections: HomepageSection[]): Promise<HomepageSection[]> {
    return request<HomepageSection[]>('/homepage-sections', {
      method: 'PUT',
      body: JSON.stringify(sections)
    });
  },

  // Coupons
  async getCoupons(): Promise<Coupon[]> {
    try {
      return await request<Coupon[]>('/coupons');
    } catch {
      return INITIAL_COUPONS;
    }
  },

  async createCoupon(coupon: Partial<Coupon>): Promise<Coupon> {
    return request<Coupon>('/coupons', {
      method: 'POST',
      body: JSON.stringify(coupon)
    });
  },

  async deleteCoupon(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/coupons/${id}`, {
      method: 'DELETE'
    });
  },

  async validateCoupon(code: string, cartTotal: number): Promise<{
    valid: boolean;
    code: string;
    discountAmount: number;
    coupon: Coupon;
  }> {
    return request<{
      valid: boolean;
      code: string;
      discountAmount: number;
      coupon: Coupon;
    }>('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, cartTotal })
    });
  },

  // Offers
  async getOffers(): Promise<Offer[]> {
    try {
      return await request<Offer[]>('/offers');
    } catch {
      return INITIAL_OFFERS;
    }
  },

  async createOffer(offer: Partial<Offer>): Promise<Offer> {
    return request<Offer>('/offers', {
      method: 'POST',
      body: JSON.stringify(offer)
    });
  },

  async deleteOffer(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/offers/${id}`, {
      method: 'DELETE'
    });
  },

  // Orders
  async getOrders(params?: { customerPhone?: string; customerEmail?: string }): Promise<Order[]> {
    try {
      const q = new URLSearchParams();
      if (params?.customerPhone) q.set('customerPhone', params.customerPhone);
      if (params?.customerEmail) q.set('customerEmail', params.customerEmail);
      return await request<Order[]>(`/orders?${q.toString()}`);
    } catch {
      return INITIAL_ORDERS;
    }
  },

  async getOrderById(id: string): Promise<Order> {
    return request<Order>(`/orders/${id}`);
  },

  async placeOrder(orderData: {
    items: { productId: string; quantity: number; price: number; name: string; mrp: number; image: string }[];
    customer: { name: string; phone: string; email?: string };
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    couponCode?: string;
  }): Promise<{ success: boolean; order: Order }> {
    return request<{ success: boolean; order: Order }>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  },

  async updateOrderStatus(
    orderId: string,
    status: string,
    note?: string,
    trackingNumber?: string,
    courierName?: string
  ): Promise<Order> {
    return request<Order>(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, note, trackingNumber, courierName })
    });
  },

  async deleteOrder(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/orders/${id}`, {
      method: 'DELETE'
    });
  },

  // Bulk Enquiries
  async getBulkEnquiries(): Promise<BulkEnquiry[]> {
    return request<BulkEnquiry[]>('/bulk-enquiries');
  },

  async submitBulkEnquiry(enquiry: Omit<BulkEnquiry, 'id' | 'createdAt' | 'status'>): Promise<{ success: boolean; enquiry: BulkEnquiry }> {
    return request<{ success: boolean; enquiry: BulkEnquiry }>('/bulk-enquiries', {
      method: 'POST',
      body: JSON.stringify(enquiry)
    });
  },

  async updateBulkEnquiry(id: string, update: Partial<BulkEnquiry>): Promise<BulkEnquiry> {
    return request<BulkEnquiry>(`/bulk-enquiries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(update)
    });
  },

  async deleteBulkEnquiry(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/bulk-enquiries/${id}`, {
      method: 'DELETE'
    });
  },

  // Reviews
  async getReviews(productId?: string): Promise<ProductReview[]> {
    try {
      const q = productId ? `?productId=${productId}` : '';
      return await request<ProductReview[]>(`/reviews${q}`);
    } catch {
      return INITIAL_REVIEWS;
    }
  },

  async submitReview(review: Omit<ProductReview, 'id' | 'createdAt' | 'isApproved' | 'isVerifiedPurchase'>): Promise<ProductReview> {
    return request<ProductReview>('/reviews', {
      method: 'POST',
      body: JSON.stringify(review)
    });
  },

  async toggleApproveReview(id: string): Promise<ProductReview> {
    return request<ProductReview>(`/reviews/${id}/approve`, {
      method: 'PUT'
    });
  },

  async deleteReview(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/reviews/${id}`, {
      method: 'DELETE'
    });
  },

  // FAQs
  async getFaqs(): Promise<FAQItem[]> {
    try {
      return await request<FAQItem[]>('/faqs');
    } catch {
      return INITIAL_FAQS;
    }
  },

  async createFaq(faq: Partial<FAQItem>): Promise<FAQItem> {
    return request<FAQItem>('/faqs', {
      method: 'POST',
      body: JSON.stringify(faq)
    });
  },

  async updateFaq(id: string, faq: Partial<FAQItem>): Promise<FAQItem> {
    return request<FAQItem>(`/faqs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(faq)
    });
  },

  async deleteFaq(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/faqs/${id}`, {
      method: 'DELETE'
    });
  },

  // AI Chat
  async sendChatMessage(message: string, history?: { role: string; text: string }[]): Promise<{
    reply: string;
    recommendedProducts: Product[];
  }> {
    return request<{ reply: string; recommendedProducts: Product[] }>('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, history })
    });
  },

  // Admin Auth
  async adminLogin(email: string, password: string): Promise<{
    success: boolean;
    token: string;
    admin: { email: string; name: string; role: string };
  }> {
    return request<{
      success: boolean;
      token: string;
      admin: { email: string; name: string; role: string };
    }>('/auth/admin-login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  async verifyAdminToken(): Promise<{ valid: boolean }> {
    try {
      return await request<{ valid: boolean }>('/auth/verify-token');
    } catch {
      return { valid: false };
    }
  }
};
