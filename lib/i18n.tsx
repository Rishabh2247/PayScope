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
  trustedByThousands: string;
  acrossNorthAmerica: string;
  backedByOfficialData: string;
  yourIncomeDecoded: string;
  allInOnePlace: string;
  heroSubtitle: string;

  // Details Form
  yourDetails: string;
  yourFinancialDetails: string;
  just3Things: string;
  employmentTypeLabel: string;
  employmentTypeAndTaxTerm: string;
  annualSalaryLabel: string;
  hourlyRateLabel: string;
  annualGrossIncome: string;
  stateProvinceLabel: string;
  cityLabel: string;
  filingStatusLabel: string;
  filingStatus: string;
  single: string;
  marriedFilingJointly: string;
  headOfHousehold: string;
  dependentsLabel: string;
  dependents: string;
  advancedOptions: string;
  moreDetailsAccordion: string;
  workHoursPerWeek: string;
  weeksPerYear: string;
  k401Label: string;
  k401Contribution: string;
  healthInsuranceLabel: string;
  expenseWriteoffLabel: string;
  businessExpenseWriteoff: string;
  defaultsApplied: string;

  // Snapshot Card
  liveInstantEstimate: string;
  contractorTaxMode: string;
  employeeMode: string;
  estimatedMonthlyTakeHome: string;
  effectiveTaxRate: string;
  contractorIncomeBreakdown: string;
  salaryTakeHomeBreakdown: string;
  monthlyPayLabel: string;
  yearlyTotalLabel: string;
  beforeTax: string;
  afterTaxNet: string;
  seeFullSnapshot: string;
  updatesLive: string;
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

  // Dashboard & Cards
  overview: string;
  taxEngine: string;
  rateAnalysis: string;
  benchmarks: string;
  housing: string;
  fuelCommute: string;
  fuelCommuteTitle: string;
  realIncome: string;
  taxBreakdown: string;
  housingSnapshot: string;
  incomeVsBenchmark: string;
  costOfLivingTitle: string;
  relocation: string;
  reports: string;
  support: string;
  settings: string;
  downloadReport: string;
  detailedBreakdown: string;
  editValues: string;

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
    trustedByThousands: 'Trusted by thousands',
    acrossNorthAmerica: 'across North America',
    backedByOfficialData: 'Built using official tax rules & economic data',
    yourIncomeDecoded: 'Your income. Decoded.',
    allInOnePlace: 'All in one place.',
    heroSubtitle: 'See your estimated take-home pay, taxes, cost of living, and purchasing power — personalized to your city, in under a minute.',

    yourDetails: 'Your Financial Details',
    yourFinancialDetails: 'Your financial details',
    just3Things: 'Just 3 things to start - add more for a sharper estimate.',
    employmentTypeLabel: 'Employment Type',
    employmentTypeAndTaxTerm: 'Employment type / Tax term',
    annualSalaryLabel: 'Annual Gross Income / Salary',
    hourlyRateLabel: 'Hourly Rate',
    annualGrossIncome: 'Annual Gross Income',
    stateProvinceLabel: 'State / Province',
    cityLabel: 'City',
    filingStatusLabel: 'Filing Status',
    filingStatus: 'Filing status',
    single: 'Single',
    marriedFilingJointly: 'Married Filing Jointly',
    headOfHousehold: 'Head of Household',
    dependentsLabel: 'Dependents',
    dependents: 'Dependents',
    advancedOptions: 'Advanced Tax & Expense Options',
    moreDetailsAccordion: '⚡ More details - hours/week, dependents, advanced tax options',
    workHoursPerWeek: 'Work Hours / Week',
    weeksPerYear: 'Weeks / Year',
    k401Label: '401k / RRSP Contribution (%)',
    k401Contribution: '401(k) Contribution (%)',
    healthInsuranceLabel: 'Health Insurance ($/mo)',
    expenseWriteoffLabel: 'Business Write-offs (%)',
    businessExpenseWriteoff: 'Business Expense Write-off',
    defaultsApplied: 'Defaults applied: 40 hrs/week, 52 weeks/year - editable anytime.',

    liveInstantEstimate: 'Live Instant Estimate',
    contractorTaxMode: 'Contractor Tax Mode',
    employeeMode: 'Employee Mode',
    estimatedMonthlyTakeHome: 'Estimated Monthly Take-Home (Net Pay)',
    effectiveTaxRate: 'effective tax & deduction rate',
    contractorIncomeBreakdown: 'Contractor Income & Net Pay Breakdown',
    salaryTakeHomeBreakdown: 'Salary vs Take-Home Breakdown',
    monthlyPayLabel: 'Monthly Pay',
    yearlyTotalLabel: 'Yearly Total',
    beforeTax: 'Before Tax',
    afterTaxNet: 'After Tax Net',
    seeFullSnapshot: 'See My Financial Snapshot →',
    updatesLive: 'Updates live as you tweak parameters - 100% free & private.',
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
    fuelCommuteTitle: 'Fuel & Commute Calculator',
    realIncome: 'Real Take-Home Income',
    taxBreakdown: 'Tax & Deduction Breakdown',
    housingSnapshot: 'Housing & Rent Snapshot',
    incomeVsBenchmark: 'Income vs Local Benchmark',
    costOfLivingTitle: 'Cost of Living Index',
    relocation: 'Relocation',
    reports: 'Reports',
    support: 'Support',
    settings: 'Settings',
    downloadReport: 'Download Report',
    detailedBreakdown: 'Detailed breakdown',
    editValues: 'Edit',

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
    trustedByThousands: 'Con la confianza de miles',
    acrossNorthAmerica: 'en toda América del Norte',
    backedByOfficialData: 'Construido con reglas fiscales y datos económicos oficiales',
    yourIncomeDecoded: 'Tus ingresos. Decodificados.',
    allInOnePlace: 'Todo en un solo lugar.',
    heroSubtitle: 'Conoce tu salario neto estimado, impuestos, costo de vida y poder adquisitivo — personalizado para tu ciudad, en menos de un minuto.',

    yourDetails: 'Tus Datos Financieros',
    yourFinancialDetails: 'Tus datos financieros',
    just3Things: 'Solo 3 datos para comenzar - agrega más para mayor precisión.',
    employmentTypeLabel: 'Tipo de Empleo',
    employmentTypeAndTaxTerm: 'Tipo de empleo / Régimen fiscal',
    annualSalaryLabel: 'Ingreso Bruto Anual / Salario',
    hourlyRateLabel: 'Tarifa por Hora',
    annualGrossIncome: 'Ingreso Bruto Anual',
    stateProvinceLabel: 'Estado / Provincia',
    cityLabel: 'Ciudad',
    filingStatusLabel: 'Estado Civil / Fiscal',
    filingStatus: 'Estado fiscal',
    single: 'Soltero(a)',
    marriedFilingJointly: 'Casado(a) Declaración Conjunta',
    headOfHousehold: 'Cabeza de Familia',
    dependentsLabel: 'Dependientes',
    dependents: 'Dependientes',
    advancedOptions: 'Opciones Avanzadas de Impuestos',
    moreDetailsAccordion: '⚡ Más detalles - horas/semana, dependientes, opciones fiscales',
    workHoursPerWeek: 'Horas de Trabajo / Semana',
    weeksPerYear: 'Semanas / Año',
    k401Label: 'Aportación Retiro / 401k (%)',
    k401Contribution: 'Aportación Retiro (%)',
    healthInsuranceLabel: 'Seguro de Salud ($/mes)',
    expenseWriteoffLabel: 'Deducciones de Negocio (%)',
    businessExpenseWriteoff: 'Deducción de Gastos de Negocio',
    defaultsApplied: 'Valores por defecto: 40 hrs/semana, 52 semanas/año - editable en cualquier momento.',

    liveInstantEstimate: 'Estimación en Vivo',
    contractorTaxMode: 'Modo Impuestos Contratista',
    employeeMode: 'Modo Empleado',
    estimatedMonthlyTakeHome: 'Salario Neto Mensual Estimado',
    effectiveTaxRate: 'tasa efectiva de impuestos y deducciones',
    contractorIncomeBreakdown: 'Desglose de Ingresos y Salario Neto Contratista',
    salaryTakeHomeBreakdown: 'Desglose de Salario vs Neto Libre',
    monthlyPayLabel: 'Pago Mensual',
    yearlyTotalLabel: 'Total Anual',
    beforeTax: 'Antes de Impuestos',
    afterTaxNet: 'Neto Libre',
    seeFullSnapshot: 'Ver mi resumen financiero completo →',
    updatesLive: 'Se actualiza en vivo al modificar parámetros - 100% gratis y privado.',
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
    fuelCommuteTitle: 'Calculadora de Combustible y Movilidad',
    realIncome: 'Ingreso Neto Real',
    taxBreakdown: 'Desglose de Impuestos',
    housingSnapshot: 'Vivienda y Renta Estimada',
    incomeVsBenchmark: 'Ingreso vs Promedio Local',
    costOfLivingTitle: 'Índice de Costo de Vida',
    relocation: 'Relocalización',
    reports: 'Reportes',
    support: 'Soporte',
    settings: 'Configuración',
    downloadReport: 'Descargar Reporte',
    detailedBreakdown: 'Desglose detallado',
    editValues: 'Editar',

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
    trustedByThousands: 'Com a confiança de milhares',
    acrossNorthAmerica: 'em toda a América do Norte',
    backedByOfficialData: 'Construído com regras fiscais e dados econômicos oficiais',
    yourIncomeDecoded: 'Sua renda. Decodificada.',
    allInOnePlace: 'Tudo em um só lugar.',
    heroSubtitle: 'Veja seu salário líquido estimado, impostos, custo de vida e poder de compra — personalizado para sua cidade, em menos de um minuto.',

    yourDetails: 'Seus Dados Financeiros',
    yourFinancialDetails: 'Seus dados financeiros',
    just3Things: 'Apenas 3 dados para começar - adicione mais para maior precisão.',
    employmentTypeLabel: 'Tipo de Emprego',
    employmentTypeAndTaxTerm: 'Tipo de emprego / Regime fiscal',
    annualSalaryLabel: 'Rendimento Bruto Anual / Salário',
    hourlyRateLabel: 'Valor por Hora PJ',
    annualGrossIncome: 'Rendimento Bruto Anual',
    stateProvinceLabel: 'Estado / Província',
    cityLabel: 'Cidade',
    filingStatusLabel: 'Estado Civil / Fiscal',
    filingStatus: 'Estado fiscal',
    single: 'Solteiro(a)',
    marriedFilingJointly: 'Casado(a) Declaração Conjunta',
    headOfHousehold: 'Chefe de Família',
    dependentsLabel: 'Dependentes',
    dependents: 'Dependentes',
    advancedOptions: 'Opções Avançadas de Impostos',
    moreDetailsAccordion: '⚡ Mais detalhes - horas/semana, dependentes, opções fiscais',
    workHoursPerWeek: 'Horas de Trabalho / Semana',
    weeksPerYear: 'Semanas / Ano',
    k401Label: 'Contribuição Previdência (%)',
    k401Contribution: 'Contribuição Previdência (%)',
    healthInsuranceLabel: 'Plano de Saúde ($/mês)',
    expenseWriteoffLabel: 'Despesas Dedutíveis (%)',
    businessExpenseWriteoff: 'Dedução de Despesas PJ',
    defaultsApplied: 'Valores padrão: 40 hrs/semana, 52 semanas/ano - editável a qualquer momento.',

    liveInstantEstimate: 'Estimativa ao Vivo',
    contractorTaxMode: 'Modo Impostos PJ',
    employeeMode: 'Modo CLT / Empregado',
    estimatedMonthlyTakeHome: 'Rendimento Líquido Mensal Estimado',
    effectiveTaxRate: 'taxa efetiva de impostos e deduções',
    contractorIncomeBreakdown: 'Detalhamento de Renda e Salário Líquido PJ',
    salaryTakeHomeBreakdown: 'Detalhamento de Salário vs Líquido',
    monthlyPayLabel: 'Pagamento Mensal',
    yearlyTotalLabel: 'Total Anual',
    beforeTax: 'Antes de Impostos',
    afterTaxNet: 'Líquido',
    seeFullSnapshot: 'Ver meu resumo financeiro completo →',
    updatesLive: 'Atualiza ao vivo ao ajustar parâmetros - 100% gratuito e privado.',
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
    fuelCommuteTitle: 'Calculadora de Combustível e Transporte',
    realIncome: 'Renda Líquida Real',
    taxBreakdown: 'Detalhamento de Impostos',
    housingSnapshot: 'Habitação e Aluguel Estimado',
    incomeVsBenchmark: 'Renda vs Comparativo Local',
    costOfLivingTitle: 'Índice de Custo de Vida',
    relocation: 'Relocalização',
    reports: 'Relatórios',
    support: 'Suporte',
    settings: 'Configurações',
    downloadReport: 'Baixar Relatório',
    detailedBreakdown: 'Detalhamento completo',
    editValues: 'Editar',

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
