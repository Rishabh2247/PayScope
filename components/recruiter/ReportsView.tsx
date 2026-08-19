'use client';

import React from 'react';
import { JobRecord, CandidateRecord, CandidateJobRecord } from '../../lib/recruiterStore';
import { RecruiterInputs, RecruiterCalculationResult } from '../../lib/recruiterTypes';
import {
  generateSearchPdf,
  generateJobPdf,
  generateCandidatePdf,
  generateRatePdf,
} from '../../lib/pdfReportEngine';
import { DownloadPdfButton } from './DownloadPdfButton';
import {
  FileText,
  Search,
  Briefcase,
  UserCheck,
  Calculator,
  Download,
  CheckCircle,
  ShieldCheck,
  Plus,
} from 'lucide-react';

interface ReportsViewProps {
  jobs: JobRecord[];
  candidates: CandidateRecord[];
  candidateJobs: CandidateJobRecord[];
  recruiterInputs: RecruiterInputs;
  recruiterCalculation: RecruiterCalculationResult;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  jobs,
  candidates,
  candidateJobs,
  recruiterInputs,
  recruiterCalculation,
}) => {
  const hasRateData = recruiterInputs.candidatePayRate > 0 || recruiterInputs.clientBillRate > 0;
  const hasReports = jobs.length > 0 || candidates.length > 0 || hasRateData;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-50 text-indigo-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase">
              Reports & PDF
            </span>
            <span className="text-slate-400 text-xs font-semibold">Universal PDF Generator</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <span>Recruiting Reports & PDF Exports</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Download professional, print-ready PDF reports for candidate searches, active jobs, candidate profiles, and rate calculations.
          </p>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border text-xs text-slate-600 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>PayScope Recruit PDF Engine Ready</span>
        </div>
      </div>

      {!hasReports ? (
        /* Zero Initial State */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-12 text-center space-y-3">
          <div className="w-16 h-16 mx-auto bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl">
            📄
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="font-extrabold text-slate-900 text-base">No reports generated yet</h3>
            <p className="text-xs text-slate-500">
              Create a job, run a candidate search, or enter a rate calculation to generate professional PDF reports.
            </p>
          </div>
        </div>
      ) : (
        /* Category Reports */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category 1: Job Reports */}
          {jobs.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-indigo-600" />
                  <span>Job & Pipeline Reports</span>
                </h3>
                <span className="text-xs font-semibold text-slate-400">{jobs.length} Active Roles</span>
              </div>

              <div className="space-y-3">
                {jobs.map((j) => {
                  const jRecords = candidateJobs
                    .filter((cj) => cj.jobId === j.id)
                    .map((cj) => ({ candidate: candidates.find((c) => c.id === cj.candidateId)!, record: cj }))
                    .filter((item) => Boolean(item.candidate));

                  return (
                    <div key={j.id} className="bg-slate-50 p-3.5 rounded-xl border flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900 block">{j.jobTitle}</span>
                        <span className="text-slate-500 text-[11px]">{j.clientName} · {jRecords.length} Candidates</span>
                      </div>

                      <DownloadPdfButton
                        onDownload={() => generateJobPdf(j, jRecords)}
                        variant="secondary"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Category 2: Candidate Reports */}
          {candidates.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-indigo-600" />
                  <span>Candidate Profile Reports</span>
                </h3>
                <span className="text-xs font-semibold text-slate-400">{candidates.length} Profiles</span>
              </div>

              <div className="space-y-3">
                {candidates.map((c) => (
                  <div key={c.id} className="bg-slate-50 p-3.5 rounded-xl border flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block">{c.name}</span>
                      <span className="text-slate-500 text-[11px]">{(c.headline || 'Specialist').substring(0, 32)}</span>
                    </div>

                    <DownloadPdfButton
                      onDownload={() => generateCandidatePdf(c)}
                      variant="secondary"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category 3: Rate & Margin Reports */}
          {hasRateData && (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-indigo-600" />
                  <span>Rate & Margin Reports</span>
                </h3>
                <span className="text-xs font-semibold text-slate-400">Financial Analysis</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">Current Rate & Margin Snapshot</span>
                  <span className="text-slate-500 text-[11px]">
                    {recruiterInputs.jobTitle || 'Custom Calculation'} · ${recruiterInputs.clientBillRate}/hr Bill / ${recruiterInputs.candidatePayRate}/hr Pay
                  </span>
                </div>

                <DownloadPdfButton
                  onDownload={() => generateRatePdf(recruiterInputs, recruiterCalculation)}
                  variant="primary"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
