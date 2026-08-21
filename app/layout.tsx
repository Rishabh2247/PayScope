import type { Metadata } from 'next';
import { Great_Vibes, Playfair_Display, Cormorant_Garamond, Lora, Domine } from 'next/font/google';
import './globals.css';

const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-great-vibes',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const cormorantGaramond = Cormorant_Garamond({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
});

const lora = Lora({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
});

const domine = Domine({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-domine',
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
    <html lang="en" className={`${greatVibes.variable} ${playfairDisplay.variable} ${cormorantGaramond.variable} ${lora.variable} ${domine.variable}`}>
      <body className="antialiased font-rogles selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
