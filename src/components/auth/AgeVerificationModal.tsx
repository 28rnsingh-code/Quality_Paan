import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, CheckCircle2, XCircle, Sparkles, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { QualityPaanLogo } from '../brand/Logo';

export const AgeVerificationModal: React.FC = () => {
  const { isAgeVerified, verifyAge, showAgeModal, setShowAgeModal } = useApp();
  const [underAgeBlocked, setUnderAgeBlocked] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // If already verified and modal is not triggered, don't show
  if (isAgeVerified && !showAgeModal) return null;

  const handleConfirmAge = () => {
    verifyAge(true);
    setUnderAgeBlocked(false);
  };

  const handleUnderAge = () => {
    setUnderAgeBlocked(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-[#0F0F0F] rounded-2xl border-2 border-[#C59B27] p-6 sm:p-8 shadow-[0_20px_70px_rgba(0,0,0,0.95)] text-center space-y-6">
        
        {/* Glow effect */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-12 bg-[#D4AF37]/20 blur-3xl pointer-events-none" />

        {/* Brand Logo */}
        <div className="flex justify-center">
          <QualityPaanLogo size="md" variant="stacked" />
        </div>

        {!underAgeBlocked ? (
          <>
            {/* Age Badge & Heading */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1F190B] border border-[#D4AF37]/60 text-[#E5C158] text-xs font-royal font-bold tracking-widest uppercase shadow">
                <ShieldAlert className="w-4 h-4 text-[#D4AF37]" />
                AGE VERIFICATION REQUIRED (18+)
              </div>
              <h2 className="font-royal text-xl sm:text-2xl font-black text-[#F3EFE0] tracking-wide">
                ARE YOU 18 YEARS OF AGE OR OLDER?
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 font-serif-luxury italic leading-relaxed px-2">
                This store contains authentic 100% herbal shisha flavours, organic rolling papers, and luxury smoking accessories.
              </p>
            </div>

            {/* Warning Box */}
            <div className="p-3.5 rounded-xl bg-[#17140B] border border-[#C59B27]/40 text-[11px] text-gray-300 text-left space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-[#E5C158]">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Legal Compliance & Discreet Delivery</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                By entering this site, you certify that you are at least 18 years old and agree to our age verification policy. Deliveries are made in discreet insulated tamper-proof packaging.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleConfirmAge}
                id="age-confirm-btn"
                className="w-full py-3.5 rounded-xl font-royal font-black text-xs sm:text-sm text-black bg-gradient-to-r from-[#F3D079] via-[#D4AF37] to-[#9B7817] hover:brightness-110 active:scale-98 transition-all shadow-[0_4px_20px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                I AM 18 OR OLDER &mdash; ENTER STORE
              </button>

              <button
                onClick={handleUnderAge}
                id="age-decline-btn"
                className="w-full py-2.5 rounded-xl font-royal font-semibold text-xs text-gray-400 bg-[#161616] hover:bg-[#202020] hover:text-gray-200 border border-[#333] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                I AM UNDER 18 &mdash; EXIT
              </button>
            </div>
          </>
        ) : (
          /* Under 18 Restriction View */
          <div className="space-y-5 py-4">
            <div className="w-16 h-16 rounded-full bg-red-950/40 border-2 border-red-500/50 flex items-center justify-center mx-auto text-red-400">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-royal text-lg sm:text-xl font-bold text-red-400">
                ACCESS RESTRICTED
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                You must be 18 years or older to browse and purchase items from Quality Shisha. Access to this platform has been restricted in compliance with applicable regulations.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setUnderAgeBlocked(false)}
                className="px-6 py-2 rounded-lg bg-[#1F1F1F] text-xs font-semibold text-[#E5C158] hover:text-white border border-[#333] hover:border-[#D4AF37]"
              >
                Go Back & Review Age Confirmation
              </button>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="text-[10px] text-gray-500 font-serif-luxury italic border-t border-[#222] pt-3">
          Quality Shisha &bull; Royal Taste &bull; 100% Herbal Shisha &bull; All Rights Reserved
        </div>
      </div>
    </div>
  );
};
