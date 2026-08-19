export interface CandidateSearchParams {
  jobTitle: string;
  location: string;
  skills: string[];
  booleanQuery?: string;
  xrayQuery?: string;
  country?: string;
  experience?: string;
  education?: string;
  employer?: string;
  industry?: string;
  includeKeywords?: string;
  excludeKeywords?: string;
}

export interface RawSearchItem {
  title: string;
  snippet: string;
  link: string;
  imageSrc?: string;
  sourceProvider: string;
}

export interface SearchProvider {
  name: string;
  search(params: CandidateSearchParams): Promise<RawSearchItem[]>;
}
