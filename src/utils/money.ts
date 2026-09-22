import { MilestoneState } from '../types';

/**
 * Money and milestone-state formatting shared across the Jobs list and dashboards.
 * Amounts everywhere in the API are minor units (paise: ₹1 = 100 paise).
 */
export class Money {
  static formatMinor(minor: number): string {
    const rupees = Math.round(minor / 100);
    const negative = rupees < 0;
    const abs = Math.abs(rupees);
    // Standard thousands grouping for readability
    const formatted = abs.toLocaleString('en-IN');
    return `${negative ? '-' : ''}₹${formatted}`;
  }
}

export interface MilestoneStateStyle {
  label: string;
  foreground: string;
  background: string;
  border: string;
}

export function getMilestoneStateStyle(state: MilestoneState | string): MilestoneStateStyle {
  switch (state) {
    case 'Unfunded':
      return {
        label: 'Awaiting funding',
        foreground: '#56524B', // VerqoColors.inkSecondary
        background: '#EDEBE6',
        border: '#D8D4CC',
      };
    case 'Funded':
      return {
        label: 'Funded in escrow',
        foreground: '#1F5C46', // VerqoColors.accent
        background: '#E3EEE8',
        border: '#B3D3C4',
      };
    case 'InProgress':
      return {
        label: 'In progress',
        foreground: '#9A6B12', // VerqoColors.warning
        background: '#F7EBD3',
        border: '#E8D4A8',
      };
    case 'Submitted':
      return {
        label: 'Submitted for review',
        foreground: '#9A6B12', // VerqoColors.warning
        background: '#F7EBD3',
        border: '#E8D4A8',
      };
    case 'ApprovedReleased':
      return {
        label: 'Payment released',
        foreground: '#1F5C46', // VerqoColors.accent
        background: '#E3EEE8',
        border: '#B3D3C4',
      };
    case 'Disputed':
      return {
        label: 'Disputed',
        foreground: '#A13A2F', // VerqoColors.danger
        background: '#F6E1DE',
        border: '#E8B9B3',
      };
    case 'RefundedCancelled':
      return {
        label: 'Refunded / cancelled',
        foreground: '#A13A2F', // VerqoColors.danger
        background: '#F6E1DE',
        border: '#E8B9B3',
      };
    default:
      return {
        label: state,
        foreground: '#56524B',
        background: '#EDEBE6',
        border: '#D8D4CC',
      };
  }
}

/**
 * Short human readable date (e.g. "25 Sep 2026")
 */
export function formatShortDate(isoDate?: string | null): string {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return '';
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}
