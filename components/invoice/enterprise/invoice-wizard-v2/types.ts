/**
 * Invoice Wizard V2 - Type Definitions
 * Enterprise-grade invoice creation system
 */

import type { ServiceLevel, PaymentMode } from "@/lib/invoice/design-tokens";

// =============================================================================
// WIZARD STEP TYPES
// =============================================================================

export interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  isOptional?: boolean;
}

export type WizardStepStatus = "pending" | "current" | "completed" | "error";

// =============================================================================
// ADDRESS & PARTY TYPES
// =============================================================================

export interface AddressData {
  name: string;
  phone: string;
  email: string;
  gstin: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface CustomerSuggestion {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  gstin: string | null;
  invoiceCount: number;
}

// =============================================================================
// PACKAGE TYPES
// =============================================================================

export interface PackageData {
  id: string;
  description: string;
  category: PackageCategory;
  quantity: number;
  weight: number;
  length: number;
  width: number;
  height: number;
  declaredValue: number;
}

export type PackageCategory = 
  | "general"
  | "documents"
  | "electronics"
  | "fragile"
  | "clothing"
  | "food"
  | "medicine"
  | "machinery"
  | "other";

export const PACKAGE_CATEGORIES: { value: PackageCategory; label: string; icon: string }[] = [
  { value: "general", label: "General Cargo", icon: "📦" },
  { value: "documents", label: "Documents", icon: "📄" },
  { value: "electronics", label: "Electronics", icon: "💻" },
  { value: "fragile", label: "Fragile Items", icon: "⚠️" },
  { value: "clothing", label: "Clothing & Textiles", icon: "👕" },
  { value: "food", label: "Food & Perishables", icon: "🍱" },
  { value: "medicine", label: "Medicine & Pharma", icon: "💊" },
  { value: "machinery", label: "Machinery & Parts", icon: "⚙️" },
  { value: "other", label: "Other", icon: "📋" },
];

// =============================================================================
// CHARGES TYPES
// =============================================================================

export interface ChargesData {
  ratePerKg: number;
  fuelSurchargePercentage: number;
  pickupCharge: number;
  deliveryCharge: number;
  packingCharge: number;
  insuranceCharge: number;
  handlingCharge: number;
  otherCharges: number;
  discountPercentage: number;
  advancePaid: number;
}

// =============================================================================
// COMPLETE FORM STATE
// =============================================================================

export interface InvoiceFormState {
  // Step 1: Parties
  transportMode: "air" | "surface" | "express";
  serviceLevel: ServiceLevel;
  paymentMode: PaymentMode;
  shipper: AddressData;
  consignee: AddressData;
  
  // Step 2: Packages
  packages: PackageData[];
  
  // Step 3: Charges
  charges: ChargesData;
  
  // Step 4: Review
  specialInstructions: string;
  internalNotes: string;
  
  // Meta
  customerId?: string;
}

// =============================================================================
// CALCULATED VALUES
// =============================================================================

export interface WeightSummary {
  totalPieces: number;
  actualWeight: number;
  volumetricWeight: number;
  chargeableWeight: number;
}

export interface ChargeSummary {
  baseFreight: number;
  fuelSurcharge: number;
  serviceCharges: number;
  discount: number;
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  grandTotal: number;
  advancePaid: number;
  balanceDue: number;
  isInterState: boolean;
}

// =============================================================================
// VALIDATION TYPES
// =============================================================================

export interface ValidationError {
  field: string;
  message: string;
}

export interface StepValidation {
  isValid: boolean;
  errors: ValidationError[];
}

// =============================================================================
// WIZARD PROPS
// =============================================================================

export interface InvoiceWizardProps {
  onSuccess?: (invoice: { id: string; invoice_no: string; awb_no: string }) => void;
  onCancel?: () => void;
  initialData?: Partial<InvoiceFormState>;
}
