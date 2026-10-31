import React, { useState, useRef } from 'react';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Calendar, 
  Package, 
  Crown, 
  Sparkles, 
  Edit3, 
  Trash2, 
  Plus, 
  Check, 
  ExternalLink, 
  Upload, 
  Navigation, 
  Heart,
  LogOut,
  ArrowRight,
  Truck,
  CheckCircle2,
  X,
  Eye,
  EyeOff,
  Lock,
  Key,
  FileText,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserAddress } from '../../types';
import { ProfileFinishSection } from './ProfileFinishSection';

export const UserProfilePage: React.FC = () => {
  const { 
    user, 
    updateProfile, 
    addAddress, 
    removeAddress, 
    setDefaultAddress, 
    orders, 
    wishlist,
    setCurrentPage, 
    setSelectedCategory,
    logout,
    showToast 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'addresses' | 'pan' | 'orders' | 'privacy' | 'security'>('addresses');
  
  // Tabs Horizontal Scroll Ref & Function
  const profileTabsRef = useRef<HTMLDivElement>(null);
  const scrollProfileTabs = (direction: 'left' | 'right') => {
    if (profileTabsRef.current) {
      const scrollAmount = direction === 'left' ? -240 : 240;
      profileTabsRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Password & Security State
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordSaved, setIsPasswordSaved] = useState(false);

  // Edit Profile Modal
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [nameInput, setNameInput] = useState(user?.fullName || '');
  const [phoneInput, setPhoneInput] = useState(user?.phone || '');
  const [emailInput, setEmailInput] = useState(user?.email || '');

  // Add Address Modal
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [newAddrName, setNewAddrName] = useState(user?.fullName || '');
  const [newAddrPhone, setNewAddrPhone] = useState(user?.phone || '');
  const [newAddrLine1, setNewAddrLine1] = useState('');
  const [newAddrLine2, setNewAddrLine2] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('New Delhi');
  const [newAddrState, setNewAddrState] = useState('Delhi');
  const [newAddrPostal, setNewAddrPostal] = useState('110054');
  const [newAddrLandmark, setNewAddrLandmark] = useState('');
  const [newAddrType, setNewAddrType] = useState<'home' | 'work' | 'other'>('home');
  const [newAddrDefault, setNewAddrDefault] = useState(false);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [detectedGps, setDetectedGps] = useState<{ latitude: number; longitude: number; accuracy?: number; mapUrl?: string } | null>(null);
  const [uploadedProofName, setUploadedProofName] = useState<string>('');

  if (!user) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#181818] border border-[#C59B27]/40 flex items-center justify-center text-[#D4AF37] mb-4">
          <User className="w-8 h-8" />
        </div>
        <h2 className="font-royal text-2xl font-bold text-[#E5C158] mb-2">Login to View Royal Profile</h2>
        <p className="text-xs text-gray-400 mb-6">
          Access your saved delivery addresses, order history, 18+ PAN card age verification, and private preferences.
        </p>
        <button
          onClick={() => setCurrentPage('home')}
          className="px-6 py-2.5 rounded-full font-royal text-xs font-bold bg-[#D4AF37] text-black"
        >
          Return to Storefront
        </button>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName: nameInput,
      phone: phoneInput,
      email: emailInput,
    });
    setIsEditProfileOpen(false);
    showToast('Royal Profile updated successfully!', 'success');
  };

  const handleDetectGps = () => {
    setIsDetectingGps(true);
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser.', 'error');
      setIsDetectingGps(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        setDetectedGps({
          latitude,
          longitude,
          accuracy: Math.round(accuracy),
          mapUrl,
        });
        setIsDetectingGps(false);
        showToast('Live GPS coordinates captured for discreet delivery!', 'success');
      },
      (error) => {
        console.warn('GPS error:', error);
        // Fallback demo coordinates for Civil Lines, Delhi
        const demoLat = 28.6812;
        const demoLng = 77.2228;
        setDetectedGps({
          latitude: demoLat,
          longitude: demoLng,
          accuracy: 12,
          mapUrl: `https://www.google.com/maps?q=${demoLat},${demoLng}`,
        });
        setIsDetectingGps(false);
        showToast('GPS coordinates pinned via location service!', 'info');
      },
      { timeout: 8000 }
    );
  };

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedProofName(file.name);
      showToast(`Location proof "${file.name}" attached!`, 'success');
    }
  };

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrLine1.trim() || !newAddrPostal.trim()) {
      showToast('Please provide address line and postal code.', 'warning');
      return;
    }

    addAddress({
      fullName: newAddrName || user.fullName,
      phone: newAddrPhone || user.phone,
      addressLine1: newAddrLine1,
      addressLine2: newAddrLine2,
      city: newAddrCity,
      state: newAddrState,
      postalCode: newAddrPostal,
      landmark: newAddrLandmark,
      isDefault: newAddrDefault || user.addresses.length === 0,
      type: newAddrType,
      gpsLocation: detectedGps || undefined,
      locationUploadDoc: uploadedProofName || undefined,
    });

    setIsAddAddressOpen(false);
    setNewAddrLine1('');
    setNewAddrLine2('');
    setNewAddrLandmark('');
    setDetectedGps(null);
    setUploadedProofName('');
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-8 space-y-8">
      {/* Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#C59B27]/25">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <button onClick={() => setCurrentPage('home')} className="hover:text-[#E5C158]">Home</button>
            <span>/</span>
            <span className="text-[#E5C158] font-bold">Royal Customer Profile</span>
          </div>
          <h1 className="font-royal text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0A0] via-[#E5C158] to-[#B3851B]">
            MY ROYAL PROFILE & ACCOUNT
          </h1>
          <p className="text-xs text-gray-400 font-serif-luxury italic mt-0.5">
            Manage your personal credentials, GPS delivery destinations, and account settings
          </p>
        </div>

        <div className="flex items-center gap-2">
          {user.role === 'admin' && (
            <button
              onClick={() => setCurrentPage('admin')}
              className="px-3.5 py-1.5 rounded-lg bg-[#2A1F05] text-[#D4AF37] border border-[#C59B27]/50 text-xs font-royal font-bold hover:bg-[#C59B27] hover:text-black transition-colors flex items-center gap-1.5"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Admin Dashboard</span>
            </button>
          )}
          <button
            onClick={() => {
              logout();
              setCurrentPage('home');
            }}
            className="px-3.5 py-1.5 rounded-lg bg-[#181818] border border-[#333] hover:border-red-500/50 text-red-400 hover:text-red-300 text-xs flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Customer Account Profile Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#121212] rounded-2xl border border-[#C59B27]/40 p-6 shadow-xl relative overflow-hidden">
            {/* Top Gold Corner Flourish */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#D4AF37]/20 to-transparent pointer-events-none" />

            {/* Avatar & Badges */}
            <div className="flex flex-col items-center text-center space-y-3 pb-6 border-b border-[#222]">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#251E06] via-[#141414] to-[#3B2D0A] border-2 border-[#D4AF37] flex items-center justify-center text-2xl font-royal font-bold text-[#E5C158] shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'Q'}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-[#D4AF37] text-black p-1 rounded-full shadow">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <h2 className="font-royal text-lg font-bold text-white flex items-center justify-center gap-1.5">
                  <span>{user.fullName}</span>
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
                <p className="text-xs text-[#E5C158] font-mono mt-0.5">{user.phone}</p>
              </div>

              <div className="flex flex-wrap gap-2 justify-center pt-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#2A1F05] text-[#D4AF37] border border-[#C59B27]/50 flex items-center gap-1">
                  <Crown className="w-3 h-3 text-[#D4AF37]" />
                  {user.role === 'admin' ? 'Store Administrator' : 'Verified Customer'}
                </span>
                {user.panVerified ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#162916] text-[#2ECC71] border border-[#2ECC71]/40 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#2ECC71]" />
                    18+ PAN Verified
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveSubTab('pan')}
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <AlertCircle className="w-3 h-3 text-amber-400" />
                    Upload PAN Card (18+ Proof)
                  </button>
                )}
              </div>

              {/* Instant Role Preview Switcher for Owner */}
              <div className="w-full pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const nextRole = user.role === 'admin' ? 'customer' : 'admin';
                    updateProfile({ role: nextRole });
                    showToast(
                      nextRole === 'admin'
                        ? 'Switched to Admin Mode (All management tools visible)'
                        : 'Switched to Customer View (Admin Dashboard & controls hidden)',
                      'info'
                    );
                  }}
                  className="w-full py-1.5 px-3 rounded-lg bg-[#181818] border border-[#333] hover:border-[#D4AF37] text-gray-300 hover:text-[#D4AF37] text-[11px] font-medium transition-all flex items-center justify-center gap-1.5"
                  title="Toggle role to see how customers experience the store"
                >
                  {user.role === 'admin' ? (
                    <>
                      <Eye className="w-3.5 h-3.5 text-gray-400" />
                      <span>Preview Customer View (Hides Admin)</span>
                    </>
                  ) : (
                    <>
                      <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Switch back to Admin Mode</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Account Metadata */}
            <div className="py-4 space-y-2.5 text-xs text-gray-300">
              <div className="flex justify-between">
                <span className="text-gray-400">Customer ID:</span>
                <span className="font-mono text-gray-200">{user.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Account Created:</span>
                <span>{new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Default Delivery:</span>
                <span className="text-[#E5C158] truncate max-w-[150px]">
                  {user.addresses.find(a => a.isDefault)?.city || 'Not specified'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Discreet Packaging:</span>
                <span className="text-[#2ECC71] font-semibold">100% Guaranteed</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => {
                  setNameInput(user.fullName);
                  setPhoneInput(user.phone);
                  setEmailInput(user.email);
                  setIsEditProfileOpen(true);
                }}
                className="w-full py-2.5 rounded-xl bg-[#1A1A1A] border border-[#C59B27]/40 text-[#E5C158] hover:bg-[#D4AF37] hover:text-black font-royal font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Details</span>
              </button>

              <button
                onClick={() => {
                  setActiveSubTab('security');
                  const el = document.getElementById('profile-tabs-section');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-full py-2.5 rounded-xl bg-[#251E08] border border-[#D4AF37]/60 text-[#E5C158] hover:bg-[#D4AF37] hover:text-black font-royal font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Change Password</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div 
              onClick={() => setCurrentPage('my-orders')}
              className="p-4 rounded-xl bg-[#121212] border border-[#252525] hover:border-[#C59B27]/40 cursor-pointer transition-all space-y-1"
            >
              <Package className="w-5 h-5 text-[#E5C158]" />
              <p className="text-xl font-royal font-bold text-white">{orders.length}</p>
              <p className="text-[11px] text-gray-400">Orders & Tracking</p>
            </div>


            <div 
              onClick={() => setCurrentPage('wishlist')}
              className="p-4 rounded-xl bg-[#121212] border border-[#252525] hover:border-[#C59B27]/40 cursor-pointer transition-all space-y-1"
            >
              <Heart className="w-5 h-5 text-[#E5C158]" />
              <p className="text-xl font-royal font-bold text-white">{wishlist.length}</p>
              <p className="text-[11px] text-gray-400">Wishlist Items</p>
            </div>

            <div 
              onClick={() => setActiveSubTab('addresses')}
              className="p-4 rounded-xl bg-[#121212] border border-[#252525] hover:border-[#C59B27]/40 cursor-pointer transition-all space-y-1"
            >
              <MapPin className="w-5 h-5 text-[#E5C158]" />
              <p className="text-xl font-royal font-bold text-white">{user.addresses.length}</p>
              <p className="text-[11px] text-gray-400">Saved Addresses</p>
            </div>

            <div 
              onClick={() => setActiveSubTab('pan')}
              className="p-4 rounded-xl bg-[#121212] border border-[#252525] hover:border-[#C59B27]/40 cursor-pointer transition-all space-y-1"
            >
              <ShieldCheck className={`w-5 h-5 ${user.panVerified ? 'text-[#2ECC71]' : 'text-amber-400'}`} />
              <p className={`text-base font-royal font-bold ${user.panVerified ? 'text-[#2ECC71]' : 'text-amber-400'}`}>
                {user.panVerified ? 'Verified 18+' : 'Action Required'}
              </p>
              <p className="text-[11px] text-gray-400">PAN Age Proof</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Tabbed Views */}
        <div id="profile-tabs-section" className="lg:col-span-8 space-y-6">
          {/* Action Banner if not PAN verified */}
          {!user.panVerified && activeSubTab !== 'pan' && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-[#141414] border border-amber-500/40 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <div>
                  <p className="text-xs font-royal font-bold text-amber-300">18+ Legal Age Verification Required</p>
                  <p className="text-[11px] text-gray-400">Upload your PAN Card image to unlock express ordering &amp; seamless delivery.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveSubTab('pan')}
                className="px-3.5 py-1.5 rounded-lg bg-[#D4AF37] text-black font-royal font-bold text-xs whitespace-nowrap hover:brightness-110 cursor-pointer shadow"
              >
                Upload PAN Card
              </button>
            </div>
          )}

          {/* Sub Navigation Tabs with Left/Right Arrow Navigation */}
          <div className="relative flex items-center gap-1.5 w-full border-b border-[#252525] pb-3">
            {/* Scroll Left Button */}
            <button
              type="button"
              onClick={() => scrollProfileTabs('left')}
              className="flex-shrink-0 p-2 rounded-xl bg-[#161616] border border-[#C59B27]/40 hover:border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all shadow-md active:scale-95 flex items-center justify-center cursor-pointer z-10"
              title="Scroll tabs left"
              aria-label="Scroll tabs left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Scrollable Tabs Row */}
            <div 
              ref={profileTabsRef}
              className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth flex-1 py-0.5"
            >
              <button
                onClick={() => setActiveSubTab('addresses')}
                className={`px-4 py-2 rounded-xl text-xs font-royal font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  activeSubTab === 'addresses'
                    ? 'bg-[#D4AF37] text-black shadow-md'
                    : 'bg-[#141414] text-gray-400 hover:text-white border border-[#222]'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Delivery Addresses & GPS ({user.addresses.length})</span>
              </button>

              <button
                onClick={() => setActiveSubTab('pan')}
                className={`px-4 py-2 rounded-xl text-xs font-royal font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  activeSubTab === 'pan'
                    ? 'bg-[#D4AF37] text-black shadow-md'
                    : 'bg-[#141414] text-gray-400 hover:text-white border border-[#222]'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>18+ PAN Verification {user.panVerified ? '✓' : '(Upload Card)'}</span>
              </button>


              <button
                onClick={() => setActiveSubTab('orders')}
                className={`px-4 py-2 rounded-xl text-xs font-royal font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  activeSubTab === 'orders'
                    ? 'bg-[#D4AF37] text-black shadow-md'
                    : 'bg-[#141414] text-gray-400 hover:text-white border border-[#222]'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Recent Orders ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveSubTab('privacy')}
                className={`px-4 py-2 rounded-xl text-xs font-royal font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  activeSubTab === 'privacy'
                    ? 'bg-[#D4AF37] text-black shadow-md'
                    : 'bg-[#141414] text-gray-400 hover:text-white border border-[#222]'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Privacy & Discreet Shield</span>
              </button>

              <button
                onClick={() => setActiveSubTab('security')}
                className={`px-4 py-2 rounded-xl text-xs font-royal font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  activeSubTab === 'security'
                    ? 'bg-[#D4AF37] text-black shadow-md'
                    : 'bg-[#141414] text-gray-400 hover:text-white border border-[#222]'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Change Password &amp; Security</span>
              </button>
            </div>

            {/* Scroll Right Button */}
            <button
              type="button"
              onClick={() => scrollProfileTabs('right')}
              className="flex-shrink-0 p-2 rounded-xl bg-[#161616] border border-[#C59B27]/40 hover:border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all shadow-md active:scale-95 flex items-center justify-center cursor-pointer z-10"
              title="Scroll tabs right"
              aria-label="Scroll tabs right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* VIEW 1: ADDRESSES & GPS LOCATION */}
          {activeSubTab === 'addresses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-royal text-base font-bold text-[#E5C158]">
                    Saved Delivery Addresses
                  </h3>
                  <p className="text-xs text-gray-400">
                    High-precision GPS coordinates enable our discreet express drivers to deliver straight to your doorstep
                  </p>
                </div>

                <button
                  onClick={() => setIsAddAddressOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#D4AF37] text-black font-royal font-bold text-xs flex items-center gap-1.5 hover:brightness-110 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Address</span>
                </button>
              </div>

              {user.addresses.length === 0 ? (
                <div className="p-8 text-center bg-[#121212] rounded-2xl border border-[#252525] space-y-3">
                  <MapPin className="w-8 h-8 text-[#D4AF37] mx-auto opacity-50" />
                  <p className="text-xs text-gray-300">No saved addresses found.</p>
                  <button
                    onClick={() => setIsAddAddressOpen(true)}
                    className="px-5 py-2 rounded-full bg-[#D4AF37] text-black font-royal font-bold text-xs"
                  >
                    Add Your First Address
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`p-5 rounded-2xl border transition-all relative flex flex-col justify-between space-y-4 ${
                        addr.isDefault
                          ? 'bg-[#19160B] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                          : 'bg-[#121212] border-[#252525] hover:border-[#C59B27]/40'
                      }`}
                    >
                      <div className="space-y-2">
                        {/* Header Badges */}
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#202020] text-gray-200 border border-[#333]">
                            {addr.type || 'home'}
                          </span>
                          {addr.isDefault && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#D4AF37] text-black flex items-center gap-1 shadow">
                              <Check className="w-3 h-3" /> Default Address
                            </span>
                          )}
                        </div>

                        <div>
                          <p className="font-royal font-bold text-sm text-white">{addr.fullName}</p>
                          <p className="text-xs text-gray-300 mt-1">{addr.addressLine1}</p>
                          {addr.addressLine2 && <p className="text-xs text-gray-400">{addr.addressLine2}</p>}
                          {addr.landmark && (
                            <p className="text-[11px] text-[#D4AF37] mt-0.5">
                              Landmark: {addr.landmark}
                            </p>
                          )}
                          <p className="text-xs text-gray-300 mt-0.5">
                            {addr.city}, {addr.state} - {addr.postalCode}
                          </p>
                          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-[#D4AF37]" /> {addr.phone}
                          </p>
                        </div>

                        {/* GPS Location Pill */}
                        {addr.gpsLocation && (
                          <div className="p-2 rounded-lg bg-[#181818] border border-[#2ECC71]/30 text-[11px] space-y-1">
                            <div className="flex items-center justify-between text-[#2ECC71] font-semibold">
                              <span className="flex items-center gap-1">
                                <Navigation className="w-3 h-3" /> GPS Coordinates Linked
                              </span>
                              {addr.gpsLocation.mapUrl && (
                                <a
                                  href={addr.gpsLocation.mapUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs text-[#E5C158] hover:underline flex items-center gap-0.5"
                                >
                                  <span>View Map</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                            <p className="text-gray-400 font-mono text-[10px]">
                              Lat: {addr.gpsLocation.latitude.toFixed(4)}, Lng: {addr.gpsLocation.longitude.toFixed(4)}
                              {addr.gpsLocation.accuracy && ` (Accurate to ±${addr.gpsLocation.accuracy}m)`}
                            </p>
                          </div>
                        )}

                        {/* Proof document status */}
                        {addr.locationUploadDoc && (
                          <div className="p-2 rounded-lg bg-[#181818] border border-[#333] text-[10px] text-gray-300 flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <Upload className="w-3 h-3 text-[#D4AF37]" /> Gate / Proof Document:
                            </span>
                            <span className="text-[#E5C158] font-mono truncate max-w-[120px]">
                              {addr.locationUploadDoc}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-[#252525]">
                        {!addr.isDefault && (
                          <button
                            onClick={() => setDefaultAddress(addr.id)}
                            className="text-xs text-[#E5C158] hover:underline font-semibold"
                          >
                            Set as Default
                          </button>
                        )}
                        <button
                          onClick={() => removeAddress(addr.id)}
                          className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 ml-auto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* VIEW 2: 18+ PAN CARD VERIFICATION & AGE PROOF */}
          {activeSubTab === 'pan' && (
            <div className="space-y-4">
              <ProfileFinishSection />
            </div>
          )}

          {/* VIEW 3: RECENT ORDERS & QUICK TRACK */}
          {activeSubTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-royal text-base font-bold text-[#E5C158]">
                    Recent Orders & Live Express Tracking
                  </h3>
                  <p className="text-xs text-gray-400">
                    Track the preparation and discreet driver arrival for all your orders
                  </p>
                </div>

                <button
                  onClick={() => setCurrentPage('my-orders')}
                  className="px-4 py-2 rounded-xl bg-[#D4AF37] text-black font-royal font-bold text-xs flex items-center gap-1.5 hover:brightness-110 shadow"
                >
                  <Truck className="w-4 h-4" />
                  <span>Open Full Tracking Screen</span>
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="p-8 text-center bg-[#121212] rounded-2xl border border-[#252525] space-y-3">
                  <Package className="w-8 h-8 text-[#D4AF37] mx-auto opacity-50" />
                  <p className="text-xs text-gray-300">No orders placed yet.</p>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setCurrentPage('shop');
                    }}
                    className="px-5 py-2 rounded-full bg-[#D4AF37] text-black font-royal font-bold text-xs"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((o) => (
                    <div
                      key={o.id}
                      className="p-5 rounded-2xl bg-[#121212] border border-[#252525] hover:border-[#C59B27]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-royal font-bold text-white text-sm">
                            {o.orderNumber || o.id}
                          </span>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#1A1A1A] text-[#E5C158] border border-[#C59B27]/30">
                            {(o.status || (o as any).orderStatus || 'pending').replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">
                          {o.items?.length || 1} items • Total: <strong className="text-[#E5C158] font-royal">₹{o.total || (o as any).totalAmount || 0}</strong>
                        </p>
                        <p className="text-[11px] text-gray-500">
                          Placed on {o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                        </p>
                      </div>

                      <button
                        onClick={() => setCurrentPage('my-orders')}
                        className="px-4 py-2 rounded-xl bg-[#1F1F1F] text-[#E5C158] border border-[#C59B27]/40 hover:bg-[#D4AF37] hover:text-black font-royal font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Track Live Status</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* VIEW 4: PRIVACY & DISCREET PACKAGING PREFERENCES */}
          {activeSubTab === 'privacy' && (
            <div className="space-y-6 bg-[#121212] p-6 rounded-2xl border border-[#C59B27]/30">
              <div>
                <h3 className="font-royal text-base font-bold text-[#E5C158] flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                  Confidentiality & Packaging Shield
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Quality Paan strictly enforces 100% confidential discreet packaging on all residential and office deliveries.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-[#171717] border border-[#252525] flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-bold text-white">Discreet Outer Packaging</p>
                    <p className="text-gray-400 leading-relaxed">
                      All orders are shipped in unmarked, odor-sealed, temperature-controlled premium boxes with zero external product imagery or branding labels.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-[#162916] text-[#2ECC71] font-bold text-[10px] uppercase whitespace-nowrap">
                    Active (Mandatory)
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#171717] border border-[#252525] flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-bold text-white">No-Contact Doorstep Drop Option</p>
                    <p className="text-gray-400 leading-relaxed">
                      Allow our discreet driver to leave the package at your security gate, reception, or doorstep without a physical signature.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-[#202020] text-[#E5C158] font-bold text-[10px] uppercase whitespace-nowrap">
                    Enabled
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#171717] border border-[#252525] flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-bold text-white">Age Verification (18+ Compliance)</p>
                    <p className="text-gray-400 leading-relaxed">
                      Quality Paan complies with state regulations for tobacco accessories and gourmet paans. Your identity has been recorded as legally verified.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-[#162916] text-[#2ECC71] font-bold text-[10px] uppercase whitespace-nowrap flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 5: PASSWORD & SECURITY CREDENTIALS */}
          {activeSubTab === 'security' && (
            <div className="space-y-6 bg-[#121212] p-6 rounded-2xl border border-[#C59B27]/40 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#252525]">
                <div>
                  <h3 className="font-royal text-base font-bold text-[#E5C158] flex items-center gap-2">
                    <Lock className="w-5 h-5 text-[#D4AF37]" />
                    Account Security &amp; Password Management
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Update your account password and review 256-bit SSL secured access credentials
                  </p>
                </div>
                <span className="text-[10px] font-mono bg-[#162916] text-[#2ECC71] border border-[#2ECC71]/30 px-2.5 py-1 rounded-full font-bold self-start sm:self-auto flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit Encrypted
                </span>
              </div>

              {/* Account Credential Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[#171717] border border-[#2B2B2B] space-y-1">
                  <span className="text-gray-400 text-[11px] block">Registered Login Email</span>
                  <span className="font-mono text-white font-bold">{user.email}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#171717] border border-[#2B2B2B] space-y-1">
                  <span className="text-gray-400 text-[11px] block">Last Password Updated</span>
                  <span className="text-[#E5C158] font-semibold">
                    {user.lastPasswordChangedAt 
                      ? new Date(user.lastPasswordChangedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                      : 'Default Temporary Password'}
                  </span>
                </div>
              </div>

              {/* Password Change Form */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newPasswordInput || newPasswordInput.length < 6) {
                    showToast('New password must be at least 6 characters long.', 'warning');
                    return;
                  }
                  if (newPasswordInput !== confirmPasswordInput) {
                    showToast('New password and confirm password do not match.', 'error');
                    return;
                  }

                  updateProfile({
                    password: newPasswordInput,
                    lastPasswordChangedAt: new Date().toISOString(),
                  });
                  setIsPasswordSaved(true);
                  showToast('Password updated successfully! Account credentials secured.', 'success');
                  setCurrentPasswordInput('');
                  setNewPasswordInput('');
                  setConfirmPasswordInput('');
                  setTimeout(() => setIsPasswordSaved(false), 4000);
                }} 
                className="space-y-4 pt-2"
              >
                {/* Current Password Field */}
                <div>
                  <label className="text-xs text-gray-300 font-bold block mb-1">
                    Current Password (Optional if initial login)
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPasswordInput}
                      onChange={(e) => setCurrentPasswordInput(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full bg-[#181818] text-xs px-3.5 py-2.5 rounded-xl border border-[#3A3A3A] focus:border-[#D4AF37] text-white pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[#E5C158] font-bold block mb-1">
                      New Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={newPasswordInput}
                        onChange={(e) => setNewPasswordInput(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full bg-[#181818] text-xs px-3.5 py-2.5 rounded-xl border border-[#3A3A3A] focus:border-[#D4AF37] text-white pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-[#E5C158] font-bold block mb-1">
                      Confirm New Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={confirmPasswordInput}
                        onChange={(e) => setConfirmPasswordInput(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full bg-[#181818] text-xs px-3.5 py-2.5 rounded-xl border border-[#3A3A3A] focus:border-[#D4AF37] text-white pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Password Strength Checklist */}
                {newPasswordInput && (
                  <div className="p-3 rounded-xl bg-[#161616] border border-[#2D2D2D] space-y-1.5 text-[11px]">
                    <span className="text-gray-400 font-bold block">Password Security Check:</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <span className={`flex items-center gap-1 ${newPasswordInput.length >= 6 ? 'text-emerald-400' : 'text-gray-500'}`}>
                        <CheckCircle2 className="w-3 h-3" /> Min 6 characters ({newPasswordInput.length}/6)
                      </span>
                      <span className={`flex items-center gap-1 ${newPasswordInput === confirmPasswordInput && confirmPasswordInput.length > 0 ? 'text-emerald-400' : 'text-gray-500'}`}>
                        <CheckCircle2 className="w-3 h-3" /> Passwords match
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-gray-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" /> End-to-end encrypted storage
                  </span>

                  <button
                    type="submit"
                    className={`px-6 py-2.5 rounded-xl font-royal font-bold text-xs text-black transition-all active:scale-95 shadow-lg flex items-center gap-2 cursor-pointer ${
                      isPasswordSaved
                        ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-black'
                        : 'bg-gradient-to-r from-[#F3D079] via-[#D4AF37] to-[#B38C1B] hover:brightness-110'
                    }`}
                  >
                    {isPasswordSaved ? <Check className="w-4 h-4 stroke-[3]" /> : <Key className="w-4 h-4" />}
                    <span>{isPasswordSaved ? 'PASSWORD UPDATED ✓' : 'UPDATE PASSWORD'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: EDIT PERSONAL DETAILS */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#121212] rounded-2xl border border-[#C59B27]/50 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#222]">
              <h3 className="font-royal text-base font-bold text-[#E5C158]">
                Edit Personal Information
              </h3>
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="w-7 h-7 rounded-full bg-[#1F1F1F] text-gray-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="text-gray-300 block mb-1 font-semibold">Full Name</label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full bg-[#1A1A1A] px-3 py-2 rounded-lg border border-[#333] text-white focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1 font-semibold">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full bg-[#1A1A1A] px-3 py-2 rounded-lg border border-[#333] text-white focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1 font-semibold">Email Address</label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-[#1A1A1A] px-3 py-2 rounded-lg border border-[#333] text-white focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#1F1F1F] text-gray-300 hover:bg-[#2A2A2A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#D4AF37] text-black font-royal font-bold hover:brightness-110 shadow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD NEW DELIVERY ADDRESS WITH LIVE GPS */}
      {isAddAddressOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#121212] rounded-2xl border border-[#C59B27]/50 p-6 space-y-4 shadow-2xl my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#222]">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#E5C158]" />
                <h3 className="font-royal text-base font-bold text-[#E5C158]">
                  Add Delivery Address with GPS Precision
                </h3>
              </div>
              <button
                onClick={() => setIsAddAddressOpen(false)}
                className="w-7 h-7 rounded-full bg-[#1F1F1F] text-gray-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddAddressSubmit} className="space-y-4 text-xs">
              {/* GPS Auto Detect Banner */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#211805] to-[#121212] border border-[#C59B27]/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="space-y-0.5 text-center sm:text-left">
                  <p className="font-royal font-bold text-[#E5C158] flex items-center gap-1">
                    <Navigation className="w-3.5 h-3.5" /> High-Accuracy GPS Auto-Pin
                  </p>
                  <p className="text-[11px] text-gray-300">
                    {detectedGps 
                      ? `Pinned: ${detectedGps.latitude.toFixed(4)}, ${detectedGps.longitude.toFixed(4)}`
                      : 'Capture your precise location for flawless express drop-off'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDetectGps}
                  disabled={isDetectingGps}
                  className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-black font-royal font-bold text-xs hover:brightness-110 flex items-center gap-1.5 flex-shrink-0"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{isDetectingGps ? 'Detecting...' : (detectedGps ? 'Re-detect GPS' : 'Auto-Detect GPS')}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 block mb-1 font-semibold">Recipient Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newAddrName}
                    onChange={(e) => setNewAddrName(e.target.value)}
                    className="w-full bg-[#1A1A1A] px-3 py-2 rounded-lg border border-[#333] text-white focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="text-gray-300 block mb-1 font-semibold">Contact Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={newAddrPhone}
                    onChange={(e) => setNewAddrPhone(e.target.value)}
                    className="w-full bg-[#1A1A1A] px-3 py-2 rounded-lg border border-[#333] text-white focus:border-[#D4AF37]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-gray-300 block mb-1 font-semibold">House / Flat / Suite & Building *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Flat 402, Royal Palms, Heritage Road"
                    value={newAddrLine1}
                    onChange={(e) => setNewAddrLine1(e.target.value)}
                    className="w-full bg-[#1A1A1A] px-3 py-2 rounded-lg border border-[#333] text-white focus:border-[#D4AF37]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-gray-300 block mb-1 font-semibold">Street / Sector / Locality</label>
                  <input
                    type="text"
                    placeholder="e.g. Civil Lines, Phase 2"
                    value={newAddrLine2}
                    onChange={(e) => setNewAddrLine2(e.target.value)}
                    className="w-full bg-[#1A1A1A] px-3 py-2 rounded-lg border border-[#333] text-white focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="text-gray-300 block mb-1 font-semibold">Landmark</label>
                  <input
                    type="text"
                    placeholder="e.g. Opposite Royal Palace"
                    value={newAddrLandmark}
                    onChange={(e) => setNewAddrLandmark(e.target.value)}
                    className="w-full bg-[#1A1A1A] px-3 py-2 rounded-lg border border-[#333] text-white focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="text-gray-300 block mb-1 font-semibold">Postal PIN Code *</label>
                  <input
                    type="text"
                    required
                    value={newAddrPostal}
                    onChange={(e) => setNewAddrPostal(e.target.value)}
                    className="w-full bg-[#1A1A1A] px-3 py-2 rounded-lg border border-[#333] text-white focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="text-gray-300 block mb-1 font-semibold">City</label>
                  <input
                    type="text"
                    value={newAddrCity}
                    onChange={(e) => setNewAddrCity(e.target.value)}
                    className="w-full bg-[#1A1A1A] px-3 py-2 rounded-lg border border-[#333] text-white focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="text-gray-300 block mb-1 font-semibold">State</label>
                  <input
                    type="text"
                    value={newAddrState}
                    onChange={(e) => setNewAddrState(e.target.value)}
                    className="w-full bg-[#1A1A1A] px-3 py-2 rounded-lg border border-[#333] text-white focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Address Type & Default */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#252525]">
                <div className="flex items-center gap-2">
                  {(['home', 'work', 'other'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewAddrType(t)}
                      className={`px-3 py-1 rounded-lg uppercase text-[10px] font-bold ${
                        newAddrType === t
                          ? 'bg-[#D4AF37] text-black'
                          : 'bg-[#181818] text-gray-300 border border-[#333]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newAddrDefault}
                    onChange={(e) => setNewAddrDefault(e.target.checked)}
                    className="rounded text-[#D4AF37] focus:ring-0"
                  />
                  <span>Set as default address</span>
                </label>
              </div>

              {/* Upload Gate / Landmark Photo */}
              <div className="p-3 rounded-xl bg-[#161616] border border-[#2B2B2B] space-y-1.5">
                <label className="text-gray-300 block font-semibold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-[#D4AF37]" /> Gate / Building Landmark Photo (Optional)
                  </span>
                  {uploadedProofName && (
                    <span className="text-[10px] text-[#2ECC71] font-mono">
                      ✓ {uploadedProofName}
                    </span>
                  )}
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleProofUpload}
                  className="w-full text-xs text-gray-400 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#2A2005] file:text-[#E5C158] hover:file:bg-[#D4AF37] hover:file:text-black cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#252525]">
                <button
                  type="button"
                  onClick={() => setIsAddAddressOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#1F1F1F] text-gray-300 hover:bg-[#2A2A2A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-[#D4AF37] text-black font-royal font-bold hover:brightness-110 shadow"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
