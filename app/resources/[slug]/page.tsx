import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { RESOURCE_TOPICS, ResourceTopic } from '../../../lib/resourceTopics';
import { Navbar } from '../../../components/layout/Navbar';
import { Footer } from '../../../components/layout/Footer';
import {
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Calculator,
  CheckCircle2,
  Clock,
  Calendar,
  HelpCircle,
  Share2,
  Bookmark,
  Layers,
  Sparkles,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return RESOURCE_TOPICS.map((topic) => ({
    slug: topic.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = RESOURCE_TOPICS.find((t) => t.slug === slug);

  if (!topic) {
    return {
      title: 'Resource Guide Not Found | PayScope',
    };
  }

  return {
    title: `${topic.title} | PayScope Guides`,
    description: topic.metaDescription,
    keywords: [
      topic.shortTitle,
      topic.category,
      'salary calculator',
      'take home pay',
      'tax guide',
      'contractor billing rate',
    ],
    openGraph: {
      title: topic.title,
      description: topic.metaDescription,
      type: 'article',
      url: `https://payscope.app/resources/${topic.slug}`,
      siteName: 'PayScope',
    },
    alternates: {
      canonical: `https://payscope.app/resources/${topic.slug}`,
    },
  };
}

export default async function TopicDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const topic = RESOURCE_TOPICS.find((t) => t.slug === slug);

  if (!topic) {
    notFound();
  }

  const relatedTopics = RESOURCE_TOPICS.filter((t) => t.slug !== topic.slug).slice(0, 3);

  // JSON-LD Structured Data for Google SEO Indexing (Article & FAQPage)
  const jsonLdArticle = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: topic.title,
    description: topic.metaDescription,
    author: {
      '@type': 'Organization',
      name: 'PayScope Financial Engineering',
    },
    publisher: {
      '@type': 'Organization',
      name: 'PayScope',
      logo: {
        '@type': 'ImageObject',
        url: 'https://payscope.app/assets/logo.png',
      },
    },
    datePublished: '2026-08-01',
    dateModified: '2026-08-20',
  };

  const jsonLdFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: topic.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#12372A]">
      {/* Inject JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />

      {/* Static Header Nav for SEO Subpage */}
      <header className="bg-white border-b border-[#BFE5D3] sticky top-0 z-40">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/assets/logo.png" alt="PayScope Logo" width={120} height={32} loading="lazy" decoding="async" className="h-8 w-auto object-contain" />
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/resources"
              className="text-xs font-bold text-slate-600 hover:text-[#1F8F68] flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>All Guides</span>
            </Link>
            <Link
              href="/"
              className="bg-[#1F8F68] hover:bg-[#176F52] text-white text-xs font-extrabold px-4 py-2 rounded-full shadow-xs transition-all flex items-center gap-1.5"
            >
              <span>📊 Open Calculator</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-2 flex-wrap font-medium">
          <Link href="/" className="hover:text-[#1F8F68] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/resources" className="hover:text-[#1F8F68] transition-colors">Resources</Link>
          <span>/</span>
          <span className="text-[#1F8F68] font-bold">{topic.category}</span>
        </nav>

        {/* Article Header */}
        <header className="space-y-4 border-b border-[#BFE5D3]/60 pb-8">
          <div className="flex items-center gap-3 flex-wrap text-xs font-bold">
            <span className="bg-[#EAF7F1] text-[#1F8F68] px-3 py-1 rounded-full border border-[#BFE5D3]">
              🏷️ {topic.category}
            </span>
            <span className="text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#1F8F68]" /> {topic.readTime}
            </span>
            <span className="text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#1F8F68]" /> Updated {topic.lastUpdated}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#12372A] leading-tight">
            {topic.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed pt-2">
            {topic.heroExcerpt}
          </p>
        </header>

        {/* Key Takeaways Box */}
        <section className="bg-[#EAF7F1] border border-[#BFE5D3] p-6 sm:p-7 rounded-3xl space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 text-[#1F8F68] font-extrabold text-sm uppercase tracking-wider">
            <Sparkles className="w-5 h-5 text-[#1F8F68]" />
            <span>Key Financial Takeaways</span>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-semibold text-[#12372A]">
            {topic.keyTakeaways.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 bg-white p-3.5 rounded-2xl border border-[#BFE5D3]/60">
                <CheckCircle2 className="w-4 h-4 text-[#198754] shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Article Main Body Sections */}
        <article className="space-y-10 text-slate-700 leading-relaxed text-sm sm:text-base font-normal">
          {topic.sections.map((section, idx) => (
            <section key={idx} className="space-y-4 border-b border-[#BFE5D3]/40 pb-8 last:border-b-0">
              <h2 className="text-xl sm:text-2xl font-black text-[#12372A] tracking-tight">
                {section.heading}
              </h2>

              <div className="whitespace-pre-line text-slate-700 leading-relaxed space-y-3">
                {section.content}
              </div>

              {/* Real-World Numerical Example Box */}
              {section.example && (
                <div className="bg-[#F3FBF7] border border-[#BFE5D3] p-5 sm:p-6 rounded-3xl space-y-4 mt-6">
                  <div className="flex items-center gap-2 text-[#12372A] font-extrabold text-sm">
                    <Calculator className="w-5 h-5 text-[#1F8F68]" />
                    <span>{section.example.title}</span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium italic bg-white/70 p-3 rounded-xl border border-[#BFE5D3]/40">
                    {section.example.scenario}
                  </p>

                  <div className="space-y-2 text-xs font-semibold">
                    {section.example.breakdown.map((row, rIdx) => (
                      <div
                        key={rIdx}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#BFE5D3]/50"
                      >
                        <span className="text-[#12372A]">{row.label}</span>
                        <div className="text-right">
                          <span className="font-bold text-[#1F8F68] block">{row.value}</span>
                          {row.note && <span className="text-[10px] text-slate-400 font-normal">{row.note}</span>}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#1F8F68] text-white p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs">
                    <span>💡 Bottom Line:</span>
                    <span>{section.example.takeaway}</span>
                  </div>
                </div>
              )}
            </section>
          ))}
        </article>

        {/* Interactive CTA Card */}
        <section className="bg-[#12372A] text-white p-7 sm:p-9 rounded-3xl space-y-4 text-center relative overflow-hidden shadow-xl border border-[#BFE5D3]/30">
          <div className="absolute -top-20 -right-20 w-56 h-56 bg-[#1F8F68]/25 rounded-full blur-3xl pointer-events-none" />
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Calculate Your Custom Take-Home Pay Now
          </h3>
          <p className="text-xs sm:text-sm text-[#EAF7F1]/80 max-w-xl mx-auto font-medium">
            Test your exact salary, contractor rate, filing status, and location in PayScope's 2026 statutory tax engine with instant live recalculations.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#1F8F68] hover:bg-[#176F52] text-white font-extrabold text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-[#1F8F68]/30 transition-all border border-[#1F8F68]"
          >
            <span>⚡ Open PayScope Live Calculator</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* Frequently Asked Questions */}
        {topic.faqs && topic.faqs.length > 0 && (
          <section className="space-y-6 pt-4 border-t border-[#BFE5D3]/60">
            <div className="flex items-center gap-2 text-xl font-black text-[#12372A]">
              <HelpCircle className="w-6 h-6 text-[#1F8F68]" />
              <h2>Frequently Asked Questions</h2>
            </div>
            <div className="space-y-4">
              {topic.faqs.map((faq, idx) => (
                <div key={idx} className="bg-white border border-[#BFE5D3] p-5 rounded-2xl space-y-2 shadow-2xs">
                  <h3 className="text-sm font-bold text-[#12372A]">Q: {faq.question}</h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">A: {faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Guides Recommendation */}
        <section className="space-y-6 pt-6 border-t border-[#BFE5D3]/60">
          <h2 className="text-xl font-black text-[#12372A]">Related Financial Guides</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedTopics.map((rel) => (
              <Link
                key={rel.slug}
                href={`/resources/${rel.slug}`}
                className="bg-white border border-[#BFE5D3] p-5 rounded-2xl space-y-2 hover:border-[#1F8F68] transition-all group flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <span className="text-[10px] font-extrabold text-[#1F8F68] uppercase tracking-wider block">
                    {rel.category}
                  </span>
                  <h3 className="text-xs font-bold text-[#12372A] group-hover:text-[#1F8F68] transition-colors">
                    {rel.shortTitle}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{rel.summary}</p>
                </div>
                <div className="text-[11px] font-bold text-[#1F8F68] flex items-center gap-1 pt-2">
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
