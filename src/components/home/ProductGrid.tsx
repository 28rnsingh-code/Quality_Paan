import React, { useRef, useState } from 'react';
import { ChevronRight, ChevronLeft, SlidersHorizontal, Grid3X3, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { useApp } from '../../context/AppContext';

interface ProductGridProps {
  title: string;
  subtitle?: string;
  products: Product[];
  showViewAll?: boolean;
  onViewAll?: () => void;
  limit?: number;
  sectionId?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  title,
  subtitle,
  products,
  showViewAll = true,
  onViewAll,
  limit,
  sectionId,
}) => {
  const { setCurrentPage, setSelectedCategory } = useApp();
  const [viewMode, setViewMode] = useState<'slider' | 'grid'>('slider');
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const displayedProducts = limit ? products.slice(0, limit) : products;

  const handleScrollCheck = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 20);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 20);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === 'left' ? -380 : 380;
    scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setTimeout(handleScrollCheck, 350);
  };

  const handleViewAllClick = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      setSelectedCategory('all');
      setCurrentPage('shop');
    }
  };

  return (
    <section id={sectionId} className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background ambient luxury glow */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#C59B27]/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-amber-900/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      {/* Section Header with Coordinated Slide Animation */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-white/[0.08]"
      >
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#C59B27] uppercase">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#E5C158]" />
            <span>Curated Royal Collection</span>
          </div>
          <h2 className="font-royal text-xl sm:text-2xl lg:text-3xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#FFF9E6] via-[#E5C158] to-[#C59B27] uppercase">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-gray-400 font-serif-luxury italic max-w-xl">
              {subtitle}
            </p>
          )}
        </div>

        {/* Action Controls: Slider Nav, View Switcher & View All */}
        <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
          {/* View Mode Switcher */}
          <div className="flex items-center p-1 bg-[#141414] rounded-xl border border-white/10 shadow-inner">
            <button
              onClick={() => setViewMode('slider')}
              className={`px-3 py-1.5 rounded-lg text-xs font-royal font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'slider'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#A07C1C] text-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Smooth Gliding Showcase"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Slider</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-royal font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#A07C1C] text-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Expanded Grid"
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
          </div>

          {/* Slider Left / Right Navigation Buttons */}
          {viewMode === 'slider' && displayedProducts.length > 3 && (
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

          {showViewAll && (
            <button
              onClick={handleViewAllClick}
              className="flex items-center gap-1 text-xs font-royal font-bold text-[#E5C158] hover:text-white transition-colors group px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-[#C59B27]/30 hover:border-[#D4AF37]"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </motion.div>

      {/* Empty State */}
      {displayedProducts.length === 0 ? (
        <div className="text-center py-16 bg-[#121212]/60 rounded-3xl border border-white/5 backdrop-blur-md">
          <p className="text-gray-400 text-sm font-serif-luxury italic">
            No royal delicacies found in this collection.
          </p>
        </div>
      ) : viewMode === 'slider' ? (
        /* 1. SLIDER VIEW: Products glide horizontally from the right */
        <div className="relative group/track">
          <div
            ref={scrollContainerRef}
            onScroll={handleScrollCheck}
            className="flex gap-5 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-6 pt-2 px-1"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {displayedProducts.map((prod, idx) => (
              <div
                key={prod.id}
                style={{ scrollSnapAlign: 'start' }}
                className="shrink-0"
              >
                <ProductCard
                  product={prod}
                  index={idx}
                  layout="slider"
                  animateFromRight={true}
                />
              </div>
            ))}
          </div>

          {/* Right edge fade gradient hint */}
          {canScrollRight && (
            <div className="absolute right-0 top-0 bottom-6 w-20 bg-gradient-to-l from-[#0A0A0A] to-transparent pointer-events-none hidden md:block" />
          )}

          {/* Slide hint micro-label */}
          <div className="flex items-center justify-between text-[11px] text-[#A69C80] font-mono pt-2 px-1">
            <span>Slide horizontally to explore ({displayedProducts.length} items)</span>
            <span className="hidden sm:inline">Use arrows or drag to glide →</span>
          </div>
        </div>
      ) : (
        /* 2. GRID VIEW: Multi-column responsive grid with staggered right-to-left entrance */
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayedProducts.map((prod, idx) => (
            <ProductCard
              key={prod.id}
              product={prod}
              index={idx}
              layout="grid"
              animateFromRight={true}
            />
          ))}
        </div>
      )}
    </section>
  );
};
