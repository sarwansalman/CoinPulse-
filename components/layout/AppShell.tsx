import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ToastContainer } from '../ui/ToastContainer';
import { WelcomeBonusModal } from '../brand/WelcomeBonusModal';

interface AppShellProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentRoute,
  onNavigate,
  children,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#080D16] text-[#F1F5FB] flex flex-col antialiased">
      {/* Sidebar */}
      <Sidebar
        currentRoute={currentRoute}
        onNavigate={onNavigate}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Content Area offset by Sidebar width */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          collapsed ? 'lg:pl-[76px]' : 'lg:pl-[236px]'
        }`}
      >
        {/* Top Header */}
        <Header
          currentRoute={currentRoute}
          onNavigate={onNavigate}
          onOpenMobileMenu={() => setMobileOpen(true)}
        />

        {/* Viewport content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Global Modals and Toasts */}
      <ToastContainer />
      <WelcomeBonusModal onStartTrading={() => onNavigate('/trade')} />
    </div>
  );
};
