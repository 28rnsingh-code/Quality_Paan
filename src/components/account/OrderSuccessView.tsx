import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  Sparkles, 
  MapPin, 
  Phone, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Check,
  X,
  FileText,
  QrCode
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';

interface OrderSuccessViewProps {
  order: Order | null;
}

export const OrderSuccessView: React.FC<OrderSuccessViewProps> = ({ order }) => {
  const { 
    user, 
    setCurrentPage, 
    setSelectedCategory, 
    verifyAndApproveUpiOrder, 
    rejectUpiOrder,
    showToast 
  } = useApp();

  const [adminNotes, setAdminNotes] = useState('');
  const [showNotesInput, setShowNotesInput] = useState(false);

  const isAwaitingVerification = order?.status === 'payment_verification' || 
    (order?.paymentMethod === 'upi' && !order?.upiVerifiedByAdmin && order?.status !== 'cancelled');

  const isAdmin = user?.role === 'admin' || user?.email === '28r.n.singh@gmail.com';

  useEffect(() => {
    // Only launch celebratory gold confetti if the order is confirmed
    if (order && !isAwaitingVerification && order.status === 'confirmed') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#2ECC71', '#FFF5C0', '#B3851B'],
        });
      } catch (e) {
        console.log('Confetti trigger');
      }
    }
  }, [order, isAwaitingVerification]);

  if (!order) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <h2 className="font-royal text-2xl font-bold text-[#E5C158]">No recent order found</h2>
        <button
          onClick={() => setCurrentPage('home')}
          className="mt-4 px-6 py-2 bg-[#D4AF37] text-black font-royal font-bold text-xs rounded"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const handleAdminApprove = () => {
    verifyAndApproveUpiOrder(order.id, adminNotes || 'Verified in ICICI Bank account');
    setShowNotesInput(false);
  };

  const handleAdminReject = () => {
    const reason = window.prompt('Please enter the reason for rejecting this UPI order request:', 'Payment not received in bank account');
    if (reason) {
      rejectUpiOrder(order.id, reason);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-8">
      <div className="bg-[#121212] rounded-2xl border border-[#C59B27]/40 shadow-[0_12px_40px_rgba(0,0,0,0.8)] overflow-hidden">
        
        {/* Banner Section */}
        {isAwaitingVerification ? (
          /* AWAITING VERIFICATION / UNDER PROGRESS BANNER */
          <div className="p-8 bg-gradient-to-b from-[#2A2005] via-[#1A1504] to-[#121212] text-center border-b border-[#C59B27]/40 relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-[#181818] border-2 border-[#D4AF37] flex items-center justify-center text-[#E5C158] shadow-[0_0_24px_rgba(212,175,55,0.4)] mb-4">
              <Clock className="w-10 h-10 sm:w-12 sm:h-12 text-[#E5C158] animate-pulse" />
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs font-semibold mb-2 shadow">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>ORDER REQUEST SUBMITTED &bull; UNDER PROGRESS</span>
            </div>

            <h1 className="font-royal text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0A0] via-[#E5C158] to-[#B3851B]">
              UPI Order Request Placed
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 font-serif-luxury italic mt-1">
              Order Request Reference: <strong className="text-[#E5C158] font-mono">{order.orderNumber}</strong>
            </p>

            {/* Explanation box */}
            <div className="max-w-2xl mx-auto mt-5 p-4 rounded-xl bg-black/60 border border-[#D4AF37]/30 text-left space-y-2 text-xs text-gray-300">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-white font-semibold">
                    Payment Verification Under Progress
                  </p>
                  <p className="text-gray-300 leading-relaxed text-[11px]">
                    We have recorded your UPI transaction request. Store administrator <strong>Rahul Singh</strong> will verify credit against your UTR <span className="font-mono text-[#E5C158] font-bold">{order.upiTransactionId || 'Pending'}</span> in bank records. Once approved, your order status will update to <strong>Confirmed</strong> and preparation will begin.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* CONFIRMED CELEBRATION BANNER */
          <div className="p-8 bg-gradient-to-b from-[#1F190B] to-[#121212] text-center border-b border-[#C59B27]/25 relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-[#181818] border-2 border-[#2ECC71] flex items-center justify-center text-[#2ECC71] shadow-[0_0_24px_rgba(46,204,113,0.4)] mb-4 animate-bounce">
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2A2005] border border-[#C59B27]/50 text-[#E5C158] text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>ORDER CONFIRMED & IN PREPARATION</span>
            </div>

            <h1 className="font-royal text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0A0] via-[#E5C158] to-[#B3851B]">
              Thank You For Your Royal Order!
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 font-serif-luxury italic mt-1">
              Order Reference: <strong className="text-[#E5C158] font-mono">{order.orderNumber}</strong>
            </p>
          </div>
        )}

        {/* ADMIN VERIFICATION QUICK-ACTION TOOLBAR (If viewed by Admin) */}
        {isAdmin && isAwaitingVerification && (
          <div className="p-4 bg-[#1E1705] border-b border-[#D4AF37]/50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-[#E5C158]">
              <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
              <div>
                <span className="font-bold block">Store Administrator Panel (Rahul Singh)</span>
                <span className="text-[11px] text-gray-300">
                  Verify ₹{order.total} against UTR: <strong className="font-mono text-[#FFF]">{order.upiTransactionId || 'None'}</strong>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleAdminApprove}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-lg bg-[#2ECC71] hover:bg-[#27AE60] text-black font-royal font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Verify & Approve Order</span>
              </button>
              <button
                onClick={handleAdminReject}
                className="px-3 py-2 rounded-lg bg-[#2A1010] hover:bg-red-900/60 border border-red-500/40 text-red-300 font-royal font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reject</span>
              </button>
            </div>
          </div>
        )}

        {/* Live Delivery Timeline Tracker */}
        <div className="p-6 bg-[#0E0E0E] border-b border-[#252525]">
          <h3 className="font-royal text-xs font-bold text-[#E5C158] uppercase tracking-wider mb-6 text-center">
            {isAwaitingVerification 
              ? 'Status: Payment Verification Under Progress' 
              : 'Estimated Delivery: Within 35-45 Minutes'}
          </h3>

          <div className="relative flex items-center justify-between max-w-2xl mx-auto px-4">
            {/* Timeline track */}
            <div className="absolute top-1/2 left-8 right-8 h-1 bg-[#222] -translate-y-1/2 -z-0">
              <div 
                className={`h-full bg-gradient-to-r from-[#D4AF37] to-[#2ECC71] transition-all duration-500 ${
                  isAwaitingVerification ? 'w-1/4' : 'w-2/4'
                }`} 
              />
            </div>

            {/* Step 1: Verification / Confirmation */}
            <div className="flex flex-col items-center gap-2 relative z-10">
              <div className={`w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs shadow-md ${
                isAwaitingVerification 
                  ? 'bg-[#D4AF37] text-black animate-pulse shadow-[0_0_10px_rgba(212,175,55,0.6)]' 
                  : 'bg-[#2ECC71] text-black shadow-[0_0_10px_rgba(46,204,113,0.5)]'
              }`}>
                {isAwaitingVerification ? <Clock className="w-4 h-4" /> : '✓'}
              </div>
              <span className={`text-[10px] font-semibold text-center ${
                isAwaitingVerification ? 'text-[#E5C158] font-bold' : 'text-gray-200'
              }`}>
                {isAwaitingVerification ? 'Under Progress' : 'Confirmed'}
              </span>
            </div>

            {/* Step 2: Preparing */}
            <div className="flex flex-col items-center gap-2 relative z-10">
              <div className={`w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs ${
                !isAwaitingVerification 
                  ? 'bg-[#D4AF37] text-black shadow-[0_0_10px_rgba(212,175,55,0.5)] animate-pulse' 
                  : 'bg-[#222] border border-[#444] text-gray-500'
              }`}>
                <Sparkles className="w-4 h-4" />
              </div>
              <span className={`text-[10px] text-center ${
                !isAwaitingVerification ? 'text-[#E5C158] font-bold' : 'text-gray-500'
              }`}>
                Handcrafting
              </span>
            </div>

            {/* Step 3: Out for Delivery */}
            <div className="flex flex-col items-center gap-2 relative z-10">
              <div className="w-8 h-8 rounded-full bg-[#222] border border-[#444] text-gray-500 flex items-center justify-center text-xs">
                <Truck className="w-4 h-4" />
              </div>
              <span className="text-[10px] text-gray-500 text-center">Discreet Delivery</span>
            </div>

            {/* Step 4: Delivered */}
            <div className="flex flex-col items-center gap-2 relative z-10">
              <div className="w-8 h-8 rounded-full bg-[#222] border border-[#444] text-gray-500 flex items-center justify-center text-xs">
                <Package className="w-4 h-4" />
              </div>
              <span className="text-[10px] text-gray-500 text-center">Delivered</span>
            </div>
          </div>
        </div>

        {/* Order Details & Summary */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-300">
          {/* Shipping Address */}
          <div className="p-4 rounded-xl bg-[#181818] border border-[#252525] space-y-2">
            <h4 className="font-royal text-xs font-bold text-[#E5C158] uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#D4AF37]" /> Delivery Destination
            </h4>
            <p className="font-bold text-white text-sm">{order.shippingAddress.fullName}</p>
            <p className="text-gray-300">
              {order.shippingAddress.addressLine1} {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
            </p>
            <p className="text-gray-400">
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
            </p>
            <p className="text-[#A89050] font-semibold">
              📞 {order.shippingAddress.phone}
            </p>
          </div>

          {/* Payment & Packaging */}
          <div className="p-4 rounded-xl bg-[#181818] border border-[#252525] space-y-2">
            <h4 className="font-royal text-xs font-bold text-[#E5C158] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" /> Payment & Verification Info
            </h4>
            <div className="flex justify-between">
              <span>Payment Mode:</span>
              <span className="font-bold uppercase text-white">
                {order.paymentMethod === 'upi'
                  ? 'Direct UPI / QR Transfer'
                  : (order.paymentMethod === 'bank'
                      ? 'Direct Bank Transfer (NEFT/RTGS)'
                      : (order.paymentMethod === 'cod' ? 'Cash On Delivery (COD)' : 'Online Secured Payment'))}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Order Status:</span>
              {isAwaitingVerification ? (
                <span className="text-amber-400 font-bold uppercase text-[10px] px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 animate-pulse">
                  Under Progress (Awaiting Verification)
                </span>
              ) : (
                <span className="text-[#2ECC71] font-bold uppercase text-[10px] px-2 py-0.5 rounded bg-green-500/10 border border-green-500/30">
                  {order.status}
                </span>
              )}
            </div>

            {order.upiTransactionId && (
              <div className="flex justify-between items-center pt-1">
                <span>Submitted UPI UTR:</span>
                <span className="font-mono text-[#E5C158] font-bold">{order.upiTransactionId}</span>
              </div>
            )}

            {order.upiScreenshotUrl && (
              <div className="flex justify-between items-center pt-1">
                <span>Payment Proof:</span>
                <span className="text-[#2ECC71] text-[11px] font-semibold flex items-center gap-1">
                  ✓ Receipt Attached
                </span>
              </div>
            )}

            {order.upiVerifiedByAdmin && (
              <div className="flex justify-between items-center pt-1 text-[#2ECC71]">
                <span>Admin Approval:</span>
                <span className="font-semibold text-[11px]">
                  ✓ Verified by {order.upiVerifiedBy || 'Rahul Singh'}
                </span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Packaging:</span>
              <span className="text-[#E5C158] font-bold">100% Discreet & Odorless</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[#333]">
              <span className="font-royal font-bold text-white">Total Amount:</span>
              <span className="font-royal font-extrabold text-[#E5C158] text-base">₹{order.total}</span>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-6 bg-[#0E0E0E] border-t border-[#252525] flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setCurrentPage('my-orders')}
            className="w-full sm:w-auto px-6 py-3 rounded-full font-royal font-bold text-xs bg-[#D4AF37] text-black hover:brightness-110 shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <span>TRACK IN MY ORDERS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setCurrentPage('shop');
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-full font-royal font-bold text-xs bg-[#1F1F1F] text-gray-200 hover:text-white border border-[#444] hover:border-[#D4AF37] cursor-pointer transition-all"
          >
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
};
