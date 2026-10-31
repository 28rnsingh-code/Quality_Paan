import React from 'react';
import { Award, Truck, Lock, PackageCheck, ShieldCheck } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  const badges = [
    {
      icon: Award,
      title: 'Premium Quality',
      subtitle: 'Handpicked & Finest Ingredients',
    },
    {
      icon: Truck,
      title: 'Fast & Discreet Delivery',
      subtitle: 'Quick Delivery at your Doorstep',
    },
    {
      icon: Lock,
      title: 'Secure Payments',
      subtitle: '100% Safe & Encrypted',
    },
    {
      icon: PackageCheck,
      title: 'Discreet Packaging',
      subtitle: 'Private, Odorless & Tamper-Proof',
    },
    {
      icon: ShieldCheck,
      title: '100% Authentic & Trusted',
      subtitle: 'Certified Quality You Can Trust',
    },
  ];

  return (
    <div className="w-full bg-[#0D0D0D] border-b border-[#C59B27]/20 py-6 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
        {badges.map((badge, idx) => {
          const IconComponent = badge.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#121212] border border-[#C59B27]/25 hover:border-[#D4AF37]/60 hover:bg-[#181818] transition-all group shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
            >
              <div className="p-2.5 rounded-lg bg-gradient-to-br from-[#2A2008] to-[#141005] border border-[#C59B27]/40 text-[#D4AF37] group-hover:scale-110 transition-transform flex-shrink-0">
                <IconComponent className="w-5 h-5 text-[#E5C158]" />
              </div>
              <div className="flex flex-col">
                <h4 className="font-royal text-xs sm:text-sm font-bold text-[#F3EFE0] tracking-wide group-hover:text-[#E5C158] transition-colors leading-tight">
                  {badge.title}
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                  {badge.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
