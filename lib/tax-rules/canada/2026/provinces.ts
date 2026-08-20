import { TaxRuleMetadata, TaxBracket } from './federal';

export interface ProvinceTaxConfig {
  name: string;
  brackets: TaxBracket[];
  basicPersonalAmount: number;
  healthPremiumThresholds?: { min: number; max: number; premium: number }[];
}

export const CA_PROVINCIAL_TAX_2026: Record<string, ProvinceTaxConfig> = {
  Ontario: {
    name: 'Ontario',
    brackets: [
      { min: 0, max: 52824, rate: 0.0505 },
      { min: 52824, max: 105651, rate: 0.0915 },
      { min: 105651, max: 150000, rate: 0.1116 },
      { min: 150000, max: 220000, rate: 0.1216 },
      { min: 220000, max: null, rate: 0.1316 },
    ],
    basicPersonalAmount: 12399,
  },
  'British Columbia': {
    name: 'British Columbia',
    brackets: [
      { min: 0, max: 49279, rate: 0.0506 },
      { min: 49279, max: 98560, rate: 0.077 },
      { min: 98560, max: 113156, rate: 0.105 },
      { min: 113156, max: 137407, rate: 0.1229 },
      { min: 137407, max: 186043, rate: 0.147 },
      { min: 186043, max: null, rate: 0.168 },
    ],
    basicPersonalAmount: 12880,
  },
  Alberta: {
    name: 'Alberta',
    brackets: [
      { min: 0, max: 151234, rate: 0.10 },
      { min: 151234, max: 181481, rate: 0.12 },
      { min: 181481, max: 241974, rate: 0.13 },
      { min: 241974, max: 362961, rate: 0.14 },
      { min: 362961, max: null, rate: 0.15 },
    ],
    basicPersonalAmount: 22352,
  },
  Quebec: {
    name: 'Quebec',
    brackets: [
      { min: 0, max: 51780, rate: 0.14 },
      { min: 51780, max: 103545, rate: 0.19 },
      { min: 103545, max: 126000, rate: 0.24 },
      { min: 126000, max: null, rate: 0.2575 },
    ],
    basicPersonalAmount: 18056,
  },
};
