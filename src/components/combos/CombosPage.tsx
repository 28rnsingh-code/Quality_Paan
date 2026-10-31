import React from 'react';
import { Gift, Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../home/ProductCard';

export const CombosPage: React.FC = () => {
  const { products, addToCart } = useApp();

  const comboProducts = products.filter(
    (p) =>
      p.category === 'combos' ||
      p.subcategory?.toLowerCase().includes('combo') ||
      p.subcategory?.toLowerCase().includes('gift') ||
      p.subcategory?.toLowerCase().includes('set') ||
      p.subcategory?.toLowerCase().includes('box') ||
      p.subcategory?.toLowerCase().includes('bundle') ||
      p.name.toLowerCase().includes('combo') ||
      p.name.toLowerCase().includes('gift') ||
      p.name.toLowerCase().includes('set') ||
      p.name.toLowerCase().includes('bundle') ||
      p.id.includes('combo')
  );

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-8">
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2A2005] border border-[#C59B27]/50 text-[#E5C158] text-xs font-semibold">
          <Gift className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>CURATED CELEBRATION BUNDLES</span>
        </div>
        <h1 className="font-royal text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0A0] via-[#E5C158] to-[#B3851B]">
          Royal Party Combos & Packages
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 font-serif-luxury italic">
          &ldquo;Ek Choice &mdash; Jo Har Mood Ko Perfect Banaye!&rdquo;
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {comboProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
};
