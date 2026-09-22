# Verqo — India's Tech Freelance Marketplace

Web-based platform migrated from the Verqo Android/Flutter mobile client, replicating all core capabilities and workflows.

## Features

- **Milestone Escrow Security**: Funds are locked in escrow prior to work inception and disbursed only upon explicit client approval.
- **Indian Statutory Compliance**: Real-time Section 194-O TDS (1%) ledger calculation on marketplace payouts.
- **Aadhaar KYC Verification**: 12-digit number validation powered by the mathematical **Verhoeff checksum algorithm**.
- **PAN Holder Verification**: Validates structure and holder-type classification code (`P`, `C`, `H`, etc.) in the 4th position.
- **GSTIN Validation**: 15-character Indian Goods and Services Tax Identification Number checks against state codes (01–38) and embedded PAN.
- **Dual Persona Dashboards**:
  - **Freelancer Dashboard**: Active contracts, milestone start/submit actions, Section 194-O tax summary, and recommended project discovery.
  - **Client Dashboard**: Contractor contracts, escrow funding, pending deliverable approval queue, job postings, and contractor talent directory.

## Development

```bash
# Start development server on port 3000
npm run dev

# Lint and typecheck
npm run lint

# Production build
npm run build
```
