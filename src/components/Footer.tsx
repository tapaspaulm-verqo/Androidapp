import React from 'react';
import { Shield, FileCheck, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-[#E8E6DF] bg-white text-xs text-[#56524B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#14130F] flex items-center justify-center">
                <span className="text-white font-bold text-xs">V</span>
              </div>
              <span className="text-base font-bold font-['IBM_Plex_Sans'] text-[#14130F]">
                Verqo India
              </span>
            </div>
            <p className="text-xs text-[#56524B] max-w-md leading-relaxed">
              India's tech freelance marketplace built for engineering teams and verified independent contractors.
              Featuring milestone escrow security, Section 194-O TDS compliance, and Aadhaar Verhoeff verification.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-[#14130F] uppercase tracking-wider text-[11px] mb-3">
              Compliance & Safety
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1F5C46]" />
                <span>IT Act Section 194-O TDS</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1F5C46]" />
                <span>Verhoeff Aadhaar Checksum</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1F5C46]" />
                <span>PAN Holder Validation</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1F5C46]" />
                <span>Milestone Escrow Hold</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#14130F] uppercase tracking-wider text-[11px] mb-3">
              Fee Structure
            </h4>
            <ul className="space-y-2 text-[#56524B]">
              <li>Freelancers: Flat 5% on payouts</li>
              <li>Clients: Standard 10% / Plus 5%</li>
              <li>GST Input Credit Invoices</li>
              <li>Zero Registration Fees</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-[#E8E6DF] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>
            © {new Date().getFullYear()} Verqo Technologies Private Limited. All rights reserved.
          </div>
          <div className="text-[#9C978D]">
            Escrow protection active · Replicated from Verqo Android Applet
          </div>
        </div>
      </div>
    </footer>
  );
};
