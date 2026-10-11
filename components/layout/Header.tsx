import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CoinPulseCoin } from '../brand/CoinPulseCoin';
import { formatCoins, coinsToUSD } from '../../lib/formatters';
import {
  Menu,
  Bell,
  User as UserIcon,
  LogOut,
  Shield,
  RotateCcw,
  Wallet,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  currentRoute,
  onNavigate,
}) => {
  const { currentUser, wallet, userPredictions, logoutUser, resetBalance, loginUser } = useApp();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format breadcrumb title
  const getPageTitle = (route: string) => {
    switch (route) {
      case '/dashboard':
        return 'Trading Dashboard';
      case '/trade':
        return 'Trade Demo Terminal';
      case '/markets':
        return 'Crypto Markets';
      case '/history':
        return 'Trade History';
      case '/wallet':
        return 'My Wallet';
      case '/transactions':
        return 'Wallet Ledger & Transactions';
      case '/profile':
        return 'Account Profile';
      case '/settings':
        return 'Settings & Preferences';
      case '/admin':
        return 'Admin Management Console';
      case '/help':
        return 'Help & Documentation';
      default:
        return 'CoinPulse Demo';
    }
  };

  const recentPredictions = userPredictions.slice(0, 4);

  return (
    <header className="h-[68px] bg-[#080D16] border-b border-[#1A2637] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Left: Mobile hamburger & breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-[#9AA8BB] hover:text-[#F1F5FB] hover:bg-[#141F30] rounded-lg transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[#6E7D92] hidden sm:inline">Platform</span>
            <span className="text-xs text-[#6E7D92] hidden sm:inline">/</span>
            <h1 className="text-sm sm:text-base font-semibold text-[#F1F5FB] tracking-tight">
              {getPageTitle(currentRoute)}
            </h1>
          </div>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Demo balance pill */}
        {wallet && (
          <button
            onClick={() => onNavigate('/wallet')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#101927] border border-[#233147] hover:border-[#28D7E5]/50 transition-colors group cursor-pointer"
            title="Click to view wallet details"
          >
            <CoinPulseCoin size={20} />
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-xs sm:text-sm font-bold font-mono tabular-nums text-[#F1F5FB] group-hover:text-[#70EDF2]">
                  {formatCoins(wallet.balanceCoins)}
                </span>
                <span className="text-[10px] font-mono font-bold text-[#28D7E5] px-1 py-0.2 rounded bg-[#28D7E5]/10 border border-[#28D7E5]/20">
                  DEMO
                </span>
              </div>
              <span className="text-[10px] text-[#6E7D92] font-mono leading-none mt-0.5 hidden sm:inline">
                ~ {coinsToUSD(wallet.balanceCoins)} equiv.
              </span>
            </div>
          </button>
        )}

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 text-[#9AA8BB] hover:text-[#F1F5FB] hover:bg-[#141F30] rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            {recentPredictions.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#28D7E5]" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#141F30] border border-[#233147] rounded-xl shadow-2xl p-3 z-50 text-left">
              <div className="flex items-center justify-between pb-2 border-b border-[#233147] mb-2">
                <span className="text-xs font-semibold text-[#F1F5FB]">Recent Demo Activity</span>
                <button
                  onClick={() => {
                    setNotificationsOpen(false);
                    onNavigate('/history');
                  }}
                  className="text-[11px] text-[#28D7E5] hover:underline"
                >
                  View all
                </button>
              </div>

              {recentPredictions.length === 0 ? (
                <div className="py-6 text-center text-xs text-[#6E7D92]">
                  No recent predictions recorded yet.
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {recentPredictions.map((pred) => (
                    <div
                      key={pred.id}
                      onClick={() => {
                        setNotificationsOpen(false);
                        onNavigate('/history');
                      }}
                      className="p-2 rounded-lg bg-[#101927] hover:bg-[#1A273A] transition-colors cursor-pointer flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        {pred.status === 'won' ? (
                          <CheckCircle2 className="w-4 h-4 text-[#20D997] shrink-0" />
                        ) : pred.status === 'active' ? (
                          <div className="w-4 h-4 rounded-full border-2 border-[#28D7E5] border-t-transparent animate-spin" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-[#FF5C72] shrink-0" />
                        )}
                        <div>
                          <div className="font-medium text-[#F1F5FB]">
                            {pred.direction} on {pred.assetSymbol}
                          </div>
                          <div className="text-[10px] text-[#6E7D92]">
                            {pred.stakeCoins.toLocaleString()} coins
                          </div>
                        </div>
                      </div>
                      <span
                        className={`text-[11px] font-mono font-semibold uppercase ${
                          pred.status === 'won'
                            ? 'text-[#20D997]'
                            : pred.status === 'active'
                            ? 'text-[#28D7E5]'
                            : 'text-[#FF5C72]'
                        }`}
                      >
                        {pred.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* User profile dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#141F30] transition-colors"
            aria-label="User profile menu"
          >
            <div className="w-8 h-8 rounded-full bg-[#1A273A] border border-[#28D7E5]/40 overflow-hidden flex items-center justify-center text-xs font-semibold text-[#28D7E5]">
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="w-4 h-4" />
              )}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-[#F1F5FB] leading-tight">
                {currentUser?.displayName || 'Demo Trader'}
              </span>
              <span className="text-[10px] font-mono text-[#28D7E5] leading-tight uppercase">
                {currentUser?.role === 'admin' ? 'Administrator' : 'Demo Account'}
              </span>
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[#141F30] border border-[#233147] rounded-xl shadow-2xl p-2 z-50">
              <div className="px-3 py-2 border-b border-[#233147] mb-1">
                <p className="text-xs font-semibold text-[#F1F5FB]">{currentUser?.displayName}</p>
                <p className="text-[11px] text-[#6E7D92] truncate">{currentUser?.email}</p>
                <span className="inline-block mt-1 text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-[#28D7E5]/10 text-[#28D7E5] border border-[#28D7E5]/20">
                  Role: {currentUser?.role}
                </span>
              </div>

              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    onNavigate('/profile');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#9AA8BB] hover:text-[#F1F5FB] hover:bg-[#1A273A] rounded-lg transition-colors text-left"
                >
                  <UserIcon className="w-4 h-4 text-[#8190A5]" />
                  <span>My Profile</span>
                </button>

                <button
                  onClick={() => {
                    setProfileOpen(false);
                    onNavigate('/wallet');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#9AA8BB] hover:text-[#F1F5FB] hover:bg-[#1A273A] rounded-lg transition-colors text-left"
                >
                  <Wallet className="w-4 h-4 text-[#8190A5]" />
                  <span>Demo Wallet</span>
                </button>

                <button
                  onClick={() => {
                    setProfileOpen(false);
                    resetBalance();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#28D7E5] hover:bg-[#1A273A] rounded-lg transition-colors text-left"
                >
                  <RotateCcw className="w-4 h-4 text-[#28D7E5]" />
                  <span>Replenish 200,000 Coins</span>
                </button>

                {currentUser?.role === 'admin' ? (
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      onNavigate('/admin');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#F5B942] hover:bg-[#1A273A] rounded-lg transition-colors text-left"
                  >
                    <Shield className="w-4 h-4 text-[#F5B942]" />
                    <span>Admin Console</span>
                  </button>
                ) : (
                  <button
                    onClick={async () => {
                      setProfileOpen(false);
                      await loginUser('admin@coinpulse.demo');
                      onNavigate('/admin');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#9AA8BB] hover:text-[#F5B942] hover:bg-[#1A273A] rounded-lg transition-colors text-left"
                  >
                    <Shield className="w-4 h-4 text-[#8190A5]" />
                    <span>Switch to Admin Account</span>
                  </button>
                )}

                <div className="h-px bg-[#233147] my-1" />

                <button
                  onClick={() => {
                    setProfileOpen(false);
                    logoutUser();
                    onNavigate('/');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#FF5C72] hover:bg-[#1A273A] rounded-lg transition-colors text-left"
                >
                  <LogOut className="w-4 h-4 text-[#FF5C72]" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
