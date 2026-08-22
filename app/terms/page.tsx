import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { LEGAL_LAST_UPDATED, LEGAL_BUSINESS_NAME, LEGAL_CONTACT_EMAIL } from '../../lib/legal';
import { FileText, ArrowLeft } from 'lucide-react';
import { Footer } from '../../components/layout/Footer';

export const metadata: Metadata = {
  title: 'PayScope Terms of Service',
  description: 'Read the terms governing your use of PayScope calculators, tools and resources.',
};

export default function TermsPage() {
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
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
            <FileText className="w-3.5 h-3.5" />
            <span>Terms of Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Terms of Service</h1>
          <p className="text-sm font-semibold text-slate-500">
            Terms governing your use of PayScope calculators, tools, and resources.
          </p>
          <p className="text-xs font-medium text-slate-400">Last Updated: {LEGAL_LAST_UPDATED}</p>
        </div>

        {/* Terms Sections Card */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the PayScope website, calculators, tools, or financial snapshot services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the application.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">2. Permitted Use</h2>
            <p>
              PayScope provides financial, tax, and rate calculation tools for personal, career planning, recruitment evaluation, and informational purposes. You agree to use the services only for lawful purposes and in accordance with these terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">3. Nature of Calculator Estimates</h2>
            <p>
              PayScope calculations are automated estimates generated using mathematical algorithms, statutory tax bracket formulas, and regional benchmark data.
            </p>
            <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200/80 text-xs font-medium text-amber-900">
              ⚠️ <strong>No Guarantee of Accuracy:</strong> Statutory tax schedules, regional cost-of-living indicators, fuel prices, and contractor tax treatments vary dynamically based on personal tax circumstances, legislative updates, and local market conditions. Estimates are provided without warranty of any kind.
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">4. Limitation of Professional Liability</h2>
            <p>
              PayScope is an automated calculation tool and does NOT provide certified tax advice, accounting services, legal counsel, or financial planning. You should consult a qualified Certified Public Accountant (CPA), tax professional, or legal advisor regarding your specific situation.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">5. Intellectual Property</h2>
            <p>
              All original content, interface design, logo graphics, application logic, software code, and visual components of PayScope are the intellectual property of {LEGAL_BUSINESS_NAME} and are protected by copyright and intellectual property laws.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">6. Third-Party Links & Data</h2>
            <p>
              PayScope may reference third-party economic indices, government census data, fuel indices, or external links. We do not control or endorse the content or practices of any third-party websites or services.
            </p>
          </section>

          <section className="space-y-2 pt-2 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">7. Contact Information</h2>
            <p>
              For any questions concerning these Terms of Service, please contact us at{' '}
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
