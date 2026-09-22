import React, { useState, useEffect } from 'react';
import { verqoStore } from './services/store';
import { SessionUser, JobSummary, RecommendedJob } from './types';
import { Navbar } from './components/Navbar';
import { HomeScreen } from './components/HomeScreen';
import { JobsScreen } from './components/JobsScreen';
import { FreelancerDashboard } from './components/FreelancerDashboard';
import { ClientDashboard } from './components/ClientDashboard';
import { LoginModal } from './components/LoginModal';
import { FreelancerSignupModal } from './components/FreelancerSignupModal';
import { ClientSignupModal } from './components/ClientSignupModal';
import { ApplyModal } from './components/ApplyModal';
import { CreateJobModal } from './components/CreateJobModal';
import { Footer } from './components/Footer';
import { Shield, ArrowRight, UserCheck } from 'lucide-react';

export function App() {
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(() => verqoStore.getUser());
  const [activeTab, setActiveTab] = useState<'home' | 'jobs' | 'dashboard' | 'login'>('home');

  // Modals state
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isFreelancerSignupOpen, setIsFreelancerSignupOpen] = useState(false);
  const [isClientSignupOpen, setIsClientSignupOpen] = useState(false);
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const [selectedJobToApply, setSelectedJobToApply] = useState<JobSummary | RecommendedJob | null>(null);

  // Store data
  const [freelancerData, setFreelancerData] = useState(() => verqoStore.getFreelancerDashboard());
  const [clientData, setClientData] = useState(() => verqoStore.getClientDashboard());
  const [jobs, setJobs] = useState(() => verqoStore.getJobs());
  const [freelancers, setFreelancers] = useState(() => verqoStore.getFreelancers());

  useEffect(() => {
    const unsubscribe = verqoStore.subscribe(() => {
      setCurrentUser(verqoStore.getUser());
      setFreelancerData(verqoStore.getFreelancerDashboard());
      setClientData(verqoStore.getClientDashboard());
      setJobs(verqoStore.getJobs());
      setFreelancers(verqoStore.getFreelancers());
    });
    return unsubscribe;
  }, []);

  const handleApply = (job: JobSummary | RecommendedJob) => {
    setSelectedJobToApply(job);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6F3] text-[#14130F]">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenFreelancerSignup={() => setIsFreelancerSignupOpen(true)}
        onOpenClientSignup={() => setIsClientSignupOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
      />

      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeScreen
            onOpenFreelancerSignup={() => setIsFreelancerSignupOpen(true)}
            onOpenClientSignup={() => setIsClientSignupOpen(true)}
            onExploreJobs={() => setActiveTab('jobs')}
            onQuickLogin={(role) => {
              verqoStore.quickLogin(role);
              setActiveTab('dashboard');
            }}
          />
        )}

        {activeTab === 'jobs' && (
          <JobsScreen
            jobs={jobs}
            currentUser={currentUser}
            onApply={handleApply}
            onOpenLogin={() => setIsLoginOpen(true)}
            onOpenFreelancerSignup={() => setIsFreelancerSignupOpen(true)}
          />
        )}

        {activeTab === 'dashboard' && (
          <>
            {currentUser?.role === 'Freelancer' ? (
              <FreelancerDashboard
                data={freelancerData}
                onApplyRecommended={handleApply}
              />
            ) : currentUser?.role === 'Client' ? (
              <ClientDashboard
                data={clientData}
                freelancers={freelancers}
                onCreateProject={() => setIsCreateJobOpen(true)}
              />
            ) : (
              <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-[#E8E6DF] text-center shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-[#E3EEE8] text-[#1F5C46] flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-[#14130F] font-['IBM_Plex_Sans']">
                  Dashboard Access
                </h2>
                <p className="text-xs text-[#56524B] mt-2 leading-relaxed">
                  Log in to access your contracts and escrow payments, or choose a test persona:
                </p>

                <div className="mt-6 flex flex-col gap-2.5">
                  <button
                    id="btn-gate-quick-freelancer"
                    onClick={() => {
                      verqoStore.quickLogin('Freelancer');
                      setActiveTab('dashboard');
                    }}
                    className="w-full py-2.5 px-4 rounded-lg bg-[#1F5C46] hover:bg-[#184837] text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Log in as Aisha Verma (Freelancer)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    id="btn-gate-quick-client"
                    onClick={() => {
                      verqoStore.quickLogin('Client');
                      setActiveTab('dashboard');
                    }}
                    className="w-full py-2.5 px-4 rounded-lg bg-[#5B3E73] hover:bg-[#48315B] text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Log in as Nimbus Labs (Client)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="w-full py-2 px-4 rounded-lg bg-white border border-[#E8E6DF] hover:bg-[#F7F6F3] text-[#14130F] text-xs font-semibold transition-colors mt-2"
                  >
                    Standard Email Login
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={() => setActiveTab('dashboard')}
        onSwitchToFreelancerSignup={() => setIsFreelancerSignupOpen(true)}
        onSwitchToClientSignup={() => setIsClientSignupOpen(true)}
      />

      <FreelancerSignupModal
        isOpen={isFreelancerSignupOpen}
        onClose={() => setIsFreelancerSignupOpen(false)}
        onSuccess={() => setActiveTab('dashboard')}
        onSwitchToLogin={() => setIsLoginOpen(true)}
      />

      <ClientSignupModal
        isOpen={isClientSignupOpen}
        onClose={() => setIsClientSignupOpen(false)}
        onSuccess={() => setActiveTab('dashboard')}
        onSwitchToLogin={() => setIsLoginOpen(true)}
      />

      <ApplyModal
        job={selectedJobToApply}
        isOpen={selectedJobToApply !== null}
        onClose={() => setSelectedJobToApply(null)}
        onSuccess={() => {
          if (currentUser?.role === 'Freelancer') {
            setActiveTab('dashboard');
          }
        }}
      />

      <CreateJobModal
        isOpen={isCreateJobOpen}
        onClose={() => setIsCreateJobOpen(false)}
        onSuccess={() => {
          // Already in client dashboard
        }}
      />

      <Footer />
    </div>
  );
}

export default App;
