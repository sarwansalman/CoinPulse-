import { Asset, Prediction, PredictionDirection } from '../types';
import { StorageService } from './storageService';

type AssetListener = (assets: Asset[]) => void;
type SettlementListener = (prediction: Prediction) => void;

class SoundFx {
  private static ctx: AudioContext | null = null;

  private static getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public static play(type: 'click' | 'place' | 'win' | 'lose') {
    const settings = StorageService.getSettings();
    if (!settings.soundEnabled) return;

    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'place') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'win') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
        osc.frequency.setValueAtTime(1046.5, now + 0.24); // C6
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === 'lose') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.25);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch {
      // Audio might be blocked by browser policy until user interaction
    }
  }
}

export class TradingEngine {
  private static assetListeners: Set<AssetListener> = new Set();
  private static settlementListeners: Set<SettlementListener> = new Set();
  private static tickerTimer: ReturnType<typeof setInterval> | null = null;
  private static settlementTimer: ReturnType<typeof setInterval> | null = null;

  public static start(): void {
    if (this.tickerTimer) return;

    // Tick assets every 900ms
    this.tickerTimer = setInterval(() => {
      this.tickPrices();
    }, 900);

    // Check active predictions expiry every 500ms
    this.settlementTimer = setInterval(() => {
      this.checkSettlements();
    }, 500);
  }

  public static stop(): void {
    if (this.tickerTimer) clearInterval(this.tickerTimer);
    if (this.settlementTimer) clearInterval(this.settlementTimer);
    this.tickerTimer = null;
    this.settlementTimer = null;
  }

  public static subscribeAssets(listener: AssetListener): () => void {
    this.assetListeners.add(listener);
    listener(StorageService.getAssets());
    return () => {
      this.assetListeners.delete(listener);
    };
  }

  public static subscribeSettlements(listener: SettlementListener): () => void {
    this.settlementListeners.add(listener);
    return () => {
      this.settlementListeners.delete(listener);
    };
  }

  private static tickPrices(): void {
    const assets = StorageService.getAssets();
    const settings = StorageService.getSettings();
    const vol = settings.volatilityMultiplier || 1.0;

    const updated = assets.map((asset) => {
      // Gaussian-like randomized micro-drift
      const rand1 = Math.random();
      const rand2 = Math.random();
      const z = Math.sqrt(-2.0 * Math.log(rand1 || 0.0001)) * Math.cos(2.0 * Math.PI * rand2);
      
      // Relative volatility based on asset price magnitude
      const relVol = asset.price > 1000 ? 0.0004 : asset.price > 50 ? 0.0009 : 0.002;
      const pctDelta = z * relVol * vol;
      const newPrice = asset.price * (1 + pctDelta);

      const roundedPrice = Number(newPrice.toFixed(asset.price < 1 ? 4 : 2));
      const priceDiff = roundedPrice - asset.price;
      const changeAddition = (priceDiff / asset.price) * 10;
      const newSparkline = [...asset.sparkline.slice(1), roundedPrice];

      return {
        ...asset,
        price: roundedPrice,
        change24h: Number((asset.change24h + changeAddition).toFixed(2)),
        high24h: Math.max(asset.high24h, roundedPrice),
        low24h: Math.min(asset.low24h, roundedPrice),
        sparkline: newSparkline,
      };
    });

    localStorage.setItem('cp_assets_v1', JSON.stringify(updated));
    this.assetListeners.forEach((l) => l(updated));
  }

  public static placePrediction(
    userId: string,
    assetId: string,
    direction: PredictionDirection,
    stakeCoins: number,
    durationSeconds: number
  ): Prediction {
    const user = StorageService.getUserById(userId);
    if (!user) throw new Error('User not found.');

    const wallet = StorageService.getWallet(userId);
    if (wallet.balanceCoins < stakeCoins) {
      throw new Error(`Insufficient demo coins. Available: ${wallet.balanceCoins.toLocaleString()} coins.`);
    }

    const settings = StorageService.getSettings();
    if (stakeCoins < settings.minStakeCoins) {
      throw new Error(`Minimum stake is ${settings.minStakeCoins.toLocaleString()} demo coins.`);
    }
    if (stakeCoins > settings.maxStakeCoins) {
      throw new Error(`Maximum stake is ${settings.maxStakeCoins.toLocaleString()} demo coins.`);
    }

    const assets = StorageService.getAssets();
    const asset = assets.find((a) => a.id === assetId);
    if (!asset) throw new Error('Selected asset is not available.');

    const now = Date.now();
    const payoutMultiplier = Number((1 + settings.defaultPayoutRate).toFixed(2)); // e.g. 1.85
    const potentialPayout = Math.floor(stakeCoins * payoutMultiplier);

    const predictionId = `pred_${now}_${Math.random().toString(36).substring(2, 6)}`;
    const newPrediction: Prediction = {
      id: predictionId,
      userId,
      assetId: asset.id,
      assetSymbol: asset.symbol,
      direction,
      stakeCoins,
      openingPrice: asset.price,
      closingPrice: null,
      currentPrice: asset.price,
      startTime: now,
      expiryTime: now + durationSeconds * 1000,
      durationSeconds,
      status: 'active',
      payoutMultiplier,
      payoutCoins: potentialPayout,
      createdAt: new Date().toISOString(),
      settledAt: null,
    };

    // Atomically debit stake from demo wallet
    StorageService.updateWalletBalance(
      userId,
      -stakeCoins,
      'prediction_stake',
      predictionId,
      `Demo Prediction Stake: ${direction} on ${asset.symbol}`
    );

    StorageService.savePrediction(newPrediction);

    StorageService.logAudit(
      userId,
      user.email,
      'PREDICTION_PLACED',
      'PREDICTION',
      predictionId,
      `Placed ${direction} on ${asset.symbol} for ${stakeCoins} demo coins (${durationSeconds}s)`
    );

    SoundFx.play('place');
    return newPrediction;
  }

  private static checkSettlements(): void {
    const allPredictions = StorageService.getPredictions();
    const active = allPredictions.filter((p) => p.status === 'active');
    if (active.length === 0) return;

    const now = Date.now();
    const assets = StorageService.getAssets();
    const assetMap = new Map(assets.map((a) => [a.id, a]));

    for (const pred of active) {
      if (now >= pred.expiryTime) {
        this.settlePrediction(pred, assetMap.get(pred.assetId));
      }
    }
  }

  private static settlePrediction(prediction: Prediction, asset?: Asset): void {
    const closingPrice = asset ? asset.price : prediction.openingPrice;
    const isUp = prediction.direction === 'UP';
    let result: 'won' | 'lost' | 'tie' = 'lost';

    if (closingPrice === prediction.openingPrice) {
      result = 'tie';
    } else if (isUp && closingPrice > prediction.openingPrice) {
      result = 'won';
    } else if (!isUp && closingPrice < prediction.openingPrice) {
      result = 'won';
    } else {
      result = 'lost';
    }

    const settledPrediction: Prediction = {
      ...prediction,
      closingPrice,
      status: result,
      settledAt: new Date().toISOString(),
    };

    if (result === 'won') {
      StorageService.updateWalletBalance(
        prediction.userId,
        prediction.payoutCoins,
        'prediction_win',
        prediction.id,
        `Demo Prediction WON: +${prediction.payoutCoins.toLocaleString()} coins on ${prediction.assetSymbol}`
      );
      SoundFx.play('win');
    } else if (result === 'tie') {
      // Refund stake
      StorageService.updateWalletBalance(
        prediction.userId,
        prediction.stakeCoins,
        'prediction_refund',
        prediction.id,
        `Demo Prediction TIE (Refund): ${prediction.assetSymbol}`
      );
      SoundFx.play('click');
    } else {
      SoundFx.play('lose');
    }

    StorageService.savePrediction(settledPrediction);

    const user = StorageService.getUserById(prediction.userId);
    StorageService.logAudit(
      prediction.userId,
      user?.email || 'user',
      'PREDICTION_SETTLED',
      'PREDICTION',
      prediction.id,
      `Settled ${result.toUpperCase()} with open: ${prediction.openingPrice}, close: ${closingPrice}`
    );

    // Notify listeners
    this.settlementListeners.forEach((l) => l(settledPrediction));
  }

  public static playClick(): void {
    SoundFx.play('click');
  }
}
