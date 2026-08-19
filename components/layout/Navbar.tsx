'use client';

import React, { useState } from 'react';
import { CountryCode, CurrencyCode } from '../../lib/types';
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
} from 'lucide-react';

export interface NavbarProps {
  country: CountryCode;
  currency: CurrencyCode;
  onCountryChange: (country: CountryCode) => void;
  onCurrencyChange: (currency: CurrencyCode) => void;
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
  onCountryChange,
  onCurrencyChange,
  activeView,
  onSwitchView,
  onReset,
  productMode = 'payscope',
  onProductModeChange = () => {},
  recruiterTab = 'dashboard',
  onRecruiterTabChange = () => {},
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const recruiterNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'search', label: 'Candidate Search', icon: Search },
    { id: 'jobs', label: 'Jobs & Pipeline', icon: Briefcase },
    { id: 'rate', label: 'Rate & Margin', icon: Calculator },
    { id: 'reports', label: 'Reports & PDF', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div
            className="flex items-center gap-2 cursor-pointer py-1"
            onClick={() => onSwitchView('hero')}
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <img
                  src="/assets/logo.png"
                  alt="PayScope Logo"
                  className="h-6 sm:h-8 md:h-9 w-auto object-contain"
                />
                {productMode === 'recruiting' && (
                  <span className="bg-indigo-600 text-white font-black text-[9px] sm:text-xs px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                    RECRUIT
                  </span>
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 tracking-wide -mt-0.5 hidden md:inline">
                {productMode === 'recruiting'
                  ? 'Built for recruiters, staffing agencies & talent teams.'
                  : 'Know what your income is really worth.'}
              </span>
            </div>
          </div>

          {/* Desktop Product Mode Switcher */}
          <div className="hidden sm:flex bg-slate-100 p-1 rounded-xl items-center border border-slate-200/80 shadow-inner">
            <button
              onClick={() => onProductModeChange('payscope')}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all ${
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
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all ${
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
          {/* Country Selector */}
          <div className="relative group">
            <button className="flex items-center gap-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 transition-colors">
              <span className="text-sm">
                {country === 'US' ? '🇺🇸' : country === 'CA' ? '🇨🇦' : country === 'MX' ? '🇲🇽' : '🇧🇷'}
              </span>
              <span className="hidden sm:inline">{country}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-xl shadow-xl py-1 hidden group-hover:block z-50">
              <button
                onClick={() => onCountryChange('US')}
                className={`w-full text-left px-3 py-1.5 text-xs font-semibold flex items-center gap-2 hover:bg-slate-50 ${country === 'US' ? 'text-indigo-600 font-bold' : 'text-slate-700'}`}
              >
                <span>🇺🇸</span> United States
              </button>
              <button
                onClick={() => onCountryChange('CA')}
                className={`w-full text-left px-3 py-1.5 text-xs font-semibold flex items-center gap-2 hover:bg-slate-50 ${country === 'CA' ? 'text-indigo-600 font-bold' : 'text-slate-700'}`}
              >
                <span>🇨🇦</span> Canada
              </button>
              <button
                onClick={() => onCountryChange('MX')}
                className={`w-full text-left px-3 py-1.5 text-xs font-semibold flex items-center gap-2 hover:bg-slate-50 ${country === 'MX' ? 'text-indigo-600 font-bold' : 'text-slate-700'}`}
              >
                <span>🇲🇽</span> Mexico
              </button>
              <button
                onClick={() => onCountryChange('BR')}
                className={`w-full text-left px-3 py-1.5 text-xs font-semibold flex items-center gap-2 hover:bg-slate-50 ${country === 'BR' ? 'text-indigo-600 font-bold' : 'text-slate-700'}`}
              >
                <span>🇧🇷</span> Brazil
              </button>
            </div>
          </div>

          {/* Currency Selector */}
          <div className="relative group">
            <button className="flex items-center gap-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 transition-colors">
              <span>{currency}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            <div className="absolute right-0 mt-1 w-28 bg-white border border-slate-200 rounded-xl shadow-xl py-1 hidden group-hover:block z-50">
              <button
                onClick={() => onCurrencyChange('USD')}
                className={`w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 ${currency === 'USD' ? 'text-indigo-600 font-bold' : 'text-slate-700'}`}
              >
                USD ($)
              </button>
              <button
                onClick={() => onCurrencyChange('CAD')}
                className={`w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 ${currency === 'CAD' ? 'text-indigo-600 font-bold' : 'text-slate-700'}`}
              >
                CAD (CA$)
              </button>
              <button
                onClick={() => onCurrencyChange('MXN')}
                className={`w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 ${currency === 'MXN' ? 'text-indigo-600 font-bold' : 'text-slate-700'}`}
              >
                MXN (MX$)
              </button>
              <button
                onClick={() => onCurrencyChange('BRL')}
                className={`w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 ${currency === 'BRL' ? 'text-indigo-600 font-bold' : 'text-slate-700'}`}
              >
                BRL (R$)
              </button>
            </div>
          </div>

          {/* Mobile Hamburger Button Trigger (< 1024px) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Out Drawer Navigation Backdrop & Content */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col justify-start">
          <div className="bg-white border-b border-slate-200 p-4 space-y-4 shadow-2xl animate-in slide-in-from-top duration-200">
            <div className="flex items-center justify-between pb-2 border-b">
              <div className="flex items-center gap-2">
                <img src="/assets/logo.png" alt="PayScope Logo" className="h-7 w-auto" />
                <span className="text-xs font-extrabold text-slate-900">PayScope Menu</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Platform Mode Switcher */}
            <div className="space-y-1.5">
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

            {/* Mobile View Switcher for Employee Mode */}
            {productMode === 'payscope' && (
              <div className="space-y-1 pt-2 border-t text-xs">
                <button
                  onClick={() => {
                    onSwitchView('hero');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl font-bold ${activeView === 'hero' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'}`}
                >
                  Calculator & Hero
                </button>
                <button
                  onClick={() => {
                    onSwitchView('dashboard');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl font-bold ${activeView === 'dashboard' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'}`}
                >
                  Financial Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
