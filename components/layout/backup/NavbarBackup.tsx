'use client';

import React, { useState } from 'react';
import { CountryCode, CurrencyCode } from '../../../lib/types';
import { SupportedLanguage, useTranslation } from '../../../lib/i18n';
import {
  Users,
  Briefcase,
  Menu,
  X,
  Globe,
  ChevronDown,
  LayoutDashboard,
  Search,
  Calculator,
  FileText,
  Languages,
} from 'lucide-react';

export interface NavbarProps {
  country: CountryCode;
  currency: CurrencyCode;
  language?: SupportedLanguage;
  onCountryChange: (country: CountryCode) => void;
  onCurrencyChange: (currency: CurrencyCode) => void;
  onLanguageChange?: (lang: SupportedLanguage) => void;
  activeView: 'hero' | 'dashboard';
  onSwitchView: (view: 'hero' | 'dashboard') => void;
  onReset: () => void;

  // Recruiter Mode Props
  productMode?: 'payscope' | 'recruiting';
  onProductModeChange?: (mode: 'payscope' | 'recruiting') => void;
  recruiterTab?: string;
  onRecruiterTabChange?: (tab: string) => void;
}

export const NavbarBackup: React.FC<NavbarProps> = ({
  country,
  currency,
  language = 'en',
  onCountryChange,
  onCurrencyChange,
  onLanguageChange = () => {},
  activeView,
  onSwitchView,
  onReset,
  productMode = 'payscope',
  onProductModeChange = () => {},
  recruiterTab = 'dashboard',
  onRecruiterTabChange = () => {},
}) => {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<'country' | 'currency' | 'language' | null>(null);

  const recruiterNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'search', label: 'Candidate Search', icon: Search },
    { id: 'jobs', label: 'Jobs & Pipeline', icon: Briefcase },
    { id: 'rate', label: 'Rate & Margin', icon: Calculator },
    { id: 'reports', label: 'Reports & PDF', icon: FileText },
  ];

  const countryFlags: Record<CountryCode, { flag: string; label: string }> = {
    US: { flag: '🇺🇸', label: 'United States' },
    CA: { flag: '🇨🇦', label: 'Canada' },
    MX: { flag: '🇲🇽', label: 'Mexico' },
    BR: { flag: '🇧🇷', label: 'Brazil' },
  };

  const handleToggleDropdown = (name: 'country' | 'currency' | 'language') => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo Header */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div
            className="flex items-center gap-2 cursor-pointer py-1"
            onClick={() => onSwitchView('hero')}
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <img
                  src={productMode === 'recruiting' ? '/assets/payscope-recruit-logo.png' : '/assets/logo.png'}
                  alt="PayScope Logo"
                  className="h-8 sm:h-10 md:h-12 w-auto object-contain"
                />
              </div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 tracking-wide -mt-0.5 hidden md:inline">
                {productMode === 'recruiting'
                  ? t.recruitSubtitle
                  : t.knowIncomeWorth}
              </span>
            </div>
          </div>

          {/* Desktop Product Mode Switcher */}
          <div className="hidden sm:flex bg-slate-100 p-1 rounded-xl items-center border border-slate-200/80 shadow-inner">
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
              <Briefcase className="w-3.5 h-3.5" />
              <span>PayScope Recruit</span>
            </button>
          </div>
        </div>

        {/* Right Desktop Controls & Mobile Hamburger Trigger */}
        <div className="flex items-center gap-2">
          {/* 1. Country Selector (Bigger, Touch-Friendly) */}
          <div className="relative">
            <button
              onClick={() => handleToggleDropdown('country')}
              className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-800 transition-colors cursor-pointer shadow-2xs"
            >
              <span className="text-base">{countryFlags[country]?.flag}</span>
              <span className="inline-block">{country}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {openDropdown === 'country' && (
              <div className="absolute right-0 mt-1.5 w-40 bg-white border border-slate-200 rounded-2xl shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95">
                {(['US', 'CA', 'MX', 'BR'] as CountryCode[]).map((cCode) => (
                  <button
                    key={cCode}
                    onClick={() => {
                      onCountryChange(cCode);
                      setOpenDropdown(null);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors ${
                      country === cCode ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'
                    }`}
                  >
                    <span className="text-base">{countryFlags[cCode].flag}</span>
                    <span>{countryFlags[cCode].label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Currency Selector (Independent & Touch-Friendly) */}
          <div className="relative">
            <button
              onClick={() => handleToggleDropdown('currency')}
              className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-800 transition-colors cursor-pointer shadow-2xs"
            >
              <span>{currency}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {openDropdown === 'currency' && (
              <div className="absolute right-0 mt-1.5 w-32 bg-white border border-slate-200 rounded-2xl shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95">
                {(['USD', 'CAD', 'MXN', 'BRL'] as CurrencyCode[]).map((cur) => (
                  <button
                    key={cur}
                    onClick={() => {
                      onCurrencyChange(cur);
                      setOpenDropdown(null);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm font-bold hover:bg-slate-50 transition-colors ${
                      currency === cur ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'
                    }`}
                  >
                    {cur}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 3. Language Selector (EN, ES, PT) */}
          <div className="relative">
            <button
              onClick={() => handleToggleDropdown('language')}
              className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold transition-colors cursor-pointer shadow-2xs"
            >
              <Languages className="w-4 h-4 text-indigo-600" />
              <span className="uppercase">{language}</span>
              <ChevronDown className="w-3.5 h-3.5 text-indigo-400" />
            </button>

            {openDropdown === 'language' && (
              <div className="absolute right-0 mt-1.5 w-36 bg-white border border-slate-200 rounded-2xl shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95">
                <button
                  onClick={() => {
                    onLanguageChange('en');
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm font-bold flex items-center gap-2 hover:bg-slate-50 ${
                    language === 'en' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'
                  }`}
                >
                  <span>🇺🇸</span> English (EN)
                </button>
                <button
                  onClick={() => {
                    onLanguageChange('es');
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm font-bold flex items-center gap-2 hover:bg-slate-50 ${
                    language === 'es' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'
                  }`}
                >
                  <span>🇲🇽</span> Español (ES)
                </button>
                <button
                  onClick={() => {
                    onLanguageChange('pt');
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm font-bold flex items-center gap-2 hover:bg-slate-50 ${
                    language === 'pt' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'
                  }`}
                >
                  <span>🇧🇷</span> Português (PT)
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button Trigger (< 1024px) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Out Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col justify-start">
          <div className="bg-white border-b border-slate-200 p-5 space-y-4 shadow-2xl animate-in slide-in-from-top duration-200">
            <div className="flex items-center justify-between pb-3 border-b">
              <div className="flex items-center gap-2">
                <img
                  src={productMode === 'recruiting' ? '/assets/payscope-recruit-logo.png' : '/assets/logo.png'}
                  alt="PayScope Logo"
                  className="h-9 w-auto object-contain"
                />
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Country, Currency & Language Touch Controls */}
            <div className="grid grid-cols-3 gap-2 text-xs font-bold pt-1">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{t.country}</label>
                <select
                  value={country}
                  onChange={(e) => onCountryChange(e.target.value as CountryCode)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold text-slate-800"
                >
                  <option value="US">🇺🇸 US</option>
                  <option value="CA">🇨🇦 CA</option>
                  <option value="MX">🇲🇽 MX</option>
                  <option value="BR">🇧🇷 BR</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{t.currency}</label>
                <select
                  value={currency}
                  onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold text-slate-800"
                >
                  <option value="USD">USD ($)</option>
                  <option value="CAD">CAD (CA$)</option>
                  <option value="MXN">MXN (MX$)</option>
                  <option value="BRL">BRL (R$)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{t.language}</label>
                <select
                  value={language}
                  onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
                  className="w-full bg-indigo-50 border border-indigo-200 rounded-xl p-2 font-bold text-indigo-800 uppercase"
                >
                  <option value="en">EN</option>
                  <option value="es">ES</option>
                  <option value="pt">PT</option>
                </select>
              </div>
            </div>

            {/* Mobile Platform Mode Switcher */}
            <div className="space-y-1.5 pt-2 border-t">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Platform Mode</span>
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => {
                    onProductModeChange('payscope');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 ${
                    productMode === 'payscope' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>PayScope</span>
                </button>
                <button
                  onClick={() => {
                    onProductModeChange('recruiting');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 ${
                    productMode === 'recruiting' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>PayScope Recruit</span>
                </button>
              </div>
            </div>

            {/* Mobile Recruiter Tab Links */}
            {productMode === 'recruiting' && (
              <div className="space-y-1.5 pt-2 border-t">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Workspace Navigation</span>
                <div className="space-y-1">
                  {recruiterNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = recruiterTab === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onRecruiterTabChange(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          isActive
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
