import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CryptoNewsArticle } from '../../types';
import {
  Newspaper,
  Calendar,
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Tag,
  BookOpen,
} from 'lucide-react';

export const CryptoNewsView: React.FC = () => {
  const { newsArticles } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedArticle, setSelectedArticle] = useState<CryptoNewsArticle | null>(null);

  const categories = [
    'All',
    'Institutional Adoption',
    'Regulation',
    'Bitcoin',
    'Ethereum',
    'Technology',
    'Market Updates',
  ];

  const filteredArticles = newsArticles.filter((article) => {
    if (selectedCategory === 'All') return true;
    return article.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0A0E17] border border-[#1E293B] rounded-xl p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-[#FFA000] uppercase font-semibold">
            INSTITUTIONAL MARKET INTELLIGENCE
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
            Crypto News & Macro Insights
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Curated on-chain data, regulatory briefings, and global cryptocurrency market developments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            LIVE WIRE ACTIVE
          </span>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer shrink-0 ${
              selectedCategory === cat
                ? 'bg-[#FFA000] text-black font-bold shadow-sm'
                : 'bg-[#0B0F19] text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            onClick={() => setSelectedArticle(article)}
            className="bg-[#0B0F19] border border-[#1E293B] hover:border-[#FFA000]/50 rounded-xl p-5 flex flex-col justify-between space-y-4 transition-all hover:shadow-xl cursor-pointer group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-[#FFA000] border border-slate-700 font-medium">
                  {article.category}
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {article.readTime}
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#FFA000] transition-colors leading-snug">
                {article.headline}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                {article.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-200">{article.source}</span>
                <span>·</span>
                <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
              </div>
              <span className="text-[#FFA000] flex items-center gap-1 font-semibold group-hover:translate-x-1 transition-transform">
                Read Brief →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Article Detail Lightbox */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#0B0F19] border border-[#1E293B] rounded-xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-[#1E293B] flex items-start justify-between bg-[#0D1424]">
              <div className="space-y-1 pr-4">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="px-2 py-0.5 rounded bg-[#FFA000]/15 text-[#FFA000] border border-[#FFA000]/30 font-bold">
                    {selectedArticle.category}
                  </span>
                  <span className="text-slate-400">{selectedArticle.source}</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-400">{new Date(selectedArticle.publishedAt).toLocaleDateString()}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight pt-1 leading-snug">
                  {selectedArticle.headline}
                </h2>
              </div>

              <button
                onClick={() => setSelectedArticle(null)}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-slate-200 leading-relaxed text-sm">
              <div className="p-4 bg-[#080C14] border border-slate-800 rounded-lg text-xs sm:text-sm text-[#FFA000]/90 font-medium italic">
                "{selectedArticle.summary}"
              </div>

              <div className="space-y-3 pt-2 text-xs sm:text-sm leading-relaxed text-slate-300">
                <p>
                  {selectedArticle.content || selectedArticle.summary}
                </p>
                <p>
                  Market liquidity analysis and institutional order flow indicate growing demand for segregated, cold-custody asset structures over speculative leveraged instruments. Investment advisors emphasize portfolio rebalancing benchmarks and multi-factor validation for digital wealth preservation.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#1E293B] bg-[#080C14] flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Source: {selectedArticle.source}</span>
              {selectedArticle.url && (
                <a
                  href={selectedArticle.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-xs font-bold text-black bg-[#FFA000] hover:bg-[#FFB300] rounded transition-colors flex items-center gap-1.5"
                >
                  <span>Visit Publisher</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
