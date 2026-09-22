import React, { useState } from 'react';
import { JobSummary, SessionUser } from '../types';
import { Money } from '../utils/money';
import { Search, Briefcase, Filter, ArrowRight } from 'lucide-react';

interface JobsScreenProps {
  jobs: JobSummary[];
  currentUser: SessionUser | null;
  onApply: (job: JobSummary) => void;
  onOpenLogin: () => void;
  onOpenFreelancerSignup: () => void;
}

export const JobsScreen: React.FC<JobsScreenProps> = ({
  jobs,
  currentUser,
  onApply,
  onOpenLogin,
  onOpenFreelancerSignup,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Backend Engineer',
    'Frontend Engineer',
    'Architecture',
    'Mobile Engineer',
    'DevOps Engineer',
  ];

  const filteredJobs = jobs.filter((job) => {
    const matchesCategory =
      selectedCategory === 'All' || job.roleCategory.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.roleCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.clientName && job.clientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (job.description && job.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#14130F] font-['IBM_Plex_Sans']">
            Explore Open Tech Projects
          </h1>
          <p className="text-sm text-[#56524B] mt-1">
            Verified Indian engineering contracts backed by milestone escrow
          </p>
        </div>

        {!currentUser && (
          <div className="bg-[#E3EEE8] border border-[#B3D3C4] px-3.5 py-2 rounded-lg text-xs flex items-center gap-2">
            <span className="text-[#1F5C46] font-medium">Freelancer?</span>
            <button
              onClick={onOpenFreelancerSignup}
              className="font-bold text-[#1F5C46] hover:underline"
            >
              Sign up with Aadhaar KYC
            </button>
            <span className="text-[#56524B]">or</span>
            <button onClick={onOpenLogin} className="font-semibold text-[#14130F] hover:underline">
              Log in
            </button>
          </div>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl p-3 border border-[#E8E6DF] shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9C978D]" />
          <input
            id="jobs-search-input"
            type="text"
            placeholder="Search by role, stack, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-[#F7F6F3] rounded-lg border border-transparent focus:border-[#1F5C46] focus:bg-white focus:outline-none transition-colors"
          />
        </div>

        {/* Categories Dropdown or Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#14130F] text-white'
                  : 'bg-[#F7F6F3] text-[#56524B] hover:text-[#14130F] hover:bg-[#EDEBE6]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-[#E8E6DF]">
            <Briefcase className="w-8 h-8 mx-auto text-[#9C978D] mb-3" />
            <h3 className="text-base font-semibold text-[#14130F]">No jobs match your search</h3>
            <p className="text-xs text-[#56524B] mt-1">
              Try adjusting your search terms or clearing the role category filter.
            </p>
          </div>
        ) : (
          filteredJobs.map((job) => {
            const hasMin = job.budgetMinorMin != null;
            const hasMax = job.budgetMinorMax != null;
            let budgetText = 'Disclosed on review';
            if (hasMin && hasMax) {
              budgetText = `${Money.formatMinor(job.budgetMinorMin!)} – ${Money.formatMinor(job.budgetMinorMax!)}`;
            } else if (hasMin) {
              budgetText = `From ${Money.formatMinor(job.budgetMinorMin!)}`;
            } else if (hasMax) {
              budgetText = `Up to ${Money.formatMinor(job.budgetMinorMax!)}`;
            }

            return (
              <div
                key={job.id}
                id={`job-card-${job.id}`}
                className="bg-white rounded-xl p-5 border border-[#E8E6DF] hover:border-[#B3D3C4] transition-all hover:shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-[#14130F]">{job.title}</h3>
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#EDEBE6] text-[#56524B]">
                        {job.channel}
                      </span>
                    </div>
                    <div className="text-xs text-[#56524B] font-medium">
                      {job.clientName ?? 'Verified Client'} · {job.roleCategory}
                      {job.postedAt && ` · Posted ${job.postedAt}`}
                    </div>
                  </div>

                  <div className="text-right self-start sm:self-auto">
                    <div className="text-sm font-mono font-bold text-[#1F5C46]">
                      {budgetText}
                    </div>
                    <div className="text-[11px] text-[#56524B]">Escrow protected</div>
                  </div>
                </div>

                {job.description && (
                  <p className="text-xs sm:text-sm text-[#56524B] mt-3 leading-relaxed">
                    {job.description}
                  </p>
                )}

                <div className="mt-4 pt-3 border-t border-[#F7F6F3] flex items-center justify-between">
                  <span className="text-[11px] text-[#9C978D]">
                    5% platform fee deducted upon milestone release
                  </span>
                  <button
                    id={`btn-apply-${job.id}`}
                    onClick={() => onApply(job)}
                    className="px-4 py-1.5 text-xs font-semibold rounded-md text-white bg-[#1F5C46] hover:bg-[#184837] shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    Apply with Proposal
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
