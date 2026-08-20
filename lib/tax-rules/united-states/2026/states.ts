import { TaxBracket } from '../../canada/2026/federal';

export interface StateTaxConfig {
  name: string;
  brackets: TaxBracket[];
  flatRate?: number;
  hasStateTax: boolean;
}

export const US_STATE_TAX_2026: Record<string, StateTaxConfig> = {
  Texas: { name: 'Texas', brackets: [], hasStateTax: false },
  Florida: { name: 'Florida', brackets: [], hasStateTax: false },
  Washington: { name: 'Washington', brackets: [], hasStateTax: false },
  Nevada: { name: 'Nevada', brackets: [], hasStateTax: false },
  Wyoming: { name: 'Wyoming', brackets: [], hasStateTax: false },
  Alaska: { name: 'Alaska', brackets: [], hasStateTax: false },
  'South Dakota': { name: 'South Dakota', brackets: [], hasStateTax: false },
  California: {
    name: 'California',
    hasStateTax: true,
    brackets: [
      { min: 0, max: 10412, rate: 0.01 },
      { min: 10412, max: 24684, rate: 0.02 },
      { min: 24684, max: 38959, rate: 0.04 },
      { min: 38959, max: 54081, rate: 0.06 },
      { min: 54081, max: 68350, rate: 0.08 },
      { min: 68350, max: 349137, rate: 0.093 },
      { min: 349137, max: 418961, rate: 0.103 },
      { min: 418961, max: 698271, rate: 0.113 },
      { min: 698271, max: null, rate: 0.123 },
    ],
  },
  'New York': {
    name: 'New York',
    hasStateTax: true,
    brackets: [
      { min: 0, max: 8500, rate: 0.04 },
      { min: 8500, max: 11700, rate: 0.045 },
      { min: 11700, max: 13900, rate: 0.0525 },
      { min: 13900, max: 80650, rate: 0.055 },
      { min: 80650, max: 215400, rate: 0.06 },
      { min: 215400, max: 1077550, rate: 0.0685 },
      { min: 1077550, max: null, rate: 0.0965 },
    ],
  },
};
