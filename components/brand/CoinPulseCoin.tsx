import React from 'react';

interface CoinPulseCoinProps {
  size?: number | string;
  className?: string;
  animated?: boolean;
}

export const CoinPulseCoin: React.FC<CoinPulseCoinProps> = ({
  size = 24,
  className = '',
  animated = false,
}) => {
  const pixelSize = typeof size === 'number' ? `${size}px` : size;

  return (
    <div
      style={{ width: pixelSize, height: pixelSize }}
      className={`inline-flex items-center justify-center shrink-0 select-none ${
        animated ? 'transition-transform duration-300 hover:scale-105' : ''
      } ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        <defs>
          {/* Outer rim gradient */}
          <linearGradient id="cp_outer_rim" x1="15" y1="15" x2="85" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#70EDF2" />
            <stop offset="50%" stopColor="#28D7E5" />
            <stop offset="100%" stopColor="#14B8A6" />
          </linearGradient>

          {/* Coin deep face gradient */}
          <linearGradient id="cp_inner_face" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1B4250" />
            <stop offset="55%" stopColor="#142C38" />
            <stop offset="100%" stopColor="#0B1A24" />
          </linearGradient>

          {/* Specular rim highlight */}
          <linearGradient id="cp_specular" x1="10" y1="10" x2="60" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="35%" stopColor="#70EDF2" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#28D7E5" stopOpacity="0" />
          </linearGradient>

          {/* Pulse C glyph gradient */}
          <linearGradient id="cp_glyph_grad" x1="25" y1="25" x2="75" y2="75" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="30%" stopColor="#70EDF2" />
            <stop offset="100%" stopColor="#28D7E5" />
          </linearGradient>
        </defs>

        {/* Outer Shadow Ring */}
        <circle cx="50" cy="50" r="48" fill="#0C1924" />

        {/* Metallic Outer Rim */}
        <circle cx="50" cy="50" r="46" fill="url(#cp_outer_rim)" stroke="#112733" strokeWidth="1.5" />

        {/* Beveled edge between outer rim and face */}
        <circle cx="50" cy="50" r="41" fill="#0A1822" />

        {/* Coin Face */}
        <circle cx="50" cy="50" r="39" fill="url(#cp_inner_face)" />

        {/* Thin Secondary Inner Ring */}
        <circle
          cx="50"
          cy="50"
          r="34"
          fill="none"
          stroke="#28D7E5"
          strokeWidth="0.8"
          strokeOpacity="0.35"
          strokeDasharray="3 2"
        />

        {/* Specular Crest Highlight on Upper Rim */}
        <path
          d="M20 30 C30 18, 60 16, 76 26"
          stroke="url(#cp_specular)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* CoinPulse Geometric "C" with integrated ECG Pulse notch */}
        {/* The C forms an arc around the left, with top & bottom prongs, and a pulse spike in the middle horizontal line */}
        <path
          d="M66 34 
             C61 28, 54 26, 47 26 
             C34 26, 25 36, 25 50 
             C25 64, 34 74, 47 74 
             C54 74, 61 72, 66 66 
             L61 60 
             C57 65, 52 66.5, 47 66.5 
             C38 66.5, 32.5 59.5, 32.5 50 
             C32.5 40.5, 38 33.5, 47 33.5 
             C52 33.5, 57 35, 61 40 
             Z"
          fill="url(#cp_glyph_grad)"
        />

        {/* Pulse waveform accent darting into the core of the C */}
        <path
          d="M33 50 L43 50 L46 41 L51 59 L55 45 L58 52 L62 50 L73 50"
          stroke="#70EDF2"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Pulse center node dot */}
        <circle cx="55" cy="45" r="1.5" fill="#FFFFFF" />
      </svg>
    </div>
  );
};
