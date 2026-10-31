import React, { useState } from 'react';
import { 
  Search, 
  Heart, 
  ShoppingBag, 
  User, 
  ShieldCheck, 
  HelpCircle, 
  Truck, 
  Package, 
  Sparkles, 
  Menu, 
  X, 
  Smartphone, 
  Monitor, 
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { QualityPaanLogo } from '../brand/Logo';
import { ProductCategory } from '../../types';

export const Navbar: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    cartCount,
    wishlist,
    user,
    login,
    logout,
    setIsAuthModalOpen,
    setAuthModalMode,
    deviceMode,
    setDeviceMode,
    homepageConfig,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleCategoryClick = (cat: ProductCategory | 'all') => {
    setSelectedCategory(cat);
    setCurrentPage(cat === 'all' ? 'home' : 'shop');
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSelectedCategory('all');
      setCurrentPage('shop');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#C59B27]/25 shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
      {/* 1. TOP UTILITY BAR (As shown in mockup) */}
      <div className="bg-[#050505] border-b border-[#C59B27]/15 py-1.5 px-4 sm:px-8 text-xs text-[#E5C158]/90">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: Trust & Delivery Badges */}
          <div className="flex items-center space-x-4 sm:space-x-6 text-[11px] sm:text-xs overflow-x-auto no-scrollbar py-0.5">
            <span className="flex items-center gap-1 text-[#F3EFE0] whitespace-nowrap">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Premium Quality
            </span>
            <span className="flex items-center gap-1 text-[#F3EFE0] whitespace-nowrap">
              <span className="text-[#2ECC71]">✓</span> 100% Fresh
            </span>
            <span className="flex items-center gap-1 text-[#F3EFE0] whitespace-nowrap">
              <Package className="w-3.5 h-3.5 text-[#D4AF37]" /> Discreet Packaging
            </span>
            <span className="hidden md:flex items-center gap-1 text-[#F3EFE0] whitespace-nowrap">
              <Truck className="w-3.5 h-3.5 text-[#D4AF37]" /> Fast Delivery
            </span>
          </div>

          {/* Right: Quick Links, Device Switcher, Auth */}
          <div className="flex items-center space-x-4 text-[11px] sm:text-xs">
            {/* Admin-only Simulator Switcher: Hidden from regular customers */}
            {user?.role === 'admin' && (
              <button
                onClick={() => setDeviceMode(deviceMode === 'responsive' ? 'mobile' : 'responsive')}
                className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-[#C59B27]/50 bg-[#161616] text-[#E5C158] hover:bg-[#C59B27] hover:text-black transition-all font-medium text-[11px]"
                title="Admin Preview: Toggle between Website and Mobile App Mockup Simulator"
              >
                {deviceMode === 'responsive' ? (
                  <>
                    <Smartphone className="w-3 h-3 text-[#D4AF37]" />
                    <span>App Simulator</span>
                  </>
                ) : (
                  <>
                    <Monitor className="w-3 h-3 text-[#D4AF37]" />
                    <span>Desktop Web View</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={() => setCurrentPage('my-orders')}
              className="hidden sm:flex items-center gap-1 text-[#E5C158] hover:text-[#FFF] transition-colors"
            >
              <Truck className="w-3.5 h-3.5" /> Track Order
            </button>
            <button
              onClick={() => setCurrentPage('contact')}
              className="hidden md:flex items-center gap-1 text-[#E5C158] hover:text-[#FFF] transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" /> Help Center
            </button>

            {user?.role === 'admin' && (
              <button
                onClick={() => setCurrentPage('admin')}
                className="flex items-center gap-1 text-[#D4AF37] font-semibold bg-[#2A1F05] px-2.5 py-0.5 rounded border border-[#C59B27]/60 hover:bg-[#C59B27] hover:text-black transition-colors text-[11px]"
                title="Open Quality Paan Admin & Management Dashboard"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Admin Dashboard
              </button>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 text-[#F3EFE0] hover:text-[#D4AF37] font-medium"
                >
                  <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="max-w-[100px] truncate">{user.fullName || user.email}</span>
                </button>
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#121212] border border-[#C59B27]/40 rounded-lg shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-[#222]">
                      <p className="text-xs font-semibold text-[#D4AF37]">{user.fullName}</p>
                      <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-1.5 py-0.5 text-[9px] uppercase tracking-wider bg-[#C59B27]/20 text-[#D4AF37] rounded">
                        {user.role}
                      </span>
                    </div>
                    <button
                      onClick={() => { setCurrentPage('account'); setUserDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs text-gray-300 hover:bg-[#202020] hover:text-[#D4AF37]"
                    >
                      My Profile & Addresses
                    </button>
                    <button
                      onClick={() => { setCurrentPage('my-orders'); setUserDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs text-gray-300 hover:bg-[#202020] hover:text-[#D4AF37]"
                    >
                      My Orders & Tracking
                    </button>

                    {user.role === 'admin' && (
                      <button
                        onClick={() => { setCurrentPage('admin'); setUserDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-xs text-[#D4AF37] font-semibold hover:bg-[#202020]"
                      >
                        👑 Admin Dashboard
                      </button>
                    )}
                    <div className="border-t border-[#222] my-1"></div>
                    <button
                      onClick={() => { logout(); setUserDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-[#202020]"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="flex items-center gap-1 text-[#F3EFE0] hover:text-[#D4AF37] font-medium"
              >
                <User className="w-3.5 h-3.5 text-[#D4AF37]" /> Login / Register
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (Logo, Search Bar, Wishlist & Cart) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4 md:gap-8">
        {/* Left: Official Brand Logo */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#E5C158] p-1.5 rounded hover:bg-[#1A1A1A]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <QualityPaanLogo
            size="md"
            variant="horizontal"
            onClick={() => {
              setSelectedCategory('all');
              setCurrentPage('home');
            }}
          />
        </div>

        {/* Center: Luxury Search Bar (Matching Mockup) */}
        <div className="hidden md:flex flex-1 max-w-xl mx-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for hookah, shisha flavours, bongs, lighters, fragrances..."
              className="w-full bg-[#121212] text-[#F3EFE0] text-sm pl-4 pr-12 py-2.5 rounded-full border border-[#C59B27]/40 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] placeholder-gray-500 transition-all shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-gradient-to-r from-[#D4AF37] to-[#9B7817] text-black font-semibold rounded-full flex items-center justify-center hover:opacity-90 transition-opacity shadow-[0_0_10px_rgba(212,175,55,0.4)]"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right: Wishlist & Cart Actions */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          {/* User Profile Direct Button */}
          <button
            onClick={() => {
              if (user) {
                setCurrentPage('account');
              } else {
                setAuthModalMode('login');
                setIsAuthModalOpen(true);
              }
            }}
            className="relative flex items-center gap-1.5 text-gray-300 hover:text-[#D4AF37] transition-colors p-1"
            title="My Profile & Addresses"
          >
            <User className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37]" />
            <span className="hidden lg:inline text-xs font-medium text-[#F3EFE0]">
              {user ? 'My Profile' : 'Sign In'}
            </span>
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => setCurrentPage('wishlist')}
            className="relative flex items-center gap-1.5 text-gray-300 hover:text-[#D4AF37] transition-colors p-1"
            title="Wishlist"
          >
            <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37]" />
            <span className="hidden lg:inline text-xs font-medium text-[#F3EFE0]">Wishlist</span>
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setCurrentPage('cart')}
            className="relative flex items-center gap-2 bg-[#161616] border border-[#C59B27]/40 hover:border-[#D4AF37] px-3.5 py-2 rounded-full text-gray-300 hover:text-white transition-all shadow-[0_2px_10px_rgba(0,0,0,0.5)] group"
            title="Shopping Cart"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-[#E5C158] to-[#C59B27] text-black text-[11px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-xs font-bold text-[#E5C158] hidden sm:inline">Cart</span>
          </button>
        </div>
      </div>

      {/* 3. DESKTOP NAVIGATION BAR (Home, Hookah, Flavours, Bongs & Rolls, Lighters & Ashtrays, Fragrances, Offers, Combos) */}
      <nav className="hidden md:block bg-[#080808]/90 border-t border-[#C59B27]/20 px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-center space-x-6 lg:space-x-8 text-xs font-medium tracking-wide">
          <button
            onClick={() => handleCategoryClick('all')}
            className={`transition-colors uppercase tracking-wider ${
              currentPage === 'home' && searchQuery === ''
                ? 'text-[#E5C158] font-bold border-b border-[#D4AF37] pb-0.5'
                : 'text-gray-300 hover:text-[#D4AF37]'
            }`}
          >
            Home
          </button>

          {categories
            .filter((cat) => cat.id !== 'combos')
            .map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`transition-colors uppercase tracking-wider ${
                selectedCategory === cat.id && currentPage === 'shop'
                  ? 'text-[#E5C158] font-bold border-b border-[#D4AF37] pb-0.5'
                  : 'text-gray-300 hover:text-[#D4AF37]'
              }`}
            >
              {cat.displayName || cat.name}
            </button>
          ))}

          {/* Show Combos only if user has combos category in catalog */}
          {categories.some((c) => c.id === 'combos') && (
            <button
              onClick={() => { setCurrentPage('combos'); }}
              className={`transition-colors uppercase tracking-wider ${
                currentPage === 'combos' ? 'text-[#E5C158] font-bold border-b border-[#D4AF37] pb-0.5' : 'text-[#E5C158] hover:text-[#FFF]'
              }`}
            >
              Combos
            </button>
          )}

          <button
            onClick={() => { setCurrentPage('offers'); }}
            className={`transition-colors uppercase tracking-wider flex items-center gap-1 ${
              currentPage === 'offers' ? 'text-[#2ECC71] font-bold border-b border-[#2ECC71] pb-0.5' : 'text-[#2ECC71] hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3 text-[#2ECC71]" /> Offers
          </button>


        </div>
      </nav>

      {/* 4. MOBILE SLIDE-DOWN SEARCH & MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0F0F0F] border-t border-[#C59B27]/30 px-4 py-4 space-y-4 animate-in slide-in-from-top-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hookah, flavours, bongs, lighters, fragrances..."
              className="w-full bg-[#1A1A1A] text-[#F3EFE0] text-sm pl-4 pr-10 py-2 rounded-full border border-[#C59B27]/40 focus:outline-none focus:border-[#D4AF37]"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3 bg-[#D4AF37] text-black rounded-full flex items-center justify-center"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <button
              onClick={() => handleCategoryClick('all')}
              className="text-left px-3 py-2 rounded bg-[#161616] text-[#E5C158] hover:bg-[#222]"
            >
              🏠 Home
            </button>
            {categories
              .filter((cat) => cat.id !== 'combos')
              .map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`text-left px-3 py-2 rounded transition-colors ${
                  selectedCategory === cat.id && currentPage === 'shop'
                    ? 'bg-[#2A2005] text-[#E5C158] font-bold border border-[#D4AF37]/40'
                    : 'bg-[#161616] text-gray-200 hover:bg-[#222]'
                }`}
              >
                {cat.displayName || cat.name}
              </button>
            ))}
            {categories.some((c) => c.id === 'combos') && (
              <button
                onClick={() => { setCurrentPage('combos'); setMobileMenuOpen(false); }}
                className="text-left px-3 py-2 rounded bg-[#161616] text-[#E5C158] font-bold hover:bg-[#222]"
              >
                🎁 Combos
              </button>
            )}
            <button
              onClick={() => { setCurrentPage('offers'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded bg-[#161616] text-[#2ECC71] font-bold hover:bg-[#222]"
            >
              ⭐ Offers
            </button>
            <button
              onClick={() => { setCurrentPage('my-orders'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded bg-[#161616] text-[#E5C158] hover:bg-[#222] flex items-center gap-1.5"
            >
              <Truck className="w-3.5 h-3.5 text-[#D4AF37]" /> Track Order
            </button>
            <button
              onClick={() => { setCurrentPage('account'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded bg-[#161616] text-[#E5C158] hover:bg-[#222] flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-[#D4AF37]" /> My Profile
            </button>
            {user?.role === 'admin' && (
              <button
                onClick={() => {
                  setCurrentPage('admin');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 rounded bg-[#2A1F05] text-[#D4AF37] font-bold border border-[#C59B27]/40 hover:bg-[#C59B27] hover:text-black flex items-center justify-between"
              >
                <span>👑 Admin Dashboard</span>
                <ShieldCheck className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
