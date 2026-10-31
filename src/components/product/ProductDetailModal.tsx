import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  Star, 
  ShoppingBag, 
  Sparkles, 
  Package, 
  Plus, 
  Minus, 
  CheckCircle2,
  Zap,
  Leaf,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { Product, ProductVariant } from '../../types';
import { useApp } from '../../context/AppContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart, toggleWishlist, isInWishlist, setCurrentPage } = useApp();
  
  if (!product) return null;

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );

  const isWishlisted = isInWishlist(product.id);
  const activePrice = selectedVariant ? selectedVariant.price : product.price;
  const activeMrp = selectedVariant ? selectedVariant.mrp : product.mrp;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariant);
    onClose();
    setCurrentPage('cart');
  };

  const normalizedImages = (() => {
    if (!product || !product.images) return [];
    let imgs: any = product.images;
    if (typeof imgs === 'string') {
      try {
        const parsed = JSON.parse(imgs);
        imgs = Array.isArray(parsed) ? parsed : [imgs];
      } catch {
        imgs = [imgs];
      }
    }
    if (Array.isArray(imgs)) {
      return imgs.map((x: any) => (typeof x === 'string' ? x.trim() : '')).filter(Boolean);
    }
    return [];
  })();

  const currentImage = normalizedImages[selectedImageIdx] || normalizedImages[0] || null;
  const [modalImgFailed, setModalImgFailed] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      {/* Modal Card */}
      <div className="relative w-full max-w-4xl bg-[#111111] rounded-2xl border border-[#C59B27]/50 shadow-[0_16px_50px_rgba(0,0,0,0.95)] overflow-hidden my-auto max-h-[92vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-black/80 text-gray-300 hover:text-white hover:bg-black border border-[#C59B27]/40 flex items-center justify-center transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT COLUMN: Gallery */}
        <div className="md:w-1/2 p-4 sm:p-6 bg-[#0B0B0B] flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#C59B27]/20">
          <div className="relative aspect-square rounded-xl overflow-hidden bg-black border border-[#C59B27]/30 flex items-center justify-center">
            {currentImage && !modalImgFailed ? (
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={() => setModalImgFailed(true)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                <Package className="w-16 h-16 text-[#C59B27]/40 mb-3" />
                <span className="text-xs font-royal text-[#E5C158]/60 uppercase tracking-widest">{product.name}</span>
              </div>
            )}
            {/* Discount Badge */}
            {product.discountPercent > 0 && (
              <span className="absolute top-3 left-3 bg-[#2ECC71] text-black font-black text-xs px-2.5 py-1 rounded shadow">
                {product.discountPercent}% OFF
              </span>
            )}
            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                isWishlisted
                  ? 'bg-[#C59B27] text-black'
                  : 'bg-black/60 text-gray-300 hover:text-[#D4AF37]'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-black' : ''}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2.5 mt-3 overflow-x-auto py-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                    selectedImageIdx === idx
                      ? 'border-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.5)] scale-105'
                      : 'border-[#333] opacity-60 hover:opacity-100'
                  }`}
                >
                  <img 
                    src={img} 
                    alt="thumbnail" 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer" 
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Details & Controls */}
        <div className="md:w-1/2 p-5 sm:p-7 overflow-y-auto flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            {/* Category & Title */}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest text-[#A89050] font-semibold">
                  {product.subcategory || product.category.replace('_', ' ')}
                </span>
                {product.isTobaccoFree && (
                  <span className="bg-[#162916] text-[#2ECC71] border border-[#2ECC71]/30 text-[9px] font-bold px-2 py-0.5 rounded">
                    0% TOBACCO FREE
                  </span>
                )}
              </div>
              <h2 className="font-royal text-xl sm:text-2xl font-bold text-[#F3EFE0] tracking-wide mt-0.5">
                {product.name}
              </h2>
            </div>

            {/* Rating & Stock */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-[#1E1A0E] px-2.5 py-1 rounded border border-[#C59B27]/40 text-[#E5C158] text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-[#E5C158]" />
                <span>{product.rating}</span>
              </div>
              <span className="text-xs text-gray-400">({product.reviewCount} Reviews)</span>
              {product.stock > 0 ? (
                <span className="ml-auto text-xs text-[#2ECC71] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> In Stock ({product.stock})
                </span>
              ) : (
                <span className="ml-auto text-xs text-red-400 font-semibold">Out of Stock</span>
              )}
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="font-royal text-2xl sm:text-3xl font-extrabold text-[#E5C158]">
                ₹{activePrice}
              </span>
              {activeMrp > activePrice && (
                <span className="text-base text-gray-500 line-through">
                  ₹{activeMrp}
                </span>
              )}
              {product.discountPercent > 0 && (
                <span className="bg-[#2ECC71]/20 text-[#2ECC71] border border-[#2ECC71]/40 text-xs font-bold px-2 py-0.5 rounded">
                  {product.discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Variants Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2 pt-1">
                <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider block">
                  Select Pack / Size Option:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        selectedVariant?.id === v.id
                          ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-md font-bold'
                          : 'bg-[#181818] text-gray-300 border-[#333] hover:border-[#C59B27]/50'
                      }`}
                    >
                      {v.name} - ₹{v.price}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="pt-2 space-y-1 border-t border-[#222]">
              <h4 className="text-xs font-bold text-[#E5C158] uppercase tracking-wider">
                Product Details
              </h4>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                {product.description || product.shortDescription}
              </p>
            </div>

            {/* WHAT THIS PAAN INCLUDES / INGREDIENTS SECTION */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="p-3 rounded-xl bg-[#18140B] border border-[#C59B27]/40 space-y-2">
                <h5 className="text-xs font-bold text-[#E5C158] uppercase tracking-wider flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-[#2ECC71]" />
                  What This Product Includes:
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {product.ingredients.map((ing, i) => (
                    <span
                      key={i}
                      className="text-xs bg-[#241C0E] text-[#F3EFE0] px-2.5 py-1 rounded-full border border-[#D4AF37]/30 flex items-center gap-1"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E5C158]" />
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Attributes / Key Specs */}
            {product.attributes && Object.keys(product.attributes).length > 0 && (
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                {Object.entries(product.attributes).map(([key, val]) => (
                  <div key={key} className="bg-[#161616] p-2 rounded-lg border border-[#252525]">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block">{key}</span>
                    <span className="text-gray-200 font-semibold">{val}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#222] text-[11px] text-gray-300">
              <div className="flex items-center gap-1 text-[#2ECC71]">
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">100% Fresh Leaf</span>
              </div>
              <div className="flex items-center gap-1 text-[#D4AF37]">
                <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">Pure Ingredients</span>
              </div>
              <div className="flex items-center gap-1 text-[#E5C158]">
                <Package className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">Discreet Pack</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-[#C59B27]/30 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-[#181818] border border-[#C59B27]/40 rounded-lg overflow-hidden h-11">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 text-gray-300 hover:text-white hover:bg-[#252525] transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-[#E5C158] font-royal">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-3 text-gray-300 hover:text-white hover:bg-[#252525] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 h-11 rounded-lg font-royal font-bold text-xs sm:text-sm text-black bg-gradient-to-r from-[#F3D079] via-[#D4AF37] to-[#9B7817] hover:brightness-110 active:scale-95 transition-all shadow-[0_4px_16px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                ADD TO CART
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className="w-full h-11 rounded-lg font-royal font-bold text-xs sm:text-sm text-[#F3EFE0] bg-[#1F190B] border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <Zap className="w-4 h-4 text-[#D4AF37]" />
              BUY NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
