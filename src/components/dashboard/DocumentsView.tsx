import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, Download, Eye, ShieldCheck, X, Calendar } from 'lucide-react';
import { DocumentRecord } from '../../types';

export const DocumentsView: React.FC = () => {
  const { documents, showNotification } = useApp();
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(null);

  const handleDownload = (doc: DocumentRecord) => {
    showNotification(`Downloading certified document: ${doc.title} (${doc.fileSize})`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0A0E17] border border-[#1E293B] rounded-lg p-5">
        <div>
          <div className="text-xs font-mono text-[#FFA000] uppercase font-semibold">
            DOCUMENT REPOSITORY & AUDITED STATEMENTS
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
            Verified Account Records & Reports
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Certified monthly statements, tax transaction logs, and regulatory disclosures.
          </p>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-[#0B0F19] border border-[#1F2937] rounded-lg p-6 space-y-4">
        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="p-4 bg-[#080B11] border border-slate-800 hover:border-slate-700 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded bg-[#111827] border border-slate-700 flex items-center justify-center text-[#FFA000] shrink-0 mt-0.5">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                      {doc.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{doc.date}</span>
                    <span className="text-xs text-slate-400 font-mono">· {doc.fileSize}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{doc.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">{doc.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  onClick={() => setSelectedDoc(doc)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-200 bg-[#111827] hover:bg-[#1E293B] border border-slate-700 rounded flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </button>
                <button
                  onClick={() => handleDownload(doc)}
                  className="px-3 py-1.5 text-xs font-bold text-black bg-[#FFA000] hover:bg-[#FFB300] rounded flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Document Inspector Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#0B0F19] border border-[#2B3547] rounded-xl max-w-2xl w-full p-6 sm:p-8 space-y-5 relative shadow-2xl">
            <button
              onClick={() => setSelectedDoc(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="text-xs font-mono text-[#FFA000] uppercase font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>CRYPTOGRAPHICALLY VERIFIED RECORD</span>
              </div>
              <h2 className="text-xl font-bold text-white">{selectedDoc.title}</h2>
              <div className="text-xs font-mono text-slate-400">
                Category: {selectedDoc.category} · Certified Date: {selectedDoc.date} · File: {selectedDoc.format} ({selectedDoc.fileSize})
              </div>
            </div>

            {/* Document simulated content preview */}
            <div className="p-5 bg-[#080B11] border border-slate-800 rounded text-xs font-mono text-slate-300 space-y-3 leading-relaxed">
              <div className="border-b border-slate-800 pb-2 flex justify-between text-slate-400">
                <span>ISSUER: CRYPTO HUB INVESTMENTS</span>
                <span>JURISDICTION: MASSACHUSETTS, US</span>
              </div>
              <p>
                This electronic document represents an immutable record generated by the Crypto Hub Investments custodial management platform for Marcus Vance (Account #CHI-8849-9210-MV).
              </p>
              <p>
                Summary of Certified Positions:
                <br />· Sovereign Store of Value: 1.1500 BTC (Multi-Signature Segregated Vault)
                <br />· Smart Contract Infrastructure: 14.1800 ETH & 64.8000 SOL
                <br />· Verified Cash Reserves: $12,570.76 USD
                <br />· Total Audited Asset Value: $148,250.00 USD
              </p>
              <p className="text-slate-400 pt-2 border-t border-slate-800 text-[10px]">
                SHA-256 Digest: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  handleDownload(selectedDoc);
                  setSelectedDoc(null);
                }}
                className="px-5 py-2 text-xs font-bold text-black bg-[#FFA000] hover:bg-[#FFB300] rounded transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Certified Copy</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
