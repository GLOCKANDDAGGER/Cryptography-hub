import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  Shield,
  Key,
  PieChart,
  BarChart2,
  AlertOctagon,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const EducationView: React.FC = () => {
  const [openModule, setOpenModule] = useState<number | null>(0);

  const modules = [
    {
      title: '01. Bitcoin Fundamentals & Digital Scarcity',
      icon: Key,
      duration: '15 min read',
      summary: 'Explore the mathematical foundation of Bitcoin: the 21 million coin hard cap, proof-of-work consensus, and why algorithmic scarcity fundamentally differs from fiat monetary inflation.',
      content: `Bitcoin functions as a decentralized, cryptographic ledger maintained by a global network of independent nodes. Unlike fiat currency, which central banks can expand arbitrarily, Bitcoin's emission curve is mathematically deterministic. Every 210,000 blocks (roughly four years), the issuance reward cut in half—an event known as the Halving. This programmatically reduces new supply entry, creating absolute mathematical scarcity.`,
    },
    {
      title: '02. Blockchain Architecture & Consensus Mechanisms',
      icon: BookOpen,
      duration: '20 min read',
      summary: 'An institutional breakdown of distributed state machines, cryptographic hashing (SHA-256), transaction mempools, and the difference between Proof of Work and Proof of Stake.',
      content: `A blockchain is an append-only distributed ledger structured into sequentially linked blocks of transactions. Each block contains a cryptographic hash of the prior block, ensuring historical immutability. Proof of Work (PoW) relies on thermodynamic computational exertion to anchor transaction finality, while Proof of Stake (PoS) utilizes economic capital bonds. Understanding these differences is fundamental to assessing network resilience.`,
    },
    {
      title: '03. Wallets, Multi-Signature & Custodial Architecture',
      icon: Shield,
      duration: '18 min read',
      summary: 'Distinguish between hot wallets, hardware signing devices, multi-signature vaults, and qualified custodial trusts. Learn why Crypto Hub Investments prioritizes segregated cold storage.',
      content: `A cryptocurrency wallet does not physically hold tokens; rather, it securely stores the private cryptographic keys required to sign spending transactions on the blockchain. Self-custody offers sovereign control but bears severe individual operational risk. Crypto Hub Investments utilizes institutional multi-signature custody, where multiple independent cryptographic keys geographically dispersed across secure hardware modules are required to authorize fund movements.`,
    },
    {
      title: '04. Market Volatility & Risk Management Heuristics',
      icon: AlertOctagon,
      duration: '22 min read',
      summary: 'Techniques for managing emotional reactions to market cycles. Understand drawdowns, position sizing, dollar-cost averaging, and maintaining adequate fiat liquidity reserves.',
      content: `Digital asset markets operate 24 hours a day, 365 days a year without traditional market halts or circuit breakers. Consequently, cyclical drawdowns of 30% to 70% have historically occurred during macro consolidations. Responsible investors insulate themselves from panic by sizing positions appropriately, maintaining emergency liquidity in USD, and avoiding speculative leverage.`,
    },
    {
      title: '05. Portfolio Diversification & Ecosystem Layering',
      icon: PieChart,
      duration: '16 min read',
      summary: 'How to structure digital asset holdings across monetary assets (Bitcoin), decentralized computation layers (Ethereum, Solana), and tactical cash reserves.',
      content: `Concentrating 100% of capital into high-beta altcoins exposes an investor to extreme tail-risk. A disciplined approach treats Bitcoin as the foundational anchor, Ethereum and smart contract ecosystems as infrastructure growth vectors, and cash reserves as dry powder to take advantage of cyclical compressions without forced asset liquidations.`,
    },
    {
      title: '06. Order Types, Execution & Slippage Fundamentals',
      icon: BarChart2,
      duration: '14 min read',
      summary: 'Understand limit orders, market orders, order book depth, slippage, and why institutional block executions utilize algorithmic TWAP to minimize market impact.',
      content: `Executing large cryptocurrency transactions through retail market orders often incurs severe price slippage due to thin order book depth. Crypto Hub Investments coordinates execution using Time-Weighted Average Price (TWAP) and OTC liquidity channels, ensuring our clients receive certified execution pricing without disturbing secondary market rates.`,
    },
  ];

  return (
    <div className="py-12 bg-[#000000] text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Title */}
        <div className="max-w-3xl space-y-3">
          <div className="text-xs font-mono text-[#FFA000] tracking-wider uppercase">
            INVESTOR EDUCATION ACADEMY
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Knowledge Precedes Intelligent Investment
          </h1>
          <p className="text-slate-300 text-base leading-relaxed">
            Our educational curriculum is built to empower clients with foundational blockchain knowledge, cold storage standards, and disciplined risk management principles.
          </p>
        </div>

        {/* Modules Accordion */}
        <div className="space-y-4">
          {modules.map((mod, index) => {
            const isOpen = openModule === index;
            const Icon = mod.icon;
            return (
              <div
                key={mod.title}
                className="bg-[#0B0F19] border border-[#1E293B] rounded-lg overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenModule(isOpen ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#111827]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded bg-[#162032] border border-slate-700 flex items-center justify-center text-[#FFA000] shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white">{mod.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
                        <span>{mod.duration}</span>
                        <span>·</span>
                        <span className="text-[#FFA000]">Curriculum Module</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-slate-400">
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 border-t border-slate-800/80 bg-[#080B11] text-sm text-slate-300 space-y-4">
                    <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded text-xs text-amber-200/90 font-mono">
                      <strong className="text-amber-300">Executive Summary:</strong> {mod.summary}
                    </div>
                    <div className="leading-relaxed space-y-2">
                      <p>{mod.content}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
