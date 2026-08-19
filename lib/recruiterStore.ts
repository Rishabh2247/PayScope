import { CountryCode, CurrencyCode } from './types';
import { RecruiterInputs, RecruiterCalculationResult, ContractType, MarginStatus } from './recruiterTypes';

export type JobStatus = 'Open' | 'On Hold' | 'Closed' | 'Filled' | 'Cancelled';

export type CandidatePipelineStage =
  | 'New'
  | 'Screening'
  | 'Selected'
  | 'L1 Scheduled'
  | 'L1 Completed'
  | 'L2 Scheduled'
  | 'L2 Completed'
  | 'Final Interview'
  | 'Offer'
  | 'Joining'
  | 'Placed'
  | 'Rejected';

export interface JobRecord {
  id: string;
  jobTitle: string;
  clientName: string;
  location: string;
  country: CountryCode;
  currency: CurrencyCode;
  employmentType: ContractType;
  experienceRequiredYears: number;
  jobDescription: string;
  status: JobStatus;
  openingsCount: number;
  payRateRangeMin?: number;
  payRateRangeMax?: number;
  billRate?: number;
  targetMarginPercent?: number;
  skillsRequired: string[];
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  hiringManager?: string;
  jobNotes?: string;
  contractDurationMonths?: number;
  createdAt: string;
  closedAt?: string;
  filledAt?: string;
}

export interface CandidateRecord {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  headline?: string;
  currentCompany?: string;
  location?: string;
  yearsOfExperience?: number;
  skills?: string[];
  education?: string;
  bioSummary?: string;
  linkedInUrl?: string;
  photoUrl?: string;
  expectedRate?: number;
  resumeText?: string;
  notes?: string;
  createdAt: string;
}

export interface TimelineEvent {
  id: string;
  stage: CandidatePipelineStage;
  dateString: string;
  timeString?: string;
  notes?: string;
}

export interface CandidateJobRecord {
  id: string;
  jobId: string;
  candidateId: string;
  stage: CandidatePipelineStage;
  offeredRate?: number;
  billRate?: number;
  l1Date?: string;
  l1Time?: string;
  l2Date?: string;
  l2Time?: string;
  finalDate?: string;
  finalTime?: string;
  joiningDate?: string;
  rejectionReason?: string;
  rejectionNotes?: string;
  notes?: string;
  timeline: TimelineEvent[];
  updatedAt: string;
}

export interface SearchHistoryItem {
  id: string;
  jobTitle: string;
  location: string;
  skills: string[];
  booleanQuery: string;
  xrayQuery: string;
  resultCount: number;
  createdAt: string;
}

export interface RecruiterActivityItem {
  id: string;
  title: string;
  type: 'interview' | 'joining' | 'placement' | 'followup';
  date: string;
  time?: string;
  jobTitle: string;
  candidateName: string;
}

/**
 * LocalStorage Relational Store Manager for PayScope Recruit with Full CRUD
 */
class RecruiterStoreManager {
  private jobsKey = 'payscope_recruit_jobs_v3';
  private candidatesKey = 'payscope_recruit_candidates_v3';
  private candidateJobsKey = 'payscope_recruit_candidate_jobs_v3';
  private searchHistoryKey = 'payscope_recruit_search_history_v3';

  // JOBS CRUD
  public getJobs(): JobRecord[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(this.jobsKey);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  public saveJobs(jobs: JobRecord[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.jobsKey, JSON.stringify(jobs));
    }
  }

  public addJob(job: JobRecord): JobRecord[] {
    const current = this.getJobs();
    const updated = [job, ...current];
    this.saveJobs(updated);
    return updated;
  }

  public updateJob(job: JobRecord): JobRecord[] {
    const current = this.getJobs();
    const updated = current.map((j) => (j.id === job.id ? job : j));
    this.saveJobs(updated);
    return updated;
  }

  public deleteJob(jobId: string): JobRecord[] {
    const current = this.getJobs();
    const updated = current.filter((j) => j.id !== jobId);
    this.saveJobs(updated);

    // Also remove candidate-job relationships for this job
    const cjRecords = this.getCandidateJobs();
    const updatedCj = cjRecords.filter((cj) => cj.jobId !== jobId);
    this.saveCandidateJobs(updatedCj);

    return updated;
  }

  // CANDIDATES CRUD
  public getCandidates(): CandidateRecord[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(this.candidatesKey);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  public saveCandidates(candidates: CandidateRecord[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.candidatesKey, JSON.stringify(candidates));
    }
  }

  public addCandidate(candidate: CandidateRecord): CandidateRecord[] {
    const current = this.getCandidates();
    const existing = current.find(
      (c) => c.name.toLowerCase().trim() === candidate.name.toLowerCase().trim()
    );
    if (existing) return current;

    const updated = [candidate, ...current];
    this.saveCandidates(updated);
    return updated;
  }

  public updateCandidate(candidate: CandidateRecord): CandidateRecord[] {
    const current = this.getCandidates();
    const updated = current.map((c) => (c.id === candidate.id ? candidate : c));
    this.saveCandidates(updated);
    return updated;
  }

  public deleteCandidate(candidateId: string): CandidateRecord[] {
    const current = this.getCandidates();
    const updated = current.filter((c) => c.id !== candidateId);
    this.saveCandidates(updated);

    // Remove candidate-job relationships
    const cjRecords = this.getCandidateJobs();
    const updatedCj = cjRecords.filter((cj) => cj.candidateId !== candidateId);
    this.saveCandidateJobs(updatedCj);

    return updated;
  }

  // CANDIDATE-JOBS CRUD
  public getCandidateJobs(): CandidateJobRecord[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(this.candidateJobsKey);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  public saveCandidateJobs(records: CandidateJobRecord[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.candidateJobsKey, JSON.stringify(records));
    }
  }

  public updateCandidateJob(record: CandidateJobRecord): CandidateJobRecord[] {
    const current = this.getCandidateJobs();
    const existingIndex = current.findIndex((cj) => cj.id === record.id);
    let updated: CandidateJobRecord[] = [];
    if (existingIndex >= 0) {
      updated = current.map((cj) => (cj.id === record.id ? record : cj));
    } else {
      updated = [record, ...current];
    }
    this.saveCandidateJobs(updated);
    return updated;
  }

  // SEARCH HISTORY CRUD
  public getSearchHistory(): SearchHistoryItem[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(this.searchHistoryKey);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  public addSearchHistory(item: SearchHistoryItem): SearchHistoryItem[] {
    const current = this.getSearchHistory();
    const updated = [item, ...current.slice(0, 19)];
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.searchHistoryKey, JSON.stringify(updated));
    }
    return updated;
  }

  public deleteSearchHistory(id: string): SearchHistoryItem[] {
    const current = this.getSearchHistory();
    const updated = current.filter((s) => s.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.searchHistoryKey, JSON.stringify(updated));
    }
    return updated;
  }
}

export const recruiterStore = new RecruiterStoreManager();
