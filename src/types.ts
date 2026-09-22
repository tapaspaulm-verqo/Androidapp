export type UserRole = 'Freelancer' | 'Client';

export interface SessionUser {
  id: string;
  email: string;
  role: UserRole;
  displayName: string;
  freelancerProfileId?: string | null;
  clientProfileId?: string | null;
  isFullyVerified?: boolean | null;
}

export interface LoginResponse {
  token: string;
  expiresAt: string;
  user: SessionUser;
}

export type MilestoneState =
  | 'Unfunded'
  | 'Funded'
  | 'InProgress'
  | 'Submitted'
  | 'ApprovedReleased'
  | 'Disputed'
  | 'RefundedCancelled';

export interface MilestoneSummary {
  id: string;
  title: string;
  contractValueMinor: number; // in paise (₹1 = 100 paise)
  state: MilestoneState;
  submittedAt?: string | null;
  reviewDeadlineAt?: string | null;
  releasedAt?: string | null;
}

export interface ContractSummary {
  id: string;
  scopeSummary: string;
  status: string; // 'Active' | 'Completed' | 'Draft'
  counterpartyName: string; // clientName for freelancer view, freelancerName for client view
  counterpartyRole?: string;
  jobTitle?: string | null;
  createdAt?: string;
  milestones: MilestoneSummary[];
}

export interface RecommendedJob {
  id: string;
  title: string;
  roleCategory: string;
  budgetMinorMin?: number | null;
  budgetMinorMax?: number | null;
  clientName: string;
}

export interface FreelancerTaxSummary {
  financialYearStart?: string;
  fyToDateEarnedMinor: number;
  totalGstCollectedMinor: number;
  estimatedTdsMinor: number; // Section 194-O TDS
  note: string;
}

export interface FreelancerDashboardData {
  displayName: string;
  primaryRole: string;
  experienceLevel: string;
  isFullyVerified: boolean;
  activeContracts: number;
  totalEarnedMinor: number;
  pendingInEscrowMinor: number;
  openProposalsCount: number;
  contracts: ContractSummary[];
  taxSummary: FreelancerTaxSummary;
  recommendedJobs: RecommendedJob[];
}

export interface PendingApproval {
  id: string; // milestone id
  contractId: string;
  title: string;
  contractValueMinor: number;
  freelancerName: string;
  submittedAt?: string | null;
  reviewDeadlineAt?: string | null;
}

export interface PostedJob {
  id: string;
  title: string;
  status: string; // 'Open' | 'Closed' | 'InReview'
  proposalCount: number;
  createdAt?: string;
}

export interface ClientDashboardData {
  companyName: string;
  gstin?: string | null;
  plan: string; // 'Standard' | 'Business Plus' | 'Enterprise'
  activeContracts: number;
  escrowBalanceMinor: number;
  pendingApprovalsCount: number;
  openJobsCount: number;
  contracts: ContractSummary[];
  pendingApprovals: PendingApproval[];
  postedJobs: PostedJob[];
}

export interface JobSummary {
  id: string;
  title: string;
  roleCategory: string;
  channel: 'B2B' | 'B2C' | string;
  budgetMinorMin?: number | null;
  budgetMinorMax?: number | null;
  clientName?: string;
  description?: string;
  postedAt?: string;
}

export interface FreelancerListItem {
  id: string;
  displayName: string;
  primaryRole: string;
  experienceLevel: string;
  hourlyRateMinor?: number | null;
  isFullyVerified: boolean;
}

export interface RegisterFreelancerResponse {
  userId: string;
  panStatus: string;
  aadhaarStatus: string;
  epfStatus: string;
  isFullyVerified: boolean;
}

export interface RegisterClientResponse {
  userId: string;
  companyName: string;
  gstin?: string | null;
  plan: string;
}
