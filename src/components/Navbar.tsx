import React from 'react';
import { verqoStore } from '../services/store';
import { SessionUser } from '../types';
import { Briefcase, User, ShieldCheck, LogOut, ArrowRight } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'jobs' | 'dashboard' | 'login';
  setActiveTab: (tab: 'home' | 'jobs' | 'dashboard' | 'login') => void;
  currentUser: SessionUser | null;
  onOpenFreelancerSignup: () => void;
  onOpenClientSignup: () => void;
  onOpenLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenFreelancerSignup,
  onOpenClientSignup,
  onOpenLogin,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8E6DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <button
              id="nav-brand-logo"
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              {/* Vertex logo mark: 3 nodes with orange accent vertex per brand tokens */}
              <div className="w-8 h-8 rounded-lg bg-[#14130F] flex items-center justify-center relative shadow-sm">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="5" r="2.5" className="fill-[#1F5C46] stroke-[#1F5C46]" />
                  <circle cx="5" cy="19" r="2.5" className="fill-[#5B3E73] stroke-[#5B3E73]" />
                  <circle cx="19" cy="19" r="2.5" className="fill-[#B24300] stroke-[#B24300]" />
                  <line x1="12" y1="7.5" x2="6.5" y2="16.5" stroke="#FFFFFF" />
                  <line x1="12" y1="7.5" x2="17.5" y2="16.5" stroke="#FFFFFF" />
                  <line x1="7.5" y1="19" x2="16.5" y2="19" stroke="#FFFFFF" />
                </svg>
              </div>
              <div>
                <span className="text-xl font-bold font-['IBM_Plex_Sans'] text-[#14130F] tracking-tight">
                  Verqo
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-semibold text-[#56524B] tracking-wider bg-[#F7F6F3] px-2 py-0.5 rounded border border-[#E8E6DF]">
                  India
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              <button
                id="nav-link-home"
                onClick={() => setActiveTab('home')}
                className={`px-3.5 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'home'
                    ? 'text-[#14130F] bg-[#F7F6F3] font-semibold'
                    : 'text-[#56524B] hover:text-[#14130F] hover:bg-[#F7F6F3]'
                }`}
              >
                Home
              </button>
              <button
                id="nav-link-find-work"
                onClick={() => setActiveTab('jobs')}
                className={`px-3.5 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'jobs'
                    ? 'text-[#14130F] bg-[#F7F6F3] font-semibold'
                    : 'text-[#56524B] hover:text-[#14130F] hover:bg-[#F7F6F3]'
                }`}
              >
                Find Work
              </button>
              {currentUser ? (
                <button
                  id="nav-link-dashboard"
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3.5 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    activeTab === 'dashboard'
                      ? 'text-[#14130F] bg-[#F7F6F3] font-semibold'
                      : 'text-[#56524B] hover:text-[#14130F] hover:bg-[#F7F6F3]'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  Dashboard
                </button>
              ) : null}
            </nav>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Demo Switcher */}
            <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 bg-[#F7F6F3] rounded-lg border border-[#E8E6DF] text-xs">
              <span className="text-[#56524B] font-medium px-1">Quick Demo:</span>
              <button
                id="btn-quick-freelancer"
                onClick={() => {
                  verqoStore.quickLogin('Freelancer');
                  setActiveTab('dashboard');
                }}
                className={`px-2 py-1 rounded font-medium transition-all ${
                  currentUser?.role === 'Freelancer'
                    ? 'bg-[#1F5C46] text-white shadow-xs'
                    : 'bg-white text-[#14130F] hover:bg-[#E3EEE8] border border-[#E8E6DF]'
                }`}
              >
                Freelancer (Aisha)
              </button>
              <button
                id="btn-quick-client"
                onClick={() => {
                  verqoStore.quickLogin('Client');
                  setActiveTab('dashboard');
                }}
                className={`px-2 py-1 rounded font-medium transition-all ${
                  currentUser?.role === 'Client'
                    ? 'bg-[#5B3E73] text-white shadow-xs'
                    : 'bg-white text-[#14130F] hover:bg-[#F2EBF7] border border-[#E8E6DF]'
                }`}
              >
                Client (Nimbus)
              </button>
            </div>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-semibold text-[#14130F] truncate max-w-[140px]">
                    {currentUser.displayName}
                  </span>
                  <span className="text-[11px] font-medium text-[#56524B]">
                    {currentUser.role}
                  </span>
                </div>
                <button
                  id="btn-nav-logout"
                  onClick={() => {
                    verqoStore.logout();
                    setActiveTab('home');
                  }}
                  title="Log out"
                  className="p-2 text-[#56524B] hover:text-[#A13A2F] hover:bg-[#F6E1DE] rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="btn-nav-login"
                  onClick={onOpenLogin}
                  className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-[#14130F] hover:bg-[#F7F6F3] rounded-md transition-colors border border-transparent hover:border-[#E8E6DF]"
                >
                  Log In
                </button>
                <button
                  id="btn-nav-join-freelancer"
                  onClick={onOpenFreelancerSignup}
                  className="hidden sm:inline-flex items-center gap-1 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-[#1F5C46] hover:bg-[#184837] rounded-md shadow-xs transition-colors"
                >
                  Join as Freelancer
                </button>
                <button
                  id="btn-nav-hire-talent"
                  onClick={onOpenClientSignup}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm font-semibold text-white bg-[#5B3E73] hover:bg-[#48315B] rounded-md shadow-xs transition-colors"
                >
                  Hire Talent
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
