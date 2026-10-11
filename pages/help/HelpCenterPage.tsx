import React, { useState } from 'react';
import { CoinPulseCoin } from '../../components/brand/CoinPulseCoin';
import { HelpCircle, ChevronDown, ChevronUp, ShieldCheck, ArrowRight, BookOpen } from 'lucide-react';

interface HelpCenterPageProps {
  onNavigate: (route: string) => void;
}

export const HelpCenterPage: React.FC<HelpCenterPageProps> = ({ onNavigate }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is CoinPulse and how do Up/Down predictions work?',
      a: 'CoinPulse is a cryptocurrency Up/Down binary prediction practice platform. Traders forecast whether the market price of an asset (such as BTC, ETH, or SOL) will be higher (UP/Bullish) or lower (DOWN/Bearish) than the entry strike price when the round countdown expires (e.g., 15s, 30s, or 60s). If your forecast is accurate at settlement, you receive a winning payout (typically 1.85x your virtual stake).',
    },
    {
      q: 'What is the Welcome Bonus and what is it worth?',
      a: 'Every new registered account automatically receives a one-time credit of 200,000 virtual demo coins. In CoinPulse, 200 virtual coins represent a $1.00 USD benchmark, meaning your starting demo wallet equates to a $1,000 USD practice portfolio. These demo coins carry NO cash value and cannot be converted to fiat or real crypto.',
    },
    {
      q: 'Are the market price feeds real or simulated?',
      a: 'In this demo environment, market price movements are simulated using high-frequency Brownian motion and mean-reverting micro-volatility. All values are clearly labeled as SIMULATED DATA so users know they are practicing in a synthetic environment rather than live exchange order books.',
    },
    {
      q: 'What happens if I run out of demo coins?',
      a: 'You can replenish your virtual balance back to 200,000 coins at any time! Simply navigate to My Wallet or Settings and click "Replenish 200,000 Coins". It is recorded in your ledger as a demo reset.',
    },
    {
      q: 'Why do Deposit and Withdrawal pages show "404 Page Not Found"?',
      a: 'CoinPulse is strictly a demonstration and practice terminal. Real deposit gateways and withdrawal mechanisms are intentionally unavailable to maintain complete regulatory compliance and prevent any risk to user capital.',
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#101927] border border-[#233147] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h2 className="text-xl font-bold font-['Space_Grotesk'] text-[#F1F5FB]">
            CoinPulse Knowledge Base & Help
          </h2>
          <p className="text-xs text-[#9AA8BB]">
            Complete guide to demo binary options, simulation rules, and virtual wallet accounting.
          </p>
        </div>
        <button
          onClick={() => onNavigate('/trade')}
          className="h-10 px-5 rounded-xl bg-gradient-to-r from-[#28D7E5] to-[#14B8A6] text-[#06131A] font-bold text-xs flex items-center gap-2 hover:opacity-95 transition-all shadow-md shadow-[#28D7E5]/15 shrink-0"
        >
          <span>Practice Trading</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-[#101927] border border-[#233147]">
          <span className="text-[10px] font-mono font-semibold text-[#28D7E5] uppercase">
            STEP 01
          </span>
          <h3 className="text-sm font-bold text-[#F1F5FB] mt-1 mb-2">Select Your Market</h3>
          <p className="text-xs text-[#9AA8BB] leading-relaxed">
            Choose from high-liquidity crypto assets such as BTC/USDT, ETH/USDT, or SOL/USDT with real-time volatility.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-[#101927] border border-[#233147]">
          <span className="text-[10px] font-mono font-semibold text-[#20D997] uppercase">
            STEP 02
          </span>
          <h3 className="text-sm font-bold text-[#F1F5FB] mt-1 mb-2">Set Stake & Duration</h3>
          <p className="text-xs text-[#9AA8BB] leading-relaxed">
            Input your virtual stake (e.g. 10,000 coins) and select an expiry window: 15s, 30s, 60s, or up to 5 minutes.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-[#101927] border border-[#233147]">
          <span className="text-[10px] font-mono font-semibold text-[#70EDF2] uppercase">
            STEP 03
          </span>
          <h3 className="text-sm font-bold text-[#F1F5FB] mt-1 mb-2">Predict UP or DOWN</h3>
          <p className="text-xs text-[#9AA8BB] leading-relaxed">
            Lock in your prediction. At expiry, if the market resolves in your chosen direction, collect +85% net profit!
          </p>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="p-6 rounded-2xl bg-[#101927] border border-[#233147] space-y-4">
        <h3 className="text-base font-bold text-[#F1F5FB] font-['Space_Grotesk']">
          Frequently Asked Questions
        </h3>

        <div className="divide-y divide-[#1A2637]">
          {faqs.map((faq, idx) => (
            <div key={idx} className="py-3.5">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-[#F1F5FB] hover:text-[#70EDF2] transition-colors"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-[#28D7E5] shrink-0 ml-2" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#6E7D92] shrink-0 ml-2" />
                )}
              </button>
              {openFaq === idx && (
                <p className="mt-2 text-xs text-[#9AA8BB] leading-relaxed animate-in fade-in duration-150">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
