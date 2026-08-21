import { FinancialInputs, TaxCalculationResult, TaxDeductionItem } from '../types';
import { MX_SAT_TAX_2026 } from '../tax-rules/mexico/2026/sat';

export function calculateMXTax(inputs: FinancialInputs): TaxCalculationResult {
  const hoursPerWeek = inputs.workHoursPerWeek || 40;
  const weeksPerYear = inputs.weeksPerYear || 52;
  const annualHours = hoursPerWeek * weeksPerYear;

  const gross = Math.max(0, typeof inputs.annualSalary === 'number' ? inputs.annualSalary : (inputs.incomeRate ? inputs.incomeRate * annualHours : 0));
  const empType = inputs.employmentType || 'Sueldos y Salarios (Employee)';

  let isr = 0;
  let imss = 0;
  let businessWriteOffs = 0;

  const satRules = MX_SAT_TAX_2026;

  if (empType.includes('RESICO')) {
    // RESICO Regime Simplificado de Confianza (1% - 2.5% flat)
    let rate = 0.01;
    for (const b of satRules.resicoBrackets) {
      if (gross > b.min) rate = b.rate;
    }
    isr = gross * rate;
    imss = 0;
  } else if (empType.includes('Actividad Empresarial')) {
    // Persona Física con Actividad Empresarial (progressive ISR + writeoffs)
    businessWriteOffs = gross * ((inputs.k401Contribution || 15) / 100);
    const netIncome = Math.max(0, gross - businessWriteOffs);

    for (const b of satRules.isrBrackets) {
      if (netIncome > b.min) {
        const chunk = b.max ? Math.min(netIncome - b.min, b.max - b.min) : netIncome - b.min;
        isr += chunk * b.rate;
      }
    }
  } else {
    // Sueldos y Salarios (Standard Payroll Employee)
    imss = gross * satRules.imssEmployeeRate;
    const taxable = Math.max(0, gross - imss);

    for (const b of satRules.isrBrackets) {
      if (taxable > b.min) {
        const chunk = b.max ? Math.min(taxable - b.min, b.max - b.min) : taxable - b.min;
        isr += chunk * b.rate;
      }
    }
  }

  const mandatoryDeductions = isr + imss;
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
      name: 'ISR (Impuesto Sobre la Renta SAT 2026)',
      amount: isr,
      percentage: gross > 0 ? (isr / gross) * 100 : 0,
      color: '#EF4444',
    },
  ];

  if (imss > 0) {
    breakdown.push({
      name: 'IMSS Employee Contribution (Estimated ~2.75%)',
      amount: imss,
      percentage: gross > 0 ? (imss / gross) * 100 : 0,
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
    businessTax: 0,
    ownerCompensation: takeHomePayAnnual,
    estimatedPersonalTakeHome: takeHomePayAnnual,
    effectivePersonalNetRate: effectiveHourlyRate,
    federalTax: isr,
    federalTaxPercentage: gross > 0 ? (isr / gross) * 100 : 0,
    stateTax: 0,
    stateTaxPercentage: 0,
    socialSecurityTax: imss,
    socialSecurityTaxPercentage: gross > 0 ? (imss / gross) * 100 : 0,
    medicareTax: 0,
    medicareTaxPercentage: 0,
    otherDeductions: businessWriteOffs,
    otherDeductionsPercentage: gross > 0 ? (businessWriteOffs / gross) * 100 : 0,
    totalTax: mandatoryDeductions + businessWriteOffs,
    effectiveTaxRate: gross > 0 ? ((mandatoryDeductions + businessWriteOffs) / gross) * 100 : 0,
    breakdown,
  };
}
