import React, { useState } from 'react';
import { JobSummary, RecommendedJob } from '../types';
import { verqoStore } from '../services/store';
import { X, Send, AlertCircle, CheckCircle } from 'lucide-react';

interface ApplyModalProps {
  job: JobSummary | RecommendedJob | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({
  job,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [coverNote, setCoverNote] = useState('');
  const [proposedRate, setProposedRate] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !job) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const rateNum = parseFloat(proposedRate);
    if (!coverNote.trim()) {
      setError('Please provide a brief cover note.');
      return;
    }
    if (isNaN(rateNum) || rateNum <= 0) {
      setError('Please enter a valid proposed rate in ₹.');
      return;
    }

    verqoStore.submitProposal(job.id, coverNote.trim(), Math.round(rateNum * 100));
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-xl border border-[#E8E6DF] relative">
        <button
          id="btn-close-apply-modal"
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-[#56524B] hover:text-[#14130F] hover:bg-[#F7F6F3]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1F5C46]">
            Submit Proposal
          </span>
          <h2 className="text-xl font-bold text-[#14130F] font-['IBM_Plex_Sans'] mt-0.5">
            {job.title}
          </h2>
          <p className="text-xs text-[#56524B] mt-0.5">
            Client: <strong>{job.clientName}</strong> · Role: {job.roleCategory}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-lg bg-[#F6E1DE] text-[#A13A2F] text-xs flex items-center gap-2 border border-[#E8B9B3]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block font-semibold text-[#14130F] mb-1">
              Why you're a good fit (Cover Note)
            </label>
            <textarea
              id="apply-input-covernote"
              rows={4}
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
              placeholder="Highlight your relevant engineering experience, tech stack familiarity, and previous milestone deliverables..."
              className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-[#E8E6DF] focus:border-[#1F5C46] focus:outline-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#14130F] mb-1">
              Proposed Total Rate or Milestone Value (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#56524B]">
                ₹
              </span>
              <input
                id="apply-input-rate"
                type="number"
                min="1000"
                step="1000"
                value={proposedRate}
                onChange={(e) => setProposedRate(e.target.value)}
                placeholder="50000"
                className="w-full pl-7 pr-3 py-2 text-sm font-mono bg-white rounded-lg border border-[#E8E6DF] focus:border-[#1F5C46] focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-[#56524B] mt-1">
              5% platform fee will be deducted upon approved milestone payout.
            </p>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-md text-[#56524B] hover:bg-[#F7F6F3]"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="apply-submit-button"
              className="px-5 py-2 text-xs font-semibold rounded-md text-white bg-[#1F5C46] hover:bg-[#184837] shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Send Proposal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
