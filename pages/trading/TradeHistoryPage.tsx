import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PredictionStatus } from '../../types';
import { formatCoins, formatPrice, formatDate } from '../../lib/formatters';
import { Search, History, Filter, ArrowRight } from 'lucide-react';

interface TradeHistoryPageProps {
  onNavigate: (route: string) => void;
}

export const TradeHistoryPage: React.FC<TradeHistoryPageProps> = ({ onNavigate }) => {
  const { userPredictions } = useApp();
  const [filter, setFilter] = useState<PredictionStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = userPredictions.filter((p) => {
    const matchesFilter = filter === 'all' || p.status === filter;
    const matchesSearch =
      search === '' ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.assetSymbol.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#101927] border border-[#233147]">
        <div>
          <h2 className="text-xl font-bold font-['Space_Grotesk'] text-[#F1F5FB]">
            Trade History
          </h2>
          <p className="text-xs text-[#9AA8BB] mt-1">
            Complete immutable record of all demo prediction outcomes and settlements.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#6E7D92]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search trade ID..."
              className="h-9 pl-8 pr-3 rounded-lg bg-[#0C1320] border border-[#233147] focus:border-[#28D7E5] focus:outline-none text-xs text-[#F1F5FB] placeholder-[#526176] transition-colors"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center bg-[#0C1320] p-1 rounded-lg border border-[#233147] text-xs">
            {(['all', 'active', 'won', 'lost', 'tie'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-2.5 py-1 rounded text-xs font-medium capitalize transition-colors ${
                  filter === s
                    ? 'bg-[#141F30] text-[#70EDF2] border border-[#28D7E5]/30'
                    : 'text-[#8190A5] hover:text-[#F1F5FB]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="rounded-xl bg-[#101927] border border-[#233147] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#6E7D92] space-y-3">
            <History className="w-8 h-8 text-[#233147] mx-auto" />
            <p>Your demo trading history will appear here.</p>
            <button
              onClick={() => onNavigate('/trade')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#28D7E5] text-[#06131A] font-bold text-xs"
            >
              <span>Place Demo Trade</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1A2637] bg-[#0C1320] text-[#6E7D92] font-mono text-[11px] uppercase">
                  <th className="py-3 px-4">Trade ID</th>
                  <th className="py-3 px-4">Asset</th>
                  <th className="py-3 px-4">Direction</th>
                  <th className="py-3 px-4">Entry / Strike</th>
                  <th className="py-3 px-4">Exit Price</th>
                  <th className="py-3 px-4">Stake</th>
                  <th className="py-3 px-4">Status & Payout</th>
                  <th className="py-3 px-4 text-right">Settled Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A2637]">
                {filtered.map((pred) => {
                  const statusStyles = {
                    won: 'bg-[#20D997]/15 text-[#20D997] border-[#20D997]/30',
                    lost: 'bg-[#FF5C72]/15 text-[#FF5C72] border-[#FF5C72]/30',
                    active: 'bg-[#60A5FA]/15 text-[#60A5FA] border-[#60A5FA]/30',
                    tie: 'bg-[#8B9BB0]/15 text-[#8B9BB0] border-[#8B9BB0]/30',
                  };

                  return (
                    <tr key={pred.id} className="hover:bg-[#141F30]/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#6E7D92]">
                        {pred.id.substring(0, 15)}...
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#F1F5FB]">
                        {pred.assetSymbol}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`font-mono font-bold text-[10px] px-2 py-0.5 rounded ${
                            pred.direction === 'UP'
                              ? 'bg-[#20D997]/15 text-[#20D997]'
                              : 'bg-[#FF5C72]/15 text-[#FF5C72]'
                          }`}
                        >
                          {pred.direction === 'UP' ? '▲ UP' : '▼ DOWN'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#F1F5FB]">
                        {formatPrice(pred.openingPrice)}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#9AA8BB]">
                        {pred.closingPrice ? formatPrice(pred.closingPrice) : 'Pending...'}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#F1F5FB] tabular-nums">
                        {formatCoins(pred.stakeCoins)} coins
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded border text-[10px] font-mono font-bold uppercase ${
                              statusStyles[pred.status]
                            }`}
                          >
                            {pred.status}
                          </span>
                          {pred.status === 'won' && (
                            <span className="font-mono font-bold text-[#20D997]">
                              +{formatCoins(pred.payoutCoins)}
                            </span>
                          )}
                          {pred.status === 'tie' && (
                            <span className="font-mono text-[#8B9BB0]">
                              +{formatCoins(pred.stakeCoins)} (refund)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-[11px] text-[#6E7D92]">
                        {pred.settledAt ? formatDate(pred.settledAt) : 'In Progress'}
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
