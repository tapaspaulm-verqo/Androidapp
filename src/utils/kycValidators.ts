export interface ValidationOutcome {
  isValid: boolean;
  reason?: string;
}

export class PanValidator {
  private static readonly format = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
  private static readonly validHolderTypeCodes = new Set(['P', 'C', 'H', 'A', 'B', 'G', 'J', 'L', 'F', 'T']);

  static validate(pan?: string | null): ValidationOutcome {
    if (!pan || pan.trim().length === 0) {
      return { isValid: false, reason: 'PAN is required.' };
    }
    const normalized = pan.trim().toUpperCase();
    if (!this.format.test(normalized)) {
      return {
        isValid: false,
        reason: 'PAN must be in the format AAAAA9999A (5 letters, 4 digits, 1 letter).',
      };
    }
    const holderType = normalized[3];
    if (!this.validHolderTypeCodes.has(holderType)) {
      return {
        isValid: false,
        reason: `'${holderType}' in position 4 is not a recognised PAN holder-type code (P, C, H, A, B, G, J, L, F, T).`,
      };
    }
    return { isValid: true };
  }

  static normalize(pan: string): string {
    return pan.trim().toUpperCase();
  }
}

export class AadhaarValidator {
  private static readonly format = /^[2-9][0-9]{11}$/;

  // Verhoeff algorithm multiplication table
  private static readonly d: number[][] = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
  ];

  // Verhoeff algorithm permutation table
  private static readonly p: number[][] = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
  ];

  private static verhoeffIsValid(digits: string): boolean {
    let c = 0;
    for (let i = 0; i < digits.length; i++) {
      const digit = parseInt(digits[digits.length - 1 - i], 10);
      c = this.d[c][this.p[i % 8][digit]];
    }
    return c === 0;
  }

  static validate(aadhaar?: string | null): ValidationOutcome {
    if (!aadhaar || aadhaar.trim().length === 0) {
      return { isValid: false, reason: 'Aadhaar number is required.' };
    }
    const normalized = aadhaar.replace(/\s+/g, '').trim();
    if (!this.format.test(normalized)) {
      return {
        isValid: false,
        reason: 'Aadhaar must be exactly 12 digits and cannot start with 0 or 1.',
      };
    }
    if (!this.verhoeffIsValid(normalized)) {
      return {
        isValid: false,
        reason: 'Aadhaar number failed Verhoeff checksum validation — check for a typo.',
      };
    }
    return { isValid: true };
  }

  static last4(validatedAadhaar: string): string {
    const clean = validatedAadhaar.replace(/\s+/g, '').trim();
    return clean.slice(-4);
  }
}

export class GstinValidator {
  private static readonly format = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
  private static readonly validPanHolderTypeCodes = new Set(['P', 'C', 'H', 'A', 'B', 'G', 'J', 'L', 'F', 'T']);

  static validate(gstin?: string | null): ValidationOutcome {
    if (!gstin || gstin.trim().length === 0) {
      return { isValid: true }; // optional
    }
    const normalized = gstin.trim().toUpperCase();
    if (!this.format.test(normalized)) {
      return {
        isValid: false,
        reason: "GSTIN must be 15 characters: 2-digit state code, business's 10-char PAN, entity number, 'Z', and check digit.",
      };
    }
    const stateCode = parseInt(normalized.substring(0, 2), 10);
    if (stateCode < 1 || stateCode > 38) {
      return {
        isValid: false,
        reason: 'The first two digits of a GSTIN must be a valid Indian state code (01–38).',
      };
    }
    // Position 6 (index 5) of GSTIN is the embedded PAN's 4th character (holder-type code)
    if (!this.validPanHolderTypeCodes.has(normalized[5])) {
      return {
        isValid: false,
        reason: 'The PAN embedded in the GSTIN (characters 3–12) is not validly formatted.',
      };
    }
    return { isValid: true };
  }

  static normalize(gstin: string): string {
    return gstin.trim().toUpperCase();
  }
}
