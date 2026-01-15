# Enterprise Invoice System Architecture

## Overview

The TAC Cargo Enterprise Invoice System has been re-engineered to meet industry standards (IATA, FIATA, ISO 6422, UN/CEFACT, PEPPOL) with a professional B2B design system.

## Project Structure

```
tac-cargo/
├── lib/invoice/
│   ├── design-tokens.ts          # Design system tokens (colors, typography, status configs)
│   ├── enterprise-calculations.ts # Business logic (GST, weights, charges)
│   ├── calculations.ts           # Legacy calculation utilities
│   ├── id-generator.ts           # Invoice/AWB number generation
│   └── index.ts                  # Module exports
│
├── types/
│   ├── invoice-enterprise.ts     # TypeScript types for enterprise system
│   └── invoice-v2.ts             # Legacy types (retained for compatibility)
│
├── components/invoice/
│   ├── enterprise/
│   │   ├── invoice-list.tsx      # Enterprise invoice list with filters
│   │   ├── invoice-document.tsx  # Print-ready invoice document
│   │   ├── awb-label.tsx         # IATA-compliant AWB label
│   │   └── index.ts              # Component exports
│   └── amazon-style/             # Legacy components (retained)
│
├── app/actions/
│   ├── invoice-enterprise.ts     # Server actions for enterprise system
│   └── invoices.ts               # Legacy actions (retained)
│
└── supabase/migrations/
    ├── 006_enhanced_invoice_fields.sql  # Enhanced fields
    └── 007_enterprise_invoice_system.sql # Line items, payments, audit
```

## Design System

### Color Palette

| Category | Usage | Primary Color |
|----------|-------|---------------|
| Primary | Trust & Reliability | `#1E40AF` (Blue 800) |
| Accent | Call to Action | `#EA580C` (Orange 600) |
| Success | Paid/Confirmed | `#059669` (Green 600) |
| Warning | Pending/Partial | `#D97706` (Amber 600) |
| Danger | Overdue/Error | `#DC2626` (Red 600) |

### Status Configuration

| Status | Label | Color | Allowed Transitions |
|--------|-------|-------|---------------------|
| draft | Draft | Neutral | pending, cancelled |
| pending | Pending Payment | Amber | paid, partial, overdue, cancelled |
| paid | Paid | Green | - |
| partial | Partially Paid | Blue | paid, overdue |
| overdue | Overdue | Red | paid, partial, cancelled |
| cancelled | Cancelled | Gray | - |

## Database Schema

### New Tables

1. **invoice_line_items** - Detailed line item breakdown
   - Supports: freight, surcharge, service, tax, discount types
   - Auto-calculates invoice totals via trigger

2. **invoice_payments** - Payment tracking
   - Supports: cash, bank_transfer, cheque, card, upi, other
   - Auto-updates paid_amount and status via trigger

3. **invoice_templates** - Reusable templates
   - Template types: standard, express, international, custom

4. **invoice_audit_log** - Complete audit trail
   - Actions: created, updated, approved, sent, viewed, payment_recorded, etc.

### Enhanced Invoice Fields

- Service level (express, priority, economy, standard)
- GST compliance (CGST/SGST/IGST, place of supply, HSN code)
- Weight details (actual, volumetric, chargeable, divisor)
- Detailed charges breakdown (fuel surcharge, remote area, etc.)
- Approval workflow fields
- Notification tracking

## Business Logic

### Weight Calculations

```typescript
// Volumetric Weight = (L × W × H) / Divisor
// Divisor: 5000 (air/express), 6000 (economy)
// Chargeable = max(actual, volumetric)

calculateVolumetricWeight(length, width, height, divisor)
calculateChargeableWeight(actual, volumetric)
calculatePackageWeights(packages, serviceLevel)
```

### GST Calculation

```typescript
// Intra-state: CGST 9% + SGST 9%
// Inter-state: IGST 18%

calculateGST(subtotal, originState, destinationState)
isInterStateTransaction(origin, destination)
```

### Invoice Totals

```typescript
calculateInvoiceTotals(
  packages,
  ratePerKg,
  originState,
  destinationState,
  serviceLevel,
  chargeOptions
)
```

## Components

### EnterpriseInvoiceList

Professional data table with:
- Stats cards (total, paid, pending, overdue)
- Search & filter (status, date range, sorting)
- Bulk selection & actions
- Export functionality (CSV, Excel, PDF)

### InvoiceDocument

Print-ready A4 invoice with:
- Company header with logo
- Invoice metadata
- Billing & shipping details
- Shipment info bar
- Line items table with GST breakdown
- Totals section with amount in words
- Bank details, T&C, signature area
- QR code for verification

### AWBLabel

IATA-compliant shipping label with:
- Company branding
- Route display (origin → destination)
- Party details (shipper/consignee)
- Shipment info (pieces, weight, value)
- Special handling icons
- Barcode (CODE128)

## Server Actions

| Action | Description |
|--------|-------------|
| `createEnterpriseInvoice` | Create new invoice with validation |
| `getInvoiceList` | List invoices with filters & stats |
| `getInvoiceDetail` | Get full invoice with payments & audit log |
| `recordPayment` | Record payment, auto-update status |
| `updateInvoiceStatus` | Change status with audit trail |

## Migration Path

1. Run `007_enterprise_invoice_system.sql` migration
2. Existing invoices continue to work
3. New invoices use enterprise components
4. Gradually migrate UI to enterprise components

## Usage Example

```tsx
import { EnterpriseInvoiceList, InvoiceDocument, AWBLabel } from '@/components/invoice/enterprise';
import { getInvoiceList } from '@/app/actions/invoice-enterprise';

// List invoices
const { data } = await getInvoiceList({ status: ['pending'] });

// Render list
<EnterpriseInvoiceList invoices={data.invoices} />

// Print invoice
<InvoiceDocument invoice={printableData} variant="original" />

// Print label
<AWBLabel data={labelData} size="standard" />
```

## Future Enhancements

- [ ] Multi-step invoice creation wizard
- [ ] Invoice templates management UI
- [ ] Bulk invoice operations
- [ ] Email/WhatsApp delivery with tracking
- [ ] PDF generation service integration
- [ ] E-invoicing (GSTN) integration
- [ ] Multi-currency support with live rates
- [ ] Advanced reporting & analytics

---

*Documentation generated for TAC Cargo Enterprise Invoice System v4.0*
