import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Sparkles, CheckCircle2, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HeroBanner: React.FC = () => {
  const { homepageConfig, setCurrentPage, setSelectedCategory } = useApp();
  const slides = homepageConfig.slides && homepageConfig.slides.length > 0 ? homepageConfig.slides : [
    {
      id: 'default-1',
      image: homepageConfig.heroImage || '',
      tagline: homepageConfig.heroTagline || 'Authentic Hookahs, Premium Papers & Luxury Accessories.',
      ctaText: homepageConfig.heroCtaText || 'EXPLORE CATALOG >',
      announcement: homepageConfig.announcementText || '✓ Royal Luxury Connoisseur Smoke Shop',
    }
  ];

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const currentSlide = slides[currentSlideIndex] || slides[0];

  const handleShopNow = () => {
    const cta = (currentSlide.ctaText || '').toUpperCase();
    if (cta.includes('FLAVOUR')) {
      setSelectedCategory('flavours');
    } else if (cta.includes('BONG') || cta.includes('ACCESSOR')) {
      setSelectedCategory('bongs_rolls');
    } else if (cta.includes('FRAGRANCE')) {
      setSelectedCategory('fragrances');
    } else {
      setSelectedCategory('hookah');
    }
    setCurrentPage('shop');
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-b from-[#0A0A0A] via-[#0D0D0D] to-[#080808] border-b border-[#C59B27]/30 py-8 md:py-16 px-4 sm:px-8">
      {/* Background ambient smoke & subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(197,155,39,0.12),transparent_60%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(#C59B27_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Announcement Marquee Bar (changes per slide) */}
      {currentSlide.announcement && (
        <div className="max-w-7xl mx-auto mb-6 p-2.5 rounded-xl bg-[#161205] border border-[#D4AF37]/40 text-center text-xs text-[#E5C158] font-semibold animate-pulse shadow-md">
          {currentSlide.announcement}
        </div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        {/* LEFT COLUMN: Royal Typography & CTA */}
        <div className="lg:col-span-6 space-y-6 text-center lg:text-left transition-all duration-500">
          {/* Ornate Gold Filigree & Subtitle */}
          <div className="inline-flex items-center gap-3">
            <span className="h-[1px] w-8 sm:w-12 bg-gradient-to-r from-transparent to-[#C59B27]" />
            <span className="font-royal text-xs sm:text-sm md:text-base font-bold tracking-[0.25em] text-[#D4AF37] uppercase flex items-center gap-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              <Sparkles className="w-4 h-4 text-[#E5C158]" />
              {homepageConfig.heroSubtitle || 'ROYAL LUXURY HOOKAH & SHISHA'}
            </span>
            <span className="h-[1px] w-8 sm:w-12 bg-gradient-to-l from-transparent to-[#C59B27]" />
          </div>

          {/* Main Title */}
          <h1 className="font-royal text-3xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5C0] via-[#E5C158] to-[#B3851B] leading-[1.15] tracking-[0.04em] drop-shadow-[0_4px_16px_rgba(212,175,55,0.3)]">
            PERFECT TASTE
            <br />
            <span className="text-[#F3EFE0] tracking-[0.06em]">EVERY TIME</span>
          </h1>

          {/* Sliding Tagline */}
          <p className="text-gray-300 font-serif-luxury text-lg sm:text-xl md:text-2xl italic tracking-wide text-[#E0D8C3] min-h-[4rem] transition-all duration-500">
            &ldquo;{currentSlide.tagline}&rdquo;
          </p>

          {/* Quick Value Highlights */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs sm:text-sm text-gray-300 pt-1">
            <span className="flex items-center gap-1.5 bg-[#141414] px-3 py-1 rounded-full border border-[#C59B27]/30">
              <CheckCircle2 className="w-4 h-4 text-[#2ECC71]" /> 100% Herbal & Nicotine-Free Flavours
            </span>
            <span className="flex items-center gap-1.5 bg-[#141414] px-3 py-1 rounded-full border border-[#C59B27]/30">
              <Shield className="w-4 h-4 text-[#D4AF37]" /> Discreet Express Delivery
            </span>
          </div>

          {/* CTA Buttons & Slide Controls */}
          <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
            <button
              onClick={handleShopNow}
              id="hero-shop-now-btn"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-royal font-bold text-sm sm:text-base text-black bg-gradient-to-r from-[#F3D079] via-[#D4AF37] to-[#9B7817] hover:brightness-110 active:scale-95 transition-all shadow-[0_6px_24px_rgba(212,175,55,0.4)] cursor-pointer group"
            >
              <span>{currentSlide.ctaText || 'SHOP HOOKAHS >'}</span>
              <ChevronRight className="w-5 h-5 text-black group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Slide Navigation Buttons */}
            {slides.length > 1 && (
              <div className="flex items-center gap-2 ml-auto lg:ml-0 pt-2">
                <button
                  onClick={prevSlide}
                  className="p-2.5 rounded-full bg-[#1A1A1A] border border-[#C59B27]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all cursor-pointer shadow"
                  title="Previous Slide"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1.5 px-2">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        idx === currentSlideIndex ? 'w-6 bg-[#D4AF37]' : 'w-2 bg-gray-600 hover:bg-gray-400'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={nextSlide}
                  className="p-2.5 rounded-full bg-[#1A1A1A] border border-[#C59B27]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all cursor-pointer shadow"
                  title="Next Slide"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Sliding Hero Banner Image */}
        <div className="lg:col-span-6 relative flex items-center justify-center">
          <div className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-[#C59B27]/20 rounded-full filter blur-3xl -z-10 pointer-events-none" />

          <div className="relative rounded-2xl overflow-hidden border border-[#C59B27]/40 shadow-[0_12px_40px_rgba(0,0,0,0.9)] max-w-lg w-full aspect-[4/3] group transition-all duration-700 bg-gradient-to-br from-[#1C1608] via-[#100D06] to-[#080808] flex items-center justify-center">
            {currentSlide.image ? (
              <img
                src={currentSlide.image}
                alt="Royal Luxury Presentation"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95 contrast-105"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-radial-gradient">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#D4AF37]/20 via-[#F3D079]/30 to-[#8C660B]/20 border-2 border-[#D4AF37] flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                  <Sparkles className="w-10 h-10 text-[#F3D079]" />
                </div>
                <h3 className="font-royal text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#F3D079] via-[#D4AF37] to-[#9B7817] mb-2 tracking-wide uppercase">
                  ROYAL HERITAGE
                </h3>
                <p className="text-xs text-[#E5C158]/80 font-medium max-w-xs leading-relaxed">
                  Connoisseur Quality &bull; 100% Authentic &bull; Discreet Doorstep Delivery
                </p>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#0A0A0A]/90 backdrop-blur-md border-2 border-[#D4AF37] p-1 flex flex-col items-center justify-center text-center shadow-[0_4px_16px_rgba(212,175,55,0.4)] animate-spin-slow">
              <Sparkles className="w-4 h-4 text-[#D4AF37] mb-0.5" />
              <span className="text-[8px] sm:text-[9px] font-royal font-bold text-[#E5C158] leading-tight">
                ROYAL<br />HOOKAH
              </span>
              <span className="text-[7px] text-[#A89050] tracking-tighter">PREMIUM SHISHA</span>
            </div>

            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-gray-300">
              <span className="font-royal text-[#E5C158] text-xs sm:text-sm font-semibold drop-shadow-md">
                Slide {currentSlideIndex + 1} of {slides.length} &bull; Handcrafted Luxury
              </span>
              <span className="bg-black/70 px-2 py-0.5 rounded text-[11px] text-[#2ECC71] border border-[#2ECC71]/30">
                Dense Clouds
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
