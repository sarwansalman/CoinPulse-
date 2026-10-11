import React from 'react';
import { CoinPulseCoin } from '../../components/brand/CoinPulseCoin';
import { ArrowLeft, LayoutDashboard, ShieldAlert } from 'lucide-react';

interface FinanceNotFoundPageProps {
  sectionTitle?: string;
  onNavigate: (route: string) => void;
}

export const FinanceNotFoundPage: React.FC<FinanceNotFoundPageProps> = ({
  sectionTitle = 'Finance & Cash Operations',
  onNavigate,
}) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-lg p-8 sm:p-10 rounded-2xl bg-[#101927] border border-[#233147] text-center shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-[#28D7E5]/10 blur-3xl rounded-full pointer-events-none" />

        <div className="flex justify-center mb-6">
          <div className="p-3 bg-[#141F30] rounded-full border border-[#233147]">
            <CoinPulseCoin size={54} />
          </div>
        </div>

        {/* 404 in Space Grotesk */}
        <div className="font-['Space_Grotesk'] font-bold text-6xl text-[#28D7E5] tracking-tight">
          404
        </div>

        <h2 className="mt-3 text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-[#F1F5FB]">
          Page not found
        </h2>

        <p className="mt-2 text-xs sm:text-sm text-[#9AA8BB] max-w-sm mx-auto leading-relaxed">
          This section is not available in the current demo.
        </p>

        {/* Informational notice */}
        <div className="mt-6 p-3.5 rounded-xl bg-[#0C1320] border border-[#1A2637] flex items-center gap-2.5 text-xs text-[#9AA8BB] text-left">
          <ShieldAlert className="w-5 h-5 text-[#F5B942] shrink-0" />
          <span className="text-[11px] leading-relaxed">
            CoinPulse is operating strictly in <strong>Virtual Demo Mode</strong>. Real-money deposits, withdrawals, and cash payment gateways are disabled in this environment.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('/dashboard')}
            className="w-full sm:w-auto h-11 px-6 rounded-xl bg-gradient-to-r from-[#28D7E5] to-[#14B8A6] text-[#06131A] font-bold text-xs flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-md shadow-[#28D7E5]/15"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto h-11 px-5 rounded-xl bg-[#141F30] hover:bg-[#1A273A] text-xs font-semibold text-[#9AA8BB] hover:text-[#F1F5FB] transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};
