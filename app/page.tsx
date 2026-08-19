'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { FinancialInputs, CountryCode, CurrencyCode } from '../lib/types';
import { SupportedLanguage, getTranslation } from '../lib/i18n';
import { calculateSnapshot } from '../lib/engine';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { HeroSection } from '../components/hero/HeroSection';
import { DashboardView } from '../components/dashboard/DashboardView';
import { GoogleAdSlot } from '../components/ads/GoogleAdSlot';
import { MotionContainer } from '../components/common/MotionContainer';

// Recruiter Mode Imports
import { RecruiterInputs, TalentCandidate } from '../lib/recruiterTypes';
import { calculateRecruiterMetrics } from '../lib/recruiterEngine';
import {
  recruiterStore,
  JobRecord,
  CandidateRecord,
  CandidateJobRecord,
  RecruiterActivityItem,
} from '../lib/recruiterStore';

import { RecruiterSidebar } from '../components/recruiter/RecruiterSidebar';
import { SimplifiedDashboardView } from '../components/recruiter/SimplifiedDashboardView';
import { JobManagementView } from '../components/recruiter/JobManagementView';
import { TalentSearchSection } from '../components/recruiter/TalentSearchSection';
import { RecruiterHeroSection } from '../components/recruiter/RecruiterHeroSection';
import { RecruiterRateSnapshot } from '../components/recruiter/RecruiterRateSnapshot';
import { RateCardBuilder } from '../components/recruiter/RateCardBuilder';
import { ContractProfitabilitySection } from '../components/recruiter/ContractProfitabilitySection';
import { ReportsView } from '../components/recruiter/ReportsView';

export default function Home() {
  // Product Mode: 'payscope' (employee/contractor) | 'recruiting' (PayScope Recruit)
  const [productMode, setProductMode] = useState<'payscope' | 'recruiting'>('payscope');
  const [activeView, setActiveView] = useState<'hero' | 'dashboard'>('hero');

  // Language State: 'en' | 'es' | 'pt'
  const [language, setLanguage] = useState<SupportedLanguage>('en');

  // 5 Primary Navigation Tabs for PayScope Recruit
  const [recruiterTab, setRecruiterTab] = useState<string>('dashboard');
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);

  // Store State - Initialized from LocalStorage or Empty Arrays
  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [candidates, setCandidates] = useState<CandidateRecord[]>([]);
  const [candidateJobs, setCandidateJobs] = useState<CandidateJobRecord[]>([]);
  const [activities, setActivities] = useState<RecruiterActivityItem[]>([]);

  useEffect(() => {
    setJobs(recruiterStore.getJobs());
    setCandidates(recruiterStore.getCandidates());
    setCandidateJobs(recruiterStore.getCandidateJobs());
  }, []);

  // Employee/Contractor Inputs State
  const [inputs, setInputs] = useState<FinancialInputs>({
    country: 'US',
    currency: 'USD',
    employmentType: 'Full-time Employee',
    incomeRate: 120000,
    annualSalary: 120000,
    state: 'Texas',
    city: 'Austin',
    filingStatus: 'Single',
    dependents: 0,
    workHoursPerWeek: 40,
    weeksPerYear: 52,
  });

  // Recruiter Mode Inputs State - Strictly Empty Initial Values
  const [recruiterInputs, setRecruiterInputs] = useState<RecruiterInputs>({
    jobTitle: '',
    country: 'US',
    currency: 'USD',
    state: '',
    city: '',
    contractType: 'C2C',
    rateFrequency: 'Hourly',
    candidatePayRate: 0,
    clientBillRate: 0,
    workHoursPerWeek: 40,
    weeksPerYear: 52,
    billableHoursPerWeek: 40,
    contractDurationMonths: 6,
    targetMarginPercent: 25,
    employerBurdenPercent: 0,
    benefitsMonthly: 0,
    insuranceMonthly: 0,
    otherRecurringMonthly: 0,
    oneTimeRecruitingCost: 0,
    targetMarginMode: 'calculate_bill_rate',
    recruiterIncentiveType: 'percentage_profit',
    recruiterIncentiveValue: 10,
  });

  // Calculations
  const snapshot = useMemo(() => calculateSnapshot(inputs), [inputs]);
  const recruiterCalculation = useMemo(() => calculateRecruiterMetrics(recruiterInputs), [recruiterInputs]);
  const t = useMemo(() => getTranslation(language), [language]);

  // Handle Country Selection - Independent of Currency!
  const handleCountryChange = (country: CountryCode) => {
    let defaultState = 'Texas';
    let defaultCity = 'Austin';
    let defaultLang: SupportedLanguage = 'en';

    if (country === 'CA') {
      defaultState = 'Ontario';
      defaultCity = 'Toronto';
      defaultLang = 'en';
    } else if (country === 'MX') {
      defaultState = 'Mexico City';
      defaultCity = 'Mexico City';
      defaultLang = 'es';
    } else if (country === 'BR') {
      defaultState = 'São Paulo';
      defaultCity = 'São Paulo';
      defaultLang = 'pt';
    }

    setLanguage(defaultLang);

    setInputs((prev) => ({
      ...prev,
      country,
      // Note: Currency remains unchanged to allow independent selection!
      state: defaultState,
      city: defaultCity,
    }));

    setRecruiterInputs((prev) => ({
      ...prev,
      country,
      state: defaultState,
      city: defaultCity,
    }));
  };

  // Handle Currency Selection - Independent of Country!
  const handleCurrencyChange = (currency: CurrencyCode) => {
    setInputs((prev) => ({ ...prev, currency }));
    setRecruiterInputs((prev) => ({ ...prev, currency }));
  };

  const handleReset = () => {
    setActiveView('hero');
  };

  const handleNavigateTab = (tab: string) => {
    setRecruiterTab(tab);
  };

  // JOB CRUD HANDLERS
  const handleAddJob = (newJob: JobRecord) => {
    const updated = recruiterStore.addJob(newJob);
    setJobs(updated);
  };

  const handleUpdateJob = (updatedJob: JobRecord) => {
    const updated = recruiterStore.updateJob(updatedJob);
    setJobs(updated);
  };

  const handleDeleteJob = (jobId: string) => {
    const updated = recruiterStore.deleteJob(jobId);
    setJobs(updated);
    setCandidateJobs(recruiterStore.getCandidateJobs());
  };

  // CANDIDATE DATABASE CRUD HANDLERS
  const handleAddCandidate = (newCand: CandidateRecord) => {
    const updated = recruiterStore.addCandidate(newCand);
    setCandidates(updated);
  };

  const handleUpdateCandidate = (cand: CandidateRecord) => {
    const updated = recruiterStore.updateCandidate(cand);
    setCandidates(updated);
  };

  const handleDeleteCandidate = (candidateId: string) => {
    const updated = recruiterStore.deleteCandidate(candidateId);
    setCandidates(updated);
    setCandidateJobs(recruiterStore.getCandidateJobs());
  };

  const handleUpdateCandidateJob = (updatedRecord: CandidateJobRecord) => {
    const updatedRecords = recruiterStore.updateCandidateJob(updatedRecord);
    setCandidateJobs(updatedRecords);
  };

  const handleAddCandidateToJob = (talent: TalentCandidate, jobId: string) => {
    let existingCandidate = candidates.find((c) => c.name.toLowerCase() === talent.name.toLowerCase());
    let candId = existingCandidate?.id;

    if (!existingCandidate) {
      const newCand: CandidateRecord = {
        id: `cand-${Date.now()}`,
        name: talent.name,
        email: `${talent.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        phone: '+1 (555) 019-2834',
        headline: talent.headline,
        currentCompany: 'Current Organization',
        location: talent.location,
        yearsOfExperience: talent.yearsOfExperience,
        skills: talent.skills,
        bioSummary: talent.bioSummary,
        linkedInUrl: talent.linkedInUrl,
        photoUrl: talent.photoUrl,
        expectedRate: talent.suggestedPayRate,
        createdAt: new Date().toISOString().split('T')[0],
      };
      const updatedCandidates = recruiterStore.addCandidate(newCand);
      setCandidates(updatedCandidates);
      candId = newCand.id;
    }

    const newCandidateJobRecord: CandidateJobRecord = {
      id: `cj-${Date.now()}`,
      jobId,
      candidateId: candId!,
      stage: 'New',
      offeredRate: talent.suggestedPayRate,
      billRate: talent.suggestedBillRate,
      notes: 'Added from Candidate Search',
      timeline: [{ id: `t-${Date.now()}`, stage: 'New', dateString: new Date().toLocaleDateString('en-US') }],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    const updatedCandidateJobs = recruiterStore.updateCandidateJob(newCandidateJobRecord);
    setCandidateJobs(updatedCandidateJobs);
  };

  const handleApplyCandidateRate = (payRate: number, billRate: number, jobTitle: string) => {
    setRecruiterInputs((prev) => ({
      ...prev,
      candidatePayRate: payRate,
      clientBillRate: billRate,
      jobTitle: jobTitle || prev.jobTitle,
    }));
    setRecruiterTab('rate');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Navbar Header */}
      <Navbar
        country={inputs.country}
        currency={inputs.currency}
        language={language}
        onCountryChange={handleCountryChange}
        onCurrencyChange={handleCurrencyChange}
        onLanguageChange={setLanguage}
        activeView={activeView}
        onSwitchView={setActiveView}
        onReset={handleReset}
        productMode={productMode}
        onProductModeChange={setProductMode}
        recruiterTab={recruiterTab}
        onRecruiterTabChange={handleNavigateTab}
      />

      {/* Top Google Leaderboard Ad Space */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <GoogleAdSlot type="leaderboard" adSlotId="top-leaderboard-01" />
      </div>

      {/* Main Container - Expanded Width (max-w-[1440px]) with Motion.dev Animations */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <AnimatePresence mode="wait">
          {productMode === 'payscope' ? (
            /* ---------------- EMPLOYEE MODE ---------------- */
            <motion.div
              key="payscope-mode"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {activeView === 'hero' ? (
                <HeroSection
                  inputs={inputs}
                  snapshot={snapshot}
                  onInputsChange={setInputs}
                  onCalculate={() => setActiveView('dashboard')}
                />
              ) : (
                <DashboardView inputs={inputs} snapshot={snapshot} />
              )}
            </motion.div>
          ) : (
            /* ---------------- PAYSCOPE RECRUIT MODE ---------------- */
            <motion.div
              key="recruiting-mode"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="py-4 flex flex-col lg:flex-row gap-6 items-start"
            >
              {/* Recruiter Sidebar Navigation */}
              <RecruiterSidebar
                activeTab={recruiterTab}
                onTabChange={handleNavigateTab}
              />

              {/* Recruiter Main Workspace */}
              <main className="flex-1 w-full space-y-6">
                <AnimatePresence mode="wait">
                  {/* TAB 1: DASHBOARD */}
                  {recruiterTab === 'dashboard' && (
                    <motion.div
                      key="tab-dashboard"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <SimplifiedDashboardView
                        jobs={jobs}
                        candidates={candidates}
                        candidateJobs={candidateJobs}
                        activities={activities}
                        onNavigateTab={handleNavigateTab}
                        onOpenAddJobModal={() => {
                          setRecruiterTab('jobs');
                          setIsAddJobModalOpen(true);
                        }}
                      />
                    </motion.div>
                  )}

                  {/* TAB 2: CANDIDATE SEARCH */}
                  {recruiterTab === 'search' && (
                    <motion.div
                      key="tab-search"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <TalentSearchSection
                        inputs={recruiterInputs}
                        jobs={jobs}
                        savedCandidates={candidates}
                        onApplyCandidateRate={handleApplyCandidateRate}
                        onAddCandidateToJob={handleAddCandidateToJob}
                        onSaveCandidateToDatabase={handleAddCandidate}
                      />
                    </motion.div>
                  )}

                  {/* TAB 3: JOBS & PIPELINE */}
                  {recruiterTab === 'jobs' && (
                    <motion.div
                      key="tab-jobs"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <JobManagementView
                        jobs={jobs}
                        candidates={candidates}
                        candidateJobs={candidateJobs}
                        onAddJob={handleAddJob}
                        onUpdateJob={handleUpdateJob}
                        onDeleteJob={handleDeleteJob}
                        onAddCandidate={handleAddCandidate}
                        onUpdateCandidate={handleUpdateCandidate}
                        onDeleteCandidate={handleDeleteCandidate}
                        onUpdateCandidateJob={handleUpdateCandidateJob}
                        isAddModalOpen={isAddJobModalOpen}
                        onCloseAddModal={() => setIsAddJobModalOpen(false)}
                      />
                    </motion.div>
                  )}

                  {/* TAB 4: RATE & MARGIN */}
                  {recruiterTab === 'rate' && (
                    <motion.div
                      key="tab-rate"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      <RecruiterHeroSection
                        inputs={recruiterInputs}
                        calculation={recruiterCalculation}
                        onInputsChange={setRecruiterInputs}
                        onCalculate={() => {}}
                      />
                      {recruiterInputs.candidatePayRate > 0 || recruiterInputs.clientBillRate > 0 ? (
                        <>
                          <RecruiterRateSnapshot
                            inputs={recruiterInputs}
                            calculation={recruiterCalculation}
                          />
                          <ContractProfitabilitySection
                            inputs={recruiterInputs}
                            calculation={recruiterCalculation}
                            onInputsChange={setRecruiterInputs}
                          />
                        </>
                      ) : null}
                      <RateCardBuilder />
                    </motion.div>
                  )}

                  {/* TAB 5: REPORTS & PDF */}
                  {recruiterTab === 'reports' && (
                    <motion.div
                      key="tab-reports"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ReportsView
                        jobs={jobs}
                        candidates={candidates}
                        candidateJobs={candidateJobs}
                        recruiterInputs={recruiterInputs}
                        recruiterCalculation={recruiterCalculation}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </main>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Google Leaderboard Ad Space */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <GoogleAdSlot type="in-feed" adSlotId="bottom-leaderboard-02" />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
