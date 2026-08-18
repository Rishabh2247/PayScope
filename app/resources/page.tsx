import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  BookOpen,
  ArrowRight,
  Calculator,
  Compass,
  FileText,
  HelpCircle,
  TrendingUp,
  Home,
  Fuel,
  MapPin,
  ShieldCheck,
  Search,
  DollarSign,
  Globe,
  Layers,
} from 'lucide-react';
import { Footer } from '../../components/layout/Footer';

export const metadata: Metadata = {
  title: 'Resources | Salary, Tax, Contractor & Cost of Living Guides | PayScope',
  description:
    'Explore PayScope guides covering salary, take-home pay, taxes, contractor rates, C2C, recruiting, cost of living, housing, fuel, commuting and relocation.',
};

export default function ResourcesPage() {
  const featuredGuides = [
    {
      title: 'What Is My Salary Really Worth?',
      description: 'Understand how taxes, deductions and location affect your actual take-home pay.',
      link: '#salary-worth',
      category: 'Salary & Pay',
    },
    {
      title: "Employee vs Contractor: What's the Difference?",
      description: 'Compare taxes, benefits, expenses and risk across employment structures.',
      link: '#employee-vs-contractor',
      category: 'Contracting',
    },
    {
      title: 'C2C vs W-2 vs 1099 vs T4',
      description: 'Understand how different structures can make the same hourly rate worth very different amounts.',
      link: '#c2c-w2-1099-t4',
      category: 'Tax Structures',
    },
    {
      title: 'How Much Salary Do You Need to Live Comfortably?',
      description: 'Put salary into context using housing, transportation and local living costs.',
      link: '#living-comfortably',
      category: 'Cost of Living',
    },
  ];

  const glossaryCanada = [
    {
      term: 'What is a T4?',
      definition:
        'A Canadian tax slip an employer provides to report employment income and deductions. Example: an employee earning CA$80,000 receives a T4 showing employment income and applicable deductions.',
    },
    {
      term: 'What is C2C?',
      definition:
        "Company-to-company contracting. A client pays a contractor's company for services. Example: a client pays a corporation CA$80/hour; that corporate revenue is not automatically personal take-home pay.",
    },
    {
      term: 'What is C2H?',
      definition:
        'Contract-to-hire: a person initially works as a contractor, with the possibility of becoming a permanent employee later.',
    },
    {
      term: 'What is an Incorporated Contractor?',
      definition:
        'A contractor operates through a corporation. Contract revenue belongs to the business, which may have expenses and tax obligations before the owner receives compensation.',
    },
    {
      term: 'What is CPP?',
      definition:
        'Canada Pension Plan contributions are payroll contributions that generally apply to employment income and help fund future CPP benefits.',
    },
    {
      term: 'What is EI?',
      definition:
        'Employment Insurance provides qualifying workers with temporary financial assistance in situations covered by the program; employees generally contribute through payroll deductions.',
    },
  ];

  const glossaryUS = [
    {
      term: 'What is a W-2?',
      definition: "A W-2 is an employer-provided tax form reporting an employee's wages and applicable tax withholding for the year.",
    },
    {
      term: 'What is a 1099?',
      definition:
        "1099 is a family of IRS information returns. In everyday work discussions, '1099 worker' commonly refers to an independent contractor, but 1099 is not itself a single employment classification.",
    },
    {
      term: 'W-2 vs 1099',
      definition:
        'A W-2 generally describes an employee relationship where the employer handles payroll withholding. An independent contractor generally handles their own tax obligations. Benefits, expenses and flexibility can differ.',
    },
  ];

  const recruitingTerms = [
    { term: 'Pay Rate', definition: 'The rate paid to the worker. Example: $60/hour.' },
    { term: 'Bill Rate', definition: 'The rate charged to the client. Example: $80/hour.' },
    { term: 'Spread', definition: 'The difference between bill rate and pay rate. $80 − $60 = $20/hour.' },
    { term: 'Margin', definition: 'Spread divided by bill rate. $20 ÷ $80 = 25%.' },
    { term: 'Markup', definition: 'Spread divided by the underlying cost/pay rate. $20 ÷ $60 = 33.3%. Markup and margin are different.' },
  ];

  const taxTerms = [
    { term: 'Gross Pay', definition: 'Pay before deductions.' },
    { term: 'Net Pay / Take-Home Pay', definition: 'Money remaining after applicable deductions.' },
    { term: 'Federal Tax', definition: 'Tax imposed by the federal/national government.' },
    { term: 'State Tax', definition: 'A tax imposed by an individual US state where applicable.' },
    { term: 'Provincial Tax', definition: 'Canadian provincial income tax.' },
    { term: 'Payroll Tax / Contribution', definition: 'Taxes or statutory contributions associated with payroll.' },
    { term: 'Tax Bracket', definition: 'A range of taxable income subject to a particular marginal rate.' },
    { term: 'Marginal Tax Rate', definition: 'The rate applied to the next portion of taxable income.' },
    { term: 'Effective Tax Rate', definition: 'Total relevant tax divided by the relevant income.' },
    { term: 'Tax Deduction', definition: 'An amount that can reduce taxable income when applicable.' },
    { term: 'Tax Credit', definition: 'An amount that can reduce tax owed when applicable.' },
    { term: 'Withholding', definition: 'Money withheld from a paycheck toward taxes or other required deductions.' },
  ];

  const livingTerms = [
    { term: 'Cost of Living', definition: 'The typical cost of maintaining a particular standard of living in a location.' },
    { term: 'Purchasing Power', definition: 'How much goods and services an income can actually buy in a particular location.' },
    { term: 'Inflation', definition: 'A general increase in prices over time.' },
    { term: 'Real Income', definition: 'Income considered after adjusting for inflation.' },
    { term: 'Disposable Income', definition: 'Money available after relevant taxes and required deductions/expenses, depending on the definition used.' },
    { term: 'Rent-to-Income Ratio', definition: 'The share of income allocated to rent.' },
  ];

  const categoryHubs = [
    {
      title: 'Salary & Pay',
      items: [
        'Salary vs Take-Home Pay',
        'Gross Pay vs Net Pay',
        'Hourly to Annual Salary',
        'Annual Salary to Hourly Rate',
        'Effective Hourly Rate',
        'How Much Is $50 an Hour a Year?',
        'How Much Is $60 an Hour a Year?',
        'How Much Salary Do I Need?',
      ],
      linkText: 'Explore Salary Calculators →',
      href: '/',
    },
    {
      title: 'Taxes & Take-Home Pay',
      items: [
        'US Tax Basics',
        'Canadian Tax Basics',
        'Federal vs State Tax',
        'Federal vs Provincial Tax',
        'CPP & EI Explained',
        'Payroll Taxes Explained',
        'Tax Brackets Explained',
        'Why Is My Take-Home Pay Lower Than My Salary?',
      ],
      linkText: 'Calculate Take-Home Pay →',
      href: '/dashboard/tax-engine',
    },
    {
      title: 'Contracting & Employment',
      items: [
        'W-2 vs 1099',
        'T4 vs Contractor',
        'C2C Explained',
        'C2C vs T4',
        'C2H Explained',
        'Incorporated Contractor Explained',
        'Contractor vs Employee',
        'Contract Rate vs Salary',
      ],
      linkText: 'Compare Employment & Contract Rates →',
      href: '/dashboard/rate-analysis',
    },
    {
      title: 'Recruiter & Staffing Resources',
      items: [
        'Bill Rate vs Pay Rate',
        'Staffing Markup vs Margin',
        'Recruiter Margin Explained',
        'Contractor Bill Rate Calculator Guide',
        'Employer Cost vs Worker Pay',
        'How Staffing Agency Margins Work',
      ],
      linkText: 'Open Rate Analysis →',
      href: '/dashboard/rate-analysis',
    },
    {
      title: 'Cost of Living',
      items: [
        'Cost of Living by City',
        'Salary vs Cost of Living',
        'Rent vs Income',
        'How Much Income Do I Need to Live in...?',
        'Purchasing Power Explained',
        'Cost of Living Comparison',
      ],
      linkText: 'Compare Cost of Living →',
      href: '/dashboard/benchmarks',
    },
    {
      title: 'Housing',
      items: [
        'Average Rent by City',
        'Average Rent by Neighborhood',
        '1-Bedroom Rent',
        '2-Bedroom Rent',
        'House Prices by City',
        'Rent Affordability',
        'Housing vs Take-Home Pay',
      ],
      linkText: 'Explore Housing Data →',
      href: '/dashboard/housing',
    },
    {
      title: 'Fuel & Commute',
      items: [
        'Fuel Cost Calculator',
        'Commute Cost Calculator',
        'Fuel Cost as a Percentage of Income',
        'Gas Prices by City',
        'Cost of Driving to Work',
      ],
      linkText: 'Calculate Commute Costs →',
      href: '/dashboard/fuel-commute',
    },
    {
      title: 'Relocation',
      items: [
        'City vs City Salary Comparison',
        'Salary Equivalent Calculator',
        'Cost of Living Relocation Calculator',
        'Moving for a Higher Salary',
        'Salary Needed to Maintain Your Lifestyle',
        'Best Cities for Your Salary',
      ],
      linkText: 'Compare Cities →',
      href: '/dashboard/relocation',
    },
  ];

  const cityGuides = [
    { country: '🇨🇦 Canada', cities: 'Toronto · Vancouver · Calgary · Montreal · Ottawa' },
    { country: '🇺🇸 United States', cities: 'New York · Austin · Los Angeles · Dallas · Chicago · Houston' },
    { country: '🇲🇽 Mexico', cities: 'Major cities — salary · cost of living · housing · fuel' },
    { country: '🇧🇷 Brazil', cities: 'Major cities — salary · cost of living · housing · fuel' },
  ];

  const latestResources = [
    'What Is CA$60 an Hour After Tax in Ontario?',
    'T4 vs C2C: Which Is Better for Contractors?',
    'How Much Do You Need to Earn to Live in Toronto?',
    '$100K Salary in Austin: Take-Home Pay & Cost of Living',
    'How Much Does a 30-Minute Commute Really Cost?',
    'What Is a Good Contractor Rate in Canada?',
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Header Bar */}
      <header className="bg-white border-b border-slate-200/80 py-4 sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/assets/logo.png" alt="PayScope Logo" className="h-12 sm:h-14 w-auto mix-blend-multiply" />
          </Link>
          <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
            <Link href="/" className="hover:text-indigo-600">
              Calculators
            </Link>
            <Link href="/dashboard/tax-engine" className="hover:text-indigo-600">
              Tools
            </Link>
            <Link href="/about" className="hover:text-indigo-600">
              About
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* HERO BANNER SECTION */}
        <section className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3.5 py-1 rounded-full text-xs font-bold">
            <BookOpen className="w-4 h-4" />
            <span>PayScope Resource Center</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            PayScope Resources
          </h1>
          <p className="text-lg sm:text-xl font-bold text-indigo-600">
            Understand your pay. Compare your options. Make better decisions.
          </p>

          <p className="text-slate-600 text-sm sm:text-base max-w-3xl leading-relaxed">
            Salary numbers rarely tell the whole story. A higher hourly rate does not always mean more money in your pocket. Taxes, employment type, location, housing, transportation, inflation and everyday expenses can all change the real value of an offer.
          </p>

          <p className="text-slate-600 text-sm sm:text-base max-w-3xl leading-relaxed">
            The PayScope Resource Center explains the numbers behind salaries, contract rates and cost of living with practical guides, simple definitions and real-world examples.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-indigo-200 transition-all"
            >
              Explore Calculators →
            </Link>
            <Link
              href="/dashboard/tax-engine"
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-2xl transition-all"
            >
              Explore Tools →
            </Link>
          </div>
        </section>

        {/* FEATURED GUIDES SECTION */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Featured Guides</h2>
            <span className="text-xs text-slate-400 font-semibold">Practical Insights</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {featuredGuides.map((guide, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:border-indigo-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <span className="inline-block bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    {guide.category}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">{guide.title}</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{guide.description}</p>
                </div>
                <Link href={guide.link} className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700">
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* MONEY & WORK EXPLAINED (GLOSSARY) */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Money & Work Explained</h2>
            <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
              Confused by T4, W-2, C2C, 1099, bill rate or tax brackets? PayScope explains common salary, tax, employment and contracting terms in simple language, with examples and links to relevant calculators.
            </p>
          </div>

          {/* Canada Glossary */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span>🇨🇦</span> Canada Terminology
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {glossaryCanada.map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm">{item.term}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.definition}</p>
                </div>
              ))}
            </div>
          </div>

          {/* United States Glossary */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span>🇺🇸</span> United States Terminology
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {glossaryUS.map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm">{item.term}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.definition}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recruiting & Staffing Terms */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span>💼</span> Recruiting & Staffing Terms
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recruitingTerms.map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm">{item.term}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.definition}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tax & Pay Terms */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span>🏛️</span> Tax & Pay Terms
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {taxTerms.map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm">{item.term}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.definition}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Financial & Cost-of-Living Terms */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span>📊</span> Financial & Cost-of-Living Terms
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {livingTerms.map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm">{item.term}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.definition}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TOPIC CATEGORIZED RESOURCE HUBS */}
        <section className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Explore Resources by Topic</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categoryHubs.map((hub, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-2">{hub.title}</h3>
                  <ul className="space-y-2 text-xs text-slate-600 font-medium">
                    {hub.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-center gap-1.5 hover:text-indigo-600 cursor-pointer">
                        <span className="text-slate-400">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={hub.href}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 pt-2 border-t border-slate-100"
                >
                  <span>{hub.linkText}</span>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* CITY GUIDES GRID */}
        <section className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">City Guides</h2>
            <p className="text-xs text-slate-500">Explore salary, taxes, housing, fuel and cost-of-living information by location.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cityGuides.map((guide, idx) => (
              <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">{guide.country}</span>
                <span className="text-slate-600 font-medium">{guide.cities}</span>
              </div>
            ))}
          </div>
        </section>

        {/* LATEST RESOURCES GRID */}
        <section className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Latest Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {latestResources.map((title, idx) => (
              <div key={idx} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
                <span className="text-[10px] font-bold text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded-full">
                  Guide Article
                </span>
                <h3 className="font-bold text-slate-900 text-sm leading-snug">{title}</h3>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>3 min read</span>
                  <span className="font-semibold text-indigo-600 hover:underline cursor-pointer">Read →</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PAY_SCOPE DATA & DISCLAIMER SECTION */}
        <section className="bg-slate-900 text-white p-8 sm:p-10 rounded-3xl shadow-xl space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-slate-800 text-indigo-400 px-3 py-1 rounded-full text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Data Integrity & Disclaimers</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">PayScope Data & Accuracy</h2>
          </div>

          <div className="text-slate-300 text-xs sm:text-sm leading-relaxed space-y-4">
            <p>
              PayScope uses tax, economic, housing, fuel and market information from relevant public and third-party data sources. Because financial and market data changes, data-driven sections display source information, data period, and verification dates.
            </p>
            <p>
              PayScope does not describe estimates as guaranteed results. If a data point is unavailable, the interface clearly states that it is unavailable or that a regional estimate is being used rather than silently substituting another location.
            </p>
            <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 text-xs text-slate-300 leading-relaxed space-y-2">
              <p className="font-bold text-white">Important Financial Disclaimer:</p>
              <p>
                PayScope provides estimates and educational information for general informational purposes. Tax calculations, take-home estimates, housing costs, income benchmarks, fuel prices and other figures may vary based on location, tax year, employment structure, deductions, benefits, market conditions and individual circumstances.
              </p>
              <p>
                For incorporated contractors and C2C arrangements, contract revenue should not automatically be treated as personal income or take-home pay. PayScope is not a tax advisor, accountant, lawyer, financial advisor or employment advisor. Consult an appropriately qualified professional for advice specific to your circumstances.
              </p>
            </div>
          </div>
        </section>

        {/* CAN'T FIND WHAT YOU'RE LOOKING FOR? CTA */}
        <section className="bg-gradient-to-r from-indigo-600 to-blue-700 p-8 sm:p-10 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-2xl font-black">Can&apos;t Find What You&apos;re Looking For?</h2>
            <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed font-medium">
              Start with a calculator. Enter your location, employment type and salary or contract rate to see what your income could actually look like after taxes and local costs.
            </p>
          </div>

          <Link
            href="/"
            className="px-6 py-3.5 bg-white hover:bg-slate-50 text-indigo-900 font-bold text-xs rounded-2xl shadow-md transition-all shrink-0 active:scale-95"
          >
            Calculate My Income →
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
