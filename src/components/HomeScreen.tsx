import React from 'react';
import { Shield, CheckCircle, ArrowRight, FileCheck, Layers, Landmark, Sparkles } from 'lucide-react';

interface HomeScreenProps {
  onOpenFreelancerSignup: () => void;
  onOpenClientSignup: () => void;
  onExploreJobs: () => void;
  onQuickLogin: (role: 'Freelancer' | 'Client') => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onOpenFreelancerSignup,
  onOpenClientSignup,
  onExploreJobs,
  onQuickLogin,
}) => {
  return (
    <div className="space-y-16 py-8 md:py-14">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E3EEE8] text-[#1F5C46] text-xs font-semibold tracking-wide uppercase mb-6 border border-[#B3D3C4]">
          <span className="w-2 h-2 rounded-full bg-[#1F5C46] animate-pulse"></span>
          India · Tech Freelance Marketplace
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#14130F] font-['IBM_Plex_Sans'] leading-[1.15]">
          Verified tech talent. <br className="hidden sm:inline" />
          <span className="text-[#1F5C46]">Escrow-protected pay.</span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-[#56524B] max-w-2xl mx-auto leading-relaxed">
          Verqo connects Indian software engineers, architects, and mobile specialists with top tech businesses.
          Every contract runs on milestone-based escrow — protecting every rupee until deliverables are approved.
        </p>

        {/* Primary CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            id="hero-btn-join-freelancer"
            onClick={onOpenFreelancerSignup}
            className="w-full sm:w-auto px-6 py-3 rounded-lg text-sm font-semibold text-white bg-[#1F5C46] hover:bg-[#184837] shadow-sm transition-all flex items-center justify-center gap-2"
          >
            Join as a freelancer
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            id="hero-btn-hire-talent"
            onClick={onOpenClientSignup}
            className="w-full sm:w-auto px-6 py-3 rounded-lg text-sm font-semibold text-white bg-[#5B3E73] hover:bg-[#48315B] shadow-sm transition-all flex items-center justify-center gap-2"
          >
            Hire talent
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            id="hero-btn-explore-jobs"
            onClick={onExploreJobs}
            className="w-full sm:w-auto px-5 py-3 rounded-lg text-sm font-semibold text-[#14130F] bg-white hover:bg-[#F7F6F3] border border-[#E8E6DF] transition-all flex items-center justify-center gap-2"
          >
            Browse Open Jobs
          </button>
        </div>

        {/* Live Interactive Sandbox Banner */}
        <div className="mt-8 p-3 rounded-xl bg-white border border-[#E8E6DF] inline-flex flex-wrap items-center justify-center gap-2 text-xs text-[#56524B]">
          <span className="font-semibold text-[#14130F]">Instant Test-Drive:</span>
          <span>Click to launch a demo persona with live escrow state:</span>
          <button
            id="hero-quick-aisha"
            onClick={() => onQuickLogin('Freelancer')}
            className="font-semibold text-[#1F5C46] hover:underline bg-[#E3EEE8] px-2 py-0.5 rounded"
          >
            Aisha Verma (Freelancer)
          </button>
          <span>or</span>
          <button
            id="hero-quick-nimbus"
            onClick={() => onQuickLogin('Client')}
            className="font-semibold text-[#5B3E73] hover:underline bg-[#F2EBF7] px-2 py-0.5 rounded"
          >
            Nimbus Labs (Client)
          </button>
        </div>
      </section>

      {/* Fee Model Section */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#14130F] font-['IBM_Plex_Sans']">
            Transparent, zero-surprise pricing
          </h2>
          <p className="text-sm text-[#56524B] mt-1">
            Predictable fees built specifically for India's technology ecosystem
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Freelancer Fee Card */}
          <div className="bg-white rounded-xl p-6 sm:p-7 border-l-4 border-l-[#1F5C46] border-y border-r border-[#E8E6DF] shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1F5C46]">
                For Freelancers
              </span>
              <span className="text-2xl font-bold text-[#14130F] font-mono">5%</span>
            </div>
            <h3 className="text-lg font-semibold text-[#14130F] mt-2">
              Fixed fee, only when you get paid
            </h3>
            <p className="text-sm text-[#56524B] mt-2 leading-relaxed">
              No registration charge, no bid credits to buy, and no subscription fee ever.
              Verqo deducts 5% on completed milestones at payment release.
            </p>
            <div className="mt-6 pt-4 border-t border-[#E8E6DF] flex flex-col gap-2 text-xs text-[#56524B]">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#1F5C46] shrink-0" />
                <span>Section 194-O TDS automatically accounted for and credited</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#1F5C46] shrink-0" />
                <span>Direct payout to verified Indian bank accounts</span>
              </div>
            </div>
          </div>

          {/* Client Fee Card */}
          <div className="bg-white rounded-xl p-6 sm:p-7 border-l-4 border-l-[#5B3E73] border-y border-r border-[#E8E6DF] shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5B3E73]">
                For Businesses
              </span>
              <span className="text-2xl font-bold text-[#14130F] font-mono">10%</span>
            </div>
            <h3 className="text-lg font-semibold text-[#14130F] mt-2">
              Pay standard fee only on funded milestones
            </h3>
            <p className="text-sm text-[#56524B] mt-2 leading-relaxed">
              Standard plan includes a 10% Client Fee added only to funded work in escrow.
              Business Plus plans reduce platform fee to 5% with dedicated invoicing.
            </p>
            <div className="mt-6 pt-4 border-t border-[#E8E6DF] flex flex-col gap-2 text-xs text-[#56524B]">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#5B3E73] shrink-0" />
                <span>GST invoices issued automatically with your GSTIN</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#5B3E73] shrink-0" />
                <span>Escrow lock guarantees work is received before funds disburse</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Milestone Escrow Workflow */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-[#EDEBE6] rounded-2xl p-6 sm:p-8 border border-[#E0DDD5]">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#56524B]">
              Escrow Protection Engine
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#14130F] mt-1 font-['IBM_Plex_Sans']">
              How funds move securely
            </h2>
            <p className="text-sm text-[#56524B] mt-1">
              Both parties are protected at every stage of the milestone lifecycle
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 border border-[#E8E6DF]">
              <div className="w-8 h-8 rounded-lg bg-[#E3EEE8] text-[#1F5C46] flex items-center justify-center font-bold text-sm mb-3">
                1
              </div>
              <h4 className="font-semibold text-sm text-[#14130F]">Fund Escrow</h4>
              <p className="text-xs text-[#56524B] mt-1">
                Client deposits milestone funds into secure escrow before work begins.
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-[#E8E6DF]">
              <div className="w-8 h-8 rounded-lg bg-[#F7EBD3] text-[#9A6B12] flex items-center justify-center font-bold text-sm mb-3">
                2
              </div>
              <h4 className="font-semibold text-sm text-[#14130F]">Start Work</h4>
              <p className="text-xs text-[#56524B] mt-1">
                Freelancer begins coding knowing 100% of the milestone is funded.
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-[#E8E6DF]">
              <div className="w-8 h-8 rounded-lg bg-[#F7EBD3] text-[#9A6B12] flex items-center justify-center font-bold text-sm mb-3">
                3
              </div>
              <h4 className="font-semibold text-sm text-[#14130F]">Submit for Review</h4>
              <p className="text-xs text-[#56524B] mt-1">
                Deliverables submitted. Client has a fixed review window to verify quality.
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-[#E8E6DF]">
              <div className="w-8 h-8 rounded-lg bg-[#E3EEE8] text-[#1F5C46] flex items-center justify-center font-bold text-sm mb-3">
                4
              </div>
              <h4 className="font-semibold text-sm text-[#14130F]">Approve & Release</h4>
              <p className="text-xs text-[#56524B] mt-1">
                Client clicks approve, releasing payout instantly to the freelancer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Rigorous Indian KYC & Compliance */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-[#E8E6DF]">
            <div className="w-10 h-10 rounded-lg bg-[#F7F6F3] text-[#1F5C46] flex items-center justify-center mb-3">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-base text-[#14130F]">Aadhaar Verhoeff Check</h4>
            <p className="text-xs text-[#56524B] mt-2 leading-relaxed">
              Every freelancer passes mathematical Verhoeff checksum validation to eliminate typos and prevent fraudulent identity claims.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#E8E6DF]">
            <div className="w-10 h-10 rounded-lg bg-[#F7F6F3] text-[#5B3E73] flex items-center justify-center mb-3">
              <FileCheck className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-base text-[#14130F]">PAN Holder Validation</h4>
            <p className="text-xs text-[#56524B] mt-2 leading-relaxed">
              Strict 4th-character holder code checks confirm individual, company, or partnership status before any payouts can be disbursed.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#E8E6DF]">
            <div className="w-10 h-10 rounded-lg bg-[#F7F6F3] text-[#B24300] flex items-center justify-center mb-3">
              <Landmark className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-base text-[#14130F]">Section 194-O Compliance</h4>
            <p className="text-xs text-[#56524B] mt-2 leading-relaxed">
              Automated 1% TDS ledger tracking on gross e-commerce marketplace earnings, generating real-time fiscal summaries for easy ITR filing.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
