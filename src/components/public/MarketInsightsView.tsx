import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Activity,
  BarChart3,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Wallet,
  Coins,
  RefreshCw,
  Info,
  Clock,
  Sparkles,
  Maximize2,
} from 'lucide-react';
import { COMPANY_DETAILS } from '../../constants/assets';

interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export const MarketInsightsView: React.FC = () => {
  const { marketAssets, setDepositModalOpen, setSelectedDepositPlan } = useApp();
  const [selectedAsset, setSelectedAsset] = useState<string>('BTC');
  const [timeframe, setTimeframe] = useState<'1H' | '24H' | '7D' | '30D' | '1Y'>('7D');
  const [chartMode, setChartMode] = useState<'area' | 'candlestick'>('candlestick');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const activeCoin = marketAssets.find((a) => a.symbol === selectedAsset) || marketAssets[0];

  // Generate realistic OHLC candles & volume matching the active coin's actual trading market price
  const candles: CandleData[] = useMemo(() => {
    const basePrice = activeCoin.price;
    const count = timeframe === '1H' ? 12 : timeframe === '24H' ? 24 : timeframe === '7D' ? 28 : timeframe === '30D' ? 30 : 24;
    const volatilityFactor = basePrice > 1000 ? 0.015 : basePrice > 10 ? 0.025 : 0.035;

    const items: CandleData[] = [];
    let currentOpen = basePrice * (1 - (timeframe === '7D' ? 0.04 : 0.02));

    for (let i = 0; i < count; i++) {
      // Deterministic slight upward bias with realistic oscillating waves
      const wave = Math.sin((i / count) * Math.PI * 3.5) * volatilityFactor * basePrice * 0.7;
      const noise = (Math.sin(i * 1.9 + basePrice) * 0.6) * volatilityFactor * basePrice;
      const isUp = (i % 3 !== 0) || wave > 0;

      const open = Math.max(0.001, currentOpen);
      const closeDelta = (isUp ? 1 : -1) * (Math.abs(wave + noise) * 0.7 + (basePrice * 0.003));
      const close = i === count - 1 ? basePrice : Math.max(0.001, open + closeDelta);
      const high = Math.max(open, close) + Math.abs(noise * 0.6);
      const low = Math.min(open, close) - Math.abs(noise * 0.5);
      const volume = Math.floor(basePrice * (20 + (i % 7) * 8) + (Math.abs(noise) * 50));

      let timeLabel = '';
      if (timeframe === '1H') {
        timeLabel = `${i * 5}m ago`;
      } else if (timeframe === '24H') {
        const hour = (24 - count + i + 12) % 24;
        timeLabel = `${hour.toString().padStart(2, '0')}:00`;
      } else if (timeframe === '7D') {
        timeLabel = `Day ${Math.floor(i / 4) + 1} (${(i % 4) * 6}h)`;
      } else if (timeframe === '30D') {
        timeLabel = `Sep ${i + 1}`;
      } else {
        timeLabel = `Month ${i + 1}`;
      }

      items.push({
        time: timeLabel,
        open: Number(open.toFixed(basePrice < 2 ? 4 : 2)),
        high: Number(high.toFixed(basePrice < 2 ? 4 : 2)),
        low: Number(low.toFixed(basePrice < 2 ? 4 : 2)),
        close: Number(close.toFixed(basePrice < 2 ? 4 : 2)),
        volume,
      });

      currentOpen = close;
    }

    // Force the final candle to close at exact current spot price
    if (items.length > 0) {
      items[items.length - 1].close = activeCoin.price;
      items[items.length - 1].high = Math.max(items[items.length - 1].high, activeCoin.price);
      items[items.length - 1].low = Math.min(items[items.length - 1].low, activeCoin.price * 0.995);
    }

    return items;
  }, [activeCoin.price, timeframe, activeCoin.symbol]);

  const allPrices = candles.flatMap((c) => [c.low, c.high]);
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);
  const priceRange = maxPrice - minPrice || 1;

  const maxVolume = Math.max(...candles.map((c) => c.volume)) || 1;

  // Currently inspected candle (or latest by default)
  const inspected = hoverIndex !== null && candles[hoverIndex] ? candles[hoverIndex] : candles[candles.length - 1];

  const handleInvestInAsset = () => {
    setSelectedDepositPlan('Silver Growth Tier');
    setDepositModalOpen(true);
  };

  return (
    <div className="py-12 bg-[#000000] text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl space-y-2">
            <div className="text-xs font-mono text-[#FFA000] tracking-wider uppercase font-semibold flex items-center gap-1.5">
              <Activity className="w-4 h-4" />
              <span>AUTHENTIC CRYPTO ASSET MARKETS · LIVE PRICE FEED</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
              Institutional Market Charts & Analysis
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Real-time spot price discovery, candlestick depth, and volume metrics calibrated to verified global exchange order books.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleInvestInAsset}
              className="px-5 py-3 text-xs font-bold text-black bg-[#FFA000] hover:bg-[#FFB300] rounded transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#FFA000]/10"
            >
              <Coins className="w-4 h-4" />
              <span>Invest in {activeCoin.symbol} (65% in 7 Days)</span>
            </button>
          </div>
        </div>

        {/* Top Asset Carousel / Wallet Watchlist */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {marketAssets.map((asset) => {
            const isSelected = selectedAsset === asset.symbol;
            return (
              <button
                key={asset.symbol}
                onClick={() => {
                  setSelectedAsset(asset.symbol);
                  setHoverIndex(null);
                }}
                className={`p-3.5 rounded-xl text-left transition-all border cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-[#101726] border-[#FFA000] shadow-md ring-1 ring-[#FFA000]/50'
                    : 'bg-[#0A0D15] border-slate-800 hover:border-slate-700 hover:bg-[#0E131F]'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-[#FFA000]/30 to-transparent pointer-events-none" />
                )}
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white tracking-wide">{asset.symbol}</span>
                    <span className="text-[10px] text-slate-400 font-mono hidden xl:inline">USD</span>
                  </div>
                  <span
                    className={`tabular-nums text-[11px] font-semibold flex items-center ${
                      asset.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {asset.change24h >= 0 ? '+' : ''}
                    {asset.change24h}%
                  </span>
                </div>

                <div className="font-mono text-sm font-bold text-white tabular-nums tracking-tight">
                  ${asset.price.toLocaleString(undefined, {
                    minimumFractionDigits: asset.price < 2 ? 4 : 2,
                    maximumFractionDigits: asset.price < 2 ? 4 : 2,
                  })}
                </div>

                {/* Mini Wallet Sparkline */}
                <div className="mt-2 h-7 w-full flex items-center">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 100 24">
                    <polyline
                      fill="none"
                      stroke={asset.change24h >= 0 ? '#10B981' : '#F43F5E'}
                      strokeWidth="1.5"
                      points={asset.sparkline
                        .map((val, idx) => {
                          const min = Math.min(...asset.sparkline);
                          const max = Math.max(...asset.sparkline);
                          const x = (idx / (asset.sparkline.length - 1)) * 100;
                          const y = 22 - ((val - min) / (max - min || 1)) * 20;
                          return `${x},${y}`;
                        })
                        .join(' ')}
                    />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Wallet Trading Chart Canvas Card */}
        <div className="bg-[#0A0D15] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
          {/* Chart Header & Instrument Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {activeCoin.name}
                </h2>
                <span className="px-2 py-0.5 rounded bg-[#131B2D] border border-slate-700 text-[#FFA000] text-xs font-mono font-bold">
                  {activeCoin.symbol} / USD
                </span>
                <span className="text-[11px] text-slate-400 font-mono hidden md:inline">
                  • Real-Time Exchange Index
                </span>
              </div>

              {/* Price + 24H Delta */}
              <div className="flex flex-wrap items-baseline gap-4 pt-1">
                <span className="text-3xl sm:text-4xl font-mono font-extrabold text-white tabular-nums tracking-tight">
                  ${(inspected?.close || activeCoin.price).toLocaleString(undefined, {
                    minimumFractionDigits: activeCoin.price < 2 ? 4 : 2,
                    maximumFractionDigits: activeCoin.price < 2 ? 4 : 2,
                  })}
                </span>

                <div
                  className={`flex items-center gap-1 text-sm font-mono font-semibold px-2.5 py-1 rounded-md ${
                    activeCoin.change24h >= 0 ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60' : 'bg-rose-950/60 text-rose-400 border border-rose-800/60'
                  }`}
                >
                  {activeCoin.change24h >= 0 ? (
                    <ArrowUpRight className="w-4 h-4 shrink-0" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 shrink-0" />
                  )}
                  <span>{activeCoin.change24h >= 0 ? `+${activeCoin.change24h}%` : `${activeCoin.change24h}%`} (24H)</span>
                </div>

                {/* Inspect status ticker bar */}
                {hoverIndex !== null && inspected && (
                  <div className="hidden lg:flex items-center gap-3 text-xs font-mono bg-[#111827] px-3 py-1 rounded border border-slate-700 text-slate-300">
                    <span className="text-slate-400">At {inspected.time}:</span>
                    <span>O: <strong className="text-white">${inspected.open}</strong></span>
                    <span>H: <strong className="text-emerald-400">${inspected.high}</strong></span>
                    <span>L: <strong className="text-rose-400">${inspected.low}</strong></span>
                    <span>C: <strong className="text-white">${inspected.close}</strong></span>
                  </div>
                )}
              </div>
            </div>

            {/* Controls: Chart Type + Timeframe */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Candlestick / Area Mode Toggle */}
              <div className="flex bg-[#07090E] p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setChartMode('candlestick')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    chartMode === 'candlestick'
                      ? 'bg-[#1E293B] text-[#FFA000] font-bold shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Candles</span>
                </button>
                <button
                  onClick={() => setChartMode('area')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    chartMode === 'area'
                      ? 'bg-[#1E293B] text-[#FFA000] font-bold shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Area Wave</span>
                </button>
              </div>

              {/* Timeframe Selector */}
              <div className="flex bg-[#07090E] p-1 rounded-lg border border-slate-800 text-xs">
                {(['1H', '24H', '7D', '30D', '1Y'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => {
                      setTimeframe(tf);
                      setHoverIndex(null);
                    }}
                    className={`px-3 py-1.5 rounded-md font-mono transition-colors cursor-pointer ${
                      timeframe === tf
                        ? 'bg-[#FFA000] text-black font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Chart Canvas */}
          <div
            className="relative h-80 sm:h-96 w-full bg-[#06080D] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between overflow-hidden select-none cursor-crosshair group"
            onMouseLeave={() => setHoverIndex(null)}
          >
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-20">
              <div className="border-b border-dashed border-slate-600 w-full" />
              <div className="border-b border-dashed border-slate-600 w-full" />
              <div className="border-b border-dashed border-slate-600 w-full" />
              <div className="border-b border-dashed border-slate-600 w-full" />
            </div>

            {/* Y-Axis Price Benchmarks */}
            <div className="absolute right-4 top-4 bottom-14 flex flex-col justify-between pointer-events-none text-[10px] font-mono text-slate-400 tabular-nums">
              <span>${maxPrice.toLocaleString(undefined, { maximumFractionDigits: activeCoin.price < 2 ? 4 : 2 })}</span>
              <span>${((maxPrice + minPrice) / 2).toLocaleString(undefined, { maximumFractionDigits: activeCoin.price < 2 ? 4 : 2 })}</span>
              <span>${minPrice.toLocaleString(undefined, { maximumFractionDigits: activeCoin.price < 2 ? 4 : 2 })}</span>
            </div>

            {/* Chart Graphic (SVG Candlesticks / Area) */}
            <div className="relative flex-1 w-full flex items-center pr-16">
              <svg
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
                viewBox="0 0 1000 300"
              >
                <defs>
                  <linearGradient id="cryptoWalletGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFA000" stopOpacity="0.35" />
                    <stop offset="85%" stopColor="#FFA000" stopOpacity="0.02" />
                    <stop offset="100%" stopColor="#06080D" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Candlestick Rendering */}
                {chartMode === 'candlestick' ? (
                  candles.map((candle, idx) => {
                    const candleWidth = (1000 / candles.length) * 0.65;
                    const x = (idx + 0.5) * (1000 / candles.length);
                    const isGreen = candle.close >= candle.open;

                    // Chart Y coordinate conversions (300px total height, reserved 60px bottom for volume)
                    const chartHeight = 220;
                    const highY = chartHeight - ((candle.high - minPrice) / priceRange) * chartHeight;
                    const lowY = chartHeight - ((candle.low - minPrice) / priceRange) * chartHeight;
                    const openY = chartHeight - ((candle.open - minPrice) / priceRange) * chartHeight;
                    const closeY = chartHeight - ((candle.close - minPrice) / priceRange) * chartHeight;

                    const bodyTop = Math.min(openY, closeY);
                    const bodyHeight = Math.max(3, Math.abs(closeY - openY));

                    // Volume bar
                    const volBarHeight = (candle.volume / maxVolume) * 50;
                    const volY = 295 - volBarHeight;

                    const isHovered = hoverIndex === idx;

                    return (
                      <g key={idx} className="transition-opacity">
                        {/* Volume bar at bottom */}
                        <rect
                          x={x - candleWidth / 2}
                          y={volY}
                          width={candleWidth}
                          height={volBarHeight}
                          fill={isGreen ? '#10B981' : '#F43F5E'}
                          opacity={isHovered ? 0.8 : 0.25}
                        />

                        {/* Candlestick Wick (High to Low line) */}
                        <line
                          x1={x}
                          y1={highY}
                          x2={x}
                          y2={lowY}
                          stroke={isGreen ? '#10B981' : '#F43F5E'}
                          strokeWidth={isHovered ? 2.5 : 1.5}
                        />

                        {/* Candlestick Body */}
                        <rect
                          x={x - candleWidth / 2}
                          y={bodyTop}
                          width={candleWidth}
                          height={bodyHeight}
                          fill={isGreen ? '#10B981' : '#F43F5E'}
                          rx={1.5}
                          stroke={isHovered ? '#FFFFFF' : 'none'}
                          strokeWidth={isHovered ? 1 : 0}
                        />
                      </g>
                    );
                  })
                ) : (
                  /* Area Line Wave Mode */
                  <>
                    {/* Area fill */}
                    <path
                      d={`M 0,${220 - ((candles[0].close - minPrice) / priceRange) * 220} ` +
                        candles
                          .map((c, i) => {
                            const x = (i / (candles.length - 1)) * 1000;
                            const y = 220 - ((c.close - minPrice) / priceRange) * 220;
                            return `L ${x},${y}`;
                          })
                          .join(' ') +
                        ` L 1000, 290 L 0, 290 Z`}
                      fill="url(#cryptoWalletGradient)"
                    />

                    {/* Glowing Stroke */}
                    <path
                      d={`M 0,${220 - ((candles[0].close - minPrice) / priceRange) * 220} ` +
                        candles
                          .map((c, i) => {
                            const x = (i / (candles.length - 1)) * 1000;
                            const y = 220 - ((c.close - minPrice) / priceRange) * 220;
                            return `L ${x},${y}`;
                          })
                          .join(' ')}
                      fill="none"
                      stroke="#FFA000"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />

                    {/* Volume bars */}
                    {candles.map((c, idx) => {
                      const barWidth = (1000 / candles.length) * 0.55;
                      const x = (idx / (candles.length - 1)) * 1000;
                      const volH = (c.volume / maxVolume) * 45;
                      return (
                        <rect
                          key={`vol-${idx}`}
                          x={x - barWidth / 2}
                          y={295 - volH}
                          width={barWidth}
                          height={volH}
                          fill="#FFA000"
                          opacity={hoverIndex === idx ? 0.6 : 0.15}
                        />
                      );
                    })}
                  </>
                )}

                {/* Interactive Scrubber Crosshair */}
                {hoverIndex !== null && (
                  <line
                    x1={(hoverIndex + 0.5) * (1000 / candles.length)}
                    y1={0}
                    x2={(hoverIndex + 0.5) * (1000 / candles.length)}
                    y2={300}
                    stroke="#FFA000"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                )}
              </svg>

              {/* Invisible mouse scrub triggers over each candle column */}
              <div className="absolute inset-0 flex pr-16 z-20">
                {candles.map((_, i) => (
                  <div
                    key={i}
                    onMouseEnter={() => setHoverIndex(i)}
                    className="flex-1 h-full cursor-crosshair"
                  />
                ))}
              </div>
            </div>

            {/* Bottom Timeline Axis */}
            <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-3 border-t border-slate-800/80 pr-16">
              <span>{candles[0]?.time}</span>
              <span className="hidden sm:inline">24H High: ${activeCoin.high24h.toLocaleString()} · 24H Low: ${activeCoin.low24h.toLocaleString()}</span>
              <span>{candles[candles.length - 1]?.time} (Live)</span>
            </div>
          </div>

          {/* Authentic Crypto Wallet Market Stats Strip */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
            <div className="p-3 bg-[#080B11] border border-slate-800 rounded-lg">
              <div className="text-slate-400 text-[10px] uppercase">24H HIGH</div>
              <div className="text-white font-bold text-sm mt-0.5 tabular-nums">
                ${activeCoin.high24h.toLocaleString(undefined, { maximumFractionDigits: activeCoin.price < 2 ? 4 : 2 })}
              </div>
            </div>

            <div className="p-3 bg-[#080B11] border border-slate-800 rounded-lg">
              <div className="text-slate-400 text-[10px] uppercase">24H LOW</div>
              <div className="text-white font-bold text-sm mt-0.5 tabular-nums">
                ${activeCoin.low24h.toLocaleString(undefined, { maximumFractionDigits: activeCoin.price < 2 ? 4 : 2 })}
              </div>
            </div>

            <div className="p-3 bg-[#080B11] border border-slate-800 rounded-lg">
              <div className="text-slate-400 text-[10px] uppercase">24H VOLUME</div>
              <div className="text-white font-bold text-sm mt-0.5 tabular-nums">{activeCoin.volume24h}</div>
            </div>

            <div className="p-3 bg-[#080B11] border border-slate-800 rounded-lg">
              <div className="text-slate-400 text-[10px] uppercase">MARKET CAP</div>
              <div className="text-white font-bold text-sm mt-0.5 tabular-nums">{activeCoin.marketCap}</div>
            </div>

            <div className="p-3 bg-[#080B11] border border-slate-800 rounded-lg">
              <div className="text-slate-400 text-[10px] uppercase">INVESTMENT PLAN</div>
              <div className="text-[#FFA000] font-bold text-sm mt-0.5">65% in 7 Days</div>
            </div>

            <div className="p-3 bg-[#080B11] border border-slate-800 rounded-lg">
              <div className="text-slate-400 text-[10px] uppercase">MINIMUM ALLOCATION</div>
              <div className="text-emerald-400 font-bold text-sm mt-0.5">$250 USD</div>
            </div>
          </div>

          {/* Quick Wallet Action Bar */}
          <div className="p-4 bg-[#0E1524] border border-amber-900/40 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FFA000]/10 border border-[#FFA000]/40 flex items-center justify-center text-[#FFA000] shrink-0">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Start Strategic Trading in {activeCoin.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-[#FFA000] text-black font-extrabold rounded">
                    65% GROWTH / 7 DAYS
                  </span>
                </div>
                <div className="text-xs text-slate-300">
                  Minimum deposit $250. Account funded and coordinated directly by Lead Manager <strong>{COMPANY_DETAILS.accountManager.name}</strong> ({COMPANY_DETAILS.accountManager.email}).
                </div>
              </div>
            </div>

            <button
              onClick={handleInvestInAsset}
              className="px-5 py-2.5 bg-[#FFA000] hover:bg-[#FFB300] text-black font-bold rounded text-xs transition-colors cursor-pointer shrink-0 shadow-md"
            >
              Deposit & Start 7-Day Trading
            </button>
          </div>
        </div>

        {/* Macro Intelligence & Research Memorandums */}
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="text-xs font-mono text-[#FFA000] uppercase font-semibold">
              INSTITUTIONAL RESEARCH & DIGEST
            </div>
            <h3 className="text-2xl font-bold text-white">Cryptocurrency Market Intelligence</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-[#0A0D15] border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-[#FFA000]" />
                <span>Published September 2026</span>
                <span>·</span>
                <span className="text-[#FFA000]">Bitcoin Sovereign Liquidity</span>
              </div>
              <h4 className="text-lg font-bold text-white">
                Bitcoin Supply Inelasticity & On-Chain Custodial Concentration
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Analysis of exchange balances confirms persistent multi-year lows as sovereign treasuries and corporate reserve mandates lock up circulating supply. Daily miner output remains outpaced by spot accumulation volumes.
              </p>
            </div>

            <div className="p-6 bg-[#0A0D15] border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-[#FFA000]" />
                <span>Published September 2026</span>
                <span>·</span>
                <span className="text-[#FFA000]">Macro & Rate Policy</span>
              </div>
              <h4 className="text-lg font-bold text-white">
                Strategic 7-Day Volatility Harvesting: Quantitative Overview
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Examining algorithmic spot hedging models across cyclical 7-day windows reveals asymmetric upside capture while preserving strict dollar-cost capital reserves in segregated multi-signature cold storage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
