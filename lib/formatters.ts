import { CurrencyCode } from './types';

export function isContractorRole(employmentType: string): boolean {
  if (!employmentType) return false;
  const lower = employmentType.toLowerCase();

  // Full-time and standard payroll employees are NOT contractors
  if (lower.includes('full-time') || lower.includes('w-2') || lower.includes('t4') || lower.includes('clt') || lower.includes('sueldo')) {
    return false;
  }

  return (
    lower.includes('contractor') ||
    lower.includes('1099') ||
    lower.includes('c2c') ||
    lower.includes('freelancer') ||
    lower.includes('resico') ||
    lower.includes('autônomo') ||
    lower.includes('pj') ||
    lower.includes('incorporated') ||
    lower.includes('contract')
  );
}

export function formatCurrency(
  amount: number,
  currency: CurrencyCode = 'USD',
  compact = false
): string {
  const symbolMap: Record<CurrencyCode, string> = {
    USD: '$',
    CAD: 'CA$',
    MXN: 'MX$',
    BRL: 'R$',
  };

  const symbol = symbolMap[currency] || '$';

  if (compact && Math.abs(amount) >= 1000) {
    if (Math.abs(amount) >= 1000000) {
      return `${symbol}${(amount / 1000000).toFixed(1)}M`;
    }
    return `${symbol}${Math.round(amount / 1000)}k`;
  }

  return `${symbol}${Math.round(amount).toLocaleString('en-US')}`;
}

export function formatPercent(value: number, includeSign = false): string {
  const sign = includeSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

export function formatNumber(value: number): string {
  return value.toLocaleString('en-US');
}
