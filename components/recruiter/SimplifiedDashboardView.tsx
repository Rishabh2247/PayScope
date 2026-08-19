'use client';

import React from 'react';
import { JobRecord, CandidateRecord, CandidateJobRecord, RecruiterActivityItem } from '../../lib/recruiterStore';
import { formatCurrency } from '../../lib/formatters';
import {
  Plus,
  Search,
  Calculator,
  Briefcase,
  Users,
  Calendar,
  Award,
  DollarSign,
  ChevronRight,
  Clock,
  ArrowUpRight,
  Building2,
} from 'lucide-react';

interface SimplifiedDashboardViewProps {
  jobs: JobRecord[];
  candidates: CandidateRecord[];
  candidateJobs: CandidateJobRecord[];
  activities: RecruiterActivityItem[];
  onNavigateTab: (tab: string, subSection?: string) => void;
  onOpenAddJobModal: () => void;
}

export const SimplifiedDashboardView: React.FC<SimplifiedDashboardViewProps> = ({
  jobs,
  candidates,
  candidateJobs,
  activities,
  onNavigateTab,
  onOpenAddJobModal,
}) => {
  const openJobs = jobs.filter((j) => j.status === 'Open');
  const interviewsCount = candidateJobs.filter((cj) => cj.stage.includes('Scheduled') || cj.stage.includes('Interview')).length;
  const placementsCount = candidateJobs.filter((cj) => cj.stage === 'Placed').length;
  const estimatedRevenue = candidateJobs.reduce((acc, cj) => acc + (cj.billRate || 0) * 160 * 6, 0);

  return (
    <div className="space-y-6">
      {/* 1. Header Greeting */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            Good morning 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Here's what's happening with your recruiting today.
          </p>
        </div>

        {/* 3 Large Primary Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onOpenAddJobModal}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Job</span>
          </button>

          <button
            onClick={() => onNavigateTab('search')}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Search className="w-4 h-4" />
            <span>Search Candidates</span>
          </button>

          <button
            onClick={() => onNavigateTab('rate')}
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all"
          >
            <Calculator className="w-4 h-4 text-indigo-600" />
            <span>Calculate Rate</span>
          </button>
        </div>
      </div>

      {/* 2. 5 Primary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Open Jobs</span>
          <div className="text-3xl font-black text-slate-900">{openJobs.length}</div>
          <span className="text-[11px] text-slate-500 font-medium">Active hiring roles</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Candidates</span>
          <div className="text-3xl font-black text-slate-900">{candidates.length}</div>
          <span className="text-[11px] text-slate-500 font-medium">Total in pipeline</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Interviews</span>
          <div className="text-3xl font-black text-indigo-600">{interviewsCount}</div>
          <span className="text-[11px] text-slate-500 font-medium">Scheduled rounds</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Placements</span>
          <div className="text-3xl font-black text-emerald-600">{placementsCount}</div>
          <span className="text-[11px] text-slate-500 font-medium">Filled candidate contracts</span>
        </div>

        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-5 rounded-2xl shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block">Est. Revenue</span>
          <div className="text-2xl font-black text-white">{formatCurrency(estimatedRevenue, 'USD')}</div>
          <span className="text-[11px] text-indigo-200 font-medium">Portfolio billing value</span>
        </div>
      </div>

      {/* 3. Today's Activity & Recent Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Activity */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              <span>Today's Activity</span>
            </h3>
            <span className="text-xs font-semibold text-slate-400">{activities.length} scheduled</span>
          </div>

          {activities.length > 0 ? (
            <div className="space-y-3">
              {activities.map((act) => (
                <div key={act.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 block">{act.title}</span>
                    <span className="text-slate-500">
                      {act.candidateName} · {act.jobTitle}
                    </span>
                  </div>
                  <span className="bg-indigo-100 text-indigo-800 font-bold px-2.5 py-1 rounded-lg shrink-0">
                    {act.time}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-slate-400 font-medium space-y-1">
              <p className="font-bold text-slate-700">0 interviews scheduled today</p>
              <p>Schedule interviews from your Jobs & Pipeline tab.</p>
            </div>
          )}
        </div>

        {/* Recent Jobs */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              <span>Recent Jobs</span>
            </h3>
            {jobs.length > 0 && (
              <button
                onClick={() => onNavigateTab('jobs')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {jobs.length > 0 ? (
            <div className="space-y-3">
              {jobs.slice(0, 3).map((job) => (
                <div
                  key={job.id}
                  onClick={() => onNavigateTab('jobs')}
                  className="p-3.5 bg-slate-50 hover:bg-indigo-50/40 rounded-xl border border-slate-200/70 flex items-center justify-between text-xs cursor-pointer transition-all group"
                >
                  <div>
                    <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {job.jobTitle}
                    </div>
                    <div className="text-slate-500 font-medium">
                      {job.clientName} · {job.location} · {job.openingsCount} openings
                    </div>
                  </div>

                  <span className="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-lg uppercase text-[10px]">
                    {job.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-slate-400 font-medium space-y-2">
              <p className="font-bold text-slate-700">No jobs created yet</p>
              <button
                onClick={onOpenAddJobModal}
                className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 font-bold px-3 py-1.5 rounded-lg text-xs hover:bg-indigo-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create your first job</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
