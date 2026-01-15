/**
 * Invoice Wizard V2 - Enterprise-grade invoice creation system
 * 
 * A complete redesign with modern UI/UX patterns:
 * - Animated step indicator with progress tracking
 * - Glassmorphic card designs with gradients
 * - Customer autocomplete for faster entry
 * - Real-time validation with inline errors
 * - Live invoice preview sidebar
 * - Smooth Framer Motion transitions
 * - Mobile-first responsive design
 */

// Main wizard component
export { InvoiceWizard } from "./invoice-wizard";
export { default as InvoiceWizardDefault } from "./invoice-wizard";

// Sub-components
export { StepIndicator } from "./step-indicator";
export { AddressCard } from "./address-card";
export { PackageCard } from "./package-card";
export { ChargesSection } from "./charges-section";
export { TotalsSummary } from "./totals-summary";

// Types
export type {
  WizardStep,
  WizardStepStatus,
  AddressData,
  CustomerSuggestion,
  PackageData,
  PackageCategory,
  ChargesData,
  InvoiceFormState,
  WeightSummary,
  ChargeSummary,
  ValidationError,
  StepValidation,
  InvoiceWizardProps,
} from "./types";

export { PACKAGE_CATEGORIES } from "./types";
