import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Asset, PredictionDirection, Prediction } from '../../types';
import { CoinPulseCoin } from '../brand/CoinPulseCoin';
import { formatCoins, formatPrice, coinsToUSD } from '../../lib/formatters';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

interface PredictionOrderPanelProps {
  asset: Asset;
  activePredictions: Prediction[];
}

export const PredictionOrderPanel: React.FC<PredictionOrderPanelProps> = ({
  asset,
  activePredictions,
}) => {
  const { wallet, placeTrade, resetBalance } = useApp();

  const [stake, setStake] = useState<number>(10000);
  const [duration, setDuration] = useState<number>(30); // 30 seconds default
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    direction: PredictionDirection;
  }>({ open: false, direction: 'UP' });
  const [submitting, setSubmitting] = useState(false);

  const availableBalance = wallet?.balanceCoins || 0;
  const payoutMultiplier = 1.85; // +85% demo profit on win
  const potentialPayout = Math.floor(stake * payoutMultiplier);
  const potentialProfit = potentialPayout - stake;

  const presetStakes = [1000, 5000, 10000, 25000, 50000];
  const durations = [
    { label: '15s', seconds: 15 },
    { label: '30s', seconds: 30 },
    { label: '60s', seconds: 60 },
    { label: '2m', seconds: 120 },
    { label: '5m', seconds: 300 },
  ];

  const handleInitiateTrade = (direction: PredictionDirection) => {
    if (stake > availableBalance) return;
    if (stake <= 0) return;
    setConfirmDialog({ open: true, direction });
  };

  const handleConfirmTrade = async () => {
    setSubmitting(true);
    try {
      await placeTrade(confirmDialog.direction, stake, duration);
      setConfirmDialog({ open: false, direction: 'UP' });
    } catch {
      // Error handled by context toast
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#101927] border border-[#233147] rounded-xl p-4 sm:p-5 flex flex-col gap-4 select-none">
      {/* Panel Header & Available balance */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1A2637]">
        <div>
          <h3 className="text-sm font-semibold text-[#F1F5FB]">Place Prediction</h3>
          <p className="text-[11px] text-[#9AA8BB]">Practice binary market outcome</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-mono text-[#6E7D92] uppercase">Demo Balance</span>
          <div className="flex items-center gap-1.5">
            <CoinPulseCoin size={16} />
            <span className="text-xs font-bold font-mono text-[#F1F5FB] tabular-nums">
              {formatCoins(availableBalance)}
            </span>
          </div>
        </div>
      </div>

      {/* Stake Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label className="font-medium text-[#9AA8BB]">Virtual Stake</label>
          <span className="text-[11px] font-mono text-[#6E7D92]">
            ≈ {coinsToUSD(stake)} demo equiv.
          </span>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <CoinPulseCoin size={18} />
          </div>
          <input
            type="number"
            value={stake || ''}
            onChange={(e) => setStake(Math.max(0, parseInt(e.target.value) || 0))}
            min={100}
            max={availableBalance}
            className="w-full h-11 pl-9 pr-14 rounded-lg bg-[#0C1320] border border-[#233147] focus:border-[#28D7E5] focus:outline-none text-sm font-mono font-bold text-[#F1F5FB] tabular-nums transition-colors"
          />
          <button
            onClick={() => setStake(availableBalance)}
            className="absolute inset-y-1 right-1 px-2.5 rounded bg-[#141F30] hover:bg-[#1A273A] text-[10px] font-mono font-semibold text-[#28D7E5] transition-colors"
          >
            MAX
          </button>
        </div>

        {/* Preset stake quick buttons */}
        <div className="grid grid-cols-5 gap-1.5 pt-1">
          {presetStakes.map((val) => (
            <button
              key={val}
              onClick={() => setStake(val)}
              className={`py-1.5 rounded-lg text-[10px] font-mono font-medium border transition-colors ${
                stake === val
                  ? 'bg-[#28D7E5]/15 border-[#28D7E5] text-[#70EDF2]'
                  : 'bg-[#0C1320] border-[#233147] text-[#9AA8BB] hover:bg-[#141F30] hover:text-[#F1F5FB]'
              }`}
            >
              {val >= 1000 ? `${val / 1000}k` : val}
            </button>
          ))}
        </div>

        {/* Insufficient balance warning / replenish button */}
        {stake > availableBalance && (
          <div className="flex items-center justify-between p-2 rounded-lg bg-[#FF5C72]/10 border border-[#FF5C72]/20 text-[11px] text-[#FF5C72]">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              Insufficient virtual balance
            </span>
            <button
              onClick={resetBalance}
              className="flex items-center gap-1 font-semibold text-[#28D7E5] hover:underline"
            >
              <RotateCcw className="w-3 h-3" />
              Replenish
            </button>
          </div>
        )}
      </div>

      {/* Duration Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label className="font-medium text-[#9AA8BB] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#6E7D92]" />
            Prediction Duration
          </label>
          <span className="text-[11px] font-mono text-[#28D7E5]">{duration} seconds</span>
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {durations.map((d) => (
            <button
              key={d.seconds}
              onClick={() => setDuration(d.seconds)}
              className={`py-2 rounded-lg text-xs font-mono font-medium border transition-colors ${
                duration === d.seconds
                  ? 'bg-[#28D7E5] text-[#06131A] font-bold border-[#28D7E5]'
                  : 'bg-[#0C1320] border-[#233147] text-[#9AA8BB] hover:bg-[#141F30] hover:text-[#F1F5FB]'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Demo Payout calculation summary */}
      <div className="p-3 rounded-lg bg-[#0C1320] border border-[#1A2637] space-y-1 text-xs">
        <div className="flex items-center justify-between text-[#9AA8BB]">
          <span>Payout Return:</span>
          <span className="font-mono font-medium text-[#F1F5FB]">1.85x (+85%)</span>
        </div>
        <div className="flex items-center justify-between text-[#9AA8BB]">
          <span>Potential Net Profit:</span>
          <span className="font-mono font-bold text-[#20D997] tabular-nums">
            +{formatCoins(potentialProfit)} coins
          </span>
        </div>
        <div className="flex items-center justify-between text-[#9AA8BB]">
          <span>Total Payout on Win:</span>
          <span className="font-mono font-bold text-[#70EDF2] tabular-nums">
            {formatCoins(potentialPayout)} coins
          </span>
        </div>
      </div>

      {/* Up & Down Action Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        {/* UP BUTTON: #20D997, hover #35E7A6, text #06131A */}
        <button
          onClick={() => handleInitiateTrade('UP')}
          disabled={stake <= 0 || stake > availableBalance}
          className="h-12 rounded-xl bg-[#20D997] hover:bg-[#35E7A6] active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none text-[#06131A] font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-[#20D997]/15 cursor-pointer"
        >
          <TrendingUp className="w-5 h-5 stroke-[2.5]" />
          <span>UP (Bullish)</span>
        </button>

        {/* DOWN BUTTON: #FF5C72, hover #FF7587, text #FFFFFF */}
        <button
          onClick={() => handleInitiateTrade('DOWN')}
          disabled={stake <= 0 || stake > availableBalance}
          className="h-12 rounded-xl bg-[#FF5C72] hover:bg-[#FF7587] active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-[#FF5C72]/15 cursor-pointer"
        >
          <TrendingDown className="w-5 h-5 stroke-[2.5]" />
          <span>DOWN (Bearish)</span>
        </button>
      </div>

      {/* Active Rounds Live Tracker */}
      {activePredictions.length > 0 && (
        <div className="pt-2 border-t border-[#1A2637] space-y-2">
          <span className="text-[11px] font-mono font-semibold text-[#6E7D92] uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#28D7E5] animate-pulse" />
            Live Demo Round ({activePredictions.length})
          </span>

          {activePredictions.map((pred) => {
            const timeLeft = Math.max(0, Math.ceil((pred.expiryTime - Date.now()) / 1000));
            const isUp = pred.direction === 'UP';
            const priceDiff = asset.price - pred.openingPrice;
            const inTheMoney = isUp ? priceDiff > 0 : priceDiff < 0;

            return (
              <div
                key={pred.id}
                className="p-2.5 rounded-lg bg-[#0C1320] border border-[#233147] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono font-bold px-1.5 py-0.5 rounded text-[10px] ${
                      isUp
                        ? 'bg-[#20D997]/20 text-[#20D997]'
                        : 'bg-[#FF5C72]/20 text-[#FF5C72]'
                    }`}
                  >
                    {pred.direction}
                  </span>
                  <div>
                    <div className="font-mono text-[#F1F5FB]">
                      Entry: {formatPrice(pred.openingPrice)}
                    </div>
                    <div className="text-[10px] text-[#6E7D92]">
                      Stake: {formatCoins(pred.stakeCoins)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 text-xs font-mono font-bold text-[#28D7E5]">
                    <Clock className="w-3 h-3" />
                    <span>{timeLeft}s</span>
                  </div>
                  <span
                    className={`text-[10px] font-mono font-semibold ${
                      inTheMoney ? 'text-[#20D997]' : 'text-[#FF5C72]'
                    }`}
                  >
                    {inTheMoney ? 'IN THE MONEY' : 'OUT OF MONEY'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Dialog Modal */}
      {confirmDialog.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-[#101927] border border-[#233147] rounded-xl p-5 shadow-2xl text-left">
            <h4 className="text-base font-bold text-[#F1F5FB] font-['Space_Grotesk']">
              Confirm Demo Prediction
            </h4>
            <p className="text-xs text-[#9AA8BB] mt-1">
              Verify your practice round details before locking in:
            </p>

            <div className="my-4 p-3 rounded-lg bg-[#0C1320] border border-[#1A2637] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#6E7D92]">Market Asset:</span>
                <span className="font-bold text-[#F1F5FB]">{asset.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E7D92]">Direction:</span>
                <span
                  className={`font-bold font-mono ${
                    confirmDialog.direction === 'UP' ? 'text-[#20D997]' : 'text-[#FF5C72]'
                  }`}
                >
                  {confirmDialog.direction === 'UP' ? 'UP (Bullish ▲)' : 'DOWN (Bearish ▼)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E7D92]">Strike / Current:</span>
                <span className="font-mono text-[#F1F5FB]">{formatPrice(asset.price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E7D92]">Virtual Stake:</span>
                <span className="font-mono font-bold text-[#F1F5FB]">
                  {formatCoins(stake)} coins
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E7D92]">Duration:</span>
                <span className="font-mono text-[#28D7E5]">{duration} seconds</span>
              </div>
              <div className="flex justify-between border-t border-[#1A2637] pt-2">
                <span className="text-[#6E7D92]">Potential Win:</span>
                <span className="font-mono font-bold text-[#20D997]">
                  +{formatCoins(potentialProfit)} coins
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-[#6E7D92] mb-4">
              <ShieldCheck className="w-3.5 h-3.5 text-[#28D7E5]" />
              <span>Simulated demo trade • No real funds at risk</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setConfirmDialog({ open: false, direction: 'UP' })}
                disabled={submitting}
                className="flex-1 h-10 rounded-lg bg-[#141F30] hover:bg-[#1A273A] text-xs font-semibold text-[#9AA8BB] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmTrade}
                disabled={submitting}
                className={`flex-1 h-10 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-1.5 ${
                  confirmDialog.direction === 'UP'
                    ? 'bg-[#20D997] text-[#06131A] hover:bg-[#35E7A6]'
                    : 'bg-[#FF5C72] text-white hover:bg-[#FF7587]'
                }`}
              >
                {submitting ? 'Submitting...' : 'Confirm Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
