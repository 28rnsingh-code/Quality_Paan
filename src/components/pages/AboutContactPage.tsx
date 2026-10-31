import React, { useState } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Award, 
  Sparkles, 
  Send, 
  CheckCircle2,
  Lock,
  Package
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { QualityPaanLogo } from '../brand/Logo';

export const AboutContactPage: React.FC = () => {
  const { currentPage, setCurrentPage, homepageConfig } = useApp();
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setContactName('');
      setContactEmail('');
      setContactPhone('');
      setContactMessage('');
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-8 space-y-12">
      {/* 1. ABOUT SECTION */}
      {(currentPage === 'about' || currentPage === 'contact') && (
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2A2005] border border-[#C59B27]/50 text-[#E5C158] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>THE ROYAL HERITAGE OF QUALITY SHISHA</span>
            </div>
            <h1 className="font-royal text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0A0] via-[#E5C158] to-[#B3851B]">
              Taste The Royalty. Feel The Difference.
            </h1>
            <p className="text-sm text-gray-300 font-serif-luxury italic">
              Handpicked Ingredients. Royal Recipes. Quality You Can Trust.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-[#121212] p-6 sm:p-8 rounded-2xl border border-[#C59B27]/30">
            <div className="space-y-4 text-xs sm:text-sm text-gray-300 leading-relaxed">
              <p>
                Founded on the timeless traditions of ancient royal courts and modern craftsmanship, <strong className="text-[#E5C158]">Quality Shisha Co.</strong> elevates the cultural heritage of gourmet shisha and lounge accessories into an art form.
              </p>
              <p>
                Every single shisha set and herbal flavour is personally inspected for quality and purity. We source tender herbal molasses, authentic organic flavours, 24-Karat gold electroplated components, heavy crystal glass, and natural coconut charcoals to deliver unparalleled sessions.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-lg bg-[#181818] border border-[#C59B27]/25 flex items-center gap-2 text-[#E5C158] font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#2ECC71]" /> 100% Fresh Daily
                </div>
                <div className="p-3 rounded-lg bg-[#181818] border border-[#C59B27]/25 flex items-center gap-2 text-[#E5C158] font-bold">
                  <Package className="w-4 h-4 text-[#D4AF37]" /> Discreet Express Box
                </div>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-[#C59B27]/40 shadow-2xl aspect-[4/3] bg-gradient-to-br from-[#1C1608] via-[#100D06] to-[#080808] flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center mb-3">
                <Sparkles className="w-8 h-8 text-[#F3D079]" />
              </div>
              <h4 className="font-royal text-lg font-bold text-[#F3D079] tracking-wider uppercase mb-1">Authentic Quality</h4>
              <p className="text-xs text-[#E5C158]/70 max-w-xs">Premium Craftsmanship &bull; 100% Genuine &bull; Connoisseur Standards</p>
            </div>
          </div>
        </div>
      )}

      {/* 2. CONTACT US FORM */}
      {(currentPage === 'contact' || currentPage === 'about') && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-[#121212] rounded-2xl border border-[#C59B27]/30 p-6 sm:p-8">
          <div className="md:col-span-5 space-y-6">
            <div>
              <h3 className="font-royal text-xl font-bold text-[#E5C158]">
                Get In Touch With Us
              </h3>
              <p className="text-xs text-gray-400 font-serif-luxury italic mt-1">
                For bulk party catering, custom hookah lounges & customer assistance
              </p>
            </div>

            <div className="space-y-3.5 text-xs text-gray-300">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Helpline & WhatsApp:</span>
                  <span>{homepageConfig.footerPhone}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Email:</span>
                  <span>{homepageConfig.footerEmail}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Flagship Store:</span>
                  <span>{homepageConfig.footerAddress}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Delivery Hours:</span>
                  <span>10:00 AM &mdash; 02:00 AM (Midnight Express Delivery)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-7">
            {isSubmitted ? (
              <div className="p-6 rounded-xl bg-[#162916] border border-[#2ECC71]/40 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[#2ECC71] mx-auto" />
                <h4 className="font-royal text-base font-bold text-[#2ECC71]">Message Dispatched!</h4>
                <p className="text-xs text-gray-300">Our customer team will contact you within 15 minutes.</p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-xs text-[#E5C158] underline mt-2"
                >
                  Send another enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-gray-400 block mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikramaditya"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full bg-[#1A1A1A] px-3 py-2.5 rounded border border-[#333] text-white focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full bg-[#1A1A1A] px-3 py-2.5 rounded border border-[#333] text-white focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full bg-[#1A1A1A] px-3 py-2.5 rounded border border-[#333] text-white focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">Enquiry / Feedback Details</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us your requirement or delivery query..."
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full bg-[#1A1A1A] px-3 py-2.5 rounded border border-[#333] text-white focus:border-[#D4AF37]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-[#D4AF37] text-black font-royal font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>SUBMIT ENQUIRY</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 3. POLICIES & LEGAL (Privacy, Terms, Refund) */}
      {(currentPage === 'privacy' || currentPage === 'terms' || currentPage === 'refund') && (
        <div className="p-8 rounded-2xl bg-[#121212] border border-[#C59B27]/30 space-y-6 text-xs sm:text-sm text-gray-300 leading-relaxed">
          <div className="border-b border-[#252525] pb-4">
            <h2 className="font-royal text-2xl font-bold text-[#E5C158]">
              {currentPage === 'privacy' && 'Privacy & Discreet Delivery Policy'}
              {currentPage === 'terms' && 'Terms of Service & Age Restrictions'}
              {currentPage === 'refund' && 'Freshness Guarantee & Refund Policy'}
            </h2>
            <p className="text-xs text-gray-500 mt-1">Last revised: August 2026</p>
          </div>

          {currentPage === 'privacy' && (
            <div className="space-y-4">
              <h4 className="font-royal text-base text-[#F3EFE0] font-bold">1. 100% Confidential Discreet Packaging</h4>
              <p>
                All shipments are dispatched in unmarked, neutral outer boxes with no mention of brand contents, tobacco items, or shisha accessories on the exterior label. Your confidentiality is protected.
              </p>
              <h4 className="font-royal text-base text-[#F3EFE0] font-bold">2. Data Security & Payment Encryption</h4>
              <p>
                Customer phone numbers, addresses, and payment credentials are encrypted using industry-standard 256-bit SSL protocols. We never sell or share customer contact records.
              </p>
            </div>
          )}

          {currentPage === 'terms' && (
            <div className="space-y-4">
              <h4 className="font-royal text-base text-[#F3EFE0] font-bold">1. Age Requirement (18+ Adult Policy)</h4>
              <p>
                Hookahs, charcoals, bongs, and smoking accessories are strictly sold only to adults aged 18 years or older. Delivery personnel may verify government photo ID or PAN card upon handover.
              </p>
              <h4 className="font-royal text-base text-[#F3EFE0] font-bold">2. 100% Herbal Shisha Flavours</h4>
              <p>
                Our signature shisha flavours (Brain Freeze, Double Apple, Pan Twist) are 100% herbal, tobacco-free, and nicotine-free.
              </p>
            </div>
          )}

          {currentPage === 'refund' && (
            <div className="space-y-4">
              <h4 className="font-royal text-base text-[#F3EFE0] font-bold">1. 100% Glassware & Quality Guarantee</h4>
              <p>
                If any glassware, pipe, or sealed item arrives damaged or defective, notify our customer support within 2 hours of delivery with an unboxing photo for an instant replacement or full refund credit.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
