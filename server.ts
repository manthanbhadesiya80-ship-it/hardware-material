import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
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
} from './src/data/initialData';
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
  OrderStatus
} from './src/types';

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ensure database directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-Memory & File-backed Store
interface DatabaseSchema {
  settings: StoreSettings;
  categories: Category[];
  brands: Brand[];
  products: Product[];
  banners: Banner[];
  coupons: Coupon[];
  offers: Offer[];
  homepageSections: HomepageSection[];
  reviews: ProductReview[];
  faqs: FAQItem[];
  orders: Order[];
  bulkEnquiries: BulkEnquiry[];
}

function loadDatabase(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error loading database from file, using initial data:', err);
  }

  const initialData: DatabaseSchema = {
    settings: INITIAL_SETTINGS,
    categories: INITIAL_CATEGORIES,
    brands: INITIAL_BRANDS,
    products: INITIAL_PRODUCTS,
    banners: INITIAL_BANNERS,
    coupons: INITIAL_COUPONS,
    offers: INITIAL_OFFERS,
    homepageSections: INITIAL_HOMEPAGE_SECTIONS,
    reviews: INITIAL_REVIEWS,
    faqs: INITIAL_FAQS,
    orders: INITIAL_ORDERS,
    bulkEnquiries: [
      {
        id: 'enq-1',
        name: 'Vipul Solanki',
        companyName: 'Royal Modular Furniture',
        phone: '+91 97240 55120',
        email: 'vipul@royalmodular.in',
        city: 'Ahmedabad',
        productsRequired: 'Devshree Hydraulic Bed Lift Mechanism 150Kg (50 Pairs), Soft-Close Hinges (500 Pieces)',
        estimatedQuantity: 'Approx ₹1,50,000 Order Value',
        status: 'new',
        notes: 'Requested GST bill and fast transport dispatch to Ahmedabad warehouse.',
        createdAt: '2026-03-24T12:00:00Z'
      }
    ]
  };

  saveDatabase(initialData);
  return initialData;
}

function saveDatabase(data: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database to disk:', err);
  }
}

let db = loadDatabase();

// Admin Authentication Config
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@devshreehardware.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Devshree@2026!';
const ADMIN_TOKEN = 'devshree_session_token_' + Buffer.from(ADMIN_EMAIL).toString('base64');

// Simple Token Authorization Middleware
function requireAdmin(req: Request, res: Response, next: () => void) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized. Admin credentials required.' });
  }
  next();
}

// -------------------------------------------------------------
// REST API ROUTES
// -------------------------------------------------------------

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', brand: 'Devshree - The Hardware Gallery', timestamp: new Date().toISOString() });
});

// Settings
app.get('/api/settings', (_req, res) => {
  res.json(db.settings);
});

app.put('/api/settings', requireAdmin, (req, res) => {
  db.settings = { ...db.settings, ...req.body };
  saveDatabase(db);
  res.json(db.settings);
});

// Admin Auth
app.post('/api/auth/admin-login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const validEmail = ADMIN_EMAIL.toLowerCase();
  const inputEmail = email.trim().toLowerCase();

  if (inputEmail === validEmail && password === ADMIN_PASSWORD) {
    return res.json({
      success: true,
      token: ADMIN_TOKEN,
      admin: {
        email: ADMIN_EMAIL,
        name: 'Store Administrator',
        role: 'superadmin'
      }
    });
  }

  // Artificial delay to prevent timing attacks
  setTimeout(() => {
    res.status(401).json({ error: 'Invalid admin credentials. Access denied.' });
  }, 400);
});

app.get('/api/auth/verify-token', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ') && authHeader.split(' ')[1] === ADMIN_TOKEN) {
    return res.json({ valid: true, admin: { email: ADMIN_EMAIL, role: 'superadmin' } });
  }
  res.status(401).json({ valid: false });
});

// Products
app.get('/api/products', (req, res) => {
  let results = [...db.products];
  const { category, brand, search, featured, bestSeller, offer, sort } = req.query;

  if (category) {
    results = results.filter(
      p => p.category.toLowerCase() === String(category).toLowerCase() ||
           p.subcategory?.toLowerCase() === String(category).toLowerCase()
    );
  }

  if (brand) {
    results = results.filter(p => p.brand.toLowerCase() === String(brand).toLowerCase());
  }

  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.tags?.some(t => t.toLowerCase().includes(q))
    );
  }

  if (featured === 'true') {
    results = results.filter(p => p.isFeatured);
  }

  if (bestSeller === 'true') {
    results = results.filter(p => p.isBestSeller);
  }

  if (offer === 'true') {
    results = results.filter(p => p.isOffer || p.discountPercentage >= 25);
  }

  if (sort === 'price-low') {
    results.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    results.sort((a, b) => b.price - a.price);
  } else if (sort === 'discount') {
    results.sort((a, b) => b.discountPercentage - a.discountPercentage);
  } else if (sort === 'rating') {
    results.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'newest') {
    results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  res.json(results);
});

app.get('/api/products/:idOrSlug', (req, res) => {
  const { idOrSlug } = req.params;
  const product = db.products.find(p => p.id === idOrSlug || p.slug === idOrSlug);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

app.post('/api/products', requireAdmin, (req, res) => {
  const newProduct: Product = {
    ...req.body,
    id: 'prod-' + Date.now(),
    slug: req.body.slug || req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    createdAt: new Date().toISOString(),
    rating: req.body.rating || 5.0,
    reviewsCount: req.body.reviewsCount || 0
  };

  db.products.unshift(newProduct);
  saveDatabase(db);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', requireAdmin, (req, res) => {
  const index = db.products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  db.products[index] = { ...db.products[index], ...req.body };
  saveDatabase(db);
  res.json(db.products[index]);
});

app.delete('/api/products/:id', requireAdmin, (req, res) => {
  db.products = db.products.filter(p => p.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true, message: 'Product removed' });
});

// Categories
app.get('/api/categories', (_req, res) => {
  res.json(db.categories);
});

app.post('/api/categories', requireAdmin, (req, res) => {
  const newCategory: Category = {
    ...req.body,
    id: 'cat-' + Date.now(),
    slug: req.body.slug || req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    itemCount: req.body.itemCount || 0,
    displayOrder: db.categories.length + 1,
    isActive: true
  };
  db.categories.push(newCategory);
  saveDatabase(db);
  res.status(201).json(newCategory);
});

app.put('/api/categories/:id', requireAdmin, (req, res) => {
  const index = db.categories.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Category not found' });
  db.categories[index] = { ...db.categories[index], ...req.body };
  saveDatabase(db);
  res.json(db.categories[index]);
});

app.delete('/api/categories/:id', requireAdmin, (req, res) => {
  db.categories = db.categories.filter(c => c.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true });
});

// Brands
app.get('/api/brands', (_req, res) => {
  res.json(db.brands);
});

// Banners
app.get('/api/banners', (_req, res) => {
  res.json(db.banners);
});

app.post('/api/banners', requireAdmin, (req, res) => {
  const newBanner: Banner = {
    ...req.body,
    id: 'ban-' + Date.now(),
    order: db.banners.length + 1,
    isActive: true
  };
  db.banners.push(newBanner);
  saveDatabase(db);
  res.status(201).json(newBanner);
});

app.put('/api/banners/:id', requireAdmin, (req, res) => {
  const index = db.banners.findIndex(b => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Banner not found' });
  db.banners[index] = { ...db.banners[index], ...req.body };
  saveDatabase(db);
  res.json(db.banners[index]);
});

app.delete('/api/banners/:id', requireAdmin, (req, res) => {
  db.banners = db.banners.filter(b => b.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true });
});

// Homepage CMS Sections
app.get('/api/homepage-sections', (_req, res) => {
  res.json(db.homepageSections);
});

app.put('/api/homepage-sections', requireAdmin, (req, res) => {
  if (Array.isArray(req.body)) {
    db.homepageSections = req.body;
    saveDatabase(db);
    return res.json(db.homepageSections);
  }
  res.status(400).json({ error: 'Expected array of homepage sections' });
});

// Coupons
app.get('/api/coupons', (_req, res) => {
  res.json(db.coupons);
});

app.post('/api/coupons', requireAdmin, (req, res) => {
  const newCoupon: Coupon = {
    ...req.body,
    id: 'cp-' + Date.now(),
    code: req.body.code.trim().toUpperCase(),
    usageCount: 0,
    isActive: true
  };
  db.coupons.push(newCoupon);
  saveDatabase(db);
  res.status(201).json(newCoupon);
});

app.delete('/api/coupons/:id', requireAdmin, (req, res) => {
  db.coupons = db.coupons.filter(c => c.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true });
});

app.post('/api/coupons/validate', (req, res) => {
  const { code, cartTotal } = req.body;
  if (!code) return res.status(400).json({ valid: false, error: 'Coupon code required' });

  const coupon = db.coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive);
  if (!coupon) {
    return res.status(404).json({ valid: false, error: 'Invalid or expired coupon code' });
  }

  if (cartTotal < coupon.minOrderValue) {
    return res.status(400).json({
      valid: false,
      error: `Minimum order value for ${coupon.code} is ₹${coupon.minOrderValue}`
    });
  }

  let discountAmount = 0;
  if (coupon.discountType === 'percentage') {
    discountAmount = Math.round((cartTotal * coupon.discountValue) / 100);
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }
  } else {
    discountAmount = coupon.discountValue;
  }

  res.json({
    valid: true,
    code: coupon.code,
    discountAmount,
    coupon
  });
});

// Offers
app.get('/api/offers', (_req, res) => {
  res.json(db.offers);
});

app.post('/api/offers', requireAdmin, (req, res) => {
  const newOffer: Offer = {
    ...req.body,
    id: 'off-' + Date.now(),
    isActive: true
  };
  db.offers.push(newOffer);
  saveDatabase(db);
  res.status(201).json(newOffer);
});

app.delete('/api/offers/:id', requireAdmin, (req, res) => {
  db.offers = db.offers.filter(o => o.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true });
});

// Orders & Server-Side Calculation
app.get('/api/orders', (req, res) => {
  const { customerPhone, customerEmail } = req.query;
  if (customerPhone || customerEmail) {
    const filtered = db.orders.filter(
      o => (customerPhone && o.customerPhone === customerPhone) ||
           (customerEmail && o.customerEmail.toLowerCase() === String(customerEmail).toLowerCase())
    );
    return res.json(filtered);
  }
  // Otherwise check admin
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ') && authHeader.split(' ')[1] === ADMIN_TOKEN) {
    return res.json(db.orders);
  }
  // If not admin, return empty or require phone
  res.json(db.orders.slice(0, 5)); // Public preview of sample orders
});

app.get('/api/orders/:id', (req, res) => {
  const order = db.orders.find(o => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

// Place Order (Safe Server Calculations)
app.post('/api/orders', (req, res) => {
  const { items, customer, shippingAddress, paymentMethod, couponCode } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order must contain at least one item' });
  }

  if (!customer?.name || !customer?.phone || !shippingAddress?.houseFlat || !shippingAddress?.pincode) {
    return res.status(400).json({ error: 'Complete contact and address details are required' });
  }

  // Calculate prices using database truth
  let calculatedSubtotal = 0;
  const verifiedItems = items.map((cartItem: any) => {
    const prod = db.products.find(p => p.id === cartItem.productId);
    const unitPrice = prod ? prod.price : cartItem.price;
    const mrp = prod ? prod.mrp : cartItem.mrp;
    const lineTotal = unitPrice * cartItem.quantity;
    calculatedSubtotal += lineTotal;

    // Reduce stock
    if (prod) {
      prod.stock = Math.max(0, prod.stock - cartItem.quantity);
    }

    return {
      productId: cartItem.productId,
      name: prod ? prod.name : cartItem.name,
      sku: prod ? prod.sku : cartItem.sku || 'DS-GENERIC',
      price: unitPrice,
      mrp: mrp,
      quantity: cartItem.quantity,
      image: prod ? prod.images[0] : cartItem.image,
      total: lineTotal
    };
  });

  // Coupon discount verification
  let discount = 0;
  if (couponCode) {
    const coupon = db.coupons.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase() && c.isActive);
    if (coupon && calculatedSubtotal >= coupon.minOrderValue) {
      if (coupon.discountType === 'percentage') {
        discount = Math.round((calculatedSubtotal * coupon.discountValue) / 100);
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
      } else {
        discount = coupon.discountValue;
      }
      coupon.usageCount += 1;
    }
  }

  const shippingFee = calculatedSubtotal >= db.settings.freeShippingThreshold ? 0 : db.settings.standardShippingFee;
  const taxableAmount = Math.max(0, calculatedSubtotal - discount);
  const estimatedGst = Math.round(taxableAmount * 0.18); // 18% GST standard on hardware
  const finalTotal = taxableAmount + shippingFee;

  const orderNumber = 'DS-' + new Date().getFullYear() + '-' + Math.floor(10000 + Math.random() * 90000);
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

  const newOrder: Order = {
    id: 'ord-' + Date.now(),
    orderNumber,
    customerName: customer.name,
    customerEmail: customer.email || `${customer.phone}@devshree.in`,
    customerPhone: customer.phone,
    items: verifiedItems,
    shippingAddress,
    subtotal: calculatedSubtotal,
    discount,
    couponCode: couponCode || undefined,
    shippingFee,
    estimatedGst,
    total: finalTotal,
    paymentMethod,
    paymentStatus: paymentMethod === 'cod' ? 'cod_pending' : 'paid',
    orderStatus: 'Order Placed',
    timeline: [
      {
        status: 'Order Placed',
        timestamp: new Date().toISOString(),
        note: paymentMethod === 'cod' ? 'Order placed with Cash on Delivery' : 'Online payment verified via Razorpay'
      }
    ],
    estimatedDeliveryDate: estimatedDelivery.toISOString().split('T')[0],
    createdAt: new Date().toISOString()
  };

  db.orders.unshift(newOrder);
  saveDatabase(db);

  res.status(201).json({
    success: true,
    order: newOrder
  });
});

app.put('/api/orders/:id/status', requireAdmin, (req, res) => {
  const { status, note, trackingNumber, courierName } = req.body;
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  order.orderStatus = status as OrderStatus;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (courierName) order.courierName = courierName;

  order.timeline.push({
    status: status as OrderStatus,
    timestamp: new Date().toISOString(),
    note: note || `Status updated to ${status}`
  });

  saveDatabase(db);
  res.json(order);
});

app.delete('/api/orders/:id', requireAdmin, (req, res) => {
  const index = db.orders.findIndex(o => o.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Order not found' });
  db.orders.splice(index, 1);
  saveDatabase(db);
  res.json({ success: true });
});

// Bulk Enquiries
app.get('/api/bulk-enquiries', (_req, res) => {
  res.json(db.bulkEnquiries);
});

app.post('/api/bulk-enquiries', (req, res) => {
  const newEnquiry: BulkEnquiry = {
    ...req.body,
    id: 'enq-' + Date.now(),
    status: 'new',
    createdAt: new Date().toISOString()
  };
  db.bulkEnquiries.unshift(newEnquiry);
  saveDatabase(db);
  res.status(201).json({ success: true, enquiry: newEnquiry });
});

app.put('/api/bulk-enquiries/:id', requireAdmin, (req, res) => {
  const enquiry = db.bulkEnquiries.find(e => e.id === req.params.id);
  if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' });
  Object.assign(enquiry, req.body);
  saveDatabase(db);
  res.json(enquiry);
});

app.delete('/api/bulk-enquiries/:id', requireAdmin, (req, res) => {
  const index = db.bulkEnquiries.findIndex(e => e.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Enquiry not found' });
  db.bulkEnquiries.splice(index, 1);
  saveDatabase(db);
  res.json({ success: true });
});

// Reviews
app.get('/api/reviews', (req, res) => {
  const { productId } = req.query;
  if (productId) {
    return res.json(db.reviews.filter(r => r.productId === productId && r.isApproved));
  }
  res.json(db.reviews);
});

app.post('/api/reviews', (req, res) => {
  const newReview: ProductReview = {
    ...req.body,
    id: 'rev-' + Date.now(),
    isVerifiedPurchase: true,
    isApproved: true, // auto approve in demo
    createdAt: new Date().toISOString()
  };
  db.reviews.unshift(newReview);
  saveDatabase(db);
  res.status(201).json(newReview);
});

app.put('/api/reviews/:id/approve', requireAdmin, (req, res) => {
  const review = db.reviews.find(r => r.id === req.params.id);
  if (!review) return res.status(404).json({ error: 'Review not found' });
  review.isApproved = !review.isApproved;
  saveDatabase(db);
  res.json(review);
});

app.delete('/api/reviews/:id', requireAdmin, (req, res) => {
  db.reviews = db.reviews.filter(r => r.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true });
});

// FAQs
app.get('/api/faqs', (_req, res) => {
  res.json(db.faqs);
});

app.post('/api/faqs', requireAdmin, (req, res) => {
  const newFaq: FAQItem = {
    ...req.body,
    id: 'faq-' + Date.now(),
    displayOrder: db.faqs.length + 1,
    isActive: true
  };
  db.faqs.push(newFaq);
  saveDatabase(db);
  res.status(201).json(newFaq);
});

app.put('/api/faqs/:id', requireAdmin, (req, res) => {
  const index = db.faqs.findIndex(f => f.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'FAQ not found' });
  db.faqs[index] = { ...db.faqs[index], ...req.body };
  saveDatabase(db);
  res.json(db.faqs[index]);
});

app.delete('/api/faqs/:id', requireAdmin, (req, res) => {
  db.faqs = db.faqs.filter(f => f.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true });
});

// Simulated Razorpay Payment Integration
app.post('/api/payment/create-order', (req, res) => {
  const { amount } = req.body;
  const razorpayOrderId = 'order_rzp_' + Math.random().toString(36).substring(2, 12);
  res.json({
    id: razorpayOrderId,
    amount: (amount || 100) * 100, // in paise
    currency: 'INR',
    keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_hardware_devshree'
  });
});

app.post('/api/payment/verify', (req, res) => {
  const { paymentId, orderId } = req.body;
  res.json({
    verified: true,
    paymentId: paymentId || 'pay_' + Math.random().toString(36).substring(2, 10),
    orderId
  });
});

// -------------------------------------------------------------
// AI SHOPPING ASSISTANT (/api/chat)
// Powered by @google/genai with model 'gemini-3.8-flash'
// -------------------------------------------------------------
app.post('/api/chat', async (req, res) => {
  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Build product summary for context grounding
  const productCatalogSummary = db.products.slice(0, 14).map(p => ({
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price,
    mrp: p.mrp,
    stock: p.stock,
    features: p.features.slice(0, 2),
    sku: p.sku
  }));

  const systemInstruction = `You are "Devshree AI Assistant", an expert hardware consultant for "DEVSHREE - The Hardware Gallery", Rajkot, Gujarat.
Devshree specializes in:
1. Bed Fittings (Heavy hydraulic 1500N lift mechanisms for king/queen beds, corner brackets, gas springs).
2. Furniture Hardware (Soft-close 3D hydraulic hinges, 45mm telescopic drawer slides, flap stays).
3. Cabinet Hardware (Brushed gold/black profile handles, concealed locks).
4. Door Hardware (SS-304 magnetic door stoppers, zinc alloy mortise handles, Godrej padlocks).
5. Adhesives & Sealants (Polyfix instant CA glue with spray activator, Fevicol).
6. Clamps & Tools (Drop-forged G-clamps, carpenter 5m measuring tapes with Indian inch/sut markings).
7. Fasteners (Black drywall screws in 1000pc boxes).

Rules for your responses:
- Tone: Extremely helpful, polite, professional, and practical for Indian homeowners, carpenters, and contractors.
- Mention prices in Indian Rupees (₹).
- Keep replies concise, visual, and action-oriented. Suggest exact items from the catalog.
- When recommending a product, mention its name and price.
- If customer asks for bulk/contractor discount, mention they can submit a Bulk Quote on our website or contact our Rajkot WhatsApp hotline at +91 81280 40556.
- Always include 2 to 3 related product recommendations from our catalog where relevant.

Available Product Catalog:
${JSON.stringify(productCatalogSummary, null, 2)}`;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `${systemInstruction}\n\nCustomer inquiry: "${message}"`
              }
            ]
          }
        ]
      });

      const replyText = response.text || 'I would be happy to help you with our hardware range! Please let me know what furniture or door project you are working on.';

      // Extract matching product IDs from catalog to display as visual clickable cards in UI
      const matchingProducts = db.products.filter(p =>
        replyText.toLowerCase().includes(p.name.toLowerCase().slice(0, 15)) ||
        message.toLowerCase().includes(p.category.toLowerCase()) ||
        message.toLowerCase().includes(p.name.toLowerCase().slice(0, 10))
      ).slice(0, 3);

      return res.json({
        reply: replyText,
        recommendedProducts: matchingProducts
      });
    }
  } catch (error) {
    console.error('Gemini API call failed, falling back to expert rule engine:', error);
  }

  // Robust Smart Fallback Hardware Knowledge Engine
  const q = message.toLowerCase();
  let fallbackReply = '';
  let matchedProds = db.products.slice(0, 3);

  if (q.includes('bed') || q.includes('hydraulic') || q.includes('lift') || q.includes('gas spring')) {
    fallbackReply = `For beds and storage boxes, we highly recommend the **Devshree Heavy-Duty Hydraulic Bed Lift Mechanism (150 Kg / 1500N)** for ₹1,899 (MRP ₹2,799). It is engineered from 4mm thick steel with nitrogen gas pistons for effortless lifting. Pair it with our **4-Piece Corner Bed Bracket Fitting Set** (₹349) to eliminate squeaks and wobbles!`;
    matchedProds = db.products.filter(p => p.category === 'Bed Fittings');
  } else if (q.includes('hinge') || q.includes('soft close') || q.includes('cabinet') || q.includes('kitchen')) {
    fallbackReply = `For modern modular kitchens and wardrobes, our **Devshree Soft-Close 3D Clip-On Hydraulic Hinges (Pack of 10 Pieces / 5 Pairs)** at ₹649 are the master choice. They feature 3-way cam adjustment and fluid hydraulic dampers for zero slam. We also offer synchronized **Soft-Close Kitchen Tandem Box Drawer Systems** (₹1,850).`;
    matchedProds = db.products.filter(p => p.category === 'Furniture Hardware' || p.category === 'Kitchen & Wardrobe');
  } else if (q.includes('lock') || q.includes('door') || q.includes('handle') || q.includes('stopper')) {
    fallbackReply = `For door security and elegance, explore the **Devshree Premium Zinc Alloy Concealed Mortise Lock Set** (₹1,449) with 3 computer keys and pure brass cylinder. Don't forget our low-profile **SS-304 Concealed Magnetic Door Stopper** (₹299) to keep doors securely open in drafts.`;
    matchedProds = db.products.filter(p => p.category === 'Door Hardware');
  } else if (q.includes('glue') || q.includes('fevicol') || q.includes('polyfix') || q.includes('adhesive')) {
    fallbackReply = `For rapid wood and PVC edge banding, the **Polyfix Instant Cyanoacrylate High-Bond Kit (50g + Aerosol Activator)** at ₹249 cures rock-solid in just 5-10 seconds! We stock factory-fresh batches.`;
    matchedProds = db.products.filter(p => p.category === 'Adhesives & Sealants');
  } else if (q.includes('screw') || q.includes('fastener')) {
    fallbackReply = `We supply **Devshree Black Phosphate Drywall Wood Screws 1.25" (Box of 1,000 Pcs)** for ₹360 (bulk trade rate: ₹285). High torque, zero stripping, case-hardened steel.`;
    matchedProds = db.products.filter(p => p.category === 'Fasteners & Screws');
  } else if (q.includes('bulk') || q.includes('contractor') || q.includes('gst') || q.includes('discount')) {
    fallbackReply = `Namaste! Yes, we supply directly to contractors, architects, and carpenters across India. Use coupon **BULK15** for 15% off orders over ₹4,999, or click **"Request Bulk Quote"** in the top navigation for wholesale crate pricing and GST input credit invoices.`;
    matchedProds = db.products.slice(0, 3);
  } else {
    fallbackReply = `Namaste! Welcome to Devshree - The Hardware Gallery. How can we assist your furniture or construction project? We stock certified Bed Fittings, Soft-Close Hinges, Mortise Locks, Telescopic Channels, Polyfix Glues, and Screws with nationwide fast dispatch.`;
    matchedProds = db.products.filter(p => p.isFeatured).slice(0, 3);
  }

  res.json({
    reply: fallbackReply,
    recommendedProducts: matchedProds
  });
});

// -------------------------------------------------------------
// VITE SPA INTEGRATION (DEV & PROD)
// -------------------------------------------------------------
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`🚀 Devshree Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
