import React from 'react';
import { BrandLogo } from '../brand/BrandLogo';
import { CoinPulseCoin } from '../brand/CoinPulseCoin';
import { useApp } from '../../context/AppContext';
import { formatCoins } from '../../lib/formatters';
import {
  LayoutDashboard,
  CandlestickChart,
  Coins,
  History,
  Wallet,
  Receipt,
  User,
  Settings,
  HelpCircle,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ArrowDownToLine,
  ArrowUpFromLine,
  X,
} from 'lucide-react';

interface NavItem {
  label: string;
  route: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  adminOnly?: boolean;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

interface SidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onNavigate,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const { wallet, currentUser } = useApp();

  const handleNavClick = (route: string) => {
    onNavigate(route);
    onCloseMobile();
  };

  const navGroups: NavGroup[] = [
    {
      group: 'MAIN',
      items: [
        { label: 'Dashboard', route: '/dashboard', icon: LayoutDashboard },
        { label: 'Trade Demo', route: '/trade', icon: CandlestickChart },
        { label: 'Markets', route: '/markets', icon: Coins },
        { label: 'Trade History', route: '/history', icon: History },
      ],
    },
    {
      group: 'ACCOUNT',
      items: [
        { label: 'My Wallet', route: '/wallet', icon: Wallet },
        { label: 'Transactions', route: '/transactions', icon: Receipt },
        { label: 'Profile', route: '/profile', icon: User },
        { label: 'Settings', route: '/settings', icon: Settings },
      ],
    },
    {
      group: 'FINANCE (DEMO ONLY)',
      items: [
        {
          label: 'Deposit',
          route: '/finance/deposit',
          icon: ArrowDownToLine,
          badge: 'N/A',
        },
        {
          label: 'Withdrawal',
          route: '/finance/withdrawal',
          icon: ArrowUpFromLine,
          badge: 'N/A',
        },
      ],
    },
    {
      group: 'SYSTEM',
      items: [
        { label: 'Admin Portal', route: '/admin', icon: ShieldCheck, adminOnly: true },
        { label: 'Help Center', route: '/help', icon: HelpCircle },
      ],
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-[#0A101B] border-r border-[#1A2637] transition-all duration-300 ${
          collapsed ? 'w-[76px]' : 'w-[236px]'
        } ${
          mobileOpen
            ? 'translate-x-0 w-[260px]'
            : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top brand header */}
        <div className="h-[68px] px-4 flex items-center justify-between border-b border-[#1A2637]">
          {(!collapsed || mobileOpen) ? (
            <div className="flex items-center justify-between w-full">
              <BrandLogo onClick={() => handleNavClick('/dashboard')} />
              {/* Close button for mobile */}
              <button
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 text-[#9AA8BB] hover:text-[#F1F5FB] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="w-full flex justify-center cursor-pointer" onClick={() => handleNavClick('/dashboard')}>
              <CoinPulseCoin size={30} animated />
            </div>
          )}
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {navGroups.map((group) => {
            // Filter admin only items if user is not admin
            const visibleItems = group.items.filter(
              (item) => !item.adminOnly || currentUser?.role === 'admin'
            );

            if (visibleItems.length === 0) return null;

            return (
              <div key={group.group}>
                {(!collapsed || mobileOpen) && (
                  <p className="px-3 mb-2 text-[10px] font-mono font-semibold text-[#6E7D92] tracking-wider uppercase">
                    {group.group}
                  </p>
                )}

                <div className="space-y-1">
                  {visibleItems.map((item) => {
                    const isActive = currentRoute === item.route;
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.route}
                        onClick={() => handleNavClick(item.route)}
                        title={collapsed && !mobileOpen ? item.label : undefined}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group select-none relative ${
                          isActive
                            ? 'bg-[#28D7E5]/10 text-[#70EDF2]'
                            : 'text-[#9AA8BB] hover:text-[#F1F5FB] hover:bg-[#141F30]'
                        }`}
                      >
                        {/* Active left indicator strip */}
                        {isActive && (
                          <div className="absolute left-0 top-1 bottom-1 w-[3px] bg-[#28D7E5] rounded-r" />
                        )}

                        <Icon
                          className={`w-[18px] h-[18px] shrink-0 transition-colors ${
                            isActive
                              ? 'text-[#28D7E5]'
                              : 'text-[#8190A5] group-hover:text-[#F1F5FB]'
                          }`}
                        />

                        {(!collapsed || mobileOpen) && (
                          <span className="flex-1 text-left truncate">{item.label}</span>
                        )}

                        {(!collapsed || mobileOpen) && item.badge && (
                          <span className="text-[9px] font-mono font-semibold px-1 py-0.2 rounded bg-[#233147] text-[#6E7D92]">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar balance summary (when expanded) */}
        {(!collapsed || mobileOpen) && wallet && (
          <div className="p-3 mx-3 mb-3 rounded-xl bg-[#101927] border border-[#233147]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#6E7D92] uppercase">Virtual Balance</span>
              <span className="text-[9px] font-mono text-[#28D7E5] bg-[#28D7E5]/10 px-1 py-0.2 rounded">
                DEMO
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <CoinPulseCoin size={18} />
              <span className="text-sm font-bold font-mono text-[#F1F5FB] tabular-nums">
                {formatCoins(wallet.balanceCoins)}
              </span>
            </div>
          </div>
        )}

        {/* Bottom account / collapse footer */}
        <div className="p-3 border-t border-[#1A2637] flex items-center justify-between">
          {(!collapsed || mobileOpen) ? (
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#1A273A] border border-[#28D7E5]/30 overflow-hidden shrink-0 flex items-center justify-center text-xs text-[#28D7E5]">
                {currentUser?.avatar ? (
                  <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[#F1F5FB] truncate">
                  {currentUser?.displayName || 'Demo Trader'}
                </p>
                <p className="text-[10px] text-[#6E7D92] font-mono truncate">
                  {currentUser?.role === 'admin' ? 'Super Admin' : 'Free Demo'}
                </p>
              </div>
            </div>
          ) : (
            <div className="mx-auto">
              <div className="w-7 h-7 rounded-full bg-[#1A273A] border border-[#28D7E5]/30 overflow-hidden flex items-center justify-center text-xs text-[#28D7E5]">
                {currentUser?.avatar ? (
                  <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-3.5 h-3.5" />
                )}
              </div>
            </div>
          )}

          {/* Desktop collapse toggle button */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 text-[#8190A5] hover:text-[#F1F5FB] hover:bg-[#141F30] rounded-lg transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>
    </>
  );
};
