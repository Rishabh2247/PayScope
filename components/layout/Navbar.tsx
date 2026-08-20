'use client';

import React, { useState } from 'react';
import { CountryCode, CurrencyCode } from '../../lib/types';
import { SupportedLanguage, useTranslation } from '../../lib/i18n';
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

export const Navbar: React.FC<NavbarProps> = ({
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
  const [openDropdown, setOpenDropdown] = useState<'currency' | 'language' | null>(null);

  const countryFlags: Record<CountryCode, { flag: string; label: string }> = {
    US: { flag: '🇺🇸', label: 'United States' },
    CA: { flag: '🇨🇦', label: 'Canada' },
    MX: { flag: '🇲🇽', label: 'Mexico' },
    BR: { flag: '🇧🇷', label: 'Brazil' },
  };

  const currencyMap: Record<CurrencyCode, { emoji: string; code: CurrencyCode; label: string }> = {
    USD: { emoji: '💵', code: 'USD', label: 'USD ($)' },
    CAD: { emoji: '🇨🇦', code: 'CAD', label: 'CAD (CA$)' },
    MXN: { emoji: '🇲🇽', code: 'MXN', label: 'MXN (MX$)' },
    BRL: { emoji: '🇧🇷', code: 'BRL', label: 'BRL (R$)' },
  };

  const languageMap: Record<SupportedLanguage, { emoji: string; label: string; code: SupportedLanguage }> = {
    en: { emoji: '🇺🇸', label: 'English', code: 'en' },
    es: { emoji: '🇲🇽', label: 'Español', code: 'es' },
    pt: { emoji: '🇧🇷', label: 'Português', code: 'pt' },
  };

  const handleToggleDropdown = (name: 'currency' | 'language') => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#BFE5D3]/60 shadow-xs">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo Header */}
        <div className="flex items-center gap-6 sm:gap-8">
          <div
            className="flex items-center gap-3 cursor-pointer py-1 group transition-transform active:scale-95"
            onClick={() => onSwitchView('hero')}
          >
            <img
              src="/assets/logo.png"
              alt="PayScope Logo"
              className="h-9 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </div>

          {/* Center MacOS-Styled Navigation Links with Compact Font Size & Light Green Transparent Wrap Hover */}
          <nav className="hidden lg:flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-[#12372A] font-['SF_Pro_Text',-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif]">
            <button
              onClick={() => onSwitchView('hero')}
              className={`px-3 py-1.5 rounded-full transition-all duration-300 ease-out cursor-pointer ${
                activeView === 'hero'
                  ? 'bg-[#1F8F68] text-white shadow-md shadow-[#1F8F68]/20 font-bold border border-[#1F8F68]'
                  : 'hover:bg-[#1F8F68]/10 hover:text-[#1F8F68] border border-transparent hover:border-[#BFE5D3]/60 text-slate-700 font-medium'
              }`}
            >
              📊 Calculator
            </button>
            <button
              onClick={() => onSwitchView('dashboard')}
              className={`px-3 py-1.5 rounded-full transition-all duration-300 ease-out cursor-pointer ${
                activeView === 'dashboard'
                  ? 'bg-[#1F8F68] text-white shadow-md shadow-[#1F8F68]/20 font-bold border border-[#1F8F68]'
                  : 'hover:bg-[#1F8F68]/10 hover:text-[#1F8F68] border border-transparent hover:border-[#BFE5D3]/60 text-slate-700 font-medium'
              }`}
            >
              📈 Dashboard
            </button>
            <button
              onClick={() => onSwitchView('dashboard')}
              className="px-3 py-1.5 rounded-full hover:bg-[#1F8F68]/10 hover:text-[#1F8F68] border border-transparent hover:border-[#BFE5D3]/60 text-slate-700 font-medium transition-all duration-300 ease-out cursor-pointer"
            >
              🏛️ Tax Engine
            </button>
            <button
              onClick={() => onSwitchView('dashboard')}
              className="px-3 py-1.5 rounded-full hover:bg-[#1F8F68]/10 hover:text-[#1F8F68] border border-transparent hover:border-[#BFE5D3]/60 text-slate-700 font-medium transition-all duration-300 ease-out cursor-pointer"
            >
              🏠 Housing
            </button>
            <a
              href="/resources"
              className="px-3 py-1.5 rounded-full hover:bg-[#1F8F68]/10 hover:text-[#1F8F68] border border-transparent hover:border-[#BFE5D3]/60 text-slate-700 font-medium transition-all duration-300 ease-out cursor-pointer"
            >
              📚 Resources
            </a>
          </nav>
        </div>

        {/* Right Desktop Controls - Language & Currency Buttons with Emojis */}
        <div className="flex items-center gap-3">
          {/* Currency Button with Emojis */}
          <div className="relative">
            <button
              onClick={() => handleToggleDropdown('currency')}
              className="flex items-center gap-1.5 bg-[#F3FBF7] hover:bg-[#EAF7F1] border border-[#BFE5D3] rounded-xl px-3 py-1.5 text-xs font-bold text-[#12372A] transition-all cursor-pointer shadow-2xs"
            >
              <span className="text-sm">{currencyMap[currency]?.emoji || '💵'}</span>
              <span>{currencyMap[currency]?.label || currency}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#1F8F68]" />
            </button>

            {openDropdown === 'currency' && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-[#BFE5D3] rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#1F8F68] px-2 pt-1">
                  💵 Currency / Divisa
                </div>
                {(['USD', 'CAD', 'MXN', 'BRL'] as CurrencyCode[]).map((cur) => (
                  <button
                    key={cur}
                    onClick={() => {
                      onCurrencyChange(cur);
                      setOpenDropdown(null);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl flex items-center justify-between transition-colors ${
                      currency === cur
                        ? 'bg-[#1F8F68] text-white shadow-xs'
                        : 'text-[#12372A] hover:bg-[#F3FBF7]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{currencyMap[cur].emoji}</span>
                      <span>{currencyMap[cur].label}</span>
                    </span>
                    {currency === cur && <span>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language Button with Emojis */}
          <div className="relative">
            <button
              onClick={() => handleToggleDropdown('language')}
              className="flex items-center gap-1.5 bg-[#F3FBF7] hover:bg-[#EAF7F1] border border-[#BFE5D3] rounded-xl px-3 py-1.5 text-xs font-bold text-[#12372A] transition-all cursor-pointer shadow-2xs"
            >
              <span className="text-sm">{languageMap[language]?.emoji || '🌐'}</span>
              <span>🗣️ {languageMap[language]?.label || language.toUpperCase()}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#1F8F68]" />
            </button>

            {openDropdown === 'language' && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-[#BFE5D3] rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#1F8F68] px-2 pt-1">
                  🌐 Language / Idioma
                </div>
                {(['en', 'es', 'pt'] as SupportedLanguage[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      onLanguageChange(lang);
                      setOpenDropdown(null);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl flex items-center justify-between transition-colors ${
                      language === lang
                        ? 'bg-[#1F8F68] text-white shadow-xs'
                        : 'text-[#12372A] hover:bg-[#F3FBF7]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{languageMap[lang].emoji}</span>
                      <span>{languageMap[lang].label}</span>
                    </span>
                    {language === lang && <span>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* PayScope Recruit Button - Disabled / Hidden as requested */}
          {/* Note: Enable only when explicitly instructed by user */}

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
          <div className="bg-white border-b border-[#BFE5D3] p-5 space-y-4 shadow-2xl animate-in slide-in-from-top duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#1F8F68] rounded-xl flex items-center justify-center text-white font-black">
                  P
                </div>
                <span className="font-bold text-lg text-[#12372A]">PayScope</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Controls */}
            <div className="grid grid-cols-2 gap-3 text-xs font-bold pt-1">
              <div>
                <label className="text-[10px] font-bold text-[#1F8F68] uppercase tracking-wider block mb-1">
                  💵 Currency / Divisa
                </label>
                <select
                  value={currency}
                  onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
                  className="w-full bg-[#F3FBF7] border border-[#BFE5D3] rounded-xl p-2.5 font-bold text-[#12372A]"
                >
                  <option value="USD">💵 USD ($)</option>
                  <option value="CAD">🇨🇦 CAD (CA$)</option>
                  <option value="MXN">🇲🇽 MXN (MX$)</option>
                  <option value="BRL">🇧🇷 BRL (R$)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#1F8F68] uppercase tracking-wider block mb-1">
                  🌐 Language / Idioma
                </label>
                <select
                  value={language}
                  onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
                  className="w-full bg-[#F3FBF7] border border-[#BFE5D3] rounded-xl p-2.5 font-bold text-[#12372A]"
                >
                  <option value="en">🇺🇸 English</option>
                  <option value="es">🇲🇽 Español</option>
                  <option value="pt">🇧🇷 Português</option>
                </select>
              </div>
            </div>

            {/* Navigation links in Mobile */}
            <div className="space-y-2 pt-3 border-t border-slate-100 font-bold text-sm text-[#12372A]">
              <button
                onClick={() => {
                  onSwitchView('hero');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 hover:bg-[#F3FBF7] rounded-xl text-[#1F8F68]"
              >
                📊 Calculator
              </button>
              <button
                onClick={() => {
                  onSwitchView('dashboard');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 hover:bg-[#F3FBF7] rounded-xl"
              >
                📈 Dashboard
              </button>
              <button
                onClick={() => {
                  onSwitchView('dashboard');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 hover:bg-[#F3FBF7] rounded-xl"
              >
                🏛️ Tax Engine
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
