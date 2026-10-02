import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { COMPANY_DETAILS } from '../../constants/assets';

export const FaqView: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is Crypto Hub Investments?',
      a: 'Crypto Hub Investments is a digital-asset and financial-technology platform concept focused on cryptocurrency market analysis, Bitcoin services, portfolio management, investor education, client account management, market research, and client support.',
    },
    {
      q: 'Where is Crypto Hub Investments based?',
      a: `Crypto Hub Investments maintains its primary business association in Massachusetts, United States. In strict accordance with our transparency guidelines, we do not invent a physical corporate address and provide verified contact via ${COMPANY_DETAILS.primaryEmail}.`,
    },
    {
      q: 'Who is Ashley Elvira and what is her role?',
      a: `Ashley Elvira is an Account Manager and Cryptocurrency Analyst associated with Crypto Hub Investments, focusing on client communication, cryptocurrency market analysis, portfolio support, and account management. She brings more than 7 years of specialized trading and market analysis experience to assist our clients. She can be reached directly at ${COMPANY_DETAILS.accountManager.email}.`,
    },
    {
      q: 'Are returns or investment profits guaranteed?',
      a: 'No. Crypto Hub Investments strictly adheres to responsible investment practices: digital-asset and forex markets involve significant risk and volatility. The value of investments can rise or fall, and clients may lose some or all of their capital. We never make speculative profit guarantees.',
    },
    {
      q: 'How are client digital assets custodied?',
      a: 'Client digital assets are stored in institutional multi-signature cold vaults featuring air-gapped cryptographic hardware security modules (HSMs). Keys are geographically dispersed to prevent any single point of failure.',
    },
    {
      q: 'How does client support and account management work?',
      a: `Clients are assigned a dedicated professional Account Manager for one-on-one communication and strategy reviews. For platform assistance and general technical inquiries, our customer care desk is reachable at ${COMPANY_DETAILS.customerCareEmail}.`,
    },
  ];

  return (
    <div className="py-12 bg-[#000000] text-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="space-y-3 text-center sm:text-left">
          <div className="text-xs font-mono text-[#FFA000] tracking-wider uppercase">
            COMMONLY ASKED QUESTIONS
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-300 text-base leading-relaxed">
            Essential facts regarding our platform architecture, custodial philosophy, and client support.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.q}
                className="bg-[#0B0F19] border border-[#1E293B] rounded-lg overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#111827]"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-[#FFA000] shrink-0" />
                    <span className="font-semibold text-white text-base">{faq.q}</span>
                  </div>
                  <span className="text-slate-400">
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 bg-[#080B11]">
                    {faq.a}
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
