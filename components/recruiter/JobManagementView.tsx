'use client';

import React, { useState } from 'react';
import { JobRecord, CandidateRecord, CandidateJobRecord, JobStatus } from '../../lib/recruiterStore';
import { ContractType } from '../../lib/recruiterTypes';
import { generateJobPdf } from '../../lib/pdfReportEngine';
import { DownloadPdfButton } from './DownloadPdfButton';
import { CandidatePipelineKanban } from './CandidatePipelineKanban';
import { MotionContainer } from '../common/MotionContainer';
import {
  Briefcase,
  Plus,
  Search,
  Building2,
  MapPin,
  Clock,
  Layers,
  ChevronRight,
  X,
  FileText,
  SlidersHorizontal,
  Check,
  Edit,
  Trash2,
  UserCheck,
  AlertTriangle,
  UserPlus,
  Users,
} from 'lucide-react';

interface JobManagementViewProps {
  jobs: JobRecord[];
  candidates: CandidateRecord[];
  candidateJobs: CandidateJobRecord[];
  onAddJob: (newJob: JobRecord) => void;
  onUpdateJob: (job: JobRecord) => void;
  onDeleteJob: (jobId: string) => void;
  onAddCandidate: (newCand: CandidateRecord) => void;
  onUpdateCandidate: (cand: CandidateRecord) => void;
  onDeleteCandidate: (candidateId: string) => void;
  onUpdateCandidateJob: (updated: CandidateJobRecord) => void;
  isAddModalOpen: boolean;
  onCloseAddModal: () => void;
}

export const JobManagementView: React.FC<JobManagementViewProps> = ({
  jobs,
  candidates,
  candidateJobs,
  onAddJob,
  onUpdateJob,
  onDeleteJob,
  onAddCandidate,
  onUpdateCandidate,
  onDeleteCandidate,
  onUpdateCandidateJob,
  isAddModalOpen,
  onCloseAddModal,
}) => {
  const [topTab, setTopTab] = useState<'jobs' | 'candidates'>('jobs');
  const [activeJobTab, setActiveJobTab] = useState<'active' | 'closed'>('active');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(jobs[0]?.id || null);
  const [jobDetailSubTab, setJobDetailSubTab] = useState<'pipeline' | 'summary' | 'notes'>('pipeline');
  const [showMoreDetails, setShowMoreDetails] = useState(false);

  // Edit Job State
  const [editingJob, setEditingJob] = useState<JobRecord | null>(null);
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);

  // Candidate Management State
  const [isAddCandidateModalOpen, setIsAddCandidateModalOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<CandidateRecord | null>(null);
  const [deletingCandidateId, setDeletingCandidateId] = useState<string | null>(null);
  const [candidateSearchTerm, setCandidateSearchTerm] = useState('');

  // Job Form State
  const [formJobTitle, setFormJobTitle] = useState('');
  const [formClientName, setFormClientName] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formEmploymentType, setFormEmploymentType] = useState<ContractType>('C2C');
  const [formExperience, setFormExperience] = useState<number | ''>('');
  const [formDescription, setFormDescription] = useState('');
  const [formOpenings, setFormOpenings] = useState<number | ''>('');
  const [formPayMin, setFormPayMin] = useState<number | ''>('');
  const [formPayMax, setFormPayMax] = useState<number | ''>('');
  const [formBillRate, setFormBillRate] = useState<number | ''>('');
  const [formSkills, setFormSkills] = useState('');
  const [formStatus, setFormStatus] = useState<JobStatus>('Open');

  // Candidate Form State (Only Candidate Name* is required)
  const [candName, setCandName] = useState('');
  const [candEmail, setCandEmail] = useState('');
  const [candPhone, setCandPhone] = useState('');
  const [candHeadline, setCandHeadline] = useState('');
  const [candCompany, setCandCompany] = useState('');
  const [candLocation, setCandLocation] = useState('');
  const [candExp, setCandExp] = useState<number | ''>('');
  const [candSkills, setCandSkills] = useState('');
  const [candLinkedIn, setCandLinkedIn] = useState('');
  const [candRate, setCandRate] = useState<number | ''>('');

  const selectedJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];

  const filteredJobs = jobs.filter((j) => {
    if (activeJobTab === 'active') return j.status === 'Open' || j.status === 'On Hold';
    return j.status === 'Closed' || j.status === 'Filled' || j.status === 'Cancelled';
  });

  const filteredCandidates = candidates.filter((c) =>
    c.name.toLowerCase().includes(candidateSearchTerm.toLowerCase()) ||
    (c.headline || '').toLowerCase().includes(candidateSearchTerm.toLowerCase())
  );

  const handleOpenEditJob = (j: JobRecord) => {
    setEditingJob(j);
    setFormJobTitle(j.jobTitle);
    setFormClientName(j.clientName);
    setFormLocation(j.location);
    setFormEmploymentType(j.employmentType);
    setFormExperience(j.experienceRequiredYears);
    setFormDescription(j.jobDescription);
    setFormOpenings(j.openingsCount);
    setFormPayMin(j.payRateRangeMin || '');
    setFormPayMax(j.payRateRangeMax || '');
    setFormBillRate(j.billRate || '');
    setFormSkills(j.skillsRequired.join(', '));
    setFormStatus(j.status);
    setShowMoreDetails(true);
  };

  const handleSaveJobForm = () => {
    if (!formJobTitle.trim() || !formClientName.trim()) return;

    if (editingJob) {
      const updatedJob: JobRecord = {
        ...editingJob,
        jobTitle: formJobTitle,
        clientName: formClientName,
        location: formLocation || 'Unspecified',
        employmentType: formEmploymentType,
        experienceRequiredYears: typeof formExperience === 'number' ? formExperience : 3,
        jobDescription: formDescription || `Job description for ${formJobTitle}`,
        openingsCount: typeof formOpenings === 'number' ? formOpenings : 1,
        payRateRangeMin: typeof formPayMin === 'number' ? formPayMin : undefined,
        payRateRangeMax: typeof formPayMax === 'number' ? formPayMax : undefined,
        billRate: typeof formBillRate === 'number' ? formBillRate : undefined,
        skillsRequired: formSkills ? formSkills.split(',').map((s) => s.trim()).filter(Boolean) : [],
        status: formStatus,
      };

      onUpdateJob(updatedJob);
      setEditingJob(null);
    } else {
      const newJob: JobRecord = {
        id: `job-${Date.now()}`,
        jobTitle: formJobTitle,
        clientName: formClientName,
        location: formLocation || 'Unspecified',
        country: 'US',
        currency: 'USD',
        employmentType: formEmploymentType,
        experienceRequiredYears: typeof formExperience === 'number' ? formExperience : 3,
        jobDescription: formDescription || `Job description for ${formJobTitle}`,
        status: 'Open',
        openingsCount: typeof formOpenings === 'number' ? formOpenings : 1,
        payRateRangeMin: typeof formPayMin === 'number' ? formPayMin : undefined,
        payRateRangeMax: typeof formPayMax === 'number' ? formPayMax : undefined,
        billRate: typeof formBillRate === 'number' ? formBillRate : undefined,
        skillsRequired: formSkills ? formSkills.split(',').map((s) => s.trim()).filter(Boolean) : [],
        priority: 'Medium',
        contractDurationMonths: 6,
        createdAt: new Date().toISOString().split('T')[0],
      };

      onAddJob(newJob);
      setSelectedJobId(newJob.id);
      onCloseAddModal();
    }
    resetJobForm();
  };

  const resetJobForm = () => {
    setFormJobTitle('');
    setFormClientName('');
    setFormLocation('');
    setFormExperience('');
    setFormDescription('');
    setFormOpenings('');
    setFormPayMin('');
    setFormPayMax('');
    setFormBillRate('');
    setFormSkills('');
    setFormStatus('Open');
    setShowMoreDetails(false);
    setEditingJob(null);
  };

  const handleOpenEditCandidate = (c: CandidateRecord) => {
    setEditingCandidate(c);
    setCandName(c.name);
    setCandEmail(c.email || '');
    setCandPhone(c.phone || '');
    setCandHeadline(c.headline || '');
    setCandCompany(c.currentCompany || '');
    setCandLocation(c.location || '');
    setCandExp(c.yearsOfExperience || '');
    setCandSkills(c.skills ? c.skills.join(', ') : '');
    setCandLinkedIn(c.linkedInUrl || '');
    setCandRate(c.expectedRate || '');
  };

  const handleSaveCandidateForm = () => {
    if (!candName.trim()) return;

    if (editingCandidate) {
      const updated: CandidateRecord = {
        ...editingCandidate,
        name: candName,
        email: candEmail || undefined,
        phone: candPhone || undefined,
        headline: candHeadline || undefined,
        currentCompany: candCompany || undefined,
        location: candLocation || undefined,
        yearsOfExperience: typeof candExp === 'number' ? candExp : undefined,
        skills: candSkills ? candSkills.split(',').map((s) => s.trim()).filter(Boolean) : [],
        linkedInUrl: candLinkedIn || undefined,
        expectedRate: typeof candRate === 'number' ? candRate : undefined,
      };
      onUpdateCandidate(updated);
      setEditingCandidate(null);
    } else {
      const newCand: CandidateRecord = {
        id: `cand-${Date.now()}`,
        name: candName,
        email: candEmail || undefined,
        phone: candPhone || undefined,
        headline: candHeadline || undefined,
        currentCompany: candCompany || undefined,
        location: candLocation || undefined,
        yearsOfExperience: typeof candExp === 'number' ? candExp : undefined,
        skills: candSkills ? candSkills.split(',').map((s) => s.trim()).filter(Boolean) : [],
        linkedInUrl: candLinkedIn || undefined,
        expectedRate: typeof candRate === 'number' ? candRate : undefined,
        createdAt: new Date().toISOString().split('T')[0],
      };
      onAddCandidate(newCand);
      setIsAddCandidateModalOpen(false);
    }
    resetCandForm();
  };

  const resetCandForm = () => {
    setCandName('');
    setCandEmail('');
    setCandPhone('');
    setCandHeadline('');
    setCandCompany('');
    setCandLocation('');
    setCandExp('');
    setCandSkills('');
    setCandLinkedIn('');
    setCandRate('');
    setEditingCandidate(null);
  };

  const selectedJobCandidateRecords = selectedJob
    ? candidateJobs
        .filter((cj) => cj.jobId === selectedJob.id)
        .map((cj) => ({
          candidate: candidates.find((c) => c.id === cj.candidateId)!,
          record: cj,
        }))
        .filter((item) => Boolean(item.candidate))
    : [];

  return (
    <MotionContainer type="fadeIn" className="space-y-6">
      {/* Top Header & Workspace Mode Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-50 text-indigo-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase">
              Jobs & Database
            </span>
            <span className="text-slate-400 text-xs font-semibold">{jobs.length} Jobs · {candidates.length} Candidates</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            <span>Jobs & Candidate Database</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your hiring roles, pipeline stages, and recruiter candidate database.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Main Sub Tab Selector */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-bold">
            <button
              onClick={() => setTopTab('jobs')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                topTab === 'jobs' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500'
              }`}
            >
              Jobs & Pipeline
            </button>
            <button
              onClick={() => setTopTab('candidates')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                topTab === 'candidates' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500'
              }`}
            >
              Candidate Database ({candidates.length})
            </button>
          </div>

          {topTab === 'jobs' ? (
            <button
              onClick={() => {
                resetJobForm();
                onCloseAddModal();
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Job</span>
            </button>
          ) : (
            <button
              onClick={() => {
                resetCandForm();
                setIsAddCandidateModalOpen(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Candidate</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: JOBS & PIPELINE */}
      {topTab === 'jobs' && (
        <>
          {jobs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-12 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl">
                💼
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="font-extrabold text-slate-900 text-lg">No jobs yet</h3>
                <p className="text-xs text-slate-500">
                  Create your first job to start tracking candidates in your pipeline.
                </p>
              </div>
              <button
                onClick={() => {
                  resetJobForm();
                  onCloseAddModal();
                }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs inline-flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Job</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              {/* Left List of Jobs */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-3">
                <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
                  <button
                    onClick={() => setActiveJobTab('active')}
                    className={`flex-1 py-1.5 rounded-lg transition-all text-center ${
                      activeJobTab === 'active' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Active Jobs
                  </button>
                  <button
                    onClick={() => setActiveJobTab('closed')}
                    className={`flex-1 py-1.5 rounded-lg transition-all text-center ${
                      activeJobTab === 'closed' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Closed Jobs
                  </button>
                </div>

                <div className="space-y-2">
                  {filteredJobs.map((j) => {
                    const isSelected = selectedJob?.id === j.id;
                    const cjCount = candidateJobs.filter((cj) => cj.jobId === j.id).length;

                    return (
                      <div
                        key={j.id}
                        onClick={() => setSelectedJobId(j.id)}
                        className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all space-y-1 ${
                          isSelected
                            ? 'bg-indigo-50/70 border-indigo-200 shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200/80'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <span className="font-extrabold text-slate-900 block">{j.jobTitle}</span>
                          <span className="bg-white px-2 py-0.5 rounded text-[10px] font-bold text-emerald-700 border">
                            {j.status}
                          </span>
                        </div>

                        <p className="text-slate-500 text-[11px] font-medium">
                          {j.clientName} · {j.location} · {cjCount} Candidates
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Job Details & Pipeline Workspace */}
              {selectedJob && (
                <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                          Status: {selectedJob.status}
                        </span>
                        <span className="text-slate-400 text-xs font-semibold">
                          {selectedJob.employmentType} · {selectedJob.openingsCount} Openings
                        </span>
                      </div>
                      <h2 className="text-xl font-extrabold text-slate-900 mt-1">{selectedJob.jobTitle}</h2>
                      <p className="text-xs text-slate-500">{selectedJob.clientName} · {selectedJob.location}</p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => handleOpenEditJob(selectedJob)}
                        className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit Job</span>
                      </button>

                      <button
                        onClick={() => setDeletingJobId(selectedJob.id)}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>

                      <DownloadPdfButton
                        onDownload={() => generateJobPdf(selectedJob, selectedJobCandidateRecords)}
                        label="Download Job PDF"
                        variant="outline"
                      />
                    </div>
                  </div>

                  {/* Sub Tabs */}
                  <div className="flex items-center gap-2 border-b border-slate-100 text-xs font-bold pb-2">
                    <button
                      onClick={() => setJobDetailSubTab('pipeline')}
                      className={`px-3 py-1.5 rounded-lg transition-colors ${
                        jobDetailSubTab === 'pipeline' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Candidate Pipeline
                    </button>
                    <button
                      onClick={() => setJobDetailSubTab('summary')}
                      className={`px-3 py-1.5 rounded-lg transition-colors ${
                        jobDetailSubTab === 'summary' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Job Summary
                    </button>
                  </div>

                  {jobDetailSubTab === 'pipeline' && (
                    <CandidatePipelineKanban
                      job={selectedJob}
                      candidates={candidates}
                      candidateJobs={candidateJobs}
                      onUpdateCandidateJob={onUpdateCandidateJob}
                    />
                  )}

                  {jobDetailSubTab === 'summary' && (
                    <div className="space-y-4 text-xs">
                      <div className="bg-slate-50 p-4 rounded-xl border space-y-2">
                        <span className="font-bold text-slate-700 block">Job Description</span>
                        <p className="text-slate-600 leading-relaxed font-mono">{selectedJob.jobDescription}</p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="bg-slate-50 p-3 rounded-xl border">
                          <span className="text-slate-400 text-[10px] block">Target Pay Range</span>
                          <span className="font-bold text-slate-900">
                            {selectedJob.payRateRangeMin ? `$${selectedJob.payRateRangeMin} - $${selectedJob.payRateRangeMax}/hr` : 'Not specified'}
                          </span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border">
                          <span className="text-slate-400 text-[10px] block">Client Bill Rate</span>
                          <span className="font-bold text-indigo-700">
                            {selectedJob.billRate ? `$${selectedJob.billRate}/hr` : 'Not specified'}
                          </span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border">
                          <span className="text-slate-400 text-[10px] block">Experience Required</span>
                          <span className="font-bold text-slate-900">{selectedJob.experienceRequiredYears}+ Years</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* VIEW 2: CANDIDATE DATABASE */}
      {topTab === 'candidates' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Candidate Database ({candidates.length})</h3>
              <p className="text-xs text-slate-500">Recruiter candidate records saved in your workspace.</p>
            </div>

            <div className="relative w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={candidateSearchTerm}
                onChange={(e) => setCandidateSearchTerm(e.target.value)}
                placeholder="Search candidates by name or skill..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              />
            </div>
          </div>

          {filteredCandidates.length === 0 ? (
            <div className="text-center py-12 text-xs space-y-2">
              <p className="font-bold text-slate-700">No candidates in database yet</p>
              <button
                onClick={() => {
                  resetCandForm();
                  setIsAddCandidateModalOpen(true);
                }}
                className="bg-indigo-600 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs"
              >
                + Add Candidate
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">Candidate Name</th>
                    <th className="p-3.5">Headline / Title</th>
                    <th className="p-3.5">Location</th>
                    <th className="p-3.5">Experience</th>
                    <th className="p-3.5">Pay Rate</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {filteredCandidates.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5 font-extrabold text-slate-900">{c.name}</td>
                      <td className="p-3.5 text-slate-600">{c.headline || 'Specialist'}</td>
                      <td className="p-3.5 text-slate-600">{c.location || 'Unspecified'}</td>
                      <td className="p-3.5 font-semibold text-slate-800">{c.yearsOfExperience || 0} Years</td>
                      <td className="p-3.5 font-bold text-emerald-700">${c.expectedRate || 0}/hr</td>
                      <td className="p-3.5 text-right space-x-1">
                        <button onClick={() => handleOpenEditCandidate(c)} className="p-1 text-slate-500 hover:text-slate-900">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setDeletingCandidateId(c.id)} className="p-1 text-rose-500 hover:text-rose-700">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Job Modal */}
      {(isAddModalOpen || editingJob) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingJob ? 'Edit Job' : 'Create New Job'}
              </h3>
              <button onClick={() => { resetJobForm(); onCloseAddModal(); }} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Job Title *</label>
                <input
                  type="text"
                  value={formJobTitle}
                  onChange={(e) => setFormJobTitle(e.target.value)}
                  placeholder="e.g. Senior Business Analyst"
                  className="w-full bg-slate-50 border rounded-xl p-2.5 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Client / Company *</label>
                <input
                  type="text"
                  value={formClientName}
                  onChange={(e) => setFormClientName(e.target.value)}
                  placeholder="e.g. ABC Technologies"
                  className="w-full bg-slate-50 border rounded-xl p-2.5 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Location</label>
                <input
                  type="text"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="e.g. Toronto, ON"
                  className="w-full bg-slate-50 border rounded-xl p-2.5 font-semibold"
                />
              </div>

              {editingJob && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Job Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as JobStatus)}
                    className="w-full bg-slate-50 border rounded-xl p-2.5 font-semibold"
                  >
                    <option value="Open">Open</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Closed">Closed</option>
                    <option value="Filled">Filled</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button onClick={() => { resetJobForm(); onCloseAddModal(); }} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl">
                Cancel
              </button>
              <button onClick={handleSaveJobForm} className="bg-indigo-600 text-white font-bold px-5 py-2 text-xs rounded-xl shadow-xs">
                {editingJob ? 'Update Job' : 'Save Job'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Candidate Modal */}
      {(isAddCandidateModalOpen || editingCandidate) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingCandidate ? 'Edit Candidate Profile' : 'Add Candidate to Database'}
              </h3>
              <button onClick={() => { resetCandForm(); setIsAddCandidateModalOpen(false); }} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Candidate Name *</label>
                <input
                  type="text"
                  value={candName}
                  onChange={(e) => setCandName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-slate-50 border rounded-xl p-2.5 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Headline / Title</label>
                  <input
                    type="text"
                    value={candHeadline}
                    onChange={(e) => setCandHeadline(e.target.value)}
                    placeholder="e.g. Software Engineer"
                    className="w-full bg-slate-50 border rounded-xl p-2 font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Location</label>
                  <input
                    type="text"
                    value={candLocation}
                    onChange={(e) => setCandLocation(e.target.value)}
                    placeholder="e.g. Toronto, ON"
                    className="w-full bg-slate-50 border rounded-xl p-2 font-semibold"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button onClick={() => { resetCandForm(); setIsAddCandidateModalOpen(false); }} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl">
                Cancel
              </button>
              <button onClick={handleSaveCandidateForm} className="bg-indigo-600 text-white font-bold px-5 py-2 text-xs rounded-xl shadow-xs">
                {editingCandidate ? 'Update Candidate' : 'Save Candidate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Job Confirmation Modal */}
      {deletingJobId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 text-center shadow-2xl">
            <AlertTriangle className="w-10 h-10 text-rose-600 mx-auto" />
            <div className="space-y-1">
              <h4 className="font-extrabold text-slate-900 text-base">Delete this job?</h4>
              <p className="text-xs text-slate-500">This will remove the job from your workspace database.</p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button onClick={() => setDeletingJobId(null)} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl">
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteJob(deletingJobId);
                  setDeletingJobId(null);
                }}
                className="bg-rose-600 text-white font-bold px-4 py-2 text-xs rounded-xl shadow-xs"
              >
                Delete Job
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Candidate Confirmation Modal */}
      {deletingCandidateId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 text-center shadow-2xl">
            <AlertTriangle className="w-10 h-10 text-rose-600 mx-auto" />
            <div className="space-y-1">
              <h4 className="font-extrabold text-slate-900 text-base">Delete candidate record?</h4>
              <p className="text-xs text-slate-500">This will permanently remove the candidate from your workspace database.</p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button onClick={() => setDeletingCandidateId(null)} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl">
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteCandidate(deletingCandidateId);
                  setDeletingCandidateId(null);
                }}
                className="bg-rose-600 text-white font-bold px-4 py-2 text-xs rounded-xl shadow-xs"
              >
                Delete Candidate
              </button>
            </div>
          </div>
        </div>
      )}
    </MotionContainer>
  );
};
