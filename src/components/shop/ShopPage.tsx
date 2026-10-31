import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  SlidersHorizontal, 
  Search, 
  X, 
  Sparkles, 
  Check, 
  ArrowUpDown,
  ChevronRight,
  Flame,
  Zap,
  Wind,
  FileText,
  Layers,
  Tag
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../home/ProductCard';
import { ProductCategory } from '../../types';

export const ShopPage: React.FC = () => {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    setCurrentPage,
  } = useApp();

  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating' | 'discount'>('featured');
  const [priceMax, setPriceMax] = useState<number>(10000);
  const [tobaccoFreeOnly, setTobaccoFreeOnly] = useState<boolean>(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Available subcategories based on selected category
  const availableSubcategories = useMemo(() => {
    if (selectedCategory === 'all') return [];
    const catProds = products.filter((p) => p.category === selectedCategory);
    const subcats = new Set<string>();
    catProds.forEach((p) => {
      if (p.subcategory) subcats.add(p.subcategory);
    });
    return Array.from(subcats);
  }, [products, selectedCategory]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search query filter (takes precedence across all categories when searching)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = p.name.toLowerCase().includes(q);
          const matchesDesc = p.description.toLowerCase().includes(q);
          const matchesCat = p.category.toLowerCase().includes(q);
          const matchesSub = p.subcategory?.toLowerCase().includes(q);
          if (!matchesName && !matchesDesc && !matchesCat && !matchesSub) {
            return false;
          }
        } else {
          // Category filter
          if (selectedCategory !== 'all' && p.category !== selectedCategory) {
            return false;
          }
          // Subcategory filter
          if (selectedSubcategory !== 'all' && p.subcategory !== selectedSubcategory) {
            return false;
          }
        }
        // Price filter
        if (p.price > priceMax) {
          return false;
        }
        // Tobacco free toggle
        if (tobaccoFreeOnly && !p.isTobaccoFree) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
        return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
      });
  }, [products, selectedCategory, selectedSubcategory, searchQuery, priceMax, tobaccoFreeOnly, sortBy]);

  const activeCategoryObj = categories.find((c) => c.id === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-8">
      {/* Category Navigation Bar & Breadcrumbs */}
      <div className="mb-8 space-y-4">
        {/* Breadcrumbs */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <button onClick={() => { setSelectedCategory('all'); setCurrentPage('home'); }} className="hover:text-[#E5C158] transition-colors">
              Home
            </button>
            <ChevronRight className="w-3 h-3 text-gray-600" />
            <button onClick={() => { setSelectedCategory('all'); setSelectedSubcategory('all'); }} className="hover:text-[#E5C158] transition-colors">
              Shop
            </button>
            {activeCategoryObj && (
              <>
                <ChevronRight className="w-3 h-3 text-gray-600" />
                <span className="text-[#E5C158] font-semibold uppercase">
                  {activeCategoryObj.displayName}
                </span>
              </>
            )}
            {selectedSubcategory !== 'all' && (
              <>
                <ChevronRight className="w-3 h-3 text-gray-600" />
                <span className="text-white font-semibold">
                  {selectedSubcategory}
                </span>
              </>
            )}
          </div>

          {selectedCategory !== 'all' && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedSubcategory('all');
              }}
              className="text-[11px] text-[#D4AF37] hover:underline flex items-center gap-1 font-semibold"
            >
              <X className="w-3 h-3" />
              <span>Reset Category Filter</span>
            </button>
          )}
        </div>

        {/* Organized Category Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 bg-[#111111]/90 p-2 rounded-2xl border border-[#252525]">
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedSubcategory('all');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#B3851B] text-black font-bold shadow-md'
                : 'bg-[#181818] text-gray-300 border border-[#2C2C2C] hover:border-[#D4AF37]/50 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Departments</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 font-mono">
              {products.length}
            </span>
          </button>

          {categories.map((cat) => {
            const isCatActive = selectedCategory === cat.id;
            const catCount = products.filter((p) => p.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSelectedSubcategory('all');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isCatActive
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#B3851B] text-black font-bold shadow-md'
                    : 'bg-[#161616] text-[#E5C158] border border-[#C59B27]/30 hover:bg-[#201A09] hover:border-[#D4AF37]'
                }`}
              >
                <span>{cat.displayName || cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  isCatActive ? 'bg-black/40 text-black' : 'bg-[#2A2005] text-[#D4AF37]'
                }`}>
                  {catCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Category Header Banner */}
        {activeCategoryObj ? (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#17140B] via-[#121212] to-[#161616] border border-[#C59B27]/35 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-[#D4AF37]/50 shadow-md">
                  <img
                    src={activeCategoryObj.image}
                    alt={activeCategoryObj.displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-royal text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0A0] via-[#E5C158] to-[#B3851B] uppercase tracking-wide">
                      {activeCategoryObj.displayName}
                    </h1>
                    <span className="text-[10px] bg-[#2A2005] text-[#D4AF37] border border-[#D4AF37]/40 px-2 py-0.5 rounded-full font-mono font-bold">
                      {filteredProducts.length} Products
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 mt-1 max-w-xl">
                    {activeCategoryObj.description}
                  </p>
                </div>
              </div>

              {/* Sort & Filter Controls */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                  className="md:hidden flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#161616] border border-[#C59B27]/40 text-xs text-[#E5C158]"
                >
                  <Filter className="w-3.5 h-3.5" /> Filters
                </button>

                <div className="flex items-center gap-2 bg-[#141414] border border-[#C59B27]/30 rounded-lg px-3 py-1.5">
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <label className="text-xs text-gray-400 hidden sm:inline">Sort:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent text-xs text-[#F3EFE0] font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="featured" className="bg-[#181818]">Featured / Bestseller</option>
                    <option value="price-low" className="bg-[#181818]">Price: Low to High</option>
                    <option value="price-high" className="bg-[#181818]">Price: High to Low</option>
                    <option value="rating" className="bg-[#181818]">Top Rated</option>
                    <option value="discount" className="bg-[#181818]">Highest Discount</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Subcategory Pills Row */}
            {availableSubcategories.length > 0 && (
              <div className="mt-4 pt-3 border-t border-[#2A2415] flex items-center gap-2 overflow-x-auto no-scrollbar">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono shrink-0 mr-1">
                  Sub-collections:
                </span>
                <button
                  onClick={() => setSelectedSubcategory('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedSubcategory === 'all'
                      ? 'bg-[#D4AF37] text-black shadow-md font-bold'
                      : 'bg-[#181818] text-gray-300 border border-[#303030] hover:border-[#D4AF37]/50'
                  }`}
                >
                  All {activeCategoryObj.displayName} ({products.filter(p => p.category === selectedCategory).length})
                </button>
                {availableSubcategories.map((sub) => {
                  const subCount = products.filter(p => p.category === selectedCategory && p.subcategory === sub).length;
                  return (
                    <button
                      key={sub}
                      onClick={() => setSelectedSubcategory(sub)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                        selectedSubcategory === sub
                          ? 'bg-[#D4AF37] text-black shadow-md font-bold'
                          : 'bg-[#181818] text-gray-300 border border-[#303030] hover:border-[#D4AF37]/50'
                      }`}
                    >
                      <span>{sub}</span>
                      <span className="text-[10px] opacity-75 font-mono">({subCount})</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#C59B27]/25">
            <div>
              <h1 className="font-royal text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0A0] via-[#E5C158] to-[#B3851B] uppercase tracking-wide">
                ALL ROYAL COLLECTIONS
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 font-serif-luxury italic mt-0.5">
                Showing {filteredProducts.length} items across all 5 luxury departments
              </p>
            </div>

            {/* Sort & Mobile Filter Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="md:hidden flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#161616] border border-[#C59B27]/40 text-xs text-[#E5C158]"
              >
                <Filter className="w-3.5 h-3.5" /> Filters
              </button>

              <div className="flex items-center gap-2 bg-[#141414] border border-[#C59B27]/30 rounded-lg px-3 py-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#D4AF37]" />
                <label className="text-xs text-gray-400 hidden sm:inline">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-xs text-[#F3EFE0] font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="featured" className="bg-[#181818]">Featured / Bestseller</option>
                  <option value="price-low" className="bg-[#181818]">Price: Low to High</option>
                  <option value="price-high" className="bg-[#181818]">Price: High to Low</option>
                  <option value="rating" className="bg-[#181818]">Top Rated</option>
                  <option value="discount" className="bg-[#181818]">Highest Discount</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Shop Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* DESKTOP SIDEBAR FILTERS */}
        <aside className={`md:col-span-3 space-y-6 ${mobileFilterOpen ? 'block' : 'hidden md:block'}`}>
          {/* Category Filter List */}
          <div className="p-4 rounded-xl bg-[#121212] border border-[#C59B27]/25 space-y-3">
            <h3 className="font-royal text-xs font-bold text-[#E5C158] uppercase tracking-wider flex items-center justify-between">
              <span>Categories</span>
              {selectedCategory !== 'all' && (
                <button
                  onClick={() => { setSelectedCategory('all'); setSelectedSubcategory('all'); }}
                  className="text-[10px] text-gray-400 hover:text-white lowercase underline"
                >
                  reset
                </button>
              )}
            </h3>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => { setSelectedCategory('all'); setSelectedSubcategory('all'); }}
                className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center justify-between ${
                  selectedCategory === 'all'
                    ? 'bg-[#2A2008] text-[#E5C158] font-bold border-l-2 border-[#D4AF37]'
                    : 'text-gray-300 hover:bg-[#181818]'
                }`}
              >
                <span>All Products</span>
                <span className="text-[10px] text-gray-500">{products.length}</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); setSelectedSubcategory('all'); }}
                  className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center justify-between ${
                    selectedCategory === cat.id
                      ? 'bg-[#2A2008] text-[#E5C158] font-bold border-l-2 border-[#D4AF37]'
                      : 'text-gray-300 hover:bg-[#181818]'
                  }`}
                >
                  <span>{cat.displayName}</span>
                  <span className="text-[10px] text-gray-500">{cat.itemCount}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="p-4 rounded-xl bg-[#121212] border border-[#C59B27]/25 space-y-3">
            <h3 className="font-royal text-xs font-bold text-[#E5C158] uppercase tracking-wider">
              Max Price: ₹{priceMax}
            </h3>
            <input
              type="range"
              min="50"
              max="15000"
              step="50"
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="w-full accent-[#D4AF37] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>₹50</span>
              <span>₹15,000</span>
            </div>
          </div>

          {/* Tobacco-Free Sweet Filter */}
          <div className="p-4 rounded-xl bg-[#121212] border border-[#C59B27]/25 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300">
              <input
                type="checkbox"
                checked={tobaccoFreeOnly}
                onChange={(e) => setTobaccoFreeOnly(e.target.checked)}
                className="accent-[#2ECC71] w-4 h-4 cursor-pointer"
              />
              <span className="font-bold text-[#2ECC71]">100% Tobacco-Free Only</span>
            </label>
            <p className="text-[10px] text-gray-400">
              Show only fresh fruit paans, meetha paans & herbal blends.
            </p>
          </div>
        </aside>

        {/* PRODUCTS GRID */}
        <main className="md:col-span-9">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-[#121212] rounded-2xl border border-[#C59B27]/20 p-6">
              <Sparkles className="w-10 h-10 text-[#D4AF37] mx-auto mb-3" />
              <h3 className="font-royal text-lg font-bold text-[#E5C158] mb-2">No Matching Delicacies Found</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto mb-6">
                Try loosening your search query or filters to discover other royal items.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedSubcategory('all');
                  setSearchQuery('');
                  setPriceMax(10000);
                  setTobaccoFreeOnly(false);
                }}
                className="px-6 py-2.5 rounded-full font-royal text-xs font-bold bg-[#D4AF37] text-black"
              >
                RESET ALL FILTERS
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
