import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { LEGAL_LAST_UPDATED, LEGAL_CONTACT_EMAIL } from '../../lib/legal';
import { Cookie, ArrowLeft } from 'lucide-react';
import { Footer } from '../../components/layout/Footer';

export const metadata: Metadata = {
  title: 'PayScope Cookie Policy | How We Use Cookies & Advertising Technologies',
  description:
    'Learn how PayScope uses cookies, analytics and advertising technologies.',
};

export default function CookiePolicyPage() {
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
            <Cookie className="w-3.5 h-3.5" />
            <span>Technology Disclosures</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Cookie Policy</h1>
          <p className="text-sm font-semibold text-slate-500">
            Learn how PayScope uses cookies, analytics and advertising technologies.
          </p>
          <p className="text-xs font-medium text-slate-400">Last Updated: {LEGAL_LAST_UPDATED}</p>
        </div>

        {/* Cookie Policy Content Card */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">1. What Are Cookies?</h2>
            <p>
              Cookies are small text files stored on your computer or mobile device when you visit a website. They help websites recognize your device, remember preferences, enable technical features, and provide aggregated usage insights.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">2. Types of Cookies Used on PayScope</h2>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/60">
                <h3 className="font-bold text-slate-900 text-sm mb-1">Essential & Preference Cookies</h3>
                <p className="text-slate-600">
                  These cookies store basic UI preferences (such as selected country and currency code) locally in your browser session so you do not have to re-select them on every page load.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/60">
                <h3 className="font-bold text-slate-900 text-sm mb-1">Advertising & Third-Party Cookies (Google AdSense)</h3>
                <p className="text-slate-600">
                  When Google AdSense or advertising partners are enabled on PayScope, third-party vendors use cookies to serve ads based on your prior visits to our website or other websites. Google&apos;s use of advertising cookies enables it and its partners to serve ads based on your visit to our site and/or other sites on the Internet.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/60">
                <h3 className="font-bold text-slate-900 text-sm mb-1">Analytics Cookies</h3>
                <p className="text-slate-600">
                  We may use analytics cookies (such as Google Analytics) to collect anonymous, aggregated traffic statistics to measure application responsiveness, popular calculator tools, and user retention.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">3. Managing and Disabling Cookies</h2>
            <p>
              You can control or delete cookies through your web browser settings. You can opt out of personalized advertising by visiting{' '}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-indigo-600 hover:underline"
              >
                Google Ads Settings
              </a>
              {' '}or through the{' '}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-indigo-600 hover:underline"
              >
                Network Advertising Initiative
              </a>
              .
            </p>
          </section>

          <section className="space-y-2 pt-2 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">4. Contact Us</h2>
            <p>
              If you have questions about our Cookie Policy, please contact us at{' '}
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
