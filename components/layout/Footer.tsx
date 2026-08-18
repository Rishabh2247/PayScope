'use client';

import React from 'react';
import Link from 'next/link';
import { Database } from 'lucide-react';

export const Footer: React.FC = () => {
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
      {/* Transparent Light Grey Stationary Data Sources Watermark Ticker */}
      <div className="bg-slate-100/90 text-slate-700 py-3.5 border-y border-slate-200/80 mb-8 overflow-hidden relative">
        <div className="max-w-[1440px] mx-auto px-4 flex items-center justify-between gap-4 mb-2.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-700">
            <Database className="w-3.5 h-3.5 text-indigo-600" />
            <span>Official Data Sources & Information Providers</span>
          </div>
          <span className="text-[10px] font-semibold text-slate-500 hidden sm:inline-block">
            Verified 2025/2026 Statutory & Economic Feeds
          </span>
        </div>

        {/* Stationary Transparent Light Grey Grid Badge Bar */}
        <div className="max-w-[1440px] mx-auto px-4 flex flex-wrap items-center gap-2">
          {dataSources.map((source, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1.5 bg-white/80 border border-slate-200 px-3 py-1 rounded-full text-xs font-semibold shadow-2xs"
            >
              <span>{source.flag}</span>
              <span className="font-bold text-slate-800">{source.name}</span>
              <span className="text-slate-300">•</span>
              <span className="text-[11px] text-slate-500 font-medium">{source.label}</span>
            </div>
          ))}
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
                className="h-14 sm:h-16 w-auto object-contain mix-blend-multiply"
              />
            </div>
            <p className="text-xs font-semibold text-slate-700">PayScope</p>
            <p className="text-xs text-slate-500 font-medium">Know what your income is really worth.</p>
          </div>

          {/* Main Navigation */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">Navigation</p>
            <ul className="space-y-1.5 text-xs font-semibold text-slate-600">
              <li>
                <Link href="/" className="hover:text-indigo-600 transition-colors">
                  Calculators
                </Link>
              </li>
              <li>
                <Link href="/dashboard/tax-engine" className="hover:text-indigo-600 transition-colors">
                  Tools
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-indigo-600 transition-colors">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-indigo-600 transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">Legal</p>
            <ul className="space-y-1.5 text-xs font-semibold text-slate-600">
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
                <Link href="/disclaimer" className="hover:text-indigo-600 transition-colors">
                  Financial Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="hover:text-indigo-600 transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">Contact</p>
            <p className="text-xs font-medium text-slate-600">Questions or support?</p>
            <a
              href="mailto:support@payscope.com"
              className="inline-block text-xs font-bold text-indigo-600 hover:text-indigo-700"
            >
              support@payscope.com
            </a>
          </div>
        </div>

        {/* Copyright & Disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© 2026 PayScope. All rights reserved. Built independently in Lucknow, India.</p>
          <p className="text-[11px] text-slate-400 text-center sm:text-right">
            Estimates provided for informational purposes only. See our{' '}
            <Link href="/disclaimer" className="underline hover:text-slate-600">
              Financial Disclaimer
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
};
