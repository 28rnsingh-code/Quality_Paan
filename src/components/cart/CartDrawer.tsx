import React, { useState } from 'react';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  Tag, 
  Check, 
  X, 
  Package, 
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    cartSubtotal,
    cartDiscount,
    cartDeliveryCharge,
    cartPlatformFee,
    cartTax,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    coupons,
    setCurrentPage,
    setSelectedCategory,
    paymentConfig,
  } = useApp();

  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput);
      setCouponInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-[#161616] border border-[#C59B27]/40 flex items-center justify-center text-[#D4AF37] mb-6 shadow-[0_0_24px_rgba(212,175,55,0.2)]">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-royal text-2xl sm:text-3xl font-bold text-[#E5C158] mb-3">
          Your Royal Cart is Empty
        </h2>
        <p className="text-sm text-gray-400 max-w-md mx-auto mb-8 font-serif-luxury italic">
          Explore our handcrafted artisanal paans, imperial hookahs, and connoisseur accessories.
        </p>
        <button
          onClick={() => {
            setSelectedCategory('all');
            setCurrentPage('shop');
          }}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-royal font-bold text-sm text-black bg-gradient-to-r from-[#F3D079] via-[#D4AF37] to-[#9B7817] hover:brightness-110 shadow-lg"
        >
          <span>START SHOPPING</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-8">
      {/* Breadcrumb & Title */}
      <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#C59B27]/25">
        <div>
          <button
            onClick={() => setCurrentPage('shop')}
            className="text-xs text-gray-400 hover:text-[#E5C158] flex items-center gap-1 mb-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Continue Shopping
          </button>
          <h1 className="font-royal text-2xl sm:text-3xl font-bold text-[#F3EFE0] tracking-wide">
            SHOPPING CART <span className="text-[#D4AF37]">({cartCount})</span>
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 hover:underline"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free Shipping Progress Indicator */}
          <div className="p-4 rounded-xl bg-[#141208] border border-[#C59B27]/30 text-xs">
            {cartSubtotal >= 499 ? (
              <div className="flex items-center gap-2 text-[#2ECC71] font-semibold">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>You unlocked FREE Express Discreet Delivery!</span>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex justify-between text-gray-300">
                  <span>Add <strong>₹{499 - cartSubtotal}</strong> more for Free Delivery</span>
                  <span className="text-[#E5C158]">₹{cartSubtotal} / ₹499</span>
                </div>
                <div className="w-full bg-[#222] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#D4AF37] to-[#2ECC71] h-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (cartSubtotal / 499) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Items */}
          {cart.map((item, idx) => {
            const itemPrice = item.selectedVariant ? item.selectedVariant.price : item.product.price;
            const itemMrp = item.selectedVariant ? item.selectedVariant.mrp : item.product.mrp;

            return (
              <div
                key={`${item.product.id}-${item.selectedVariant?.id || 'std'}-${idx}`}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#121212] border border-[#C59B27]/25 hover:border-[#C59B27]/50 transition-all shadow-md"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover bg-black border border-[#C59B27]/30 flex-shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-[#A89050] font-semibold">
                      {item.product.category.replace('_', ' ')}
                    </span>
                    <h3 className="font-royal text-sm sm:text-base font-bold text-[#F3EFE0]">
                      {item.product.name}
                    </h3>
                    {item.selectedVariant && (
                      <p className="text-xs text-[#D4AF37] font-semibold">
                        Variant: {item.selectedVariant.name}
                      </p>
                    )}
                    <div className="flex items-baseline gap-2">
                      <span className="font-royal text-sm sm:text-base font-bold text-[#E5C158]">
                        ₹{itemPrice}
                      </span>
                      {itemMrp > itemPrice && (
                        <span className="text-xs text-gray-500 line-through">
                          ₹{itemMrp}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Remove */}
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                  <div className="flex items-center bg-[#1A1A1A] border border-[#C59B27]/40 rounded-lg overflow-hidden h-9">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1, item.selectedVariant?.id)}
                      className="px-2.5 text-gray-300 hover:text-white hover:bg-[#252525]"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-[#E5C158] font-royal">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1, item.selectedVariant?.id)}
                      className="px-2.5 text-gray-300 hover:text-white hover:bg-[#252525]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="font-royal text-base font-bold text-[#E5C158] w-20 text-right">
                    ₹{itemPrice * item.quantity}
                  </span>

                  <button
                    onClick={() => removeFromCart(item.product.id, item.selectedVariant?.id)}
                    className="text-gray-500 hover:text-red-400 p-1.5 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT COLUMN: Order Summary & Coupon */}
        <div className="lg:col-span-4 space-y-6">
          {/* Coupon Code Box */}
          <div className="p-5 rounded-xl bg-[#121212] border border-[#C59B27]/30 space-y-3">
            <h3 className="font-royal text-xs font-bold text-[#E5C158] uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-4 h-4" /> Apply Coupon Code
            </h3>

            {appliedCoupon ? (
              <div className="flex items-center justify-between p-2.5 rounded bg-[#1B291B] border border-[#2ECC71]/40 text-xs">
                <div className="flex items-center gap-2 text-[#2ECC71]">
                  <Check className="w-4 h-4" />
                  <div>
                    <span className="font-bold font-royal">{appliedCoupon.code}</span>
                    <p className="text-[10px] text-gray-300">{appliedCoupon.description}</p>
                  </div>
                </div>
                <button onClick={removeCoupon} className="text-gray-400 hover:text-red-400">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="e.g. ROYAL20, FIRSTPAAN"
                  className="flex-1 bg-[#1A1A1A] text-xs px-3 py-2 rounded-lg border border-[#333] focus:outline-none focus:border-[#D4AF37] uppercase text-[#F3EFE0]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg font-royal text-xs font-bold bg-[#D4AF37] text-black hover:brightness-110"
                >
                  APPLY
                </button>
              </form>
            )}

            {/* Quick Coupons Suggestions */}
            <div className="pt-2">
              <span className="text-[10px] text-gray-400 block mb-1.5">Available Offers:</span>
              <div className="flex flex-wrap gap-1.5">
                {coupons.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => applyCoupon(c.code)}
                    className="text-[10px] bg-[#181818] border border-[#C59B27]/30 hover:border-[#D4AF37] text-[#E5C158] px-2 py-0.5 rounded transition-all"
                  >
                    {c.code}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Order Financial Breakdown */}
          <div className="p-5 rounded-xl bg-[#121212] border border-[#C59B27]/40 space-y-3.5 shadow-xl">
            <h3 className="font-royal text-sm font-bold text-[#E5C158] uppercase tracking-wider pb-2 border-b border-[#252525]">
              Order Summary
            </h3>

            <div className="space-y-2 text-xs text-gray-300">
              <div className="flex justify-between">
                <span>Cart Subtotal</span>
                <span className="font-semibold text-[#F3EFE0]">₹{cartSubtotal}</span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-[#2ECC71]">
                  <span>Discount Applied ({appliedCoupon?.code})</span>
                  <span>-₹{cartDiscount}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span>Discreet Express Delivery</span>
                <span>
                  {cartDeliveryCharge === 0 ? (
                    <span className="text-[#2ECC71] font-semibold flex items-center gap-1">
                      FREE {paymentConfig?.enableDeliveryCharge && paymentConfig?.freeDeliveryAboveAmount > 0 ? `(Above ₹${paymentConfig.freeDeliveryAboveAmount})` : ''}
                    </span>
                  ) : (
                    <span className="text-[#F3EFE0] font-semibold">₹{cartDeliveryCharge}</span>
                  )}
                </span>
              </div>

              {/* Dynamic Platform / Packaging Fee (if enabled) */}
              {paymentConfig?.enablePlatformFee && cartPlatformFee > 0 && (
                <div className="flex justify-between items-center text-xs text-gray-300">
                  <span>{paymentConfig.platformFeeLabel || 'Platform & Packaging Fee'}</span>
                  <span className="text-[#F3EFE0] font-semibold">₹{cartPlatformFee}</span>
                </div>
              )}

              {/* Dynamic GST / Tax (only shown if enabled and > 0) */}
              {paymentConfig?.enableGst && cartTax > 0 ? (
                <div className="flex justify-between items-center">
                  <span>{paymentConfig.taxLabel || `Applicable Taxes (GST ${paymentConfig.gstPercentage}%)`}</span>
                  <span className="text-[#F3EFE0] font-semibold">₹{cartTax}</span>
                </div>
              ) : (
                <div className="flex justify-between items-center text-gray-400 text-[11px]">
                  <span>Government Taxes</span>
                  <span className="text-[#2ECC71]">₹0 (Included)</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#333] flex justify-between items-baseline">
              <span className="font-royal text-sm font-bold text-[#F3EFE0]">Total Amount</span>
              <span className="font-royal text-2xl font-extrabold text-[#E5C158]">
                ₹{cartTotal}
              </span>
            </div>

            <button
              onClick={() => setCurrentPage('checkout')}
              className="w-full py-3.5 rounded-lg font-royal font-bold text-sm text-black bg-gradient-to-r from-[#F3D079] via-[#D4AF37] to-[#9B7817] hover:brightness-110 active:scale-95 transition-all shadow-[0_4px_16px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-4 text-[10px] text-gray-400 pt-2">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" /> Safe & Secure Checkout
              </span>
              <span className="flex items-center gap-1">
                <Package className="w-3.5 h-3.5 text-[#2ECC71]" /> Discreet Box
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
