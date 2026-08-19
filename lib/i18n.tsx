'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CountryCode } from './types';

export type SupportedLanguage = 'en' | 'es' | 'pt';

export interface TranslationDictionary {
  // Hero & General
  heroTitle1: string;
  heroTitle2: string;
  heroTitle3: string;
  heroSub: string;
  knowIncomeWorth: string;
  calculateResults: string;
  financialSnapshot: string;
  estimatedBadge: string;
  contractEstimateBadge: string;
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

  // Details Form
  yourDetails: string;
  employmentTypeLabel: string;
  annualSalaryLabel: string;
  hourlyRateLabel: string;
  stateProvinceLabel: string;
  cityLabel: string;
  filingStatusLabel: string;
  dependentsLabel: string;
  advancedOptions: string;
  k401Label: string;
  healthInsuranceLabel: string;
  expenseWriteoffLabel: string;

  // Snapshot Card
  afterTaxesDeductions: string;
  monthlyNetIncome: string;
  annualNetIncome: string;
  estimatedMonthlyHousing: string;
  estimatedMonthlyFuel: string;
  inflationImpact: string;
  purchasingPowerNeeded: string;
  disclaimerTextEmployee: string;
  disclaimerTextContractor: string;
  readDisclaimer: string;

  // Dashboard
  overview: string;
  taxEngine: string;
  rateAnalysis: string;
  benchmarks: string;
  housing: string;
  fuelCommute: string;
  relocation: string;
  reports: string;
  support: string;
  settings: string;
  downloadReport: string;
  detailedBreakdown: string;

  // Footer
  officialDataSources: string;
  verifiedFeeds: string;
  allRightsReserved: string;
  quickLinks: string;
  legal: string;
}

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    heroTitle1: 'Your Income.',
    heroTitle2: 'Decoded.',
    heroTitle3: 'All in One.',
    heroSub: 'Calculate your take-home pay, taxes, cost of living, inflation impact, fuel expenses and see how your income compares in your city.',
    knowIncomeWorth: 'Know what your income is really worth.',
    calculateResults: 'Calculate My Results',
    financialSnapshot: "Here's your financial snapshot",
    estimatedBadge: 'Estimated',
    contractEstimateBadge: 'Contract Estimate',
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

    yourDetails: 'Your Financial Details',
    employmentTypeLabel: 'Employment Type',
    annualSalaryLabel: 'Annual Gross Income / Salary',
    hourlyRateLabel: 'Contract Billing Rate ($/hr)',
    stateProvinceLabel: 'State / Province',
    cityLabel: 'City',
    filingStatusLabel: 'Filing Status',
    dependentsLabel: 'Dependents',
    advancedOptions: 'Advanced Tax & Expense Options',
    k401Label: '401k / RRSP Contribution (%)',
    healthInsuranceLabel: 'Health Insurance ($/mo)',
    expenseWriteoffLabel: 'Business Write-offs (%)',

    afterTaxesDeductions: 'After taxes & deductions',
    monthlyNetIncome: 'Monthly net income',
    annualNetIncome: 'Annual net income',
    estimatedMonthlyHousing: 'Estimated monthly rent',
    estimatedMonthlyFuel: 'Estimated monthly fuel',
    inflationImpact: 'Annual inflation rate',
    purchasingPowerNeeded: 'Needed next year to maintain purchasing power',
    disclaimerTextEmployee: 'Estimates are for informational purposes only and may vary based on your location, tax year, employment type, deductions and individual circumstances.',
    disclaimerTextContractor: 'Contract and business estimates may differ based on business expenses, corporate structure, compensation method and applicable tax rules.',
    readDisclaimer: 'Read Disclaimer',

    overview: 'Overview',
    taxEngine: 'Tax Engine',
    rateAnalysis: 'Rate Analysis',
    benchmarks: 'Benchmarks',
    housing: 'Housing',
    fuelCommute: 'Fuel & Commute',
    relocation: 'Relocation',
    reports: 'Reports',
    support: 'Support',
    settings: 'Settings',
    downloadReport: 'Download Report',
    detailedBreakdown: 'Detailed breakdown',

    officialDataSources: 'Official Data Sources & Information Providers',
    verifiedFeeds: 'Verified Statutory & Economic Feeds',
    allRightsReserved: 'All rights reserved.',
    quickLinks: 'Quick Links',
    legal: 'Legal',
  },

  es: {
    heroTitle1: 'Tu Ingreso.',
    heroTitle2: 'Decodificado.',
    heroTitle3: 'Todo en Uno.',
    heroSub: 'Calcula tu salario neto, impuestos, costo de vida, impacto de inflación y gastos de transporte en tu ciudad.',
    knowIncomeWorth: 'Conoce el valor real de tus ingresos.',
    calculateResults: 'Calcular Mis Resultados',
    financialSnapshot: 'Tu resumen financiero completo',
    estimatedBadge: 'Estimado',
    contractEstimateBadge: 'Estimación Contrato',
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

    yourDetails: 'Tus Datos Financieros',
    employmentTypeLabel: 'Tipo de Empleo',
    annualSalaryLabel: 'Ingreso Bruto Anual / Salario',
    hourlyRateLabel: 'Tarifa de Facturación ($/hr)',
    stateProvinceLabel: 'Estado / Provincia',
    cityLabel: 'Ciudad',
    filingStatusLabel: 'Estado Civil / Fiscal',
    dependentsLabel: 'Dependientes',
    advancedOptions: 'Opciones Avanzadas de Impuestos',
    k401Label: 'Aportación Retiro / 401k (%)',
    healthInsuranceLabel: 'Seguro de Salud ($/mes)',
    expenseWriteoffLabel: 'Deducciones de Negocio (%)',

    afterTaxesDeductions: 'Después de impuestos y deducciones',
    monthlyNetIncome: 'Ingreso neto mensual',
    annualNetIncome: 'Ingreso neto anual',
    estimatedMonthlyHousing: 'Renta mensual estimada',
    estimatedMonthlyFuel: 'Combustible mensual estimado',
    inflationImpact: 'Tasa de inflación anual',
    purchasingPowerNeeded: 'Requerido el próximo año para mantener poder adquisitivo',
    disclaimerTextEmployee: 'Las estimaciones son informativas y pueden variar según ubicación, año fiscal, tipo de empleo y deducciones individuales.',
    disclaimerTextContractor: 'Las estimaciones de contrato varían según gastos de negocio, estructura corporativa y reglas fiscales aplicables.',
    readDisclaimer: 'Leer Aviso Legal',

    overview: 'Resumen General',
    taxEngine: 'Motor de Impuestos',
    rateAnalysis: 'Análisis de Tarifas',
    benchmarks: 'Comparativas',
    housing: 'Vivienda',
    fuelCommute: 'Combustible y Movilidad',
    relocation: 'Relocalización',
    reports: 'Reportes',
    support: 'Soporte',
    settings: 'Configuración',
    downloadReport: 'Descargar Reporte',
    detailedBreakdown: 'Desglose detallado',

    officialDataSources: 'Fuentes Oficiales y Proveedores de Información',
    verifiedFeeds: 'Fuentes Estatutarias y Económicas Verificadas',
    allRightsReserved: 'Todos los derechos reservados.',
    quickLinks: 'Enlaces Rápidos',
    legal: 'Legal',
  },

  pt: {
    heroTitle1: 'Sua Renda.',
    heroTitle2: 'Decodificada.',
    heroTitle3: 'Tudo em Um.',
    heroSub: 'Calcule seu salário líquido, impostos, custo de vida, impacto da inflação e despesas de transporte na sua cidade.',
    knowIncomeWorth: 'Saiba o quanto sua renda realmente vale.',
    calculateResults: 'Calcular Meus Resultados',
    financialSnapshot: 'Seu resumo financeiro completo',
    estimatedBadge: 'Estimado',
    contractEstimateBadge: 'Estimativa PJ',
    takeHomePay: 'Salário Líquido Real',
    taxesDeductions: 'Impostos e Deduções',
    costOfLiving: 'Índice de Custo de Vida',
    housingAffordability: 'Habitação e Aluguel Estimado',
    purchasingPower: 'Poder de Compra Real',
    exploreDashboard: 'Explorar Painel Completo →',
    contractBillingRate: 'Taxa de Faturamento PJ',
    monthlyRevenue: 'Receita Mensal do Contrato',
    annualRevenue: 'Receita Anual do Contrato',
    effectiveHourlyRate: 'Valor Hora Efetivo',
    grossIncome: 'Rendimento Bruto Total',
    netIncome: 'Rendimento Líquido',
    country: 'País',
    currency: 'Moeda',
    language: 'Idioma',
    recalculating: 'Recalculando resumo financeiro...',
    recruitSubtitle: 'Criado para recrutadores e equipes de talentos.',

    yourDetails: 'Seus Dados Financeiros',
    employmentTypeLabel: 'Tipo de Emprego / Vínculo',
    annualSalaryLabel: 'Rendimento Bruto Anual / Salário',
    hourlyRateLabel: 'Taxa de Faturamento PJ ($/hr)',
    stateProvinceLabel: 'Estado / Província',
    cityLabel: 'Cidade',
    filingStatusLabel: 'Estado Civil / Fiscal',
    dependentsLabel: 'Dependentes',
    advancedOptions: 'Opções Avançadas de Impostos',
    k401Label: 'Contribuição Previdência (%)',
    healthInsuranceLabel: 'Plano de Saúde ($/mês)',
    expenseWriteoffLabel: 'Despesas Dedutíveis (%)',

    afterTaxesDeductions: 'Após impostos e deduções',
    monthlyNetIncome: 'Rendimento líquido mensal',
    annualNetIncome: 'Rendimento líquido anual',
    estimatedMonthlyHousing: 'Aluguel mensal estimado',
    estimatedMonthlyFuel: 'Combustível mensal estimado',
    inflationImpact: 'Taxa de inflação anual',
    purchasingPowerNeeded: 'Necessário no próximo ano para manter poder de compra',
    disclaimerTextEmployee: 'As estimativas são informativas e podem variar conforme localização, ano fiscal, tipo de contrato e deduções.',
    disclaimerTextContractor: 'Estimativas PJ variam conforme despesas, estrutura corporativa e regime tributário aplicável.',
    readDisclaimer: 'Ler Aviso Legal',

    overview: 'Visão Geral',
    taxEngine: 'Motor de Impostos',
    rateAnalysis: 'Análise de Taxas',
    benchmarks: 'Comparativos',
    housing: 'Habitação',
    fuelCommute: 'Combustível e Transporte',
    relocation: 'Relocalização',
    reports: 'Relatórios',
    support: 'Suporte',
    settings: 'Configurações',
    downloadReport: 'Baixar Relatório',
    detailedBreakdown: 'Detalhamento completo',

    officialDataSources: 'Fontes Oficiais e Provedores de Informação',
    verifiedFeeds: 'Dados Estatutários e Econômicos Verificados',
    allRightsReserved: 'Todos os direitos reservados.',
    quickLinks: 'Links Rápidos',
    legal: 'Legal',
  },
};

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: TranslationDictionary;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: translations.en,
});

export const LanguageProvider: React.FC<{
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  children: React.ReactNode;
}> = ({ language, setLanguage, children }) => {
  const t = translations[language] || translations.en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => useContext(LanguageContext);

export function getTranslation(lang: SupportedLanguage = 'en'): TranslationDictionary {
  return translations[lang] || translations.en;
}
