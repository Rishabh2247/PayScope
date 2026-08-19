'use client';

import React from 'react';
import Link from 'next/link';
import { Database } from 'lucide-react';
import { useTranslation } from '../../lib/i18n';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  const dataSources = [
    { name: 'Canada Revenue Agency (CRA)', label: '2025/2026 Statutory Tax Schedules', flag: '🇨🇦' },
    { name: 'Internal Revenue Service (IRS)', label: 'Federal & State Income Tax Schedules', flag: '🇺🇸' },
    { name: 'Ontario Ministry of Finance', label: 'Provincial Tax Brackets & SBD Corp Tax', flag: '🏛️' },
    { name: 'Statistics Canada', label: 'Regional Consumer Price Index & Benchmark Income', flag: '📊' },
    { name: 'U.S. Energy Information Admin (EIA)', label: 'Live Gasoline & Diesel Feed', flag: '⛽' },
    { name: 'Zillow Research & Rentals.ca', label: 'Housing Rent & Mortgage Indices', flag: '🏠' },
    { name: 'U.S. Bureau of Labor Statistics (BLS)', label: 'Regional Cost of Living Data', flag: '📈' },
    { name: 'Receita Federal do Brasil', label: 'CLT & PJ Tax Schedules', flag: '🇧🇷' },
    { name: 'Servicio de Administración Tributaria (SAT)', label: 'Resico & ISR Tax Schedules', flag: '🇲🇽' },
  ];

  return (
    <footer className="bg-white border-t border-slate-200/80 pt-8 pb-8 mt-auto overflow-hidden">
      {/* Light Whitish-Grey Single-Line Slow Moving Marquee Ticker */}
      <div className="bg-slate-100/70 text-slate-700 py-3 border-y border-slate-200/60 mb-8 overflow-hidden relative">
        <div className="max-w-[1440px] mx-auto px-4 flex items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-700">
            <Database className="w-3.5 h-3.5 text-indigo-600" />
            <span>{t.officialDataSources}</span>
          </div>
          <span className="text-[10px] font-semibold text-slate-500 hidden sm:inline-block">
            {t.verifiedFeeds}
          </span>
        </div>

        {/* Single-Line Slow Moving Marquee */}
        <div className="w-full overflow-hidden flex">
          <div className="animate-marquee-slow flex items-center gap-3">
            {[...dataSources, ...dataSources].map((source, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 bg-white/90 border border-slate-200/80 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-2xs whitespace-nowrap shrink-0"
              >
                <span>{source.flag}</span>
                <span className="font-bold text-slate-800">{source.name}</span>
                <span className="text-slate-300">•</span>
                <span className="text-[11px] text-slate-500 font-medium">{source.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-100">
          {/* Brand & Motto */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <img
                src="/assets/logo.png"
                alt="PayScope Logo"
                className="h-7 sm:h-8 md:h-9 w-auto object-contain"
              />
            </div>
            <p className="text-xs font-semibold text-slate-700">PayScope</p>
            <p className="text-xs text-slate-500 font-medium">{t.knowIncomeWorth}</p>
          </div>

          {/* Main Navigation */}
          <div className="space-y-2 text-xs">
            <p className="font-bold text-slate-900 uppercase tracking-wider">{t.quickLinks}</p>
            <ul className="space-y-1.5 text-slate-600 font-medium">
              <li>
                <Link href="/" className="hover:text-indigo-600 transition-colors">
                  Calculator & Hero
                </Link>
              </li>
              <li>
                <Link href="/dashboard/overview" className="hover:text-indigo-600 transition-colors">
                  Financial Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/tax-engine" className="hover:text-indigo-600 transition-colors">
                  Tax Engine
                </Link>
              </li>
              <li>
                <Link href="/dashboard/housing" className="hover:text-indigo-600 transition-colors">
                  Housing Benchmark
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-indigo-600 transition-colors">
                  Financial Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Pages */}
          <div className="space-y-2 text-xs">
            <p className="font-bold text-slate-900 uppercase tracking-wider">{t.legal}</p>
            <ul className="space-y-1.5 text-slate-600 font-medium">
              <li>
                <Link href="/disclaimer" className="hover:text-indigo-600 transition-colors font-bold text-indigo-600">
                  Disclaimer Notice
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-indigo-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-indigo-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="hover:text-indigo-600 transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-indigo-600 transition-colors">
                  About PayScope
                </Link>
              </li>
            </ul>
          </div>

          {/* Copyright & Disclaimer Note */}
          <div className="space-y-2 text-xs">
            <p className="font-bold text-slate-900 uppercase tracking-wider">Compliance & Notice</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              PayScope provides estimated financial insights for educational purposes only. PayScope is not a licensed tax advisor or financial planner.
            </p>
            <p className="text-[11px] font-bold text-slate-400 pt-1">
              © {new Date().getFullYear()} PayScope. {t.allRightsReserved}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
