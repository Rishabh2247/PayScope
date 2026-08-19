export interface CandidateResultItem {
  id: string;
  name: string;
  headline: string;
  jobTitle: string;
  location: string;
  yearsOfExperience?: number;
  skills: string[];
  education?: string;
  bioSummary?: string;
  linkedInUrl: string;
  photoUrl?: string;
  employer?: string;
  matchScore: number;
  suggestedPayRate: number;
  suggestedBillRate: number;
  source: string;
}
