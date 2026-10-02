import React from 'react';
import { useApp } from '../../context/AppContext';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark' | 'auto';
  className?: string;
  onClick?: () => void;
  showIcon?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'auto',
  className = '',
  onClick,
  showIcon = true,
}) => {
  let appTheme: 'dark' | 'light' = 'dark';
  try {
    const app = useApp();
    if (app?.theme) appTheme = app.theme;
  } catch {
    // Graceful fallback if rendered outside provider
    appTheme = 'dark';
  }

  const isLight =
    variant === 'light' || (variant === 'auto' && appTheme === 'light');

  const sizeClasses = {
    sm: {
      icon: 24,
      badge: 'text-xs h-6',
      cryptoPad: 'px-2 py-0.5',
      hubPad: 'px-2 py-0.5',
      investments: 'text-[8px] tracking-[0.28em] mt-1',
      line: 'h-[1.5px] w-2.5',
      gap: 'gap-2',
    },
    md: {
      icon: 32,
      badge: 'text-sm h-7',
      cryptoPad: 'px-2.5 py-0.5',
      hubPad: 'px-2.5 py-0.5',
      investments: 'text-[9px] tracking-[0.32em] mt-1.5',
      line: 'h-[1.5px] w-3.5',
      gap: 'gap-2.5',
    },
    lg: {
      icon: 42,
      badge: 'text-lg h-9',
      cryptoPad: 'px-3.5 py-1',
      hubPad: 'px-3.5 py-1',
      investments: 'text-[11px] tracking-[0.38em] mt-2',
      line: 'h-[2px] w-5',
      gap: 'gap-3',
    },
  }[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center select-none cursor-pointer group transition-transform active:scale-95 ${sizeClasses.gap} ${className}`}
      role="banner"
      aria-label="Crypto Hub Investments"
      title="Crypto Hub Investments"
    >
      {/* 1. Distinctive Institutional Monogram Emblem */}
      {showIcon && (
        <div
          className="shrink-0 relative flex items-center justify-center transition-transform group-hover:scale-105 duration-200"
          style={{ width: sizeClasses.icon, height: sizeClasses.icon }}
        >
          <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-sm"
          >
            <defs>
              {/* Premium Metallic Gold Gradients */}
              <linearGradient id="chiGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFA000" />
                <stop offset="50%" stopColor="#FFC107" />
                <stop offset="100%" stopColor="#FF8F00" />
              </linearGradient>
              <linearGradient id="chiGoldAccent" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFE082" />
                <stop offset="100%" stopColor="#FFA000" />
              </linearGradient>
              <radialGradient id="chiCoreGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFA000" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#FFA000" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Ambient Core Glow */}
            <circle cx="20" cy="20" r="18" fill="url(#chiCoreGlow)" />

            {/* Outer Hexagonal Vault Shield */}
            <polygon
              points="20,2 35.5,11 35.5,29 20,38 4.5,29 4.5,11"
              fill={isLight ? '#FFFFFF' : '#0B0F19'}
              stroke="url(#chiGoldGrad)"
              strokeWidth="2.2"
              strokeLinejoin="round"
              className={isLight ? 'filter drop-shadow-[0_2px_4px_rgba(255,160,0,0.18)]' : ''}
            />

            {/* Inner Geometric Cuboid Facets (Digital Asset Blocks) */}
            {/* Top Facet */}
            <polygon
              points="20,8 29,13.5 20,19 11,13.5"
              fill="url(#chiGoldAccent)"
              opacity="0.95"
            />
            {/* Left Facet */}
            <polygon
              points="11,15.5 20,21 20,32 11,26.5"
              fill="#FF8F00"
              opacity="0.85"
            />
            {/* Right Facet */}
            <polygon
              points="20,21 29,15.5 29,26.5 20,32"
              fill="url(#chiGoldGrad)"
            />

            {/* Central Diamond Nexus Node */}
            <polygon
              points="20,16 23,20 20,24 17,20"
              fill={isLight ? '#0A0E17' : '#FFFFFF'}
            />
          </svg>
        </div>
      )}

      {/* 2. Typographic Two-Tone Wordmark & Sub-brand Line */}
      <div className="flex flex-col items-start leading-none">
        {/* Two-Tone Wordmark Badge */}
        <div
          className={`inline-flex items-center rounded-md overflow-hidden font-bold tracking-tight shadow-xs ${sizeClasses.badge}`}
          style={{
            border: isLight ? '1px solid #CBD5E1' : '1px solid #334155',
            boxShadow: isLight
              ? '0 1px 3px rgba(0,0,0,0.06)'
              : '0 2px 4px rgba(0,0,0,0.4)',
          }}
        >
          {/* Left Panel: Deep Carbon Obsidian with Crisp White "Crypto" */}
          <div
            className={`flex items-center justify-center font-extrabold ${sizeClasses.cryptoPad}`}
            style={{
              backgroundColor: '#090D16',
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
            }}
          >
            Crypto
          </div>

          {/* Right Panel: Radiant Gold with Bold Black "Hub" */}
          <div
            className={`flex items-center justify-center font-extrabold ${sizeClasses.hubPad}`}
            style={{
              backgroundColor: '#FFA000',
              color: '#000000',
              letterSpacing: '-0.02em',
            }}
          >
            Hub
          </div>
        </div>

        {/* Sub-brand line: INVESTMENTS with horizontal accent bars */}
        <div
          className={`flex items-center gap-1.5 uppercase font-mono font-bold ${sizeClasses.investments}`}
          style={{
            color: isLight ? '#0F172A' : '#E2E8F0',
          }}
        >
          <span
            className={`rounded-full shrink-0 ${sizeClasses.line}`}
            style={{ backgroundColor: '#FFA000' }}
            aria-hidden="true"
          />
          <span className="tracking-[0.32em] font-extrabold">INVESTMENTS</span>
          <span
            className={`rounded-full shrink-0 ${sizeClasses.line}`}
            style={{ backgroundColor: '#FFA000' }}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
};
