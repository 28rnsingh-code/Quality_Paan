import React, { useState } from 'react';
import { 
  Home, 
  Grid, 
  Heart, 
  ShoppingBag, 
  User, 
  Search, 
  Sparkles, 
  ChevronRight, 
  ArrowLeft, 
  Star, 
  Plus, 
  Minus, 
  Truck, 
  Package, 
  ShieldCheck,
  Zap,
  CheckCircle2,
  SlidersHorizontal,
  Monitor,
  Smartphone
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { QualityPaanLogo } from '../brand/Logo';
import { ProductCategory, Product } from '../../types';

export const MobileAppViewer: React.FC = () => {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    cart,
    cartCount,
    wishlist,
    addToCart,
    toggleWishlist,
    isInWishlist,
    homepageConfig,
    setDeviceMode,
  } = useApp();

  const [mobileTab, setMobileTab] = useState<'home' | 'categories' | 'wishlist' | 'cart' | 'profile'>('home');
  const [selectedMobileProduct, setSelectedMobileProduct] = useState<Product | null>(null);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<ProductCategory>('hookah');
  const [mobileSearch, setMobileSearch] = useState('');
  const [activeScreenIndex, setActiveScreenIndex] = useState<1 | 2 | 3>(1); // Screen 1, 2, 3 as in user mockup

  const hookahProducts = products.filter(p => p.category === 'hookah');
  const activeCategoryProducts = products.filter(p => p.category === selectedCategoryTab);

  return (
    <div className="min-h-screen bg-[#050505] py-8 px-4 flex flex-col items-center justify-center">
      {/* Top Banner to Switch Views or Select Mockup Screen */}
      <div className="w-full max-w-5xl mb-6 flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#111] border border-[#C59B27]/40 shadow-2xl">
        <div className="flex items-center gap-3">
          <Smartphone className="w-6 h-6 text-[#D4AF37]" />
          <div>
            <h2 className="font-royal text-sm sm:text-base font-bold text-[#E5C158]">
              QUALITY PAAN &mdash; MOBILE APP MOCKUP SUITE
            </h2>
            <p className="text-[11px] text-gray-400">
              Interactive simulator replicating all 3 screens from your official mobile application mockup
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Mockup Screen Jumpers */}
          <div className="flex bg-[#181818] p-1 rounded-xl border border-[#333] text-xs gap-1">
            <button
              onClick={() => { setSelectedMobileProduct(null); setMobileTab('home'); }}
              className={`px-3 py-1.5 rounded-lg font-royal text-[11px] font-bold ${
                mobileTab === 'home' && !selectedMobileProduct ? 'bg-[#D4AF37] text-black' : 'text-gray-300'
              }`}
            >
              Screen 1: Home
            </button>
            <button
              onClick={() => { setSelectedMobileProduct(null); setMobileTab('categories'); }}
              className={`px-3 py-1.5 rounded-lg font-royal text-[11px] font-bold ${
                mobileTab === 'categories' && !selectedMobileProduct ? 'bg-[#D4AF37] text-black' : 'text-gray-300'
              }`}
            >
              Screen 2: Categories
            </button>
            <button
              onClick={() => { setSelectedMobileProduct(products[0]); }}
              className={`px-3 py-1.5 rounded-lg font-royal text-[11px] font-bold ${
                selectedMobileProduct ? 'bg-[#D4AF37] text-black' : 'text-gray-300'
              }`}
            >
              Screen 3: Product Detail
            </button>
          </div>

          <button
            onClick={() => setDeviceMode('responsive')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1C180C] border border-[#D4AF37] text-xs font-bold text-[#E5C158] hover:bg-[#D4AF37] hover:text-black transition-all"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Switch to Desktop Web View</span>
          </button>
        </div>
      </div>

      {/* Realistic Mobile Device Container Frame (390px x 844px iPhone/Android luxury casing) */}
      <div className="relative w-full max-w-[390px] h-[812px] bg-[#0A0A0A] rounded-[48px] border-[8px] border-[#222] shadow-[0_20px_70px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col justify-between select-none">
        
        {/* Hardware Notch / Island */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-6 bg-[#222] rounded-b-2xl z-50 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-[#111] mr-3" />
          <div className="w-12 h-1 bg-[#111] rounded-full" />
        </div>

        {/* Mobile Top Status Bar */}
        <div className="pt-2 px-6 pb-1 flex items-center justify-between text-[11px] font-semibold text-gray-400 z-40 bg-[#0A0A0A]">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px]">5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MOBILE SCREEN 1: HOME FEED (Matching left screen in mockup) */}
        {/* ========================================================================= */}
        {!selectedMobileProduct && mobileTab === 'home' && (
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pb-20">
            {/* Mobile Header with Logo & Cart */}
            <div className="px-4 py-2 flex items-center justify-between bg-[#0A0A0A]/90 sticky top-0 z-30 border-b border-[#C59B27]/20">
              <QualityPaanLogo size="sm" variant="horizontal" />
              <button 
                onClick={() => setMobileTab('cart')}
                className="relative p-2 rounded-full bg-[#161616] border border-[#C59B27]/40 text-[#D4AF37]"
              >
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-black text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Search Bar */}
            <div className="px-4">
              <div className="relative">
                <input
                  type="text"
                  value={mobileSearch}
                  onChange={(e) => setMobileSearch(e.target.value)}
                  placeholder="Search hookah, flavours, bongs, lighters, fragrances..."
                  className="w-full bg-[#161616] text-[#F3EFE0] text-xs pl-3.5 pr-10 py-2.5 rounded-full border border-[#C59B27]/40 focus:outline-none focus:border-[#D4AF37]"
                />
                <button className="absolute right-1 top-1 bottom-1 px-3 bg-[#D4AF37] text-black rounded-full flex items-center justify-center">
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick AI Sommelier Card inside Mobile App */}
            <div className="px-4">
              <div 
                onClick={() => setMobileTab('ai')}
                className="p-2.5 rounded-2xl bg-gradient-to-r from-[#201807] via-[#171206] to-[#0D0B05] border border-[#D4AF37]/50 shadow cursor-pointer flex items-center justify-between group hover:border-[#D4AF37] transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#2C2109] border border-[#D4AF37] flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-[#E5C158] animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-royal text-xs font-bold text-[#E5C158]">
                      AI Shisha Sommelier
                    </h4>
                    <p className="text-[10px] text-gray-300">
                      Tap for herbal mix ratios &amp; lounge finder
                    </p>
                  </div>
                </div>
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#D4AF37] text-black font-bold">
                  Ask AI &gt;
                </span>
              </div>
            </div>

            {/* Mobile Categories Horizontal Carousel */}
            <div className="px-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-royal text-xs font-bold text-[#E5C158] uppercase tracking-wider">
                  Categories
                </span>
                <button
                  onClick={() => setMobileTab('categories')}
                  className="text-[10px] text-gray-400 hover:text-white flex items-center gap-0.5"
                >
                  View All <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategoryTab(cat.id);
                      setMobileTab('categories');
                    }}
                    className="flex flex-col items-center gap-1 cursor-pointer flex-shrink-0"
                  >
                    <div className="w-14 h-14 rounded-full overflow-hidden border border-[#C59B27]/40 bg-black p-0.5 shadow-md">
                      <img src={cat.image} alt={cat.displayName} className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
                    </div>
                    <span className="text-[10px] font-royal font-bold text-gray-300 w-16 text-center truncate">
                      {cat.displayName}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Hero Banner */}
            <div className="px-4">
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#1E190B] to-[#121212] border border-[#C59B27]/40 p-4 shadow-lg">
                <div className="relative z-10 space-y-2">
                  <span className="text-[10px] font-royal font-bold text-[#D4AF37] uppercase tracking-widest block">
                    ★ ROYAL HOOKAH & SHISHA ★
                  </span>
                  <h3 className="font-royal text-base font-extrabold text-[#FFF0A0] leading-tight">
                    PERFECT TASTE<br />EVERY TIME
                  </h3>
                  <p className="text-[10px] text-gray-300 font-serif-luxury italic">
                    Exquisite 24K gold plated pipes & herbal flavours
                  </p>
                  <button
                    onClick={() => {
                      const hookahProd = products.find(p => p.category === 'hookah') || products[0];
                      setSelectedMobileProduct(hookahProd);
                    }}
                    className="px-4 py-1.5 bg-gradient-to-r from-[#D4AF37] to-[#9B7817] text-black font-royal font-bold text-[10px] rounded-full shadow"
                  >
                    SHOP HOOKAHS &gt;
                  </button>
                </div>
                <img
                  src={homepageConfig.heroImage}
                  alt="Hookah Hero"
                  className="absolute right-0 bottom-0 w-32 h-32 object-cover rounded-tl-full opacity-80"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Mobile "TOP PICKS FOR YOU" Section (Matching Mockup) */}
            <div className="px-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-royal text-xs font-bold text-[#E5C158] uppercase tracking-wider">
                  Top Picks For You
                </span>
                <span className="text-[10px] text-gray-500">Curated</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {products.slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedMobileProduct(p)}
                    className="bg-[#121212] rounded-xl border border-[#C59B27]/30 overflow-hidden flex flex-col justify-between cursor-pointer"
                  >
                    <div className="relative aspect-square">
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      {p.discountPercent > 0 && (
                        <span className="absolute top-1.5 left-1.5 bg-[#2ECC71] text-black text-[9px] font-black px-1.5 py-0.2 rounded">
                          {p.discountPercent}% OFF
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(p.id);
                        }}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-gray-300"
                      >
                        <Heart className={`w-3 h-3 ${isInWishlist(p.id) ? 'text-[#D4AF37] fill-[#D4AF37]' : ''}`} />
                      </button>
                    </div>

                    <div className="p-2 space-y-1">
                      <p className="font-royal text-[11px] font-bold text-gray-200 truncate">{p.name}</p>
                      <div className="flex items-center gap-1 text-[10px] text-[#E5C158]">
                        <Star className="w-3 h-3 fill-[#E5C158]" />
                        <span>{p.rating}</span>
                      </div>
                      <div className="flex items-baseline justify-between pt-1 border-t border-[#222]">
                        <span className="font-royal font-bold text-xs text-[#E5C158]">₹{p.price}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(p, 1);
                          }}
                          className="px-2 py-0.5 rounded bg-[#D4AF37] text-black text-[9px] font-bold"
                        >
                          + ADD
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MOBILE SCREEN 2: CATEGORIES VIEW (Matching center screen in mockup) */}
        {/* ========================================================================= */}
        {!selectedMobileProduct && mobileTab === 'categories' && (
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pb-20">
            {/* Header */}
            <div className="px-4 py-3 bg-[#0A0A0A]/90 sticky top-0 z-30 border-b border-[#C59B27]/20 flex items-center justify-between">
              <h2 className="font-royal text-sm font-bold text-[#E5C158] uppercase">
                Explore Categories
              </h2>
            </div>

            {/* Category Select Pills */}
            <div className="px-4 flex gap-2 overflow-x-auto no-scrollbar py-1">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategoryTab(c.id)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap ${
                    selectedCategoryTab === c.id
                      ? 'bg-[#D4AF37] text-black font-bold'
                      : 'bg-[#161616] text-gray-300 border border-[#333]'
                  }`}
                >
                  {c.displayName}
                </button>
              ))}
            </div>

            {/* Category Products */}
            <div className="px-4 grid grid-cols-2 gap-2.5">
              {activeCategoryProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedMobileProduct(p)}
                  className="bg-[#121212] rounded-xl border border-[#C59B27]/30 overflow-hidden cursor-pointer"
                >
                  <div className="relative aspect-square">
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="p-2 space-y-1">
                    <p className="font-royal text-[11px] font-bold text-gray-200 truncate">{p.name}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-royal font-bold text-xs text-[#E5C158]">₹{p.price}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); addToCart(p, 1); }}
                        className="px-2 py-0.5 bg-[#D4AF37] text-black text-[9px] font-bold rounded"
                      >
                        + ADD
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MOBILE SCREEN 3: PRODUCT DETAIL SCREEN (Matching exact right screen in mockup) */}
        {/* ========================================================================= */}
        {selectedMobileProduct && (
          <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col justify-between bg-[#0B0B0B]">
            <div className="space-y-3 pb-4">
              {/* Header Bar with Back Button & Cart */}
              <div className="px-4 py-2.5 flex items-center justify-between border-b border-[#C59B27]/20 sticky top-0 bg-[#0B0B0B]/90 z-30">
                <button
                  onClick={() => setSelectedMobileProduct(null)}
                  className="flex items-center gap-1 text-xs text-gray-300 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 text-[#D4AF37]" />
                  <span>Back</span>
                </button>
                <QualityPaanLogo size="sm" variant="horizontal" />
                <button
                  onClick={() => { setSelectedMobileProduct(null); setMobileTab('cart'); }}
                  className="relative p-1.5 text-[#D4AF37]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-black text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Main Product Image Carousel Frame */}
              <div className="px-4">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-black border border-[#C59B27]/40 shadow-lg">
                  <img
                    src={selectedMobileProduct.images[0]}
                    alt={selectedMobileProduct.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {selectedMobileProduct.discountPercent > 0 && (
                    <span className="absolute top-2.5 left-2.5 bg-[#2ECC71] text-black text-[10px] font-black px-2 py-0.5 rounded shadow">
                      {selectedMobileProduct.discountPercent}% OFF
                    </span>
                  )}
                  <button
                    onClick={() => toggleWishlist(selectedMobileProduct.id)}
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isInWishlist(selectedMobileProduct.id) ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-gray-300'}`} />
                  </button>
                </div>
              </div>

              {/* Title & Rating */}
              <div className="px-4 space-y-1">
                <span className="text-[9px] uppercase tracking-widest text-[#A89050] font-semibold">
                  {selectedMobileProduct.subcategory}
                </span>
                <h3 className="font-royal text-base font-bold text-[#F3EFE0]">
                  {selectedMobileProduct.name}
                </h3>
                <div className="flex items-center gap-1 text-[#E5C158] text-xs">
                  <Star className="w-3.5 h-3.5 fill-[#E5C158]" />
                  <span className="font-bold">{selectedMobileProduct.rating}</span>
                  <span className="text-gray-400 text-[10px]">({selectedMobileProduct.reviewCount} Reviews)</span>
                </div>
              </div>

              {/* Price Row: ₹200 ₹250 20% OFF */}
              <div className="px-4 flex items-baseline gap-2 pt-1 border-t border-[#1C1C1C]">
                <span className="font-royal text-xl font-extrabold text-[#E5C158]">
                  ₹{selectedMobileProduct.price}
                </span>
                {selectedMobileProduct.mrp > selectedMobileProduct.price && (
                  <span className="text-xs text-gray-500 line-through">
                    ₹{selectedMobileProduct.mrp}
                  </span>
                )}
                {selectedMobileProduct.discountPercent > 0 && (
                  <span className="text-[10px] font-bold text-[#2ECC71] bg-[#162916] px-1.5 py-0.5 rounded">
                    {selectedMobileProduct.discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Product Details Description (Matching Mockup) */}
              <div className="px-4 space-y-1 pt-1 border-t border-[#1C1C1C]">
                <h4 className="text-[10px] font-bold text-[#E5C158] uppercase tracking-wider">
                  Product Details
                </h4>
                <p className="text-[11px] text-gray-300 leading-snug">
                  {selectedMobileProduct.description}
                </p>
              </div>

              {/* Mockup 3 Trust Badges: Fresh Ingredients, Premium Quality, Discreet Packaging */}
              <div className="px-4 grid grid-cols-3 gap-1.5 pt-2 text-[9px] text-gray-300">
                <div className="flex items-center gap-1 text-[#2ECC71]">
                  <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">Fresh Ingredients</span>
                </div>
                <div className="flex items-center gap-1 text-[#D4AF37]">
                  <Sparkles className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">Premium Quality</span>
                </div>
                <div className="flex items-center gap-1 text-[#E5C158]">
                  <Package className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">Discreet Pack</span>
                </div>
              </div>
            </div>

            {/* Sticky Mobile Add to Cart & Buy Now Buttons (Matching Mockup Right Screen) */}
            <div className="p-3 bg-[#111] border-t border-[#C59B27]/40 space-y-2 sticky bottom-0 z-40">
              <div className="flex gap-2">
                <button
                  onClick={() => addToCart(selectedMobileProduct, 1)}
                  className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#9B7817] text-black font-royal font-bold text-xs shadow flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  ADD TO CART
                </button>
              </div>
              <button
                onClick={() => {
                  addToCart(selectedMobileProduct, 1);
                  setSelectedMobileProduct(null);
                  setMobileTab('cart');
                }}
                className="w-full py-2.5 rounded-lg bg-[#1F190B] border border-[#D4AF37] text-[#F3EFE0] font-royal font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />
                BUY NOW
              </button>
            </div>
          </div>
        )}



        {/* ========================================================================= */}
        {/* MOBILE SCREEN: WISHLIST VIEW */}
        {/* ========================================================================= */}
        {!selectedMobileProduct && mobileTab === 'wishlist' && (
          <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3 pb-20">
            <h3 className="font-royal text-xs font-bold text-[#E5C158] uppercase">
              My Saved Wishlist ({wishlist.length})
            </h3>
            {wishlist.length === 0 ? (
              <div className="text-center py-16 text-gray-400 text-xs space-y-2">
                <Heart className="w-8 h-8 text-[#444] mx-auto" />
                <p>No luxury items saved yet.</p>
                <button
                  onClick={() => setMobileTab('categories')}
                  className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-black text-xs font-bold"
                >
                  Explore Categories
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                {products.filter((p) => wishlist.includes(p.id)).map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedMobileProduct(p)}
                    className="bg-[#121212] rounded-xl border border-[#C59B27]/30 overflow-hidden cursor-pointer"
                  >
                    <div className="relative aspect-square">
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="p-2 space-y-1">
                      <p className="font-royal text-[11px] font-bold text-gray-200 truncate">{p.name}</p>
                      <span className="font-royal font-bold text-xs text-[#E5C158]">₹{p.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* MOBILE SCREEN: CART VIEW */}
        {/* ========================================================================= */}
        {!selectedMobileProduct && mobileTab === 'cart' && (
          <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3 pb-20">
            <h3 className="font-royal text-xs font-bold text-[#E5C158] uppercase">
              Shopping Cart ({cartCount})
            </h3>
            {cart.length === 0 ? (
              <div className="text-center py-16 text-gray-400 text-xs space-y-2">
                <ShoppingBag className="w-8 h-8 text-[#444] mx-auto" />
                <p>Your cart is empty.</p>
                <button
                  onClick={() => setMobileTab('home')}
                  className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-black text-xs font-bold"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {cart.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-[#141414] border border-[#252525] text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <img src={it.product.images[0]} alt={it.product.name} className="w-10 h-10 rounded object-cover bg-black" referrerPolicy="no-referrer" />
                      <div className="truncate">
                        <p className="font-bold text-gray-200 truncate">{it.product.name}</p>
                        <p className="text-[#E5C158] font-bold">₹{it.product.price} x {it.quantity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* MOBILE SCREEN: PROFILE VIEW */}
        {/* ========================================================================= */}
        {!selectedMobileProduct && mobileTab === 'profile' && (
          <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4 pb-20">
            <div className="p-4 rounded-2xl bg-[#141006] border border-[#D4AF37]/30 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#261E08] border border-[#D4AF37] flex items-center justify-center font-royal font-bold text-lg text-[#E5C158]">
                QP
              </div>
              <div>
                <h4 className="font-royal text-xs font-bold text-[#FFF]">Royal Patron</h4>
                <p className="text-[10px] text-gray-400">18+ Age Verified</p>
                <span className="text-[9px] bg-[#2ECC71]/20 text-[#2ECC71] px-2 py-0.5 rounded-full font-bold">
                  Free Express Delivery
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <button 
                onClick={() => setMobileTab('ai')}
                className="w-full p-3 rounded-xl bg-[#161208] border border-[#D4AF37]/40 flex items-center justify-between text-[#E5C158]"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span className="font-bold">AI Shisha Sommelier</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              <button 
                onClick={() => setMobileTab('cart')}
                className="w-full p-3 rounded-xl bg-[#141414] border border-[#252525] flex items-center justify-between text-gray-200"
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-gray-400" />
                  <span>My Active Orders</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        )}

        {/* Bottom Mobile Tab Navigation Bar with Center Glowing AI Button */}
        {!selectedMobileProduct && (
          <div className="h-16 bg-[#0E0E0E] border-t border-[#C59B27]/25 flex items-center justify-around px-2 z-40">
            <button
              onClick={() => setMobileTab('home')}
              className={`flex flex-col items-center gap-0.5 ${
                mobileTab === 'home' ? 'text-[#D4AF37]' : 'text-gray-500'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="text-[9px] font-semibold">Home</span>
            </button>

            <button
              onClick={() => setMobileTab('categories')}
              className={`flex flex-col items-center gap-0.5 ${
                mobileTab === 'categories' ? 'text-[#D4AF37]' : 'text-gray-500'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span className="text-[9px] font-semibold">Catalog</span>
            </button>



            <button
              onClick={() => setMobileTab('cart')}
              className={`flex flex-col items-center gap-0.5 relative ${
                mobileTab === 'cart' ? 'text-[#D4AF37]' : 'text-gray-500'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-[9px] font-semibold">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 right-2 bg-[#D4AF37] text-black text-[8px] font-extrabold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileTab('profile')}
              className={`flex flex-col items-center gap-0.5 ${
                mobileTab === 'profile' ? 'text-[#D4AF37]' : 'text-gray-500'
              }`}
            >
              <User className="w-4 h-4" />
              <span className="text-[9px] font-semibold">Account</span>
            </button>
          </div>
        )}

        {/* Mobile Device Bottom Bar Indicator */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full pointer-events-none" />
      </div>
    </div>
  );
};
