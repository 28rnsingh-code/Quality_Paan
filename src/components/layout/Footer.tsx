import React from 'react';
import { 
  Award, 
  Truck, 
  Lock, 
  Package, 
  Headphones, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldAlert, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { QualityPaanLogo } from '../brand/Logo';
import { useApp } from '../../context/AppContext';
import { ProductCategory } from '../../types';

export const Footer: React.FC = () => {
  const { setCurrentPage, setSelectedCategory, homepageConfig } = useApp();

  const handleCategoryNav = (cat: ProductCategory) => {
    setSelectedCategory(cat);
    setCurrentPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageNav = (page: any) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050505] text-gray-300 border-t border-[#C59B27]/30 mt-16">
      {/* 1. TOP 5 FEATURE PILLARS (Matching Mockup) */}
      <div className="border-b border-[#C59B27]/20 py-8 px-4 sm:px-8 bg-[#090909]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
          {/* Feature 1 */}
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#181818] border border-[#C59B27]/40 flex items-center justify-center text-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.2)]">
              <Award className="w-6 h-6 text-[#E5C158]" />
            </div>
            <h4 className="font-royal text-xs sm:text-sm font-bold text-[#E5C158] uppercase tracking-wider">
              PREMIUM QUALITY
            </h4>
            <p className="text-[11px] text-gray-400 max-w-[160px]">
              Handpicked & Finest Ingredients
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#181818] border border-[#C59B27]/40 flex items-center justify-center text-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.2)]">
              <Truck className="w-6 h-6 text-[#E5C158]" />
            </div>
            <h4 className="font-royal text-xs sm:text-sm font-bold text-[#E5C158] uppercase tracking-wider">
              FAST & DISCREET DELIVERY
            </h4>
            <p className="text-[11px] text-gray-400 max-w-[160px]">
              Quick Delivery at your Doorstep
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#181818] border border-[#C59B27]/40 flex items-center justify-center text-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.2)]">
              <Lock className="w-6 h-6 text-[#E5C158]" />
            </div>
            <h4 className="font-royal text-xs sm:text-sm font-bold text-[#E5C158] uppercase tracking-wider">
              SECURE PAYMENTS
            </h4>
            <p className="text-[11px] text-gray-400 max-w-[160px]">
              100% Safe & Secure UPI / Card
            </p>
          </div>

          {/* Feature 4 */}
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#181818] border border-[#C59B27]/40 flex items-center justify-center text-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.2)]">
              <Package className="w-6 h-6 text-[#E5C158]" />
            </div>
            <h4 className="font-royal text-xs sm:text-sm font-bold text-[#E5C158] uppercase tracking-wider">
              DISCREET PACKAGING
            </h4>
            <p className="text-[11px] text-gray-400 max-w-[160px]">
              Private, Tamper-Proof & Odorless
            </p>
          </div>

          {/* Feature 5 */}
          <div className="flex flex-col items-center space-y-2 col-span-2 md:col-span-1">
            <div className="w-12 h-12 rounded-full bg-[#181818] border border-[#C59B27]/40 flex items-center justify-center text-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.2)]">
              <Headphones className="w-6 h-6 text-[#E5C158]" />
            </div>
            <h4 className="font-royal text-xs sm:text-sm font-bold text-[#E5C158] uppercase tracking-wider">
              CUSTOMER SUPPORT
            </h4>
            <p className="text-[11px] text-gray-400 max-w-[160px]">
              24x7 Support We&apos;re Here for You
            </p>
          </div>
        </div>
      </div>

      {/* 2. ROYAL BANNER STRIP (Matching Mockup) */}
      <div className="border-b border-[#C59B27]/20 py-8 px-4 sm:px-8 bg-gradient-to-r from-[#0C0B05] via-[#151208] to-[#0C0B05] text-center">
        <div className="max-w-4xl mx-auto space-y-2">
          <div className="flex items-center justify-center gap-2 text-[#2ECC71]">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs uppercase tracking-widest font-semibold text-[#D4AF37]">
              ROYAL HERITAGE EXPERIENCE
            </span>
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <h3 className="font-royal text-xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0A0] via-[#E5C158] to-[#B3851B] tracking-wider">
            TASTE THE ROYALTY, FEEL THE DIFFERENCE.
          </h3>
          <p className="font-serif-luxury text-sm sm:text-base text-[#DCD1B4] tracking-widest uppercase">
            QUALITY YOU CAN TRUST
          </p>
        </div>
      </div>

      {/* 3. MAIN FOOTER LINKS & BRAND COLUMN */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Brand & Logo Column */}
        <div className="lg:col-span-2 space-y-4">
          <QualityPaanLogo
            size="lg"
            variant="horizontal"
            onClick={() => handlePageNav('home')}
          />
          <p className="text-xs text-gray-400 leading-relaxed pr-6">
            Premier luxury destination for handcrafted Egyptian hookahs & shisha, 100% herbal flavours, glass bongs & organic rolling papers, torch lighters, luxury ashtrays, and exotic ambient fragrances delivered with speed and confidentiality.
          </p>
          <div className="space-y-1.5 text-xs text-gray-300">
            <p className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#D4AF37]" /> {homepageConfig.footerPhone}
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#D4AF37]" /> {homepageConfig.footerEmail}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" /> {homepageConfig.footerAddress}
            </p>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <h5 className="font-royal text-xs sm:text-sm font-bold text-[#E5C158] uppercase tracking-wider">
            Categories
          </h5>
          <ul className="space-y-2 text-xs text-gray-400">
            <li>
              <button onClick={() => handleCategoryNav('hookah')} className="hover:text-[#E5C158] transition-colors">
                Hookah / Shisha
              </button>
            </li>
            <li>
              <button onClick={() => handleCategoryNav('flavours')} className="hover:text-[#E5C158] transition-colors">
                Flavours (Herbal Shisha)
              </button>
            </li>
            <li>
              <button onClick={() => handleCategoryNav('bongs_rolls')} className="hover:text-[#E5C158] transition-colors">
                Bongs & Rolls
              </button>
            </li>
            <li>
              <button onClick={() => handleCategoryNav('lighters_ashtray')} className="hover:text-[#E5C158] transition-colors">
                Lighters & Ashtrays
              </button>
            </li>
            <li>
              <button onClick={() => handleCategoryNav('fragrances')} className="hover:text-[#E5C158] transition-colors">
                Fragrances & Bakhoor
              </button>
            </li>
          </ul>
        </div>

        {/* Quick Links & Services */}
        <div className="space-y-3">
          <h5 className="font-royal text-xs sm:text-sm font-bold text-[#E5C158] uppercase tracking-wider">
            Customer Care
          </h5>
          <ul className="space-y-2 text-xs text-gray-400">
            <li>
              <button onClick={() => handlePageNav('my-orders')} className="hover:text-[#E5C158] transition-colors">
                Track My Order
              </button>
            </li>
            <li>
              <button onClick={() => handlePageNav('account')} className="hover:text-[#E5C158] transition-colors">
                My Profile & Addresses
              </button>
            </li>

            <li>
              <button onClick={() => handlePageNav('combos')} className="hover:text-[#E5C158] transition-colors">
                Party Combos & Bundles
              </button>
            </li>
            <li>
              <button onClick={() => handlePageNav('offers')} className="hover:text-[#E5C158] transition-colors">
                Special Offers & Coupons
              </button>
            </li>
            <li>
              <button onClick={() => handlePageNav('contact')} className="hover:text-[#E5C158] transition-colors">
                Contact & Support
              </button>
            </li>
          </ul>
        </div>

        {/* Legal & Compliance */}
        <div className="space-y-3">
          <h5 className="font-royal text-xs sm:text-sm font-bold text-[#E5C158] uppercase tracking-wider">
            Policies & Legal
          </h5>
          <ul className="space-y-2 text-xs text-gray-400">
            <li>
              <button onClick={() => handlePageNav('privacy')} className="hover:text-[#E5C158] transition-colors">
                Privacy Policy
              </button>
            </li>
            <li>
              <button onClick={() => handlePageNav('terms')} className="hover:text-[#E5C158] transition-colors">
                Terms of Service
              </button>
            </li>
            <li>
              <button onClick={() => handlePageNav('refund')} className="hover:text-[#E5C158] transition-colors">
                Refund & Cancellation Policy
              </button>
            </li>
            <li>
              <button onClick={() => handlePageNav('about')} className="hover:text-[#E5C158] transition-colors">
                About Quality Paan
              </button>
            </li>
            <li className="pt-2">
              <div className="p-2.5 rounded bg-[#141414] border border-amber-900/40 text-[10px] text-amber-300 flex items-start gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <span>18+ Age Restricted for Tobacco products. Govt rules apply.</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* 4. BOTTOM GOLD STRIP: "THANK YOU FOR CHOOSING QUALITY. Come Once, Visit Again!" */}
      <div className="bg-[#000000] border-t border-[#C59B27]/30 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <p className="flex items-center gap-1.5 text-[#E5C158] font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="font-royal tracking-wider font-bold">THANK YOU FOR CHOOSING QUALITY.</span>
            <span className="font-serif-luxury italic text-[#FFF0A0]">&ldquo;Come Once, Visit Again!&rdquo;</span>
          </p>

          <p className="text-[11px] text-gray-500">
            © {new Date().getFullYear()} Quality Paan. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
