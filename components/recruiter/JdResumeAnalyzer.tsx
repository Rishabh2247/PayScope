'use client';

import React, { useState } from 'react';
import { analyzeJobDescription, analyzeAtsResume } from '../../lib/recruiterEngine';
import { JdAnalysisResult, AtsAnalysisResult } from '../../lib/recruiterTypes';
import {
  FileText,
  Search,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Code2,
  Copy,
  Check,
  Zap,
  Tag,
} from 'lucide-react';

export const JdResumeAnalyzer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'jd' | 'ats'>('jd');

  const [jdText, setJdText] = useState(
    `Senior Business Analyst\n\nRequirements:\n- 7+ years of experience as an IT Business Analyst\n- Strong proficiency in SQL, Agile, Jira, and Salesforce\n- Excellent requirements gathering and stakeholder communication skills\n- Experience in banking or financial services domain`
  );

  const [resumeText, setResumeText] = useState(
    `John Doe - Senior Business Analyst\nSummary: 8 years of experience working with SQL, Agile methodologies, Jira, and Salesforce CRM integration in banking.\nSkills: SQL, Agile, Jira, Salesforce, Requirements Analysis, UAT Testing.`
  );

  const [jdAnalysis, setJdAnalysis] = useState<JdAnalysisResult | null>(() => analyzeJobDescription(jdText));
  const [atsAnalysis, setAtsAnalysis] = useState<AtsAnalysisResult | null>(() => analyzeAtsResume(jdText, resumeText));

  const [copiedBool, setCopiedBool] = useState(false);

  const handleAnalyzeJd = () => {
    const res = analyzeJobDescription(jdText);
    setJdAnalysis(res);
  };

  const handleAnalyzeAts = () => {
    const res = analyzeAtsResume(jdText, resumeText);
    setAtsAnalysis(res);
  };

  const handleCopyBool = (str: string) => {
    navigator.clipboard.writeText(str);
    setCopiedBool(true);
    setTimeout(() => setCopiedBool(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Tab Header Selector */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('jd')}
            className={`px-4 py-2 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'jd'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Job Description Analyzer</span>
          </button>
          <button
            onClick={() => setActiveTab('ats')}
            className={`px-4 py-2 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'ats'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Resume ATS Matcher</span>
          </button>
        </div>

        <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
          {activeTab === 'jd' ? 'Extract skills & Boolean queries' : 'Compare Candidate Resume vs JD'}
        </span>
      </div>

      {/* VIEW 1: JD ANALYZER */}
      {activeTab === 'jd' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Box */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <span>Paste Job Description</span>
            </h3>

            <textarea
              rows={10}
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste raw Job Description text here..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />

            <button
              onClick={handleAnalyzeJd}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>Analyze Job Description</span>
            </button>
          </div>

          {/* Analysis Result */}
          {jdAnalysis && (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-indigo-600 uppercase">Extracted Role</span>
                  <h3 className="text-lg font-black text-slate-900">{jdAnalysis.jobTitle}</h3>
                </div>
                <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-xl text-xs font-bold">
                  {jdAnalysis.experienceYears}+ Years Exp
                </span>
              </div>

              {/* Skills */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-slate-700 block">Required Skills:</span>
                <div className="flex flex-wrap gap-1.5">
                  {jdAnalysis.requiredSkills.map((sk) => (
                    <span key={sk} className="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-lg">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Preferred Skills */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-slate-700 block">Preferred Skills & Certifications:</span>
                <div className="flex flex-wrap gap-1.5">
                  {jdAnalysis.preferredSkills.map((sk) => (
                    <span key={sk} className="bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-1 rounded-lg">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Suggested Titles */}
              <div className="space-y-1.5 text-xs">
                <span className="font-bold text-slate-700 block">Suggested Target Titles:</span>
                <p className="text-slate-600 font-medium">{jdAnalysis.suggestedTitles.join(' · ')}</p>
              </div>

              {/* Generated Boolean Box */}
              <div className="bg-slate-900 text-slate-100 p-3.5 rounded-xl font-mono text-xs space-y-1.5">
                <div className="flex items-center justify-between text-slate-400 font-sans font-bold text-[11px]">
                  <span>Generated Boolean String</span>
                  <button
                    onClick={() => handleCopyBool(jdAnalysis.booleanString)}
                    className="hover:text-white flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded-md"
                  >
                    {copiedBool ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedBool ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-indigo-300 break-all">{jdAnalysis.booleanString}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: RESUME ATS MATCHER */}
      {activeTab === 'ats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inputs */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900">Job Description Text</h3>
              <textarea
                rows={5}
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono text-slate-900"
              />

              <h3 className="text-base font-bold text-slate-900 pt-2">Candidate Resume Text</h3>
              <textarea
                rows={6}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono text-slate-900"
              />

              <button
                onClick={handleAnalyzeAts}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>Run ATS Keyword Analysis</span>
              </button>
            </div>

            {/* Analysis Results */}
            {atsAnalysis && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Overall ATS Score</span>
                    <div className="text-3xl font-black text-emerald-600">{atsAnalysis.overallScore}%</div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
                    <div className="bg-emerald-50 text-emerald-700 p-2 rounded-xl">
                      <span>Skills</span>
                      <div className="text-base font-extrabold">{atsAnalysis.skillsScore}%</div>
                    </div>
                    <div className="bg-indigo-50 text-indigo-700 p-2 rounded-xl">
                      <span>Exp</span>
                      <div className="text-base font-extrabold">{atsAnalysis.experienceScore}%</div>
                    </div>
                    <div className="bg-slate-50 text-slate-700 p-2 rounded-xl">
                      <span>Edu</span>
                      <div className="text-base font-extrabold">{atsAnalysis.educationScore}%</div>
                    </div>
                  </div>
                </div>

                {/* Color Legend */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs flex flex-wrap gap-3 font-semibold">
                  <span className="text-slate-600 font-bold">Legend:</span>
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">Green = Required Match</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">Blue = Related Match</span>
                  <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">Yellow = Preferred</span>
                  <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md">Red = Missing</span>
                </div>

                {/* Keyword Badges */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">Keyword Breakdown:</span>
                  <div className="flex flex-wrap gap-2">
                    {atsAnalysis.matchedKeywords.map((item) => {
                      let colorClass = 'bg-emerald-100 text-emerald-900 border-emerald-300';
                      if (item.category === 'semantic') colorClass = 'bg-blue-100 text-blue-900 border-blue-300';
                      if (item.category === 'preferred') colorClass = 'bg-amber-100 text-amber-900 border-amber-300';
                      if (item.category === 'missing') colorClass = 'bg-rose-100 text-rose-900 border-rose-300';

                      return (
                        <span
                          key={item.keyword}
                          className={`text-xs font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1 ${colorClass}`}
                        >
                          <span>{item.keyword}</span>
                          {item.occurrences > 0 && (
                            <span className="bg-white/80 px-1.5 rounded-full text-[10px]">{item.occurrences}x</span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  <span className="font-bold text-slate-800 block">Recruiter Recommendations:</span>
                  <ul className="space-y-1 text-slate-600 list-disc list-inside">
                    {atsAnalysis.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
