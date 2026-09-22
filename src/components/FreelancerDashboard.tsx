import React, { useState } from 'react';
import { FreelancerDashboardData, RecommendedJob } from '../types';
import { verqoStore } from '../services/store';
import { Money } from '../utils/money';
import { StatCard, VerifiedPill, ContractCard } from './DashboardWidgets';
import { ArrowRight, RefreshCw, FileText, CheckCircle } from 'lucide-react';

interface FreelancerDashboardProps {
  data: FreelancerDashboardData;
  onApplyRecommended: (job: RecommendedJob) => void;
}

export const FreelancerDashboard: React.FC<FreelancerDashboardProps> = ({
  data,
  onApplyRecommended,
}) => {
  const [actingMilestoneId, setActingMilestoneId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const handleStartWork = (milestoneId: string) => {
    setActingMilestoneId(milestoneId);
    setTimeout(() => {
      verqoStore.startMilestone(milestoneId);
      setActingMilestoneId(null);
      setActionNotice('Milestone started! Status moved to In Progress.');
      setTimeout(() => setActionNotice(null), 3500);
    }, 400);
  };

  const handleSubmitMilestone = (milestoneId: string) => {
    setActingMilestoneId(milestoneId);
    setTimeout(() => {
      verqoStore.submitMilestone(milestoneId);
      setActingMilestoneId(null);
      setActionNotice('Deliverables submitted for review! Client notified.');
      setTimeout(() => setActionNotice(null), 3500);
    }, 400);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="bg-[#E3EEE8] border border-[#B3D3C4] text-[#1F5C46] px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Header Profile Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#14130F] font-['IBM_Plex_Sans']">
              Welcome back, {data.displayName}
            </h1>
            <VerifiedPill verified={data.isFullyVerified} />
          </div>
          <p className="text-sm text-[#56524B] mt-1 font-medium">
            {data.primaryRole} · {data.experienceLevel}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#56524B] bg-white border border-[#E8E6DF] px-3 py-1.5 rounded-lg">
            Persona: <strong className="text-[#1F5C46]">Freelancer</strong>
          </span>
        </div>
      </div>

      {/* 4 Stat Cards in 2x2 or 4x1 grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          id="stat-freelancer-active-contracts"
          label="Active contracts"
          value={`${data.activeContracts}`}
          accent="#1F5C46"
        />
        <StatCard
          id="stat-freelancer-total-earned"
          label="Total earned"
          value={Money.formatMinor(data.totalEarnedMinor)}
          accent="#1F5C46"
        />
        <StatCard
          id="stat-freelancer-pending-escrow"
          label="Pending in escrow"
          value={Money.formatMinor(data.pendingInEscrowMinor)}
          accent="#1F5C46"
        />
        <StatCard
          id="stat-freelancer-open-proposals"
          label="Open proposals"
          value={`${data.openProposalsCount}`}
          accent="#1F5C46"
        />
      </div>

      {/* Active Contracts & Milestones */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#14130F] font-['IBM_Plex_Sans']">
              Your Contracts & Milestones
            </h2>
            <p className="text-xs text-[#56524B] mt-0.5">
              Work on funded milestones and submit deliverables for payment release
            </p>
          </div>
        </div>

        {data.contracts.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-[#E8E6DF]">
            <p className="text-sm text-[#56524B]">No contracts yet — apply to an open job below to get started.</p>
          </div>
        ) : (
          data.contracts.map((contract) => (
            <ContractCard
              key={contract.id}
              id={`contract-card-${contract.id}`}
              contract={contract}
              accent="#1F5C46"
              actingId={actingMilestoneId}
              onStart={handleStartWork}
              onSubmit={handleSubmitMilestone}
            />
          ))
        )}
      </section>

      {/* Earnings & Taxes Card (Indian TDS Sec 194-O) */}
      <section className="bg-white rounded-xl p-6 border-l-4 border-l-[#1F5C46] border-y border-r border-[#E8E6DF] shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-[#1F5C46]" />
          <h3 className="text-lg font-bold text-[#14130F] font-['IBM_Plex_Sans']">
            Earnings & Tax Summary (FY 2026-27)
          </h3>
        </div>

        <div className="divide-y divide-[#E8E6DF] text-sm">
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-[#56524B]">FY-to-date earned</span>
            <span className="font-mono font-semibold text-[#14130F]">
              {Money.formatMinor(data.taxSummary.fyToDateEarnedMinor)}
            </span>
          </div>
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-[#56524B]">Estimated TDS (Section 194-O, 1%)</span>
            <span className="font-mono font-semibold text-[#1F5C46]">
              {Money.formatMinor(data.taxSummary.estimatedTdsMinor)}
            </span>
          </div>
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-[#56524B]">GST collected on file (18%)</span>
            <span className="font-mono font-semibold text-[#14130F]">
              {Money.formatMinor(data.taxSummary.totalGstCollectedMinor)}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#E8E6DF] text-xs text-[#56524B] leading-relaxed bg-[#F7F6F3] p-3 rounded-lg">
          <strong>Statutory Compliance Note:</strong> {data.taxSummary.note}
        </div>
      </section>

      {/* Recommended Jobs / New Project Search */}
      <section className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-[#14130F] font-['IBM_Plex_Sans']">
          Recommended Projects Matching Your Profile
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {data.recommendedJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-xl p-4 border border-[#E8E6DF] flex flex-col justify-between"
            >
              <div>
                <h4 className="font-bold text-sm text-[#14130F]">{job.title}</h4>
                <p className="text-xs text-[#56524B] mt-1">
                  {job.clientName} · {job.roleCategory}
                </p>
                {job.budgetMinorMin && job.budgetMinorMax && (
                  <p className="text-xs font-mono font-semibold text-[#1F5C46] mt-2">
                    {Money.formatMinor(job.budgetMinorMin)} – {Money.formatMinor(job.budgetMinorMax)}
                  </p>
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-[#F7F6F3] flex justify-end">
                <button
                  id={`btn-recommended-apply-${job.id}`}
                  onClick={() => onApplyRecommended(job)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-[#1F5C46] bg-[#E3EEE8] hover:bg-[#B3D3C4] rounded-md transition-colors flex items-center gap-1"
                >
                  Apply
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
