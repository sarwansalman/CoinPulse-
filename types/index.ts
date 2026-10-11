export type UserRole = 'user' | 'admin';
export type AccountStatus = 'active' | 'suspended';

export interface User {
  id: string;
  displayName: string;
  email: string;
  role: UserRole;
  createdAt: string;
  accountStatus: AccountStatus;
  avatar?: string;
}

export interface DemoWallet {
  userId: string;
  balanceCoins: number;
  welcomeBonusGranted: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TransactionType =
  | 'welcome_bonus'
  | 'prediction_stake'
  | 'prediction_win'
  | 'prediction_refund'
  | 'admin_adjustment'
  | 'demo_reset';

export interface WalletLedgerEntry {
  id: string;
  userId: string;
  type: TransactionType;
  amountCoins: number;
  balanceAfterCoins: number;
  referenceId: string;
  description: string;
  createdAt: string;
}

export interface Asset {
  id: string;
  symbol: string;
  displayName: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: string;
  sparkline: number[];
  dataSourceType: 'simulated';
  isEnabled: boolean;
}

export type PredictionDirection = 'UP' | 'DOWN';
export type PredictionStatus = 'active' | 'won' | 'lost' | 'tie';

export interface Prediction {
  id: string;
  userId: string;
  assetId: string;
  assetSymbol: string;
  direction: PredictionDirection;
  stakeCoins: number;
  openingPrice: number;
  closingPrice: number | null;
  currentPrice?: number;
  startTime: number;
  expiryTime: number;
  durationSeconds: number;
  status: PredictionStatus;
  payoutMultiplier: number;
  payoutCoins: number;
  createdAt: string;
  settledAt: string | null;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorEmail: string;
  action: string;
  targetType: string;
  targetId: string;
  details: string;
  createdAt: string;
}

export interface PlatformSettings {
  defaultPayoutRate: number; // e.g. 0.85 (85% net gain = 1.85x return)
  volatilityMultiplier: number;
  minStakeCoins: number;
  maxStakeCoins: number;
  soundEnabled: boolean;
  theme: 'dark';
  defaultDurationSeconds: number;
}
