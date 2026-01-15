/**
 * Enterprise Invoice System Types
 * Industry-standard type definitions for logistics invoice management
 */

import type { 
  ServiceLevel, 
  PaymentMode, 
  Incoterm, 
} from '@/lib/invoice/design-tokens';

// Re-export from design tokens for convenience
export type { ServiceLevel, PaymentMode, Incoterm } from '@/lib/invoice/design-tokens';

// Invoice status types
export type InvoiceStatusKey = 'draft' | 'pending' | 'paid' | 'partial' | 'overdue' | 'cancelled';

// =============================================================================
// BASE TYPES
// =============================================================================

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  stateCode?: string;
  pincode: string;
  country: string;
}

export interface ContactInfo {
  name: string;
  phone: string;
  email?: string;
  gstin?: string;
}

export interface Party extends ContactInfo {
  address: Address;
  companyName?: string;
}

// =============================================================================
// PACKAGE & SHIPMENT TYPES
// =============================================================================

export interface PackageDimensions {
  length: number;  // cm
  width: number;   // cm
  height: number;  // cm
}

export interface PackageItem {
  id: string;
  description: string;
  category?: string;
  quantity: number;
  actualWeight: number;  // kg
  dimensions?: PackageDimensions;
  volumetricWeight?: number;  // calculated
  declaredValue?: number;
  hsnCode?: string;
  isFragile?: boolean;
  packagingType?: 'box' | 'envelope' | 'pallet' | 'crate' | 'bag' | 'other';
}

export interface ShipmentDetails {
  transportMode: 'air' | 'surface' | 'express' | 'sea';
  serviceLevel: ServiceLevel;
  paymentMode: PaymentMode;
  
  // Weight Summary
  totalActualWeight: number;
  totalVolumetricWeight: number;
  chargeableWeight: number;
  totalPieces: number;
  
  // Route
  originCode?: string;  // IATA airport code
  destinationCode?: string;
  
  // Content
  contentDescription?: string;
  specialInstructions?: string;
  dangerousGoods?: boolean;
  dgClass?: string;
  unNumber?: string;
}

// =============================================================================
// CHARGE TYPES
// =============================================================================

export interface ChargeBreakdown {
  // Base Charges
  baseFreightCharge: number;
  ratePerKg: number;
  
  // Surcharges
  fuelSurcharge: number;
  fuelSurchargePercentage: number;
  remoteAreaSurcharge: number;
  securitySurcharge: number;
  peakSeasonSurcharge: number;
  residentialDeliveryCharge: number;
  
  // Service Charges
  pickupCharge: number;
  deliveryCharge: number;
  packingCharge: number;
  handlingCharge: number;
  insuranceCharge: number;
  otherCharges: number;
  
  // Discounts
  discountPercentage: number;
  discountAmount: number;
}

export interface TaxBreakdown {
  subtotal: number;
  cgst: number;
  cgstRate: number;
  sgst: number;
  sgstRate: number;
  igst: number;
  igstRate: number;
  totalTax: number;
  isInterState: boolean;
  placeOfSupply: string;
}

export interface InvoiceTotals {
  charges: ChargeBreakdown;
  tax: TaxBreakdown;
  grandTotal: number;
  advancePaid: number;
  balanceDue: number;
}

// =============================================================================
// LINE ITEM TYPES
// =============================================================================

export type LineItemType = 'freight' | 'surcharge' | 'service' | 'tax' | 'discount';

export interface InvoiceLineItem {
  id: string;
  invoiceId: string;
  itemType: LineItemType;
  description: string;
  hsnSacCode?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discountPercentage?: number;
  discountAmount?: number;
  taxPercentage?: number;
  taxAmount: number;
  lineTotal: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// PAYMENT TYPES
// =============================================================================

export type PaymentMethod = 'cash' | 'bank_transfer' | 'cheque' | 'card' | 'upi' | 'other';

export interface InvoicePayment {
  id: string;
  invoiceId: string;
  paymentDate: string;
  amount: number;
  paymentMethod: PaymentMethod;
  referenceNo?: string;
  transactionId?: string;
  notes?: string;
  recordedBy: string;
  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// TEMPLATE TYPES
// =============================================================================

export type TemplateType = 'standard' | 'express' | 'international' | 'custom';

export interface InvoiceTemplate {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  templateType: TemplateType;
  defaultServiceLevel: ServiceLevel;
  defaultPaymentTerms: number;
  defaultPaymentMode: PaymentMode;
  defaultCharges: Partial<ChargeBreakdown>;
  termsAndConditions?: string;
  isActive: boolean;
  isDefault: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// AUDIT LOG TYPES
// =============================================================================

export type AuditAction = 
  | 'created' 
  | 'updated' 
  | 'approved' 
  | 'sent' 
  | 'viewed'
  | 'payment_recorded' 
  | 'payment_voided' 
  | 'cancelled'
  | 'status_changed' 
  | 'pdf_generated' 
  | 'emailed' 
  | 'whatsapp_sent';

export interface InvoiceAuditLog {
  id: string;
  invoiceId: string;
  action: AuditAction;
  fieldChanged?: string;
  oldValue?: string;
  newValue?: string;
  metadata?: Record<string, unknown>;
  performedBy: string;
  performedAt: string;
  ipAddress?: string;
  userAgent?: string;
}

// =============================================================================
// MAIN INVOICE TYPE
// =============================================================================

export type InvoicePriority = 'low' | 'normal' | 'high' | 'urgent';

export interface EnterpriseInvoice {
  // Identity
  id: string;
  invoiceNo: string;
  awbNo: string;
  barcodeData?: string;
  
  // Type & Status
  type: 'customer' | 'label' | 'commercial' | 'proforma';
  status: InvoiceStatusKey;
  priority: InvoicePriority;
  
  // Dates
  invoiceDate: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  
  // Parties
  customerId?: string;
  shipper: Party;
  consignee: Party;
  
  // Shipment
  shipment: ShipmentDetails;
  packages: PackageItem[];
  
  // Financials
  totals: InvoiceTotals;
  currencyCode: string;
  exchangeRate: number;
  
  // Compliance
  hsnSacCode: string;
  placeOfSupply: string;
  reverseChargeApplicable: boolean;
  ewaybillNo?: string;
  ewaybillDate?: string;
  incoterm?: Incoterm;
  
  // Document References
  purchaseOrderNo?: string;
  proformaInvoiceId?: string;
  commercialInvoiceId?: string;
  masterAwb?: string;
  houseAwb?: string;
  templateId?: string;
  
  // Tracking
  flightNumber?: string;
  vesselName?: string;
  containerNumber?: string;
  
  // PDF & Documents
  pdfUrl?: string;
  labelPdfUrl?: string;
  packingListPdfUrl?: string;
  pdfGeneratedAt?: string;
  pdfVersion: number;
  
  // Notifications
  sentViaEmailAt?: string;
  sentViaWhatsappAt?: string;
  emailOpens: number;
  lastViewedAt?: string;
  
  // Approval
  requiresApproval: boolean;
  approvedBy?: string;
  approvedAt?: string;
  cancelledBy?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  
  // Internal
  tags: string[];
  internalNotes?: string;
  
  // Relationships
  lineItems?: InvoiceLineItem[];
  payments?: InvoicePayment[];
  auditLog?: InvoiceAuditLog[];
  
  // Audit
  createdBy: string;
  organizationId: string;
  deletedAt?: string;
}

// =============================================================================
// FORM INPUT TYPES
// =============================================================================

export interface InvoiceFormInput {
  // Transport & Payment
  transportMode: 'air' | 'surface' | 'express';
  serviceLevel: ServiceLevel;
  paymentMode: PaymentMode;
  
  // Shipper/Consignor
  shipper: {
    name: string;
    phone: string;
    email?: string;
    gstin?: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  
  // Consignee/Receiver
  consignee: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  
  // Packages
  packages: Array<{
    description: string;
    category?: string;
    quantity: number;
    weight: number;
    length?: number;
    width?: number;
    height?: number;
    declaredValue?: number;
  }>;
  
  // Charges
  charges: {
    ratePerKg: number;
    fuelSurchargePercentage?: number;
    pickupCharge?: number;
    deliveryCharge?: number;
    packingCharge?: number;
    insuranceCharge?: number;
    handlingCharge?: number;
    otherCharges?: number;
    discountPercentage?: number;
    advancePaid?: number;
  };
  
  // Optional
  templateId?: string;
  specialInstructions?: string;
  internalNotes?: string;
  tags?: string[];
}

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

export interface InvoiceListItem {
  id: string;
  invoiceNo: string;
  awbNo: string;
  type: string;
  status: InvoiceStatusKey;
  
  // Customer/Shipper
  customerName: string;
  customerPhone: string;
  
  // Consignee
  consigneeName: string;
  consigneeCity: string;
  consigneeState: string;
  
  // Dates
  invoiceDate: string;
  dueDate: string;
  
  // Amounts
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  
  // Status flags
  isOverdue: boolean;
  hasPdf: boolean;
  wasSent: boolean;
}

export interface InvoiceListResponse {
  invoices: InvoiceListItem[];
  total: number;
  page: number;
  pageSize: number;
  stats: {
    total: number;
    draft: number;
    pending: number;
    paid: number;
    partial: number;
    overdue: number;
    cancelled: number;
    totalAmount: number;
    paidAmount: number;
    outstandingAmount: number;
  };
}

export interface InvoiceDetailResponse {
  invoice: EnterpriseInvoice;
  lineItems: InvoiceLineItem[];
  payments: InvoicePayment[];
  auditLog: InvoiceAuditLog[];
  relatedDocuments: {
    type: string;
    url: string;
    generatedAt: string;
  }[];
}

// =============================================================================
// FILTER & SEARCH TYPES
// =============================================================================

export interface InvoiceFilters {
  search?: string;
  status?: InvoiceStatusKey[];
  type?: string[];
  dateRange?: {
    from: string;
    to: string;
  };
  amountRange?: {
    min: number;
    max: number;
  };
  customerId?: string;
  tags?: string[];
  priority?: InvoicePriority[];
  isOverdue?: boolean;
  hasPdf?: boolean;
}

export interface InvoiceSortOptions {
  field: 'invoiceDate' | 'dueDate' | 'totalAmount' | 'invoiceNo' | 'createdAt';
  direction: 'asc' | 'desc';
}

// =============================================================================
// PRINT & EXPORT TYPES
// =============================================================================

export interface PrintableInvoice {
  // Header
  companyName: string;
  companyGstin: string;
  companyAddress: string;
  companyContact: string;
  logo?: string;
  
  // Invoice Info
  invoiceNo: string;
  invoiceDate: string;
  dueDate: string;
  awbNo: string;
  placeOfSupply: string;
  
  // Parties
  billingDetails: Party;
  shippingDetails: Party;
  
  // Shipment
  serviceLevel: string;
  transportMode: string;
  pieces: number;
  weight: string;
  paymentMode: string;
  
  // Line Items
  items: Array<{
    srNo: number;
    description: string;
    hsnCode?: string;
    quantity: string;
    rate: string;
    taxableAmount: string;
    cgst?: string;
    sgst?: string;
    igst?: string;
    total: string;
  }>;
  
  // Totals
  subtotal: string;
  cgstAmount?: string;
  sgstAmount?: string;
  igstAmount?: string;
  totalTax: string;
  grandTotal: string;
  amountInWords: string;
  advancePaid: string;
  balanceDue: string;
  
  // Footer
  bankDetails: {
    bankName: string;
    accountNo: string;
    ifscCode: string;
    branch: string;
  };
  termsAndConditions: string[];
  qrCodeData?: string;
  
  // Meta
  watermark?: 'ORIGINAL' | 'DUPLICATE' | 'DRAFT' | 'CANCELLED';
  pageInfo: string;
  generatedAt: string;
}

export interface AWBLabelData {
  // Header
  companyLogo?: string;
  companyName: string;
  
  // AWB Info
  awbNo: string;
  invoiceNo: string;
  invoiceDate: string;
  serviceLevel: string;
  transportMode: string;
  paymentMode: string;
  
  // Route
  originCode: string;
  destinationCode: string;
  
  // Shipper
  shipperName: string;
  shipperAddress: string;
  shipperPhone: string;
  
  // Consignee
  consigneeName: string;
  consigneeAddress: string;
  consigneePhone: string;
  
  // Shipment
  pieces: string;
  weight: string;
  declaredValue?: string;
  
  // Instructions
  specialInstructions?: string;
  
  // Barcodes
  barcodeData: string;
  
  // Tracking
  stationCode: string;
  pieceInfo: string;
}
