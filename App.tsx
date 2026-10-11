import React, { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import { AppShell } from './components/layout/AppShell';
import { ToastContainer } from './components/ui/ToastContainer';
import { WelcomeBonusModal } from './components/brand/WelcomeBonusModal';

// Pages
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { TradePage } from './pages/trading/TradePage';
import { MarketsPage } from './pages/trading/MarketsPage';
import { TradeHistoryPage } from './pages/trading/TradeHistoryPage';
import { WalletPage } from './pages/wallet/WalletPage';
import { TransactionsPage } from './pages/wallet/TransactionsPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { SettingsPage } from './pages/profile/SettingsPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { HelpCenterPage } from './pages/help/HelpCenterPage';
import { FinanceNotFoundPage } from './pages/finance/FinanceNotFoundPage';

export function App() {
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      return path && path !== '' ? path : '/';
    }
    return '/';
  });

  // Handle popstate for back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (route: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', route);
    }
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    // Public non-shell pages
    if (currentRoute === '/') {
      return (
        <>
          <LandingPage onNavigate={navigate} />
          <ToastContainer />
          <WelcomeBonusModal onStartTrading={() => navigate('/trade')} />
        </>
      );
    }

    if (currentRoute === '/login') {
      return (
        <>
          <LoginPage onNavigate={navigate} />
          <ToastContainer />
        </>
      );
    }

    if (currentRoute === '/signup') {
      return (
        <>
          <SignupPage onNavigate={navigate} />
          <ToastContainer />
          <WelcomeBonusModal onStartTrading={() => navigate('/trade')} />
        </>
      );
    }

    // App routes wrapped inside AppShell
    let pageComponent = null;

    if (currentRoute === '/dashboard') {
      pageComponent = <DashboardPage onNavigate={navigate} />;
    } else if (currentRoute === '/trade') {
      pageComponent = <TradePage onNavigate={navigate} />;
    } else if (currentRoute === '/markets') {
      pageComponent = <MarketsPage onNavigate={navigate} />;
    } else if (currentRoute === '/history') {
      pageComponent = <TradeHistoryPage onNavigate={navigate} />;
    } else if (currentRoute === '/wallet') {
      pageComponent = <WalletPage onNavigate={navigate} />;
    } else if (currentRoute === '/transactions') {
      pageComponent = <TransactionsPage onNavigate={navigate} />;
    } else if (currentRoute === '/profile') {
      pageComponent = <ProfilePage />;
    } else if (currentRoute === '/settings') {
      pageComponent = <SettingsPage />;
    } else if (currentRoute === '/admin') {
      pageComponent = <AdminDashboardPage onNavigate={navigate} />;
    } else if (currentRoute === '/help') {
      pageComponent = <HelpCenterPage onNavigate={navigate} />;
    } else if (
      currentRoute.startsWith('/finance') ||
      currentRoute === '/finance/deposit' ||
      currentRoute === '/finance/withdrawal'
    ) {
      pageComponent = (
        <FinanceNotFoundPage
          sectionTitle={
            currentRoute.includes('deposit')
              ? 'Demo Deposit Gateway'
              : currentRoute.includes('withdrawal')
              ? 'Demo Withdrawal Gateway'
              : 'Finance Gateway'
          }
          onNavigate={navigate}
        />
      );
    } else {
      // General 404
      pageComponent = <FinanceNotFoundPage onNavigate={navigate} />;
    }

    return (
      <AppShell currentRoute={currentRoute} onNavigate={navigate}>
        {pageComponent}
      </AppShell>
    );
  };

  return <AppProvider>{renderContent()}</AppProvider>;
}

export default App;
