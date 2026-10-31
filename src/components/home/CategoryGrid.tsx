import React, { useState, useMemo, useRef } from 'react';
import { 
  Flame, 
  Sparkles, 
  FileText, 
  Zap, 
  Wind, 
  Layers, 
  ArrowRight, 
  ChevronRight, 
  ChevronLeft,
  Grid3X3, 
  List, 
  Eye, 
  Star, 
  Tag, 
  ShoppingBag, 
  X, 
  TrendingUp,
  Compass,
  Package,
  SlidersHorizontal
} from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { ProductCategory, Product } from '../../types';

export const CategoryGrid: React.FC = () => {
  const { 
    categories, 
    products, 
    setSelectedCategory, 
    setCurrentPage, 
    addToCart, 
    setSelectedProduct, 
    setIsProductDetailOpen 
  } = useApp();

  const [activeViewMode, setActiveViewMode] = useState<'portals' | 'directory'>('portals');
  const [selectedQuickViewCategory, setSelectedQuickViewCategory] = useState<ProductCategory | null>(null);
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(null);
  
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll position for slider arrows
  const handleScrollCheck = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 20);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 20);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === 'left' ? -340 : 340;
    scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setTimeout(handleScrollCheck, 350);
  };

  // Helper to get category icon
  const getCategoryIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case 'flame':
        return <Flame className="w-4 h-4 text-[#E5C158]" />;
      case 'sparkles':
        return <Sparkles className="w-4 h-4 text-[#E5C158]" />;
      case 'filetext':
      case 'file-text':
        return <FileText className="w-4 h-4 text-[#E5C158]" />;
      case 'zap':
        return <Zap className="w-4 h-4 text-[#E5C158]" />;
      case 'wind':
        return <Wind className="w-4 h-4 text-[#E5C158]" />;
      default:
        return <Layers className="w-4 h-4 text-[#E5C158]" />;
    }
  };

  // Compute live category metadata dynamically from products
  const categoryStats = useMemo(() => {
    const stats: Record<string, {
      count: number;
      minPrice: number;
      maxPrice: number;
      subcategories: string[];
      topProduct?: Product;
      bestsellersCount: number;
    }> = {};

    categories.forEach((cat) => {
      const catProducts = products.filter((p) => p.category === cat.id);
      const count = catProducts.length;
      const prices = catProducts.map((p) => p.price);
      const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
      const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
      
      const subcatsSet = new Set<string>();
      catProducts.forEach((p) => {
        if (p.subcategory) subcatsSet.add(p.subcategory);
      });
      const subcategories = Array.from(subcatsSet);

      const topProduct = catProducts.find((p) => p.isBestseller) || catProducts[0];
      const bestsellersCount = catProducts.filter((p) => p.isBestseller).length;

      stats[cat.id] = {
        count,
        minPrice,
        maxPrice,
        subcategories,
        topProduct,
        bestsellersCount,
      };
    });

    return stats;
  }, [categories, products]);

  // Navigate to shop with category
  const handleCategorySelect = (catId: ProductCategory) => {
    setSelectedCategory(catId);
    setCurrentPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to shop with category and specific subcategory
  const handleSubcategorySelect = (e: React.MouseEvent, catId: ProductCategory, subcat: string) => {
    e.stopPropagation();
    setSelectedCategory(catId);
    setCurrentPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quick view products for selected category
  const quickViewProducts = useMemo(() => {
    if (!selectedQuickViewCategory) return [];
    return products.filter((p) => p.category === selectedQuickViewCategory);
  }, [products, selectedQuickViewCategory]);

  const activeQuickViewCatObj = categories.find((c) => c.id === selectedQuickViewCategory);

  return (
    <section className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background radial luxury lighting */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#C59B27]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-amber-900/5 rounded-full blur-3xl pointer-events-none" />

      {/* 1. SECTION HEADER WITH ORNATE ROYAL LUXURY FLOURISH */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-white/[0.08]"
      >
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1509] border border-[#D4AF37]/30 text-[#D4AF37] text-[11px] font-bold tracking-widest uppercase">
            <Compass className="w-3.5 h-3.5 animate-spin-slow text-[#E5C158]" />
            <span>CURATED ROYAL DEPARTMENTS</span>
          </div>
          <h2 className="font-royal text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-[0.12em] text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0A0] via-[#D4AF37] to-[#B3851B] uppercase">
            SHOP BY CATEGORY
          </h2>
          <p className="text-xs sm:text-sm font-serif-luxury italic text-[#C9BF9E] max-w-xl">
            Explore authentic Egyptian brass hookahs, rare herbal molasses, artisan rolls, and regal accessories.
          </p>
        </div>

        {/* View Switcher & Slider Navigation Controls */}
        <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
          {/* View Mode Toggle: Portals vs Directory */}
          <div className="flex items-center p-1 bg-[#141414] rounded-xl border border-white/10 shadow-inner">
            <button
              onClick={() => setActiveViewMode('portals')}
              className={`px-3 py-1.5 rounded-lg text-xs font-royal font-bold flex items-center gap-1.5 transition-all ${
                activeViewMode === 'portals'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#A07C1C] text-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Animated Portals Showcase"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Showcase</span>
            </button>
            <button
              onClick={() => setActiveViewMode('directory')}
              className={`px-3 py-1.5 rounded-lg text-xs font-royal font-bold flex items-center gap-1.5 transition-all ${
                activeViewMode === 'directory'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#A07C1C] text-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Detailed Directory"
            >
              <List className="w-3.5 h-3.5" />
              <span>Directory</span>
            </button>
          </div>

          {/* Left / Right Carousel Controls */}
          {activeViewMode === 'portals' && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 ${
                  canScrollLeft
                    ? 'bg-[#181818] border-[#C59B27]/40 text-[#E5C158] hover:bg-[#D4AF37] hover:text-black hover:scale-105 shadow-md'
                    : 'bg-[#121212]/50 border-white/5 text-gray-600 cursor-not-allowed opacity-40'
                }`}
                title="Scroll Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 ${
                  canScrollRight
                    ? 'bg-[#181818] border-[#C59B27]/40 text-[#E5C158] hover:bg-[#D4AF37] hover:text-black hover:scale-105 shadow-md'
                    : 'bg-[#121212]/50 border-white/5 text-gray-600 cursor-not-allowed opacity-40'
                }`}
                title="Scroll Right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* 2. VIEW MODE A: UNBOXED ARCH PORTALS SHOWCASE (SLIDING FROM RIGHT) */}
      {activeViewMode === 'portals' && (
        <div className="relative group/track">
          <div
            ref={scrollContainerRef}
            onScroll={handleScrollCheck}
            className="flex gap-5 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-6 pt-2 px-1"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {categories.map((cat, idx) => {
              const stat = categoryStats[cat.id];
              const isHovered = hoveredCategoryId === cat.id;

              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, x: 80 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.65,
                    delay: idx * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{ scrollSnapAlign: 'start' }}
                  className="shrink-0 w-[240px] sm:w-[280px] lg:w-[300px]"
                >
                  <div
                    onMouseEnter={() => setHoveredCategoryId(cat.id)}
                    onMouseLeave={() => setHoveredCategoryId(null)}
                    onClick={() => handleCategorySelect(cat.id)}
                    className="group relative cursor-pointer flex flex-col justify-between bg-gradient-to-b from-[#141414]/90 via-[#0C0C0C]/95 to-[#070707] rounded-t-[3.5rem] rounded-b-3xl border border-white/[0.06] hover:border-[#E5C158]/50 transition-all duration-500 shadow-[0_12px_36px_rgba(0,0,0,0.6)] hover:shadow-[0_24px_60px_rgba(197,155,39,0.25)] hover:-translate-y-2.5 h-full overflow-hidden"
                  >
                    {/* Golden Arch Crown Glow */}
                    <div className="absolute top-0 inset-x-0 h-44 bg-gradient-to-b from-[#C59B27]/15 via-transparent to-transparent pointer-events-none rounded-t-[3.5rem]" />
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-2xl group-hover:bg-[#D4AF37]/25 group-hover:scale-125 transition-all duration-700 pointer-events-none" />

                    {/* Unboxed Image Showcase - NO hard square box */}
                    <div className="relative w-full aspect-[4/5] p-6 flex items-center justify-center z-10">
                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt={cat.displayName || cat.name}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain filter drop-shadow-[0_14px_28px_rgba(0,0,0,0.85)] group-hover:drop-shadow-[0_24px_44px_rgba(212,175,55,0.4)] group-hover:scale-110 group-hover:-translate-y-3 transition-all duration-500 ease-out select-none"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/uploads/products/mya_suka.svg';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
                          <div className="w-16 h-16 rounded-3xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-[0_0_25px_rgba(212,175,55,0.2)]">
                            {getCategoryIcon(cat.iconName)}
                          </div>
                          <span className="text-xs font-royal font-bold text-[#F3D079] tracking-wider uppercase">
                            {cat.displayName || cat.name}
                          </span>
                        </div>
                      )}

                      {/* Top Badges (Floating unboxed metadata) */}
                      <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none z-20">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-[#D4AF37]/40 text-[#E5C158] text-[10px] font-bold shadow-lg">
                          {getCategoryIcon(cat.iconName)}
                          <span>#{idx + 1}</span>
                        </span>

                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#181305]/90 backdrop-blur-md border border-[#D4AF37]/50 text-[#D4AF37] text-[10px] font-mono font-bold">
                          {stat?.count ?? cat.itemCount} Items
                        </span>
                      </div>

                      {/* Quick Peek Floating Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedQuickViewCategory(cat.id);
                        }}
                        className="absolute bottom-3 right-4 px-3 py-1.5 rounded-full bg-[#D4AF37] text-black text-[10px] font-royal font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl hover:brightness-110 hover:scale-105 flex items-center gap-1 z-20"
                        title="Quick preview products in this department"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Quick Peek</span>
                      </button>
                    </div>

                    {/* Category Information - Clean unboxed typography */}
                    <div className="px-5 pb-5 pt-1 space-y-3 relative z-10">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-royal text-sm sm:text-base font-bold tracking-[0.08em] text-[#F3EFE0] group-hover:text-[#E5C158] transition-colors line-clamp-1">
                            {cat.displayName || cat.name}
                          </h3>
                          <ChevronRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1.5 transition-transform shrink-0" />
                        </div>
                        <p className="text-[11px] text-gray-400 font-serif-luxury italic line-clamp-2 mt-1 leading-relaxed">
                          {cat.description}
                        </p>
                      </div>

                      {/* Subcategories preview line */}
                      {stat && stat.subcategories.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/[0.06]">
                          {stat.subcategories.slice(0, 2).map((sub, sIdx) => (
                            <button
                              key={sIdx}
                              type="button"
                              onClick={(e) => handleSubcategorySelect(e, cat.id, sub)}
                              className="text-[9px] px-2 py-0.5 rounded-full bg-white/[0.04] text-[#D8CFB8] hover:bg-[#D4AF37]/20 hover:text-[#E5C158] border border-white/10 transition-colors truncate max-w-[120px]"
                            >
                              {sub}
                            </button>
                          ))}
                          {stat.subcategories.length > 2 && (
                            <span className="text-[9px] text-[#A69C80] self-center">
                              +{stat.subcategories.length - 2} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Bottom Action Line */}
                      <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
                        {stat && stat.minPrice > 0 ? (
                          <span className="text-[11px] font-mono font-medium text-[#E5C158]">
                            Starting ₹{stat.minPrice.toLocaleString('en-IN')}
                          </span>
                        ) : (
                          <span className="text-[11px] text-gray-500 font-medium">Explore Lineup</span>
                        )}
                        <span className="text-[11px] font-royal font-bold text-[#E5C158] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          <span>Enter</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right edge fade gradient hint */}
          {canScrollRight && (
            <div className="absolute right-0 top-0 bottom-6 w-20 bg-gradient-to-l from-[#0A0A0A] to-transparent pointer-events-none hidden md:block" />
          )}

          {/* Hint text */}
          <div className="flex items-center justify-between text-[11px] text-[#A69C80] font-mono pt-2 px-1">
            <span>Slide horizontally to explore all departments ({categories.length} total)</span>
            <span className="hidden sm:inline">Glide to view →</span>
          </div>
        </div>
      )}

      {/* 3. VIEW MODE B: STRUCTURED ORGANIZED DIRECTORY WITH SUBCATEGORIES */}
      {activeViewMode === 'directory' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {categories.map((cat, idx) => {
            const stat = categoryStats[cat.id];

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                onClick={() => handleCategorySelect(cat.id)}
                className="group relative cursor-pointer p-5 bg-gradient-to-r from-[#141414] to-[#0D0D0D] rounded-2xl border border-white/[0.08] hover:border-[#E5C158]/50 transition-all duration-300 shadow-md hover:shadow-xl"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    {getCategoryIcon(cat.iconName)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-royal text-base font-bold text-[#F3EFE0] group-hover:text-[#E5C158] transition-colors">
                        {cat.displayName || cat.name}
                      </h3>
                      <span className="text-xs font-mono font-bold text-[#D4AF37]">
                        {stat?.count ?? cat.itemCount} Items
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 font-serif-luxury italic line-clamp-2">
                      {cat.description}
                    </p>
                    {stat && stat.subcategories.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {stat.subcategories.map((sub, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-[#D8CFB8] border border-white/5"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* 4. QUICK VIEW DRAWER MODAL */}
      {selectedQuickViewCategory && activeQuickViewCatObj && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-4xl bg-[#121212] rounded-3xl border border-[#D4AF37]/40 shadow-2xl p-6 max-h-[85vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/15 flex items-center justify-center text-[#E5C158]">
                  {getCategoryIcon(activeQuickViewCatObj.iconName)}
                </div>
                <div>
                  <h3 className="font-royal text-lg sm:text-xl font-bold text-[#F3EFE0]">
                    {activeQuickViewCatObj.displayName} Showcase
                  </h3>
                  <span className="text-xs text-[#C59B27] font-mono">
                    {quickViewProducts.length} Premium Products
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedQuickViewCategory(null)}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {quickViewProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="p-3 rounded-2xl bg-black/50 border border-white/5 hover:border-[#D4AF37]/40 transition-all flex flex-col justify-between"
                >
                  <div className="aspect-[4/5] p-3 flex items-center justify-center relative">
                    <img
                      src={prod.images?.[0] || '/uploads/products/mya_suka.svg'}
                      alt={prod.name}
                      className="w-full h-full object-contain filter drop-shadow-md"
                    />
                  </div>
                  <div className="space-y-1 pt-2">
                    <h4 className="font-royal text-xs font-bold text-white line-clamp-1">
                      {prod.name}
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="font-royal font-bold text-[#E5C158] text-sm">
                        ₹{prod.price.toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={() => addToCart(prod, 1)}
                        className="px-2.5 py-1 rounded-lg bg-[#D4AF37] text-black font-royal text-[10px] font-bold"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-between items-center shrink-0">
              <span className="text-xs text-gray-400">
                Viewing all items in {activeQuickViewCatObj.displayName}
              </span>
              <button
                onClick={() => {
                  setSelectedCategory(activeQuickViewCatObj.id);
                  setCurrentPage('shop');
                  setSelectedQuickViewCategory(null);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#A07C1C] text-black font-royal text-xs font-bold"
              >
                View Full Catalog →
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
