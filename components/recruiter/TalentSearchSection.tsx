'use client';

import React, { useState, useEffect } from 'react';
import { TalentCandidate, RecruiterInputs } from '../../lib/recruiterTypes';
import { buildBooleanQuery } from '../../lib/recruiterEngine';
import { JobRecord, CandidateRecord, recruiterStore, SearchHistoryItem } from '../../lib/recruiterStore';
import { generateSearchPdf } from '../../lib/pdfReportEngine';
import { DownloadPdfButton } from './DownloadPdfButton';
import { MotionContainer } from '../common/MotionContainer';
import {
  Search,
  Code2,
  Copy,
  ExternalLink,
  Check,
  UserCheck,
  Briefcase,
  MapPin,
  Sparkles,
  ShieldCheck,
  Plus,
  SlidersHorizontal,
  X,
  UserPlus,
  ChevronDown,
  ArrowRight,
  Loader2,
  AlertCircle,
  Database,
  History,
  Trash2,
  RefreshCw,
} from 'lucide-react';

interface TalentSearchSectionProps {
  inputs: RecruiterInputs;
  jobs: JobRecord[];
  savedCandidates: CandidateRecord[];
  onApplyCandidateRate: (payRate: number, billRate: number, jobTitle: string) => void;
  onAddCandidateToJob: (candidate: TalentCandidate, jobId: string) => void;
  onSaveCandidateToDatabase: (candidate: CandidateRecord) => void;
}

export const TalentSearchSection: React.FC<TalentSearchSectionProps> = ({
  inputs,
  jobs,
  savedCandidates,
  onApplyCandidateRate,
  onAddCandidateToJob,
  onSaveCandidateToDatabase,
}) => {
  // Input fields - default values are strictly empty
  const [jobTitle, setJobTitle] = useState(inputs.jobTitle || '');
  const [location, setLocation] = useState('');
  const [skillsInput, setSkillsInput] = useState('');

  // Advanced filters
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [country, setCountry] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [education, setEducation] = useState('');
  const [employer, setEmployer] = useState('');
  const [industry, setIndustry] = useState('');
  const [includeKeywords, setIncludeKeywords] = useState('');
  const [excludeKeywords, setExcludeKeywords] = useState('');

  // Collapsible query accordions
  const [showBoolean, setShowBoolean] = useState(false);
  const [showXray, setShowXray] = useState(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Search Results & API States
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [apiStatus, setApiStatus] = useState<'idle' | 'success' | 'unconfigured' | 'error'>('idle');
  const [apiMessage, setApiMessage] = useState('');
  const [searchResults, setSearchResults] = useState<TalentCandidate[]>([]);

  // Search History
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [showSearchHistory, setShowSearchHistory] = useState(false);

  // Add to Job Modal state
  const [selectedCandidateForJob, setSelectedCandidateForJob] = useState<TalentCandidate | null>(null);
  const [selectedJobIdForImport, setSelectedJobIdForImport] = useState<string>(jobs[0]?.id || '');
  const [isAddedSuccess, setIsAddedSuccess] = useState(false);

  // Toast / feedback message state
  const [savedCandidateIds, setSavedCandidateIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setSearchHistory(recruiterStore.getSearchHistory());
  }, []);

  const skillsList = skillsInput
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const { booleanString, xrayQuery } = buildBooleanQuery(jobTitle, skillsList, location, includeKeywords);

  const handleCopy = (text: string, type: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleExecuteSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim() && !skillsInput.trim() && !location.trim()) {
      setHasSearched(true);
      setApiStatus('idle');
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    try {
      const response = await fetch('/api/candidate-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle,
          location,
          skills: skillsList,
          booleanQuery: booleanString,
          xrayQuery,
          country,
          experience: experienceLevel,
          education,
          employer,
          industry,
          includeKeywords,
          excludeKeywords,
        }),
      });

      const data = await response.json();
      setIsSearching(false);

      if (data.status === 'unconfigured') {
        setApiStatus('unconfigured');
        setApiMessage(data.message);
        setSearchResults([]);
      } else if (data.status === 'success') {
        setApiStatus('success');
        setSearchResults(data.results || []);

        // Save to Search History
        const historyItem: SearchHistoryItem = {
          id: `sh-${Date.now()}`,
          jobTitle,
          location,
          skills: skillsList,
          booleanQuery: booleanString,
          xrayQuery,
          resultCount: data.results?.length || 0,
          createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        };
        const updatedHistory = recruiterStore.addSearchHistory(historyItem);
        setSearchHistory(updatedHistory);
      } else {
        setApiStatus('error');
        setApiMessage(data.message || 'Error occurred while querying candidate search API.');
        setSearchResults([]);
      }
    } catch (err: any) {
      console.error('Frontend search error:', err);
      setIsSearching(false);
      setApiStatus('error');
      setApiMessage('Failed to connect to search service.');
      setSearchResults([]);
    }
  };

  const handleSaveToDatabase = (candidate: TalentCandidate) => {
    const newRecord: CandidateRecord = {
      id: `cand-${Date.now()}`,
      name: candidate.name,
      headline: candidate.headline,
      location: candidate.location,
      yearsOfExperience: candidate.yearsOfExperience,
      skills: candidate.skills,
      bioSummary: candidate.bioSummary,
      linkedInUrl: candidate.linkedInUrl,
      photoUrl: candidate.photoUrl,
      expectedRate: candidate.suggestedPayRate,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onSaveCandidateToDatabase(newRecord);
    setSavedCandidateIds((prev) => ({ ...prev, [candidate.id]: true }));
  };

  const handleConfirmAddCandidate = () => {
    if (!selectedCandidateForJob || !selectedJobIdForImport) return;
    onAddCandidateToJob(selectedCandidateForJob, selectedJobIdForImport);
    setIsAddedSuccess(true);
    setTimeout(() => {
      setIsAddedSuccess(false);
      setSelectedCandidateForJob(null);
    }, 1500);
  };

  return (
    <MotionContainer type="fadeIn" className="space-y-6">
      {/* 1. Candidate Search Header & Form */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-indigo-50 text-indigo-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                Candidate Search
              </span>
              {searchHistory.length > 0 && (
                <button
                  onClick={() => setShowSearchHistory(!showSearchHistory)}
                  className="text-xs font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>History ({searchHistory.length})</span>
                </button>
              )}
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1 flex items-center gap-2">
              <Search className="w-5 h-5 text-indigo-600" />
              <span>Candidate Search</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Find publicly discoverable professional profiles using job title, location, experience and skills.
            </p>
          </div>

          {hasSearched && searchResults.length > 0 && (
            <DownloadPdfButton
              onDownload={() =>
                generateSearchPdf(
                  { jobTitle, location, skills: skillsList, booleanString, xrayQuery },
                  searchResults
                )
              }
              variant="outline"
            />
          )}
        </div>

        {/* Search History Drawer */}
        {showSearchHistory && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold text-slate-700 pb-1 border-b">
              <span>Recent Search History</span>
              <button onClick={() => setShowSearchHistory(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {searchHistory.map((sh) => (
                <div key={sh.id} className="flex items-center justify-between p-2 bg-white rounded-lg border">
                  <div>
                    <span className="font-bold text-slate-900">{sh.jobTitle || 'All Roles'}</span>
                    <span className="text-slate-500 text-[11px] ml-2">{sh.location} · {sh.resultCount} Results ({sh.createdAt})</span>
                  </div>
                  <button
                    onClick={() => {
                      setJobTitle(sh.jobTitle);
                      setLocation(sh.location);
                      setSkillsInput(sh.skills.join(', '));
                      setShowSearchHistory(false);
                    }}
                    className="text-indigo-600 font-bold text-[11px] hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Load</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Primary Search Inputs Form */}
        <form onSubmit={handleExecuteSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Job Title / Role</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Business Analyst"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Toronto, Ontario"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Skills</label>
              <input
                type="text"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="e.g. SQL, Agile, Jira"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          {/* Progressive Disclosure: + More Filters */}
          <button
            type="button"
            onClick={() => setShowMoreFilters(!showMoreFilters)}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 pt-1"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{showMoreFilters ? 'Hide Additional Filters' : '+ More Filters (Country, Experience, Education, Employer, Industry)'}</span>
          </button>

          {showMoreFilters && (
            <div className="bg-slate-50 p-4 rounded-xl border grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs animate-in fade-in">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. Canada"
                  className="w-full bg-white border rounded-lg p-2 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Experience Required</label>
                <input
                  type="text"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  placeholder="e.g. 5+ Years"
                  className="w-full bg-white border rounded-lg p-2 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Education</label>
                <input
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="w-full bg-white border rounded-lg p-2 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Current Employer</label>
                <input
                  type="text"
                  value={employer}
                  onChange={(e) => setEmployer(e.target.value)}
                  placeholder="e.g. FinTech"
                  className="w-full bg-white border rounded-lg p-2 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Keywords to Include</label>
                <input
                  type="text"
                  value={includeKeywords}
                  onChange={(e) => setIncludeKeywords(e.target.value)}
                  placeholder="e.g. Banking, Salesforce"
                  className="w-full bg-white border rounded-lg p-2 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Keywords to Exclude (NOT)</label>
                <input
                  type="text"
                  value={excludeKeywords}
                  onChange={(e) => setExcludeKeywords(e.target.value)}
                  placeholder="e.g. Intern, Junior"
                  className="w-full bg-white border rounded-lg p-2 font-semibold"
                />
              </div>
            </div>
          )}

          {/* Prominent Primary Search Button */}
          <div className="pt-2 flex justify-start">
            <button
              type="submit"
              disabled={isSearching}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold px-6 py-3 rounded-xl text-sm flex items-center gap-2 transition-all shadow-md hover:shadow-indigo-500/20 disabled:opacity-70"
            >
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>{isSearching ? 'Searching Candidates...' : 'Search Candidates →'}</span>
            </button>
          </div>
        </form>

        {/* Collapsible Secondary Query Accordions */}
        <div className="pt-2 space-y-2 border-t border-slate-100 text-xs">
          <div className="border border-slate-200/80 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowBoolean(!showBoolean)}
              className="w-full bg-slate-50 px-4 py-2.5 flex items-center justify-between font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-600" />
                <span>View Boolean String</span>
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showBoolean ? 'rotate-180' : ''}`} />
            </button>

            {showBoolean && (
              <div className="p-4 bg-slate-900 text-slate-100 space-y-2 font-mono text-xs border-t border-slate-800">
                <div className="flex items-center justify-between text-slate-400 font-sans font-bold text-[11px]">
                  <span>Generated Boolean String</span>
                  {booleanString && (
                    <button
                      onClick={() => handleCopy(booleanString, 'boolean')}
                      className="hover:text-white flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-md"
                    >
                      {copiedType === 'boolean' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedType === 'boolean' ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                </div>
                <p className="text-indigo-300 break-all font-semibold">
                  {booleanString || 'Enter search criteria to generate a Boolean string.'}
                </p>
              </div>
            )}
          </div>

          <div className="border border-slate-200/80 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowXray(!showXray)}
              className="w-full bg-slate-50 px-4 py-2.5 flex items-center justify-between font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>View X-Ray Query</span>
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showXray ? 'rotate-180' : ''}`} />
            </button>

            {showXray && (
              <div className="p-4 bg-indigo-950 text-indigo-100 space-y-2 font-mono text-xs border-t border-indigo-900">
                <div className="flex items-center justify-between text-indigo-300 font-sans font-bold text-[11px]">
                  <span>Google X-Ray Query (site:linkedin.com/in/)</span>
                  {xrayQuery && (
                    <button
                      onClick={() => handleCopy(xrayQuery, 'xray')}
                      className="hover:text-white flex items-center gap-1 bg-indigo-900 px-2 py-1 rounded-md"
                    >
                      {copiedType === 'xray' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedType === 'xray' ? 'Copied' : 'Copy Query'}</span>
                    </button>
                  )}
                </div>
                <p className="text-emerald-300 break-all font-semibold">
                  {xrayQuery || 'Your X-Ray query will appear here.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. In-App Candidate Search Results Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-600" />
            <span>Candidate Search Results</span>
          </h3>

          {hasSearched && apiStatus === 'success' && (
            <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-xl text-xs font-bold">
              {searchResults.length} profiles found
            </span>
          )}
        </div>

        {/* Loading State */}
        {isSearching && (
          <div className="text-center py-12 space-y-3">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-700">Searching public profile database...</p>
          </div>
        )}

        {/* Clean Initial Zero State (Before Search) */}
        {!hasSearched && !isSearching && (
          <div className="text-center py-12 space-y-3">
            <div className="w-16 h-16 mx-auto bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl">
              🔎
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h4 className="font-extrabold text-slate-900 text-base">Ready to find candidates?</h4>
              <p className="text-xs text-slate-500">
                Enter a job title, location and skills above and click Search Candidates.
              </p>
            </div>
          </div>
        )}

        {/* Unconfigured Search Provider Banner State */}
        {hasSearched && !isSearching && apiStatus === 'unconfigured' && (
          <div className="bg-amber-50/90 border border-amber-200 p-6 rounded-2xl space-y-3 text-center">
            <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
            <div className="space-y-1 max-w-md mx-auto text-xs">
              <h4 className="font-extrabold text-amber-900 text-sm">Search provider not configured</h4>
              <p className="text-amber-800 leading-relaxed">
                Connect a supported search provider to retrieve live public search results. Configure <code className="bg-white/80 px-1 py-0.5 rounded font-mono">SEARCH_API_KEY</code> and <code className="bg-white/80 px-1 py-0.5 rounded font-mono">SEARCH_ENGINE_ID</code> in environment variables.
              </p>
            </div>
          </div>
        )}

        {/* Zero Results State (After Search) */}
        {hasSearched && !isSearching && apiStatus === 'success' && searchResults.length === 0 && (
          <div className="text-center py-12 space-y-3">
            <div className="w-12 h-12 mx-auto bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center">
              <Search className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h4 className="font-extrabold text-slate-900 text-base">No matching public profiles found</h4>
              <p className="text-xs text-slate-500">
                Try broadening your job title, location or keywords.
              </p>
            </div>
          </div>
        )}

        {/* Successful Results Cards */}
        {hasSearched && !isSearching && apiStatus === 'success' && searchResults.length > 0 && (
          <div className="space-y-4">
            {searchResults.map((candidate) => {
              const isSaved = savedCandidateIds[candidate.id];

              return (
                <div
                  key={candidate.id}
                  className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-4 transition-all"
                >
                  <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {candidate.photoUrl ? (
                        <img
                          src={candidate.photoUrl}
                          alt={candidate.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
                          {candidate.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-extrabold text-slate-900">{candidate.name}</h4>
                          <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {candidate.source}
                          </span>
                        </div>

                        <p className="text-xs font-semibold text-slate-700">{candidate.headline}</p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-3">
                          <span>📍 {candidate.location}</span>
                          <span>💼 {candidate.yearsOfExperience || 5} Yrs Exp</span>
                        </p>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shrink-0">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Match Score</span>
                      <span className="text-2xl font-black text-emerald-600">{candidate.matchScore}%</span>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border text-xs space-y-1.5">
                    <p className="text-slate-600">{candidate.bioSummary}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {candidate.skills.map((sk) => (
                        <span key={sk} className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[11px]">
                          ✓ {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Workflow Actions */}
                  <div className="flex items-center justify-between pt-2 border-t text-xs flex-wrap gap-2">
                    <span className="text-slate-500 font-semibold">Est. Market Rate: ${candidate.suggestedPayRate}/hr</span>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => handleSaveToDatabase(candidate)}
                        disabled={isSaved}
                        className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5"
                      >
                        {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Database className="w-3.5 h-3.5 text-slate-500" />}
                        <span>{isSaved ? 'Saved to Database' : 'Add to Candidate Database'}</span>
                      </button>

                      {jobs.length > 0 && (
                        <button
                          onClick={() => setSelectedCandidateForJob(candidate)}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Add to Job</span>
                        </button>
                      )}

                      <a
                        href={candidate.linkedInUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1 transition-colors"
                      >
                        <span>View LinkedIn Profile →</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add to Job Modal */}
      {selectedCandidateForJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b">
              <h4 className="font-extrabold text-slate-900 text-sm">Add Candidate to Job Pipeline</h4>
              <button onClick={() => setSelectedCandidateForJob(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs space-y-1 bg-slate-50 p-3 rounded-xl border">
              <span className="font-bold text-slate-900 block">{selectedCandidateForJob.name}</span>
              <span className="text-slate-500">{selectedCandidateForJob.headline}</span>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-700 block">Select Job Pipeline</label>
              <select
                value={selectedJobIdForImport}
                onChange={(e) => setSelectedJobIdForImport(e.target.value)}
                className="w-full bg-slate-50 border rounded-xl p-2.5 font-bold text-slate-900"
              >
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.jobTitle} ({j.clientName})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedCandidateForJob(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAddCandidate}
                disabled={isAddedSuccess}
                className="bg-indigo-600 text-white font-bold px-4 py-2 text-xs rounded-xl shadow-xs flex items-center gap-1.5"
              >
                {isAddedSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Plus className="w-4 h-4" />}
                <span>{isAddedSuccess ? 'Added to Pipeline!' : 'Confirm Add Candidate'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </MotionContainer>
  );
};
