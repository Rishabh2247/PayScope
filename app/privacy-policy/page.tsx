import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { LEGAL_LAST_UPDATED, LEGAL_BUSINESS_NAME, LEGAL_CONTACT_EMAIL } from '../../lib/legal';
import { Shield, ArrowLeft } from 'lucide-react';
import { Footer } from '../../components/layout/Footer';

export const metadata: Metadata = {
  title: 'PayScope Privacy Policy | How We Protect Your Information',
  description:
    'Learn how PayScope collects, uses and protects information when you use our salary, tax and compensation calculators.',
};

export default function PrivacyPolicyPage() {
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
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
            <Shield className="w-3.5 h-3.5" />
            <span>Legal Documentation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Privacy Policy</h1>
          <p className="text-sm font-semibold text-slate-500">
            How PayScope collects, uses and protects information.
          </p>
          <p className="text-xs font-medium text-slate-400">Last Updated: {LEGAL_LAST_UPDATED}</p>
        </div>

        {/* Policy Sections Card */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">1. Introduction</h2>
            <p>
              Welcome to PayScope (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), operated by {LEGAL_BUSINESS_NAME}.
              PayScope provides universal salary, tax, contractor billing, and financial snapshot calculators.
              We are committed to maintaining the privacy, security, and integrity of information processed through our application.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">2. Information We Process</h2>
            <p>
              <strong>Privacy-Friendly Calculator Inputs:</strong> When you use PayScope calculators, you provide parameters such as employment classification (W-2, 1099, T4, C2C, Incorporated), rate or income figures, country, state/province, city, filing status, and hours worked.
            </p>
            <p className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 text-xs font-medium text-slate-600">
              🔒 <strong>Local Processing Notice:</strong> All salary, rate, and financial calculation parameters you enter into the PayScope calculator are processed locally within your client browser session. Calculator inputs are not saved to a persistent database on our servers.
            </p>
            <p>
              <strong>Technical & Device Information:</strong> Like most web applications, our servers and network providers may automatically log standard browser header details, including your internet protocol (IP) address, browser type, device specifications, and operating system.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">3. How Information Is Used</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>To execute live financial snapshot calculations within your web browser.</li>
              <li>To store local UI preferences (such as selected country and currency) on your device.</li>
              <li>To maintain network performance, prevent security threats, and protect service uptime.</li>
              <li>To serve non-intrusive advertisements or analyze aggregated usage trends when third-party providers are active.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">4. Third-Party Services & Advertising</h2>
            <p>
              PayScope may utilize third-party vendor services for web hosting, performance delivery, analytics, and advertising:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Google AdSense & Advertising Providers:</strong> We may display advertisements provided by Google AdSense or other advertising networks. Third-party vendors use cookies and device identifiers to serve ads based on user visits to this and other websites.
              </li>
              <li>
                <strong>Analytics Providers:</strong> We may use analytics services (such as Google Analytics) to measure aggregated website traffic patterns and improve application responsiveness.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">5. Regional Privacy Rights (United States & Canada)</h2>
            <p>
              Users in the United States and Canada may have specific statutory privacy rights regarding technical data logs or advertising identifiers. Because PayScope does not require user accounts or store personal calculation inputs on our servers, we maintain minimal data retention footprints.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">6. Children&apos;s Privacy</h2>
            <p>
              PayScope calculators are intended for general adult audiences, job candidates, employees, contractors, and recruiters. We do not knowingly collect personal information from children under the age of 13.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">7. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. The revised policy will be posted on this page with an updated &quot;Last Updated&quot; date.
            </p>
          </section>

          <section className="space-y-2 pt-2 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">8. Contact Us</h2>
            <p>
              If you have questions regarding this Privacy Policy, please contact us at{' '}
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
