import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Asset } from '../../types';
import { formatPrice } from '../../lib/formatters';
import { Search, ArrowUpDown, TrendingUp, TrendingDown, Coins } from 'lucide-react';

interface MarketsPageProps {
  onNavigate: (route: string) => void;
}

export const MarketsPage: React.FC<MarketsPageProps> = ({ onNavigate }) => {
  const { assets, setSelectedAsset } = useApp();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'change'>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: 'name' | 'price' | 'change') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const filtered = assets
    .filter(
      (a) =>
        a.displayName.toLowerCase().includes(search.toLowerCase()) ||
        a.symbol.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      let comp = 0;
      if (sortBy === 'name') comp = a.displayName.localeCompare(b.displayName);
      if (sortBy === 'price') comp = a.price - b.price;
      if (sortBy === 'change') comp = a.change24h - b.change24h;
      return sortOrder === 'asc' ? comp : -comp;
    });

  const handleTradeAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    onNavigate('/trade');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#101927] border border-[#233147]">
        <div>
          <h2 className="text-xl font-bold font-['Space_Grotesk'] text-[#F1F5FB]">
            Crypto Markets
          </h2>
          <p className="text-xs text-[#9AA8BB] mt-1">
            Real-time simulated price feeds with high-frequency micro-volatility.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6E7D92]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search asset or pair..."
            className="w-full h-10 pl-9 pr-3 rounded-lg bg-[#0C1320] border border-[#233147] focus:border-[#28D7E5] focus:outline-none text-xs text-[#F1F5FB] placeholder-[#526176] transition-colors"
          />
        </div>
      </div>

      {/* Markets Table */}
      <div className="rounded-xl bg-[#101927] border border-[#233147] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#6E7D92]">
            <Coins className="w-8 h-8 text-[#233147] mx-auto mb-2" />
            No assets match "{search}".
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1A2637] bg-[#0C1320] text-[#6E7D92] font-mono text-[11px] uppercase select-none">
                  <th
                    className="py-3 px-4 cursor-pointer hover:text-[#F1F5FB]"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Asset / Pair</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    className="py-3 px-4 cursor-pointer hover:text-[#F1F5FB]"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Live Price</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    className="py-3 px-4 cursor-pointer hover:text-[#F1F5FB]"
                    onClick={() => handleSort('change')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>24h Change</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4 hidden md:table-cell">24h High / Low</th>
                  <th className="py-3 px-4 hidden sm:table-cell">Simulated Trend</th>
                  <th className="py-3 px-4">Feed Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A2637]">
                {filtered.map((asset) => (
                  <tr
                    key={asset.id}
                    className="hover:bg-[#141F30]/60 transition-colors cursor-pointer group"
                    onClick={() => handleTradeAsset(asset)}
                  >
                    {/* Asset Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#0C1320] border border-[#233147] flex items-center justify-center font-bold text-xs font-['Space_Grotesk'] text-[#28D7E5]">
                          {asset.symbol.split('/')[0]}
                        </div>
                        <div>
                          <div className="font-bold text-[#F1F5FB] group-hover:text-[#70EDF2] transition-colors">
                            {asset.displayName}
                          </div>
                          <div className="text-[11px] text-[#6E7D92] font-mono">
                            {asset.symbol}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 font-mono font-bold text-sm text-[#F1F5FB] tabular-nums">
                      {formatPrice(asset.price)}
                    </td>

                    {/* 24h Change */}
                    <td className="py-3.5 px-4">
                      <div
                        className={`inline-flex items-center gap-1 font-mono font-bold text-xs ${
                          asset.change24h >= 0 ? 'text-[#20D997]' : 'text-[#FF5C72]'
                        }`}
                      >
                        {asset.change24h >= 0 ? (
                          <TrendingUp className="w-3.5 h-3.5" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5" />
                        )}
                        <span>
                          {asset.change24h >= 0 ? '+' : ''}
                          {asset.change24h.toFixed(2)}%
                        </span>
                      </div>
                    </td>

                    {/* High / Low */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#9AA8BB] hidden md:table-cell">
                      <div>H: {formatPrice(asset.high24h)}</div>
                      <div className="text-[#6E7D92]">L: {formatPrice(asset.low24h)}</div>
                    </td>

                    {/* Sparkline */}
                    <td className="py-3.5 px-4 hidden sm:table-cell w-32">
                      <div className="h-6 w-28">
                        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                          <polyline
                            fill="none"
                            stroke={asset.change24h >= 0 ? '#20D997' : '#FF5C72'}
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points={asset.sparkline
                              .map((val, idx) => {
                                const min = Math.min(...asset.sparkline);
                                const max = Math.max(...asset.sparkline);
                                const range = max - min || 1;
                                const x = (idx / (asset.sparkline.length - 1)) * 100;
                                const y = 24 - ((val - min) / range) * 20 - 2;
                                return `${x}%,${y}`;
                              })
                              .join(' ')}
                          />
                        </svg>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#28D7E5]/10 text-[#28D7E5] border border-[#28D7E5]/20">
                        SIMULATED
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTradeAsset(asset);
                        }}
                        className="h-8 px-3 rounded-lg bg-[#28D7E5] hover:bg-[#70EDF2] text-[#06131A] font-bold text-xs transition-colors"
                      >
                        Trade Demo
                      </button>
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
