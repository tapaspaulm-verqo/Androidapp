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
  const [googleRole, setGoogleRole] = useState<'Freelancer' | 'Client'>('Freelancer');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsGoogleLoading(true);
    try {
      await verqoStore.signInWithGoogle(googleRole);
      setIsGoogleLoading(false);
      onSuccess();
      onClose();
    } catch (err) {
      setIsGoogleLoading(false);
      setError(err instanceof Error ? err.message : 'Google authentication failed.');
    }
  };

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

        {/* Google Authentication via Firebase */}
        <div className="mb-5 p-3.5 bg-white rounded-xl border border-[#E8E6DF] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-[#14130F]">
              Sign in with Google:
            </span>
            <div className="flex gap-1 text-[11px]">
              <button
                type="button"
                onClick={() => setGoogleRole('Freelancer')}
                className={`px-2 py-0.5 rounded font-medium transition-colors ${
                  googleRole === 'Freelancer'
                    ? 'bg-[#E3EEE8] text-[#1F5C46] font-semibold'
                    : 'text-[#56524B] hover:bg-[#F7F6F3]'
                }`}
              >
                Freelancer
              </button>
              <button
                type="button"
                onClick={() => setGoogleRole('Client')}
                className={`px-2 py-0.5 rounded font-medium transition-colors ${
                  googleRole === 'Client'
                    ? 'bg-[#F2EBF7] text-[#5B3E73] font-semibold'
                    : 'text-[#56524B] hover:bg-[#F7F6F3]'
                }`}
              >
                Client
              </button>
            </div>
          </div>
          <button
            type="button"
            id="btn-google-signin"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full py-2 px-3 rounded-lg border border-[#E8E6DF] hover:bg-[#F7F6F3] text-[#14130F] text-xs font-semibold flex items-center justify-center gap-2.5 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.13z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z"
              />
            </svg>
            <span>{isGoogleLoading ? 'Connecting to Google...' : `Continue with Google (${googleRole})`}</span>
          </button>
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
