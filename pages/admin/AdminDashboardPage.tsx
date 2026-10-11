import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storageService';
import { formatCoins, formatPrice, formatDate } from '../../lib/formatters';
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  Sliders,
  FileText,
  Activity,
  RotateCcw,
  Check,
  Save,
  Lock,
} from 'lucide-react';

interface AdminDashboardPageProps {
  onNavigate: (route: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const { currentUser, loginUser, addToast } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'config' | 'logs'>('overview');
  const [payoutRate, setPayoutRate] = useState<number>(() => {
    return Math.round(StorageService.getSettings().defaultPayoutRate * 100);
  });
  const [volatility, setVolatility] = useState<number>(() => {
    return StorageService.getSettings().volatilityMultiplier;
  });

  // Verify Admin authorization
  if (currentUser?.role !== 'admin') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md p-6 rounded-2xl bg-[#101927] border border-[#FF5C72]/30 text-center shadow-xl space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#FF5C72]/15 text-[#FF5C72] flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold font-['Space_Grotesk'] text-[#F1F5FB]">
            Admin Access Required
          </h2>
          <p className="text-xs text-[#9AA8BB] leading-relaxed">
            Your current account (<strong>{currentUser?.email}</strong>) has the <code>user</code> role and does not have administrative permissions.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={async () => {
                await loginUser('admin@coinpulse.demo');
              }}
              className="w-full h-10 rounded-xl bg-[#28D7E5] text-[#06131A] font-bold text-xs hover:bg-[#70EDF2] transition-colors"
            >
              Switch to Admin Demo Account (admin@coinpulse.demo)
            </button>
            <button
              onClick={() => onNavigate('/dashboard')}
              className="w-full h-10 rounded-xl bg-[#141F30] hover:bg-[#1A273A] text-xs font-semibold text-[#9AA8BB]"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const users = StorageService.getUsers();
  const allPredictions = StorageService.getPredictions();
  const auditLogs = StorageService.getAuditLogs();
  const assets = StorageService.getAssets();

  // Overview metrics
  const totalVolume = allPredictions.reduce((sum, p) => sum + p.stakeCoins, 0);
  const settled = allPredictions.filter((p) => p.status !== 'active');
  const won = settled.filter((p) => p.status === 'won');
  const overallWinRate = settled.length > 0 ? ((won.length / settled.length) * 100).toFixed(1) : '0.0';

  const handleSaveConfig = () => {
    const currentSettings = StorageService.getSettings();
    const updated = {
      ...currentSettings,
      defaultPayoutRate: payoutRate / 100,
      volatilityMultiplier: volatility,
    };
    StorageService.updateSettings(updated);

    StorageService.logAudit(
      currentUser.id,
      currentUser.email,
      'ADMIN_CONFIG_UPDATED',
      'SYSTEM_CONFIG',
      'SETTINGS',
      `Updated payout rate to ${payoutRate}% and volatility to ${volatility}x`
    );

    addToast('success', 'Configuration Saved', 'Platform demo parameters successfully updated.');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Admin Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#101927] border border-[#233147] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-['Space_Grotesk'] text-[#F1F5FB]">
              Admin Management Console
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#F5B942]/15 text-[#F5B942] border border-[#F5B942]/30">
              PRIVILEGED
            </span>
          </div>
          <p className="text-xs text-[#9AA8BB] mt-1">
            Supervise demo engine parameters, inspect user ledger states, and review audit logs.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-[#0C1320] p-1 rounded-lg border border-[#233147] text-xs">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'users', label: 'Users & Wallets', icon: Users },
            { id: 'config', label: 'Demo Engine', icon: Sliders },
            { id: 'logs', label: 'Audit Logs', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#141F30] text-[#70EDF2] border border-[#28D7E5]/30'
                    : 'text-[#8190A5] hover:text-[#F1F5FB]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#101927] border border-[#233147]">
              <span className="text-[11px] font-mono text-[#6E7D92] uppercase">Active Users</span>
              <div className="text-2xl font-bold font-['Space_Grotesk'] text-[#F1F5FB] mt-1">
                {users.length}
              </div>
              <span className="text-[10px] text-[#28D7E5]">All accounts in storage</span>
            </div>

            <div className="p-4 rounded-xl bg-[#101927] border border-[#233147]">
              <span className="text-[11px] font-mono text-[#6E7D92] uppercase">Total Predictions</span>
              <div className="text-2xl font-bold font-['Space_Grotesk'] text-[#F1F5FB] mt-1">
                {allPredictions.length}
              </div>
              <span className="text-[10px] text-[#20D997]">{settled.length} settled</span>
            </div>

            <div className="p-4 rounded-xl bg-[#101927] border border-[#233147]">
              <span className="text-[11px] font-mono text-[#6E7D92] uppercase">Demo Volume Staked</span>
              <div className="text-2xl font-bold font-['Space_Grotesk'] text-[#F1F5FB] mt-1 tabular-nums">
                {formatCoins(totalVolume)}
              </div>
              <span className="text-[10px] text-[#9AA8BB]">Virtual coins</span>
            </div>

            <div className="p-4 rounded-xl bg-[#101927] border border-[#233147]">
              <span className="text-[11px] font-mono text-[#6E7D92] uppercase">Platform Win Rate</span>
              <div className="text-2xl font-bold font-['Space_Grotesk'] text-[#20D997] mt-1">
                {overallWinRate}%
              </div>
              <span className="text-[10px] text-[#9AA8BB]">{won.length} winning rounds</span>
            </div>
          </div>

          {/* Active Asset Feeds */}
          <div className="p-5 rounded-xl bg-[#101927] border border-[#233147]">
            <h3 className="text-sm font-semibold text-[#F1F5FB] mb-3">Simulated Market Feeds</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {assets.map((a) => (
                <div key={a.id} className="p-3 rounded-lg bg-[#0C1320] border border-[#1A2637]">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#F1F5FB]">{a.symbol}</span>
                    <span className="text-[10px] font-mono text-[#28D7E5]">SIMULATED</span>
                  </div>
                  <div className="text-sm font-mono font-bold text-[#F1F5FB] mt-1">
                    {formatPrice(a.price)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="rounded-xl bg-[#101927] border border-[#233147] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1A2637] bg-[#0C1320] text-[#6E7D92] font-mono text-[11px] uppercase">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Demo Balance</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A2637]">
                {users.map((u) => {
                  const uWallet = StorageService.getWallet(u.id);
                  return (
                    <tr key={u.id} className="hover:bg-[#141F30]/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#F1F5FB]">
                        {u.displayName}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#9AA8BB]">
                        {u.email}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            u.role === 'admin'
                              ? 'bg-[#F5B942]/15 text-[#F5B942] border border-[#F5B942]/30'
                              : 'bg-[#28D7E5]/15 text-[#28D7E5] border border-[#28D7E5]/30'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#F1F5FB] tabular-nums">
                        {formatCoins(uWallet.balanceCoins)} coins
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[11px] text-[#20D997] font-semibold">Active</span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-[11px] text-[#6E7D92]">
                        {formatDate(u.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Config Tab */}
      {activeTab === 'config' && (
        <div className="p-6 rounded-2xl bg-[#101927] border border-[#233147] space-y-6 max-w-2xl">
          <div>
            <h3 className="text-base font-bold text-[#F1F5FB] font-['Space_Grotesk']">
              Demo Prediction Parameters
            </h3>
            <p className="text-xs text-[#9AA8BB] mt-1">
              Adjust settlement payout multipliers and market micro-volatility.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <label className="font-semibold text-[#F1F5FB]">Net Payout Profit Rate (%)</label>
                <span className="font-mono text-[#28D7E5] font-bold">+{payoutRate}% (Total {((100 + payoutRate) / 100).toFixed(2)}x)</span>
              </div>
              <input
                type="range"
                min={50}
                max={95}
                value={payoutRate}
                onChange={(e) => setPayoutRate(parseInt(e.target.value))}
                className="w-full accent-[#28D7E5]"
              />
              <span className="text-[11px] text-[#6E7D92]">
                Default is 85% net return on winning rounds.
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <label className="font-semibold text-[#F1F5FB]">Brownian Micro-Volatility Factor</label>
                <span className="font-mono text-[#28D7E5] font-bold">{volatility.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={3.0}
                step={0.1}
                value={volatility}
                onChange={(e) => setVolatility(parseFloat(e.target.value))}
                className="w-full accent-[#28D7E5]"
              />
              <span className="text-[11px] text-[#6E7D92]">
                Controls standard deviation of price movements per second.
              </span>
            </div>

            <button
              onClick={handleSaveConfig}
              className="h-10 px-5 rounded-xl bg-gradient-to-r from-[#28D7E5] to-[#14B8A6] text-[#06131A] font-bold text-xs flex items-center gap-2 hover:opacity-95 transition-all shadow-md shadow-[#28D7E5]/15"
            >
              <Save className="w-4 h-4" />
              <span>Save Parameters</span>
            </button>
          </div>
        </div>
      )}

      {/* Audit Logs Tab */}
      {activeTab === 'logs' && (
        <div className="rounded-xl bg-[#101927] border border-[#233147] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1A2637] bg-[#0C1320] text-[#6E7D92] font-mono text-[11px] uppercase">
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Target</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A2637]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#141F30]/50 transition-colors font-mono">
                    <td className="py-3 px-4 text-[#28D7E5] font-semibold text-[11px]">
                      {log.action}
                    </td>
                    <td className="py-3 px-4 text-[#9AA8BB] text-[11px]">
                      {log.actorEmail}
                    </td>
                    <td className="py-3 px-4 text-[#6E7D92] text-[11px]">
                      {log.targetType}:{log.targetId}
                    </td>
                    <td className="py-3 px-4 text-[#F1F5FB] font-sans text-xs">
                      {log.details}
                    </td>
                    <td className="py-3 px-4 text-right text-[11px] text-[#6E7D92]">
                      {formatDate(log.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
