import React from 'react';
import { Tag, Copy, Sparkles, Check, Percent } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OffersPage: React.FC = () => {
  const { coupons, applyCoupon, setCurrentPage } = useApp();
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    applyCoupon(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-8">
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2A2005] border border-[#C59B27]/50 text-[#E5C158] text-xs font-semibold">
          <Percent className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>EXCLUSIVE DISCOUNTS & VOUCHERS</span>
        </div>
        <h1 className="font-royal text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0A0] via-[#E5C158] to-[#B3851B]">
          Special Offers & Coupon Codes
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 font-serif-luxury italic">
          Copy code to auto-apply instant discount on your cart.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon) => (
          <div
            key={coupon.code}
            className="p-6 rounded-2xl bg-[#121212] border border-[#C59B27]/40 flex flex-col justify-between space-y-4 shadow-xl hover:border-[#D4AF37] transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-royal text-lg font-bold text-[#E5C158] tracking-widest border border-dashed border-[#C59B27] px-3 py-1 rounded bg-[#1C180C]">
                  {coupon.code}
                </span>
                <span className="text-xs font-bold text-[#2ECC71] bg-[#162916] border border-[#2ECC71]/30 px-2 py-0.5 rounded font-mono">
                  {coupon.discountPercent ? `${coupon.discountPercent}% OFF` : `₹${coupon.discountAmount} OFF`}
                </span>
              </div>

              {/* Scope & First Buy Badges */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(coupon.eligibility === 'new_user_only' || coupon.firstBuyOnly) && (
                  <span className="text-[10px] bg-amber-950/80 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-bold">
                    ⭐ First Buy (1st Order)
                  </span>
                )}
                {coupon.appliesToType === 'specific_product' && (
                  <span className="text-[10px] bg-[#221C00] text-[#E5C158] border border-[#D4AF37]/50 px-2 py-0.5 rounded font-semibold">
                    🛍️ Item: {coupon.targetProductName || 'Specific Product'}
                  </span>
                )}
                {coupon.appliesToType === 'specific_category' && (
                  <span className="text-[10px] bg-[#17202A] text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded font-semibold">
                    📁 Category: {coupon.targetCategoryName || 'Category'}
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-300 font-semibold leading-relaxed">{coupon.description}</p>
              <p className="text-[11px] text-gray-500">
                Min. order amount: ₹{coupon.minOrderValue}
                {coupon.maxDiscountCap && coupon.maxDiscountCap > 0 ? ` • Max cap: ₹${coupon.maxDiscountCap}` : ''}
              </p>
            </div>

            <button
              onClick={() => handleCopy(coupon.code)}
              className="w-full py-2.5 rounded-lg font-royal font-bold text-xs bg-[#1C180C] border border-[#D4AF37] text-[#E5C158] hover:bg-[#D4AF37] hover:text-black transition-all flex items-center justify-center gap-2"
            >
              {copiedCode === coupon.code ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#2ECC71]" />
                  <span>COPIED & APPLIED!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>TAP TO COPY & APPLY</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
