import { TaxRuleMetadata, TaxBracket } from '../../canada/2026/federal';

export const MX_SAT_TAX_2026 = {
  metadata: {
    effectiveYear: 2026,
    source: 'Servicio de Administración Tributaria (SAT) & Instituto Mexicano del Seguro Social (IMSS)',
    sourceUrl: 'https://www.sat.gob.mx',
    lastVerified: '2026-01-15',
  } as TaxRuleMetadata,

  // SAT ISR Brackets (Monthly / Annualized)
  isrBrackets: [
    { min: 0, max: 8952, rate: 0.0192 },
    { min: 8952, max: 75984, rate: 0.064 },
    { min: 75984, max: 133536, rate: 0.1088 },
    { min: 133536, max: 155229, rate: 0.16 },
    { min: 155229, max: 185852, rate: 0.1792 },
    { min: 185852, max: 374837, rate: 0.2136 },
    { min: 374837, max: 590795, rate: 0.2352 },
    { min: 590795, max: 1127926, rate: 0.30 },
    { min: 1127926, max: 1503902, rate: 0.32 },
    { min: 1503902, max: 4511707, rate: 0.34 },
    { min: 4511707, max: null, rate: 0.35 },
  ] as TaxBracket[],

  // RESICO (Régimen Simplificado de Confianza) flat rates on gross income up to 3.5M MXN
  resicoBrackets: [
    { min: 0, max: 300000, rate: 0.01 },
    { min: 300000, max: 600000, rate: 0.011 },
    { min: 600000, max: 1000000, rate: 0.015 },
    { min: 1000000, max: 2500000, rate: 0.02 },
    { min: 2500000, max: 3500000, rate: 0.025 },
  ] as TaxBracket[],

  imssEmployeeRate: 0.0275, // IMSS ~2.75%
};
