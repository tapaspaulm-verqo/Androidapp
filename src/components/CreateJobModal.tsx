import React, { useState } from 'react';
import { verqoStore } from '../services/store';
import { X, Plus, AlertCircle } from 'lucide-react';

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateJobModal: React.FC<CreateJobModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [roleCategory, setRoleCategory] = useState('Backend Engineer');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Project title is required.');
      return;
    }
    if (!description.trim()) {
      setError('Project description is required.');
      return;
    }

    const minNum = budgetMin ? parseFloat(budgetMin) : null;
    const maxNum = budgetMax ? parseFloat(budgetMax) : null;

    verqoStore.createJob({
      title: title.trim(),
      description: description.trim(),
      roleCategory: roleCategory.trim(),
      budgetMinorMin: minNum ? Math.round(minNum * 100) : null,
      budgetMinorMax: maxNum ? Math.round(maxNum * 100) : null,
    });

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-xl border border-[#E8E6DF] relative">
        <button
          id="btn-close-create-job-modal"
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-[#56524B] hover:text-[#14130F] hover:bg-[#F7F6F3]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5">
          <h2 className="text-xl font-bold text-[#14130F] font-['IBM_Plex_Sans']">
            Post New Engineering Project
          </h2>
          <p className="text-xs text-[#56524B] mt-0.5">
            Describe your technical requirements to receive proposals from verified contractors
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
            <label className="block font-semibold text-[#14130F] mb-1">Project Title</label>
            <input
              id="job-input-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Distributed Ledger Service in Go & Kubernetes"
              required
              className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-[#E8E6DF] focus:border-[#5B3E73] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#14130F] mb-1">What needs doing (Scope)</label>
            <textarea
              id="job-input-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Specify the technical deliverables, milestone expectations, and stack requirements..."
              required
              className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-[#E8E6DF] focus:border-[#5B3E73] focus:outline-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#14130F] mb-1">Role Category</label>
            <select
              id="job-input-role"
              value={roleCategory}
              onChange={(e) => setRoleCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-[#E8E6DF] focus:border-[#5B3E73] focus:outline-none"
            >
              <option value="Backend Engineer">Backend Engineer</option>
              <option value="Frontend Engineer">Frontend Engineer</option>
              <option value="Fullstack Architect">Fullstack Architect</option>
              <option value="Mobile Flutter Engineer">Mobile Flutter Engineer</option>
              <option value="DevOps & SRE">DevOps & SRE</option>
              <option value="Data & AI Engineer">Data & AI Engineer</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#14130F] mb-1">Budget From (₹)</label>
              <input
                id="job-input-budget-min"
                type="number"
                step="5000"
                value={budgetMin}
                onChange={(e) => setBudgetMin(e.target.value)}
                placeholder="40000"
                className="w-full px-3 py-2 text-sm font-mono bg-white rounded-lg border border-[#E8E6DF] focus:border-[#5B3E73] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#14130F] mb-1">Budget To (₹)</label>
              <input
                id="job-input-budget-max"
                type="number"
                step="5000"
                value={budgetMax}
                onChange={(e) => setBudgetMax(e.target.value)}
                placeholder="80000"
                className="w-full px-3 py-2 text-sm font-mono bg-white rounded-lg border border-[#E8E6DF] focus:border-[#5B3E73] focus:outline-none"
              />
            </div>
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
              id="job-submit-button"
              className="px-5 py-2 text-xs font-semibold rounded-md text-white bg-[#5B3E73] hover:bg-[#48315B] shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Post Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
