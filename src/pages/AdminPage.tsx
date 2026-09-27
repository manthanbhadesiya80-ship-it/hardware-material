import React, { useState, useEffect } from 'react';
import { useAdmin, AdminTab } from '../context/AdminContext';
import { useStore } from '../context/StoreContext';
import { AdminLogin } from '../components/admin/AdminLogin';
import { AdminDashboardTab } from '../components/admin/AdminDashboardTab';
import { AdminProductsTab } from '../components/admin/AdminProductsTab';
import { AdminCategoriesTab } from '../components/admin/AdminCategoriesTab';
import { AdminOrdersTab } from '../components/admin/AdminOrdersTab';
import { AdminHomepageCMSTab } from '../components/admin/AdminHomepageCMSTab';
import { AdminCouponsOffersTab } from '../components/admin/AdminCouponsOffersTab';
import { AdminInventoryTab } from '../components/admin/AdminInventoryTab';
import { AdminEnquiriesTab } from '../components/admin/AdminEnquiriesTab';
import { AdminReviewsTab } from '../components/admin/AdminReviewsTab';
import { AdminSettingsTab } from '../components/admin/AdminSettingsTab';
import { ChangeLogoModal } from '../components/admin/ChangeLogoModal';
import { DevshreeLogo } from '../components/common/DevshreeLogo';
import { api } from '../services/api';
import {
  Product,
  Category,
  Order,
  Banner,
  Coupon,
  Offer,
  HomepageSection,
  ProductReview,
  BulkEnquiry
} from '../types';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Sliders,
  Tag,
  Warehouse,
  Building2,
  Star,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { isAuthenticated, adminUser, activeTab, setActiveTab, logout } = useAdmin();
  const { setCurrentPage } = useStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [enquiries, setEnquiries] = useState<BulkEnquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [p, c, o, ban, cp, off, sec, rev, enq] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getOrders(),
        api.getBanners(),
        api.getCoupons(),
        api.getOffers(),
        api.getHomepageSections(),
        api.getReviews(),
        api.getBulkEnquiries()
      ]);
      setProducts(p);
      setCategories(c);
      setOrders(o);
      setBanners(ban);
      setCoupons(cp);
      setOffers(off);
      setSections(sec);
      setReviews(rev);
      setEnquiries(enq);
    } catch (err) {
      console.error('Error fetching admin datasets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAdminData();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <AdminLogin onCancel={() => setCurrentPage('home')} />;
  }

  const navItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'products', label: 'Products', icon: <Package className="w-4 h-4" />, badge: products.length },
    { id: 'categories', label: 'Categories', icon: <Layers className="w-4 h-4" /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag className="w-4 h-4" />, badge: orders.filter(o => o.orderStatus === 'Order Placed').length },
    { id: 'homepage', label: 'Homepage CMS', icon: <Sliders className="w-4 h-4" /> },
    { id: 'coupons', label: 'Coupons & Deals', icon: <Tag className="w-4 h-4" /> },
    { id: 'inventory', label: 'Inventory Stock', icon: <Warehouse className="w-4 h-4" />, badge: products.filter(p => p.stock <= p.lowStockThreshold).length },
    { id: 'enquiries', label: 'Bulk Enquiries', icon: <Building2 className="w-4 h-4" />, badge: enquiries.filter(e => e.status === 'new').length },
    { id: 'reviews', label: 'Reviews', icon: <Star className="w-4 h-4" /> },
    { id: 'settings', label: 'Store Settings', icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#083B82] text-white border-r border-blue-900 shrink-0">
        <div className="p-5 border-b border-blue-900/80">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setIsLogoModalOpen(true)}
              title="Click to change brand logo"
              className="text-left focus:outline-hidden group"
            >
              <DevshreeLogo size="md" inverted={true} />
            </button>
            <button
              type="button"
              onClick={() => setIsLogoModalOpen(true)}
              className="text-[10px] font-bold text-amber-300 hover:text-white bg-blue-900/90 hover:bg-[#E87500] px-2 py-1 rounded-md transition-colors shrink-0 shadow-2xs cursor-pointer"
              title="Change Store Logo"
            >
              Change Logo
            </button>
          </div>
          <span className="block text-[10px] uppercase font-black text-amber-300 tracking-wider mt-2">
            Control Center
          </span>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-[#E87500] text-white shadow-sm font-bold'
                    : 'text-blue-100 hover:bg-blue-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {Boolean(item.badge && item.badge > 0) && (
                  <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white text-[#E87500]' : 'bg-red-500 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-blue-900/80 space-y-2">
          <div className="flex items-center gap-2 text-xs text-blue-200">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="truncate">{adminUser?.email || 'admin@devshree.in'}</span>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 bg-blue-950/60 hover:bg-red-600/80 text-white text-xs font-bold py-2 px-3 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              aria-label="Toggle Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#083B82] capitalize">
                {activeTab.replace('-', ' ')}
              </h2>
              <span className="text-[10px] text-gray-400 hidden sm:inline">
                Devshree Hardware Management Console
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAdminData}
              disabled={loading}
              title="Refresh Data"
              className="p-2 text-gray-500 hover:text-[#124DA6] hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => setCurrentPage('home')}
              className="flex items-center gap-1.5 text-xs font-bold text-[#124DA6] hover:text-[#083B82] bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Visit Storefront</span>
            </button>
          </div>
        </header>

        {/* Tab Content Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <AdminDashboardTab
              products={products}
              orders={orders}
              enquiries={enquiries}
              offers={offers}
            />
          )}

          {activeTab === 'products' && (
            <AdminProductsTab
              products={products}
              categories={categories}
              onRefresh={fetchAdminData}
            />
          )}

          {activeTab === 'categories' && (
            <AdminCategoriesTab
              categories={categories}
              onRefresh={fetchAdminData}
            />
          )}

          {activeTab === 'orders' && (
            <AdminOrdersTab
              orders={orders}
              onRefresh={fetchAdminData}
            />
          )}

          {activeTab === 'homepage' && (
            <AdminHomepageCMSTab
              sections={sections}
              banners={banners}
              onRefresh={fetchAdminData}
            />
          )}

          {activeTab === 'coupons' && (
            <AdminCouponsOffersTab
              coupons={coupons}
              offers={offers}
              onRefresh={fetchAdminData}
            />
          )}

          {activeTab === 'inventory' && (
            <AdminInventoryTab
              products={products}
              onRefresh={fetchAdminData}
            />
          )}

          {activeTab === 'enquiries' && (
            <AdminEnquiriesTab
              enquiries={enquiries}
              onRefresh={fetchAdminData}
            />
          )}

          {activeTab === 'reviews' && (
            <AdminReviewsTab
              reviews={reviews}
              onRefresh={fetchAdminData}
            />
          )}

          {activeTab === 'settings' && (
            <AdminSettingsTab />
          )}
        </main>
      </div>

      {/* Mobile Drawer Sidebar */}
      {isMobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs bg-[#083B82] text-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left">
            <div className="p-4 border-b border-blue-900 flex items-center justify-between">
              <DevshreeLogo size="sm" inverted={true} />
              <button onClick={() => setIsMobileSidebarOpen(false)} className="p-1">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold ${
                    activeTab === item.id ? 'bg-[#E87500] text-white font-bold' : 'text-blue-100 hover:bg-blue-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                </button>
              ))}
            </nav>
            <div className="p-4 border-t border-blue-900">
              <button
                onClick={logout}
                className="w-full bg-red-600 text-white font-bold py-2 rounded-lg text-xs"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Logo Modal */}
      <ChangeLogoModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
      />
    </div>
  );
};
