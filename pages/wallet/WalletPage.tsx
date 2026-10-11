import React from 'react';
import { useApp } from '../../context/AppContext';
import { CoinPulseCoin } from '../../components/brand/CoinPulseCoin';
import { StorageService } from '../../services/storageService';
import { formatCoins, coinsToUSD, formatDate } from '../../lib/formatters';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Receipt,
  ArrowRight,
} from 'lucide-react';

interface WalletPageProps {
  onNavigate: (route: string) => void;
}

export const WalletPage: React.FC<WalletPageProps> = ({ onNavigate }) => {
  const { currentUser, wallet, resetBalance } = useApp();
  const ledger = currentUser ? StorageService.getLedger(currentUser.id) : [];

  // Calculate totals from ledger
  const totalCredits = ledger
    .filter((e) => e.amountCoins > 0)
    .reduce((sum, e) => sum + e.amountCoins, 0);

  const totalDebits = ledger
    .filter((e) => e.amountCoins < 0)
    .reduce((sum, e) => sum + Math.abs(e.amountCoins), 0);

  const totalStaked = ledger
    .filter((e) => e.type === 'prediction_stake')
    .reduce((sum, e) => sum + Math.abs(e.amountCoins), 0);

  const recentTransactions = ledger.slice(0, 5);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Wallet Balance Hero Card */}
      <div className="relative p-6 sm:p-8 rounded-2xl bg-[#101927] border border-[#233147] overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-[#28D7E5] uppercase tracking-wider">
              DEMO VIRTUAL LEDGER
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#28D7E5]/10 text-[#28D7E5] border border-[#28D7E5]/20">
              PRACTICE ACCOUNT
            </span>
          </div>

          <div>
            <div className="flex items-center gap-3">
              <CoinPulseCoin size={36} animated />
              <span className="text-3xl sm:text-4xl font-bold font-['Space_Grotesk'] text-[#F1F5FB] tabular-nums">
                {wallet ? formatCoins(wallet.balanceCoins) : '0'}
              </span>
              <span className="text-sm font-bold font-mono text-[#9AA8BB]">COINS</span>
            </div>
            <p className="text-sm font-semibold text-[#20D997] mt-1">
              ≈ {wallet ? coinsToUSD(wallet.balanceCoins) : '$0.00'} USD demo equivalent
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#6E7D92]">
            <ShieldAlert className="w-4 h-4 text-[#F5B942]" />
            <span>Virtual demo balance • No cash value • Cannot be withdrawn</span>
          </div>
        </div>

        {/* Right CTA */}
        <div className="flex flex-col sm:flex-row gap-3 z-10">
          <button
            onClick={resetBalance}
            className="h-11 px-5 rounded-xl bg-[#141F30] hover:bg-[#1A273A] border border-[#28D7E5]/30 text-xs font-semibold text-[#28D7E5] flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Replenish 200,000 Coins</span>
          </button>
          <button
            onClick={() => onNavigate('/trade')}
            className="h-11 px-5 rounded-xl bg-gradient-to-r from-[#28D7E5] to-[#14B8A6] text-[#06131A] text-xs font-bold flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-md shadow-[#28D7E5]/15"
          >
            <span>Trade Demo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3 Accounting Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-[#101927] border border-[#233147]">
          <div className="flex items-center justify-between text-xs text-[#9AA8BB]">
            <span>Total Demo Credits</span>
            <ArrowDownLeft className="w-4 h-4 text-[#20D997]" />
          </div>
          <div className="text-2xl font-bold font-['Space_Grotesk'] text-[#20D997] mt-2 tabular-nums">
            +{formatCoins(totalCredits)}
          </div>
          <span className="text-xs text-[#6E7D92] mt-1 block">
            Welcome bonus & winning round payouts
          </span>
        </div>

        <div className="p-5 rounded-xl bg-[#101927] border border-[#233147]">
          <div className="flex items-center justify-between text-xs text-[#9AA8BB]">
            <span>Total Demo Debits</span>
            <ArrowUpRight className="w-4 h-4 text-[#FF5C72]" />
          </div>
          <div className="text-2xl font-bold font-['Space_Grotesk'] text-[#FF5C72] mt-2 tabular-nums">
            -{formatCoins(totalDebits)}
          </div>
          <span className="text-xs text-[#6E7D92] mt-1 block">
            Prediction stakes locked in practice
          </span>
        </div>

        <div className="p-5 rounded-xl bg-[#101927] border border-[#233147]">
          <div className="flex items-center justify-between text-xs text-[#9AA8BB]">
            <span>Total Staked Turnover</span>
            <Wallet className="w-4 h-4 text-[#28D7E5]" />
          </div>
          <div className="text-2xl font-bold font-['Space_Grotesk'] text-[#F1F5FB] mt-2 tabular-nums">
            {formatCoins(totalStaked)}
          </div>
          <span className="text-xs text-[#6E7D92] mt-1 block">
            Cumulative practice volume
          </span>
        </div>
      </div>

      {/* Conversion & Rules Explanatory Box */}
      <div className="p-5 rounded-xl bg-[#0C1320] border border-[#1A2637] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-[#F1F5FB] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#28D7E5]" />
            Conversion Peg & Ledger Transparency
          </h4>
          <p className="text-xs text-[#9AA8BB] leading-relaxed">
            The CoinPulse virtual economy maintains a fixed benchmark of <strong>200 virtual coins = $1.00 USD</strong>. All account movements, stakes, and settlement credits are maintained atomically in browser storage.
          </p>
        </div>
        <button
          onClick={() => onNavigate('/transactions')}
          className="text-xs text-[#28D7E5] hover:underline flex items-center gap-1 shrink-0 font-medium"
        >
          <span>Full Transaction Ledger</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Recent Ledger Activity */}
      <div className="p-5 rounded-xl bg-[#101927] border border-[#233147]">
        <div className="flex items-center justify-between pb-3 border-b border-[#1A2637] mb-3">
          <h3 className="text-sm font-semibold text-[#F1F5FB] flex items-center gap-2">
            <Receipt className="w-4 h-4 text-[#28D7E5]" />
            Recent Wallet Ledger Operations
          </h3>
          <button
            onClick={() => onNavigate('/transactions')}
            className="text-xs text-[#28D7E5] hover:underline"
          >
            View all
          </button>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#6E7D92]">
            No wallet ledger activity yet.
          </div>
        ) : (
          <div className="divide-y divide-[#1A2637]">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-[#F1F5FB]">{tx.description}</div>
                  <div className="text-[11px] font-mono text-[#6E7D92] mt-0.5">
                    Ref: {tx.referenceId} · {formatDate(tx.createdAt)}
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`font-mono font-bold text-sm tabular-nums ${
                      tx.amountCoins >= 0 ? 'text-[#20D997]' : 'text-[#FF5C72]'
                    }`}
                  >
                    {tx.amountCoins >= 0 ? '+' : ''}
                    {formatCoins(tx.amountCoins)} coins
                  </div>
                  <div className="text-[11px] font-mono text-[#6E7D92]">
                    Bal: {formatCoins(tx.balanceAfterCoins)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
