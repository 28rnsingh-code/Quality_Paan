import React from 'react';
import { ChevronRight, Gift, Package } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CombosSection: React.FC = () => {
  const { products, categories, setCurrentPage } = useApp();

  // If user deleted 'combos' category, hide combos section completely
  const hasCombosCategory = categories.some((c) => c.id === 'combos');
  if (!hasCombosCategory) {
    return null;
  }

  const combos = products.filter(
    (p) =>
      p.category === 'combos' ||
      p.subcategory?.toLowerCase().includes('combo') ||
      p.name.toLowerCase().includes('combo') ||
      p.id.includes('combo')
  );

  if (combos.length === 0) {
    return null;
  }

  // Use first featured combo or simply first available combo
  const displayCombo = combos.find((c) => c.isFeatured) || combos[0];

  return (
    <section className="py-8 px-4 sm:px-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#141208] via-[#1C180C] to-[#0D0B05] border border-[#C59B27]/40 shadow-[0_8px_32px_rgba(0,0,0,0.8)] p-6 sm:p-10">
        {/* Decorative gold background shimmer */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C59B27]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
          {/* Left Column Text & Offer */}
          <div className="md:col-span-7 space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2A2005] border border-[#C59B27]/50 text-[#E5C158] text-xs font-semibold">
              <Gift className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>LIMITED TIME EXCLUSIVE BUNDLES</span>
            </div>

            <h3 className="font-royal text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FFF2B2] via-[#E5C158] to-[#9B7817]">
              COMBOS & BEST OFFERS
            </h3>

            <p className="font-serif-luxury italic text-base sm:text-lg text-[#DFD6BD]">
              &ldquo;Ek Choice &mdash; Jo Har Mood Ko Perfect Banaye!&rdquo;
            </p>

            <p className="text-xs sm:text-sm text-gray-300 max-w-lg">
              Save up to 30% on curated royal party bundles including handcrafted 24K Gold Hookah sets, organic herbal flavours, quad-jet torch lighters, crystal ashtrays, and luxury ambient fragrances.
            </p>

            <div className="pt-2">
              <button
                onClick={() => setCurrentPage('combos')}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-royal font-bold text-xs sm:text-sm text-black bg-gradient-to-r from-[#F3D079] via-[#D4AF37] to-[#9B7817] hover:brightness-110 active:scale-95 transition-all shadow-[0_4px_16px_rgba(212,175,55,0.4)] cursor-pointer"
              >
                <span>EXPLORE COMBOS</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column Combo Visual Showcase */}
          <div className="md:col-span-5 flex justify-center">
            <button
              onClick={() => setCurrentPage('combos')}
              className="relative rounded-xl overflow-hidden border border-[#C59B27]/50 shadow-2xl max-w-sm w-full aspect-[4/3] group text-left cursor-pointer transition-transform duration-300 hover:scale-[1.02] focus:outline-none"
            >
              {displayCombo.images?.[0] ? (
                <img
                  src={displayCombo.images[0]}
                  alt={displayCombo.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1c1608] to-[#0a0a0a] p-4 text-center">
                  <Package className="w-10 h-10 text-[#C59B27]/40 mb-2" />
                  <span className="text-xs font-royal text-[#E5C158]/60 uppercase tracking-widest">{displayCombo.name}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              {displayCombo.discountPercent > 0 && (
                <div className="absolute top-3 right-3 bg-[#2ECC71] text-black font-extrabold text-xs px-2.5 py-1 rounded shadow">
                  SAVE {displayCombo.discountPercent}%
                </div>
              )}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                <span className="font-royal font-bold text-[#E5C158] truncate mr-2">{displayCombo.name}</span>
                <span className="bg-black/80 px-2 py-0.5 rounded text-[#FFF] font-bold shrink-0">₹{displayCombo.price.toLocaleString()}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
