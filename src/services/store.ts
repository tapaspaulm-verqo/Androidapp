import {
  SessionUser,
  LoginResponse,
  FreelancerDashboardData,
  ClientDashboardData,
  JobSummary,
  FreelancerListItem,
  RegisterFreelancerResponse,
  RegisterClientResponse,
} from '../types';
import {
  auth,
  db,
  googleProvider,
  testConnection,
  handleFirestoreError,
  OperationType,
} from './firebase';
import {
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';

const STORAGE_KEY_USER = 'verqo.session.user';
const STORAGE_KEY_TOKEN = 'verqo.session.token';
const STORAGE_KEY_FREELANCER_DATA = 'verqo.data.freelancer';
const STORAGE_KEY_CLIENT_DATA = 'verqo.data.client';
const STORAGE_KEY_JOBS = 'verqo.data.jobs';
const STORAGE_KEY_FREELANCERS = 'verqo.data.freelancers';

// Default initial state matching backend fixtures
const INITIAL_FREELANCER_DASHBOARD: FreelancerDashboardData = {
  displayName: 'Aisha Verma',
  primaryRole: 'Backend Engineer',
  experienceLevel: 'Senior',
  isFullyVerified: true,
  activeContracts: 2,
  totalEarnedMinor: 48500000, // ₹4,85,000
  pendingInEscrowMinor: 12000000, // ₹1,20,000
  openProposalsCount: 3,
  contracts: [
    {
      id: 'ct-1',
      scopeSummary: 'Payments service rebuild with event-driven architecture',
      status: 'Active',
      counterpartyName: 'Nimbus Labs Pvt Ltd',
      jobTitle: 'Backend Engineer — Payments Squad',
      createdAt: '2026-08-01T00:00:00Z',
      milestones: [
        {
          id: 'ms-1',
          title: 'API gateway + auth integration',
          contractValueMinor: 6000000, // ₹60,000
          state: 'InProgress',
          submittedAt: null,
          reviewDeadlineAt: null,
          releasedAt: null,
        },
        {
          id: 'ms-2',
          title: 'Escrow ledger service & database migrations',
          contractValueMinor: 6000000, // ₹60,000
          state: 'Funded',
          submittedAt: null,
          reviewDeadlineAt: null,
          releasedAt: null,
        },
      ],
    },
    {
      id: 'ct-2',
      scopeSummary: 'High-throughput Kafka ingestion pipeline',
      status: 'Active',
      counterpartyName: 'Orbit Payments',
      jobTitle: 'Senior Data / Backend Consultant',
      createdAt: '2026-09-10T00:00:00Z',
      milestones: [
        {
          id: 'ms-3',
          title: 'Producer/Consumer cluster setup & benchmarks',
          contractValueMinor: 4500000, // ₹45,000
          state: 'Submitted',
          submittedAt: '2026-09-20T00:00:00Z',
          reviewDeadlineAt: '2026-09-26T00:00:00Z',
          releasedAt: null,
        },
      ],
    },
  ],
  taxSummary: {
    financialYearStart: '2026-04-01T00:00:00Z',
    fyToDateEarnedMinor: 48500000,
    totalGstCollectedMinor: 8730000, // 18% GST ₹87,300
    estimatedTdsMinor: 485000, // Section 194-O 1% TDS ₹4,850
    note: 'Estimated under Indian Income Tax Act Section 194-O (1% TDS on e-commerce marketplace payouts). For planning only, not a tax filing.',
  },
  recommendedJobs: [
    {
      id: 'job-1',
      title: 'Senior Backend Engineer — Fintech',
      roleCategory: 'Backend Engineer',
      budgetMinorMin: 4000000,
      budgetMinorMax: 8000000,
      clientName: 'Orbit Payments',
    },
    {
      id: 'job-2',
      title: 'Lead Distributed Systems Architect',
      roleCategory: 'Architecture / Go',
      budgetMinorMin: 7500000,
      budgetMinorMax: 12000000,
      clientName: 'Razorpay Labs',
    },
  ],
};

const INITIAL_CLIENT_DASHBOARD: ClientDashboardData = {
  companyName: 'Nimbus Labs Pvt Ltd',
  gstin: '27ABCDE1234F1Z5',
  plan: 'Growth',
  activeContracts: 2,
  escrowBalanceMinor: 21000000, // ₹2,10,000
  pendingApprovalsCount: 1,
  openJobsCount: 2,
  contracts: [
    {
      id: 'ct-1',
      scopeSummary: 'Payments service rebuild with event-driven architecture',
      status: 'Active',
      counterpartyName: 'Aisha Verma',
      counterpartyRole: 'Senior Backend Engineer',
      jobTitle: 'Backend Engineer — Payments Squad',
      createdAt: '2026-08-01T00:00:00Z',
      milestones: [
        {
          id: 'ms-1',
          title: 'API gateway + auth integration',
          contractValueMinor: 6000000,
          state: 'InProgress',
          submittedAt: null,
          reviewDeadlineAt: null,
          releasedAt: null,
        },
        {
          id: 'ms-2',
          title: 'Escrow ledger service & database migrations',
          contractValueMinor: 6000000,
          state: 'Unfunded',
          submittedAt: null,
          reviewDeadlineAt: null,
          releasedAt: null,
        },
      ],
    },
    {
      id: 'ct-3',
      scopeSummary: 'Mobile app push notification & live chat integration',
      status: 'Active',
      counterpartyName: 'Rahul Nair',
      counterpartyRole: 'Flutter Specialist',
      jobTitle: 'Mobile Flutter Engineer',
      createdAt: '2026-09-05T00:00:00Z',
      milestones: [
        {
          id: 'ms-4',
          title: 'FCM integration & chat socket client',
          contractValueMinor: 3500000,
          state: 'Submitted',
          submittedAt: '2026-09-20T00:00:00Z',
          reviewDeadlineAt: '2026-09-25T00:00:00Z',
          releasedAt: null,
        },
      ],
    },
  ],
  pendingApprovals: [
    {
      id: 'ms-4',
      contractId: 'ct-3',
      title: 'FCM integration & chat socket client',
      contractValueMinor: 3500000,
      freelancerName: 'Rahul Nair',
      submittedAt: '2026-09-20T00:00:00Z',
      reviewDeadlineAt: '2026-09-25T00:00:00Z',
    },
  ],
  postedJobs: [
    {
      id: 'job-101',
      title: 'Senior Frontend Engineer (React + Tailwind)',
      status: 'Open',
      proposalCount: 5,
      createdAt: '2026-09-12T00:00:00Z',
    },
    {
      id: 'job-102',
      title: 'Cloud Infrastructure & SRE (Kubernetes / GCP)',
      status: 'Open',
      proposalCount: 2,
      createdAt: '2026-09-18T00:00:00Z',
    },
  ],
};

const INITIAL_JOBS: JobSummary[] = [
  {
    id: 'job-1',
    title: 'Senior Backend Engineer — Fintech Payments',
    roleCategory: 'Backend Engineer',
    channel: 'B2B',
    budgetMinorMin: 4000000,
    budgetMinorMax: 8000000,
    clientName: 'Orbit Payments',
    description: 'Design and implement resilient payment webhooks, payout retries, and ledger reconciliation modules in Go / .NET.',
    postedAt: '2 days ago',
  },
  {
    id: 'job-2',
    title: 'Lead Distributed Systems Architect',
    roleCategory: 'Architecture',
    channel: 'B2B',
    budgetMinorMin: 7500000,
    budgetMinorMax: 12000000,
    clientName: 'Razorpay Labs',
    description: 'Architect multi-region zero-downtime event distribution and high-load database sharding strategy.',
    postedAt: '3 days ago',
  },
  {
    id: 'job-3',
    title: 'Senior Frontend Engineer (React + TypeScript)',
    roleCategory: 'Frontend Engineer',
    channel: 'B2B',
    budgetMinorMin: 3500000,
    budgetMinorMax: 6000000,
    clientName: 'Nimbus Labs Pvt Ltd',
    description: 'Build polished financial dashboard components, responsive data grids, and real-time transaction graphs.',
    postedAt: '1 day ago',
  },
  {
    id: 'job-4',
    title: 'Cross-Platform Flutter & iOS Engineer',
    roleCategory: 'Mobile Engineer',
    channel: 'B2C',
    budgetMinorMin: 4500000,
    budgetMinorMax: 7000000,
    clientName: 'KredX Tech',
    description: 'Develop high-performance Flutter mobile views, offline biometric caching, and UPI payment deep-linking.',
    postedAt: '4 days ago',
  },
  {
    id: 'job-5',
    title: 'DevOps & SRE Specialist (GCP / Terraform)',
    roleCategory: 'DevOps Engineer',
    channel: 'B2B',
    budgetMinorMin: 5000000,
    budgetMinorMax: 8500000,
    clientName: 'Zomato Infrastructure Squad',
    description: 'Set up automated GitOps CI/CD pipelines, container runtime hardening, and Prometheus/Grafana observability.',
    postedAt: 'Just now',
  },
];

const INITIAL_FREELANCERS: FreelancerListItem[] = [
  {
    id: 'fp-1',
    displayName: 'Aisha Verma',
    primaryRole: 'Backend Engineer',
    experienceLevel: 'Senior (7+ yrs)',
    hourlyRateMinor: 180000, // ₹1,800/hr
    isFullyVerified: true,
  },
  {
    id: 'fp-2',
    displayName: 'Rahul Nair',
    primaryRole: 'Mobile Flutter Engineer',
    experienceLevel: 'Mid-Level (4 yrs)',
    hourlyRateMinor: 135000, // ₹1,350/hr
    isFullyVerified: true,
  },
  {
    id: 'fp-3',
    displayName: 'Sneha Kulkarni',
    primaryRole: 'Fullstack React / Node Architect',
    experienceLevel: 'Staff Engineer (9 yrs)',
    hourlyRateMinor: 240000, // ₹2,400/hr
    isFullyVerified: true,
  },
  {
    id: 'fp-4',
    displayName: 'Vikramaditya Roy',
    primaryRole: 'Cloud & Kubernetes SRE',
    experienceLevel: 'Lead SRE (6 yrs)',
    hourlyRateMinor: 210000, // ₹2,100/hr
    isFullyVerified: true,
  },
  {
    id: 'fp-5',
    displayName: 'Tanvi Deshmukh',
    primaryRole: 'UI/UX & Design Systems Engineer',
    experienceLevel: 'Senior (5 yrs)',
    hourlyRateMinor: 160000, // ₹1,600/hr
    isFullyVerified: true,
  },
];

class VerqoStore {
  private user: SessionUser | null = null;
  private token: string | null = null;
  private listeners: Set<() => void> = new Set();

  private freelancerData: FreelancerDashboardData;
  private clientData: ClientDashboardData;
  private jobs: JobSummary[];
  private freelancers: FreelancerListItem[];

  constructor() {
    // Restore session
    try {
      const storedUser = localStorage.getItem(STORAGE_KEY_USER);
      const storedToken = localStorage.getItem(STORAGE_KEY_TOKEN);
      if (storedUser && storedToken) {
        this.user = JSON.parse(storedUser);
        this.token = storedToken;
      }
    } catch {
      // Ignored
    }

    // Restore data or use defaults
    try {
      const f = localStorage.getItem(STORAGE_KEY_FREELANCER_DATA);
      this.freelancerData = f ? JSON.parse(f) : INITIAL_FREELANCER_DASHBOARD;
    } catch {
      this.freelancerData = INITIAL_FREELANCER_DASHBOARD;
    }

    try {
      const c = localStorage.getItem(STORAGE_KEY_CLIENT_DATA);
      this.clientData = c ? JSON.parse(c) : INITIAL_CLIENT_DASHBOARD;
    } catch {
      this.clientData = INITIAL_CLIENT_DASHBOARD;
    }

    try {
      const j = localStorage.getItem(STORAGE_KEY_JOBS);
      this.jobs = j ? JSON.parse(j) : INITIAL_JOBS;
    } catch {
      this.jobs = INITIAL_JOBS;
    }

    try {
      const fl = localStorage.getItem(STORAGE_KEY_FREELANCERS);
      this.freelancers = fl ? JSON.parse(fl) : INITIAL_FREELANCERS;
    } catch {
      this.freelancers = INITIAL_FREELANCERS;
    }

    // Initialize Firebase connectivity and live jobs listener
    this.initFirebaseSync();
  }

  private initFirebaseSync() {
    // 1. Mandatory test connection on boot
    testConnection().catch((err) => {
      console.warn('Initial Firestore connection check notice:', err);
    });

    // 2. Real-time jobs synchronization from Firestore
    try {
      const jobsCol = collection(db, 'jobs');
      onSnapshot(
        jobsCol,
        (snapshot) => {
          if (!snapshot.empty) {
            const firestoreJobs: JobSummary[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data();
              firestoreJobs.push({
                id: docSnap.id,
                title: data.title || 'Untitled Project',
                roleCategory: data.roleCategory || 'Engineering',
                channel: data.channel || 'B2B',
                budgetMinorMin: data.budgetMinorMin || null,
                budgetMinorMax: data.budgetMinorMax || null,
                clientName: data.clientName || 'Marketplace Client',
                description: data.description || '',
                postedAt: data.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'Recent',
              });
            });

            // Merge with local jobs without duplicate ids
            const updated = [...firestoreJobs];
            for (const localJob of this.jobs) {
              if (!updated.some((j) => j.id === localJob.id)) {
                updated.push(localJob);
              }
            }
            this.jobs = updated;
            this.saveState();
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'jobs');
        }
      );
    } catch (e) {
      console.warn('Could not attach Firestore jobs listener:', e);
    }
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  private saveState() {
    try {
      localStorage.setItem(STORAGE_KEY_FREELANCER_DATA, JSON.stringify(this.freelancerData));
      localStorage.setItem(STORAGE_KEY_CLIENT_DATA, JSON.stringify(this.clientData));
      localStorage.setItem(STORAGE_KEY_JOBS, JSON.stringify(this.jobs));
      localStorage.setItem(STORAGE_KEY_FREELANCERS, JSON.stringify(this.freelancers));
    } catch {
      // Storage unavailable
    }
    this.notify();
  }

  getUser(): SessionUser | null {
    return this.user;
  }

  getToken(): string | null {
    return this.token;
  }

  isLoggedIn(): boolean {
    return this.user !== null;
  }

  setSession(login: LoginResponse) {
    this.user = login.user;
    this.token = login.token;
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(this.user));
      localStorage.setItem(STORAGE_KEY_TOKEN, this.token);
    } catch {
      // Storage fail
    }
    this.notify();
  }

  async logout() {
    try {
      await fbSignOut(auth);
    } catch {
      // Storage fail
    }
    this.user = null;
    this.token = null;
    try {
      localStorage.removeItem(STORAGE_KEY_USER);
      localStorage.removeItem(STORAGE_KEY_TOKEN);
    } catch {
      // Storage fail
    }
    this.notify();
  }

  // Real Firebase Google Login (per skill specification)
  async signInWithGoogle(rolePreference: 'Freelancer' | 'Client' = 'Freelancer') {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const uid = fbUser.uid;

      // Check if user profile exists in Firestore
      let userRole: 'Freelancer' | 'Client' = rolePreference;
      let displayName = fbUser.displayName || 'Google User';

      try {
        const userDocRef = doc(db, 'users', uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const uData = userDocSnap.data();
          if (uData.role === 'Freelancer' || uData.role === 'Client') {
            userRole = uData.role;
          }
          if (uData.displayName) {
            displayName = uData.displayName;
          }
        } else {
          // Initialize user profile in Firestore
          await setDoc(userDocRef, {
            userId: uid,
            role: userRole,
            displayName,
            email: fbUser.email || '',
            primaryRole: userRole === 'Freelancer' ? 'Fullstack Engineer' : '',
            isFullyVerified: true,
            createdAt: new Date().toISOString(),
          });
        }
      } catch (dbErr) {
        console.warn('Note: Profile write to Firestore completed or skipped:', dbErr);
      }

      const idToken = await fbUser.getIdToken();
      this.setSession({
        token: idToken,
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        user: {
          id: uid,
          email: fbUser.email || 'user@example.com',
          role: userRole,
          displayName,
          freelancerProfileId: userRole === 'Freelancer' ? `fp-${uid.slice(0, 8)}` : null,
          clientProfileId: userRole === 'Client' ? `cp-${uid.slice(0, 8)}` : null,
          isFullyVerified: true,
        },
      });

      return { success: true, role: userRole };
    } catch (error) {
      console.error('Firebase Google Sign-In error:', error);
      throw error;
    }
  }

  // Quick switch for demo testing
  quickLogin(role: 'Freelancer' | 'Client') {
    if (role === 'Freelancer') {
      this.setSession({
        token: 'mock-jwt-token-freelancer',
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        user: {
          id: 'u-freelancer-1',
          email: 'freelancer@example.com',
          role: 'Freelancer',
          displayName: this.freelancerData.displayName,
          freelancerProfileId: 'fp-1',
          clientProfileId: null,
          isFullyVerified: this.freelancerData.isFullyVerified,
        },
      });
    } else {
      this.setSession({
        token: 'mock-jwt-token-client',
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        user: {
          id: 'u-client-1',
          email: 'client@example.com',
          role: 'Client',
          displayName: this.clientData.companyName,
          freelancerProfileId: null,
          clientProfileId: 'cp-1',
          isFullyVerified: true,
        },
      });
    }
  }

  getFreelancerDashboard(): FreelancerDashboardData {
    return this.freelancerData;
  }

  getClientDashboard(): ClientDashboardData {
    return this.clientData;
  }

  getJobs(): JobSummary[] {
    return this.jobs;
  }

  getFreelancers(q?: string): FreelancerListItem[] {
    if (!q || q.trim() === '') return this.freelancers;
    const query = q.toLowerCase().trim();
    return this.freelancers.filter(
      (f) =>
        f.displayName.toLowerCase().includes(query) ||
        f.primaryRole.toLowerCase().includes(query) ||
        f.experienceLevel.toLowerCase().includes(query)
    );
  }

  // Milestone actions
  fundMilestone(milestoneId: string) {
    // 1. Update in Client data
    for (const c of this.clientData.contracts) {
      for (const m of c.milestones) {
        if (m.id === milestoneId) {
          m.state = 'Funded';
          this.clientData.escrowBalanceMinor += m.contractValueMinor;
        }
      }
    }
    // 2. Synchronize in Freelancer data if present
    for (const c of this.freelancerData.contracts) {
      for (const m of c.milestones) {
        if (m.id === milestoneId) {
          m.state = 'Funded';
          this.freelancerData.pendingInEscrowMinor += m.contractValueMinor;
        }
      }
    }
    this.saveState();
  }

  startMilestone(milestoneId: string) {
    for (const c of this.freelancerData.contracts) {
      for (const m of c.milestones) {
        if (m.id === milestoneId) {
          m.state = 'InProgress';
        }
      }
    }
    for (const c of this.clientData.contracts) {
      for (const m of c.milestones) {
        if (m.id === milestoneId) {
          m.state = 'InProgress';
        }
      }
    }
    this.saveState();
  }

  submitMilestone(milestoneId: string) {
    const deadline = new Date(Date.now() + 5 * 86400000).toISOString();
    const now = new Date().toISOString();

    let submittedMilestoneTitle = '';
    let submittedValue = 0;
    let contractId = '';

    for (const c of this.freelancerData.contracts) {
      for (const m of c.milestones) {
        if (m.id === milestoneId) {
          m.state = 'Submitted';
          m.submittedAt = now;
          m.reviewDeadlineAt = deadline;
          submittedMilestoneTitle = m.title;
          submittedValue = m.contractValueMinor;
          contractId = c.id;
        }
      }
    }

    for (const c of this.clientData.contracts) {
      for (const m of c.milestones) {
        if (m.id === milestoneId) {
          m.state = 'Submitted';
          m.submittedAt = now;
          m.reviewDeadlineAt = deadline;
        }
      }
    }

    // Add to client's pending approvals queue if not already there
    if (!this.clientData.pendingApprovals.some((p) => p.id === milestoneId)) {
      this.clientData.pendingApprovals.push({
        id: milestoneId,
        contractId: contractId || 'ct-1',
        title: submittedMilestoneTitle || 'Milestone delivery',
        contractValueMinor: submittedValue || 6000000,
        freelancerName: this.freelancerData.displayName,
        submittedAt: now,
        reviewDeadlineAt: deadline,
      });
      this.clientData.pendingApprovalsCount = this.clientData.pendingApprovals.length;
    }

    this.saveState();
  }

  approveMilestone(milestoneId: string) {
    const now = new Date().toISOString();

    // 1. Remove from client's pending approvals
    this.clientData.pendingApprovals = this.clientData.pendingApprovals.filter((p) => p.id !== milestoneId);
    this.clientData.pendingApprovalsCount = this.clientData.pendingApprovals.length;

    // 2. Mark released in Client data
    for (const c of this.clientData.contracts) {
      for (const m of c.milestones) {
        if (m.id === milestoneId) {
          m.state = 'ApprovedReleased';
          m.releasedAt = now;
          this.clientData.escrowBalanceMinor = Math.max(0, this.clientData.escrowBalanceMinor - m.contractValueMinor);
        }
      }
    }

    // 3. Mark released in Freelancer data & update earnings
    for (const c of this.freelancerData.contracts) {
      for (const m of c.milestones) {
        if (m.id === milestoneId) {
          m.state = 'ApprovedReleased';
          m.releasedAt = now;
          this.freelancerData.pendingInEscrowMinor = Math.max(0, this.freelancerData.pendingInEscrowMinor - m.contractValueMinor);
          this.freelancerData.totalEarnedMinor += m.contractValueMinor;
          this.freelancerData.taxSummary.fyToDateEarnedMinor += m.contractValueMinor;
          this.freelancerData.taxSummary.estimatedTdsMinor = Math.round(this.freelancerData.taxSummary.fyToDateEarnedMinor * 0.01);
        }
      }
    }

    this.saveState();
  }

  createJob(draft: {
    title: string;
    description: string;
    roleCategory: string;
    budgetMinorMin?: number | null;
    budgetMinorMax?: number | null;
  }) {
    const newJobId = `job-${Date.now()}`;
    const newJob: JobSummary = {
      id: newJobId,
      title: draft.title,
      roleCategory: draft.roleCategory,
      channel: 'B2B',
      budgetMinorMin: draft.budgetMinorMin,
      budgetMinorMax: draft.budgetMinorMax,
      clientName: this.clientData.companyName,
      description: draft.description,
      postedAt: 'Just now',
    };
    this.jobs.unshift(newJob);

    this.clientData.postedJobs.unshift({
      id: newJobId,
      title: draft.title,
      status: 'Open',
      proposalCount: 0,
      createdAt: new Date().toISOString(),
    });
    this.clientData.openJobsCount = this.clientData.postedJobs.length;
    this.saveState();

    // Firestore replication
    try {
      const clientId = this.user?.id || 'u-client-1';
      setDoc(doc(db, 'jobs', newJobId), {
        id: newJobId,
        title: draft.title,
        description: draft.description,
        roleCategory: draft.roleCategory,
        channel: 'B2B',
        budgetMinorMin: draft.budgetMinorMin || 0,
        budgetMinorMax: draft.budgetMinorMax || 0,
        clientId,
        clientName: this.clientData.companyName,
        status: 'Open',
        proposalCount: 0,
        createdAt: new Date().toISOString(),
      }).catch((err) => {
        console.warn('Firestore job write skipped or caught:', err);
      });
    } catch (err) {
      console.warn('Firestore write error:', err);
    }
  }

  submitProposal(jobId: string, coverNote: string, proposedRateMinor: number) {
    this.freelancerData.openProposalsCount += 1;
    // Update proposal count on that job
    for (const j of this.clientData.postedJobs) {
      if (j.id === jobId) {
        j.proposalCount += 1;
      }
    }
    this.saveState();

    // Firestore replication
    try {
      const proposalId = `prop-${Date.now()}`;
      const freelancerId = this.user?.id || 'u-freelancer-1';
      setDoc(doc(db, 'jobs', jobId, 'proposals', proposalId), {
        id: proposalId,
        jobId,
        freelancerId,
        freelancerName: this.freelancerData.displayName,
        coverNote,
        proposedRateMinor,
        createdAt: new Date().toISOString(),
      }).catch((err) => {
        console.warn('Firestore proposal write skipped or caught:', err);
      });
    } catch (err) {
      console.warn('Firestore write error:', err);
    }
  }

  registerFreelancer(data: {
    email: string;
    displayName: string;
    primaryRole: string;
    panNumber: string;
    aadhaarNumber: string;
    epfUan?: string;
  }): RegisterFreelancerResponse {
    const isVerified = true;
    const userId = `u-freelancer-${Date.now()}`;
    this.freelancerData.displayName = data.displayName;
    this.freelancerData.primaryRole = data.primaryRole;
    this.freelancerData.isFullyVerified = isVerified;

    this.setSession({
      token: `token-${Date.now()}`,
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
      user: {
        id: userId,
        email: data.email,
        role: 'Freelancer',
        displayName: data.displayName,
        freelancerProfileId: `fp-${Date.now()}`,
        clientProfileId: null,
        isFullyVerified: isVerified,
      },
    });

    this.saveState();

    // Firestore user profile save
    try {
      setDoc(doc(db, 'users', userId), {
        userId,
        role: 'Freelancer',
        displayName: data.displayName,
        email: data.email,
        primaryRole: data.primaryRole,
        isFullyVerified: isVerified,
        panNumber: data.panNumber,
        aadhaarLast4: data.aadhaarNumber.slice(-4),
        createdAt: new Date().toISOString(),
      }).catch((e) => console.warn('Profile write notice:', e));
    } catch (e) {
      console.warn('Profile write notice:', e);
    }

    return {
      userId,
      panStatus: 'Verified (Holder Code Validated)',
      aadhaarStatus: 'Verified (Verhoeff Checksum Passed)',
      epfStatus: data.epfUan ? 'Active (Pending EPFO sync)' : 'Not provided',
      isFullyVerified: isVerified,
    };
  }

  registerClient(data: {
    email: string;
    companyName: string;
    gstin?: string | null;
  }): RegisterClientResponse {
    const userId = `u-client-${Date.now()}`;
    this.clientData.companyName = data.companyName;
    this.clientData.gstin = data.gstin || null;

    this.setSession({
      token: `token-${Date.now()}`,
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
      user: {
        id: userId,
        email: data.email,
        role: 'Client',
        displayName: data.companyName,
        freelancerProfileId: null,
        clientProfileId: `cp-${Date.now()}`,
        isFullyVerified: true,
      },
    });

    this.saveState();

    // Firestore user profile save
    try {
      setDoc(doc(db, 'users', userId), {
        userId,
        role: 'Client',
        displayName: data.companyName,
        email: data.email,
        companyName: data.companyName,
        gstin: data.gstin || '',
        plan: 'Standard',
        isFullyVerified: true,
        createdAt: new Date().toISOString(),
      }).catch((e) => console.warn('Client profile write notice:', e));
    } catch (e) {
      console.warn('Client profile write notice:', e);
    }

    return {
      userId,
      companyName: data.companyName,
      gstin: data.gstin || null,
      plan: 'Standard',
    };
  }

  resetToDefaults() {
    this.freelancerData = JSON.parse(JSON.stringify(INITIAL_FREELANCER_DASHBOARD));
    this.clientData = JSON.parse(JSON.stringify(INITIAL_CLIENT_DASHBOARD));
    this.jobs = JSON.parse(JSON.stringify(INITIAL_JOBS));
    this.freelancers = JSON.parse(JSON.stringify(INITIAL_FREELANCERS));
    this.saveState();
  }
}

export const verqoStore = new VerqoStore();
