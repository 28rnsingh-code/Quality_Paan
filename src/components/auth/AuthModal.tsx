import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  Phone,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Crown,
  ArrowLeft,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { QualityPaanLogo } from '../brand/Logo';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    register,
    setCurrentPage,
    showToast,
    loginStaffUser,
    adminStaffUsers,
    adminRoles,
  } = useApp();

  // Form fields
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [ageConsent, setAgeConsent] = useState(true);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resetSent, setResetSent] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleResetModal = () => {
    setErrorMessage('');
    setResetSent(false);
    setPassword('');
    setConfirmPassword('');
  };

  const handleSwitchMode = (mode: 'login' | 'register' | 'forgot' | 'admin') => {
    handleResetModal();
    setAuthModalMode(mode);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // --- CUSTOMER LOGIN ---
    if (authModalMode === 'login') {
      const target = emailOrPhone.trim();
      if (!target) {
        setErrorMessage('Please enter your email address or mobile number.');
        return;
      }
      if (!password || password.length < 4) {
        setErrorMessage('Please enter your password.');
        return;
      }
      login(target);
      setIsAuthModalOpen(false);
      return;
    }

    // --- CUSTOMER REGISTRATION ---
    if (authModalMode === 'register') {
      if (!fullName.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      if (cleanPhone.length < 10) {
        setErrorMessage('Please enter a valid 10-digit mobile number.');
        return;
      }
      if (!email.includes('@') || !email.includes('.')) {
        setErrorMessage('Please enter a valid email address.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please re-enter.');
        return;
      }
      if (!ageConsent) {
        setErrorMessage('You must confirm you are 18+ to register.');
        return;
      }

      register(fullName.trim(), email.trim(), phone.trim());
      setIsAuthModalOpen(false);
      return;
    }

    // --- FORGOT PASSWORD ---
    if (authModalMode === 'forgot') {
      const target = emailOrPhone.trim();
      if (!target) {
        setErrorMessage('Please enter your registered email address or mobile number.');
        return;
      }
      setResetSent(true);
      showToast('Password reset instructions sent successfully.', 'info');
      return;
    }

    // --- ADMIN & APPOINTED STAFF PORTAL LOGIN ---
    if (authModalMode === 'admin') {
      const target = emailOrPhone.trim();
      const enteredPassword = password.trim();

      // 1. First check if it matches an appointed staff user account by PIN or Email/Password
      const staffAuthResult = loginStaffUser(target, enteredPassword);
      if (staffAuthResult.success) {
        setIsAuthModalOpen(false);
        setCurrentPage('admin');
        return;
      }

      // 2. Fallback check for root master owner
      const lower = target.toLowerCase();
      const isMasterAdmin =
        lower === '28r.n.singh@gmail.com' ||
        lower.includes('admin') ||
        lower.includes('rahul');

      if (isMasterAdmin) {
        login(target);
        setIsAuthModalOpen(false);
        setCurrentPage('admin');
        showToast('Welcome to Store Administration Suite, Rahul Singh (Master Admin)!', 'success');
        return;
      }

      setErrorMessage(
        'Access restricted: Unrecognized store administrator or appointed staff credentials. Please check your email, password or 4-digit PIN.'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md bg-[#121212] rounded-2xl border border-[#C59B27]/50 p-6 sm:p-8 shadow-[0_16px_50px_rgba(0,0,0,0.9)] space-y-5 my-8 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-1.5">
          <div className="flex justify-center">
            <QualityPaanLogo size="sm" variant="stacked" />
          </div>

          {authModalMode === 'login' && (
            <>
              <h3 className="font-royal text-lg font-bold text-[#E5C158] tracking-wide">
                CUSTOMER SIGN IN
              </h3>
              <p className="text-xs text-gray-400 font-serif-luxury italic">
                Sign in to track orders, manage addresses &amp; earn royal points
              </p>
            </>
          )}

          {authModalMode === 'register' && (
            <>
              <h3 className="font-royal text-lg font-bold text-[#E5C158] tracking-wide">
                CREATE ROYAL ACCOUNT
              </h3>
              <p className="text-xs text-gray-400 font-serif-luxury italic">
                Join our connoisseur circle for bespoke blends &amp; discreet delivery
              </p>
            </>
          )}

          {authModalMode === 'forgot' && (
            <>
              <h3 className="font-royal text-lg font-bold text-[#E5C158] tracking-wide">
                RESET PASSWORD
              </h3>
              <p className="text-xs text-gray-400 font-serif-luxury italic">
                Enter your registered details to recover your account
              </p>
            </>
          )}

          {authModalMode === 'admin' && (
            <>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2A1F05] border border-[#D4AF37]/50 text-[#E5C158] text-[11px] font-semibold mt-1">
                <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Store Management Portal</span>
              </div>
              <h3 className="font-royal text-base font-bold text-white tracking-wide pt-1">
                ADMINISTRATOR AUTHENTICATION
              </h3>
              <p className="text-xs text-gray-400 font-serif-luxury italic">
                Restricted to authorized Quality Paan staff &amp; administrators
              </p>
            </>
          )}
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs animate-shake">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Reset Confirmation */}
        {authModalMode === 'forgot' && resetSent ? (
          <div className="space-y-4 text-center py-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#1C2C1C] border border-[#2ECC71]/60 flex items-center justify-center text-[#2ECC71]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-royal text-sm font-bold text-white">Reset Link Dispatched</h4>
              <p className="text-xs text-gray-300">
                We have sent an authentication link and verification code to{' '}
                <strong className="text-[#E5C158]">{emailOrPhone}</strong>.
              </p>
            </div>
            <button
              onClick={() => handleSwitchMode('login')}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B3851B] text-black font-royal font-bold text-xs shadow-lg hover:brightness-110"
            >
              Back to Customer Sign In
            </button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* --- REGISTRATION FIELDS --- */}
            {authModalMode === 'register' && (
              <>
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-[#D4AF37]" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-[#1A1A1A] text-xs pl-9 pr-3 py-2.5 rounded-xl border border-[#333] text-white focus:border-[#D4AF37] transition-colors"
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">
                    Mobile Number (for delivery updates) *
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-bold text-[#D4AF37]">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="98765 43210"
                      className="w-full bg-[#1A1A1A] text-xs pl-12 pr-3 py-2.5 rounded-xl border border-[#333] text-white focus:border-[#D4AF37] transition-colors"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-[#D4AF37]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-[#1A1A1A] text-xs pl-9 pr-3 py-2.5 rounded-xl border border-[#333] text-white focus:border-[#D4AF37] transition-colors"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">
                    Create Password (min. 6 chars) *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-[#D4AF37]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#1A1A1A] text-xs pl-9 pr-10 py-2.5 rounded-xl border border-[#333] text-white focus:border-[#D4AF37] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Confirm Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-[#D4AF37]" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#1A1A1A] text-xs pl-9 pr-10 py-2.5 rounded-xl border border-[#333] text-white focus:border-[#D4AF37] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* 18+ Legal Declaration Checkbox */}
                <label className="flex items-start gap-2.5 pt-1 cursor-pointer select-none text-[11px] text-gray-300">
                  <input
                    type="checkbox"
                    required
                    checked={ageConsent}
                    onChange={(e) => setAgeConsent(e.target.checked)}
                    className="mt-0.5 rounded border-[#444] bg-[#1A1A1A] text-[#D4AF37] focus:ring-[#D4AF37] w-3.5 h-3.5 accent-[#D4AF37]"
                  />
                  <span className="leading-snug">
                    I confirm that I am{' '}
                    <strong className="text-[#E5C158]">18 years of age or older</strong> and agree to
                    Quality Paan&apos;s{' '}
                    <span className="text-[#E5C158] underline">Terms of Service</span> &amp;{' '}
                    <span className="text-[#E5C158] underline">Discreet Packaging Policy</span>.
                  </span>
                </label>

                {/* PAN Card Age Proof Notice */}
                <div className="p-2.5 rounded-xl bg-[#141414] border border-[#2A2A2A] flex items-center gap-2 text-[11px] text-gray-400">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                  <span>
                    <strong>18+ PAN Card Verification</strong> for age proof can be uploaded anytime in your customer profile.
                  </span>
                </div>
              </>
            )}

            {/* --- CUSTOMER LOGIN & ADMIN FIELDS --- */}
            {(authModalMode === 'login' || authModalMode === 'admin') && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">
                    {authModalMode === 'admin'
                      ? 'Administrator Email, Staff Username or 4-Digit Access PIN *'
                      : 'Email Address or Mobile Number *'}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-[#D4AF37]" />
                    <input
                      type="text"
                      required
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      placeholder={
                        authModalMode === 'admin'
                          ? '28r.n.singh@gmail.com or 4-digit PIN (e.g. 8888, 1234, 5678)'
                          : 'you@example.com or 10-digit mobile'
                      }
                      className="w-full bg-[#1A1A1A] text-xs pl-9 pr-3 py-2.5 rounded-xl border border-[#333] text-white focus:border-[#D4AF37] transition-colors"
                    />
                  </div>

                  {authModalMode === 'admin' && (
                    <div className="pt-1.5 space-y-1">
                      <span className="text-[10px] text-gray-400 font-royal font-bold block">
                        Quick Demo Appointed Staff Sign-In:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setEmailOrPhone('28r.n.singh@gmail.com');
                            setPassword('admin');
                          }}
                          className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 font-royal"
                        >
                          👑 Super Admin
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEmailOrPhone('vikram.fulfillment@qualitypaan.com');
                            setPassword('dispatch2026');
                          }}
                          className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 font-royal"
                        >
                          🚚 Orders (PIN: 1234)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEmailOrPhone('ananya.media@qualitypaan.com');
                            setPassword('media2026');
                          }}
                          className="px-2 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 font-royal"
                        >
                          🎬 Ads Lead (PIN: 5678)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEmailOrPhone('rohit.catalog@qualitypaan.com');
                            setPassword('catalog2026');
                          }}
                          className="px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/40 hover:bg-blue-500/30 font-royal"
                        >
                          📦 Catalog (PIN: 9012)
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-gray-300">
                      {authModalMode === 'admin' ? 'Security Passcode *' : 'Password *'}
                    </label>
                    {authModalMode === 'login' && (
                      <button
                        type="button"
                        onClick={() => handleSwitchMode('forgot')}
                        className="text-[11px] text-[#D4AF37] hover:underline"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-[#D4AF37]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#1A1A1A] text-xs pl-9 pr-10 py-2.5 rounded-xl border border-[#333] text-white focus:border-[#D4AF37] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* --- FORGOT PASSWORD FIELD --- */}
            {authModalMode === 'forgot' && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">
                  Registered Email Address or Mobile Number *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-[#D4AF37]" />
                  <input
                    type="text"
                    required
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="you@example.com or 10-digit mobile"
                    className="w-full bg-[#1A1A1A] text-xs pl-9 pr-3 py-2.5 rounded-xl border border-[#333] text-white focus:border-[#D4AF37] transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Submit Action Button */}
            <button
              type="submit"
              className="w-full py-3 mt-2 rounded-xl font-royal font-bold text-xs text-black bg-gradient-to-r from-[#F3D079] via-[#D4AF37] to-[#9B7817] hover:brightness-110 active:scale-95 transition-all shadow-lg"
            >
              {authModalMode === 'login' && 'SIGN IN TO QUALITY PAAN'}
              {authModalMode === 'register' && 'CREATE ROYAL ACCOUNT'}
              {authModalMode === 'forgot' && 'SEND PASSWORD RESET LINK'}
              {authModalMode === 'admin' && 'AUTHENTICATE & ENTER ADMIN SUITE'}
            </button>
          </form>
        )}

        {/* Modal Footers & Navigation Switchers */}
        <div className="text-center text-xs text-gray-400 pt-3 border-t border-[#222] space-y-2">
          {authModalMode === 'login' && (
            <>
              <p>
                New to Quality Paan?{' '}
                <button
                  onClick={() => handleSwitchMode('register')}
                  className="text-[#E5C158] font-bold hover:underline"
                >
                  Create an Account
                </button>
              </p>
              <div className="pt-2">
                <button
                  onClick={() => handleSwitchMode('admin')}
                  className="text-[10px] text-gray-500 hover:text-[#D4AF37] transition-colors inline-flex items-center gap-1"
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>Store Management &amp; Staff Portal</span>
                </button>
              </div>
            </>
          )}

          {authModalMode === 'register' && (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => handleSwitchMode('login')}
                className="text-[#E5C158] font-bold hover:underline"
              >
                Sign In
              </button>
            </p>
          )}

          {(authModalMode === 'forgot' || authModalMode === 'admin') && (
            <button
              onClick={() => handleSwitchMode('login')}
              className="text-gray-300 hover:text-[#E5C158] inline-flex items-center gap-1 text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Customer Sign In</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
