import React, { useState } from 'react';
import { ClientDashboardData, FreelancerListItem } from '../types';
import { verqoStore } from '../services/store';
import { Money, formatShortDate } from '../utils/money';
import { StatCard, ContractCard, VerifiedPill } from './DashboardWidgets';
import { Plus, Search, CheckCircle, Clock, Check, Building2 } from 'lucide-react';

interface ClientDashboardProps {
  data: ClientDashboardData;
  freelancers: FreelancerListItem[];
  onCreateProject: () => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({
  data,
  freelancers,
  onCreateProject,
}) => {
  const [actingMilestoneId, setActingMilestoneId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleFundMilestone = (milestoneId: string) => {
    setActingMilestoneId(milestoneId);
    setTimeout(() => {
      verqoStore.fundMilestone(milestoneId);
      setActingMilestoneId(null);
      setActionNotice('Milestone funded in escrow! Contractor can now start work.');
      setTimeout(() => setActionNotice(null), 3500);
    }, 400);
  };

  const handleApproveMilestone = (milestoneId: string) => {
    setActingMilestoneId(milestoneId);
    setTimeout(() => {
      verqoStore.approveMilestone(milestoneId);
      setActingMilestoneId(null);
      setActionNotice('Deliverables approved! Payment released from escrow to contractor.');
      setTimeout(() => setActionNotice(null), 3500);
    }, 400);
  };

  const filteredFreelancers = freelancers.filter(
    (f) =>
      f.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.primaryRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.experienceLevel.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#14130F] font-['IBM_Plex_Sans']">
              {data.companyName}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F2EBF7] text-[#5B3E73] border border-[#D5C2E6]">
              {data.plan} Plan
            </span>
          </div>
          <p className="text-sm text-[#56524B] mt-1 font-medium flex items-center gap-2">
            <span>Verified Business Client</span>
            {data.gstin && (
              <>
                <span>·</span>
                <span className="font-mono text-xs text-[#56524B]">
                  GSTIN: {data.gstin}
                </span>
              </>
            )}
          </p>
        </div>

        <button
          id="btn-client-create-project-top"
          onClick={onCreateProject}
          className="px-4 py-2 text-sm font-semibold rounded-lg text-white bg-[#5B3E73] hover:bg-[#48315B] shadow-sm transition-all flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Post New Project
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          id="stat-client-active-contracts"
          label="Active contracts"
          value={`${data.activeContracts}`}
          accent="#5B3E73"
        />
        <StatCard
          id="stat-client-escrow-balance"
          label="Escrow balance"
          value={Money.formatMinor(data.escrowBalanceMinor)}
          accent="#5B3E73"
        />
        <StatCard
          id="stat-client-pending-approvals"
          label="Pending approvals"
          value={`${data.pendingApprovalsCount}`}
          accent="#5B3E73"
        />
        <StatCard
          id="stat-client-open-jobs"
          label="Open job posts"
          value={`${data.openJobsCount}`}
          accent="#5B3E73"
        />
      </div>

      {/* Pending Approvals Queue (High Priority) */}
      {data.pendingApprovals.length > 0 && (
        <section className="bg-white rounded-xl p-5 border-l-4 border-l-[#5B3E73] border-y border-r border-[#E8E6DF] shadow-xs">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-[#14130F] font-['IBM_Plex_Sans'] flex items-center gap-2">
              <span>Pending Approvals & Payment Releases</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-[#F2EBF7] text-[#5B3E73]">
                {data.pendingApprovals.length}
              </span>
            </h3>
            <p className="text-xs text-[#56524B] mt-0.5">
              Work submitted by contractors waiting for your review and payout release
            </p>
          </div>

          <div className="space-y-3">
            {data.pendingApprovals.map((approval) => (
              <div
                key={approval.id}
                className="bg-[#F7F6F3] p-4 rounded-lg border border-[#E8E6DF] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <h4 className="font-semibold text-sm text-[#14130F]">{approval.title}</h4>
                  <div className="text-xs text-[#56524B] mt-0.5">
                    Delivered by <strong>{approval.freelancerName}</strong> · Review deadline:{' '}
                    {formatShortDate(approval.reviewDeadlineAt)}
                  </div>
                  <div className="text-sm font-mono font-bold text-[#5B3E73] mt-1">
                    {Money.formatMinor(approval.contractValueMinor)}
                  </div>
                </div>

                <button
                  id={`btn-approve-release-${approval.id}`}
                  onClick={() => handleApproveMilestone(approval.id)}
                  disabled={actingMilestoneId === approval.id}
                  className="px-4 py-2 text-xs font-semibold rounded-md text-white bg-[#5B3E73] hover:bg-[#48315B] shadow-xs transition-opacity disabled:opacity-50 flex items-center gap-1.5 self-end sm:self-auto"
                >
                  <Check className="w-3.5 h-3.5" />
                  {actingMilestoneId === approval.id ? 'Releasing…' : 'Approve & Release Payment'}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Active Contractor Contracts */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#14130F] font-['IBM_Plex_Sans']">
            Your Active Contractors & Contracts
          </h2>
          <p className="text-xs text-[#56524B] mt-0.5">
            Deposit milestone escrow so contractors can start working
          </p>
        </div>

        {data.contracts.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-[#E8E6DF]">
            <p className="text-sm text-[#56524B]">No contracts yet — post a project or hire a contractor below.</p>
          </div>
        ) : (
          data.contracts.map((contract) => (
            <ContractCard
              key={contract.id}
              id={`client-contract-${contract.id}`}
              contract={contract}
              accent="#5B3E73"
              actingId={actingMilestoneId}
              onFund={handleFundMilestone}
            />
          ))
        )}
      </section>

      {/* Your Posted Projects */}
      <section className="bg-white rounded-xl p-6 border border-[#E8E6DF] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-[#14130F] font-['IBM_Plex_Sans']">
              Your Job Postings
            </h3>
            <p className="text-xs text-[#56524B]">Track received proposals from verified freelancers</p>
          </div>
          <button
            id="btn-client-post-another"
            onClick={onCreateProject}
            className="text-xs font-semibold text-[#5B3E73] hover:underline"
          >
            + New Posting
          </button>
        </div>

        {data.postedJobs.length === 0 ? (
          <p className="text-xs text-[#56524B]">Nothing posted yet.</p>
        ) : (
          <div className="divide-y divide-[#E8E6DF]">
            {data.postedJobs.map((job) => (
              <div key={job.id} className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-[#14130F]">{job.title}</h4>
                  <span className="text-xs text-[#56524B]">Status: {job.status}</span>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#F7F6F3] text-[#56524B] border border-[#E8E6DF]">
                    {job.proposalCount} proposal{job.proposalCount === 1 ? '' : 's'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Find New Contractors Directory */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#14130F] font-['IBM_Plex_Sans']">
            Find & Hire Verified Contractors
          </h2>
          <p className="text-xs text-[#56524B] mt-0.5">
            Engineers verified via Indian Aadhaar and PAN holder verification
          </p>
        </div>

        {/* Contractor Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9C978D]" />
          <input
            id="contractor-search-input"
            type="text"
            placeholder="Search contractors by role (e.g. Backend, Flutter, React) or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-white rounded-lg border border-[#E8E6DF] focus:border-[#5B3E73] focus:outline-none transition-colors"
          />
        </div>

        {/* Directory Grid */}
        <div className="space-y-3">
          {filteredFreelancers.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border border-[#E8E6DF]">
              <p className="text-xs text-[#56524B]">No contractors match that search.</p>
            </div>
          ) : (
            filteredFreelancers.map((freelancer) => (
              <div
                key={freelancer.id}
                className="bg-white rounded-xl p-4 border border-[#E8E6DF] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#D5C2E6] transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-[#14130F]">
                      {freelancer.displayName}
                    </h4>
                    <VerifiedPill verified={freelancer.isFullyVerified} />
                  </div>
                  <div className="text-xs text-[#56524B] mt-0.5">
                    {freelancer.primaryRole} · {freelancer.experienceLevel}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  {freelancer.hourlyRateMinor && (
                    <div className="font-mono text-sm font-semibold text-[#14130F]">
                      {Money.formatMinor(freelancer.hourlyRateMinor)}/hr
                    </div>
                  )}
                  <button
                    onClick={onCreateProject}
                    className="px-3 py-1.5 text-xs font-semibold rounded-md text-[#5B3E73] bg-[#F2EBF7] hover:bg-[#D5C2E6] transition-colors"
                  >
                    Invite to Project
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};
