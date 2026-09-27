import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AdminProvider } from './context/AdminContext';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileNav } from './components/layout/MobileNav';
import { ToastContainer } from './components/common/ToastContainer';
import { FloatingWhatsApp } from './components/common/FloatingWhatsApp';
import { HardwareChatbot } from './components/chat/HardwareChatbot';
import { ProductQuickViewModal } from './components/product/ProductQuickViewModal';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { MyOrdersPage } from './pages/MyOrdersPage';
import { BulkQuotePage } from './pages/BulkQuotePage';
import { OffersPage } from './pages/OffersPage';
import { AboutPage, ContactPage, FAQPage, PoliciesPage } from './pages/StaticPages';
import { AdminPage } from './pages/AdminPage';

const AppContent: React.FC = () => {
  const { currentPage } = useStore();

  if (currentPage === 'admin') {
    return (
      <>
        <AdminPage />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FC] text-[#15191F]">
      <AnnouncementBar />
      <Header />

      <main className="flex-1">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'shop' && <ShopPage />}
        {currentPage === 'category' && <ShopPage />}
        {currentPage === 'product' && <ProductDetailPage />}
        {currentPage === 'cart' && <CartPage />}
        {currentPage === 'checkout' && <CheckoutPage />}
        {currentPage === 'order-success' && <OrderSuccessPage />}
        {currentPage === 'my-orders' && <MyOrdersPage />}
        {currentPage === 'bulk-quote' && <BulkQuotePage />}
        {currentPage === 'offers' && <OffersPage />}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'contact' && <ContactPage />}
        {currentPage === 'faq' && <FAQPage />}
        {currentPage === 'policies' && <PoliciesPage />}
      </main>

      <Footer />
      <MobileNav />
      <FloatingWhatsApp />
      <HardwareChatbot />
      <ProductQuickViewModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AdminProvider>
        <AppContent />
      </AdminProvider>
    </StoreProvider>
  );
}
