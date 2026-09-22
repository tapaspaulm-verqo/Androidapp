import React from 'react';
import { MilestoneSummary, ContractSummary } from '../types';
import { Money, getMilestoneStateStyle, formatShortDate } from '../utils/money';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface StatCardProps {
  id?: string;
  label: string;
  value: string;
  accent: string; // e.g. '#1F5C46' (green) or '#5B3E73' (plum)
}

export const StatCard: React.FC<StatCardProps> = ({ id, label, value, accent }) => {
  return (
    <div
      id={id}
      className="bg-[#F7F6F3] rounded-xl p-4 border-l-[3px] border-y border-r border-[#E8E6DF] transition-shadow hover:shadow-sm"
      style={{ borderLeftColor: accent }}
    >
      <div className="text-[11px] font-semibold tracking-wider text-[#56524B] uppercase">
        {label}
      </div>
      <div className="mt-1.5 font-mono text-xl md:text-2xl font-bold text-[#14130F] truncate">
        {value}
      </div>
    </div>
  );
};

export const VerifiedPill: React.FC<{ verified?: boolean | null }> = ({ verified }) => {
  if (verified) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E3EEE8] text-[#1F5C46] border border-[#B3D3C4]">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Verified KYC
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F7EBD3] text-[#9A6B12] border border-[#E8D4A8]">
      <Clock className="w-3.5 h-3.5" />
      Verification Pending
    </span>
  );
};

export const StatusBadge: React.FC<{ label: string }> = ({ label }) => {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-[#56524B] border border-[#E8E6DF]">
      {label}
    </span>
  );
};

interface MilestoneRowProps {
  milestone: MilestoneSummary;
  actingId?: string | null;
  accentColor: string;
  onStart?: (id: string) => void;
  onSubmit?: (id: string) => void;
  onFund?: (id: string) => void;
}

export const MilestoneRow: React.FC<MilestoneRowProps> = ({
  milestone,
  actingId,
  accentColor,
  onStart,
  onSubmit,
  onFund,
}) => {
  const style = getMilestoneStateStyle(milestone.state);
  const isActing = actingId === milestone.id;

  let actionButton: React.ReactNode = null;

  if (milestone.state === 'Funded' && onStart) {
    actionButton = (
      <button
        id={`btn-start-${milestone.id}`}
        onClick={() => onStart(milestone.id)}
        disabled={isActing}
        className="px-3.5 py-1.5 text-xs font-semibold rounded-md text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
        style={{ backgroundColor: accentColor }}
      >
        {isActing ? 'Starting…' : 'Start work'}
      </button>
    );
  } else if (milestone.state === 'InProgress' && onSubmit) {
    actionButton = (
      <button
        id={`btn-submit-${milestone.id}`}
        onClick={() => onSubmit(milestone.id)}
        disabled={isActing}
        className="px-3.5 py-1.5 text-xs font-semibold rounded-md text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
        style={{ backgroundColor: accentColor }}
      >
        {isActing ? 'Submitting…' : 'Submit for review'}
      </button>
    );
  } else if (milestone.state === 'Unfunded' && onFund) {
    actionButton = (
      <button
        id={`btn-fund-${milestone.id}`}
        onClick={() => onFund(milestone.id)}
        disabled={isActing}
        className="px-3.5 py-1.5 text-xs font-semibold rounded-md text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
        style={{ backgroundColor: accentColor }}
      >
        {isActing ? 'Funding…' : 'Fund escrow'}
      </button>
    );
  } else if (milestone.state === 'Submitted' && milestone.reviewDeadlineAt) {
    actionButton = (
      <span className="text-xs text-[#56524B] flex items-center gap-1 font-medium">
        <Clock className="w-3.5 h-3.5" />
        Review deadline: {formatShortDate(milestone.reviewDeadlineAt)}
      </span>
    );
  }

  return (
    <div className="py-3 border-t border-[#E8E6DF] first:border-t-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="space-y-0.5">
          <div className="text-sm font-semibold text-[#14130F]">{milestone.title}</div>
          <div className="text-xs font-mono font-medium text-[#56524B]">
            {Money.formatMinor(milestone.contractValueMinor)}
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span
            className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
            style={{
              color: style.foreground,
              backgroundColor: style.background,
              border: `1px solid ${style.border}`,
            }}
          >
            {style.label}
          </span>
          {actionButton}
        </div>
      </div>
    </div>
  );
};

interface ContractCardProps {
  id?: string;
  contract: ContractSummary;
  accent: string;
  actingId?: string | null;
  onStart?: (id: string) => void;
  onSubmit?: (id: string) => void;
  onFund?: (id: string) => void;
}

export const ContractCard: React.FC<ContractCardProps> = ({
  id,
  contract,
  accent,
  actingId,
  onStart,
  onSubmit,
  onFund,
}) => {
  return (
    <div
      id={id}
      className="bg-[#F7F6F3] rounded-xl p-5 border-l-[3px] border-y border-r border-[#E8E6DF] mb-4"
      style={{ borderLeftColor: accent }}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h4 className="text-base font-semibold text-[#14130F]">
            {contract.jobTitle ?? contract.scopeSummary}
          </h4>
          <p className="text-xs text-[#56524B] mt-0.5">
            {contract.counterpartyRole
              ? `${contract.counterpartyName} · ${contract.counterpartyRole}`
              : `Party: ${contract.counterpartyName}`}
          </p>
        </div>
        <StatusBadge label={contract.status} />
      </div>

      <div className="mt-4 bg-white rounded-lg p-3 border border-[#E8E6DF]">
        <div className="text-xs font-semibold uppercase tracking-wider text-[#56524B] mb-2">
          Milestones & Escrow Status
        </div>
        <div className="divide-y divide-[#E8E6DF]">
          {contract.milestones.map((m) => (
            <MilestoneRow
              key={m.id}
              milestone={m}
              actingId={actingId}
              accentColor={accent}
              onStart={onStart}
              onSubmit={onSubmit}
              onFund={onFund}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
