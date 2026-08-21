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
    <footer className="bg-white dark:bg-[#080B09] border-t border-slate-200/80 dark:border-[#26302A] pt-8 pb-8 mt-auto overflow-hidden transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-100 dark:border-[#26302A]">
          {/* Brand & Motto */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <img
                src="/assets/logo.png"
                alt="PayScope Logo"
                className="h-7 sm:h-8 md:h-9 w-auto object-contain dark:brightness-110"
              />
            </div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">PayScope</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.knowIncomeWorth}</p>
          </div>

          {/* Main Navigation */}
          <div className="space-y-2 text-xs">
            <h3 className="font-black text-slate-900 dark:text-[#F9FAFB] uppercase tracking-wider text-xs footer-title">{t.quickLinks}</h3>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-300 font-medium">
              <li>
                <Link href="/" className="hover:text-emerald-600 dark:hover:text-[#22C55E] transition-colors">
                  Calculator & Hero
                </Link>
              </li>
              <li>
                <Link href="/dashboard/overview" className="hover:text-emerald-600 dark:hover:text-[#22C55E] transition-colors">
                  Financial Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/tax-engine" className="hover:text-emerald-600 dark:hover:text-[#22C55E] transition-colors">
                  Tax Engine
                </Link>
              </li>
              <li>
                <Link href="/dashboard/housing" className="hover:text-emerald-600 dark:hover:text-[#22C55E] transition-colors">
                  Housing Benchmark
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-emerald-600 dark:hover:text-[#22C55E] transition-colors">
                  Financial Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Pages */}
          <div className="space-y-2 text-xs">
            <h3 className="font-black text-slate-900 dark:text-[#F9FAFB] uppercase tracking-wider text-xs footer-title">{t.legal}</h3>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-300 font-medium">
              <li>
                <Link href="/disclaimer" className="hover:text-emerald-600 dark:hover:text-[#22C55E] transition-colors font-bold text-emerald-600 dark:text-[#22C55E]">
                  Disclaimer Notice
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-emerald-600 dark:hover:text-[#22C55E] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-emerald-600 dark:hover:text-[#22C55E] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="hover:text-emerald-600 dark:hover:text-[#22C55E] transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Modes & Recruiter Platform */}
          <div className="space-y-2 text-xs">
            <h3 className="font-black text-slate-900 dark:text-[#F9FAFB] uppercase tracking-wider text-xs footer-title">Financial Platform</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-300 leading-relaxed font-normal">
              Empowering employees, remote contractors, and talent teams across the Americas with statutory tax algorithms and purchasing power benchmarks.
            </p>
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-400 pt-1">
              © {new Date().getFullYear()} PayScope. {t.allRightsReserved}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
