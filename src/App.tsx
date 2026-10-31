import React, { useEffect } from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroBanner } from './components/home/HeroBanner';
import { TrustBadges } from './components/home/TrustBadges';
import { CategoryGrid } from './components/home/CategoryGrid';
import { ProductGrid } from './components/home/ProductGrid';
import { CombosSection } from './components/home/CombosSection';
import { ShopPage } from './components/shop/ShopPage';
import { CartPage } from './components/cart/CartDrawer';
import { CheckoutPage } from './components/checkout/CheckoutModal';
import { OrderSuccessView } from './components/account/OrderSuccessView';
import { WishlistPage } from './components/account/WishlistPage';
import { MyOrdersPage } from './components/account/MyOrdersPage';
import { UserProfilePage } from './components/account/UserProfilePage';
import { CombosPage } from './components/combos/CombosPage';
import { OffersPage } from './components/offers/OffersPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminGateLogin } from './components/admin/AdminGateLogin';
import { AboutContactPage } from './components/pages/AboutContactPage';
import { ProductDetailModal } from './components/product/ProductDetailModal';
import { AuthModal } from './components/auth/AuthModal';
import { AgeVerificationModal } from './components/auth/AgeVerificationModal';
import { MobileAppViewer } from './components/mobile/MobileAppViewer';
import { ChatbotWidget } from './components/common/ChatbotWidget';
import { AdvertisementSection } from './components/home/AdvertisementSection';

export default function App() {

  const {
    currentPage,
    setCurrentPage,
    products,
    selectedProduct,
    setSelectedProduct,
    currentOrder,
    deviceMode,
    user,
    showToast,
  } = useApp();

  // Scroll to top whenever page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // If user selected the Mobile App simulation view from the mockup (Admin only)
  if (deviceMode === 'mobile') {
    return (
      <div className="min-h-screen bg-[#050505] text-[#F3EFE0]">
        <MobileAppViewer />
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
        <AuthModal />
        <AgeVerificationModal />
      </div>
    );
  }

  // If user is on the Admin Panel - protect against customer access
  if (currentPage === 'admin') {
    if (user?.role !== 'admin') {
      return <AdminGateLogin />;
    }

    return (
      <div className="min-h-screen bg-[#0A0A0A] text-[#F3EFE0]">
        <AdminDashboard />
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      </div>
    );
  }

  // Display products on the Homepage (user uploads & additions appear FIRST)
  const recentUserProducts = [...products];
  const hookahAndLounge = products.filter((p) => p.category === 'hookah' || p.category === 'lighters_ashtray' || p.category === 'bongs_rolls' || p.category === 'fragrances');

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#0A0A0A] text-[#F3EFE0] selection:bg-[#C59B27] selection:text-black">
      {/* Global Navbar */}
      <Navbar />

      {/* Main Content Body */}
      <main className="flex-1">
        {/* HOMEPAGE VIEW */}
        {currentPage === 'home' && (
          <div className="space-y-4">
            {/* 1. Hero Section */}
            <HeroBanner />

            {/* 2. Trust Badges */}
            <TrustBadges />

            {/* 3. Shop By Category */}
            <CategoryGrid />

            {/* 4. All Featured & Uploaded Products */}
            <ProductGrid
              title="TOP PICKS & RECENT ARRIVALS"
              subtitle="Handcrafted royal shisha, flavours, bongs & accessories chosen by connoisseurs"
              products={recentUserProducts}
              limit={12}
            />

            {/* 5. Advertisement Section: Videos & Playful .GIFs configured from Dashboard */}
            <AdvertisementSection />

            {/* 6. Combos & Best Offers Banner */}
            <CombosSection />

            {/* 6. Hookahs, Lighters & Imperial Accessories Section */}
            <ProductGrid
              title="IMPERIAL HOOKAHS & ACCESSORIES"
              subtitle="Egyptian brass hookahs, torch lighters, bongs & ambient fragrances"
              products={hookahAndLounge}
              limit={12}
            />
          </div>
        )}

        {/* SHOP / CATALOG VIEW */}
        {currentPage === 'shop' && <ShopPage />}

        {/* CART VIEW */}
        {currentPage === 'cart' && <CartPage />}

        {/* CHECKOUT VIEW */}
        {currentPage === 'checkout' && <CheckoutPage />}

        {/* ORDER SUCCESS VIEW */}
        {currentPage === 'order-success' && <OrderSuccessView order={currentOrder} />}

        {/* WISHLIST VIEW */}
        {currentPage === 'wishlist' && <WishlistPage />}

        {/* MY ORDERS & TRACKING VIEW */}
        {currentPage === 'my-orders' && <MyOrdersPage />}


        {/* COMBOS VIEW */}
        {currentPage === 'combos' && <CombosPage />}

        {/* OFFERS VIEW */}
        {currentPage === 'offers' && <OffersPage />}

        {/* USER PROFILE & ACCOUNT VIEW */}
        {currentPage === 'account' && <UserProfilePage />}

        {/* INFORMATIONAL & LEGAL PAGES */}
        {['about', 'contact', 'privacy', 'terms', 'refund'].includes(currentPage) && (
          <AboutContactPage />
        )}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Authentication Modal */}
      <AuthModal />

      {/* Age Verification Barrier */}
      <AgeVerificationModal />

      {/* Floating Autonomous AI Concierge Chatbot (RAG + LLM) */}
      <ChatbotWidget />
    </div>
  );
}

