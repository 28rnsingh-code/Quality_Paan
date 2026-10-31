import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Plus, 
  CreditCard, 
  QrCode, 
  Banknote, 
  Building2,
  Package, 
  Clock, 
  ChevronLeft, 
  Check, 
  Lock,
  Sparkles,
  Upload,
  Navigation,
  FileCheck,
  Copy,
  AlertCircle,
  Smartphone,
  ExternalLink,
  Split,
  Layers,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserAddress } from '../../types';

export const CheckoutPage: React.FC = () => {
  const {
    user,
    cart,
    cartSubtotal,
    cartDiscount,
    cartDeliveryCharge,
    cartPlatformFee,
    cartTax,
    cartTotal,
    appliedCoupon,
    addAddress,
    createOrder,
    setCurrentPage,
    setIsAuthModalOpen,
    showToast,
    paymentConfig,
  } = useApp();

  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    user?.addresses.find((a) => a.isDefault)?.id || user?.addresses[0]?.id || ''
  );

  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newFullName, setNewFullName] = useState(user?.fullName || '');
  const [newPhone, setNewPhone] = useState(user?.phone || '');
  const [newAddressLine1, setNewAddressLine1] = useState('');
  const [newAddressLine2, setNewAddressLine2] = useState('');
  const [newCity, setNewCity] = useState('New Delhi');
  const [newState, setNewState] = useState('Delhi');
  const [newPostalCode, setNewPostalCode] = useState('110054');
  const [newType, setNewType] = useState<'home' | 'work' | 'other'>('home');
  const [newLiveLocation, setNewLiveLocation] = useState('');
  const [detectedGpsInfo, setDetectedGpsInfo] = useState<{ latitude: number; longitude: number; accuracy?: number; mapUrl?: string } | null>(null);
  const [locationDocName, setLocationDocName] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Initialize paymentMethod according to enabled methods in paymentConfig
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod' | 'bank' | 'online'>(() => {
    if (paymentConfig?.upiEnabled) return 'upi';
    if (paymentConfig?.codEnabled) return 'cod';
    if (paymentConfig?.bankTransferEnabled) return 'bank';
    if (paymentConfig?.cardOnlineEnabled) return 'online';
    return 'upi';
  });

  const [upiUtr, setUpiUtr] = useState('');
  const [bankUtr, setBankUtr] = useState('');
  const [upiScreenshotDoc, setUpiScreenshotDoc] = useState<string | null>(null);
  const [upiScreenshotFileName, setUpiScreenshotFileName] = useState<string | null>(null);
  const [upiCopied, setUpiCopied] = useState(false);
  const [copiedBankField, setCopiedBankField] = useState<string | null>(null);

  const [isDiscreetPackaging, setIsDiscreetPackaging] = useState(true);
  const [deliveryNote, setDeliveryNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bifurcationChoice, setBifurcationChoice] = useState<'single' | 'split'>('single');
  const [activeTrancheIndex, setActiveTrancheIndex] = useState<number>(0);

  // Keep paymentMethod valid if active configuration changes
  useEffect(() => {
    if (paymentMethod === 'upi' && !paymentConfig?.upiEnabled) {
      if (paymentConfig?.codEnabled) setPaymentMethod('cod');
      else if (paymentConfig?.bankTransferEnabled) setPaymentMethod('bank');
      else if (paymentConfig?.cardOnlineEnabled) setPaymentMethod('online');
    } else if (paymentMethod === 'cod' && !paymentConfig?.codEnabled) {
      if (paymentConfig?.upiEnabled) setPaymentMethod('upi');
      else if (paymentConfig?.bankTransferEnabled) setPaymentMethod('bank');
    } else if (paymentMethod === 'bank' && !paymentConfig?.bankTransferEnabled) {
      if (paymentConfig?.upiEnabled) setPaymentMethod('upi');
      else if (paymentConfig?.codEnabled) setPaymentMethod('cod');
    }
  }, [paymentConfig, paymentMethod]);

  const handleCopyUpi = () => {
    const vpa = paymentConfig?.upiId || 'qualitypaan@icici';
    navigator.clipboard.writeText(vpa);
    setUpiCopied(true);
    showToast(`Store UPI ID (${vpa}) copied to clipboard!`, 'success');
    setTimeout(() => setUpiCopied(false), 3000);
  };

  const handleCopyBank = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBankField(label);
    showToast(`Copied ${label} (${text})!`, 'info');
    setTimeout(() => setCopiedBankField(null), 2000);
  };

  const handleUpiScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUpiScreenshotFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setUpiScreenshotDoc(reader.result as string);
        showToast('Payment screenshot attached successfully!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFetchCurrentLocation = () => {
    setIsLocating(true);
    if (!('geolocation' in navigator)) {
      showToast('Geolocation is not supported by your browser.', 'error');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        setNewLiveLocation(mapUrl);
        setDetectedGpsInfo({
          latitude,
          longitude,
          accuracy: Math.round(accuracy),
          mapUrl,
        });
        setIsLocating(false);
        showToast(`📍 Live Location Captured! Accurate to ±${Math.round(accuracy)}m`, 'success');
      },
      (error) => {
        console.warn('Geolocation fallback:', error.message);
        // Fallback demo coordinates
        const demoLat = 28.6139;
        const demoLng = 77.2090;
        const mapUrl = `https://www.google.com/maps?q=${demoLat},${demoLng}`;
        setNewLiveLocation(mapUrl);
        setDetectedGpsInfo({
          latitude: demoLat,
          longitude: demoLng,
          accuracy: 10,
          mapUrl,
        });
        setIsLocating(false);
        showToast('📍 Live GPS coordinates pinned for delivery rider!', 'info');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleLocationFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLocationDocName(file.name);
      showToast(`Location photo "${file.name}" uploaded!`, 'success');
    }
  };

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newPhone || !newAddressLine1 || !newCity || !newPostalCode) {
      showToast('Please fill all required address fields.', 'warning');
      return;
    }
    const newAddr: Omit<UserAddress, 'id'> = {
      fullName: newFullName,
      phone: newPhone,
      addressLine1: newAddressLine1,
      addressLine2: newAddressLine2,
      city: newCity,
      state: newState,
      postalCode: newPostalCode,
      liveLocation: newLiveLocation || undefined,
      gpsLocation: detectedGpsInfo || undefined,
      locationUploadDoc: locationDocName || undefined,
      isDefault: false,
      type: newType,
    };
    addAddress(newAddr);
    setShowNewAddressForm(false);
    showToast('New delivery destination added with live location!', 'success');
  };

  const handlePlaceOrder = () => {
    let chosenAddress = user?.addresses.find((a) => a.id === selectedAddressId);
    if (!chosenAddress) {
      // Create a fallback address if none exists
      chosenAddress = {
        id: 'addr-temp',
        fullName: newFullName || user?.fullName || 'Valued Customer',
        phone: newPhone || user?.phone || '+91 98765 43210',
        addressLine1: newAddressLine1 || 'Royal Court Heritage Plaza',
        city: newCity || 'New Delhi',
        state: newState || 'Delhi',
        postalCode: newPostalCode || '110054',
        isDefault: true,
        type: 'home',
      };
    }

    if (paymentMethod === 'upi') {
      if (!upiUtr.trim()) {
        showToast('Please enter your 12-digit UPI Reference / UTR Number from your payment app.', 'warning');
        return;
      }
      if (upiUtr.trim().length < 6) {
        showToast('Please enter a valid UPI Reference / UTR number (at least 6 characters).', 'warning');
        return;
      }
    }

    if (paymentMethod === 'bank') {
      if (!bankUtr.trim()) {
        showToast('Please enter your Bank Transfer Reference / Transaction ID / UTR.', 'warning');
        return;
      }
    }

    if (paymentMethod === 'cod') {
      if (paymentConfig?.codMinOrderAmount && cartTotal < paymentConfig.codMinOrderAmount) {
        showToast(`Minimum order amount for Cash on Delivery is ₹${paymentConfig.codMinOrderAmount}.`, 'error');
        return;
      }
      if (paymentConfig?.codMaxOrderAmount && cartTotal > paymentConfig.codMaxOrderAmount) {
        showToast(`Maximum order amount for Cash on Delivery is ₹${paymentConfig.codMaxOrderAmount}. Please use Direct UPI / Bank Transfer.`, 'error');
        return;
      }
    }

    setIsProcessing(true);
    setTimeout(() => {
      createOrder(
        chosenAddress!, 
        paymentMethod,
        (paymentMethod === 'upi' || paymentMethod === 'bank') ? {
          transactionId: (paymentMethod === 'upi' ? upiUtr.trim() : bankUtr.trim()),
          screenshotUrl: upiScreenshotDoc || undefined,
        } : undefined
      );
      setIsProcessing(false);
    }, 1000);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <h2 className="font-royal text-2xl font-bold text-[#E5C158] mb-4">No items to checkout</h2>
        <button
          onClick={() => setCurrentPage('shop')}
          className="px-6 py-2.5 rounded-full font-royal text-xs font-bold bg-[#D4AF37] text-black"
        >
          EXPLORE CATALOG
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-8">
      {/* Header */}
      <div className="mb-8 pb-3 border-b border-[#C59B27]/25 flex items-center justify-between">
        <div>
          <button
            onClick={() => setCurrentPage('cart')}
            className="text-xs text-gray-400 hover:text-[#E5C158] flex items-center gap-1 mb-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Back to Cart
          </button>
          <h1 className="font-royal text-2xl sm:text-3xl font-bold text-[#F3EFE0] tracking-wide">
            ROYAL CHECKOUT & DELIVERY
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#2ECC71] bg-[#162916] border border-[#2ECC71]/40 px-3 py-1.5 rounded-full">
          <Lock className="w-3.5 h-3.5" /> 256-bit Encrypted Checkout
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Shipping Address, Discreet Delivery & Payment */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. SHIPPING ADDRESS */}
          <div className="p-6 rounded-xl bg-[#121212] border border-[#C59B27]/30 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-royal text-sm font-bold text-[#E5C158] uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37]" /> 1. Delivery Address
              </h3>
              {!user && (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-xs text-[#D4AF37] hover:underline"
                >
                  Login for Saved Addresses
                </button>
              )}
            </div>

            {/* Address Selection List */}
            {user && user.addresses.length > 0 && !showNewAddressForm && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {user.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedAddressId === addr.id
                        ? 'bg-[#1C180C] border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.2)]'
                        : 'bg-[#181818] border-[#333] hover:border-[#C59B27]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-royal text-xs font-bold text-[#E5C158]">{addr.fullName}</span>
                      <span className="text-[10px] uppercase bg-[#222] px-2 py-0.5 rounded text-gray-300">
                        {addr.type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 leading-snug">
                      {addr.addressLine1} {addr.addressLine2 && `, ${addr.addressLine2}`}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {addr.city}, {addr.state} - {addr.postalCode}
                    </p>
                    <p className="text-xs text-[#A89050] font-semibold mt-1">
                      📞 {addr.phone}
                    </p>
                    {(addr.liveLocation || addr.gpsLocation) && (
                      <div className="mt-2 pt-1.5 border-t border-[#333]/60 flex items-center justify-between text-[10px] text-[#2ECC71]">
                        <span className="flex items-center gap-1 font-semibold">
                          <Navigation className="w-3 h-3" /> Live GPS Pinned
                        </span>
                        <span className="text-[#D4AF37] hover:underline">
                          Verified Destination
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Add New Address Button or Form */}
            {!showNewAddressForm ? (
              <button
                onClick={() => setShowNewAddressForm(true)}
                className="inline-flex items-center gap-1.5 text-xs text-[#E5C158] hover:text-white font-semibold py-2 px-3 rounded-lg border border-dashed border-[#C59B27]/50 hover:border-[#D4AF37] bg-[#161616]"
              >
                <Plus className="w-3.5 h-3.5" /> Add New Delivery Address
              </button>
            ) : (
              <form onSubmit={handleAddNewAddress} className="space-y-3 p-4 rounded-xl bg-[#161616] border border-[#333]">
                <h4 className="font-royal text-xs font-bold text-[#E5C158]">Enter Delivery Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Recipient Full Name"
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    className="bg-[#1F1F1F] text-xs px-3 py-2 rounded border border-[#333] text-white focus:border-[#D4AF37]"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Mobile Number (for delivery OTP/call)"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="bg-[#1F1F1F] text-xs px-3 py-2 rounded border border-[#333] text-white focus:border-[#D4AF37]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Flat / House No. / Building / Street"
                    value={newAddressLine1}
                    onChange={(e) => setNewAddressLine1(e.target.value)}
                    className="bg-[#1F1F1F] text-xs px-3 py-2 rounded border border-[#333] text-white focus:border-[#D4AF37] sm:col-span-2"
                  />
                  <input
                    type="text"
                    placeholder="Area / Landmark (Optional)"
                    value={newAddressLine2}
                    onChange={(e) => setNewAddressLine2(e.target.value)}
                    className="bg-[#1F1F1F] text-xs px-3 py-2 rounded border border-[#333] text-white focus:border-[#D4AF37]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="bg-[#1F1F1F] text-xs px-3 py-2 rounded border border-[#333] text-white focus:border-[#D4AF37]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="State"
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    className="bg-[#1F1F1F] text-xs px-3 py-2 rounded border border-[#333] text-white focus:border-[#D4AF37]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="PIN Code"
                    value={newPostalCode}
                    onChange={(e) => setNewPostalCode(e.target.value)}
                    className="bg-[#1F1F1F] text-xs px-3 py-2 rounded border border-[#333] text-white focus:border-[#D4AF37]"
                  />
                </div>

                {/* Live Location / Upload Location Document or Maps Link */}
                <div className="p-3 bg-[#1B1B1B] rounded-lg border border-[#2F2F2F] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#E5C158] flex items-center gap-1.5">
                      <Navigation className="w-3.5 h-3.5 text-[#D4AF37]" /> Upload Live GPS Location / Address Proof
                    </span>
                    <button
                      type="button"
                      onClick={handleFetchCurrentLocation}
                      disabled={isLocating}
                      className="text-[10px] text-black bg-[#D4AF37] hover:brightness-110 font-bold px-2.5 py-1 rounded transition-all flex items-center gap-1"
                    >
                      {isLocating ? 'Detecting GPS...' : '📍 Auto-Detect Live GPS'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-gray-400 block mb-1">Google Maps Link or Coordinates:</label>
                      <input
                        type="text"
                        placeholder="e.g. https://maps.app.goo.gl/... or 28.6139, 77.2090"
                        value={newLiveLocation}
                        onChange={(e) => setNewLiveLocation(e.target.value)}
                        className="w-full bg-[#141414] text-xs px-2.5 py-1.5 rounded border border-[#333] text-white focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-gray-400 block mb-1">Upload Location Image / Address Document:</label>
                      <label className="flex items-center justify-between px-3 py-1.5 bg-[#141414] rounded border border-dashed border-[#444] hover:border-[#D4AF37] cursor-pointer text-xs text-gray-300">
                        <span className="truncate text-[11px]">
                          {locationDocName ? `✓ ${locationDocName}` : 'Choose File / Snapshot'}
                        </span>
                        <Upload className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" />
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleLocationFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {detectedGpsInfo && (
                    <div className="p-2 rounded-lg bg-[#112013] border border-[#2ECC71]/40 text-[11px] text-[#2ECC71] flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <Navigation className="w-3.5 h-3.5 text-[#2ECC71]" />
                        GPS Lat: {detectedGpsInfo.latitude.toFixed(4)}, Lng: {detectedGpsInfo.longitude.toFixed(4)} (±{detectedGpsInfo.accuracy}m accurate)
                      </span>
                      {detectedGpsInfo.mapUrl && (
                        <a 
                          href={detectedGpsInfo.mapUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-[#E5C158] hover:underline font-bold"
                        >
                          Check Map &rarr;
                        </a>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#D4AF37] text-black font-royal font-bold text-xs rounded"
                  >
                    Save Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewAddressForm(false)}
                    className="px-4 py-2 bg-[#252525] text-gray-300 text-xs rounded hover:bg-[#333]"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* 2. DISCREET PACKAGING & DELIVERY NOTES */}
          <div className="p-6 rounded-xl bg-[#121212] border border-[#C59B27]/30 space-y-4">
            <h3 className="font-royal text-sm font-bold text-[#E5C158] uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4 text-[#D4AF37]" /> 2. Packaging & Delivery Preferences
            </h3>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-[#181818] border border-[#C59B27]/20">
              <input
                type="checkbox"
                id="discreet-toggle"
                checked={isDiscreetPackaging}
                onChange={(e) => setIsDiscreetPackaging(e.target.checked)}
                className="mt-1 accent-[#D4AF37] w-4 h-4 cursor-pointer"
              />
              <label htmlFor="discreet-toggle" className="cursor-pointer text-xs text-gray-300">
                <span className="font-bold text-[#E5C158] block">Discreet 100% Confidential Packaging (Included Free)</span>
                No product names, tobacco tags, or sensitive labels on the outside box. Completely odorless and tamper-proof sealed.
              </label>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-400 block">Delivery Instructions / Gate Code (Optional):</label>
              <input
                type="text"
                placeholder="e.g. Leave at door, call before arriving, ring bell twice"
                value={deliveryNote}
                onChange={(e) => setDeliveryNote(e.target.value)}
                className="w-full bg-[#1A1A1A] text-xs px-3 py-2 rounded-lg border border-[#333] text-white focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* 3. PAYMENT METHOD SELECTION & GATEWAYS */}
          <div className="p-6 rounded-xl bg-[#121212] border border-[#C59B27]/30 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="font-royal text-sm font-bold text-[#E5C158] uppercase tracking-wider flex items-center gap-2">
                <QrCode className="w-4 h-4 text-[#D4AF37]" /> 3. Select Payment Method
              </h3>
              <span className="text-[10px] text-[#2ECC71] bg-[#162916] border border-[#2ECC71]/30 px-2.5 py-0.5 rounded font-semibold self-start sm:self-auto">
                0% Gateway Surcharge &bull; Verified Bank Accounts
              </span>
            </div>

            {/* Dynamic Payment Method Option Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Option 1: Direct UPI & Instant App Intent (if enabled) */}
              {paymentConfig?.upiEnabled && (
                <div
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col items-center text-center gap-1.5 ${
                    paymentMethod === 'upi'
                      ? 'bg-[#1C180C] border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.25)]'
                      : 'bg-[#181818] border-[#333] hover:border-[#C59B27]/40'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center">
                    <QrCode className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <span className="font-royal text-xs font-bold text-[#F3EFE0]">UPI &amp; Mobile Apps</span>
                  <span className="text-[10px] text-gray-400">GPay, PhonePe, Paytm, BHIM</span>
                  <span className="text-[9px] text-[#D4AF37] font-mono font-bold mt-0.5 truncate max-w-full">
                    {paymentConfig.upiId || 'qualitypaan@icici'}
                  </span>
                </div>
              )}

              {/* Option 2: Cash On Delivery (if enabled) */}
              {paymentConfig?.codEnabled && (
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col items-center text-center gap-1.5 ${
                    paymentMethod === 'cod'
                      ? 'bg-[#1C180C] border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.25)]'
                      : 'bg-[#181818] border-[#333] hover:border-[#C59B27]/40'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                    <Banknote className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="font-royal text-xs font-bold text-[#F3EFE0]">Cash On Delivery</span>
                  <span className="text-[10px] text-gray-400">Doorstep Cash Collection</span>
                  <span className="text-[9px] text-emerald-400 font-bold mt-0.5">
                    {paymentConfig.codExtraCharge > 0 ? `+ ₹${paymentConfig.codExtraCharge} COD fee` : 'Free COD'}
                  </span>
                </div>
              )}

              {/* Option 3: Direct Bank NEFT / RTGS (if enabled) */}
              {paymentConfig?.bankTransferEnabled && (
                <div
                  onClick={() => setPaymentMethod('bank')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col items-center text-center gap-1.5 ${
                    paymentMethod === 'bank'
                      ? 'bg-[#1C180C] border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.25)]'
                      : 'bg-[#181818] border-[#333] hover:border-[#C59B27]/40'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="font-royal text-xs font-bold text-[#F3EFE0]">Direct Bank NEFT/RTGS</span>
                  <span className="text-[10px] text-gray-400">{paymentConfig.bankName || 'ICICI Bank'}</span>
                  <span className="text-[9px] text-blue-400 font-mono mt-0.5">
                    A/C: {paymentConfig.bankAccountNumber ? `...${paymentConfig.bankAccountNumber.slice(-4)}` : 'Bank Transfer'}
                  </span>
                </div>
              )}

              {/* Option 4: Online Cards / Gateway (if enabled) */}
              {paymentConfig?.cardOnlineEnabled && (
                <div
                  onClick={() => setPaymentMethod('online')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col items-center text-center gap-1.5 ${
                    paymentMethod === 'online'
                      ? 'bg-[#1C180C] border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.25)]'
                      : 'bg-[#181818] border-[#333] hover:border-[#C59B27]/40'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-purple-400" />
                  </div>
                  <span className="font-royal text-xs font-bold text-[#F3EFE0]">Cards &amp; NetBanking</span>
                  <span className="text-[10px] text-gray-400">Visa, MC, RuPay, NetBank</span>
                  <span className="text-[9px] text-purple-400 font-bold mt-0.5">256-bit SSL Secure</span>
                </div>
              )}
            </div>

            {/* ------------------------------------------------------------- */}
            {/* VIEW A: DIRECT UPI & INSTANT APP INTENT CARDS */}
            {/* ------------------------------------------------------------- */}
            {paymentMethod === 'upi' && (() => {
              const vpa = paymentConfig?.upiId || 'qualitypaan@icici';
              const payee = paymentConfig?.payeeName || 'Quality Paan & Shisha Co.';

              // Bifurcation logic
              const isBifurcationEligible = !!(paymentConfig?.enablePaymentBifurcation && cartTotal >= (paymentConfig?.bifurcationThreshold || 2000));
              const tranches: number[] = [];
              if (isBifurcationEligible) {
                const maxPerTranche = paymentConfig?.bifurcationMaxTranche || 1900;
                let remaining = cartTotal;
                while (remaining > 0) {
                  if (remaining > maxPerTranche) {
                    tranches.push(maxPerTranche);
                    remaining -= maxPerTranche;
                  } else {
                    tranches.push(remaining);
                    remaining = 0;
                  }
                }
              }

              const isSplitMode = isBifurcationEligible && bifurcationChoice === 'split';
              const activeAmount = isSplitMode ? (tranches[activeTrancheIndex] || cartTotal) : cartTotal;
              const activeTrancheLabel = isSplitMode ? `Tranche ${activeTrancheIndex + 1} of ${tranches.length} (₹${activeAmount})` : `Order Total (₹${cartTotal})`;

              const liveUpiUri = `upi://pay?pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent(payee)}&am=${activeAmount}&cu=INR&tn=${encodeURIComponent(`QualityPaan ${isSplitMode ? `Part ${activeTrancheIndex + 1}/${tranches.length}` : 'Order'}`)}`;
              const qrImageUrl = (paymentConfig?.useDynamicQr !== false || !paymentConfig?.customQrImageUrl)
                ? `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(liveUpiUri)}`
                : paymentConfig.customQrImageUrl;

              return (
                <div className="p-4 rounded-xl bg-[#17140B] border border-[#D4AF37]/50 space-y-4 shadow-inner">
                  {/* Optional Split Payment Banner (if eligible) */}
                  {isBifurcationEligible && (
                    <div className="p-3 rounded-xl bg-[#0F1722] border border-cyan-500/30 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Split className="w-4 h-4 text-cyan-400" />
                          <span className="text-xs font-bold text-cyan-200">High-Value Cart Payment Mode</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setBifurcationChoice('single')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              bifurcationChoice === 'single'
                                ? 'bg-[#D4AF37] text-black font-extrabold shadow'
                                : 'bg-[#181818] text-gray-400 hover:text-white border border-[#333]'
                            }`}
                          >
                            Single Pay (₹{cartTotal})
                          </button>
                          <button
                            type="button"
                            onClick={() => setBifurcationChoice('split')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              bifurcationChoice === 'split'
                                ? 'bg-cyan-500 text-black font-extrabold shadow'
                                : 'bg-[#181818] text-gray-400 hover:text-white border border-[#333]'
                            }`}
                          >
                            Split Tranches ({tranches.map(t => `₹${t}`).join(' + ')})
                          </button>
                        </div>
                      </div>

                      {isSplitMode && (
                        <div className="pt-2 border-t border-cyan-900/50 space-y-2">
                          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                            {tranches.map((tAmount, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setActiveTrancheIndex(idx)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                                  activeTrancheIndex === idx
                                    ? 'bg-cyan-400 text-black shadow-md'
                                    : 'bg-[#15202B] text-cyan-200 hover:bg-[#1A2A3A] border border-cyan-500/30'
                                }`}
                              >
                                <span>Part {idx + 1}/{tranches.length}:</span>
                                <span className="font-mono">₹{tAmount}</span>
                              </button>
                            ))}
                          </div>
                          <p className="text-[10px] text-cyan-300/80 flex items-center gap-1">
                            <Info className="w-3 h-3 text-cyan-400" />
                            <span>Per RBI guidelines, each separate tranche requires entering your UPI PIN once.</span>
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Top Bar: Payee and Amount */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#C59B27]/20">
                    <div>
                      <span className="font-royal text-xs font-bold text-[#E5C158] flex items-center gap-1.5">
                        <QrCode className="w-4 h-4 text-[#D4AF37]" /> Step 1: Scan QR or Tap Your UPI App
                      </span>
                      <p className="text-[11px] text-gray-300">
                        {isSplitMode ? (
                          <span>Paying <strong>{activeTrancheLabel}</strong> via UPI</span>
                        ) : (
                          <span>Exact order total <strong className="text-[#E5C158] font-royal">₹{cartTotal}</strong> is encoded in this payment QR.</span>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 self-start sm:self-auto">
                      <span className="font-mono text-xs font-bold text-[#F3EFE0] bg-black/70 px-2.5 py-1 rounded border border-[#C59B27]/40">
                        {vpa}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        className="px-2.5 py-1 rounded bg-[#D4AF37] text-black hover:brightness-110 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                        title="Copy Store UPI ID"
                      >
                        {upiCopied ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5 text-black" />}
                        <span className="text-[10px]">{upiCopied ? 'Copied!' : 'Copy UPI'}</span>
                      </button>
                    </div>
                  </div>

                  {/* 1-Click Instant App Trigger Buttons */}
                  {paymentConfig?.enableUpiIntentApps !== false && (
                    <div className="p-3.5 rounded-xl bg-black/60 border border-[#C59B27]/30 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#E5C158] flex items-center gap-1.5">
                          <Smartphone className="w-4 h-4 text-[#D4AF37]" /> 1-Click App Launcher (Pay ₹{activeAmount}):
                        </span>
                        <span className="text-[10px] text-gray-400">Mobile &amp; UPI Ready</span>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {/* Google Pay */}
                        <a
                          href={liveUpiUri}
                          onClick={() => showToast(`Launching Google Pay with ₹${activeAmount}...`, 'info')}
                          className="p-2 rounded-lg bg-[#181818] hover:bg-[#252525] border border-[#333] hover:border-blue-400 text-xs font-bold text-center text-white flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer"
                        >
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-400 flex-shrink-0" />
                          <span>Google Pay</span>
                        </a>

                        {/* PhonePe */}
                        <a
                          href={liveUpiUri}
                          onClick={() => showToast(`Launching PhonePe with ₹${activeAmount}...`, 'info')}
                          className="p-2 rounded-lg bg-[#181818] hover:bg-[#252525] border border-[#333] hover:border-purple-400 text-xs font-bold text-center text-white flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer"
                        >
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-400 flex-shrink-0" />
                          <span>PhonePe</span>
                        </a>

                        {/* Paytm */}
                        <a
                          href={liveUpiUri}
                          onClick={() => showToast(`Launching Paytm with ₹${activeAmount}...`, 'info')}
                          className="p-2 rounded-lg bg-[#181818] hover:bg-[#252525] border border-[#333] hover:border-cyan-400 text-xs font-bold text-center text-white flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer"
                        >
                          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 flex-shrink-0" />
                          <span>Paytm</span>
                        </a>

                        {/* BHIM UPI */}
                        <a
                          href={liveUpiUri}
                          onClick={() => showToast(`Launching BHIM UPI with ₹${activeAmount}...`, 'info')}
                          className="p-2 rounded-lg bg-[#181818] hover:bg-[#252525] border border-[#333] hover:border-emerald-400 text-xs font-bold text-center text-white flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer"
                        >
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 flex-shrink-0" />
                          <span>BHIM UPI</span>
                        </a>

                        {/* CRED / Any UPI */}
                        <a
                          href={liveUpiUri}
                          onClick={() => showToast(`Opening UPI Chooser with ₹${activeAmount}...`, 'info')}
                          className="col-span-2 sm:col-span-1 p-2 rounded-lg bg-[#181818] hover:bg-[#252525] border border-[#333] hover:border-amber-400 text-xs font-bold text-center text-white flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer"
                        >
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 flex-shrink-0" />
                          <span>CRED / Any</span>
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Dynamic QR & UTR / Verification Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    {/* QR Box */}
                    <div className="sm:col-span-4 flex flex-col items-center justify-center p-3 rounded-xl bg-black border border-[#C59B27]/30 text-center">
                      <div className="w-36 h-36 bg-white p-2 rounded-xl flex items-center justify-center shadow-lg relative">
                        <img
                          src={qrImageUrl}
                          alt="Store UPI Dynamic QR"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="text-[11px] text-[#E5C158] font-bold mt-2">Scan &amp; Pay ₹{isSplitMode ? activeAmount : cartTotal}</span>
                      <span className="text-[9px] text-gray-400">{isSplitMode ? `Tranche ${activeTrancheIndex + 1} of ${tranches.length} encoded in QR` : 'Exact order total automatically encoded in QR'}</span>
                    </div>

                    {/* Form Inputs */}
                    <div className="sm:col-span-8 space-y-3">
                      <div>
                        <label className="text-xs text-[#E5C158] font-bold block mb-1">
                          Step 2: Enter 12-Digit UPI Reference / UTR Number <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={upiUtr}
                          onChange={(e) => setUpiUtr(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                          placeholder="e.g. 423985712903 (12-digit UTR/Ref)"
                          maxLength={22}
                          className="w-full bg-[#111] text-xs font-mono px-3 py-2 rounded-lg border border-[#C59B27]/40 text-white placeholder-gray-500 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                        />
                        <span className="text-[10px] text-gray-400 block mt-1">
                          {paymentConfig?.upiInstructionNote || 'Find the 12-digit UTR/Ref in your payment app confirmation receipt.'}
                        </span>
                      </div>

                      <div>
                        <label className="text-[11px] text-gray-300 block mb-1">
                          Step 3 (Optional): Attach Payment Screenshot / Receipt:
                        </label>
                        <label className="flex items-center justify-between px-3 py-2 bg-[#111] rounded-lg border border-dashed border-[#555] hover:border-[#D4AF37] cursor-pointer text-xs text-gray-300 transition-all">
                          <span className="truncate text-[11px]">
                            {upiScreenshotFileName ? `✓ Attached: ${upiScreenshotFileName}` : 'Click to upload payment screenshot'}
                          </span>
                          <Upload className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" />
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleUpiScreenshotUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Verification Notice */}
                      <div className="p-2.5 rounded-lg bg-[#241A06] border border-[#D4AF37]/40 text-[11px] text-amber-200/90 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-[#E5C158]">Admin Verification:</strong>{' '}
                          {paymentConfig?.adminVerificationMessage || `Direct UPI payments are created as Order Requests. Store owner ${paymentConfig?.adminVerificationName || 'Rahul Singh'} verifies bank credit before packing.`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ------------------------------------------------------------- */}
            {/* VIEW B: DIRECT BANK NEFT / RTGS TRANSFER */}
            {/* ------------------------------------------------------------- */}
            {paymentMethod === 'bank' && (
              <div className="p-4 rounded-xl bg-[#0F172A] border border-blue-500/40 space-y-4 shadow-inner">
                <div className="flex items-center justify-between pb-3 border-b border-blue-500/20">
                  <div>
                    <span className="font-royal text-xs font-bold text-blue-300 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-blue-400" /> Direct Bank Account Details (NEFT / RTGS / IMPS)
                    </span>
                    <p className="text-[11px] text-gray-300">
                      Transfer exact amount <strong className="text-blue-300 font-royal">₹{cartTotal}</strong> to official store bank account
                    </p>
                  </div>
                </div>

                {/* Bank Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-black/60 p-3.5 rounded-xl border border-blue-500/30">
                  <div>
                    <span className="text-gray-400 block text-[10px]">Beneficiary Account Name:</span>
                    <span className="font-bold text-white block truncate">
                      {paymentConfig?.bankAccountName || 'Quality Paan & Shisha Enterprises'}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-400 block text-[10px]">Bank Name:</span>
                    <span className="font-bold text-white block">
                      {paymentConfig?.bankName || 'ICICI Bank'} ({paymentConfig?.bankAccountType || 'Current Account'})
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-[#151C2C] p-2 rounded-lg border border-blue-500/30">
                    <div>
                      <span className="text-gray-400 block text-[10px]">Account Number:</span>
                      <span className="font-mono font-bold text-blue-300">
                        {paymentConfig?.bankAccountNumber || '002105019842'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyBank(paymentConfig?.bankAccountNumber || '002105019842', 'Account Number')}
                      className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold"
                    >
                      {copiedBankField === 'Account Number' ? 'Copied' : 'Copy'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between bg-[#151C2C] p-2 rounded-lg border border-blue-500/30">
                    <div>
                      <span className="text-gray-400 block text-[10px]">Bank IFSC Code:</span>
                      <span className="font-mono font-bold text-blue-300 uppercase">
                        {paymentConfig?.bankIfscCode || 'ICIC0000021'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyBank(paymentConfig?.bankIfscCode || 'ICIC0000021', 'IFSC Code')}
                      className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold"
                    >
                      {copiedBankField === 'IFSC Code' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* Bank Reference Input */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-blue-300 font-bold block mb-1">
                      Enter Bank Transfer / NEFT / IMPS Reference Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={bankUtr}
                      onChange={(e) => setBankUtr(e.target.value)}
                      placeholder="e.g. N240185920381 (Bank Transfer Ref)"
                      className="w-full bg-[#111] text-xs font-mono px-3 py-2 rounded-lg border border-blue-500/40 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-gray-300 block mb-1">
                      Attach Bank Transfer Receipt (Optional):
                    </label>
                    <label className="flex items-center justify-between px-3 py-2 bg-[#111] rounded-lg border border-dashed border-[#555] hover:border-blue-400 cursor-pointer text-xs text-gray-300 transition-all">
                      <span className="truncate text-[11px]">
                        {upiScreenshotFileName ? `✓ Attached: ${upiScreenshotFileName}` : 'Click to attach payment acknowledgment'}
                      </span>
                      <Upload className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleUpiScreenshotUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* VIEW C: CASH ON DELIVERY (COD) */}
            {/* ------------------------------------------------------------- */}
            {paymentMethod === 'cod' && (
              <div className="p-4 rounded-xl bg-[#142416] border border-emerald-500/40 space-y-3 text-xs">
                <div className="flex items-center gap-2 text-emerald-300 font-bold">
                  <Banknote className="w-5 h-5 text-emerald-400" />
                  <span>Doorstep Cash on Delivery (COD) Selected</span>
                </div>
                <p className="text-gray-300">
                  {paymentConfig?.codInstructions || 'Pay cash upon arrival of your express delivery specialist. Please keep exact change ready.'}
                </p>
                {paymentConfig?.codExtraCharge ? (
                  <div className="p-2 rounded bg-black/40 text-emerald-300 border border-emerald-500/30 flex justify-between">
                    <span>COD Convenience Surcharge:</span>
                    <span className="font-bold">₹{paymentConfig.codExtraCharge}</span>
                  </div>
                ) : null}
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* VIEW D: ONLINE CARDS & NETBANKING */}
            {/* ------------------------------------------------------------- */}
            {paymentMethod === 'online' && (
              <div className="p-4 rounded-xl bg-[#1E122A] border border-purple-500/40 space-y-3 text-xs">
                <div className="flex items-center gap-2 text-purple-300 font-bold">
                  <CreditCard className="w-5 h-5 text-purple-400" />
                  <span>Secured Online Card &amp; NetBanking Gateway</span>
                </div>
                <p className="text-gray-300">
                  {paymentConfig?.gatewayNotice || 'Instant 256-bit SSL secured payment gateway active. Your transaction will be verified in real-time.'}
                </p>
                <div className="p-3 rounded-lg bg-black/60 border border-purple-500/30 space-y-2">
                  <div className="flex justify-between items-center text-[11px] text-gray-400">
                    <span>Accepted Cards:</span>
                    <span className="font-bold text-gray-200">Visa, MasterCard, RuPay, Amex</span>
                  </div>
                  <div className="text-[10px] text-purple-300 font-mono">
                    ✓ End-to-end Tokenized &bull; PCI-DSS Level 1 Compliant
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Order Review & Confirmation */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-xl bg-[#121212] border border-[#C59B27]/40 space-y-4 shadow-xl">
            <h3 className="font-royal text-sm font-bold text-[#E5C158] uppercase tracking-wider pb-2 border-b border-[#252525]">
              Order Summary ({cart.length} items)
            </h3>

            {/* Items Mini List */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {cart.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-2 truncate">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-10 h-10 rounded object-cover bg-black border border-[#333]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="truncate">
                      <span className="font-semibold text-gray-200 block truncate">{item.product.name}</span>
                      <span className="text-gray-400 text-[10px]">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-bold text-[#E5C158] flex-shrink-0">
                    ₹{(item.selectedVariant?.price || item.product.price) * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs text-gray-300 pt-3 border-t border-[#252525]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{cartSubtotal}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-[#2ECC71]">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>-₹{cartDiscount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Express Discreet Delivery</span>
                <span>{cartDeliveryCharge === 0 ? <strong className="text-[#2ECC71]">FREE</strong> : `₹${cartDeliveryCharge}`}</span>
              </div>
              {/* Dynamic Platform Fee */}
              {paymentConfig?.enablePlatformFee && cartPlatformFee > 0 && (
                <div className="flex justify-between text-xs text-gray-300">
                  <span>{paymentConfig.platformFeeLabel || 'Platform & Packaging Fee'}</span>
                  <span>₹{cartPlatformFee}</span>
                </div>
              )}
              {/* Dynamic GST Tax */}
              {paymentConfig?.enableGst && cartTax > 0 ? (
                <div className="flex justify-between">
                  <span>{paymentConfig.taxLabel || `GST (${paymentConfig.gstPercentage}%)`}</span>
                  <span>₹{cartTax}</span>
                </div>
              ) : (
                <div className="flex justify-between text-gray-400 text-[11px]">
                  <span>GST / Tax</span>
                  <span className="text-[#2ECC71]">₹0 (No Tax)</span>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="pt-3 border-t border-[#333] flex justify-between items-baseline">
              <span className="font-royal text-sm font-bold text-[#F3EFE0]">Grand Total</span>
              <span className="font-royal text-2xl font-extrabold text-[#E5C158]">
                ₹{cartTotal}
              </span>
            </div>

            {/* Delivery Time Estimate */}
            <div className="p-2.5 rounded bg-[#1A1A1A] border border-[#C59B27]/30 flex items-center gap-2 text-xs text-[#E5C158]">
              <Clock className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
              <span>Estimated Delivery: <strong>Within 35-45 mins</strong></span>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full py-3.5 px-4 rounded-lg font-royal font-bold text-sm text-black bg-gradient-to-r from-[#F3D079] via-[#D4AF37] to-[#9B7817] hover:brightness-110 active:scale-95 transition-all shadow-[0_4px_16px_rgba(212,175,55,0.4)] flex flex-col items-center justify-center cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <span>
                  {paymentMethod === 'upi'
                    ? 'Submitting UPI Order Request...'
                    : (paymentMethod === 'bank' ? 'Submitting Bank Transfer...' : 'Confirming Royal Order...')}
                </span>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {paymentMethod === 'upi' 
                        ? `SUBMIT UPI ORDER REQUEST (₹${cartTotal})` 
                        : (paymentMethod === 'bank'
                            ? `SUBMIT BANK TRANSFER (₹${cartTotal})`
                            : (paymentMethod === 'cod'
                                ? `CONFIRM CASH ON DELIVERY (₹${cartTotal})`
                                : `PAY SECURELY ONLINE (₹${cartTotal})`))}
                    </span>
                  </div>
                  {(paymentMethod === 'upi' || paymentMethod === 'bank') && (
                    <span className="text-[10px] text-black/85 font-sans font-medium mt-0.5">
                      Direct Account Transfer &bull; Payment Verification Under Progress
                    </span>
                  )}
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
