import React, { useState } from 'react';
import { verqoStore } from '../services/store';
import { X, Lock, Mail, UserCheck, AlertCircle } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onSwitchToFreelancerSignup: () => void;
  onSwitchToClientSignup: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onSwitchToFreelancerSignup,
  onSwitchToClientSignup,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    // Role check for mock authentication or default to freelancer
    if (email.toLowerCase().includes('client')) {
      verqoStore.quickLogin('Client');
    } else {
      verqoStore.quickLogin('Freelancer');
    }

    onSuccess();
    onClose();
  };

  const handleQuickLogin = (role: 'Freelancer' | 'Client') => {
    verqoStore.quickLogin(role);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-xl border border-[#E8E6DF] relative">
        <button
          id="btn-close-login-modal"
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-[#56524B] hover:text-[#14130F] hover:bg-[#F7F6F3]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#F7F6F3] text-[#14130F] mx-auto flex items-center justify-center mb-3">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-[#14130F] font-['IBM_Plex_Sans']">
            Log in to Verqo
          </h2>
          <p className="text-xs text-[#56524B] mt-1">
            Access your contracts, escrow balance, or job applications
          </p>
        </div>

        {/* Quick Demo Pre-fill options */}
        <div className="mb-6 p-3 bg-[#F7F6F3] rounded-xl border border-[#E8E6DF] text-xs">
          <div className="font-semibold text-[#14130F] mb-1.5 text-center">
            Or Use One-Click Demo Personas:
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              id="login-quick-freelancer"
              onClick={() => handleQuickLogin('Freelancer')}
              className="px-2.5 py-2 rounded-lg bg-white border border-[#B3D3C4] text-[#1F5C46] font-semibold hover:bg-[#E3EEE8] transition-colors text-center"
            >
              Aisha (Freelancer)
            </button>
            <button
              type="button"
              id="login-quick-client"
              onClick={() => handleQuickLogin('Client')}
              className="px-2.5 py-2 rounded-lg bg-white border border-[#D5C2E6] text-[#5B3E73] font-semibold hover:bg-[#F2EBF7] transition-colors text-center"
            >
              Nimbus (Client)
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-[#F6E1DE] text-[#A13A2F] text-xs flex items-center gap-2 border border-[#E8B9B3]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#14130F] mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9C978D]" />
              <input
                id="login-input-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 text-sm bg-white rounded-lg border border-[#E8E6DF] focus:border-[#1F5C46] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#14130F] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9C978D]" />
              <input
                id="login-input-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm bg-white rounded-lg border border-[#E8E6DF] focus:border-[#1F5C46] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            id="login-submit-button"
            className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-[#14130F] hover:bg-black transition-colors"
          >
            Log In
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#E8E6DF] text-center text-xs text-[#56524B] space-y-2">
          <div>Don't have an account yet?</div>
          <div className="flex justify-center gap-3 font-semibold">
            <button
              onClick={() => {
                onClose();
                onSwitchToFreelancerSignup();
              }}
              className="text-[#1F5C46] hover:underline"
            >
              Sign up as Freelancer
            </button>
            <span>·</span>
            <button
              onClick={() => {
                onClose();
                onSwitchToClientSignup();
              }}
              className="text-[#5B3E73] hover:underline"
            >
              Register as Business
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
