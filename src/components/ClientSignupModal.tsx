import React, { useState } from 'react';
import { verqoStore } from '../services/store';
import { GstinValidator } from '../utils/kycValidators';
import { X, Building2, CheckCircle2, AlertCircle } from 'lucide-react';

interface ClientSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export const ClientSignupModal: React.FC<ClientSignupModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onSwitchToLogin,
}) => {
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gstin, setGstin] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const gstinOutcome = gstin.trim() ? GstinValidator.validate(gstin) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!companyName.trim()) {
      setFormError('Company or business legal name is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('A valid corporate email is required.');
      return;
    }
    if (password.length < 8) {
      setFormError('Password must be at least 8 characters long.');
      return;
    }

    if (gstin.trim()) {
      const gstinVal = GstinValidator.validate(gstin);
      if (!gstinVal.isValid) {
        setFormError(`GSTIN Error: ${gstinVal.reason}`);
        return;
      }
    }

    verqoStore.registerClient({
      companyName: companyName.trim(),
      email: email.trim(),
      gstin: gstin.trim() ? GstinValidator.normalize(gstin) : undefined,
    });

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-xl border border-[#E8E6DF] relative">
        <button
          id="btn-close-client-signup"
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-[#56524B] hover:text-[#14130F] hover:bg-[#F7F6F3]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#F2EBF7] text-[#5B3E73] flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#14130F] font-['IBM_Plex_Sans']">
              Register as Business
            </h2>
            <p className="text-xs text-[#56524B]">
              Hire verified tech contractors with milestone escrow
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {formError && (
            <div className="p-3 rounded-lg bg-[#F6E1DE] text-[#A13A2F] text-xs flex items-center gap-2 border border-[#E8B9B3]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label className="block font-semibold text-[#14130F] mb-1">
              Company or Business Legal Name
            </label>
            <input
              id="signup-client-company-name"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Nimbus Labs Pvt Ltd"
              required
              className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-[#E8E6DF] focus:border-[#5B3E73] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#14130F] mb-1">
              Work Email Address
            </label>
            <input
              id="signup-client-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hiring@nimbuslabs.in"
              required
              className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-[#E8E6DF] focus:border-[#5B3E73] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#14130F] mb-1">
              Password
            </label>
            <input
              id="signup-client-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              required
              className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-[#E8E6DF] focus:border-[#5B3E73] focus:outline-none"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-semibold text-[#14130F]">
                GSTIN <span className="text-[#9C978D] font-normal">(Optional for input tax credit)</span>
              </label>
              <span className="text-[10px] text-[#56524B]">15 chars · State code + PAN</span>
            </div>
            <input
              id="signup-client-gstin"
              type="text"
              maxLength={15}
              value={gstin}
              onChange={(e) => setGstin(e.target.value.toUpperCase())}
              placeholder="e.g. 27ABCDE1234F1Z5"
              className={`w-full px-3 py-2 text-sm font-mono uppercase bg-white rounded-lg border focus:outline-none ${
                gstinOutcome
                  ? gstinOutcome.isValid
                    ? 'border-[#1F5C46] bg-[#E3EEE8]/20'
                    : 'border-[#A13A2F] bg-[#F6E1DE]/20'
                  : 'border-[#E8E6DF] focus:border-[#5B3E73]'
              }`}
            />
            {gstinOutcome && !gstinOutcome.isValid && (
              <p className="text-[11px] text-[#A13A2F] mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {gstinOutcome.reason}
              </p>
            )}
            {gstinOutcome && gstinOutcome.isValid && (
              <p className="text-[11px] text-[#1F5C46] mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Valid Indian GSTIN format with verified state code.
              </p>
            )}
          </div>

          <div className="p-3 bg-[#F7F6F3] rounded-lg border border-[#E8E6DF] text-xs space-y-1">
            <div className="font-semibold text-[#14130F]">Included Standard Plan:</div>
            <div className="text-[#56524B]">
              10% standard platform fee on funded milestones. Upgrade anytime to Business Plus (5%) at volume.
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              id="signup-client-submit"
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-[#5B3E73] hover:bg-[#48315B] transition-colors shadow-xs"
            >
              Complete Business Registration
            </button>
          </div>
        </form>

        <div className="mt-4 text-center text-xs text-[#56524B]">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="text-[#5B3E73] font-semibold hover:underline">
            Log in here
          </button>
        </div>
      </div>
    </div>
  );
};
