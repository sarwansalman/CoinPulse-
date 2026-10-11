import React, { useRef, useEffect, useState } from 'react';
import { Asset, Prediction } from '../../types';
import { formatPrice } from '../../lib/formatters';
import { Activity, BarChart2, TrendingUp } from 'lucide-react';

interface PriceChartProps {
  asset: Asset;
  activePredictions?: Prediction[];
}

interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export const PriceChart: React.FC<PriceChartProps> = ({ asset, activePredictions = [] }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [chartType, setChartType] = useState<'line' | 'candles'>('candles');
  const [timeframe, setTimeframe] = useState<'1m' | '5m' | '15m'>('1m');
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  // Store continuous series for the active asset
  const historyRef = useRef<Candle[]>([]);

  // Initialize or update candle history when asset or price changes
  useEffect(() => {
    if (historyRef.current.length === 0) {
      // Seed initial 45 candles around asset price
      const now = Date.now();
      const candles: Candle[] = [];
      let base = asset.price;
      const step = 60 * 1000;

      for (let i = 45; i >= 0; i--) {
        const delta = (Math.random() - 0.49) * (base * 0.0015);
        const open = base;
        const close = base + delta;
        const high = Math.max(open, close) + Math.random() * (base * 0.0008);
        const low = Math.min(open, close) - Math.random() * (base * 0.0008);
        candles.push({
          time: now - i * step,
          open,
          high,
          low,
          close,
        });
        base = close;
      }
      historyRef.current = candles;
    } else {
      // Append or update current candle with new tick price
      const current = historyRef.current[historyRef.current.length - 1];
      if (current) {
        current.close = asset.price;
        current.high = Math.max(current.high, asset.price);
        current.low = Math.min(current.low, asset.price);

        // Advance to new candle every 15 ticks or so to keep it flowing
        if (Math.random() < 0.15 && historyRef.current.length > 0) {
          const newCandle: Candle = {
            time: Date.now(),
            open: asset.price,
            high: asset.price,
            low: asset.price,
            close: asset.price,
          };
          historyRef.current.push(newCandle);
          if (historyRef.current.length > 60) {
            historyRef.current.shift();
          }
        }
      }
    }
  }, [asset.price]);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Background
    ctx.fillStyle = '#101927';
    ctx.fillRect(0, 0, width, height);

    const candles = historyRef.current;
    if (candles.length === 0) return;

    // Determine min and max prices
    let minPrice = Infinity;
    let maxPrice = -Infinity;

    candles.forEach((c) => {
      if (c.low < minPrice) minPrice = c.low;
      if (c.high > maxPrice) maxPrice = c.high;
    });

    // Also include active predictions entry prices so they are visible
    activePredictions.forEach((p) => {
      if (p.openingPrice < minPrice) minPrice = p.openingPrice;
      if (p.openingPrice > maxPrice) maxPrice = p.openingPrice;
    });

    // Add padding to range
    const padding = (maxPrice - minPrice) * 0.12 || 1;
    minPrice -= padding;
    maxPrice += padding;
    const priceRange = maxPrice - minPrice;

    const getY = (price: number) => {
      return height - 30 - ((price - minPrice) / priceRange) * (height - 60);
    };

    // Draw Subtle Grid Lines
    ctx.strokeStyle = '#1A2637';
    ctx.lineWidth = 1;

    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = 30 + (i * (height - 60)) / gridLines;
      const priceAtY = maxPrice - (i / gridLines) * priceRange;

      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width - 70, y);
      ctx.stroke();

      // Right axis price labels
      ctx.fillStyle = '#6E7D92';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'right';
      ctx.fillText(formatPrice(priceAtY), width - 8, y + 3);
    }

    // Draw Candle or Line Chart
    const rightMargin = 75;
    const availableWidth = width - rightMargin;
    const candleWidth = Math.max(4, Math.floor(availableWidth / candles.length) - 3);

    if (chartType === 'candles') {
      candles.forEach((c, idx) => {
        const x = 15 + idx * (candleWidth + 3);
        const openY = getY(c.open);
        const closeY = getY(c.close);
        const highY = getY(c.high);
        const lowY = getY(c.low);

        const isBullish = c.close >= c.open;
        const color = isBullish ? '#20D997' : '#FF5C72';

        // High-low wick
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x + candleWidth / 2, highY);
        ctx.lineTo(x + candleWidth / 2, lowY);
        ctx.stroke();

        // Candle body
        ctx.fillStyle = color;
        const bodyY = Math.min(openY, closeY);
        const bodyHeight = Math.max(2, Math.abs(closeY - openY));
        ctx.fillRect(x, bodyY, candleWidth, bodyHeight);
      });
    } else {
      // Line mode with gradient fill
      ctx.beginPath();
      candles.forEach((c, idx) => {
        const x = 15 + idx * (candleWidth + 3) + candleWidth / 2;
        const y = getY(c.close);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      // Stroke line
      ctx.strokeStyle = '#28D7E5';
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Area gradient
      const lastX = 15 + (candles.length - 1) * (candleWidth + 3) + candleWidth / 2;
      ctx.lineTo(lastX, height - 30);
      ctx.lineTo(15 + candleWidth / 2, height - 30);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, 'rgba(40, 215, 229, 0.25)');
      grad.addColorStop(1, 'rgba(40, 215, 229, 0.0)');
      ctx.fillStyle = grad;
      ctx.fill();
    }

    // Current Price Line (Dashed)
    const currentY = getY(asset.price);
    ctx.strokeStyle = '#28D7E5';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, currentY);
    ctx.lineTo(width - rightMargin, currentY);
    ctx.stroke();
    ctx.setLineDash([]); // Reset dash

    // Current price badge on right axis
    ctx.fillStyle = '#28D7E5';
    ctx.beginPath();
    ctx.roundRect(width - 70, currentY - 11, 68, 22, 4);
    ctx.fill();

    ctx.fillStyle = '#06131A';
    ctx.font = 'bold 10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(formatPrice(asset.price), width - 36, currentY + 3.5);

    // Active Predictions Overlay
    activePredictions.forEach((pred) => {
      const predY = getY(pred.openingPrice);
      const isUp = pred.direction === 'UP';
      const color = isUp ? '#20D997' : '#FF5C72';

      // Dashed trade entry line
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 3]);
      ctx.beginPath();
      ctx.moveTo(0, predY);
      ctx.lineTo(width - rightMargin, predY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Trade entry marker on left
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(10, predY - 10, 85, 20, 4);
      ctx.fill();

      ctx.fillStyle = '#06131A';
      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`${pred.direction} ${formatPrice(pred.openingPrice)}`, 14, predY + 3.5);
    });

    // Crosshair on hover
    if (mousePos && mousePos.x < width - rightMargin) {
      ctx.strokeStyle = '#6E7D92';
      ctx.lineWidth = 0.8;
      ctx.setLineDash([3, 3]);

      // Vertical line
      ctx.beginPath();
      ctx.moveTo(mousePos.x, 0);
      ctx.lineTo(mousePos.x, height);
      ctx.stroke();

      // Horizontal line
      ctx.beginPath();
      ctx.moveTo(0, mousePos.y);
      ctx.lineTo(width - rightMargin, mousePos.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Price at crosshair Y
      const hoverPrice = maxPrice - ((mousePos.y - 30) / (height - 60)) * priceRange;
      ctx.fillStyle = '#1A273A';
      ctx.beginPath();
      ctx.roundRect(width - 70, mousePos.y - 10, 68, 20, 3);
      ctx.fill();

      ctx.fillStyle = '#F1F5FB';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(formatPrice(hoverPrice), width - 36, mousePos.y + 4);
    }
  }, [asset.price, chartType, mousePos, activePredictions]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[400px] sm:h-[460px] bg-[#101927] border border-[#233147] rounded-xl overflow-hidden flex flex-col select-none"
    >
      {/* Top Chart Toolbar */}
      <div className="h-12 px-4 bg-[#0C1320] border-b border-[#1A2637] flex items-center justify-between text-xs">
        {/* Left: Asset details & Simulated feed tag */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold font-['Space_Grotesk'] text-[#F1F5FB] text-sm">
              {asset.symbol}
            </span>
            <span className="text-xs text-[#9AA8BB] hidden sm:inline">
              {asset.displayName}
            </span>
          </div>

          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#28D7E5]/10 text-[#28D7E5] border border-[#28D7E5]/20">
            SIMULATED FEED
          </span>
        </div>

        {/* Right: Chart mode & Timeframe buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Candle vs Line */}
          <div className="flex items-center bg-[#141F30] p-1 rounded-lg border border-[#233147]">
            <button
              onClick={() => setChartType('candles')}
              className={`p-1.5 rounded transition-colors ${
                chartType === 'candles'
                  ? 'bg-[#28D7E5]/15 text-[#28D7E5]'
                  : 'text-[#8190A5] hover:text-[#F1F5FB]'
              }`}
              title="Candlestick Chart"
            >
              <BarChart2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`p-1.5 rounded transition-colors ${
                chartType === 'line'
                  ? 'bg-[#28D7E5]/15 text-[#28D7E5]'
                  : 'text-[#8190A5] hover:text-[#F1F5FB]'
              }`}
              title="Line Chart"
            >
              <TrendingUp className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Timeframes */}
          <div className="flex items-center bg-[#141F30] p-1 rounded-lg border border-[#233147] text-[11px] font-mono">
            {(['1m', '5m', '15m'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-1 rounded transition-colors ${
                  timeframe === tf
                    ? 'bg-[#28D7E5] text-[#06131A] font-semibold'
                    : 'text-[#8190A5] hover:text-[#F1F5FB]'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Canvas with interactive crosshair */}
      <div className="relative flex-1 w-full h-full">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair"
          onMouseMove={(e) => {
            const rect = canvasRef.current?.getBoundingClientRect();
            if (rect) {
              setMousePos({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
              });
            }
          }}
          onMouseLeave={() => setMousePos(null)}
        />

        {/* Live Market Price overlay badge (bottom-left) */}
        <div className="absolute bottom-3 left-4 flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#0C1320]/80 border border-[#233147] backdrop-blur-sm pointer-events-none">
          <Activity className="w-3.5 h-3.5 text-[#28D7E5]" />
          <span className="text-[11px] font-mono text-[#9AA8BB]">Live Tick:</span>
          <span className="text-xs font-mono font-bold text-[#F1F5FB]">
            {formatPrice(asset.price)}
          </span>
          <span
            className={`text-[11px] font-mono font-semibold ${
              asset.change24h >= 0 ? 'text-[#20D997]' : 'text-[#FF5C72]'
            }`}
          >
            {asset.change24h >= 0 ? '+' : ''}
            {asset.change24h.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
};
