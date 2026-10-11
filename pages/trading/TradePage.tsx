import React from 'react';
import { useApp } from '../../context/AppContext';
import { PriceChart } from '../../components/trading/PriceChart';
import { PredictionOrderPanel } from '../../components/trading/PredictionOrderPanel';
import { CoinPulseCoin } from '../../components/brand/CoinPulseCoin';
import { formatPrice } from '../../lib/formatters';
import { Activity, ShieldCheck, HelpCircle } from 'lucide-react';

interface TradePageProps {
  onNavigate: (route: string) => void;
}

export const TradePage: React.FC<TradePageProps> = ({ onNavigate }) => {
  const { assets, selectedAsset, setSelectedAsset, userPredictions } = useApp();

  const activePredictions = userPredictions.filter(
    (p) => p.assetId === selectedAsset.id && p.status === 'active'
  );

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Asset Tabs Bar */}
      <div className="p-2 rounded-xl bg-[#101927] border border-[#233147] flex items-center justify-between overflow-x-auto gap-2">
        <div className="flex items-center gap-2">
          {assets.map((asset) => {
            const isSelected = asset.id === selectedAsset.id;
            return (
              <button
                key={asset.id}
                onClick={() => setSelectedAsset(asset)}
                className={`flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-[#141F30] border border-[#28D7E5]/50 text-[#F1F5FB] shadow-sm'
                    : 'bg-transparent text-[#9AA8BB] hover:text-[#F1F5FB] hover:bg-[#141F30]/50 border border-transparent'
                }`}
              >
                <span className="font-['Space_Grotesk'] font-bold">{asset.symbol}</span>
                <span className="font-mono tabular-nums text-xs font-medium">
                  {formatPrice(asset.price)}
                </span>
                <span
                  className={`text-[10px] font-mono font-semibold ${
                    asset.change24h >= 0 ? 'text-[#20D997]' : 'text-[#FF5C72]'
                  }`}
                >
                  {asset.change24h >= 0 ? '+' : ''}
                  {asset.change24h.toFixed(1)}%
                </span>
              </button>
            );
          })}
        </div>

        {/* Info notice */}
        <div className="hidden md:flex items-center gap-2 px-3 text-[11px] text-[#6E7D92] whitespace-nowrap">
          <Activity className="w-3.5 h-3.5 text-[#28D7E5]" />
          <span>Real-time micro-volatility ticks</span>
        </div>
      </div>

      {/* Main Terminal Viewport: Chart on Left, Prediction Panel on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-4">
          <PriceChart asset={selectedAsset} activePredictions={activePredictions} />

          {/* Practice Terminal Disclaimer & Guide Banner */}
          <div className="p-4 rounded-xl bg-[#0C1320] border border-[#1A2637] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#9AA8BB]">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#28D7E5] shrink-0" />
              <div>
                <span className="font-semibold text-[#F1F5FB] block">
                  How Practice Rounds Work
                </span>
                <span className="text-[11px] text-[#6E7D92]">
                  Select UP if you believe the closing price will be higher than the strike, or DOWN if lower. Win payout is 1.85x (+85% profit).
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('/help')}
              className="text-xs text-[#28D7E5] hover:underline flex items-center gap-1 shrink-0 font-medium"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Full Rules</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <PredictionOrderPanel asset={selectedAsset} activePredictions={activePredictions} />
        </div>
      </div>
    </div>
  );
};
