import type { Metadata } from 'next';
import { Great_Vibes, EB_Garamond } from 'next/font/google';
import './globals.css';

const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-great-vibes',
  display: 'swap',
});

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-eb-garamond',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PayScope',
  description:
    'A location-aware financial intelligence platform for the Americas — combining income, taxes, take-home pay, local economics, housing, inflation, transportation and purchasing power into one personalized financial snapshot.',
  icons: {
    icon: [
      { url: '/assets/title-logo.png', type: 'image/png' },
      { url: '/icon.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/assets/title-logo.png',
    apple: '/assets/title-logo.png',
  },
  keywords: [
    'Payscale',
    'PayScope',
    'Salary Calculator',
    'Contractor Tax Calculator',
    'Take Home Pay',
    'Cost of Living',
    'Housing Affordability',
    'Financial Snapshot',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${greatVibes.variable} ${ebGaramond.variable}`}>
      <body className="antialiased font-eb-garamond selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
