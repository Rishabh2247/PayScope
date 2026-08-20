import { TaxRuleMetadata, TaxBracket } from '../../canada/2026/federal';

export const BR_RECEITA_TAX_2026 = {
  metadata: {
    effectiveYear: 2026,
    source: 'Receita Federal do Brasil & Instituto Nacional do Seguro Social (INSS)',
    sourceUrl: 'https://www.gov.br/receitafederal',
    lastVerified: '2026-01-15',
  } as TaxRuleMetadata,

  // INSS Employee Contribution Brackets (2026)
  inssBrackets: [
    { min: 0, max: 1412.00, rate: 0.075 },
    { min: 1412.00, max: 2666.68, rate: 0.09 },
    { min: 2666.68, max: 4000.03, rate: 0.12 },
    { min: 4000.03, max: 7786.02, rate: 0.14 },
  ] as TaxBracket[],

  inssTeto: 908.85, // Max monthly INSS contribution

  // IRRF (Imposto de Renda Retido na Fonte) 2026
  irrfBrackets: [
    { min: 0, max: 2259.20, rate: 0.0 },
    { min: 2259.20, max: 2826.65, rate: 0.075 },
    { min: 2826.65, max: 3751.05, rate: 0.15 },
    { min: 3751.05, max: 4664.68, rate: 0.225 },
    { min: 4664.68, max: null, rate: 0.275 },
  ] as TaxBracket[],

  // Simples Nacional PJ (Anexo III)
  simplesNacionalPJ: [
    { min: 0, max: 180000, rate: 0.06 },
    { min: 180000, max: 360000, rate: 0.112 },
    { min: 360000, max: 720000, rate: 0.135 },
    { min: 720000, max: null, rate: 0.16 },
  ] as TaxBracket[],
};
