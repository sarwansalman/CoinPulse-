import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storageService';
import { CoinPulseCoin } from '../../components/brand/CoinPulseCoin';
import { formatCoins, coinsToUSD, formatDate } from '../../lib/formatters';
import { User, Mail, ShieldCheck, Calendar, Check, Save } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { currentUser, wallet, refreshData, addToast } = useApp();
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!displayName.trim()) {
      addToast('error', 'Validation Error', 'Display name cannot be empty.');
      return;
    }

    setSaving(true);
    StorageService.updateUser({
      ...currentUser,
      displayName: displayName.trim(),
    });
    refreshData();
    setTimeout(() => {
      setSaving(false);
      addToast('success', 'Profile Updated', 'Your display name was successfully saved.');
    }, 300);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="p-5 sm:p-6 rounded-2xl bg-[#101927] border border-[#233147]">
        <h2 className="text-xl font-bold font-['Space_Grotesk'] text-[#F1F5FB]">
          Account Profile
        </h2>
        <p className="text-xs text-[#9AA8BB] mt-1">
          Manage your personal credentials and trading identity.
        </p>

        {/* Profile Details Card */}
        <div className="mt-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-[#1A2637]">
          <div className="w-20 h-20 rounded-2xl bg-[#0C1320] border-2 border-[#28D7E5]/40 overflow-hidden flex items-center justify-center shrink-0">
            {currentUser?.avatar ? (
              <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-[#28D7E5]" />
            )}
          </div>

          <div className="flex-1 space-y-2 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h3 className="text-lg font-bold text-[#F1F5FB]">
                {currentUser?.displayName || 'Demo Trader'}
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#28D7E5]/10 text-[#28D7E5] border border-[#28D7E5]/20 uppercase">
                {currentUser?.role === 'admin' ? 'Administrator' : 'Demo Account'}
              </span>
            </div>
            <p className="text-xs font-mono text-[#9AA8BB]">{currentUser?.email}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-[#6E7D92] pt-1">
              <span className="flex items-center gap-1.5 font-mono">
                <Calendar className="w-3.5 h-3.5 text-[#28D7E5]" />
                Created {currentUser?.createdAt ? formatDate(currentUser.createdAt) : 'Recently'}
              </span>
              <span className="flex items-center gap-1.5 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-[#20D997]" />
                Status: {currentUser?.accountStatus || 'Active'}
              </span>
            </div>
          </div>
        </div>

        {/* Editable Form */}
        <form onSubmit={handleSave} className="mt-6 space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-medium text-[#9AA8BB] mb-1.5">
              Display Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6E7D92]" />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="w-full h-11 pl-9 pr-3 rounded-lg bg-[#0C1320] border border-[#233147] focus:border-[#28D7E5] focus:outline-none text-xs text-[#F1F5FB] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#9AA8BB] mb-1.5">
              Email Address (Read-only)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6E7D92]" />
              <input
                type="email"
                value={currentUser?.email || ''}
                disabled
                className="w-full h-11 pl-9 pr-3 rounded-lg bg-[#0C1320]/50 border border-[#1A2637] text-xs text-[#6E7D92] cursor-not-allowed font-mono"
              />
            </div>
            <p className="text-[11px] text-[#526176] mt-1">
              Account email is locked to ensure deterministic ledger continuity.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="h-10 px-6 rounded-xl bg-gradient-to-r from-[#28D7E5] to-[#14B8A6] text-[#06131A] font-bold text-xs flex items-center gap-2 hover:opacity-95 transition-all shadow-md shadow-[#28D7E5]/15 disabled:opacity-50"
          >
            {saving ? (
              <span>Saving...</span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Linked Demo Wallet Summary */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#101927] border border-[#233147]">
        <h3 className="text-sm font-semibold text-[#F1F5FB] mb-3">Linked Demo Portfolio</h3>
        <div className="p-4 rounded-xl bg-[#0C1320] border border-[#1A2637] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CoinPulseCoin size={30} />
            <div>
              <div className="text-xs font-mono text-[#6E7D92]">Virtual Balance</div>
              <div className="text-lg font-bold font-['Space_Grotesk'] text-[#F1F5FB]">
                {wallet ? formatCoins(wallet.balanceCoins) : '0'} Coins
              </div>
            </div>
          </div>
          <span className="text-xs text-[#20D997] font-semibold font-mono">
            {wallet ? coinsToUSD(wallet.balanceCoins) : '$0.00'} USD
          </span>
        </div>
      </div>
    </div>
  );
};
