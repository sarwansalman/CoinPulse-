import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, DemoWallet, Asset, Prediction, PredictionDirection } from '../types';
import { StorageService } from '../services/storageService';
import { TradingEngine } from '../services/tradingEngine';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

interface AppContextType {
  currentUser: User | null;
  wallet: DemoWallet | null;
  assets: Asset[];
  selectedAsset: Asset;
  userPredictions: Prediction[];
  toasts: ToastMessage[];
  welcomeBonusModalOpen: boolean;
  setWelcomeBonusModalOpen: (open: boolean) => void;
  setSelectedAsset: (asset: Asset) => void;
  loginUser: (email: string) => Promise<boolean>;
  signupUser: (displayName: string, email: string) => Promise<boolean>;
  logoutUser: () => void;
  placeTrade: (direction: PredictionDirection, stake: number, duration: number) => Promise<Prediction>;
  resetBalance: () => void;
  dismissToast: (id: string) => void;
  addToast: (type: ToastMessage['type'], title: string, message: string) => void;
  refreshData: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    StorageService.initialize();
    return StorageService.getCurrentUser();
  });
  const [wallet, setWallet] = useState<DemoWallet | null>(() => {
    const user = StorageService.getCurrentUser();
    return user ? StorageService.getWallet(user.id) : null;
  });
  const [assets, setAssets] = useState<Asset[]>(() => StorageService.getAssets());
  const [selectedAsset, setSelectedAsset] = useState<Asset>(() => {
    const initialAssets = StorageService.getAssets();
    return initialAssets[0] || {
      id: 'btc-usdt',
      symbol: 'BTC/USDT',
      displayName: 'Bitcoin',
      price: 68420.5,
      change24h: 2.84,
      high24h: 69200.0,
      low24h: 67100.0,
      volume24h: '1.42B USDT',
      sparkline: [67100, 67450, 67200, 67900, 68150, 67800, 68420.5],
      dataSourceType: 'simulated',
      isEnabled: true,
    };
  });
  const [userPredictions, setUserPredictions] = useState<Prediction[]>(() => {
    const user = StorageService.getCurrentUser();
    return user ? StorageService.getPredictions(user.id) : [];
  });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [welcomeBonusModalOpen, setWelcomeBonusModalOpen] = useState(false);

  const addToast = useCallback((type: ToastMessage['type'], title: string, message: string) => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const refreshData = useCallback(() => {
    const user = StorageService.getCurrentUser();
    setCurrentUser(user);
    if (user) {
      const w = StorageService.getWallet(user.id);
      setWallet(w);
      setUserPredictions(StorageService.getPredictions(user.id));
    } else {
      setWallet(null);
      setUserPredictions([]);
    }
    const currentAssets = StorageService.getAssets();
    setAssets(currentAssets);
  }, []);

  // Initialize service on mount
  useEffect(() => {
    StorageService.initialize();
    refreshData();
    TradingEngine.start();

    // Subscribe to asset ticks
    const unsubAssets = TradingEngine.subscribeAssets((updatedAssets) => {
      setAssets(updatedAssets);
      setSelectedAsset((prev) => {
        const found = updatedAssets.find((a) => a.id === prev.id);
        return found || prev;
      });
    });

    // Subscribe to settlements
    const unsubSettlements = TradingEngine.subscribeSettlements((settled) => {
      refreshData();
      if (settled.status === 'won') {
        addToast(
          'success',
          'Prediction Won! 🎉',
          `+${settled.payoutCoins.toLocaleString()} coins won on ${settled.assetSymbol}`
        );
      } else if (settled.status === 'tie') {
        addToast(
          'info',
          'Prediction Tie / Refunded',
          `Closing price matched entry price. ${settled.stakeCoins.toLocaleString()} coins returned.`
        );
      } else {
        addToast(
          'error',
          'Prediction Closed',
          `${settled.assetSymbol} trade closed out of the money.`
        );
      }
    });

    return () => {
      unsubAssets();
      unsubSettlements();
      TradingEngine.stop();
    };
  }, [refreshData, addToast]);

  const loginUser = async (email: string): Promise<boolean> => {
    const existing = StorageService.getUserByEmail(email);
    if (existing) {
      StorageService.setCurrentUser(existing);
      refreshData();
      addToast('success', 'Welcome Back', `Logged in as ${existing.displayName}`);
      return true;
    }
    addToast('error', 'Login Failed', 'Account not found. Please check your email or sign up.');
    return false;
  };

  const signupUser = async (displayName: string, email: string): Promise<boolean> => {
    try {
      const { user, welcomeBonusGranted } = StorageService.registerUser(displayName, email);
      refreshData();
      if (welcomeBonusGranted) {
        setWelcomeBonusModalOpen(true);
      }
      addToast('success', 'Account Created', `Welcome to CoinPulse, ${user.displayName}!`);
      return true;
    } catch (e: unknown) {
      const err = e as Error;
      addToast('error', 'Signup Error', err.message || 'Unable to register account.');
      return false;
    }
  };

  const logoutUser = () => {
    StorageService.setCurrentUser(null);
    refreshData();
    addToast('info', 'Logged Out', 'You have been safely signed out.');
  };

  const placeTrade = async (
    direction: PredictionDirection,
    stake: number,
    duration: number
  ): Promise<Prediction> => {
    if (!currentUser) {
      addToast('warning', 'Sign In Required', 'Please sign in to place demo predictions.');
      throw new Error('Sign in required');
    }

    try {
      const pred = TradingEngine.placePrediction(
        currentUser.id,
        selectedAsset.id,
        direction,
        stake,
        duration
      );
      refreshData();
      addToast(
        'info',
        'Prediction Placed',
        `${direction} on ${selectedAsset.symbol} for ${stake.toLocaleString()} coins (${duration}s)`
      );
      return pred;
    } catch (e: unknown) {
      const err = e as Error;
      addToast('error', 'Trade Error', err.message || 'Unable to place prediction.');
      throw e;
    }
  };

  const resetBalance = () => {
    if (!currentUser) return;
    StorageService.resetDemoBalance(currentUser.id);
    refreshData();
    addToast('success', 'Balance Replenished', 'Demo balance reset to 200,000 virtual coins ($1,000 demo equivalent).');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        wallet,
        assets,
        selectedAsset,
        userPredictions,
        toasts,
        welcomeBonusModalOpen,
        setWelcomeBonusModalOpen,
        setSelectedAsset,
        loginUser,
        signupUser,
        logoutUser,
        placeTrade,
        resetBalance,
        dismissToast,
        addToast,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
};
