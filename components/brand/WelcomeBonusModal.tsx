import React from 'react';
import { useApp } from '../../context/AppContext';
import { CoinPulseCoin } from './CoinPulseCoin';
import { X, ArrowRight, ShieldCheck } from 'lucide-react';

interface WelcomeBonusModalProps {
  onStartTrading?: () => void;
}

export const WelcomeBonusModal: React.FC<WelcomeBonusModalProps> = ({ onStartTrading }) => {
  const { welcomeBonusModalOpen, setWelcomeBonusModalOpen } = useApp();

  if (!welcomeBonusModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#101927] border border-[#233147] rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden text-center">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#28D7E5]/15 blur-3xl pointer-events-none rounded-full" />

        {/* Close button */}
        <button
          onClick={() => setWelcomeBonusModalOpen(false)}
          className="absolute top-4 right-4 text-[#6E7D92] hover:text-[#F1F5FB] transition-colors p-1.5 rounded-lg hover:bg-[#141F30]"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Floating Coin emblem */}
        <div className="relative flex justify-center mb-6">
          <div className="p-3 bg-[#141F30]/80 rounded-full border border-[#28D7E5]/30 shadow-lg shadow-[#28D7E5]/5">
            <CoinPulseCoin size={80} animated />
          </div>
        </div>

        {/* Headings */}
        <h3 className="text-2xl font-bold font-['Space_Grotesk'] text-[#F1F5FB] tracking-tight">
          Welcome to CoinPulse
        </h3>
        <p className="text-sm text-[#9AA8BB] mt-1.5">
          Your demo journey starts here.
        </p>

        {/* Bonus Amount Card */}
        <div className="my-6 p-4 rounded-xl bg-[#0C1320] border border-[#233147]/80 flex flex-col items-center">
          <span className="text-[11px] font-mono font-semibold tracking-wider text-[#28D7E5] uppercase">
            DEMO SIGNUP BONUS CREDITED
          </span>
          <div className="flex items-center gap-2 mt-1">
            <CoinPulseCoin size={24} />
            <span className="text-3xl sm:text-4xl font-bold font-['Space_Grotesk'] tabular-nums text-[#F1F5FB]">
              200,000
            </span>
          </div>
          <span className="text-xs font-semibold tracking-wider text-[#9AA8BB] mt-0.5">
            VIRTUAL COINS
          </span>
          <div className="mt-2 pt-2 border-t border-[#1A2637] w-full flex items-center justify-center gap-1.5 text-xs text-[#20D997] font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>$1,000 demo equivalent (200 coins = $1 USD)</span>
          </div>
        </div>

        {/* Disclaimers & Action */}
        <p className="text-[11px] text-[#6E7D92] leading-relaxed mb-6">
          Virtual demo balance • No cash value • Practice prediction strategies with zero risk
        </p>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => {
              setWelcomeBonusModalOpen(false);
              if (onStartTrading) onStartTrading();
            }}
            className="w-full h-11 rounded-xl bg-gradient-to-r from-[#28D7E5] to-[#14B8A6] text-[#06131A] font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-md shadow-[#28D7E5]/10 active:scale-[0.99]"
          >
            <span>Start Practice Trading</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setWelcomeBonusModalOpen(false)}
            className="w-full h-10 rounded-xl bg-[#141F30] hover:bg-[#1A273A] text-[#9AA8BB] hover:text-[#F1F5FB] font-medium text-xs transition-colors"
          >
            Explore Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
