import React from 'react';
import { useApp } from '../../context/AppContext';
import { CoinPulseCoin } from '../../components/brand/CoinPulseCoin';
import { DemoBadge } from '../../components/brand/DemoBadge';
import { PriceChart } from '../../components/trading/PriceChart';
import { PredictionOrderPanel } from '../../components/trading/PredictionOrderPanel';
import { formatCoins, formatPrice, coinsToUSD, formatDate } from '../../lib/formatters';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Trophy,
  ArrowRight,
  ExternalLink,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (route: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { currentUser, wallet, assets, selectedAsset, setSelectedAsset, userPredictions, resetBalance } = useApp();

  // Calculate statistics honestly from real stored user predictions (never fabricate!)
  const completedPredictions = userPredictions.filter((p) => p.status !== 'active');
  const wonPredictions = completedPredictions.filter((p) => p.status === 'won');
  const winRate =
    completedPredictions.length > 0
      ? ((wonPredictions.length / completedPredictions.length) * 100).toFixed(1)
      : null;

  const topAssets = assets.slice(0, 3);
  const recentPredictions = userPredictions.slice(0, 6);
  const activeForSelected = userPredictions.filter(
    (p) => p.assetId === selectedAsset.id && p.status === 'active'
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Section A: Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-[#101927] border border-[#233147]">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h2 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-[#F1F5FB]">
              Welcome back, {currentUser?.displayName || 'Trader'}
            </h2>
            <DemoBadge size="sm" />
          </div>
          <p className="text-xs sm:text-sm text-[#9AA8BB]">
            Explore the markets and practice your cryptocurrency binary predictions with zero risk.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('/trade')}
            className="h-10 px-4 rounded-xl bg-gradient-to-r from-[#28D7E5] to-[#14B8A6] text-[#06131A] font-semibold text-xs flex items-center gap-2 hover:opacity-95 transition-all shadow-md shadow-[#28D7E5]/15"
          >
            <span>Launch Trade Terminal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Section B: Three Balance & Activity Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Virtual Wallet */}
        <div className="p-5 rounded-xl bg-[#101927] border border-[#233147] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#6E7D92] uppercase">Virtual Demo Balance</span>
            <button
              onClick={() => onNavigate('/wallet')}
              className="text-xs text-[#28D7E5] hover:underline flex items-center gap-1"
            >
              <span>My Wallet</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="my-3">
            <div className="flex items-center gap-2.5">
              <CoinPulseCoin size={28} />
              <span className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] tabular-nums text-[#F1F5FB]">
                {wallet ? formatCoins(wallet.balanceCoins) : '0'}
              </span>
            </div>
            <span className="text-xs text-[#20D997] font-medium mt-1 block">
              {wallet ? coinsToUSD(wallet.balanceCoins) : '$0.00'} demo equivalent
            </span>
          </div>

          <div className="pt-3 border-t border-[#1A2637] flex items-center justify-between text-[11px] text-[#6E7D92]">
            <span>Rate: 200 Coins = $1 USD</span>
            <button
              onClick={resetBalance}
              className="text-[#28D7E5] hover:underline flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              Replenish
            </button>
          </div>
        </div>

        {/* Card 2: Demo Predictions Count */}
        <div className="p-5 rounded-xl bg-[#101927] border border-[#233147] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#6E7D92] uppercase">Demo Predictions</span>
            <button
              onClick={() => onNavigate('/history')}
              className="text-xs text-[#9AA8BB] hover:text-[#F1F5FB] flex items-center gap-1"
            >
              <span>History</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="my-3">
            <div className="flex items-center gap-2.5">
              <Activity className="w-7 h-7 text-[#28D7E5]" />
              <span className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] tabular-nums text-[#F1F5FB]">
                {userPredictions.length}
              </span>
            </div>
            <span className="text-xs text-[#9AA8BB] mt-1 block">
              {completedPredictions.length} completed rounds · {userPredictions.length - completedPredictions.length} active
            </span>
          </div>

          <div className="pt-3 border-t border-[#1A2637] text-[11px] text-[#6E7D92]">
            Practice activity logged in persistent ledger
          </div>
        </div>

        {/* Card 3: Demo Win Rate */}
        <div className="p-5 rounded-xl bg-[#101927] border border-[#233147] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#6E7D92] uppercase">Demo Win Rate</span>
            <Trophy className="w-4 h-4 text-[#F5B942]" />
          </div>

          <div className="my-3">
            {winRate !== null ? (
              <>
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] tabular-nums text-[#20D997]">
                    {winRate}%
                  </span>
                </div>
                <span className="text-xs text-[#9AA8BB] mt-1 block">
                  {wonPredictions.length} wins out of {completedPredictions.length} settled
                </span>
              </>
            ) : (
              <div className="py-1">
                <span className="text-lg font-bold font-['Space_Grotesk'] text-[#6E7D92]">
                  No settled rounds yet
                </span>
                <span className="text-xs text-[#9AA8BB] mt-1 block">
                  Place a prediction below to calculate performance
                </span>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[#1A2637] text-[11px] text-[#6E7D92]">
            Calculated strictly from completed practice rounds
          </div>
        </div>
      </div>

      {/* Section C: Market Overview Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-[#F1F5FB]">Featured Crypto Markets</h3>
            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-[#28D7E5]/10 text-[#28D7E5] border border-[#28D7E5]/20">
              SIMULATED DATA
            </span>
          </div>
          <button
            onClick={() => onNavigate('/markets')}
            className="text-xs text-[#28D7E5] hover:underline flex items-center gap-1"
          >
            <span>View All Markets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {topAssets.map((asset) => {
            const isSelected = selectedAsset.id === asset.id;
            return (
              <div
                key={asset.id}
                onClick={() => setSelectedAsset(asset)}
                className={`p-4 rounded-xl bg-[#101927] border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#28D7E5] shadow-md shadow-[#28D7E5]/5'
                    : 'border-[#233147] hover:border-[#1A273A]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-['Space_Grotesk'] font-bold text-sm text-[#F1F5FB]">
                      {asset.symbol}
                    </span>
                    <span className="text-[11px] text-[#9AA8BB]">{asset.displayName}</span>
                  </div>
                  <span
                    className={`text-xs font-mono font-semibold ${
                      asset.change24h >= 0 ? 'text-[#20D997]' : 'text-[#FF5C72]'
                    }`}
                  >
                    {asset.change24h >= 0 ? '+' : ''}
                    {asset.change24h.toFixed(2)}%
                  </span>
                </div>

                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-lg font-bold font-mono tabular-nums text-[#F1F5FB]">
                    {formatPrice(asset.price)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAsset(asset);
                      onNavigate('/trade');
                    }}
                    className="text-xs text-[#28D7E5] hover:text-[#70EDF2] font-semibold"
                  >
                    Trade Demo →
                  </button>
                </div>

                {/* Mini SVG Sparkline */}
                <div className="mt-3 h-8 w-full flex items-end">
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    <polyline
                      fill="none"
                      stroke={asset.change24h >= 0 ? '#20D997' : '#FF5C72'}
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={asset.sparkline
                        .map((val, idx) => {
                          const min = Math.min(...asset.sparkline);
                          const max = Math.max(...asset.sparkline);
                          const range = max - min || 1;
                          const x = (idx / (asset.sparkline.length - 1)) * 100;
                          const y = 32 - ((val - min) / range) * 26 - 2;
                          return `${x}%,${y}`;
                        })
                        .join(' ')}
                    />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section D: Main Quick Trading Terminal Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <PriceChart asset={selectedAsset} activePredictions={activeForSelected} />
        </div>

        <div className="lg:col-span-1">
          <PredictionOrderPanel asset={selectedAsset} activePredictions={activeForSelected} />
        </div>
      </div>

      {/* Section E: Recent Activity Table */}
      <div className="p-5 rounded-xl bg-[#101927] border border-[#233147]">
        <div className="flex items-center justify-between pb-3 border-b border-[#1A2637] mb-3">
          <h3 className="text-sm font-semibold text-[#F1F5FB]">Recent Practice Predictions</h3>
          <button
            onClick={() => onNavigate('/history')}
            className="text-xs text-[#28D7E5] hover:underline flex items-center gap-1"
          >
            <span>View All History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentPredictions.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#6E7D92]">
            <Clock className="w-8 h-8 text-[#233147] mx-auto mb-2" />
            Your practice trading history will appear here. Place your first prediction above!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1A2637] text-[#6E7D92] font-mono text-[11px] uppercase">
                  <th className="py-2.5 px-3">Asset</th>
                  <th className="py-2.5 px-3">Direction</th>
                  <th className="py-2.5 px-3">Stake</th>
                  <th className="py-2.5 px-3">Entry / Strike</th>
                  <th className="py-2.5 px-3">Result</th>
                  <th className="py-2.5 px-3 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A2637]">
                {recentPredictions.map((pred) => (
                  <tr key={pred.id} className="hover:bg-[#141F30]/50 transition-colors">
                    <td className="py-3 px-3 font-semibold text-[#F1F5FB]">
                      {pred.assetSymbol}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          pred.direction === 'UP'
                            ? 'bg-[#20D997]/15 text-[#20D997]'
                            : 'bg-[#FF5C72]/15 text-[#FF5C72]'
                        }`}
                      >
                        {pred.direction === 'UP' ? '▲ UP' : '▼ DOWN'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[#F1F5FB] tabular-nums">
                      {formatCoins(pred.stakeCoins)} coins
                    </td>
                    <td className="py-3 px-3 font-mono text-[#9AA8BB]">
                      {formatPrice(pred.openingPrice)}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`font-mono text-xs font-bold uppercase ${
                          pred.status === 'won'
                            ? 'text-[#20D997]'
                            : pred.status === 'active'
                            ? 'text-[#28D7E5]'
                            : pred.status === 'tie'
                            ? 'text-[#9AA8BB]'
                            : 'text-[#FF5C72]'
                        }`}
                      >
                        {pred.status === 'won'
                          ? `+${formatCoins(pred.payoutCoins)} coins`
                          : pred.status === 'active'
                          ? 'In Progress'
                          : pred.status === 'tie'
                          ? 'Tie (Refunded)'
                          : 'Lost'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-[11px] text-[#6E7D92] font-mono">
                      {formatDate(pred.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
