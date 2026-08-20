import { FinancialInputs, TaxCalculationResult, TaxDeductionItem } from '../types';
import { BR_RECEITA_TAX_2026 } from '../tax-rules/brazil/2026/receita';

export function calculateBRTax(inputs: FinancialInputs): TaxCalculationResult {
  const hoursPerWeek = inputs.workHoursPerWeek || 40;
  const weeksPerYear = inputs.weeksPerYear || 52;
  const annualHours = hoursPerWeek * weeksPerYear;

  const gross = inputs.annualSalary || (inputs.incomeRate ? inputs.incomeRate * annualHours : 120000);
  const monthlyGross = gross / 12;
  const empType = inputs.employmentType || 'CLT (Employee)';

  let inssAnnual = 0;
  let irrfAnnual = 0;
  let simplesPjTax = 0;
  let businessWriteOffs = 0;

  const brRules = BR_RECEITA_TAX_2026;

  if (empType.includes('PJ Simples') || empType.includes('PJ') || empType.includes('PJ Contractor')) {
    // PJ Simples Nacional (Anexo III)
    let rate = 0.06; // Base 6% up to 180k BRL
    for (const b of brRules.simplesNacionalPJ) {
      if (gross > b.min) rate = b.rate;
    }
    simplesPjTax = gross * rate;
    inssAnnual = Math.min(monthlyGross * 0.11, brRules.inssTeto) * 12;

  } else {
    // CLT Payroll Employee
    // Monthly INSS calculation
    let monthlyInss = 0;
    for (const b of brRules.inssBrackets) {
      if (monthlyGross > b.min) {
        const chunk = b.max ? Math.min(monthlyGross - b.min, b.max - b.min) : monthlyGross - b.min;
        monthlyInss += chunk * b.rate;
      }
    }
    monthlyInss = Math.min(monthlyInss, brRules.inssTeto);
    inssAnnual = monthlyInss * 12;

    // Monthly IRRF calculation (gross less INSS)
    const monthlyBaseIRRF = Math.max(0, monthlyGross - monthlyInss);
    let monthlyIrrf = 0;
    for (const b of brRules.irrfBrackets) {
      if (monthlyBaseIRRF > b.min) {
        const chunk = b.max ? Math.min(monthlyBaseIRRF - b.min, b.max - b.min) : monthlyBaseIRRF - b.min;
        monthlyIrrf += chunk * b.rate;
      }
    }
    irrfAnnual = monthlyIrrf * 12;
  }

  const mandatoryDeductions = irrfAnnual + inssAnnual + simplesPjTax;
  const takeHomePayAnnual = Math.max(0, gross - mandatoryDeductions - businessWriteOffs);
  const takeHomePayMonthly = takeHomePayAnnual / 12;

  const grossHourlyRate = annualHours > 0 ? gross / annualHours : 0;
  const effectiveHourlyRate = annualHours > 0 ? takeHomePayAnnual / annualHours : 0;
  const takeHomePercentage = gross > 0 ? (takeHomePayAnnual / gross) * 100 : 0;

  const breakdown: TaxDeductionItem[] = [
    {
      name: 'Net Take-Home Pay',
      amount: takeHomePayAnnual,
      percentage: takeHomePercentage,
      color: '#1F8F68',
    },
    {
      name: simplesPjTax > 0 ? 'Simples Nacional PJ Tax' : 'IRRF (Imposto de Renda Receita Federal)',
      amount: simplesPjTax > 0 ? simplesPjTax : irrfAnnual,
      percentage: ((simplesPjTax > 0 ? simplesPjTax : irrfAnnual) / gross) * 100,
      color: '#EF4444',
    },
  ];

  if (inssAnnual > 0) {
    breakdown.push({
      name: 'INSS Previdência Social',
      amount: inssAnnual,
      percentage: (inssAnnual / gross) * 100,
      color: '#3B82F6',
    });
  }

  return {
    grossIncome: gross,
    annualGross: gross,
    monthlyGross: gross / 12,
    annualBillableHours: annualHours,
    grossHourlyRate,
    takeHomePayAnnual,
    takeHomePayMonthly,
    effectiveHourlyRate,
    takeHomePercentage,
    annualContractRevenue: gross,
    monthlyContractRevenue: gross / 12,
    contractBillingRate: grossHourlyRate,
    contractNetHourlyRate: effectiveHourlyRate,
    monthlyGrossContract: gross / 12,
    monthlyNetContract: takeHomePayMonthly,
    annualGrossContract: gross,
    annualNetContract: takeHomePayAnnual,
    businessExpenses: businessWriteOffs,
    businessTax: simplesPjTax,
    ownerCompensation: takeHomePayAnnual,
    estimatedPersonalTakeHome: takeHomePayAnnual,
    effectivePersonalNetRate: effectiveHourlyRate,
    federalTax: irrfAnnual + simplesPjTax,
    federalTaxPercentage: ((irrfAnnual + simplesPjTax) / gross) * 100,
    stateTax: 0,
    stateTaxPercentage: 0,
    socialSecurityTax: inssAnnual,
    socialSecurityTaxPercentage: (inssAnnual / gross) * 100,
    medicareTax: 0,
    medicareTaxPercentage: 0,
    otherDeductions: businessWriteOffs,
    otherDeductionsPercentage: (businessWriteOffs / gross) * 100,
    totalTax: mandatoryDeductions + businessWriteOffs,
    effectiveTaxRate: ((mandatoryDeductions + businessWriteOffs) / gross) * 100,
    breakdown,
  };
}
