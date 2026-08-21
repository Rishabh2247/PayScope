'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CountryCode, CurrencyCode } from '../../lib/types';
import { SupportedLanguage, useTranslation } from '../../lib/i18n';
import { ThemeToggle } from './ThemeToggle';
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
  Scale,
  Home,
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

  // Premium Scroll-Reactive State Engine
  const [isAtTop, setIsAtTop] = useState(true);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [isNavbarHovered, setIsNavbarHovered] = useState(false);

  const lastScrollY = useRef(0);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isTouchDeviceRef = useRef(false);

  // Detect touch capability on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      isTouchDeviceRef.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
  }, []);

  const clearTimers = () => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
  };

  // Scroll listener with debounced auto-collapse & scroll direction detection
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const prevScrollY = lastScrollY.current;

      const atTop = currentScrollY <= 15;
      const goingDown = currentScrollY > prevScrollY + 4;
      const goingUp = currentScrollY < prevScrollY - 4;

      setIsAtTop(atTop);
      setIsScrollingDown(goingDown);
      setIsScrollingUp(goingUp);

      clearTimers();

      if (atTop) {
        // 1. AT TOP: Always visible, transparent, original position
        setIsNavbarVisible(true);
      } else if (goingUp) {
        // 2. SCROLLING UP: Immediately reveal & keep visible
        setIsNavbarVisible(true);
      } else if (goingDown) {
        // 3. SCROLLING DOWN: Fixed glass mode, show navbar while actively scrolling
        setIsNavbarVisible(true);

        // Schedule auto-collapse after scrolling stops (~800ms)
        idleTimerRef.current = setTimeout(() => {
          if (!isNavbarHovered && !isMobileMenuOpen && openDropdown === null) {
            setIsNavbarVisible(false);
          }
        }, 800);
      } else {
        // 4. SCROLL STOPPED (IDLE) while scrolled down:
        idleTimerRef.current = setTimeout(() => {
          if (!isNavbarHovered && !isMobileMenuOpen && openDropdown === null) {
            setIsNavbarVisible(false);
          }
        }, 800);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimers();
    };
  }, [isNavbarHovered, isMobileMenuOpen, openDropdown]);

  // Hover Handlers
  const handleMouseEnter = () => {
    if (isTouchDeviceRef.current) return;
    clearTimers();
    setIsNavbarHovered(true);
    setIsNavbarVisible(true);
  };

  const handleMouseLeave = () => {
    if (isTouchDeviceRef.current) return;
    setIsNavbarHovered(false);

    // Do not collapse if at top, or if mobile menu / dropdown is active
    if (isAtTop || isMobileMenuOpen || openDropdown !== null) return;

    clearTimers();
    leaveTimerRef.current = setTimeout(() => {
      if (!isAtTop && !isMobileMenuOpen && openDropdown === null) {
        setIsNavbarVisible(false);
      }
    }, 650);
  };

  const countryFlags: Record<CountryCode, { flag: string; label: string }> = {
    US: { flag: '🇺🇸', label: 'United States' },
    CA: { flag: '🇨🇦', label: 'Canada' },
    MX: { flag: '🇲🇽', label: 'Mexico' },
    BR: { flag: '🇧🇷', label: 'Brazil' },
  };

  const currencyMap: Record<CurrencyCode, { code: CurrencyCode; label: string }> = {
    USD: { code: 'USD', label: 'USD ($)' },
    CAD: { code: 'CAD', label: 'CAD (CA$)' },
    MXN: { code: 'MXN', label: 'MXN (MX$)' },
    BRL: { code: 'BRL', label: 'BRL (R$)' },
  };

  const languageMap: Record<SupportedLanguage, { label: string; code: SupportedLanguage }> = {
    en: { label: 'English', code: 'en' },
    es: { label: 'Español', code: 'es' },
    pt: { label: 'Português', code: 'pt' },
  };

  const handleToggleDropdown = (name: 'currency' | 'language') => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  return (
    <>
      {/* Top Viewport Hover Trigger Zone (16px) for revealing collapsed navbar */}
      {!isAtTop && !isNavbarVisible && (
        <div
          className="fixed top-0 left-0 right-0 h-4 z-[101] pointer-events-auto"
          onMouseEnter={handleMouseEnter}
        />
      )}

      <header
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transition:
            'transform 450ms cubic-bezier(0.16, 1, 0.3, 1), opacity 350ms cubic-bezier(0.16, 1, 0.3, 1), background-color 300ms ease, backdrop-filter 300ms ease, border-color 300ms ease',
        }}
        className={`fixed top-0 left-0 right-0 z-[100] w-full ${
          isNavbarVisible ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-full opacity-0 pointer-events-none'
        } ${
          isAtTop
            ? 'bg-transparent backdrop-blur-none border-b border-transparent shadow-none'
            : 'bg-[#FAF9F5]/85 dark:bg-[#080B09]/85 backdrop-blur-md border-b border-[#BFE5D3]/40 dark:border-[#26302A] shadow-2xs'
        }`}
      >
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
              className="h-9 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105 dark:brightness-110"
            />
          </div>

          {/* Center MacOS-Styled Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#12372A] dark:text-[#F9FAFB]">
            <button
              onClick={() => onSwitchView('hero')}
              className={`px-3 py-1.5 rounded-full transition-all duration-300 ease-out cursor-pointer flex items-center gap-1.5 ${
                activeView === 'hero'
                  ? 'bg-[#1F8F68] dark:bg-[#22C55E] text-white shadow-md shadow-[#1F8F68]/20 font-extrabold border border-[#1F8F68] dark:border-[#22C55E]'
                  : 'hover:bg-[#1F8F68]/10 dark:hover:bg-[#22C55E]/10 hover:text-[#1F8F68] dark:hover:text-[#22C55E] border border-transparent hover:border-[#BFE5D3]/60 dark:hover:border-[#26302A] text-slate-900 dark:text-slate-100 font-extrabold'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>CALCULATOR</span>
            </button>
            <button
              onClick={() => onSwitchView('dashboard')}
              className={`px-3 py-1.5 rounded-full transition-all duration-300 ease-out cursor-pointer flex items-center gap-1.5 ${
                activeView === 'dashboard'
                  ? 'bg-[#1F8F68] dark:bg-[#22C55E] text-white shadow-md shadow-[#1F8F68]/20 font-extrabold border border-[#1F8F68] dark:border-[#22C55E]'
                  : 'hover:bg-[#1F8F68]/10 dark:hover:bg-[#22C55E]/10 hover:text-[#1F8F68] dark:hover:text-[#22C55E] border border-transparent hover:border-[#BFE5D3]/60 dark:hover:border-[#26302A] text-slate-900 dark:text-slate-100 font-extrabold'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>DASHBOARD</span>
            </button>
            <button
              onClick={() => onSwitchView('dashboard')}
              className="px-3 py-1.5 rounded-full hover:bg-[#1F8F68]/10 dark:hover:bg-[#22C55E]/10 hover:text-[#1F8F68] dark:hover:text-[#22C55E] border border-transparent hover:border-[#BFE5D3]/60 dark:hover:border-[#26302A] text-slate-900 dark:text-slate-100 font-extrabold transition-all duration-300 ease-out cursor-pointer flex items-center gap-1.5"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>TAX ENGINE</span>
            </button>
            <button
              onClick={() => onSwitchView('dashboard')}
              className="px-3 py-1.5 rounded-full hover:bg-[#1F8F68]/10 dark:hover:bg-[#22C55E]/10 hover:text-[#1F8F68] dark:hover:text-[#22C55E] border border-transparent hover:border-[#BFE5D3]/60 dark:hover:border-[#26302A] text-slate-900 dark:text-slate-100 font-extrabold transition-all duration-300 ease-out cursor-pointer flex items-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" />
              <span>HOUSING</span>
            </button>
            <a
              href="/resources"
              className="px-3 py-1.5 rounded-full hover:bg-[#1F8F68]/10 dark:hover:bg-[#22C55E]/10 hover:text-[#1F8F68] dark:hover:text-[#22C55E] border border-transparent hover:border-[#BFE5D3]/60 dark:hover:border-[#26302A] text-slate-900 dark:text-slate-100 font-extrabold transition-all duration-300 ease-out cursor-pointer flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>RESOURCES</span>
            </a>
          </nav>
        </div>

        {/* Right Desktop Controls - Language, Currency, & Theme Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Theme Toggle Button */}
          <ThemeToggle />

          {/* Currency Button */}
          <div className="relative">
            <button
              onClick={() => handleToggleDropdown('currency')}
              className="flex items-center gap-1.5 bg-[#F3FBF7] dark:bg-[#101512] hover:bg-[#EAF7F1] dark:hover:bg-[#151C17] border border-[#BFE5D3] dark:border-[#26302A] rounded-xl px-3 py-1.5 text-xs font-bold text-[#12372A] dark:text-[#F9FAFB] transition-all cursor-pointer shadow-2xs"
            >
              <Globe className="w-3.5 h-3.5 text-[#1F8F68] dark:text-[#22C55E]" />
              <span>{currencyMap[currency]?.label || currency}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#1F8F68] dark:text-[#22C55E]" />
            </button>

            {openDropdown === 'currency' && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#101512] border border-[#BFE5D3] dark:border-[#26302A] rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#1F8F68] dark:text-[#22C55E] px-2 pt-1 flex items-center gap-1">
                  <Globe className="w-3 h-3 text-[#1F8F68] dark:text-[#22C55E]" /> Currency / Divisa
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
                        ? 'bg-[#1F8F68] dark:bg-[#22C55E] text-white shadow-xs'
                        : 'text-[#12372A] dark:text-[#F9FAFB] hover:bg-[#F3FBF7] dark:hover:bg-[#151C17]'
                    }`}
                  >
                    <span>{currencyMap[cur].label}</span>
                    {currency === cur && <span>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language Button */}
          <div className="relative">
            <button
              onClick={() => handleToggleDropdown('language')}
              className="flex items-center gap-1.5 bg-[#F3FBF7] dark:bg-[#101512] hover:bg-[#EAF7F1] dark:hover:bg-[#151C17] border border-[#BFE5D3] dark:border-[#26302A] rounded-xl px-3 py-1.5 text-xs font-bold text-[#12372A] dark:text-[#F9FAFB] transition-all cursor-pointer shadow-2xs"
            >
              <Languages className="w-3.5 h-3.5 text-[#1F8F68] dark:text-[#22C55E]" />
              <span>{languageMap[language]?.label || language.toUpperCase()}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#1F8F68] dark:text-[#22C55E]" />
            </button>

            {openDropdown === 'language' && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#101512] border border-[#BFE5D3] dark:border-[#26302A] rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#1F8F68] dark:text-[#22C55E] px-2 pt-1 flex items-center gap-1">
                  <Languages className="w-3 h-3 text-[#1F8F68] dark:text-[#22C55E]" /> Language / Idioma
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
                        ? 'bg-[#1F8F68] dark:bg-[#22C55E] text-white shadow-xs'
                        : 'text-[#12372A] dark:text-[#F9FAFB] hover:bg-[#F3FBF7] dark:hover:bg-[#151C17]'
                    }`}
                  >
                    <span>{languageMap[lang].label}</span>
                    {language === lang && <span>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button Trigger (< 1024px) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
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
            <div className="flex items-center justify-end pb-3 border-b border-slate-100 dark:border-[#26302A]">
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 dark:text-slate-300 hover:text-slate-700 dark:hover:text-white p-1">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Controls */}
            <div className="grid grid-cols-2 gap-3 text-xs font-bold pt-1">
              <div>
                <label className="text-[10px] font-bold text-[#1F8F68] uppercase tracking-wider block mb-1">
                  Currency / Divisa
                </label>
                <select
                  value={currency}
                  onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
                  className="w-full bg-[#F3FBF7] border border-[#BFE5D3] rounded-xl p-2.5 font-bold text-[#12372A]"
                >
                  <option value="USD">USD ($)</option>
                  <option value="CAD">CAD (CA$)</option>
                  <option value="MXN">MXN (MX$)</option>
                  <option value="BRL">BRL (R$)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#1F8F68] uppercase tracking-wider block mb-1">
                  Language / Idioma
                </label>
                <select
                  value={language}
                  onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
                  className="w-full bg-[#F3FBF7] border border-[#BFE5D3] rounded-xl p-2.5 font-bold text-[#12372A]"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="pt">Português</option>
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
                className="w-full text-left py-2 px-3 hover:bg-[#F3FBF7] rounded-xl text-[#1F8F68] flex items-center gap-2"
              >
                <Calculator className="w-4 h-4" /> Calculator
              </button>
              <button
                onClick={() => {
                  onSwitchView('dashboard');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 hover:bg-[#F3FBF7] rounded-xl flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </button>
              <button
                onClick={() => {
                  onSwitchView('dashboard');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 hover:bg-[#F3FBF7] rounded-xl flex items-center gap-2"
              >
                <Scale className="w-4 h-4" /> Tax Engine
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
    </>
  );
};
