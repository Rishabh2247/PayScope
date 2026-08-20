import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { RESOURCE_TOPICS } from '../../lib/resourceTopics';
import { Footer } from '../../components/layout/Footer';
import {
  BookOpen,
  ArrowRight,
  Calculator,
  Compass,
  FileText,
  HelpCircle,
  TrendingUp,
  Home,
  Fuel,
  MapPin,
  ShieldCheck,
  Search,
  DollarSign,
  Globe,
  Layers,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'PayScope Resources & Guides | Salary, Taxes, 1099, C2C & Cost of Living',
  description:
    'Comprehensive guides and calculators explaining W-2 vs 1099, C2C LLCs, Canadian T4 CPP/EI, Mexico SAT RESICO, Brazil Simples Nacional, and net take-home pay math.',
  keywords: [
    'salary calculator guide',
    'W-2 vs 1099 tax comparison',
    'C2C rate multiplier',
    'Canadian T4 CPP EI taxes',
    'Mexico RESICO SAT tax',
    'Brazil Simples Nacional PJ tax',
    'cost of living rent index',
  ],
  openGraph: {
    title: 'PayScope Resources & Financial Guides',
    description: 'Master your take-home pay, statutory taxes, contractor billing rates, and cost of living.',
    type: 'website',
    url: 'https://payscope.app/resources',
  },
  alternates: {
    canonical: 'https://payscope.app/resources',
  },
};

export default function ResourcesPage() {
  const jsonLdItemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'PayScope Financial & Tax Guides',
    itemListElement: RESOURCE_TOPICS.map((topic, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: topic.title,
      url: `https://payscope.app/resources/${topic.slug}`,
    })),
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#12372A]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdItemList) }}
      />

      {/* Navigation Header */}
      <header className="bg-white border-b border-[#BFE5D3] sticky top-0 z-40">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/assets/logo.png" alt="PayScope Logo" className="h-8 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="bg-[#1F8F68] hover:bg-[#176F52] text-white text-xs font-extrabold px-4 py-2 rounded-full shadow-xs transition-all flex items-center gap-1.5"
            >
              <span>📊 Open Live Calculator</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Hub Content */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#EAF7F1] border border-[#BFE5D3] rounded-full text-xs font-bold text-[#1F8F68]">
            <BookOpen className="w-4 h-4 text-[#1F8F68]" />
            <span>PayScope Knowledge & Tax Engineering Guides</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#12372A] tracking-tight leading-tight">
            Financial & Statutory Tax Guides <br />
            <span className="text-[#1F8F68]">Simplified for Everyone</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base font-medium max-w-2xl mx-auto leading-relaxed">
            In-depth explanations with real-world examples covering employee vs contractor taxes, 1099, C2C, Canadian T4/CPP/EI, Mexico SAT RESICO, Brazil PJ, and real purchasing power.
          </p>
        </section>

        {/* Featured Topic Cards Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-[#12372A] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#1F8F68]" />
              <span>Browse All Guides by Category</span>
            </h2>
            <span className="text-xs font-bold text-[#1F8F68] bg-[#EAF7F1] px-3 py-1 rounded-full border border-[#BFE5D3]">
              {RESOURCE_TOPICS.length} Individual Guides Available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {RESOURCE_TOPICS.map((topic) => (
              <article
                key={topic.slug}
                className="bg-white border border-[#BFE5D3] p-6 rounded-3xl space-y-4 shadow-2xs hover:border-[#1F8F68] hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="bg-[#F3FBF7] text-[#1F8F68] px-2.5 py-1 rounded-full border border-[#BFE5D3]/60">
                      {topic.category}
                    </span>
                    <span className="text-slate-400">{topic.readTime}</span>
                  </div>

                  <h3 className="text-lg font-extrabold text-[#12372A] group-hover:text-[#1F8F68] transition-colors leading-snug">
                    {topic.title}
                  </h3>

                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {topic.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#BFE5D3]/60">
                  <Link
                    href={`/resources/${topic.slug}`}
                    className="w-full bg-[#F3FBF7] hover:bg-[#1F8F68] text-[#1F8F68] hover:text-white border border-[#BFE5D3] hover:border-[#1F8F68] font-bold text-xs py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <span>Read Full Guide & Real Examples</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Global Tax Framework Quick Glossary */}
        <section className="bg-white border border-[#BFE5D3] p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-[#12372A] flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#1F8F68]" />
              <span>Global Country-Specific Statutory Reference Cheat-Sheet</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Quick reference definitions for United States (IRS), Canada (CRA), Mexico (SAT), and Brazil (Receita Federal).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="bg-[#F3FBF7] p-4 rounded-2xl border border-[#BFE5D3]/60 space-y-2">
              <p className="font-extrabold text-[#1F8F68] uppercase tracking-wider text-[11px]">🇺🇸 United States</p>
              <p className="font-bold text-[#12372A]">W-2 vs 1099 vs C2C</p>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                W-2 splits 15.3% FICA with employer. 1099 pays full 15.3% SE tax on 92.35% of profit. C2C LLC allows write-offs & S-Corp salary distributions.
              </p>
            </div>

            <div className="bg-[#F3FBF7] p-4 rounded-2xl border border-[#BFE5D3]/60 space-y-2">
              <p className="font-extrabold text-[#1F8F68] uppercase tracking-wider text-[11px]">🇨🇦 Canada</p>
              <p className="font-bold text-[#12372A]">T4, CPP & EI Caps</p>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                T4 Employees pay 5.95% CPP up to $71,300 + CPP2 4.0% cap ($76,000) & EI 1.64% ($65,700 max). Sole Proprietors pay 11.9% double CPP.
              </p>
            </div>

            <div className="bg-[#F3FBF7] p-4 rounded-2xl border border-[#BFE5D3]/60 space-y-2">
              <p className="font-extrabold text-[#1F8F68] uppercase tracking-wider text-[11px]">🇲🇽 Mexico</p>
              <p className="font-bold text-[#12372A]">RESICO 1.0% - 2.5% Flat Tax</p>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                RESICO (Simplificado de Confianza) taxes gross revenue up to $3.5M MXN at only 1.0% to 2.5% flat ISR compared to 35% employee ISR.
              </p>
            </div>

            <div className="bg-[#F3FBF7] p-4 rounded-2xl border border-[#BFE5D3]/60 space-y-2">
              <p className="font-extrabold text-[#1F8F68] uppercase tracking-wider text-[11px]">🇧🇷 Brazil</p>
              <p className="font-bold text-[#12372A]">PJ Simples Nacional (Annex III)</p>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                PJ corporate contractors pay 6% Simples Nacional Annex III tax using 28% Fator R Pró-labore instead of 27.5% CLT employee IRPF.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
