import React from 'react';
import { CoinPulseCoin } from './CoinPulseCoin';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
  className?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showBadge = true,
  className = '',
  onClick,
}) => {
  const coinSizes = {
    sm: 22,
    md: 28,
    lg: 38,
  };

  const textSizes = {
    sm: 'text-base font-semibold',
    md: 'text-xl font-bold',
    lg: 'text-2xl font-bold',
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 cursor-pointer select-none group ${className}`}
    >
      <CoinPulseCoin size={coinSizes[size]} animated />
      <div className="flex items-center gap-2">
        <span
          className={`tracking-tight text-[#F1F5FB] font-['Space_Grotesk'] ${textSizes[size]} transition-colors group-hover:text-[#70EDF2]`}
        >
          Coin<span className="text-[#28D7E5]">Pulse</span>
        </span>
        {showBadge && (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold font-mono tracking-wider bg-[#28D7E5]/10 text-[#28D7E5] border border-[#28D7E5]/25">
            DEMO
          </span>
        )}
      </div>
    </div>
  );
};
