import React, { useState } from 'react';
import { Heart, Star, ShoppingBag, Eye, Sparkles, Package } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';

interface ProductCardProps {
  product: Product;
  index?: number;
  layout?: 'slider' | 'grid';
  animateFromRight?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index = 0,
  layout = 'grid',
  animateFromRight = true,
}) => {
  const { addToCart, toggleWishlist, isInWishlist, setSelectedProduct } = useApp();
  const isWishlisted = isInWishlist(product.id);
  const [imgFailed, setImgFailed] = useState(false);

  const getProductImage = (p: Product): string | null => {
    if (!p || !p.images) return null;
    let imgs: any = p.images;
    if (typeof imgs === 'string') {
      try {
        const parsed = JSON.parse(imgs);
        imgs = Array.isArray(parsed) ? parsed : [imgs];
      } catch {
        imgs = [imgs];
      }
    }
    if (Array.isArray(imgs) && imgs.length > 0 && typeof imgs[0] === 'string' && imgs[0].trim()) {
      return imgs[0].trim();
    }
    return null;
  };

  const imageUrl = getProductImage(product);

  const cardContent = (
    <div
      className={`group relative flex flex-col justify-between bg-gradient-to-b from-[#141414]/90 via-[#0B0B0B]/95 to-[#060606] rounded-3xl border border-white/[0.06] hover:border-[#E5C158]/50 transition-all duration-500 shadow-[0_12px_36px_rgba(0,0,0,0.6)] hover:shadow-[0_24px_60px_rgba(197,155,39,0.22)] hover:-translate-y-2 h-full overflow-hidden ${
        layout === 'slider' ? 'w-[260px] sm:w-[290px] md:w-[310px] shrink-0' : 'w-full'
      }`}
    >
      {/* Top Ambient Glow & Radial Backdrop (Unboxed Silhouette Canvas) */}
      <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-[#C59B27]/10 via-[#C59B27]/[0.02] to-transparent pointer-events-none rounded-t-3xl" />
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-40 h-40 bg-[#D4AF37]/10 rounded-full blur-2xl group-hover:bg-[#D4AF37]/20 group-hover:scale-125 transition-all duration-700 pointer-events-none" />

      {/* Floating Product Image Container - NO hard square box */}
      <div
        className="relative w-full aspect-[4/5] p-5 sm:p-6 flex items-center justify-center cursor-pointer z-10"
        onClick={() => setSelectedProduct(product)}
      >
        {imageUrl && !imgFailed ? (
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain filter drop-shadow-[0_14px_28px_rgba(0,0,0,0.85)] group-hover:drop-shadow-[0_24px_44px_rgba(212,175,55,0.38)] group-hover:scale-110 group-hover:-translate-y-2.5 transition-all duration-500 ease-out select-none"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
            <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Package className="w-8 h-8 text-[#C59B27]" />
            </div>
            <span className="text-xs font-royal text-[#E5C158]/70 uppercase tracking-widest font-semibold">
              {product.category || 'Luxury'}
            </span>
          </div>
        )}

        {/* Floating Badges (Subtle, sleek unboxed tags) */}
        <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 z-20 pointer-events-none">
          {product.discountPercent > 0 && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider bg-emerald-500/90 text-black shadow-md backdrop-blur-sm">
              {product.discountPercent}% OFF
            </span>
          )}
          {product.isBestseller && (
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-widest uppercase bg-gradient-to-r from-[#D4AF37] to-[#997312] text-black shadow-md flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Bestseller
            </span>
          )}
        </div>

        {/* Wishlist Button (Floating Glass Circle) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3.5 right-3.5 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 z-20 shadow-lg ${
            isWishlisted
              ? 'bg-[#C59B27] text-black shadow-[0_0_15px_rgba(197,155,39,0.5)]'
              : 'bg-black/60 text-gray-300 hover:text-[#D4AF37] hover:bg-black/90 hover:scale-110 border border-white/10'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 transition-transform ${isWishlisted ? 'fill-black scale-110' : ''}`} />
        </button>

        {/* Hover Quick View Button */}
        <div className="absolute inset-x-0 bottom-4 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-20 pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProduct(product);
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-royal font-bold bg-[#141414]/90 hover:bg-[#D4AF37] text-[#E5C158] hover:text-black border border-[#D4AF37]/50 shadow-xl backdrop-blur-md transition-all hover:scale-105"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Details Section - Airy, unboxed luxury typography */}
      <div className="px-4 pb-4 pt-1 flex flex-col justify-between flex-1 gap-3 relative z-10">
        <div className="space-y-1">
          {/* Subcategory / Origin Label */}
          <div className="flex items-center justify-between text-[10px] text-[#A69C80] font-mono tracking-widest uppercase">
            <span>{product.subcategory || product.category.replace('_', ' ')}</span>
            {product.rating > 0 && (
              <div className="flex items-center gap-1 text-[#E5C158]">
                <Star className="w-3 h-3 fill-[#E5C158]" />
                <span className="font-bold text-[10px] text-white">{product.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Product Title */}
          <h4
            onClick={() => setSelectedProduct(product)}
            className="font-royal text-sm sm:text-[15px] font-bold text-[#F3EFE0] group-hover:text-[#E5C158] transition-colors cursor-pointer line-clamp-1 leading-snug tracking-wide"
            title={product.name}
          >
            {product.name}
          </h4>

          {/* Short description preview if available */}
          {product.shortDescription && (
            <p className="text-[11px] text-gray-400 font-serif-luxury italic line-clamp-1">
              {product.shortDescription}
            </p>
          )}
        </div>

        {/* Price & Action Module */}
        <div className="pt-2.5 border-t border-white/[0.06] flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="font-royal text-base sm:text-lg font-extrabold text-[#E5C158] tabular-nums tracking-tight">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.mrp > product.price && (
                <span className="text-[11px] text-gray-500 line-through tabular-nums">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[9px] text-emerald-400 font-medium">In Stock • Express Delivery</span>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.stock <= 0}
            className={`px-3.5 py-2 rounded-xl font-royal text-xs font-bold transition-all duration-300 flex items-center gap-1.5 shadow-md shrink-0 ${
              product.stock > 0
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#A07C1C] text-black hover:brightness-110 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] active:scale-95'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
            title={product.stock > 0 ? 'Add to Royal Cart' : 'Out of Stock'}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{product.stock > 0 ? 'Add' : 'Sold'}</span>
          </button>
        </div>
      </div>
    </div>
  );

  if (!animateFromRight) {
    return cardContent;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 75 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.65,
        delay: Math.min((index % 6) * 0.08, 0.45),
        ease: [0.16, 1, 0.3, 1],
      }}
      className="h-full"
    >
      {cardContent}
    </motion.div>
  );
};
