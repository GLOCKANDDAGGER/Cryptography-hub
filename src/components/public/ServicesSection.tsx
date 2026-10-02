import React from 'react';
import { useApp } from '../../context/AppContext';
import { COMPANY_DETAILS } from '../../constants/assets';
import {
  TrendingUp,
  Coins,
  Briefcase,
  Eye,
  BookOpen,
  LineChart,
  UserCheck,
  Headphones,
  Globe2,
  ArrowRight,
  Calendar,
  MessageCircle,
} from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const { setActivePage, setAppointmentModalOpen } = useApp();

  const services = [
    {
      id: 'crypto-analysis',
      title: 'Cryptocurrency Market Analysis',
      icon: TrendingUp,
      desc: 'In-depth market intelligence covering volatility models, liquidations, on-chain flows, macro correlations, and multi-exchange order-book dynamics.',
      disclosure: 'Analysis provided for informational and analytical purposes; not individualized financial advice.',
    },
    {
      id: 'btc-analysis',
      title: 'Bitcoin Focused Analysis',
      icon: Coins,
      desc: 'Specialized institutional research evaluating Bitcoin halving cycles, hash rate security, sovereign adoption curves, and ETF capital flow patterns.',
      disclosure: 'Bitcoin prices can fluctuate substantially. Past halving performance is not indicative of future returns.',
    },
    {
      id: 'portfolio-mgmt',
      title: 'Digital-Asset Portfolio Management',
      icon: Briefcase,
      desc: 'Institutional-grade asset allocation frameworks balancing digital store-of-value, smart contract platforms, and segregated fiat cash buffers.',
      disclosure: 'Digital asset portfolios are managed within verified risk tolerance mandates. Capital loss risk applies.',
    },
    {
      id: 'portfolio-monitoring',
      title: 'Real-Time Portfolio Monitoring',
      icon: Eye,
      desc: '24/7 authenticated client portal visibility into verified custodial balances, cost basis accounting, trade ledgers, and rebalancing thresholds.',
      disclosure: 'All displayed values are synchronized with authenticated custodial records and verifiable audit logs.',
    },
    {
      id: 'investor-education',
      title: 'Comprehensive Investor Education',
      icon: BookOpen,
      desc: 'Structured curriculum covering wallet cryptography, self-custody vs. institutional custody, risk management heuristics, and market cycles.',
      disclosure: 'Educational resources are designed to foster responsible and informed market participation.',
    },
    {
      id: 'market-research',
      title: 'Institutional Market Research',
      icon: LineChart,
      desc: 'Weekly intelligence memorandums, quarterly macro briefs, regulatory impact assessments, and liquidity trend forecasting.',
      disclosure: 'Research synthesizes public blockchain telemetry and verified economic indicators.',
    },
    {
      id: 'account-management',
      title: 'Dedicated Account Management',
      icon: UserCheck,
      desc: 'Direct access to experienced Account Managers—including Ashley Elvira (7+ years trading experience)—for personalized strategy reviews and onboarding support.',
      disclosure: 'Account managers facilitate communication, execution logistics, and support; not investment warranties.',
    },
    {
      id: 'client-support',
      title: 'Client Support & Operations',
      icon: Headphones,
      desc: 'Responsive operational assistance for token verification, multi-factor authentication, deposit routing, statement generation, and technical escalations.',
      disclosure: 'Direct inquiries handled via CryptoHubinvestments@outlook.com and myhelpsdesk@outlook.com.',
    },
    {
      id: 'forex-services',
      title: 'Foreign Exchange (Forex) Analysis',
      icon: Globe2,
      desc: 'Macro currency pair analysis and cross-rate correlation modeling available strictly where legally permitted and authorized under local jurisdiction.',
      disclosure: 'Forex services subject to regulatory authorization in applicable jurisdictions. Leveraged trading carries high risk.',
    },
  ];

  return (
    <section className="py-16 bg-[#000000] border-b border-[#1E293B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3 mb-12">
          <div className="text-xs font-mono text-[#FFA000] tracking-wider uppercase">
            COMPREHENSIVE FINANCIAL TECHNOLOGY CAPABILITIES
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Structured Services Built on Intelligence & Responsibility
          </h2>
          <p className="text-slate-300 text-base leading-relaxed">
            Every service is grounded in transparent record-keeping, rigorous market research, and institutional security—never speculative promises or unverified claims.
          </p>
        </div>

        {/* Services Grid (Clean 3-column architecture, single-elevation depth) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.id}
                className="bg-[#0B0F19] border border-[#1F2937] hover:border-[#FFA000]/60 rounded-md p-6 flex flex-col justify-between transition-colors space-y-4"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded bg-[#111827] border border-slate-700 flex items-center justify-center text-[#FFA000]">
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white tracking-tight">
                      {svc.title}
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {svc.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80">
                  <p className="text-[11px] text-slate-400 font-mono leading-normal">
                    <span className="text-[#FFA000] font-semibold">Disclosure:</span> {svc.disclosure}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dedicated Account Manager Callout Card */}
        <div className="mt-12 bg-gradient-to-r from-[#0C111E] to-[#121927] border border-[#2B3547] rounded-lg p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="text-xs font-mono text-[#FFA000]">DIRECT CLIENT ALLOCATION</div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Connect With Your Dedicated Account Manager
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Work with Ashley Elvira, Account Manager & Cryptocurrency Analyst with over 7 years of trading experience, to coordinate your digital-asset portfolio strategy, onboarding, and platform support.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setAppointmentModalOpen(true)}
              className="px-5 py-3 text-xs font-bold text-black bg-[#FFA000] hover:bg-[#FFB300] rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule Consultation</span>
            </button>

            <a
              href={COMPANY_DETAILS.accountManager.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 text-xs font-mono font-bold text-sky-300 hover:text-white bg-[#0088cc]/20 hover:bg-[#0088cc]/30 border border-[#0088cc]/50 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5 text-sky-400" />
              <span>{COMPANY_DETAILS.accountManager.telegram}</span>
            </a>

            <button
              onClick={() => setActivePage('about')}
              className="px-4 py-3 text-xs font-semibold text-slate-300 hover:text-white bg-[#111827] hover:bg-[#1E293B] border border-slate-700 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>View Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
