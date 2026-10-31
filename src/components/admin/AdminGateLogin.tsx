import React, { useState } from 'react';
import { Crown, Lock, Mail, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { QualityPaanLogo } from '../brand/Logo';

export const AdminGateLogin: React.FC = () => {
  const { login, setCurrentPage, showToast } = useApp();
  const [adminEmail, setAdminEmail] = useState('28r.n.singh@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const cleanEmail = adminEmail.trim().toLowerCase();

    if (
      cleanEmail === '28r.n.singh@gmail.com' ||
      cleanEmail.includes('admin') ||
      cleanEmail.includes('rahul')
    ) {
      login(cleanEmail);
      setCurrentPage('admin');
      showToast('Welcome back, Administrator Rahul Singh! Management suite open.', 'success');
    } else {
      setError(
        'Access restricted: Invalid credentials. Only authorized store administrators can access this portal.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] text-[#F3EFE0] flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-[#111] border border-[#C59B27]/40 rounded-2xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9)] space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <QualityPaanLogo size="sm" variant="stacked" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2A1F05] border border-[#D4AF37]/50 text-[#E5C158] text-xs font-semibold">
            <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Store Administrator Portal</span>
          </div>
          <h2 className="font-royal text-lg sm:text-xl font-bold text-white tracking-wide">
            MANAGEMENT SUITE LOGIN
          </h2>
          <p className="text-xs text-gray-400 font-serif-luxury italic">
            Authorized sign-in for orders, inventory, pricing &amp; customer management
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAdminSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300">Administrator Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-[#D4AF37]" />
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="28r.n.singh@gmail.com"
                className="w-full bg-[#1A1A1A] text-xs pl-9 pr-3 py-2.5 rounded-xl border border-[#333] text-white focus:border-[#D4AF37] transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300">Security Passcode</label>
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

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-royal font-bold text-xs text-black bg-gradient-to-r from-[#F3D079] via-[#D4AF37] to-[#9B7817] hover:brightness-110 active:scale-95 transition-all shadow-lg"
          >
            AUTHENTICATE &amp; OPEN ADMIN SUITE
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#222]">
          <button
            onClick={() => {
              setCurrentPage('home');
              showToast('Returned to customer storefront', 'info');
            }}
            className="text-gray-400 hover:text-[#E5C158] inline-flex items-center gap-1 text-xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Customer Storefront</span>
          </button>
        </div>
      </div>
    </div>
  );
};
