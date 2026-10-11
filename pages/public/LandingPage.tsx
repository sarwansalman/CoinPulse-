import React from 'react';
import { BrandLogo } from '../../components/brand/BrandLogo';
import { CoinPulseCoin } from '../../components/brand/CoinPulseCoin';
import { useApp } from '../../context/AppContext';
import { formatPrice, coinsToUSD } from '../../lib/formatters';
import {
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Zap,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Clock,
  Sparkles,
  Coins,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (route: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { assets, currentUser } = useApp();
  const btc = assets.find((a) => a.id === 'btc-usdt') || assets[0] || {
    id: 'btc-usdt',
    symbol: 'BTC/USDT',
    displayName: 'Bitcoin',
    price: 68420.5,
    change24h: 2.84,
    high24h: 69200.0,
    low24h: 67100.0,
    volume24h: '1.42B USDT',
    sparkline: [67100, 67450, 67200, 67900, 68150, 67800, 68420.5],
    dataSourceType: 'simulated' as const,
    isEnabled: true,
  };

  return (
    <div className="min-h-screen bg-[#080D16] text-[#F1F5FB] flex flex-col selection:bg-[#28D7E5]/20 selection:text-[#70EDF2]">
      {/* Top Bar Contract: 3 zones (Brand wordmark, nav links, 1 primary action) */}
      <header className="h-[68px] border-b border-[#1A2637] px-6 sm:px-12 flex items-center justify-between gap-8 sticky top-0 bg-[#080D16]/95 backdrop-blur-md z-30">
        <BrandLogo onClick={() => onNavigate('/')} />

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#9AA8BB]">
          <button
            onClick={() => onNavigate('/markets')}
            className="hover:text-[#F1F5FB] transition-colors whitespace-nowrap"
          >
            Markets
          </button>
          <button
            onClick={() => onNavigate('/trade')}
            className="hover:text-[#F1F5FB] transition-colors whitespace-nowrap"
          >
            Demo Terminal
          </button>
          <button
            onClick={() => onNavigate('/help')}
            className="hover:text-[#F1F5FB] transition-colors whitespace-nowrap"
          >
            How It Works
          </button>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          {currentUser ? (
            <button
              onClick={() => onNavigate('/dashboard')}
              className="h-10 px-5 rounded-xl bg-gradient-to-r from-[#28D7E5] to-[#14B8A6] text-[#06131A] font-semibold text-xs flex items-center gap-2 hover:opacity-95 transition-all shadow-md shadow-[#28D7E5]/15"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              <button
                onClick={() => onNavigate('/login')}
                className="h-10 px-4 rounded-xl text-xs font-semibold text-[#9AA8BB] hover:text-[#F1F5FB] hover:bg-[#141F30] transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigate('/signup')}
                className="h-10 px-5 rounded-xl bg-gradient-to-r from-[#28D7E5] to-[#14B8A6] text-[#06131A] font-semibold text-xs flex items-center gap-2 hover:opacity-95 transition-all shadow-md shadow-[#28D7E5]/15"
              >
                <span>Get 200,000 Coins</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 sm:px-12 pt-16 pb-20 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
        {/* Subtle ambient light */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-[#28D7E5]/10 blur-[100px] pointer-events-none rounded-full" />

        {/* Quiet headline kicker */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101927] border border-[#233147] mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#28D7E5]" />
          <span className="text-xs font-medium text-[#9AA8BB]">
            Virtual Crypto Prediction Terminal
          </span>
          <span className="text-xs text-[#28D7E5] font-semibold">· Risk-Free Practice</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-['Space_Grotesk'] tracking-tight max-w-4xl text-[#F1F5FB] leading-[1.15]">
          Explore Crypto Markets.{' '}
          <span className="bg-gradient-to-r from-[#28D7E5] to-[#70EDF2] bg-clip-text text-transparent">
            Practice Every Move.
          </span>
        </h1>

        {/* Supporting description */}
        <p className="mt-5 text-base sm:text-lg text-[#9AA8BB] max-w-2xl leading-relaxed">
          Test your market intuition on high-speed cryptocurrency price action. Receive 200,000 virtual coins upon signup and master Up/Down predictions in a safe simulation.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('/signup')}
            className="h-12 px-7 rounded-xl bg-gradient-to-r from-[#28D7E5] to-[#14B8A6] text-[#06131A] font-bold text-sm flex items-center gap-2.5 hover:opacity-95 transition-all shadow-lg shadow-[#28D7E5]/20 active:scale-95"
          >
            <span>Claim $1,000 Demo Bonus</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('/trade')}
            className="h-12 px-6 rounded-xl bg-[#101927] hover:bg-[#141F30] border border-[#233147] hover:border-[#28D7E5]/40 text-sm font-semibold text-[#F1F5FB] transition-all flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4 text-[#28D7E5]" />
            <span>Launch Demo Terminal</span>
          </button>
        </div>

        {/* Explicit Notice */}
        <p className="mt-4 text-xs text-[#6E7D92]">
          Virtual demo balance • 200 virtual coins = $1 USD equivalent • No cash value • Zero financial risk
        </p>

        {/* Interactive Simulated Terminal Preview Box */}
        <div className="mt-14 w-full max-w-5xl rounded-2xl bg-[#101927] border border-[#233147] shadow-2xl p-4 sm:p-6 text-left relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#1A2637] gap-3">
            <div className="flex items-center gap-3">
              <CoinPulseCoin size={32} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-['Space_Grotesk'] font-bold text-base text-[#F1F5FB]">
                    {btc.symbol}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-[#28D7E5]/10 text-[#28D7E5] font-mono font-semibold">
                    SIMULATED TICKER
                  </span>
                </div>
                <span className="text-xs text-[#9AA8BB]">Real-Time Brownian Volatility Model</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="font-mono font-bold text-base sm:text-lg text-[#F1F5FB] tabular-nums">
                  {formatPrice(btc.price)}
                </div>
                <div
                  className={`text-xs font-mono font-medium ${
                    btc.change24h >= 0 ? 'text-[#20D997]' : 'text-[#FF5C72]'
                  }`}
                >
                  {btc.change24h >= 0 ? '+' : ''}
                  {btc.change24h.toFixed(2)}% (24h)
                </div>
              </div>

              <button
                onClick={() => onNavigate('/trade')}
                className="h-9 px-4 rounded-lg bg-[#28D7E5] hover:bg-[#70EDF2] text-[#06131A] font-bold text-xs transition-colors"
              >
                Trade Demo
              </button>
            </div>
          </div>

          {/* Quick interactive mini preview controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-[#0C1320] border border-[#1A2637]">
              <span className="text-xs font-mono text-[#6E7D92] uppercase">PRACTICE STAKE</span>
              <div className="flex items-center gap-2 mt-1">
                <CoinPulseCoin size={20} />
                <span className="text-lg font-bold font-mono text-[#F1F5FB]">10,000 Coins</span>
              </div>
              <span className="text-xs text-[#9AA8BB] mt-1 block">≈ {coinsToUSD(10000)} demo value</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0C1320] border border-[#1A2637]">
              <span className="text-xs font-mono text-[#6E7D92] uppercase">ROUND DURATION</span>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-5 h-5 text-[#28D7E5]" />
                <span className="text-lg font-bold font-mono text-[#F1F5FB]">30 Seconds</span>
              </div>
              <span className="text-xs text-[#9AA8BB] mt-1 block">Fast binary settlement</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0C1320] border border-[#1A2637]">
              <span className="text-xs font-mono text-[#6E7D92] uppercase">ESTIMATED PAYOUT</span>
              <div className="flex items-center gap-2 mt-1">
                <TrendingUp className="w-5 h-5 text-[#20D997]" />
                <span className="text-lg font-bold font-mono text-[#20D997]">18,500 Coins</span>
              </div>
              <span className="text-xs text-[#20D997] font-semibold mt-1 block">+85% demo return</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Feature Pillars */}
      <section className="px-6 sm:px-12 py-16 border-t border-[#1A2637] bg-[#0A101B]/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-[#F1F5FB]">
              Precision Built for Prediction Traders
            </h2>
            <p className="mt-2 text-sm text-[#9AA8BB]">
              Master chart pattern recognition and timing without exposing hard-earned money.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-xl bg-[#101927] border border-[#233147] hover:border-[#28D7E5]/40 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#28D7E5]/10 border border-[#28D7E5]/20 flex items-center justify-center text-[#28D7E5] mb-4">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-[#F1F5FB] mb-2">
                  High-Speed Demo Terminal
                </h3>
                <p className="text-xs text-[#9AA8BB] leading-relaxed">
                  Interactive real-time canvas charting with candlesticks, line mode, crosshairs, and live strike overlays. Experience round durations from 15 seconds to 5 minutes.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-[#1A2637] flex items-center gap-2 text-xs text-[#28D7E5] font-semibold">
                <CheckCircle className="w-4 h-4" />
                <span>Deterministic Simulated Ticks</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-xl bg-[#101927] border border-[#233147] hover:border-[#28D7E5]/40 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#20D997]/10 border border-[#20D997]/20 flex items-center justify-center text-[#20D997] mb-4">
                  <Coins className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-[#F1F5FB] mb-2">
                  Transparent Virtual Wallet
                </h3>
                <p className="text-xs text-[#9AA8BB] leading-relaxed">
                  Every stake, win settlement, and refund is recorded in an immutable ledger. Track balance evolution, total turnover, and replenish your coins anytime with a single click.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-[#1A2637] flex items-center gap-2 text-xs text-[#20D997] font-semibold">
                <CheckCircle className="w-4 h-4" />
                <span>200,000 Coins Welcome Credit</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-xl bg-[#101927] border border-[#233147] hover:border-[#28D7E5]/40 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#F5B942]/10 border border-[#F5B942]/20 flex items-center justify-center text-[#F5B942] mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-[#F1F5FB] mb-2">
                  Audited Performance Analytics
                </h3>
                <p className="text-xs text-[#9AA8BB] leading-relaxed">
                  Real win-rate statistics based strictly on your trading activity. Inspect entry and exit prices down to the millisecond with complete audit logs.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-[#1A2637] flex items-center gap-2 text-xs text-[#F5B942] font-semibold">
                <CheckCircle className="w-4 h-4" />
                <span>Strictly Honest Metrics</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#1A2637] bg-[#080D16] px-6 sm:px-12 py-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <BrandLogo />
            <span className="text-xs text-[#6E7D92]">
              © {new Date().getFullYear()} CoinPulse. All rights reserved.
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-[#9AA8BB]">
            <button onClick={() => onNavigate('/help')} className="hover:text-[#F1F5FB] transition-colors">
              Help Center
            </button>
            <button onClick={() => onNavigate('/markets')} className="hover:text-[#F1F5FB] transition-colors">
              Markets
            </button>
            <button onClick={() => onNavigate('/finance/deposit')} className="hover:text-[#F1F5FB] transition-colors">
              Deposit (Demo 404)
            </button>
            <button onClick={() => onNavigate('/help')} className="hover:text-[#F1F5FB] transition-colors">
              Platform Terms
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
