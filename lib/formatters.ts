export const formatCoins = (coins: number): string => {
  return Math.round(coins).toLocaleString('en-US');
};

export const coinsToUSD = (coins: number): string => {
  const usd = coins / 200;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(usd);
};

export const formatPrice = (price: number): string => {
  if (price < 1) {
    return `$${price.toFixed(4)}`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

export const formatPercentage = (pct: number): string => {
  const sign = pct > 0 ? '+' : '';
  return `${sign}${pct.toFixed(2)}%`;
};

export const formatDate = (isoString: string): string => {
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(d);
  } catch {
    return isoString;
  }
};

export const formatTimeAgo = (timestampMs: number): string => {
  const diffSec = Math.floor((Date.now() - timestampMs) / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  return `${diffHours}h ago`;
};
