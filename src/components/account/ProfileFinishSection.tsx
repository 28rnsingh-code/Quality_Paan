import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  CreditCard, 
  Calendar, 
  User, 
  Lock, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  Edit3
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ImageUploadField } from '../admin/ImageUploadField';

export const ProfileFinishSection: React.FC = () => {
  const { user, verifyCustomerPan, showToast } = useApp();

  const [panNumberInput, setPanNumberInput] = useState(user?.panNumber || '');
  const [holderNameInput, setHolderNameInput] = useState(user?.panHolderName || user?.fullName || '');
  const [dobInput, setDobInput] = useState(user?.panDob || '1995-01-01');
  const [panProofUrl, setPanProofUrl] = useState(user?.panProofUrl || (user as any)?.dobProofUrl || '');
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showFaq, setShowFaq] = useState(false);

  if (!user) return null;

  // Calculate Age from DOB
  const calculateAge = (dobString: string): number => {
    if (!dobString) return 0;
    const birth = new Date(dobString);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const currentAge = calculateAge(dobInput);
  const isPanFormatValid = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumberInput.trim().toUpperCase());

  // Handle PAN verification submit
  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!panNumberInput.trim()) {
      showToast('Please enter your 10-character PAN Card number.', 'warning');
      return;
    }
    if (!isPanFormatValid) {
      showToast('Invalid PAN format! Must be 5 letters, 4 digits, 1 letter (e.g. ABCPS1289R).', 'error');
      return;
    }
    if (!holderNameInput.trim()) {
      showToast('Please enter the full name as written on your PAN card.', 'warning');
      return;
    }
    if (!dobInput) {
      showToast('Please specify your Date of Birth.', 'warning');
      return;
    }
    if (currentAge < 18) {
      showToast('Verification Failed: You must be 18 years or older as required by law.', 'error');
      return;
    }
    if (!panProofUrl) {
      showToast('Please upload a clear photograph or scan of your PAN Card for legal 18+ age verification.', 'warning');
      return;
    }
    if (!termsAgreed && !user.panVerified) {
      showToast('Please agree to the 18+ age confirmation declaration.', 'warning');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const success = verifyCustomerPan(panNumberInput, holderNameInput, dobInput, panProofUrl);
      setIsSubmitting(false);
      if (success) {
        setIsEditing(false);
      }
    }, 600);
  };

  const isVerified = user.panVerified;

  // Completion calculation
  const hasBasicDetails = !!(user.fullName && user.email && user.phone);
  const hasAddress = user.addresses.length > 0;
  const hasPan = isVerified;
  
  const completionScore = (hasBasicDetails ? 35 : 0) + (hasAddress ? 35 : 0) + (hasPan ? 30 : 0);

  return (
    <div className="space-y-4">
      {/* Progress & Highlight Header */}
      <div className={`p-6 rounded-2xl border transition-all ${
        isVerified 
          ? 'bg-gradient-to-r from-[#121B13] via-[#0E170F] to-[#142316] border-[#2ECC71]/40 shadow-[0_0_25px_rgba(46,204,113,0.12)]' 
          : 'bg-gradient-to-r from-[#1F1706] via-[#161205] to-[#251A07] border-[#E5C158] shadow-[0_0_30px_rgba(229,193,88,0.2)]'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#333]/50">
          <div className="flex items-start sm:items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
              isVerified 
                ? 'bg-[#2ECC71]/20 text-[#2ECC71] border border-[#2ECC71]/40' 
                : 'bg-[#D4AF37]/20 text-[#E5C158] border border-[#D4AF37]/50 animate-pulse'
            }`}>
              {isVerified ? <ShieldCheck className="w-7 h-7" /> : <CreditCard className="w-7 h-7" />}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-royal text-lg font-bold text-white tracking-wide">
                  {isVerified ? '18+ Government Verification: Verified' : 'Complete Profile: 18+ Age PAN Confirmation'}
                </h3>
                {isVerified ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#2ECC71]/20 text-[#2ECC71] border border-[#2ECC71]/50 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> 100% Profile Complete
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#E5C158] text-black shadow font-royal flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Action Required (Extra Step)
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-300 mt-1">
                {isVerified 
                  ? 'Your identity and 18+ age have been officially authenticated for luxury shisha and premium accessory express delivery.'
                  : 'Indian law mandates 18+ adult age confirmation for shisha and premium smoking accessories. Enter your PAN card and upload your card photo below to finish your profile.'}
              </p>
            </div>
          </div>

          {/* Profile Completion Meter */}
          <div className="min-w-[140px] bg-[#161616] p-3 rounded-xl border border-[#2A2A2A] text-right">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-400">Profile Status:</span>
              <span className={`font-bold ${completionScore === 100 ? 'text-[#2ECC71]' : 'text-[#E5C158]'}`}>
                {completionScore}%
              </span>
            </div>
            <div className="w-full bg-[#262626] h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-700 rounded-full ${
                  completionScore === 100 
                    ? 'bg-gradient-to-r from-[#2ECC71] to-[#27AE60]' 
                    : 'bg-gradient-to-r from-[#D4AF37] to-[#E5C158]'
                }`}
                style={{ width: `${completionScore}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-1">
              {completionScore === 100 ? 'All badges unlocked' : 'Pending PAN verification'}
            </p>
          </div>
        </div>

        {/* VERIFIED STATE VIEW */}
        {isVerified && !isEditing ? (
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#141414] border border-[#262626]">
              <span className="text-gray-400 block text-[11px]">PAN Card Number</span>
              <span className="font-mono text-white text-sm font-bold tracking-widest">
                {user.panNumber 
                  ? `${user.panNumber.slice(0, 5)}****${user.panNumber.slice(-1)}` 
                  : 'ABCPS****R'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#141414] border border-[#262626]">
              <span className="text-gray-400 block text-[11px]">Name on PAN Card</span>
              <span className="text-white font-bold tracking-wide truncate block">
                {user.panHolderName || user.fullName}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#141414] border border-[#262626]">
              <span className="text-gray-400 block text-[11px]">Age & Date of Birth</span>
              <span className="text-[#2ECC71] font-bold">
                {user.panDob ? `${new Date(user.panDob).toLocaleDateString('en-IN')} (18+ Confirmed)` : '18+ Verified'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#141414] border border-[#262626] flex items-center justify-between">
              <div>
                <span className="text-gray-400 block text-[11px]">Verified At</span>
                <span className="text-gray-200">
                  {user.panVerifiedAt 
                    ? new Date(user.panVerifiedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'Active'}
                </span>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 rounded-lg bg-[#222] hover:bg-[#D4AF37] text-gray-300 hover:text-black transition-colors"
                title="Update PAN details"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>

            {user.panProofUrl && (
              <div className="col-span-full p-3 bg-[#111] rounded-xl border border-[#282828] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img 
                    src={user.panProofUrl} 
                    alt="PAN Card Age Proof Document" 
                    className="w-16 h-11 object-cover rounded-lg border border-[#3A3A3A] shadow"
                  />
                  <div>
                    <span className="text-white font-bold text-xs block">Government PAN Card Photo ID</span>
                    <span className="text-[11px] text-[#2ECC71] flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3 h-3 text-[#2ECC71]" /> Attached Age Proof Document
                    </span>
                  </div>
                </div>
                <a 
                  href={user.panProofUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-xs text-[#E5C158] hover:underline flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#181818] border border-[#333]"
                >
                  View Photo <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        ) : (
          /* FORM VIEW: Complete / Finish Profile with PAN Card */
          <form onSubmit={handleVerifySubmit} className="pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* PAN Input */}
              <div className="space-y-1">
                <label className="text-xs text-gray-300 font-semibold flex items-center justify-between">
                  <span>PAN Card Number (10 Chars) *</span>
                  {panNumberInput && (
                    <span className={`text-[10px] font-mono ${isPanFormatValid ? 'text-[#2ECC71]' : 'text-amber-400'}`}>
                      {isPanFormatValid ? '✓ Valid Format' : 'Must be e.g. ABCDE1234F'}
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={10}
                    required
                    placeholder="e.g. ABCPS1289R"
                    value={panNumberInput}
                    onChange={(e) => setPanNumberInput(e.target.value.toUpperCase())}
                    className={`w-full bg-[#181818] px-3 py-2.5 rounded-xl border text-sm font-mono tracking-wider uppercase text-white focus:outline-none transition-colors ${
                      panNumberInput && isPanFormatValid 
                        ? 'border-[#2ECC71] focus:border-[#2ECC71]' 
                        : 'border-[#444] focus:border-[#E5C158]'
                    }`}
                  />
                  <CreditCard className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Name as on PAN */}
              <div className="space-y-1">
                <label className="text-xs text-gray-300 font-semibold block">
                  Full Name as on PAN Card *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. RAHUL SINGH"
                    value={holderNameInput}
                    onChange={(e) => setHolderNameInput(e.target.value.toUpperCase())}
                    className="w-full bg-[#181818] px-3 py-2.5 rounded-xl border border-[#444] focus:border-[#E5C158] text-sm text-white focus:outline-none uppercase"
                  />
                  <User className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Date of Birth */}
              <div className="space-y-1">
                <label className="text-xs text-gray-300 font-semibold flex items-center justify-between">
                  <span>Date of Birth (18+ Required) *</span>
                  {dobInput && (
                    <span className={`text-[10px] font-bold ${currentAge >= 18 ? 'text-[#2ECC71]' : 'text-red-400'}`}>
                      Age: {currentAge} yrs {currentAge >= 18 ? '(Eligible)' : '(Underage)'}
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                    value={dobInput}
                    onChange={(e) => setDobInput(e.target.value)}
                    className="w-full bg-[#181818] px-3 py-2.5 rounded-xl border border-[#444] focus:border-[#E5C158] text-sm text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* PAN Card Image Upload */}
            <div className="p-4 rounded-xl bg-[#181818] border border-[#2B2B2B] space-y-3">
              <ImageUploadField
                label="PAN Card Image Age Proof * (Clear Photograph / Scan)"
                value={panProofUrl}
                onChange={(url) => setPanProofUrl(url)}
                folder="pan_cards"
                aspectRatio="video"
                helperText="Indian statutory regulations mandate a physical proof of age for shisha and accessory delivery. Please upload a clear image of your PAN card."
              />
            </div>

            {/* Statutory Declaration Checkbox */}
            <label className="flex items-start gap-2.5 p-3 rounded-xl bg-[#141414] border border-[#282828] cursor-pointer hover:border-[#444] transition-colors">
              <input
                type="checkbox"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="mt-0.5 rounded text-[#D4AF37] focus:ring-0 border-gray-600 bg-[#222] w-4 h-4"
              />
              <span className="text-xs text-gray-300 leading-relaxed">
                I hereby solemnly declare and confirm under Indian statutory regulations that I am <strong>18 years of age or older</strong> and legally permitted to purchase imperial shisha sets, herbal shisha flavours, organic rolling papers, and luxury smoking accessories.
              </span>
            </label>

            {/* Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Lock className="w-3.5 h-3.5 text-[#E5C158]" />
                <span>256-Bit SSL Encrypted Verification • Private & Confidential</span>
              </div>

              <div className="flex items-center gap-2">
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl bg-[#1F1F1F] text-xs font-bold text-gray-300 hover:bg-[#2A2A2A]"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting || !isPanFormatValid || currentAge < 18}
                  className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-black font-royal font-bold text-xs flex items-center gap-2 hover:brightness-110 shadow disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isSubmitting ? 'Verifying card proof...' : 'Verify PAN & Finish Profile'}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Accordion: Why PAN is Required for Paan Delivery */}
      <div className="rounded-xl bg-[#121212] border border-[#222] overflow-hidden text-xs">
        <button
          type="button"
          onClick={() => setShowFaq(!showFaq)}
          className="w-full p-3.5 text-left flex items-center justify-between text-gray-400 hover:text-white transition-colors"
        >
          <span className="font-semibold flex items-center gap-2 text-[#E5C158]">
            <AlertCircle className="w-4 h-4 text-[#E5C158]" />
            Why is PAN Card verification required for Quality Shisha customers?
          </span>
          {showFaq ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {showFaq && (
          <div className="p-4 pt-1 border-t border-[#222] space-y-2 text-gray-300 leading-relaxed bg-[#101010]">
            <p>
              • <strong>18+ Age Compliance:</strong> Herbal hookah shisha blends and accessories are regulated adult products in India. Quality Shisha Co. strictly enforces an 18+ policy.
            </p>
            <p>
              • <strong>Discreet Delivery Assurance:</strong> Having a verified PAN allows our private delivery courier fleet to execute zero-hassle, discreet doorstep handoffs without demanding physical ID checks at your front door.
            </p>
            <p>
              • <strong>Data Privacy:</strong> Your PAN details and images are masked, encrypted, and stored solely for adult compliance purposes. We never sell or share customer data with third parties.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
