import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storageService';
import { TransactionType } from '../../types';
import { formatCoins, formatDate } from '../../lib/formatters';
import { Search, Receipt, ArrowRight } from 'lucide-react';

interface TransactionsPageProps {
  onNavigate: (route: string) => void;
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({ onNavigate }) => {
  const { currentUser } = useApp();
  const ledger = currentUser ? StorageService.getLedger(currentUser.id) : [];

  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = ledger.filter((item) => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesSearch =
      search === '' ||
      item.referenceId.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#101927] border border-[#233147]">
        <div>
          <h2 className="text-xl font-bold font-['Space_Grotesk'] text-[#F1F5FB]">
            Wallet Ledger & Transactions
          </h2>
          <p className="text-xs text-[#9AA8BB] mt-1">
            Complete audit trail of all demo coin credits, stakes, and round settlements.
          </p>
        </div>

        {/* Filter tools */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#6E7D92]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reference or description..."
              className="h-9 pl-8 pr-3 rounded-lg bg-[#0C1320] border border-[#233147] focus:border-[#28D7E5] focus:outline-none text-xs text-[#F1F5FB] placeholder-[#526176] transition-colors"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as TransactionType | 'all')}
            className="h-9 px-3 rounded-lg bg-[#0C1320] border border-[#233147] text-xs text-[#F1F5FB] focus:border-[#28D7E5] focus:outline-none cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="welcome_bonus">Welcome Bonus</option>
            <option value="prediction_stake">Prediction Stake</option>
            <option value="prediction_win">Prediction Win</option>
            <option value="prediction_refund">Prediction Refund / Tie</option>
            <option value="demo_reset">Balance Reset</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-xl bg-[#101927] border border-[#233147] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#6E7D92] space-y-3">
            <Receipt className="w-8 h-8 text-[#233147] mx-auto" />
            <p>No transactions match your criteria.</p>
            <button
              onClick={() => onNavigate('/wallet')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#28D7E5] text-[#06131A] font-bold text-xs"
            >
              <span>Back to Wallet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1A2637] bg-[#0C1320] text-[#6E7D92] font-mono text-[11px] uppercase select-none">
                  <th className="py-3 px-4">Reference ID</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Coin Amount</th>
                  <th className="py-3 px-4">Balance After</th>
                  <th className="py-3 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A2637]">
                {filtered.map((item) => {
                  const typeLabels: Record<TransactionType, { label: string; color: string }> = {
                    welcome_bonus: { label: 'BONUS', color: 'bg-[#28D7E5]/15 text-[#28D7E5]' },
                    prediction_stake: { label: 'STAKE', color: 'bg-[#FF5C72]/15 text-[#FF5C72]' },
                    prediction_win: { label: 'WIN PAYOUT', color: 'bg-[#20D997]/15 text-[#20D997]' },
                    prediction_refund: { label: 'REFUND', color: 'bg-[#8B9BB0]/15 text-[#8B9BB0]' },
                    admin_adjustment: { label: 'ADJUSTMENT', color: 'bg-[#F5B942]/15 text-[#F5B942]' },
                    demo_reset: { label: 'RESET', color: 'bg-[#28D7E5]/15 text-[#28D7E5]' },
                  };

                  const badge = typeLabels[item.type] || { label: item.type, color: 'bg-[#233147] text-[#9AA8BB]' };

                  return (
                    <tr key={item.id} className="hover:bg-[#141F30]/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-medium text-[11px] text-[#28D7E5]">
                        {item.referenceId}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${badge.color}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#F1F5FB]">
                        {item.description}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-sm tabular-nums">
                        <span className={item.amountCoins >= 0 ? 'text-[#20D997]' : 'text-[#FF5C72]'}>
                          {item.amountCoins >= 0 ? '+' : ''}
                          {formatCoins(item.amountCoins)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#9AA8BB] tabular-nums">
                        {formatCoins(item.balanceAfterCoins)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-[11px] text-[#6E7D92]">
                        {formatDate(item.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
