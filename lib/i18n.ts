export type SupportedLanguage = 'en' | 'es' | 'pt';

export interface TranslationDictionary {
  motto: string;
  knowIncomeWorth: string;
  calculateResults: string;
  financialSnapshot: string;
  takeHomePay: string;
  taxesDeductions: string;
  costOfLiving: string;
  housingAffordability: string;
  purchasingPower: string;
  exploreDashboard: string;
  contractBillingRate: string;
  monthlyRevenue: string;
  annualRevenue: string;
  effectiveHourlyRate: string;
  grossIncome: string;
  netIncome: string;
  country: string;
  currency: string;
  language: string;
  recalculating: string;
  recruitSubtitle: string;
}

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    motto: 'Know what your income is really worth.',
    knowIncomeWorth: 'Know what your income is really worth.',
    calculateResults: 'Calculate My Results',
    financialSnapshot: "Here's your financial snapshot",
    takeHomePay: 'Take-Home Pay',
    taxesDeductions: 'Taxes & Deductions',
    costOfLiving: 'Cost of Living Index',
    housingAffordability: 'Housing & Rent Benchmark',
    purchasingPower: 'Real Purchasing Power',
    exploreDashboard: 'Explore Full Dashboard →',
    contractBillingRate: 'Contract Billing Rate',
    monthlyRevenue: 'Monthly Contract Revenue',
    annualRevenue: 'Annual Contract Revenue',
    effectiveHourlyRate: 'Effective Hourly Rate',
    grossIncome: 'Gross Income',
    netIncome: 'Net Take-Home Pay',
    country: 'Country',
    currency: 'Currency',
    language: 'Language',
    recalculating: 'Recalculating financial snapshot...',
    recruitSubtitle: 'Built for recruiters, staffing agencies & talent teams.',
  },
  es: {
    motto: 'Descubre el valor real de tus ingresos.',
    knowIncomeWorth: 'Conoce el valor real de tus ingresos.',
    calculateResults: 'Calcular Mis Resultados',
    financialSnapshot: 'Tu resumen financiero completo',
    takeHomePay: 'Salario Neto Libre',
    taxesDeductions: 'Impuestos y Deducciones',
    costOfLiving: 'Índice del Costo de Vida',
    housingAffordability: 'Vivienda y Renta Estimada',
    purchasingPower: 'Poder Adquisitivo Real',
    exploreDashboard: 'Explorar Panel Completo →',
    contractBillingRate: 'Tarifa de Facturación',
    monthlyRevenue: 'Ingreso Mensual del Contrato',
    annualRevenue: 'Ingreso Anual del Contrato',
    effectiveHourlyRate: 'Tarifa Por Hora Efectiva',
    grossIncome: 'Ingreso Bruto Total',
    netIncome: 'Ingreso Neto Disponible',
    country: 'País',
    currency: 'Moneda',
    language: 'Idioma',
    recalculating: 'Recalculando resumen financiero...',
    recruitSubtitle: 'Diseñado para reclutadores y equipos de talento.',
  },
  pt: {
    motto: 'Saiba o real valor dos seus rendimentos.',
    knowIncomeWorth: 'Saiba o quanto sua renda realmente vale.',
    calculateResults: 'Calcular Meus Resultados',
    financialSnapshot: 'Seu resumo financeiro completo',
    takeHomePay: 'Salário Líquido Real',
    taxesDeductions: 'Impostos e Deduções',
    costOfLiving: 'Índice de Custo de Vida',
    housingAffordability: 'Benchmark de Habitação e Aluguel',
    purchasingPower: 'Poder de Compra Real',
    exploreDashboard: 'Explorar Painel Completo →',
    contractBillingRate: 'Taxa de Faturamento PJ',
    monthlyRevenue: 'Receita Mensal do Contrato',
    annualRevenue: 'Receita Anual do Contrato',
    effectiveHourlyRate: 'Valor Hora Efetivo',
    grossIncome: 'Rendimento Bruto',
    netIncome: 'Rendimento Líquido',
    country: 'País',
    currency: 'Moeda',
    language: 'Idioma',
    recalculating: 'Recalculando resumo financeiro...',
    recruitSubtitle: 'Criado para recrutadores e equipes de talentos.',
  },
};

export function getTranslation(lang: SupportedLanguage = 'en'): TranslationDictionary {
  return translations[lang] || translations.en;
}
