import React from 'react';
import { useApp } from '../../context/AppContext';
import { COMPANY_DETAILS, ASSETS } from '../../constants/assets';
import { ShieldCheck, Eye, Lock, HeartHandshake, Lightbulb, UserCheck, Mail, MapPin, MessageCircle, Calendar, ExternalLink } from 'lucide-react';

export const AboutView: React.FC = () => {
  const { setActivePage, setAppointmentModalOpen } = useApp();

  const values = [
    {
      title: 'Integrity',
      icon: ShieldCheck,
      desc: 'Maintain accurate information and communicate honestly with clients at every stage of the relationship.',
    },
    {
      title: 'Transparency',
      icon: Eye,
      desc: 'Provide clear, verifiable information about products, fees, transactions, risks, and account activity.',
    },
    {
      title: 'Security',
      icon: Lock,
      desc: 'Protect client accounts, cryptographic keys, and sensitive data through appropriate technical and operational controls.',
    },
    {
      title: 'Responsible Investing',
      icon: HeartHandshake,
      desc: 'Communicate market risks clearly, prioritize capital preservation, and never represent financial markets as risk-free.',
    },
    {
      title: 'Innovation',
      icon: Lightbulb,
      desc: 'Use modern technology, on-chain analytics, and structured data to elevate the digital-asset client experience.',
    },
    {
      title: 'Client Service',
      icon: UserCheck,
      desc: 'Provide accessible, professional, and responsive client support through assigned account managers and dedicated operational desks.',
    },
  ];

  return (
    <div className="py-12 bg-[#000000] text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        {/* Header Block */}
        <div className="max-w-3xl space-y-4">
          <div className="text-xs font-mono text-[#FFA000] tracking-wider uppercase">
            ABOUT CRYPTO HUB INVESTMENTS
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Digital Assets. Intelligent Strategies. Responsible Growth.
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed">
            Crypto Hub Investments is a digital-asset investment and financial technology platform focused on cryptocurrency market analysis, Bitcoin services, portfolio management, investor education, and professional client support.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-lg bg-[#0B0F19] border border-[#1E293B] space-y-3">
            <div className="text-xs font-mono text-[#FFA000] uppercase">OUR MISSION</div>
            <h2 className="text-2xl font-bold text-white">Structured & Accessible Investing</h2>
            <p className="text-slate-300 leading-relaxed text-sm">
              To make digital-asset investing more structured, transparent, and accessible through technology, market research, education, and professional client support.
            </p>
          </div>

          <div className="p-8 rounded-lg bg-[#0B0F19] border border-[#1E293B] space-y-3">
            <div className="text-xs font-mono text-[#FFA000] uppercase">OUR VISION</div>
            <h2 className="text-2xl font-bold text-white">A Trusted Digital-Asset Partner</h2>
            <p className="text-slate-300 leading-relaxed text-sm">
              To build a trusted digital-asset platform combining financial technology, market intelligence, security, and responsible investment practices.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-mono text-[#FFA000] uppercase">FOUNDATIONAL PILLARS</div>
            <h2 className="text-3xl font-bold text-white">Our Core Values</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((val) => {
              const Icon = val.icon;
              return (
                <div key={val.title} className="p-6 rounded-md bg-[#0A0E17] border border-[#1F2937] space-y-3">
                  <div className="w-9 h-9 rounded bg-[#111827] border border-slate-700 flex items-center justify-center text-[#FFA000]">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{val.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Featured Leadership / Account Manager Profile */}
        <div className="p-8 rounded-xl bg-gradient-to-br from-[#0C111D] to-[#0A0D15] border border-[#2B3547] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative">
              <div className="w-56 h-56 rounded-lg overflow-hidden border-2 border-[#FFA000] shadow-xl">
                <img
                  src={ASSETS.ashleyElviraPortrait}
                  alt="Ashley Elvira - Account Manager & Cryptocurrency Analyst"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#000000] border border-[#FFA000] text-[#FFA000] font-mono text-[10px] uppercase font-bold px-3 py-0.5 rounded shadow-sm whitespace-nowrap">
                7+ YEARS TRADING EXP
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <div>
              <div className="text-xs font-mono text-[#FFA000] uppercase">KEY PERSONNEL PROFILE</div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">Ashley Elvira</h3>
              <div className="text-sm font-medium text-slate-300 mt-1">
                Account Manager · Cryptocurrency Analyst · Bitcoin & Forex Account Manager
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              Ashley Elvira is an Account Manager and Cryptocurrency Analyst associated with Crypto Hub Investments, focusing on client communication, cryptocurrency market analysis, portfolio support, and account management. With over 7 years of specialized trading and market analysis experience, Ashley coordinates customized client briefings and operational onboarding.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FFA000]" />
                <a href={`mailto:${COMPANY_DETAILS.accountManager.email}`} className="text-[#FFA000] hover:underline">
                  {COMPANY_DETAILS.accountManager.email}
                </a>
              </div>
              <span className="text-slate-600">·</span>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{COMPANY_DETAILS.location}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setAppointmentModalOpen(true)}
                className="px-5 py-2.5 text-xs font-bold text-black bg-[#FFA000] hover:bg-[#FFB300] rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule an Appointment</span>
              </button>

              <a
                href={COMPANY_DETAILS.accountManager.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 text-xs font-mono font-bold text-sky-300 hover:text-white bg-[#0088cc]/20 hover:bg-[#0088cc]/30 border border-[#0088cc]/50 rounded-lg transition-colors flex items-center gap-2"
              >
                <MessageCircle className="w-3.5 h-3.5 text-sky-400" />
                <span>Telegram: {COMPANY_DETAILS.accountManager.telegram}</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>

              <a
                href={`mailto:${COMPANY_DETAILS.accountManager.email}`}
                className="px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-[#111827] hover:bg-[#1E293B] border border-slate-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <Mail className="w-3.5 h-3.5 text-[#FFA000]" />
                <span>Email Directly</span>
              </a>
            </div>
          </div>
        </div>

        {/* Operating Address & Regulatory Note */}
        <div className="p-6 bg-[#080B10] border border-slate-800 rounded-md text-xs text-slate-400 space-y-2">
          <div className="font-semibold text-slate-200 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#FFA000]" />
            <span>Corporate Operating Notice</span>
          </div>
          <p className="leading-relaxed">
            Crypto Hub Investments maintains its primary business association in <strong className="text-slate-200">Massachusetts, United States</strong>. In strict compliance with transparency standards, we do not present unverified physical branch addresses. All direct inquiries are handled through our primary communication channel <span className="text-slate-200 font-mono">{COMPANY_DETAILS.primaryEmail}</span> and verified customer care desk <span className="text-slate-200 font-mono">{COMPANY_DETAILS.customerCareEmail}</span>.
          </p>
        </div>
      </div>
    </div>
  );
};
