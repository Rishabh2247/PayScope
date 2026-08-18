import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Payscale | Know What Your Income Is Really Worth',
  description:
    'A location-aware financial intelligence platform for the Americas — combining income, taxes, take-home pay, local economics, housing, inflation, transportation and purchasing power into one personalized financial snapshot.',
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
    <html lang="en">
      <body className="antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
