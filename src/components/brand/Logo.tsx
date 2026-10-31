import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  variant?: 'full' | 'horizontal' | 'badge' | 'minimal';
  className?: string;
  onClick?: () => void;
}

export const QualityPaanLogo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'horizontal',
  className = '',
  onClick,
}) => {
  // Dimensions based on size
  const getDimensions = () => {
    switch (size) {
      case 'sm': return { width: 36, height: 36, textClass: 'text-sm' };
      case 'md': return { width: 48, height: 48, textClass: 'text-base' };
      case 'lg': return { width: 80, height: 80, textClass: 'text-xl' };
      case 'xl': return { width: 140, height: 140, textClass: 'text-2xl' };
      case 'hero': return { width: 220, height: 220, textClass: 'text-3xl' };
    }
  };

  const { width, height } = getDimensions();

  // Full SVG Emblem replicating the exact logo badge
  const LogoEmblem = () => (
    <svg
      width={width}
      height={height}
      viewBox="0 0 400 400"
      className="drop-shadow-[0_4px_16px_rgba(212,175,55,0.3)] transition-transform duration-300 hover:scale-105"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Metallic Gold Gradients */}
        <linearGradient id="qpGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2B2" />
          <stop offset="30%" stopColor="#E5C158" />
          <stop offset="55%" stopColor="#C59B27" />
          <stop offset="85%" stopColor="#8C660B" />
          <stop offset="100%" stopColor="#F5D77F" />
        </linearGradient>

        <linearGradient id="qpGoldDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C59B27" />
          <stop offset="100%" stopColor="#4A3705" />
        </linearGradient>

        <linearGradient id="qpLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2E7D32" />
          <stop offset="50%" stopColor="#1B5E20" />
          <stop offset="100%" stopColor="#0D381E" />
        </linearGradient>

        <linearGradient id="qpBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#151515" />
          <stop offset="70%" stopColor="#080808" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>

        <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer Circle Background */}
      <circle cx="200" cy="200" r="195" fill="url(#qpBgGrad)" stroke="url(#qpGoldGrad)" strokeWidth="3.5" />
      <circle cx="200" cy="200" r="187" fill="none" stroke="url(#qpGoldGrad)" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
      <circle cx="200" cy="200" r="183" fill="none" stroke="url(#qpGoldGrad)" strokeWidth="1.5" />

      {/* Royal Crown */}
      <g transform="translate(162, 38) scale(0.75)" fill="url(#qpGoldGrad)">
        <path d="M50 8 L65 35 L95 18 L80 52 L20 52 L5 18 L35 35 Z" filter="url(#goldGlow)" />
        <ellipse cx="50" cy="7" rx="3.5" ry="3.5" fill="#FFF" />
        <ellipse cx="95" cy="17" rx="3" ry="3" fill="#FFF" />
        <ellipse cx="5" cy="17" rx="3" ry="3" fill="#FFF" />
        <rect x="20" y="52" width="60" height="6" rx="2" fill="url(#qpGoldGrad)" />
        {/* Crown Jewels */}
        <circle cx="32" cy="55" r="1.8" fill="#1B5E20" />
        <circle cx="50" cy="55" r="2.2" fill="#D32F2F" />
        <circle cx="68" cy="55" r="1.8" fill="#1B5E20" />
      </g>

      {/* Stylized Golden 'Q' */}
      <g transform="translate(145, 80) scale(1.1)">
        {/* Q Outer Ring */}
        <path
          d="M 50 10 C 25 10 5 30 5 55 C 5 80 25 100 50 100 C 58 100 66 97 73 93 L 88 108 C 91 111 96 109 97 105 L 94 95 L 82 83 C 90 75 95 65 95 55 C 95 30 75 10 50 10 Z"
          fill="url(#qpGoldGrad)"
          stroke="#4A3705"
          strokeWidth="1.5"
        />
        {/* Q Inner Cutout */}
        <ellipse cx="50" cy="55" rx="30" ry="32" fill="#0A0A0A" />

        {/* Realistic Green Betel (Paan) Leaf in Center of Q */}
        <g transform="translate(26, 26) scale(0.48)">
          <path
            d="M 50 0 C 10 35 -5 75 15 105 C 30 125 50 130 50 130 C 50 130 70 125 85 105 C 105 75 90 35 50 0 Z"
            fill="url(#qpLeafGrad)"
            stroke="url(#qpGoldGrad)"
            strokeWidth="2"
          />
          {/* Paan Leaf Veins */}
          <path d="M 50 5 L 50 125" stroke="#E5C158" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
          <path d="M 50 35 Q 30 45 18 60" stroke="#E5C158" strokeWidth="1" opacity="0.6" fill="none" />
          <path d="M 50 35 Q 70 45 82 60" stroke="#E5C158" strokeWidth="1" opacity="0.6" fill="none" />
          <path d="M 50 65 Q 25 75 18 90" stroke="#E5C158" strokeWidth="1" opacity="0.6" fill="none" />
          <path d="M 50 65 Q 75 75 82 90" stroke="#E5C158" strokeWidth="1" opacity="0.6" fill="none" />
        </g>
      </g>

      {/* Left & Right Ornate Filigree Flourishes */}
      <path d="M 70 180 Q 110 168 135 178" stroke="url(#qpGoldGrad)" strokeWidth="2" fill="none" />
      <circle cx="68" cy="180" r="3" fill="url(#qpGoldGrad)" />
      <path d="M 330 180 Q 290 168 265 178" stroke="url(#qpGoldGrad)" strokeWidth="2" fill="none" />
      <circle cx="332" cy="180" r="3" fill="url(#qpGoldGrad)" />

      {/* Main Text: QUALITY */}
      <text
        x="200"
        y="235"
        textAnchor="middle"
        fontFamily="'Cinzel', 'Times New Roman', serif"
        fontSize="44"
        fontWeight="800"
        letterSpacing="6"
        fill="url(#qpGoldGrad)"
        filter="url(#goldGlow)"
      >
        QUALITY
      </text>

      {/* Subtitle: — PAAN — */}
      <g transform="translate(0, 260)">
        <line x1="105" y1="-5" x2="140" y2="-5" stroke="url(#qpGoldGrad)" strokeWidth="2" />
        <text
          x="200"
          y="0"
          textAnchor="middle"
          fontFamily="'Cinzel', 'Times New Roman', serif"
          fontSize="24"
          fontWeight="700"
          letterSpacing="8"
          fill="url(#qpGoldGrad)"
        >
          PAAN
        </text>
        <line x1="260" y1="-5" x2="295" y2="-5" stroke="url(#qpGoldGrad)" strokeWidth="2" />
      </g>

      {/* 5 Category Icons Row */}
      <g transform="translate(68, 275)" stroke="url(#qpGoldGrad)" fill="none" strokeWidth="1.5">
        {/* Box Dividers */}
        <line x1="52" y1="0" x2="52" y2="46" opacity="0.5" />
        <line x1="104" y1="0" x2="104" y2="46" opacity="0.5" />
        <line x1="158" y1="0" x2="158" y2="46" opacity="0.5" />
        <line x1="210" y1="0" x2="210" y2="46" opacity="0.5" />

        {/* 1. HOOKAH */}
        <g transform="translate(12, 4)">
          <path d="M14 4 L14 10 L8 18 L8 24 L20 24 L20 18 L14 10" />
          <path d="M10 24 Q5 28 8 32 Q14 36 20 30" />
          <text x="14" y="44" stroke="none" fill="url(#qpGoldGrad)" fontSize="8" fontFamily="'Cinzel', serif" textAnchor="middle" fontWeight="bold">HOOKAH</text>
        </g>

        {/* 2. FLAVOURS */}
        <g transform="translate(64, 4)">
          <circle cx="14" cy="18" r="8" fill="#D4AF37" fillOpacity="0.2" />
          <path d="M14 8 C10 14 8 18 14 26 C20 18 18 14 14 8 Z" fill="#2ECC71" fillOpacity="0.4" />
          <text x="14" y="44" stroke="none" fill="url(#qpGoldGrad)" fontSize="7" fontFamily="'Cinzel', serif" textAnchor="middle" fontWeight="bold">FLAVOURS</text>
        </g>

        {/* 3. BONGS & ROLLS */}
        <g transform="translate(116, 4)">
          <path d="M10 26 L14 10 L18 10 L22 26 Z" />
          <line x1="8" y1="26" x2="24" y2="26" />
          <text x="15" y="44" stroke="none" fill="url(#qpGoldGrad)" fontSize="7" fontFamily="'Cinzel', serif" textAnchor="middle" fontWeight="bold">BONGS</text>
        </g>

        {/* 4. LIGHTERS */}
        <g transform="translate(168, 4)">
          <rect x="8" y="14" width="10" height="18" rx="1.5" />
          <path d="M13 14 Q10 8 13 4 Q16 8 13 14" fill="#E5C158" fillOpacity="0.6" />
          <text x="13" y="44" stroke="none" fill="url(#qpGoldGrad)" fontSize="7" fontFamily="'Cinzel', serif" textAnchor="middle" fontWeight="bold">LIGHTERS</text>
        </g>

        {/* 5. FRAGRANCES */}
        <g transform="translate(220, 4)">
          <rect x="7" y="12" width="14" height="16" rx="2" fill="#D4AF37" fillOpacity="0.2" />
          <path d="M11 6 L17 6 L17 12 L11 12 Z" />
          <text x="14" y="44" stroke="none" fill="url(#qpGoldGrad)" fontSize="6.5" fontFamily="'Cinzel', serif" textAnchor="middle" fontWeight="bold">FRAGRANCE</text>
        </g>
      </g>

      {/* Bottom Arch Tagline: PREMIUM CHOICE, EVERY TIME. */}
      <path id="bottomCurve" d="M 70 340 A 155 155 0 0 0 330 340" fill="none" />
      <text fill="url(#qpGoldGrad)" fontSize="13" fontFamily="'Cinzel', serif" fontWeight="700" letterSpacing="3">
        <textPath href="#bottomCurve" startOffset="50%" textAnchor="middle">
          ★ PREMIUM CHOICE, EVERY TIME. ★
        </textPath>
      </text>
    </svg>
  );

  if (variant === 'badge' || variant === 'full') {
    return (
      <div 
        onClick={onClick} 
        className={`inline-flex flex-col items-center justify-center cursor-pointer select-none ${className}`}
        title="Quality Paan - Premium Choice, Every Time"
      >
        <LogoEmblem />
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div onClick={onClick} className={`inline-flex items-center gap-2 cursor-pointer ${className}`}>
        <LogoEmblem />
      </div>
    );
  }

  // Default 'horizontal' navbar variant with badge + luxury royal typography
  return (
    <div 
      onClick={onClick} 
      className={`inline-flex items-center gap-3 cursor-pointer group select-none ${className}`}
      id="brand-logo"
    >
      <div className="relative">
        <LogoEmblem />
      </div>
      <div className="flex flex-col">
        <span className="font-royal text-lg sm:text-xl font-bold tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0A0] via-[#D4AF37] to-[#A37B15] drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]">
          QUALITY
        </span>
        <span className="text-[10px] sm:text-xs font-royal tracking-[0.35em] text-[#C59B27] -mt-1 font-semibold flex items-center gap-1.5">
          <span className="h-[1px] w-3 bg-[#C59B27]/50 inline-block"></span>
          PAAN
          <span className="h-[1px] w-3 bg-[#C59B27]/50 inline-block"></span>
        </span>
      </div>
    </div>
  );
};
