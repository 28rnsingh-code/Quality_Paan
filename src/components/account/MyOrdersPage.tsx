import React, { useState } from 'react';
import { 
  Package, 
  Truck, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Phone,
  MessageCircle,
  MapPin,
  FileText,
  Check,
  AlertCircle,
  Edit3
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';

export const MyOrdersPage: React.FC = () => {
  const { 
    orders, 
    user,
    setCurrentPage, 
    setSelectedCategory, 
    verifyAndApproveUpiOrder,
    rejectUpiOrder,
    updateOrderUpiDetails,
    showToast 
  } = useApp();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null);
  const [isEditingUtr, setIsEditingUtr] = useState(false);
  const [editUtrValue, setEditUtrValue] = useState('');

  const isAdmin = user?.role === 'admin' || user?.email === '28r.n.singh@gmail.com';

  const getOrderStatus = (order?: Order | null): string => {
    if (!order) return 'pending';
    if (order.status === 'payment_verification' || (order.paymentMethod === 'upi' && !order.upiVerifiedByAdmin && order.status !== 'cancelled')) {
      return 'payment_verification';
    }
    return order.status || (order as any).orderStatus || 'pending';
  };

  const getOrderTotal = (order?: Order | null): number => {
    if (!order) return 0;
    return typeof order.total === 'number' ? order.total : ((order as any).totalAmount || 0);
  };

  const getStatusBadge = (status: string, order?: Order) => {
    if (status === 'payment_verification' || (order?.paymentMethod === 'upi' && !order?.upiVerifiedByAdmin && order?.status !== 'cancelled')) {
      return {
        label: 'Under Progress (UPI Verification)',
        classes: 'text-amber-300 bg-amber-950/60 border-amber-500/60 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.3)]',
        step: 0,
        isAwaiting: true,
      };
    }

    switch (status) {
      case 'delivered':
        return {
          label: 'Delivered',
          classes: 'text-[#2ECC71] bg-[#162916] border-[#2ECC71]/50',
          step: 4,
          isAwaiting: false,
        };
      case 'out_for_delivery':
        return {
          label: 'Out For Delivery',
          classes: 'text-[#3498DB] bg-[#102030] border-[#3498DB]/50',
          step: 3,
          isAwaiting: false,
        };
      case 'packed':
      case 'preparing':
        return {
          label: 'Handcrafted & Packed',
          classes: 'text-[#E5C158] bg-[#2A2005] border-[#C59B27]/50',
          step: 2,
          isAwaiting: false,
        };
      case 'cancelled':
        return {
          label: 'Cancelled / Declined',
          classes: 'text-red-400 bg-red-950/40 border-red-800/50',
          step: -1,
          isAwaiting: false,
        };
      default:
        return {
          label: 'Order Confirmed',
          classes: 'text-green-400 bg-green-950/40 border-green-800/50',
          step: 1,
          isAwaiting: false,
        };
    }
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#161616] border border-[#C59B27]/40 flex items-center justify-center text-[#D4AF37] mb-4">
          <Truck className="w-8 h-8" />
        </div>
        <h2 className="font-royal text-2xl font-bold text-[#E5C158] mb-2">No Active Orders</h2>
        <p className="text-xs text-gray-400 max-w-sm mx-auto mb-6">
          Your orders and live discreet express delivery tracking will be shown here.
        </p>
        <button
          onClick={() => {
            setSelectedCategory('all');
            setCurrentPage('shop');
          }}
          className="px-6 py-2.5 rounded-full font-royal text-xs font-bold bg-[#D4AF37] text-black hover:brightness-110 shadow-lg"
        >
          EXPLORE ROYAL CATALOG
        </button>
      </div>
    );
  }

  const activeOrder = selectedOrder || orders[0];
  const activeStatus = getOrderStatus(activeOrder);
  const statusBadge = getStatusBadge(activeStatus);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-8">
      {/* Page Title & Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-3 border-b border-[#C59B27]/25">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <button onClick={() => setCurrentPage('home')} className="hover:text-[#E5C158]">Home</button>
            <span>/</span>
            <button onClick={() => setCurrentPage('account')} className="hover:text-[#E5C158]">My Profile</button>
            <span>/</span>
            <span className="text-[#E5C158] font-bold">Track Orders</span>
          </div>
          <h1 className="font-royal text-2xl sm:text-3xl font-bold text-[#F3EFE0] tracking-wide">
            MY ORDERS & LIVE TRACKING
          </h1>
          <p className="text-xs text-gray-400 font-serif-luxury italic mt-0.5">
            Real-time status updates and order history with discreet express fulfillment
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedCategory('all');
            setCurrentPage('shop');
          }}
          className="self-start sm:self-center px-4 py-2 rounded-lg bg-[#181818] border border-[#C59B27]/40 text-xs font-royal text-[#E5C158] hover:bg-[#C59B27] hover:text-black transition-all flex items-center gap-2"
        >
          <span>Order More Fresh Paan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Orders List Column */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-royal font-bold text-[#E5C158] uppercase tracking-wider mb-2">
            Order History ({orders.length})
          </h3>
          {orders.map((order) => {
            const isSelected = activeOrder.id === order.id;
            const curStatus = getOrderStatus(order);
            const curBadge = getStatusBadge(curStatus, order);
            const total = getOrderTotal(order);

            return (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#1C180C] border-[#D4AF37] shadow-[0_0_16px_rgba(212,175,55,0.25)]'
                    : 'bg-[#121212] border-[#252525] hover:border-[#C59B27]/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-royal font-bold text-xs text-[#E5C158]">
                    {order.orderNumber || order.id}
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${curBadge.classes}`}>
                    {curBadge.label}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-300">
                  <span>
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                  </span>
                  <span className="font-royal font-bold text-[#F3EFE0]">₹{total}</span>
                </div>

                <div className="text-[11px] text-gray-400 mt-2 truncate">
                  {order.items && order.items.length > 0 
                    ? order.items.map((it: any) => `${it.productName || it.name || 'Product'} (x${it.quantity || 1})`).join(', ')
                    : 'Artisanal Selection'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Order Detailed Tracking Panel */}
        <div className="lg:col-span-7">
          {activeOrder ? (
            <div className="bg-[#121212] rounded-xl border border-[#C59B27]/40 p-6 space-y-6 shadow-xl">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#252525]">
                <div>
                  <h3 className="font-royal text-lg font-bold text-[#E5C158]">
                    Order {activeOrder.orderNumber || activeOrder.id}
                  </h3>
                  <p className="text-xs text-gray-400">
                    Placed on {activeOrder.createdAt ? new Date(activeOrder.createdAt).toLocaleString('en-IN') : 'Recent'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold uppercase px-2.5 py-1 rounded border ${statusBadge.classes}`}>
                    {statusBadge.label}
                  </span>
                </div>
              </div>

              {/* UPI Awaiting Verification Notice Card */}
              {statusBadge.isAwaiting && (
                <div className="p-4 rounded-xl bg-[#231A05] border border-[#D4AF37]/50 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <Clock className="w-5 h-5 text-[#E5C158] flex-shrink-0 animate-pulse mt-0.5" />
                      <div className="space-y-1">
                        <h4 className="font-royal text-xs font-bold text-[#E5C158] uppercase tracking-wide">
                          Payment Verification Under Progress
                        </h4>
                        <p className="text-[11px] text-gray-300 leading-relaxed">
                          Your UPI order request has been logged. Store administrator <strong>Rahul Singh</strong> will verify bank credit against your reference UTR <strong className="font-mono text-[#E5C158]">{activeOrder.upiTransactionId || 'Pending'}</strong>. Once approved, you will receive confirmation and preparation will commence.
                        </p>
                      </div>
                    </div>

                    {/* Admin Quick Action (If admin is viewing this) */}
                    {isAdmin && (
                      <button
                        onClick={() => verifyAndApproveUpiOrder(activeOrder.id, 'Verified from My Orders')}
                        className="px-3.5 py-1.5 rounded-lg bg-[#2ECC71] hover:bg-[#27AE60] text-black font-royal font-bold text-xs flex items-center gap-1.5 flex-shrink-0 shadow cursor-pointer transition-all self-start"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve Order</span>
                      </button>
                    )}
                  </div>

                  {/* UTR update row */}
                  <div className="pt-2 border-t border-[#C59B27]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-[11px]">Submitted UTR:</span>
                      <span className="font-mono font-bold text-[#F3EFE0] bg-black/60 px-2 py-0.5 rounded border border-[#444]">
                        {activeOrder.upiTransactionId || 'None'}
                      </span>
                    </div>

                    {isEditingUtr ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={editUtrValue}
                          onChange={(e) => setEditUtrValue(e.target.value)}
                          placeholder="Enter 12-digit UTR"
                          className="bg-black text-xs font-mono px-2 py-1 rounded border border-[#C59B27]/60 text-white w-36"
                        />
                        <button
                          onClick={() => {
                            if (editUtrValue.trim()) {
                              updateOrderUpiDetails(activeOrder.id, editUtrValue.trim());
                              setIsEditingUtr(false);
                            }
                          }}
                          className="px-2.5 py-1 rounded bg-[#D4AF37] text-black font-bold text-[10px]"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setIsEditingUtr(false)}
                          className="px-2 py-1 rounded bg-[#333] text-gray-300 text-[10px]"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditUtrValue(activeOrder.upiTransactionId || '');
                          setIsEditingUtr(true);
                        }}
                        className="text-[11px] text-[#E5C158] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit UTR Reference</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Live ETA Card for active delivery */}
              {activeStatus === 'out_for_delivery' && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-[#182318] to-[#121b12] border border-[#2ECC71]/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#2ECC71]/20 border border-[#2ECC71] flex items-center justify-center text-[#2ECC71] animate-pulse">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-royal font-bold text-xs text-[#2ECC71]">
                        Express Discreet Partner On The Way
                      </p>
                      <p className="text-[11px] text-gray-300">
                        Estimated Arrival: <strong className="text-white">Within 15-20 Mins</strong>
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => showToast('Connecting to discreet delivery driver...', 'info')}
                      className="p-2 rounded-lg bg-[#202e20] border border-[#2ECC71]/40 text-[#2ECC71] hover:bg-[#2ECC71] hover:text-black transition-colors"
                      title="Call Delivery Partner"
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => showToast('Driver alerted to drop discreetly at doorstep.', 'success')}
                      className="p-2 rounded-lg bg-[#202e20] border border-[#2ECC71]/40 text-[#2ECC71] hover:bg-[#2ECC71] hover:text-black transition-colors"
                      title="WhatsApp Instructions"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Progress Timeline Stepper */}
              <div className="p-4 rounded-xl bg-[#0E0E0E] border border-[#252525] space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-royal text-xs font-bold text-[#E5C158] uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#D4AF37]" /> Fulfillment Progress
                  </h4>
                  <span className="text-[10px] text-gray-400">
                    {statusBadge.isAwaiting ? 'Verification Stage' : 'Discreet Sealed Packaging'}
                  </span>
                </div>

                {statusBadge.isAwaiting ? (
                  /* Stepper for UPI Payment Verification under progress */
                  <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                    {/* Step 1: Verification Under Progress */}
                    <div className="flex flex-col items-center gap-1 text-[#E5C158]">
                      <div className="w-7 h-7 rounded-full bg-[#D4AF37] text-black font-bold flex items-center justify-center shadow-[0_0_10px_rgba(212,175,55,0.6)] animate-pulse">
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-[#E5C158]">Under Progress</span>
                    </div>

                    {/* Step 2: Admin Approval */}
                    <div className="flex flex-col items-center gap-1 text-gray-500">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold bg-[#222] text-gray-500 border border-[#333]">
                        2
                      </div>
                      <span className="font-semibold text-gray-400">Admin Approval</span>
                    </div>

                    {/* Step 3: Crafting */}
                    <div className="flex flex-col items-center gap-1 text-gray-500">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold bg-[#222] text-gray-500 border border-[#333]">
                        3
                      </div>
                      <span className="font-semibold text-gray-400">Handcrafting</span>
                    </div>

                    {/* Step 4: Discreet Delivery */}
                    <div className="flex flex-col items-center gap-1 text-gray-500">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold bg-[#222] text-gray-500 border border-[#333]">
                        4
                      </div>
                      <span className="font-semibold text-gray-400">Delivery</span>
                    </div>
                  </div>
                ) : (
                  /* Normal Stepper when confirmed or beyond */
                  <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                    {/* Step 1: Confirmed */}
                    <div className="flex flex-col items-center gap-1 text-[#2ECC71]">
                      <div className="w-7 h-7 rounded-full bg-[#2ECC71] text-black font-bold flex items-center justify-center shadow-[0_0_8px_rgba(46,204,113,0.4)]">
                        ✓
                      </div>
                      <span className="font-semibold text-gray-200">Confirmed</span>
                    </div>

                    {/* Step 2: Handcrafting */}
                    <div className={`flex flex-col items-center gap-1 ${statusBadge.step >= 2 ? 'text-[#2ECC71]' : 'text-gray-500'}`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold ${statusBadge.step >= 2 ? 'bg-[#2ECC71] text-black shadow-[0_0_8px_rgba(46,204,113,0.4)]' : 'bg-[#222] text-gray-500'}`}>
                        {statusBadge.step >= 2 ? '✓' : '2'}
                      </div>
                      <span className="font-semibold text-gray-200">Crafting & Sealed</span>
                    </div>

                    {/* Step 3: Out for delivery */}
                    <div className={`flex flex-col items-center gap-1 ${statusBadge.step >= 3 ? 'text-[#3498DB]' : 'text-gray-500'}`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold ${statusBadge.step >= 3 ? 'bg-[#3498DB] text-black shadow-[0_0_8px_rgba(52,152,219,0.4)] animate-bounce' : 'bg-[#222] text-gray-500'}`}>
                        {statusBadge.step >= 3 ? '🚚' : '3'}
                      </div>
                      <span className="font-semibold text-gray-200">Out For Delivery</span>
                    </div>

                    {/* Step 4: Delivered */}
                    <div className={`flex flex-col items-center gap-1 ${statusBadge.step >= 4 ? 'text-[#2ECC71]' : 'text-gray-500'}`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold ${statusBadge.step >= 4 ? 'bg-[#2ECC71] text-black shadow-[0_0_8px_rgba(46,204,113,0.4)]' : 'bg-[#222] text-gray-500'}`}>
                        {statusBadge.step >= 4 ? '✓' : '4'}
                      </div>
                      <span className="font-semibold text-gray-200">Delivered</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Tracking Updates History */}
              {activeOrder.trackingUpdates && activeOrder.trackingUpdates.length > 0 && (
                <div className="space-y-2 p-3 rounded-lg bg-[#141414] border border-[#222]">
                  <span className="text-[11px] font-bold text-[#E5C158] uppercase tracking-wider block">
                    Latest Activity Logs
                  </span>
                  <div className="space-y-1.5 text-xs">
                    {activeOrder.trackingUpdates.map((update, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-gray-300">
                        <span className="text-[#D4AF37] font-bold">•</span>
                        <span className="text-gray-400 text-[11px] min-w-[70px]">{update.timestamp}</span>
                        <span className="text-gray-200 text-xs">{update.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Items in this order */}
              <div className="space-y-3">
                <h4 className="font-royal text-xs font-bold text-[#E5C158] uppercase tracking-wider">
                  Ordered Items ({activeOrder.items ? activeOrder.items.length : 0})
                </h4>
                <div className="space-y-2">
                  {activeOrder.items && activeOrder.items.map((it: any, i: number) => {
                    const itemName = it.productName || it.name || 'Gourmet Selection';
                    const itemImg = it.productImage || it.image || '';
                    const itemQty = it.quantity || 1;
                    const itemPrice = it.price || 0;

                    return (
                      <div key={i} className="flex items-center justify-between p-2.5 rounded bg-[#161616] text-xs">
                        <div className="flex items-center gap-3">
                          {itemImg ? (
                            <img 
                              src={itemImg} 
                              alt={itemName} 
                              className="w-10 h-10 rounded object-cover bg-black border border-[#333]" 
                              referrerPolicy="no-referrer" 
                            />
                          ) : (
                            <div className="w-10 h-10 rounded bg-[#222] border border-[#333] flex items-center justify-center text-[#D4AF37]">
                              📦
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-gray-200">{itemName}</p>
                            <p className="text-[10px] text-gray-400">
                              Qty: {itemQty} {it.variantName && `• ${it.variantName}`}
                            </p>
                          </div>
                        </div>
                        <span className="font-royal font-bold text-[#E5C158]">₹{itemPrice * itemQty}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Address & Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-[#252525]">
                <div className="space-y-1 text-gray-300">
                  <span className="font-bold text-[#E5C158] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" /> Delivery Destination:
                  </span>
                  {activeOrder.shippingAddress ? (
                    <>
                      <p className="font-semibold text-white">{activeOrder.shippingAddress.fullName}</p>
                      <p>{activeOrder.shippingAddress.addressLine1}</p>
                      {activeOrder.shippingAddress.addressLine2 && <p>{activeOrder.shippingAddress.addressLine2}</p>}
                      <p>{activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.postalCode}</p>
                      <p className="text-[#D4AF37]">📞 {activeOrder.shippingAddress.phone}</p>
                    </>
                  ) : (
                    <p className="text-gray-400 italic">Discreet Express Delivery</p>
                  )}
                </div>

                <div className="space-y-1 text-gray-300">
                  <span className="font-bold text-[#E5C158] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" /> Payment & Verification:
                  </span>
                  <p>
                    Method: <strong className="uppercase text-white">
                      {activeOrder.paymentMethod === 'upi' ? 'Direct UPI / Bank Transfer' : (activeOrder.paymentMethod || 'Online')}
                    </strong>
                  </p>
                  <p>
                    Payment Status:{' '}
                    <span className={`font-bold uppercase ${statusBadge.isAwaiting ? 'text-amber-400' : 'text-[#2ECC71]'}`}>
                      {statusBadge.isAwaiting ? 'Under Progress' : (activeOrder.paymentStatus || 'Completed')}
                    </span>
                  </p>
                  {activeOrder.upiTransactionId && (
                    <p className="text-[11px]">
                      UTR: <span className="font-mono text-[#E5C158] font-bold">{activeOrder.upiTransactionId}</span>
                    </p>
                  )}
                  {activeOrder.upiVerifiedByAdmin && (
                    <p className="text-[11px] text-[#2ECC71] font-semibold">
                      ✓ Verified by {activeOrder.upiVerifiedBy || 'Admin'}
                    </p>
                  )}
                  <p>Packaging: <span className="text-[#E5C158] font-semibold">100% Odorless Discreet Gold Box</span></p>
                  <p className="pt-1 font-royal font-extrabold text-sm text-[#E5C158]">
                    Grand Total: ₹{getOrderTotal(activeOrder)}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-2 justify-end">
                <button
                  onClick={() => showToast(`Invoice for Order #${activeOrder.orderNumber || activeOrder.id} sent to your email!`, 'success')}
                  className="px-3 py-1.5 rounded-lg bg-[#181818] border border-[#333] hover:border-[#D4AF37] text-gray-300 hover:text-[#D4AF37] text-xs flex items-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Download Invoice</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setCurrentPage('shop');
                    showToast('Items ready for quick re-order!', 'info');
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-[#D4AF37] text-black font-royal font-bold text-xs hover:brightness-110 flex items-center gap-1.5 shadow"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Buy Again</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-[#121212] rounded-xl border border-[#252525] text-gray-400 text-xs">
              Select an order on the left to track live status.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
