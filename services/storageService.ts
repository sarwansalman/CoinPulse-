import {
  User,
  DemoWallet,
  WalletLedgerEntry,
  Asset,
  Prediction,
  AuditLog,
  PlatformSettings,
} from '../types';

const INITIAL_ASSETS: Asset[] = [
  {
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
  },
  {
    id: 'eth-usdt',
    symbol: 'ETH/USDT',
    displayName: 'Ethereum',
    price: 3450.25,
    change24h: -1.15,
    high24h: 3540.0,
    low24h: 3390.0,
    volume24h: '840M USDT',
    sparkline: [3510, 3490, 3530, 3480, 3420, 3440, 3450.25],
    dataSourceType: 'simulated',
    isEnabled: true,
  },
  {
    id: 'sol-usdt',
    symbol: 'SOL/USDT',
    displayName: 'Solana',
    price: 184.8,
    change24h: 5.62,
    high24h: 188.5,
    low24h: 173.2,
    volume24h: '412M USDT',
    sparkline: [173.5, 175.2, 178.0, 181.4, 179.8, 183.1, 184.8],
    dataSourceType: 'simulated',
    isEnabled: true,
  },
  {
    id: 'xrp-usdt',
    symbol: 'XRP/USDT',
    displayName: 'Ripple',
    price: 0.628,
    change24h: 1.25,
    high24h: 0.645,
    low24h: 0.612,
    volume24h: '185M USDT',
    sparkline: [0.615, 0.618, 0.624, 0.62, 0.625, 0.63, 0.628],
    dataSourceType: 'simulated',
    isEnabled: true,
  },
  {
    id: 'avax-usdt',
    symbol: 'AVAX/USDT',
    displayName: 'Avalanche',
    price: 34.65,
    change24h: -2.4,
    high24h: 36.1,
    low24h: 33.9,
    volume24h: '94M USDT',
    sparkline: [35.8, 35.4, 35.9, 34.8, 34.2, 34.9, 34.65],
    dataSourceType: 'simulated',
    isEnabled: true,
  },
];

const DEFAULT_SETTINGS: PlatformSettings = {
  defaultPayoutRate: 0.85, // 85% return (1.85x)
  volatilityMultiplier: 1.0,
  minStakeCoins: 100,
  maxStakeCoins: 100000,
  soundEnabled: true,
  theme: 'dark',
  defaultDurationSeconds: 30,
};

const DEFAULT_USER: User = {
  id: 'usr_demo_01',
  displayName: 'Alex Vance',
  email: 'alex@coinpulse.demo',
  role: 'user',
  createdAt: '2026-10-01T12:00:00.000Z',
  accountStatus: 'active',
  avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Alex',
};

const ADMIN_USER: User = {
  id: 'usr_admin_01',
  displayName: 'System Admin',
  email: 'admin@coinpulse.demo',
  role: 'admin',
  createdAt: '2026-09-01T08:00:00.000Z',
  accountStatus: 'active',
  avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Admin',
};

// Storage helper functions
export const StorageKeys = {
  USERS: 'cp_users_v1',
  CURRENT_USER: 'cp_current_user_v1',
  WALLETS: 'cp_wallets_v1',
  LEDGER: 'cp_ledger_v1',
  PREDICTIONS: 'cp_predictions_v1',
  ASSETS: 'cp_assets_v1',
  SETTINGS: 'cp_settings_v1',
  AUDIT_LOGS: 'cp_audit_logs_v1',
};

export class StorageService {
  private static getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private static setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage quota or serialization error', e);
    }
  }

  public static initialize(): void {
    // Initialize users
    const users = this.getItem<User[]>(StorageKeys.USERS, []);
    if (users.length === 0) {
      this.setItem(StorageKeys.USERS, [DEFAULT_USER, ADMIN_USER]);
    }

    // Initialize current user
    const currentUser = this.getItem<User | null>(StorageKeys.CURRENT_USER, null);
    if (!currentUser) {
      this.setItem(StorageKeys.CURRENT_USER, DEFAULT_USER);
    }

    // Initialize wallets
    const wallets = this.getItem<Record<string, DemoWallet>>(StorageKeys.WALLETS, {});
    let modified = false;

    if (!wallets[DEFAULT_USER.id]) {
      wallets[DEFAULT_USER.id] = {
        userId: DEFAULT_USER.id,
        balanceCoins: 200000,
        welcomeBonusGranted: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      modified = true;
    }
    if (!wallets[ADMIN_USER.id]) {
      wallets[ADMIN_USER.id] = {
        userId: ADMIN_USER.id,
        balanceCoins: 500000,
        welcomeBonusGranted: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      modified = true;
    }
    if (modified) {
      this.setItem(StorageKeys.WALLETS, wallets);
    }

    // Initialize ledger if empty
    const ledger = this.getItem<WalletLedgerEntry[]>(StorageKeys.LEDGER, []);
    if (ledger.length === 0) {
      const initialLedger: WalletLedgerEntry[] = [
        {
          id: 'wb_demo_01',
          userId: DEFAULT_USER.id,
          type: 'welcome_bonus',
          amountCoins: 200000,
          balanceAfterCoins: 200000,
          referenceId: 'BONUS-INIT-2026',
          description: 'Welcome Bonus: $1,000 USD demo equivalent (200,000 virtual coins)',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
      ];
      this.setItem(StorageKeys.LEDGER, initialLedger);
    }

    // Initialize assets
    const assets = this.getItem<Asset[]>(StorageKeys.ASSETS, []);
    if (assets.length === 0) {
      this.setItem(StorageKeys.ASSETS, INITIAL_ASSETS);
    }

    // Initialize settings
    const settings = this.getItem<PlatformSettings | null>(StorageKeys.SETTINGS, null);
    if (!settings) {
      this.setItem(StorageKeys.SETTINGS, DEFAULT_SETTINGS);
    }

    // Initialize audit logs
    const logs = this.getItem<AuditLog[]>(StorageKeys.AUDIT_LOGS, []);
    if (logs.length === 0) {
      this.logAudit(
        ADMIN_USER.id,
        ADMIN_USER.email,
        'SYSTEM_INITIALIZED',
        'SYSTEM',
        'SYSTEM_01',
        'CoinPulse Demo trading engine initialized with deterministic simulated feeds'
      );
    }
  }

  // Users & Auth
  public static getCurrentUser(): User | null {
    return this.getItem<User | null>(StorageKeys.CURRENT_USER, DEFAULT_USER);
  }

  public static setCurrentUser(user: User | null): void {
    this.setItem(StorageKeys.CURRENT_USER, user);
  }

  public static getUsers(): User[] {
    return this.getItem<User[]>(StorageKeys.USERS, []);
  }

  public static getUserById(userId: string): User | undefined {
    return this.getUsers().find((u) => u.id === userId);
  }

  public static getUserByEmail(email: string): User | undefined {
    return this.getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public static updateUser(user: User): void {
    const users = this.getUsers().map((u) => (u.id === user.id ? user : u));
    this.setItem(StorageKeys.USERS, users);
    const currentUser = this.getCurrentUser();
    if (currentUser?.id === user.id) {
      this.setCurrentUser(user);
    }
  }

  public static registerUser(
    displayName: string,
    email: string
  ): { user: User; welcomeBonusGranted: boolean } {
    const existing = this.getUserByEmail(email);
    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const newUser: User = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      displayName,
      email,
      role: 'user',
      createdAt: new Date().toISOString(),
      accountStatus: 'active',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(displayName)}`,
    };

    const users = [...this.getUsers(), newUser];
    this.setItem(StorageKeys.USERS, users);

    // Create wallet & award one-time welcome bonus (200,000 virtual coins = $1,000 demo equivalent)
    const wallets = this.getItem<Record<string, DemoWallet>>(StorageKeys.WALLETS, {});
    wallets[newUser.id] = {
      userId: newUser.id,
      balanceCoins: 200000,
      welcomeBonusGranted: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.setItem(StorageKeys.WALLETS, wallets);

    // Record bonus in ledger
    const bonusEntry: WalletLedgerEntry = {
      id: `wb_${Date.now()}`,
      userId: newUser.id,
      type: 'welcome_bonus',
      amountCoins: 200000,
      balanceAfterCoins: 200000,
      referenceId: `WB-SIGNUP-${Date.now().toString(36).toUpperCase()}`,
      description: 'Welcome Bonus: $1,000 USD demo equivalent (200,000 virtual coins)',
      createdAt: new Date().toISOString(),
    };
    this.addLedgerEntry(bonusEntry);

    this.logAudit(
      newUser.id,
      newUser.email,
      'USER_SIGNUP',
      'USER',
      newUser.id,
      'New user registered and received 200,000 demo welcome bonus'
    );

    this.setCurrentUser(newUser);
    return { user: newUser, welcomeBonusGranted: true };
  }

  // Wallet & Ledger
  public static getWallet(userId: string): DemoWallet {
    const wallets = this.getItem<Record<string, DemoWallet>>(StorageKeys.WALLETS, {});
    if (!wallets[userId]) {
      wallets[userId] = {
        userId,
        balanceCoins: 200000,
        welcomeBonusGranted: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.setItem(StorageKeys.WALLETS, wallets);
    }
    return wallets[userId];
  }

  public static updateWalletBalance(
    userId: string,
    amountDelta: number,
    type: WalletLedgerEntry['type'],
    referenceId: string,
    description: string
  ): DemoWallet {
    const wallets = this.getItem<Record<string, DemoWallet>>(StorageKeys.WALLETS, {});
    const currentWallet = this.getWallet(userId);

    const newBalance = Math.max(0, currentWallet.balanceCoins + amountDelta);
    wallets[userId] = {
      ...currentWallet,
      balanceCoins: newBalance,
      updatedAt: new Date().toISOString(),
    };
    this.setItem(StorageKeys.WALLETS, wallets);

    const ledgerEntry: WalletLedgerEntry = {
      id: `led_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      type,
      amountCoins: amountDelta,
      balanceAfterCoins: newBalance,
      referenceId,
      description,
      createdAt: new Date().toISOString(),
    };
    this.addLedgerEntry(ledgerEntry);

    return wallets[userId];
  }

  public static resetDemoBalance(userId: string): DemoWallet {
    const current = this.getWallet(userId);
    const delta = 200000 - current.balanceCoins;
    return this.updateWalletBalance(
      userId,
      delta,
      'demo_reset',
      `RESET-${Date.now().toString(36).toUpperCase()}`,
      'Demo Wallet balance replenished to 200,000 virtual coins'
    );
  }

  public static getLedger(userId?: string): WalletLedgerEntry[] {
    const entries = this.getItem<WalletLedgerEntry[]>(StorageKeys.LEDGER, []);
    if (!userId) return entries;
    return entries.filter((e) => e.userId === userId);
  }

  private static addLedgerEntry(entry: WalletLedgerEntry): void {
    const entries = this.getItem<WalletLedgerEntry[]>(StorageKeys.LEDGER, []);
    this.setItem(StorageKeys.LEDGER, [entry, ...entries]);
  }

  // Assets
  public static getAssets(): Asset[] {
    return this.getItem<Asset[]>(StorageKeys.ASSETS, INITIAL_ASSETS);
  }

  public static updateAssetPrice(assetId: string, newPrice: number): Asset[] {
    const assets = this.getAssets().map((a) => {
      if (a.id === assetId) {
        const change = ((newPrice - a.price) / a.price) * 100;
        const newSparkline = [...a.sparkline.slice(1), newPrice];
        return {
          ...a,
          price: Number(newPrice.toFixed(a.price < 1 ? 4 : 2)),
          change24h: Number((a.change24h + change * 0.1).toFixed(2)),
          high24h: Math.max(a.high24h, newPrice),
          low24h: Math.min(a.low24h, newPrice),
          sparkline: newSparkline,
        };
      }
      return a;
    });
    this.setItem(StorageKeys.ASSETS, assets);
    return assets;
  }

  // Predictions
  public static getPredictions(userId?: string): Prediction[] {
    const all = this.getItem<Prediction[]>(StorageKeys.PREDICTIONS, []);
    if (!userId) return all;
    return all.filter((p) => p.userId === userId);
  }

  public static savePrediction(prediction: Prediction): void {
    const all = this.getItem<Prediction[]>(StorageKeys.PREDICTIONS, []);
    const exists = all.findIndex((p) => p.id === prediction.id);
    if (exists >= 0) {
      all[exists] = prediction;
    } else {
      all.unshift(prediction);
    }
    this.setItem(StorageKeys.PREDICTIONS, all);
  }

  // Settings
  public static getSettings(): PlatformSettings {
    return this.getItem<PlatformSettings>(StorageKeys.SETTINGS, DEFAULT_SETTINGS);
  }

  public static updateSettings(settings: PlatformSettings): void {
    this.setItem(StorageKeys.SETTINGS, settings);
  }

  // Audit Logs
  public static getAuditLogs(): AuditLog[] {
    return this.getItem<AuditLog[]>(StorageKeys.AUDIT_LOGS, []);
  }

  public static logAudit(
    actorId: string,
    actorEmail: string,
    action: string,
    targetType: string,
    targetId: string,
    details: string
  ): void {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      actorId,
      actorEmail,
      action,
      targetType,
      targetId,
      details,
      createdAt: new Date().toISOString(),
    };
    this.setItem(StorageKeys.AUDIT_LOGS, [newLog, ...logs.slice(0, 199)]);
  }
}
