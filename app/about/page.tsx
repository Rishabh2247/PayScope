import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Coffee, Sparkles, MapPin } from 'lucide-react';
import { Footer } from '../../components/layout/Footer';

export const metadata: Metadata = {
  title: 'About PayScope | Know What Your Income Is Really Worth',
  description:
    'PayScope is an independent compensation intelligence platform built to help employees, contractors, recruiters and businesses understand salary and contract rates beyond the headline number.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Header Bar */}
      <header className="bg-white border-b border-slate-200/80 py-4">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-slate-700 hover:text-indigo-600 text-sm">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Calculator</span>
          </Link>
          <img src="/assets/logo.png" alt="PayScope Logo" className="h-10 w-auto mix-blend-multiply" />
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-10 sm:py-14 space-y-8">
        {/* Title Header Card */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Platform Overview</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">About PayScope</h1>
          <p className="text-base font-bold text-indigo-600">
            Know what your income is really worth.
          </p>
          <div className="pt-2 text-slate-700 text-sm sm:text-base leading-relaxed space-y-4">
            <p>
              PayScope was created to make salary and compensation decisions easier to understand.
            </p>
            <p>
              A salary or hourly rate is only one part of the picture. Taxes, employment type, location, housing, transportation and inflation can significantly change what that income is actually worth.
            </p>
            <p>
              PayScope brings these factors together in one place, helping employees, contractors, recruiters and businesses understand compensation beyond the headline number.
            </p>
          </div>
        </div>

        {/* Meet the Developer Card with Left-Aligned Photo */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 text-slate-700 text-sm sm:text-base leading-relaxed">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Meet the Developer</h2>
          </div>

          {/* Developer Profile Header - Strictly Left Aligned */}
          <div className="flex flex-row items-start gap-5 pt-1">
            <div className="relative shrink-0">
              <img
                src="/assets/rishabh.png"
                alt="Rishabh - Developer of PayScope"
                className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl border-2 border-indigo-100 object-cover shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[9px] text-white font-bold" title="Active Solo Developer">
                ✓
              </span>
            </div>

            <div className="space-y-1.5 text-left">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Hi, I&apos;m Rishabh.
              </h3>
              <p className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>Solo Developer based in Lucknow, India</span>
              </p>
              <p className="text-xs sm:text-sm font-medium text-slate-600">
                Building practical digital products that solve everyday problems.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <p>
              I started building PayScope around a simple idea: people shouldn&apos;t have to open five different websites just to understand what their salary or contract rate actually means.
            </p>
            <p>
              What started as a salary calculator is growing into a broader platform covering taxes, compensation rates, cost of living, housing, fuel, inflation and purchasing power across different markets.
            </p>
            <p>
              I design, build and maintain PayScope independently — from the interface and calculations to the data and features behind it.
            </p>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 font-bold text-slate-900 text-sm">
              There&apos;s still a lot to build, but the goal remains simple: Make financial information easier to understand before you make an important decision.
            </div>
          </div>
        </div>

        {/* Support PayScope Card */}
        <div className="bg-gradient-to-br from-amber-50 via-orange-50/40 to-amber-50 p-6 sm:p-10 rounded-3xl border border-amber-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-amber-900 font-black text-xl">
            <Coffee className="w-6 h-6 text-amber-700" />
            <h2>Support PayScope</h2>
          </div>

          <div className="text-slate-800 text-sm sm:text-base leading-relaxed space-y-3">
            <p>
              PayScope is independently developed and maintained.
            </p>
            <p>
              If you find the tools useful and would like to support the project, you can buy me a coffee. Your support helps cover hosting, data services and continued development.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/90 p-5 rounded-2xl border border-amber-200/80 shadow-2xs">
            <div>
              <p className="font-black text-slate-900 text-base">Enjoying PayScope?</p>
              <p className="text-xs text-slate-500 font-semibold">Support the project & keep it independent.</p>
            </div>

            <a
              href="https://buymeacoffee.com/rishabh2247"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-sm rounded-2xl shadow-md shadow-amber-200 transition-all flex items-center gap-2 group shrink-0"
            >
              <Coffee className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span>☕ Buy Me a Coffee →</span>
            </a>
          </div>

          <p className="text-xs font-semibold text-amber-800 text-center sm:text-left">
            Thank you for supporting an independent project.
          </p>
        </div>

        {/* Closing Footnote Card */}
        <div className="text-center py-4 space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-white px-4 py-2 rounded-full border border-slate-200/80 shadow-2xs">
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            <span>Built independently in Lucknow, India.</span>
          </div>
          <p className="text-xs font-black text-slate-900 pt-2">
            PayScope — Know what your income is really worth.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
