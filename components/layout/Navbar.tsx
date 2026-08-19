'use client';

import React from 'react';
import Link from 'next/link';
import { CountryCode, CurrencyCode } from '../../lib/types';
import { ChevronDown, Globe, RefreshCw, UserCheck, Users } from 'lucide-react';

interface NavbarProps {
  country: CountryCode;
  currency: CurrencyCode;
  onCountryChange: (country: CountryCode) => void;
  onCurrencyChange: (currency: CurrencyCode) => void;
  activeView: 'hero' | 'dashboard';
  onSwitchView: (view: 'hero' | 'dashboard') => void;
  onReset: () => void;
  productMode?: 'payscope' | 'recruiting';
  onProductModeChange?: (mode: 'payscope' | 'recruiting') => void;
  recruiterTab?: string;
  onRecruiterTabChange?: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  country,
  currency,
  onCountryChange,
  onCurrencyChange,
  activeView,
  onSwitchView,
  onReset,
  productMode = 'payscope',
  onProductModeChange = () => {},
  recruiterTab = 'calculator',
  onRecruiterTabChange,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-4">
        {/* Brand Logo & Mode Toggle */}
        <div className="flex items-center gap-4">
          <div
            className="flex items-center gap-3 cursor-pointer py-1"
            onClick={() => onSwitchView('hero')}
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <img
                  src="/assets/logo.png"
                  alt="PayScope Logo"
                  className="h-7 sm:h-8 md:h-9 w-auto object-contain"
                />
                {productMode === 'recruiting' && (
                  <span className="bg-indigo-600 text-white font-black text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs animate-in fade-in">
                    RECRUIT
                  </span>
                )}
              </div>
              <span className="text-[11px] font-semibold text-slate-500 tracking-wide -mt-1 hidden sm:inline">
                {productMode === 'recruiting'
                  ? 'Built for recruiters, staffing agencies & talent teams.'
                  : 'Know what your income is really worth.'}
              </span>
            </div>
          </div>

          {/* Product Mode Toggle Switch */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200/80 shadow-inner">
            <button
              onClick={() => onProductModeChange('payscope')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                productMode === 'payscope'
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>PayScope</span>
            </button>
            <button
              onClick={() => onProductModeChange('recruiting')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                productMode === 'recruiting'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>PayScope Recruit</span>
            </button>
          </div>
        </div>

        {/* Dynamic Navigation Links based on Mode */}
        {productMode === 'payscope' ? (
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a
              onClick={() => onSwitchView('hero')}
              className={`hover:text-indigo-600 transition-colors cursor-pointer ${
                activeView === 'hero' ? 'text-indigo-600 font-bold' : ''
              }`}
            >
              Calculators
            </a>
            <a
              onClick={() => onSwitchView('dashboard')}
              className={`hover:text-indigo-600 transition-colors cursor-pointer ${
                activeView === 'dashboard' ? 'text-indigo-600 font-bold' : ''
              }`}
            >
              Tools
            </a>
            <Link href="/resources" className="hover:text-indigo-600 transition-colors">
              Resources
            </Link>
            <Link href="/about" className="hover:text-indigo-600 transition-colors">
              About
            </Link>
          </nav>
        ) : (
          <nav className="hidden xl:flex items-center gap-6 text-xs font-bold text-slate-600">
            <button
              onClick={() => onRecruiterTabChange?.('dashboard')}
              className={`hover:text-indigo-600 transition-colors ${
                recruiterTab === 'dashboard' ? 'text-indigo-600 font-black border-b-2 border-indigo-600 pb-1' : ''
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onRecruiterTabChange?.('search')}
              className={`hover:text-indigo-600 transition-colors ${
                recruiterTab === 'search' ? 'text-indigo-600 font-black border-b-2 border-indigo-600 pb-1' : ''
              }`}
            >
              Search Candidates
            </button>
            <button
              onClick={() => onRecruiterTabChange?.('jobs')}
              className={`hover:text-indigo-600 transition-colors ${
                recruiterTab === 'jobs' ? 'text-indigo-600 font-black border-b-2 border-indigo-600 pb-1' : ''
              }`}
            >
              Jobs
            </button>
            <button
              onClick={() => onRecruiterTabChange?.('rate')}
              className={`hover:text-indigo-600 transition-colors ${
                recruiterTab === 'rate' ? 'text-indigo-600 font-black border-b-2 border-indigo-600 pb-1' : ''
              }`}
            >
              Rate & Margin
            </button>
            <button
              onClick={() => onRecruiterTabChange?.('reports')}
              className={`hover:text-indigo-600 transition-colors ${
                recruiterTab === 'reports' ? 'text-indigo-600 font-black border-b-2 border-indigo-600 pb-1' : ''
              }`}
            >
              Reports
            </button>
          </nav>
        )}

        {/* Selectors & CTA */}
        <div className="flex items-center gap-3">
          {/* Country Selector */}
          <div className="relative group">
            <div className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-700 cursor-pointer transition-all">
              <Globe className="w-4 h-4 text-slate-500" />
              <span>
                {country === 'US' && '🇺🇸 United States'}
                {country === 'CA' && '🇨🇦 Canada'}
                {country === 'MX' && '🇲🇽 Mexico'}
                {country === 'BR' && '🇧🇷 Brazil'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <select
              value={country}
              onChange={(e) => onCountryChange(e.target.value as CountryCode)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            >
              <option value="US">🇺🇸 United States</option>
              <option value="CA">🇨🇦 Canada</option>
              <option value="MX">🇲🇽 Mexico</option>
              <option value="BR">🇧🇷 Brazil</option>
            </select>
          </div>

          {/* Currency Selector */}
          <div className="relative group hidden sm:block">
            <div className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-700 cursor-pointer transition-all">
              <span>
                {currency === 'USD' && 'USD – US Dollar'}
                {currency === 'CAD' && 'CAD – CA Dollar'}
                {currency === 'MXN' && 'MXN – MX Peso'}
                {currency === 'BRL' && 'BRL – BR Real'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <select
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            >
              <option value="USD">USD – US Dollar</option>
              <option value="CAD">CAD – CA Dollar</option>
              <option value="MXN">MXN – MX Peso</option>
              <option value="BRL">BRL – BR Real</option>
            </select>
          </div>

          {/* Switch/Reset Button when on Dashboard */}
          {activeView === 'dashboard' && productMode === 'payscope' && (
            <button
              onClick={onReset}
              className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold px-4 py-2 rounded-xl text-xs transition-colors border border-indigo-200/60"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>New Calculation</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
