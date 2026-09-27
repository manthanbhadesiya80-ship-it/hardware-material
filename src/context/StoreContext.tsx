import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  Coupon,
  StoreSettings,
  ShippingAddress,
  Order
} from '../types';
import { api } from '../services/api';
import { INITIAL_SETTINGS } from '../data/initialData';
import { safeOpenUrl } from '../utils/whatsappOrderNotifier';

export type PageRoute =
  | 'home'
  | 'shop'
  | 'category'
  | 'product'
  | 'cart'
  | 'checkout'
  | 'order-success'
  | 'my-orders'
  | 'about'
  | 'contact'
  | 'offers'
  | 'faq'
  | 'bulk-quote'
  | 'policies'
  | 'admin';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface StoreContextType {
  currentPage: PageRoute;
  setCurrentPage: (page: PageRoute, params?: Record<string, any>) => void;
  pageParams: Record<string, any>;
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => Promise<void>;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartSavings: number;

  // Coupon
  appliedCoupon: Coupon | null;
  couponDiscount: number;
  applyCouponCode: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Quick View
  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;

  // Toast
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // User details & last order
  customerInfo: { name: string; phone: string; email: string };
  setCustomerInfo: React.Dispatch<React.SetStateAction<{ name: string; phone: string; email: string }>>;
  savedAddress: ShippingAddress | null;
  setSavedAddress: React.Dispatch<React.SetStateAction<ShippingAddress | null>>;
  lastOrder: Order | null;
  setLastOrder: React.Dispatch<React.SetStateAction<Order | null>>;

  // WhatsApp Helper
  openWhatsAppEnquiry: (product?: Product, customMsg?: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPageState] = useState<PageRoute>('home');
  const [pageParams, setPageParams] = useState<Record<string, any>>({});
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);

  // Cart from local storage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('devshree_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('devshree_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Customer state
  const [customerInfo, setCustomerInfo] = useState(() => {
    try {
      const saved = localStorage.getItem('devshree_customer');
      return saved ? JSON.parse(saved) : { name: '', phone: '', email: '' };
    } catch {
      return { name: '', phone: '', email: '' };
    }
  });

  const [savedAddress, setSavedAddress] = useState<ShippingAddress | null>(() => {
    try {
      const saved = localStorage.getItem('devshree_address');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('devshree_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('devshree_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('devshree_customer', JSON.stringify(customerInfo));
  }, [customerInfo]);

  useEffect(() => {
    if (savedAddress) {
      localStorage.setItem('devshree_address', JSON.stringify(savedAddress));
    }
  }, [savedAddress]);

  // Load store settings on boot
  useEffect(() => {
    api.getSettings().then(setSettings).catch(console.error);
  }, []);

  // Listen to browser back/forward or URL hash
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('admin')) {
        setCurrentPageState('admin');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const setCurrentPage = (page: PageRoute, params: Record<string, any> = {}) => {
    setCurrentPageState(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update browser history state
    if (page === 'admin') {
      window.history.pushState({}, '', '#admin');
    } else {
      window.history.pushState({}, '', '#' + page);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added "${product.name.slice(0, 30)}..." to cart`, 'success');
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const cartSubtotal = cart.reduce((total, item) => {
    // Check if bulk pricing applies
    let unitPrice = item.product.price;
    if (item.product.bulkPricing) {
      const sortedTiers = [...item.product.bulkPricing].sort((a, b) => b.minQty - a.minQty);
      const match = sortedTiers.find(t => item.quantity >= t.minQty);
      if (match) {
        unitPrice = match.price;
      }
    }
    return total + unitPrice * item.quantity;
  }, 0);

  const cartMrpTotal = cart.reduce((total, item) => total + item.product.mrp * item.quantity, 0);
  const cartSavings = Math.max(0, cartMrpTotal - cartSubtotal);

  // Coupon handling
  const applyCouponCode = async (code: string) => {
    try {
      const res = await api.validateCoupon(code, cartSubtotal);
      if (res.valid) {
        setAppliedCoupon(res.coupon);
        setCouponDiscount(res.discountAmount);
        showToast(`Coupon ${res.code} applied! Saved ₹${res.discountAmount}`, 'success');
        return { success: true, message: `Saved ₹${res.discountAmount}` };
      } else {
        throw new Error('Invalid coupon');
      }
    } catch (err: any) {
      showToast(err.message || 'Coupon could not be applied', 'error');
      return { success: false, message: err.message || 'Coupon failed' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    showToast('Coupon removed', 'info');
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to wishlist', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Quick view
  const openQuickView = (product: Product) => setQuickViewProduct(product);
  const closeQuickView = () => setQuickViewProduct(null);

  // Update store settings
  const updateSettings = async (newSettings: Partial<StoreSettings>) => {
    const updated = await api.updateSettings(newSettings);
    setSettings(updated);
    showToast('Store settings updated successfully', 'success');
  };

  // WhatsApp Enquiry Link Generator
  const openWhatsAppEnquiry = (product?: Product, customMsg?: string) => {
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    let text = `Namaste Devshree Hardware!\n`;

    if (product) {
      text += `I am interested in:\n*${product.name}*\nSKU: ${product.sku}\nPrice: ₹${product.price}\nLink: ${window.location.origin}/#product?slug=${product.slug}\n\nPlease share availability & best bulk rate.`;
    } else if (customMsg) {
      text += customMsg;
    } else {
      text += `I need assistance with hardware and furniture fittings for my project.`;
    }

    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
    safeOpenUrl(whatsappUrl);
  };

  return (
    <StoreContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        pageParams,
        settings,
        updateSettings,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        cartSavings,
        appliedCoupon,
        couponDiscount,
        applyCouponCode,
        removeCoupon,
        wishlist,
        toggleWishlist,
        isInWishlist,
        quickViewProduct,
        openQuickView,
        closeQuickView,
        toasts,
        showToast,
        removeToast,
        customerInfo,
        setCustomerInfo,
        savedAddress,
        setSavedAddress,
        lastOrder,
        setLastOrder,
        openWhatsAppEnquiry
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
};
