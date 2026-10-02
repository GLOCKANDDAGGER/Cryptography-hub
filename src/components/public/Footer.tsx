import React from 'react';
import { Logo } from '../brand/Logo';
import { useApp } from '../../context/AppContext';
import { COMPANY_DETAILS } from '../../constants/assets';
import { Mail, MapPin, AlertTriangle, MessageCircle, Calendar, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActivePage, setAppointmentModalOpen } = useApp();

  const handleNav = (page: string) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#000000] border-t border-[#1E293B] text-slate-300 text-xs">
      {/* Upper Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
        {/* Col 1: Brand & Contact Info */}
        <div className="lg:col-span-5 space-y-4">
          <Logo size="md" onClick={() => handleNav('home')} />
          <p className="text-slate-300 text-xs leading-relaxed max-w-sm">
            Digital Assets. Intelligent Strategies. Responsible Growth.
          </p>
          <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
            A technology-driven platform for digital-asset market information, portfolio management, investor education, and client support.
          </p>

          <div className="space-y-2 pt-2 text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-300">
              <Mail className="w-3.5 h-3.5 text-[#FFA000] shrink-0" />
              <span>Primary:</span>
              <a href={`mailto:${COMPANY_DETAILS.primaryEmail}`} className="text-slate-200 hover:text-[#FFA000]">
                {COMPANY_DETAILS.primaryEmail}
              </a>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Mail className="w-3.5 h-3.5 text-[#FFA000] shrink-0" />
              <span>Customer Care:</span>
              <a href={`mailto:${COMPANY_DETAILS.customerCareEmail}`} className="text-slate-200 hover:text-[#FFA000]">
                {COMPANY_DETAILS.customerCareEmail}
              </a>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Mail className="w-3.5 h-3.5 text-[#FFA000] shrink-0" />
              <span>Account Manager (Ashley Elvira):</span>
              <a href={`mailto:${COMPANY_DETAILS.accountManager.email}`} className="text-slate-200 hover:text-[#FFA000]">
                {COMPANY_DETAILS.accountManager.email}
              </a>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <MessageCircle className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>Direct Telegram:</span>
              <a
                href={COMPANY_DETAILS.accountManager.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-300 hover:text-sky-200 font-bold"
              >
                {COMPANY_DETAILS.accountManager.telegram}
              </a>
            </div>
            <div className="flex items-center gap-2 text-slate-300 pt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{COMPANY_DETAILS.location}</span>
            </div>
          </div>
        </div>

        {/* Col 2: Solutions & Research */}
        <div className="lg:col-span-2 space-y-3">
          <div className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            SOLUTIONS
          </div>
          <ul className="space-y-2 text-slate-400">
            <li>
              <button onClick={() => handleNav('services')} className="hover:text-white transition-colors cursor-pointer">
                Market Analysis
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('services')} className="hover:text-white transition-colors cursor-pointer">
                Bitcoin Analysis
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('investment-solutions')} className="hover:text-white transition-colors cursor-pointer">
                Portfolio Management
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('market-insights')} className="hover:text-white transition-colors cursor-pointer">
                Market Insights
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('education')} className="hover:text-white transition-colors cursor-pointer">
                Investor Education
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Company & Governance */}
        <div className="lg:col-span-2 space-y-3">
          <div className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            GOVERNANCE
          </div>
          <ul className="space-y-2 text-slate-400">
            <li>
              <button onClick={() => handleNav('about')} className="hover:text-white transition-colors cursor-pointer">
                About Us
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('security')} className="hover:text-white transition-colors cursor-pointer">
                Security Architecture
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('compliance')} className="hover:text-white transition-colors cursor-pointer">
                Compliance & KYC
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('faq')} className="hover:text-white transition-colors cursor-pointer">
                FAQ
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('contact')} className="hover:text-white transition-colors cursor-pointer">
                Contact Desk
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4: Client Services */}
        <div className="lg:col-span-3 space-y-3">
          <div className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            CLIENT SERVICES
          </div>
          <ul className="space-y-2 text-slate-400">
            <li>
              <button
                onClick={() => setAppointmentModalOpen(true)}
                className="hover:text-[#FFA000] text-[#FFA000] font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule Appointment</span>
              </button>
            </li>
            <li>
              <a
                href={COMPANY_DETAILS.accountManager.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-sky-300 text-sky-400 font-medium transition-colors flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Telegram: {COMPANY_DETAILS.accountManager.telegram}</span>
              </a>
            </li>
            <li>
              <button onClick={() => handleNav('dashboard')} className="hover:text-[#FFA000] text-slate-300 font-medium transition-colors cursor-pointer">
                Client Dashboard
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('portfolio')} className="hover:text-white transition-colors cursor-pointer">
                Portfolio Ledger
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('account-manager')} className="hover:text-white transition-colors cursor-pointer">
                Ashley Elvira (Account Mgr)
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('documents')} className="hover:text-white transition-colors cursor-pointer">
                Statements & Reports
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('support')} className="hover:text-white transition-colors cursor-pointer">
                Support Center
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Mandatory Regulatory Risk Disclosure Footer Bar */}
      <div className="border-t border-[#1F2937] bg-[#0A0E17] py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex items-start gap-2.5 text-[11px] text-slate-400 leading-relaxed">
            <AlertTriangle className="w-4 h-4 text-[#FFA000] shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200">Regulatory & Risk Notice: </strong>
              {COMPANY_DETAILS.disclaimer} Crypto Hub Investments operates as a digital-asset and cryptocurrency financial technology platform with its primary business association in Massachusetts, United States. We do not claim endorsement, licensing, or registration by the SEC, FINRA, or federal government agencies unless independently verified.
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-400 font-mono">
            <div>
              © 2026 Crypto Hub Investments. All rights reserved. Primary association: Massachusetts, United States.
            </div>
            <div className="flex items-center gap-4">
              <span className="hover:text-slate-200 cursor-pointer" onClick={() => handleNav('compliance')}>
                Privacy Policy
              </span>
              <span>·</span>
              <span className="hover:text-slate-200 cursor-pointer" onClick={() => handleNav('compliance')}>
                Terms of Service
              </span>
              <span>·</span>
              <span className="hover:text-slate-200 cursor-pointer" onClick={() => handleNav('security')}>
                Security Protocol
              </span>
              <span>·</span>
              <button
                onClick={() => handleNav('admin-dashboard')}
                className="hover:text-slate-200 opacity-60 hover:opacity-100 cursor-pointer flex items-center gap-1 transition-opacity text-[10px]"
                title="Staff & Administrative Gateway"
              >
                <Lock className="w-3 h-3 text-[#FFA000]" />
                <span>Staff Access</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
