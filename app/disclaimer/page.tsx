import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { LEGAL_LAST_UPDATED, LEGAL_CONTACT_EMAIL } from '../../lib/legal';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { Footer } from '../../components/layout/Footer';

export const metadata: Metadata = {
  title: "PayScope Financial Disclaimer | Important Information About Calculator Estimates",
  description:
    "Important information about PayScope's salary, tax, compensation and financial estimates.",
};

export default function FinancialDisclaimerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Header Bar */}
      <header className="bg-white border-b border-slate-200/80 py-4">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-slate-700 hover:text-indigo-600 text-sm">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Calculator</span>
          </Link>
          <img src="/assets/logo.png" alt="PayScope Logo" width={140} height={40} loading="lazy" decoding="async" className="h-10 w-auto mix-blend-multiply" />
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-10 sm:py-14 space-y-8">
        {/* Title Header Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-800 px-3 py-1 rounded-full text-xs font-bold border border-amber-200/60">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Important Disclosure</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Financial Disclaimer</h1>
          <p className="text-sm font-semibold text-slate-500">
            PayScope provides estimates for informational and planning purposes only.
          </p>
          <p className="text-xs font-medium text-slate-400">Last Updated: {LEGAL_LAST_UPDATED}</p>
        </div>

        {/* Disclaimer Content Card */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">1. Not Professional Financial or Tax Advice</h2>
            <p>
              PayScope is an automated calculation tool. <strong>PayScope is NOT:</strong>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-bold text-slate-800 bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
              <div className="flex items-center gap-1.5">❌ A tax advisor</div>
              <div className="flex items-center gap-1.5">❌ A CPA / accountant</div>
              <div className="flex items-center gap-1.5">❌ A law firm</div>
              <div className="flex items-center gap-1.5">❌ A financial advisor</div>
              <div className="flex items-center gap-1.5">❌ An employment lawyer</div>
              <div className="flex items-center gap-1.5">❌ A payroll service</div>
            </div>
            <p>
              All figures, percentages, tax breakdowns, and take-home pay estimates displayed on PayScope are generated for general educational and preliminary planning purposes. They should never be treated as official tax statements or legal guarantees.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">2. Variables Influencing Tax Calculations</h2>
            <p>
              Actual tax liability and net take-home pay depend on individual personal and corporate factors, including:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600 font-medium">
              <li>Country, state/province, and municipal tax rules</li>
              <li>Tax year legislative updates and standard deduction indexing</li>
              <li>Employment classification (W-2, 1099, T4, C2C, S-Corp, Incorporated)</li>
              <li>Marital filing status and number of eligible dependents</li>
              <li>Pre-tax health insurance premiums, HSA/FSA contributions, and retirement plans (401k/RRSP)</li>
              <li>Business expense write-offs, home office deductions, and equipment depreciation</li>
              <li>Corporate structure, small business tax deductions, and salary vs. dividend draw allocation</li>
              <li>Other income streams, investment gains, or tax credits</li>
            </ul>
          </section>

          <section className="space-y-3 bg-indigo-50/70 p-5 rounded-2xl border border-indigo-100">
            <h2 className="text-base font-bold text-indigo-950">
              3. Important Note for Contractors & Incorporated Businesses (US & Canada)
            </h2>
            <p className="text-xs text-indigo-900 font-medium leading-relaxed">
              For incorporated contractors, S-Corp owners, C2C operators, and 1099 self-employed individuals in the United States and Canada: <strong>Gross Corporate Contract Revenue is NOT equivalent to Personal Take-Home Pay.</strong>
            </p>
            <p className="text-xs text-indigo-900 font-medium leading-relaxed">
              Corporate contract billing must account for business operating expenses, corporate tax rates (such as the Ontario Small Business Deduction), payroll taxes, CPP/SECA obligations, and dividend tax credits. In Canada, worker classification and corporate tax treatment depend on your specific contractual relationship.
            </p>
          </section>

          <section className="space-y-2 pt-2 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">4. Consult Qualified Professionals</h2>
            <p>
              Before making employment decisions, signing contracts, or filing tax returns, consult a certified tax professional, CPA, or legal expert licensed in your jurisdiction.
            </p>
            <p className="pt-2 text-xs text-slate-400">
              Questions regarding this Financial Disclaimer? Contact us at{' '}
              <a href={`mailto:${LEGAL_CONTACT_EMAIL}`} className="font-bold text-indigo-600 hover:underline">
                {LEGAL_CONTACT_EMAIL}
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
