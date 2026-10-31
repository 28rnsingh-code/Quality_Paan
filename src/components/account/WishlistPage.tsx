import React from 'react';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../home/ProductCard';

export const WishlistPage: React.FC = () => {
  const { wishlist, products, setCurrentPage, setSelectedCategory } = useApp();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  if (wishlistedProducts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#161616] border border-[#C59B27]/40 flex items-center justify-center text-[#D4AF37] mb-4">
          <Heart className="w-8 h-8" />
        </div>
        <h2 className="font-royal text-2xl font-bold text-[#E5C158] mb-2">
          Your Wishlist is Empty
        </h2>
        <p className="text-xs text-gray-400 max-w-sm mx-auto mb-6">
          Save your favourite paan delicacies, hookah setups, and exclusive accessories here.
        </p>
        <button
          onClick={() => {
            setSelectedCategory('all');
            setCurrentPage('shop');
          }}
          className="px-6 py-2.5 rounded-full font-royal text-xs font-bold bg-[#D4AF37] text-black"
        >
          EXPLORE CATALOG
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-8">
      <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#C59B27]/25">
        <div>
          <h1 className="font-royal text-2xl sm:text-3xl font-bold text-[#F3EFE0] tracking-wide">
            MY WISHLIST <span className="text-[#D4AF37]">({wishlistedProducts.length})</span>
          </h1>
          <p className="text-xs text-gray-400 font-serif-luxury italic mt-0.5">
            Your personal royal bookmarked collection
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {wishlistedProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
};
