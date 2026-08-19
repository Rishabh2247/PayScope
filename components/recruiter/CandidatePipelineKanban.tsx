'use client';

import React, { useState } from 'react';
import { CandidateRecord, CandidateJobRecord, CandidatePipelineStage, JobRecord } from '../../lib/recruiterStore';
import { generateCandidatePdf } from '../../lib/pdfReportEngine';
import { DownloadPdfButton } from './DownloadPdfButton';
import { formatCurrency, formatPercent } from '../../lib/formatters';
import {
  UserCheck,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  X,
  FileText,
  DollarSign,
  Briefcase,
  MapPin,
  Tag,
} from 'lucide-react';

interface CandidatePipelineKanbanProps {
  job: JobRecord;
  candidates: CandidateRecord[];
  candidateJobs: CandidateJobRecord[];
  onUpdateCandidateJob: (updated: CandidateJobRecord) => void;
}

const STAGES: CandidatePipelineStage[] = [
  'New',
  'Screening',
  'Selected',
  'L1 Scheduled',
  'L2 Scheduled',
  'Final Interview',
  'Offer',
  'Joining',
  'Placed',
  'Rejected',
];

export const CandidatePipelineKanban: React.FC<CandidatePipelineKanbanProps> = ({
  job,
  candidates,
  candidateJobs,
  onUpdateCandidateJob,
}) => {
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  const currentJobCandidates = candidateJobs.filter((cj) => cj.jobId === job.id);

  const activeRecord = currentJobCandidates.find((cj) => cj.id === selectedRecordId);
  const activeCandidate = candidates.find((c) => c.id === activeRecord?.candidateId);

  const handleStageChange = (record: CandidateJobRecord, newStage: CandidatePipelineStage) => {
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const newTimelineItem = {
      id: `t-${Date.now()}`,
      stage: newStage,
      dateString: today,
    };

    const updated: CandidateJobRecord = {
      ...record,
      stage: newStage,
      timeline: [...record.timeline, newTimelineItem],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    onUpdateCandidateJob(updated);
  };

  return (
    <div className="space-y-6">
      {/* Kanban Pipeline Columns */}
      <div className="overflow-x-auto pb-4">
        <div className="flex items-start gap-3 min-w-[1200px]">
          {STAGES.map((stage) => {
            const stageRecords = currentJobCandidates.filter((cj) => cj.stage === stage);
            const isRejected = stage === 'Rejected';
            const isPlaced = stage === 'Placed';

            return (
              <div
                key={stage}
                className={`w-60 shrink-0 p-3 rounded-2xl border space-y-3 ${
                  isPlaced
                    ? 'bg-emerald-50/60 border-emerald-200'
                    : isRejected
                    ? 'bg-rose-50/60 border-rose-200'
                    : 'bg-slate-50 border-slate-200/90'
                }`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/70 text-xs">
                  <span className={`font-extrabold ${isPlaced ? 'text-emerald-800' : isRejected ? 'text-rose-800' : 'text-slate-800'}`}>
                    {stage}
                  </span>
                  <span className="bg-white px-2 py-0.5 rounded-full text-[10px] font-black text-slate-500 border border-slate-200">
                    {stageRecords.length}
                  </span>
                </div>

                {/* Candidate Cards */}
                <div className="space-y-2.5">
                  {stageRecords.map((record) => {
                    const candidate = candidates.find((c) => c.id === record.candidateId);
                    if (!candidate) return null;

                    return (
                      <div
                        key={record.id}
                        onClick={() => setSelectedRecordId(record.id)}
                        className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer space-y-2 group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="font-extrabold text-slate-900 text-xs group-hover:text-indigo-600 transition-colors">
                            {candidate.name}
                          </div>
                          <span className="text-[10px] font-bold text-slate-400">
                            {candidate.yearsOfExperience}y
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-500 line-clamp-1 font-medium">
                          {candidate.headline}
                        </p>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                          <span className="font-bold text-emerald-700">
                            ${candidate.expectedRate}/hr
                          </span>

                          {record.l1Date && (
                            <span className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
                              L1: {record.l1Date}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {stageRecords.length === 0 && (
                    <div className="text-center py-6 text-[11px] text-slate-400 font-medium">
                      No candidates
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Candidate Profile Drawer Modal */}
      {activeRecord && activeCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-start gap-4">
                {activeCandidate.photoUrl ? (
                  <img
                    src={activeCandidate.photoUrl}
                    alt={activeCandidate.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg">
                    {activeCandidate.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">{activeCandidate.name}</h3>
                  <p className="text-xs font-semibold text-slate-600">{activeCandidate.headline}</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {activeCandidate.location} · {activeCandidate.yearsOfExperience} Years Experience
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <DownloadPdfButton
                  onDownload={() => generateCandidatePdf(activeCandidate, activeRecord, job)}
                  variant="outline"
                />
                <button
                  onClick={() => setSelectedRecordId(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Candidate Pipeline Stage Selector */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase block tracking-wider">
                Current Pipeline Stage
              </label>
              <select
                value={activeRecord.stage}
                onChange={(e) => handleStageChange(activeRecord, e.target.value as CandidatePipelineStage)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900"
              >
                {STAGES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              {/* Conditional Interview Date Pickers */}
              {activeRecord.stage === 'L1 Scheduled' && (
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">L1 Date</label>
                    <input
                      type="date"
                      value={activeRecord.l1Date || ''}
                      onChange={(e) => onUpdateCandidateJob({ ...activeRecord, l1Date: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">L1 Time</label>
                    <input
                      type="time"
                      value={activeRecord.l1Time || ''}
                      onChange={(e) => onUpdateCandidateJob({ ...activeRecord, l1Time: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 font-semibold"
                    />
                  </div>
                </div>
              )}

              {activeRecord.stage === 'L2 Scheduled' && (
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">L2 Date</label>
                    <input
                      type="date"
                      value={activeRecord.l2Date || ''}
                      onChange={(e) => onUpdateCandidateJob({ ...activeRecord, l2Date: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">L2 Time</label>
                    <input
                      type="time"
                      value={activeRecord.l2Time || ''}
                      onChange={(e) => onUpdateCandidateJob({ ...activeRecord, l2Time: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 font-semibold"
                    />
                  </div>
                </div>
              )}

              {activeRecord.stage === 'Joining' && (
                <div className="pt-2 text-xs">
                  <label className="font-bold text-slate-700 block mb-1">Joining Date</label>
                  <input
                    type="date"
                    value={activeRecord.joiningDate || ''}
                    onChange={(e) => onUpdateCandidateJob({ ...activeRecord, joiningDate: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2 font-semibold"
                  />
                </div>
              )}

              {/* Conditional Rejection Reason Selector */}
              {activeRecord.stage === 'Rejected' && (
                <div className="space-y-2 pt-2 text-xs">
                  <label className="font-bold text-slate-700 block">Rejection Reason</label>
                  <select
                    value={activeRecord.rejectionReason || ''}
                    onChange={(e) => onUpdateCandidateJob({ ...activeRecord, rejectionReason: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-900"
                  >
                    <option value="">Select reason (optional)...</option>
                    <option value="Skills mismatch">Skills mismatch</option>
                    <option value="Experience mismatch">Experience mismatch</option>
                    <option value="Salary mismatch">Salary mismatch</option>
                    <option value="Location mismatch">Location mismatch</option>
                    <option value="Client rejected">Client rejected</option>
                    <option value="Candidate withdrew">Candidate withdrew</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Candidate Stage Timeline</h4>

              <div className="space-y-2 text-xs">
                {activeRecord.timeline.map((t) => (
                  <div key={t.id} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200/70">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div className="flex-1 flex justify-between font-semibold">
                      <span className="text-slate-900">{t.stage}</span>
                      <span className="text-slate-500">{t.dateString} {t.timeString ? `· ${t.timeString}` : ''}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rate & Margin Analysis */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider">Rate Analysis for Role</h4>
              <div className="grid grid-cols-3 gap-2 text-center pt-1 font-bold">
                <div className="bg-white p-2.5 rounded-xl border">
                  <span className="text-slate-400 text-[10px] block">Pay Rate</span>
                  <span className="text-slate-900 text-sm">${activeCandidate.expectedRate || 0}/hr</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border">
                  <span className="text-slate-400 text-[10px] block">Client Bill Rate</span>
                  <span className="text-indigo-700 text-sm">${job.billRate || 90}/hr</span>
                </div>
                <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                  <span className="text-emerald-700 text-[10px] block">Est. Margin</span>
                  <span className="text-emerald-700 text-sm">
                    {formatPercent((((job.billRate || 90) - (activeCandidate.expectedRate || 0)) / (job.billRate || 90)) * 100)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
