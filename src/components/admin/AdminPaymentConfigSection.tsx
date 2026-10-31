import React, { useState, useEffect, useRef } from 'react';
import { 
  CreditCard, 
  QrCode, 
  Banknote, 
  Building2, 
  Save, 
  Check, 
  Copy, 
  Eye, 
  Upload, 
  AlertCircle, 
  ShieldCheck, 
  Smartphone, 
  Sparkles, 
  RefreshCw, 
  HelpCircle,
  ToggleLeft,
  ToggleRight,
  Sliders,
  DollarSign,
  Percent,
  Truck,
  MapPin,
  Split,
  Layers,
  Lock,
  ArrowRight,
  CheckCircle2,
  Info,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useApp, safeSetItem } from '../../context/AppContext';
import { PaymentConfig } from '../../types';
import { ImageUploadField } from './ImageUploadField';
import { ConfirmModal } from '../common/ConfirmModal';

export const AdminPaymentConfigSection: React.FC = () => {
  const { paymentConfig, updatePaymentConfig, showToast } = useApp();
  const [formData, setFormData] = useState<PaymentConfig>(paymentConfig);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [testAmount, setTestAmount] = useState<number>(500);
  const [activeSubTab, setActiveSubTab] = useState<'upi' | 'charges' | 'bifurcation' | 'bank' | 'cod' | 'cards' | 'policy'>('upi');
  const [isSavedRecently, setIsSavedRecently] = useState(false);
  const [savedTabName, setSavedTabName] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Tabs Horizontal Scroll Ref & Function
  const paymentTabsRef = useRef<HTMLDivElement>(null);
  const scrollPaymentTabs = (direction: 'left' | 'right') => {
    if (paymentTabsRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      paymentTabsRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Keep local form in sync with context when initial load or external update happens
  useEffect(() => {
    if (paymentConfig) {
      setFormData(prev => ({ ...prev, ...paymentConfig }));
    }
  }, [paymentConfig]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    showToast(`Copied ${label} to clipboard!`, 'info');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSave = (tabName?: string) => {
    // 1. Direct local storage write for instant zero-latency persistence
    safeSetItem('qp_payment_config_v2', JSON.stringify(formData));

    // 2. Update context state
    updatePaymentConfig(formData);
    
    // 3. Visual feedback
    setIsSavedRecently(true);
    setSavedTabName(tabName || 'Settings');
    showToast(tabName ? `${tabName} saved successfully!` : 'Payment & Pricing Configuration Saved Successfully!', 'success');
    
    setTimeout(() => {
      setIsSavedRecently(false);
      setSavedTabName(null);
    }, 3000);
  };

  const executeResetToDefault = () => {
    const defaultConfig: PaymentConfig = {
      upiEnabled: true,
      upiId: 'qualitypaan@icici',
      payeeName: 'Quality Paan & Shisha Co.',
      merchantCode: '5812',
      useDynamicQr: true,
      customQrImageUrl: '',
      enableUpiIntentApps: true,
      upiInstructionNote: 'Scan & pay exact cart total via any UPI app (Google Pay, PhonePe, Paytm, BHIM, CRED). Enter 12-digit UTR/Ref number after completing transfer.',
      bankTransferEnabled: true,
      bankAccountName: 'Quality Paan & Shisha Enterprises',
      bankName: 'ICICI Bank',
      bankAccountNumber: '002105019842',
      bankIfscCode: 'ICIC0000021',
      bankBranch: 'Connaught Place, New Delhi',
      bankAccountType: 'Current Account',
      codEnabled: true,
      codExtraCharge: 0,
      codMinOrderAmount: 0,
      codMaxOrderAmount: 15000,
      codInstructions: 'Pay cash upon arrival of delivery partner. Please keep exact change ready.',
      cardOnlineEnabled: true,
      gatewayMode: 'live',
      gatewayNotice: 'Instant 256-bit SSL secured payment gateway active.',
      enableGst: false,
      gstPercentage: 0,
      taxLabel: 'GST / Tax',
      enablePlatformFee: false,
      platformFeeAmount: 0,
      platformFeeLabel: 'Platform & Packaging Fee',
      enableDeliveryCharge: false,
      baseDeliveryCharge: 0,
      freeDeliveryAboveAmount: 499,
      enableNearbyFreeDelivery: true,
      nearbyFreeDeliveryNote: 'Free express delivery for local and nearby orders',
      adminVerificationName: 'Rahul Singh',
      adminContactPhone: '+91 98765 43210',
      adminVerificationMessage: 'Direct UPI payments are created as Order Requests. Store owner Rahul Singh will verify bank credit before approving into Confirmed stage.',
      enablePaymentBifurcation: false,
      bifurcationThreshold: 2000,
      bifurcationMaxTranche: 1900,
      bifurcationNote: 'Split high-value orders into tranches under ₹2,000 to optimize interchange & banking fees.',
    };
    setFormData(defaultConfig);
    updatePaymentConfig(defaultConfig);
    safeSetItem('qp_payment_config_v2', JSON.stringify(defaultConfig));
    showToast('Reset to store default settings.', 'info');
  };

  // Generate dynamic UPI URI string for preview
  const liveUpiUri = `upi://pay?pa=${encodeURIComponent(formData.upiId || 'qualitypaan@icici')}&pn=${encodeURIComponent(formData.payeeName || 'Quality Paan')}&am=${testAmount}&cu=INR&tn=${encodeURIComponent('TestOrder')}`;
  const dynamicQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(liveUpiUri)}`;

  // Calculate bifurcation trenches for test simulation
  const calculateTranches = (total: number, maxPerTranche: number = 1900) => {
    const tranches: number[] = [];
    let remaining = total;
    while (remaining > 0) {
      if (remaining > maxPerTranche) {
        tranches.push(maxPerTranche);
        remaining -= maxPerTranche;
      } else {
        tranches.push(remaining);
        remaining = 0;
      }
    }
    return tranches;
  };

  const simulatedTranches = calculateTranches(testAmount, formData.bifurcationMaxTranche || 1900);

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#17140B] via-[#1A160A] to-[#121212] border border-[#D4AF37]/40 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center">
              <QrCode className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <h2 className="font-royal text-lg font-bold text-[#E5C158]">
              Payment System, GST &amp; Pricing Setup
            </h2>
          </div>
          <p className="text-xs text-gray-300 max-w-2xl">
            Configure UPI VPA, dynamic QR codes, 1-click app triggers (Google Pay, PhonePe, Paytm, BHIM, CRED), bank accounts, GST tax (on/off), platform fees, delivery charges, and payment bifurcation.
          </p>
        </div>

        {/* Global Save Button at Top */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleSave()}
            className={`px-5 py-2.5 rounded-xl font-royal font-bold text-xs text-black transition-all active:scale-95 flex items-center gap-2 cursor-pointer whitespace-nowrap shadow-lg ${
              isSavedRecently 
                ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-black ring-2 ring-emerald-300' 
                : 'bg-gradient-to-r from-[#F3D079] via-[#D4AF37] to-[#B38C1B] hover:brightness-110'
            }`}
          >
            {isSavedRecently ? <Check className="w-4 h-4 text-black stroke-[3]" /> : <Save className="w-4 h-4" />}
            <span>{isSavedRecently ? `${savedTabName || 'CONFIG'} SAVED ✓` : 'SAVE CONFIGURATION'}</span>
          </button>
        </div>
      </div>

      {/* Main Payment Gateway Sub-Tabs with Scroll Chevrons */}
      <div className="relative flex items-center gap-1.5 w-full border-b border-[#2A2A2A] pb-2">
        {/* Scroll Left Button */}
        <button
          type="button"
          onClick={() => scrollPaymentTabs('left')}
          className="flex-shrink-0 p-2 rounded-xl bg-[#161616] border border-[#C59B27]/40 hover:border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all shadow-md active:scale-95 flex items-center justify-center cursor-pointer z-10"
          title="Scroll tabs left"
          aria-label="Scroll tabs left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scrollable Subtabs Container */}
        <div 
          ref={paymentTabsRef}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth flex-1 py-0.5"
        >
          {/* 1. UPI */}
          <button
            type="button"
            onClick={() => setActiveSubTab('upi')}
            className={`px-4 py-2 rounded-xl text-xs font-royal font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'upi'
                ? 'bg-[#D4AF37] text-black shadow-md font-extrabold'
                : 'bg-[#151515] text-gray-300 hover:text-white border border-[#2E2E2E]'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>UPI &amp; Apps ({formData.upiEnabled ? 'ON' : 'OFF'})</span>
          </button>

          {/* 2. GST & CHARGES */}
          <button
            type="button"
            onClick={() => setActiveSubTab('charges')}
            className={`px-4 py-2 rounded-xl text-xs font-royal font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'charges'
                ? 'bg-[#D4AF37] text-black shadow-md font-extrabold ring-2 ring-[#D4AF37]/50'
                : 'bg-[#1A1608] text-amber-300 hover:text-white border border-amber-500/40'
            }`}
          >
            <Percent className="w-3.5 h-3.5 text-amber-400" />
            <span>GST Tax, Platform Fee &amp; Delivery</span>
          </button>

          {/* 3. BIFURCATION / SPLIT TRANCHES */}
          <button
            type="button"
            onClick={() => setActiveSubTab('bifurcation')}
            className={`px-4 py-2 rounded-xl text-xs font-royal font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'bifurcation'
                ? 'bg-[#D4AF37] text-black shadow-md font-extrabold'
                : 'bg-[#151515] text-gray-300 hover:text-white border border-[#2E2E2E]'
            }`}
          >
            <Split className="w-3.5 h-3.5 text-cyan-400" />
            <span>Payment Bifurcation ({formData.enablePaymentBifurcation ? 'ON' : 'OFF'})</span>
          </button>

          {/* 4. BANK */}
          <button
            type="button"
            onClick={() => setActiveSubTab('bank')}
            className={`px-4 py-2 rounded-xl text-xs font-royal font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'bank'
                ? 'bg-[#D4AF37] text-black shadow-md font-extrabold'
                : 'bg-[#151515] text-gray-300 hover:text-white border border-[#2E2E2E]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Bank NEFT / RTGS ({formData.bankTransferEnabled ? 'ON' : 'OFF'})</span>
          </button>

          {/* 5. COD */}
          <button
            type="button"
            onClick={() => setActiveSubTab('cod')}
            className={`px-4 py-2 rounded-xl text-xs font-royal font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'cod'
                ? 'bg-[#D4AF37] text-black shadow-md font-extrabold'
                : 'bg-[#151515] text-gray-300 hover:text-white border border-[#2E2E2E]'
            }`}
          >
            <Banknote className="w-3.5 h-3.5" />
            <span>COD ({formData.codEnabled ? 'ON' : 'OFF'})</span>
          </button>

          {/* 6. CARDS */}
          <button
            type="button"
            onClick={() => setActiveSubTab('cards')}
            className={`px-4 py-2 rounded-xl text-xs font-royal font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'cards'
                ? 'bg-[#D4AF37] text-black shadow-md font-extrabold'
                : 'bg-[#151515] text-gray-300 hover:text-white border border-[#2E2E2E]'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Cards Gateway ({formData.cardOnlineEnabled ? 'ON' : 'OFF'})</span>
          </button>

          {/* 7. POLICY */}
          <button
            type="button"
            onClick={() => setActiveSubTab('policy')}
            className={`px-4 py-2 rounded-xl text-xs font-royal font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'policy'
                ? 'bg-[#D4AF37] text-black shadow-md font-extrabold'
                : 'bg-[#151515] text-gray-300 hover:text-white border border-[#2E2E2E]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verification Policy</span>
          </button>
        </div>

        {/* Scroll Right Button */}
        <button
          type="button"
          onClick={() => scrollPaymentTabs('right')}
          className="flex-shrink-0 p-2 rounded-xl bg-[#161616] border border-[#C59B27]/40 hover:border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all shadow-md active:scale-95 flex items-center justify-center cursor-pointer z-10"
          title="Scroll tabs right"
          aria-label="Scroll tabs right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Settings Body */}
      <div className="space-y-6">
        {/* ========================================================================= */}
        {/* SUBTAB 1: UPI & APP INTENT CONFIGURATION */}
        {/* ========================================================================= */}
        {activeSubTab === 'upi' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Col: UPI Parameters */}
            <div className="lg:col-span-7 space-y-5 p-5 rounded-2xl bg-[#121212] border border-[#2D2D2D]">
              <div className="flex items-center justify-between pb-3 border-b border-[#252525]">
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-[#D4AF37]" />
                  <div>
                    <h3 className="font-royal text-sm font-bold text-white">
                      UPI &amp; Instant App Settings
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      Standard NPCI UPI Protocol for direct bank transfers &amp; app triggers
                    </p>
                  </div>
                </div>

                {/* Master UPI Switch */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <span className="text-xs font-bold text-gray-300">
                    {formData.upiEnabled ? 'Enabled on Checkout' : 'Hidden from Checkout'}
                  </span>
                  <input
                    type="checkbox"
                    checked={formData.upiEnabled}
                    onChange={(e) => setFormData({ ...formData, upiEnabled: e.target.checked })}
                    className="sr-only"
                  />
                  <div className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 cursor-pointer ${
                    formData.upiEnabled ? 'bg-[#D4AF37] justify-end' : 'bg-[#333] justify-start'
                  }`}>
                    <div className="bg-black w-4 h-4 rounded-full shadow-md transform" />
                  </div>
                </label>
              </div>

              {/* UPI ID (VPA) */}
              <div>
                <label className="text-xs text-[#E5C158] font-bold block mb-1">
                  Store Primary UPI ID (VPA)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.upiId}
                    onChange={(e) => setFormData({ ...formData, upiId: e.target.value.trim().toLowerCase() })}
                    placeholder="e.g. qualitypaan@icici or 9876543210@paytm"
                    className="flex-1 bg-[#181818] font-mono text-xs px-3.5 py-2.5 rounded-xl border border-[#3A3A3A] focus:border-[#D4AF37] text-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopy(formData.upiId, 'UPI ID')}
                    className="px-3 py-2.5 rounded-xl bg-[#222] hover:bg-[#333] text-gray-300 border border-[#444] text-xs flex items-center gap-1 font-bold cursor-pointer"
                  >
                    {copiedField === 'UPI ID' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'UPI ID' ? 'Copied' : 'Test Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Payee / Business Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-300 font-bold block mb-1">
                    Payee Name / Merchant Business Name
                  </label>
                  <input
                    type="text"
                    value={formData.payeeName}
                    onChange={(e) => setFormData({ ...formData, payeeName: e.target.value })}
                    placeholder="e.g. Quality Paan & Shisha Co."
                    className="w-full bg-[#181818] text-xs px-3.5 py-2.5 rounded-xl border border-[#3A3A3A] focus:border-[#D4AF37] text-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-300 font-bold block mb-1">
                    Merchant Category Code (MCC)
                  </label>
                  <input
                    type="text"
                    value={formData.merchantCode || '5812'}
                    onChange={(e) => setFormData({ ...formData, merchantCode: e.target.value })}
                    placeholder="e.g. 5812"
                    className="w-full bg-[#181818] text-xs px-3.5 py-2.5 rounded-xl border border-[#3A3A3A] focus:border-[#D4AF37] text-white font-mono"
                  />
                </div>
              </div>

              {/* 1-Click App Launcher Apps Toggle */}
              <div className="p-3.5 rounded-xl bg-[#171717] border border-[#333] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-xs font-bold text-white">
                      1-Click Instant UPI App Launcher Buttons
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.enableUpiIntentApps}
                    onChange={(e) => setFormData({ ...formData, enableUpiIntentApps: e.target.checked })}
                    className="w-4 h-4 accent-[#D4AF37] cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-gray-400">
                  When enabled, customers see 1-click buttons for Google Pay, PhonePe, Paytm, BHIM, and CRED that automatically push the cart total into the app.
                </p>
              </div>

              {/* Dynamic QR vs Custom Static Uploaded QR */}
              <div className="space-y-3">
                <label className="text-xs text-gray-300 font-bold block">
                  QR Code Generation Strategy
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setFormData({ ...formData, useDynamicQr: true })}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      formData.useDynamicQr
                        ? 'bg-[#1E190A] border-[#D4AF37] text-white shadow-md'
                        : 'bg-[#181818] border-[#333] text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                      <span className="font-bold text-xs text-[#E5C158]">Auto-Dynamic QR (Recommended)</span>
                    </div>
                    <p className="text-[10px] text-gray-400">
                      Auto-encodes exact live cart total and order ref into the QR.
                    </p>
                  </div>

                  <div
                    onClick={() => setFormData({ ...formData, useDynamicQr: false })}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      !formData.useDynamicQr
                        ? 'bg-[#1E190A] border-[#D4AF37] text-white shadow-md'
                        : 'bg-[#181818] border-[#333] text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Upload className="w-4 h-4 text-[#D4AF37]" />
                      <span className="font-bold text-xs text-[#E5C158]">Custom Uploaded QR Image</span>
                    </div>
                    <p className="text-[10px] text-gray-400">
                      Displays a custom physical store merchant QR standee.
                    </p>
                  </div>
                </div>
              </div>

              {/* If Custom QR is selected */}
              {!formData.useDynamicQr && (
                <div className="p-4 rounded-xl bg-[#171717] border border-[#3A3A3A] space-y-3">
                  <label className="text-xs text-[#E5C158] font-bold block">
                    Upload Custom Store UPI Standee / QR Image
                  </label>
                  <ImageUploadField
                    label="Store UPI QR Code Image"
                    value={formData.customQrImageUrl || ''}
                    onChange={(url) => setFormData({ ...formData, customQrImageUrl: url })}
                    placeholder="https://... or upload custom bank QR"
                  />
                </div>
              )}

              {/* UPI Customer Guidance Text */}
              <div>
                <label className="text-xs text-gray-300 font-bold block mb-1">
                  Customer UPI Instructions Note
                </label>
                <textarea
                  rows={2}
                  value={formData.upiInstructionNote || ''}
                  onChange={(e) => setFormData({ ...formData, upiInstructionNote: e.target.value })}
                  placeholder="Instructions displayed under the UPI QR on checkout..."
                  className="w-full bg-[#181818] text-xs px-3.5 py-2 rounded-xl border border-[#3A3A3A] focus:border-[#D4AF37] text-white"
                />
              </div>

              {/* In-Tab Save Button */}
              <div className="pt-3 border-t border-[#252525] flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => handleSave('UPI Settings')}
                  className="px-6 py-2.5 rounded-xl font-royal font-bold text-xs text-black bg-gradient-to-r from-[#F3D079] via-[#D4AF37] to-[#B38C1B] hover:brightness-110 shadow-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save UPI Settings</span>
                </button>
              </div>
            </div>

            {/* Right Col: Live Interactive UPI QR Preview */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl bg-[#0F0F0F] border-2 border-[#D4AF37]/40 text-center space-y-4 shadow-2xl">
                <div className="flex items-center justify-between pb-2 border-b border-[#252525]">
                  <span className="font-royal text-xs font-bold text-[#E5C158] flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-[#D4AF37]" /> Interactive QR Preview
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                    <span>Sample Amount:</span>
                    <input
                      type="number"
                      value={testAmount}
                      onChange={(e) => setTestAmount(Math.max(1, Number(e.target.value)))}
                      className="w-20 bg-[#1A1A1A] px-1.5 py-0.5 rounded border border-[#444] text-white text-right font-bold text-xs"
                    />
                  </div>
                </div>

                {/* QR Display */}
                <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-black border border-[#C59B27]/40 shadow-inner">
                  <div className="w-44 h-44 bg-white p-2.5 rounded-xl shadow-lg relative flex items-center justify-center">
                    {formData.useDynamicQr || !formData.customQrImageUrl ? (
                      <img
                        src={dynamicQrUrl}
                        alt="Live Dynamic UPI QR"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <img
                        src={formData.customQrImageUrl}
                        alt="Custom Store QR"
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                  <div className="mt-2 text-center space-y-0.5">
                    <p className="text-xs font-bold text-white">{formData.payeeName || 'Quality Shisha Co.'}</p>
                    <p className="font-mono text-xs text-[#E5C158] font-bold">{formData.upiId || 'qualitypaan@icici'}</p>
                    <p className="text-[11px] text-emerald-400 font-semibold mt-1">
                      Dynamic QR: Automatically encodes customer's exact order cart total
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBTAB 2: GST TAX, PLATFORM FEE & DELIVERY CHARGES */}
        {/* ========================================================================= */}
        {activeSubTab === 'charges' && (
          <div className="space-y-6">
            {/* 1. GST & TAX CONFIGURATION */}
            <div className="p-5 rounded-2xl bg-[#121212] border border-[#2D2D2D] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#252525]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
                    <Percent className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-royal text-sm font-bold text-white">
                      GST &amp; Government Tax Configuration
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      Enable or completely disable GST calculation from customer bills
                    </p>
                  </div>
                </div>

                {/* GST Master Switch */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <span className={`text-xs font-bold ${formData.enableGst ? 'text-amber-400' : 'text-gray-400'}`}>
                    {formData.enableGst ? 'GST Active on Bill' : 'GST Disabled (0% / No Tax)'}
                  </span>
                  <input
                    type="checkbox"
                    checked={formData.enableGst}
                    onChange={(e) => setFormData({ ...formData, enableGst: e.target.checked })}
                    className="sr-only"
                  />
                  <div className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 cursor-pointer ${
                    formData.enableGst ? 'bg-[#D4AF37] justify-end' : 'bg-[#333] justify-start'
                  }`}>
                    <div className="bg-black w-4 h-4 rounded-full shadow-md transform" />
                  </div>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-300 font-bold block mb-1">
                    GST Tax Percentage (%)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="28"
                      disabled={!formData.enableGst}
                      value={formData.gstPercentage}
                      onChange={(e) => setFormData({ ...formData, gstPercentage: Number(e.target.value) })}
                      className="w-full bg-[#181818] text-xs px-3.5 py-2.5 rounded-xl border border-[#3A3A3A] focus:border-[#D4AF37] text-white disabled:opacity-50"
                    />
                    <span className="text-xs text-gray-400 font-bold">%</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {formData.enableGst 
                      ? `Customers will be charged ${formData.gstPercentage}% tax on taxable cart total.`
                      : 'GST is currently DISABLED. Customer bills show ₹0 tax.'}
                  </p>
                </div>

                <div>
                  <label className="text-xs text-gray-300 font-bold block mb-1">
                    Tax Line Item Label
                  </label>
                  <input
                    type="text"
                    disabled={!formData.enableGst}
                    value={formData.taxLabel || 'GST (5%)'}
                    onChange={(e) => setFormData({ ...formData, taxLabel: e.target.value })}
                    placeholder="e.g. GST (5%) or Government Taxes"
                    className="w-full bg-[#181818] text-xs px-3.5 py-2.5 rounded-xl border border-[#3A3A3A] focus:border-[#D4AF37] text-white disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            {/* 2. PLATFORM & CONVENIENCE FEE */}
            <div className="p-5 rounded-2xl bg-[#121212] border border-[#2D2D2D] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#252525]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-royal text-sm font-bold text-white">
                      Platform &amp; Convenience Fee
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      Charge a custom platform, handling, or gold-seal packaging fee whenever desired
                    </p>
                  </div>
                </div>

                {/* Platform Fee Switch */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <span className={`text-xs font-bold ${formData.enablePlatformFee ? 'text-emerald-400' : 'text-gray-400'}`}>
                    {formData.enablePlatformFee ? `Active (+₹${formData.platformFeeAmount || 0})` : 'Disabled (₹0)'}
                  </span>
                  <input
                    type="checkbox"
                    checked={formData.enablePlatformFee}
                    onChange={(e) => setFormData({ ...formData, enablePlatformFee: e.target.checked })}
                    className="sr-only"
                  />
                  <div className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 cursor-pointer ${
                    formData.enablePlatformFee ? 'bg-[#D4AF37] justify-end' : 'bg-[#333] justify-start'
                  }`}>
                    <div className="bg-black w-4 h-4 rounded-full shadow-md transform" />
                  </div>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-300 font-bold block mb-1">
                    Platform Fee Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="500"
                    disabled={!formData.enablePlatformFee}
                    value={formData.platformFeeAmount}
                    onChange={(e) => setFormData({ ...formData, platformFeeAmount: Number(e.target.value) })}
                    className="w-full bg-[#181818] text-xs px-3.5 py-2.5 rounded-xl border border-[#3A3A3A] focus:border-[#D4AF37] text-white disabled:opacity-50"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    Fixed fee added to orders (e.g. ₹5, ₹10, or ₹20).
                  </p>
                </div>

                <div>
                  <label className="text-xs text-gray-300 font-bold block mb-1">
                    Platform Fee Display Label
                  </label>
                  <input
                    type="text"
                    disabled={!formData.enablePlatformFee}
                    value={formData.platformFeeLabel || 'Platform & Packaging Fee'}
                    onChange={(e) => setFormData({ ...formData, platformFeeLabel: e.target.value })}
                    placeholder="e.g. Platform & Handling Fee"
                    className="w-full bg-[#181818] text-xs px-3.5 py-2.5 rounded-xl border border-[#3A3A3A] focus:border-[#D4AF37] text-white disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            {/* 3. DELIVERY CHARGES & NEARBY RULES */}
            <div className="p-5 rounded-2xl bg-[#121212] border border-[#2D2D2D] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#252525]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center">
                    <Truck className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-royal text-sm font-bold text-white">
                      Delivery Charges &amp; Free Shipping Thresholds
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      Configure base shipping, order value waivers, and local radius delivery rules
                    </p>
                  </div>
                </div>

                {/* Delivery Master Switch */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <span className={`text-xs font-bold ${formData.enableDeliveryCharge ? 'text-blue-400' : 'text-gray-400'}`}>
                    {formData.enableDeliveryCharge ? 'Delivery Charges Active' : 'Free Delivery for All (₹0)'}
                  </span>
                  <input
                    type="checkbox"
                    checked={formData.enableDeliveryCharge}
                    onChange={(e) => setFormData({ ...formData, enableDeliveryCharge: e.target.checked })}
                    className="sr-only"
                  />
                  <div className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 cursor-pointer ${
                    formData.enableDeliveryCharge ? 'bg-[#D4AF37] justify-end' : 'bg-[#333] justify-start'
                  }`}>
                    <div className="bg-black w-4 h-4 rounded-full shadow-md transform" />
                  </div>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-300 font-bold block mb-1">
                    Standard Base Delivery Fee (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="500"
                    disabled={!formData.enableDeliveryCharge}
                    value={formData.baseDeliveryCharge}
                    onChange={(e) => setFormData({ ...formData, baseDeliveryCharge: Number(e.target.value) })}
                    className="w-full bg-[#181818] text-xs px-3.5 py-2.5 rounded-xl border border-[#3A3A3A] focus:border-[#D4AF37] text-white disabled:opacity-50"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Charged on orders below the free shipping threshold.</p>
                </div>

                <div>
                  <label className="text-xs text-gray-300 font-bold block mb-1">
                    Free Delivery on Orders Above (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    disabled={!formData.enableDeliveryCharge}
                    value={formData.freeDeliveryAboveAmount}
                    onChange={(e) => setFormData({ ...formData, freeDeliveryAboveAmount: Number(e.target.value) })}
                    className="w-full bg-[#181818] text-xs px-3.5 py-2.5 rounded-xl border border-[#3A3A3A] focus:border-[#D4AF37] text-white disabled:opacity-50"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Orders above this cart subtotal get FREE delivery automatically.</p>
                </div>

                <div>
                  <label className="text-xs text-gray-300 font-bold block mb-1">
                    Nearby / Local Order Delivery
                  </label>
                  <div className="p-2.5 rounded-xl bg-[#181818] border border-[#333] flex items-center justify-between">
                    <span className="text-xs text-gray-300 font-bold">Free for Local Radius</span>
                    <input
                      type="checkbox"
                      checked={formData.enableNearbyFreeDelivery}
                      onChange={(e) => setFormData({ ...formData, enableNearbyFreeDelivery: e.target.checked })}
                      className="w-4 h-4 accent-[#D4AF37] cursor-pointer"
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">Complimentary delivery for nearby / local radius.</p>
                </div>
              </div>

              {/* In-Tab Save Button */}
              <div className="pt-4 border-t border-[#252525] flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => handleSave('GST & Fee Settings')}
                  className="px-6 py-2.5 rounded-xl font-royal font-bold text-xs text-black bg-gradient-to-r from-[#F3D079] via-[#D4AF37] to-[#B38C1B] hover:brightness-110 shadow-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save GST, Fee &amp; Delivery Settings</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBTAB 3: PAYMENT BIFURCATION & SPLIT TRANCHES */}
        {/* ========================================================================= */}
        {activeSubTab === 'bifurcation' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-[#121212] border border-[#2D2D2D] space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#252525]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center">
                    <Split className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-royal text-sm font-bold text-white">
                      Payment Bifurcation &amp; Multi-Tranche Split Mode
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      Split high-value cart orders (e.g. ₹4,500) into tranches (e.g. ₹1,900 + ₹1,900 + ₹700) to optimize merchant interchange/banking limits
                    </p>
                  </div>
                </div>

                {/* Bifurcation Switch */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <span className={`text-xs font-bold ${formData.enablePaymentBifurcation ? 'text-cyan-400' : 'text-gray-400'}`}>
                    {formData.enablePaymentBifurcation ? 'Bifurcation Mode Active' : 'Single Payment Only'}
                  </span>
                  <input
                    type="checkbox"
                    checked={formData.enablePaymentBifurcation}
                    onChange={(e) => setFormData({ ...formData, enablePaymentBifurcation: e.target.checked })}
                    className="sr-only"
                  />
                  <div className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 cursor-pointer ${
                    formData.enablePaymentBifurcation ? 'bg-cyan-500 justify-end' : 'bg-[#333] justify-start'
                  }`}>
                    <div className="bg-black w-4 h-4 rounded-full shadow-md transform" />
                  </div>
                </label>
              </div>

              {/* Crucial Banking & PIN Architecture Notice */}
              <div className="p-4 rounded-xl bg-[#0D1821] border border-cyan-500/30 text-xs text-gray-200 space-y-2">
                <div className="flex items-center gap-2 text-cyan-300 font-bold">
                  <Info className="w-4 h-4" />
                  <span>Important Banking &amp; NPCI UPI Architecture Rules:</span>
                </div>
                <p className="text-gray-300 leading-relaxed text-[11px]">
                  <strong>Do customers need to enter UPI PIN / MPIN 3 times for 3 tranches?</strong>
                  <br />
                  <strong>YES:</strong> Under RBI 2-Factor Authentication (2FA) and NPCI UPI core banking protocol, <em>each separate debit transaction is an independent financial instruction</em>. A single UPI PIN entry cannot authorize multiple separate debits behind the scenes.
                </p>
                <p className="text-gray-300 leading-relaxed text-[11px]">
                  When Bifurcation is enabled, the checkout screen neatly breaks down the payment into sequential 1-click tranches (e.g. <strong>Part 1 of 3: ₹1,900</strong> &rarr; <strong>Part 2 of 3: ₹1,900</strong> &rarr; <strong>Part 3 of 3: ₹700</strong>) allowing seamless execution with 1-click app triggers!
                </p>
              </div>

              {/* Bifurcation Threshold & Limits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-300 font-bold block mb-1">
                    Minimum Cart Total to Trigger Split (₹)
                  </label>
                  <input
                    type="number"
                    min="500"
                    step="100"
                    disabled={!formData.enablePaymentBifurcation}
                    value={formData.bifurcationThreshold || 2000}
                    onChange={(e) => setFormData({ ...formData, bifurcationThreshold: Number(e.target.value) })}
                    className="w-full bg-[#181818] text-xs px-3.5 py-2.5 rounded-xl border border-[#3A3A3A] focus:border-[#D4AF37] text-white disabled:opacity-50"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    Orders above this threshold will offer the split tranche option.
                  </p>
                </div>

                <div>
                  <label className="text-xs text-gray-300 font-bold block mb-1">
                    Maximum Amount Per Tranche (₹)
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="10000"
                    step="100"
                    disabled={!formData.enablePaymentBifurcation}
                    value={formData.bifurcationMaxTranche || 1900}
                    onChange={(e) => setFormData({ ...formData, bifurcationMaxTranche: Number(e.target.value) })}
                    className="w-full bg-[#181818] text-xs px-3.5 py-2.5 rounded-xl border border-[#3A3A3A] focus:border-[#D4AF37] text-white disabled:opacity-50"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    Recommended: ₹1,900 to stay under the ₹2,000 interchange threshold.
                  </p>
                </div>
              </div>

              {/* Live Tranche Simulation */}
              <div className="p-4 rounded-xl bg-[#171717] border border-[#333] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-royal text-xs font-bold text-[#E5C158] flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-cyan-400" /> Live Split Simulation Preview
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                    <span>Test Cart Amount:</span>
                    <input
                      type="number"
                      value={testAmount}
                      onChange={(e) => setTestAmount(Number(e.target.value))}
                      className="w-20 bg-[#111] px-2 py-0.5 rounded border border-[#555] text-white font-bold text-xs text-right"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {simulatedTranches.map((amount, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#1E1E1E] border border-cyan-500/40 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-cyan-300 font-bold">Tranche {idx + 1} of {simulatedTranches.length}</span>
                        <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded">UPI Push</span>
                      </div>
                      <div className="text-lg font-extrabold text-white font-mono">₹{amount}</div>
                      <div className="text-[10px] text-gray-400">Requires 1 UPI PIN authorization</div>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-emerald-400 font-semibold">
                  Total Split: {simulatedTranches.map(t => `₹${t}`).join(' + ')} = ₹{testAmount}
                </p>
              </div>

              {/* In-Tab Save Button */}
              <div className="pt-3 border-t border-[#252525] flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => handleSave('Bifurcation Settings')}
                  className="px-6 py-2.5 rounded-xl font-royal font-bold text-xs text-black bg-gradient-to-r from-[#F3D079] via-[#D4AF37] to-[#B38C1B] hover:brightness-110 shadow-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Bifurcation Settings</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBTAB 4: DIRECT BANK NEFT / RTGS CONFIGURATION */}
        {/* ========================================================================= */}
        {activeSubTab === 'bank' && (
          <div className="p-5 rounded-2xl bg-[#121212] border border-[#2D2D2D] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#252525]">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#D4AF37]" />
                <div>
                  <h3 className="font-royal text-sm font-bold text-white">
                    Direct Bank Transfer (NEFT / RTGS / IMPS)
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    For high-value bulk paan &amp; corporate party catering orders
                  </p>
                </div>
              </div>

              {/* Master Bank Switch */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <span className="text-xs font-bold text-gray-300">
                  {formData.bankTransferEnabled ? 'Enabled on Checkout' : 'Hidden from Checkout'}
                </span>
                <input
                  type="checkbox"
                  checked={formData.bankTransferEnabled}
                  onChange={(e) => setFormData({ ...formData, bankTransferEnabled: e.target.checked })}
                  className="sr-only"
                />
                <div className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 cursor-pointer ${
                  formData.bankTransferEnabled ? 'bg-[#D4AF37] justify-end' : 'bg-[#333] justify-start'
                }`}>
                  <div className="bg-black w-4 h-4 rounded-full shadow-md transform" />
                </div>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-300 font-bold block mb-1">
                  Beneficiary / Account Holder Name
                </label>
                <input
                  type="text"
                  value={formData.bankAccountName}
                  onChange={(e) => setFormData({ ...formData, bankAccountName: e.target.value })}
                  placeholder="e.g. Quality Paan & Shisha Enterprises"
                  className="w-full bg-[#181818] text-xs px-3.5 py-2.5 rounded-xl border border-[#3A3A3A] focus:border-[#D4AF37] text-white"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 font-bold block mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  placeholder="e.g. ICICI Bank / HDFC Bank / SBI"
                  className="w-full bg-[#181818] text-xs px-3.5 py-2.5 rounded-xl border border-[#3A3A3A] focus:border-[#D4AF37] text-white"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 font-bold block mb-1">
                  Bank Account Number
                </label>
                <input
                  type="text"
                  value={formData.bankAccountNumber}
                  onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value.replace(/\s+/g, '') })}
                  placeholder="e.g. 002105019842"
                  className="w-full bg-[#181818] font-mono text-xs px-3.5 py-2.5 rounded-xl border border-[#3A3A3A] focus:border-[#D4AF37] text-white"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 font-bold block mb-1">
                  Bank IFSC Code
                </label>
                <input
                  type="text"
                  value={formData.bankIfscCode}
                  onChange={(e) => setFormData({ ...formData, bankIfscCode: e.target.value.toUpperCase().trim() })}
                  placeholder="e.g. ICIC0000021"
                  className="w-full bg-[#181818] font-mono text-xs px-3.5 py-2.5 rounded-xl border border-[#3A3A3A] focus:border-[#D4AF37] text-white uppercase"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 font-bold block mb-1">
                  Branch Name &amp; City
                </label>
                <input
                  type="text"
                  value={formData.bankBranch}
                  onChange={(e) => setFormData({ ...formData, bankBranch: e.target.value })}
                  placeholder="e.g. Connaught Place, New Delhi"
                  className="w-full bg-[#181818] text-xs px-3.5 py-2.5 rounded-xl border border-[#3A3A3A] focus:border-[#D4AF37] text-white"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 font-bold block mb-1">
                  Account Type
                </label>
                <select
                  value={formData.bankAccountType}
                  onChange={(e) => setFormData({ ...formData, bankAccountType: e.target.value })}
                  className="w-full bg-[#181818] text-xs px-3.5 py-2.5 rounded-xl border border-[#3A3A3A] focus:border-[#D4AF37] text-white"
                >
                  <option value="Current Account">Current Account (Corporate / Business)</option>
                  <option value="Savings Account">Savings Account</option>
                  <option value="Cash Credit / Overdraft">Cash Credit / Overdraft</option>
                </select>
              </div>
            </div>

            {/* In-Tab Save Button */}
            <div className="pt-3 border-t border-[#252525] flex items-center justify-end">
              <button
                type="button"
                onClick={() => handleSave('Bank Transfer Settings')}
                className="px-6 py-2.5 rounded-xl font-royal font-bold text-xs text-black bg-gradient-to-r from-[#F3D079] via-[#D4AF37] to-[#B38C1B] hover:brightness-110 shadow-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Bank Account Details</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBTAB 5: CASH ON DELIVERY (COD) CONFIGURATION */}
        {/* ========================================================================= */}
        {activeSubTab === 'cod' && (
          <div className="p-5 rounded-2xl bg-[#121212] border border-[#2D2D2D] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#252525]">
              <div className="flex items-center gap-2">
                <Banknote className="w-5 h-5 text-[#D4AF37]" />
                <div>
                  <h3 className="font-royal text-sm font-bold text-white">
                    Cash On Delivery (COD) Rules &amp; Surcharges
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Doorstep cash collection upon arrival of express delivery specialist
                  </p>
                </div>
              </div>

              {/* Master COD Switch */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <span className="text-xs font-bold text-gray-300">
                  {formData.codEnabled ? 'Enabled on Checkout' : 'Hidden from Checkout'}
                </span>
                <input
                  type="checkbox"
                  checked={formData.codEnabled}
                  onChange={(e) => setFormData({ ...formData, codEnabled: e.target.checked })}
                  className="sr-only"
                />
                <div className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 cursor-pointer ${
                  formData.codEnabled ? 'bg-[#D4AF37] justify-end' : 'bg-[#333] justify-start'
                }`}>
                  <div className="bg-black w-4 h-4 rounded-full shadow-md transform" />
                </div>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-gray-300 font-bold block mb-1">
                  COD Handling Surcharge (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.codExtraCharge}
                  onChange={(e) => setFormData({ ...formData, codExtraCharge: Number(e.target.value) })}
                  className="w-full bg-[#181818] text-xs px-3.5 py-2.5 rounded-xl border border-[#3A3A3A] focus:border-[#D4AF37] text-white"
                />
                <p className="text-[10px] text-gray-400 mt-1">Set ₹0 for 100% Free COD.</p>
              </div>

              <div>
                <label className="text-xs text-gray-300 font-bold block mb-1">
                  Minimum Order for COD (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.codMinOrderAmount}
                  onChange={(e) => setFormData({ ...formData, codMinOrderAmount: Number(e.target.value) })}
                  className="w-full bg-[#181818] text-xs px-3.5 py-2.5 rounded-xl border border-[#3A3A3A] focus:border-[#D4AF37] text-white"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 font-bold block mb-1">
                  Maximum Order for COD (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.codMaxOrderAmount}
                  onChange={(e) => setFormData({ ...formData, codMaxOrderAmount: Number(e.target.value) })}
                  className="w-full bg-[#181818] text-xs px-3.5 py-2.5 rounded-xl border border-[#3A3A3A] focus:border-[#D4AF37] text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-300 font-bold block mb-1">
                COD Customer Notice / Instruction
              </label>
              <textarea
                rows={2}
                value={formData.codInstructions || ''}
                onChange={(e) => setFormData({ ...formData, codInstructions: e.target.value })}
                className="w-full bg-[#181818] text-xs px-3.5 py-2 rounded-xl border border-[#3A3A3A] focus:border-[#D4AF37] text-white"
              />
            </div>

            {/* In-Tab Save Button */}
            <div className="pt-3 border-t border-[#252525] flex items-center justify-end">
              <button
                type="button"
                onClick={() => handleSave('COD Settings')}
                className="px-6 py-2.5 rounded-xl font-royal font-bold text-xs text-black bg-gradient-to-r from-[#F3D079] via-[#D4AF37] to-[#B38C1B] hover:brightness-110 shadow-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save COD Configuration</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBTAB 6: ONLINE CARDS & NETBANKING GATEWAY */}
        {/* ========================================================================= */}
        {activeSubTab === 'cards' && (
          <div className="p-5 rounded-2xl bg-[#121212] border border-[#2D2D2D] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#252525]">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#D4AF37]" />
                <div>
                  <h3 className="font-royal text-sm font-bold text-white">
                    Debit / Credit Cards &amp; NetBanking Gateway
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Visa, MasterCard, RuPay, Maestro &amp; NetBanking
                  </p>
                </div>
              </div>

              {/* Master Cards Switch */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <span className="text-xs font-bold text-gray-300">
                  {formData.cardOnlineEnabled ? 'Enabled on Checkout' : 'Hidden from Checkout'}
                </span>
                <input
                  type="checkbox"
                  checked={formData.cardOnlineEnabled}
                  onChange={(e) => setFormData({ ...formData, cardOnlineEnabled: e.target.checked })}
                  className="sr-only"
                />
                <div className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 cursor-pointer ${
                  formData.cardOnlineEnabled ? 'bg-[#D4AF37] justify-end' : 'bg-[#333] justify-start'
                }`}>
                  <div className="bg-black w-4 h-4 rounded-full shadow-md transform" />
                </div>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-300 font-bold block mb-1">
                  Payment Gateway Environment Mode
                </label>
                <select
                  value={formData.gatewayMode}
                  onChange={(e) => setFormData({ ...formData, gatewayMode: e.target.value as any })}
                  className="w-full bg-[#181818] text-xs px-3.5 py-2.5 rounded-xl border border-[#3A3A3A] focus:border-[#D4AF37] text-white"
                >
                  <option value="live">Live Production (256-bit SSL Direct)</option>
                  <option value="test">Test Sandbox Mode</option>
                  <option value="maintenance">Under Scheduled Maintenance</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-300 font-bold block mb-1">
                  Customer Security Badge Notice
                </label>
                <input
                  type="text"
                  value={formData.gatewayNotice || ''}
                  onChange={(e) => setFormData({ ...formData, gatewayNotice: e.target.value })}
                  placeholder="e.g. 256-bit SSL Encrypted & RBI Guideline Compliant"
                  className="w-full bg-[#181818] text-xs px-3.5 py-2.5 rounded-xl border border-[#3A3A3A] focus:border-[#D4AF37] text-white"
                />
              </div>
            </div>

            {/* In-Tab Save Button */}
            <div className="pt-3 border-t border-[#252525] flex items-center justify-end">
              <button
                type="button"
                onClick={() => handleSave('Card Gateway Settings')}
                className="px-6 py-2.5 rounded-xl font-royal font-bold text-xs text-black bg-gradient-to-r from-[#F3D079] via-[#D4AF37] to-[#B38C1B] hover:brightness-110 shadow-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Cards Gateway</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBTAB 7: ADMIN VERIFICATION POLICY */}
        {/* ========================================================================= */}
        {activeSubTab === 'policy' && (
          <div className="p-5 rounded-2xl bg-[#121212] border border-[#2D2D2D] space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-[#252525]">
              <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
              <div>
                <h3 className="font-royal text-sm font-bold text-white">
                  Admin Verification &amp; Store Payment Policy
                </h3>
                <p className="text-[11px] text-gray-400">
                  Configure store manager details and messages displayed during payment verification
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-300 font-bold block mb-1">
                  Verifying Store Administrator Name
                </label>
                <input
                  type="text"
                  value={formData.adminVerificationName}
                  onChange={(e) => setFormData({ ...formData, adminVerificationName: e.target.value })}
                  placeholder="e.g. Rahul Singh"
                  className="w-full bg-[#181818] text-xs px-3.5 py-2.5 rounded-xl border border-[#3A3A3A] focus:border-[#D4AF37] text-white"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 font-bold block mb-1">
                  Store Payment Support WhatsApp / Phone
                </label>
                <input
                  type="text"
                  value={formData.adminContactPhone}
                  onChange={(e) => setFormData({ ...formData, adminContactPhone: e.target.value })}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full bg-[#181818] text-xs px-3.5 py-2.5 rounded-xl border border-[#3A3A3A] focus:border-[#D4AF37] text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-300 font-bold block mb-1">
                Admin Verification Notice (Shown on Checkout Screen)
              </label>
              <textarea
                rows={3}
                value={formData.adminVerificationMessage || ''}
                onChange={(e) => setFormData({ ...formData, adminVerificationMessage: e.target.value })}
                className="w-full bg-[#181818] text-xs px-3.5 py-2 rounded-xl border border-[#3A3A3A] focus:border-[#D4AF37] text-white"
              />
            </div>

            {/* In-Tab Save Button */}
            <div className="pt-3 border-t border-[#252525] flex items-center justify-end">
              <button
                type="button"
                onClick={() => handleSave('Verification Policy')}
                className="px-6 py-2.5 rounded-xl font-royal font-bold text-xs text-black bg-gradient-to-r from-[#F3D079] via-[#D4AF37] to-[#B38C1B] hover:brightness-110 shadow-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Verification Policy</span>
              </button>
            </div>
          </div>
        )}

        {/* Bottom Sticky Action Bar */}
        <div className="p-4 rounded-2xl bg-[#161616] border border-[#C59B27]/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl">
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2.5 rounded-xl bg-[#222] hover:bg-[#333] text-gray-300 hover:text-white text-xs font-royal font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Store Defaults</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleSave()}
              className={`px-8 py-3 rounded-xl font-royal font-bold text-xs text-black transition-all active:scale-95 shadow-lg flex items-center gap-2 cursor-pointer ${
                isSavedRecently 
                  ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-black ring-2 ring-emerald-300' 
                  : 'bg-gradient-to-r from-[#F3D079] via-[#D4AF37] to-[#B38C1B] hover:brightness-110'
              }`}
            >
              {isSavedRecently ? <Check className="w-4 h-4 text-black stroke-[3]" /> : <Save className="w-4 h-4" />}
              <span>{isSavedRecently ? `${savedTabName || 'CONFIGURATION'} SAVED ✓` : 'SAVE PAYMENT CONFIGURATION'}</span>
            </button>
          </div>
        </div>

        <ConfirmModal
          isOpen={showResetConfirm}
          title="Reset Payment Settings"
          message="Are you sure you want to reset all payment, UPI, tax, and delivery settings back to store default configuration?"
          confirmText="Yes, Reset Settings"
          variant="warning"
          onConfirm={executeResetToDefault}
          onClose={() => setShowResetConfirm(false)}
        />
      </div>
    </div>
  );
};
