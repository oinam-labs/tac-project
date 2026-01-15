/**
 * Enterprise Invoice Calculation Engine
 * Industry-standard calculations for logistics invoicing
 * 
 * Features:
 * - Volumetric weight calculation (IATA standard)
 * - GST calculation (CGST/SGST/IGST)
 * - Fuel surcharge calculation
 * - Multi-currency support
 * - Rounding rules compliance
 */

import Currency from 'currency.js';
import {
  TAX_CONFIG,
  SERVICE_LEVEL_CONFIG,
  type ServiceLevel,
} from './design-tokens';
import type {
  PackageItem,
  ChargeBreakdown,
  TaxBreakdown,
  InvoiceTotals,
  // ShipmentDetails, // Reserved for shipment details type
} from '@/types/invoice-enterprise';

// =============================================================================
// CONSTANTS
// =============================================================================

const INR = (value: number) => Currency(value, { 
  symbol: '₹', 
  precision: 2,
  separator: ',',
  decimal: '.',
});

// State codes for GST
const STATE_CODES: Record<string, string> = {
  'jammu and kashmir': '01',
  'himachal pradesh': '02',
  'punjab': '03',
  'chandigarh': '04',
  'uttarakhand': '05',
  'haryana': '06',
  'delhi': '07',
  'rajasthan': '08',
  'uttar pradesh': '09',
  'bihar': '10',
  'sikkim': '11',
  'arunachal pradesh': '12',
  'nagaland': '13',
  'manipur': '14',
  'mizoram': '15',
  'tripura': '16',
  'meghalaya': '17',
  'assam': '18',
  'west bengal': '19',
  'jharkhand': '20',
  'odisha': '21',
  'chhattisgarh': '22',
  'madhya pradesh': '23',
  'gujarat': '24',
  'dadra and nagar haveli': '26',
  'daman and diu': '25',
  'maharashtra': '27',
  'andhra pradesh': '37',
  'karnataka': '29',
  'goa': '30',
  'lakshadweep': '31',
  'kerala': '32',
  'tamil nadu': '33',
  'puducherry': '34',
  'andaman and nicobar islands': '35',
  'telangana': '36',
  'ladakh': '38',
};

// =============================================================================
// WEIGHT CALCULATIONS
// =============================================================================

/**
 * Calculate volumetric weight based on dimensions
 * Formula: (L × W × H) / Divisor
 * 
 * @param dimensions - Package dimensions in cm
 * @param divisor - Volumetric divisor (5000 for air, 6000 for surface)
 * @returns Volumetric weight in kg
 */
export function calculateVolumetricWeight(
  length: number,
  width: number,
  height: number,
  divisor: number = 5000
): number {
  if (!length || !width || !height) return 0;
  const volumetricWeight = (length * width * height) / divisor;
  return Math.ceil(volumetricWeight * 100) / 100; // Round up to 2 decimals
}

/**
 * Calculate chargeable weight (higher of actual vs volumetric)
 */
export function calculateChargeableWeight(
  actualWeight: number,
  volumetricWeight: number
): number {
  return Math.max(actualWeight, volumetricWeight);
}

/**
 * Calculate total weights for multiple packages
 */
export function calculatePackageWeights(
  packages: PackageItem[],
  serviceLevel: ServiceLevel = 'standard'
): {
  totalActualWeight: number;
  totalVolumetricWeight: number;
  chargeableWeight: number;
  totalPieces: number;
} {
  const divisor = SERVICE_LEVEL_CONFIG[serviceLevel].volumetricDivisor;
  
  let totalActualWeight = 0;
  let totalVolumetricWeight = 0;
  let totalPieces = 0;

  packages.forEach((pkg) => {
    const qty = pkg.quantity || 1;
    totalPieces += qty;
    totalActualWeight += (pkg.actualWeight || 0) * qty;

    if (pkg.dimensions) {
      const volWeight = calculateVolumetricWeight(
        pkg.dimensions.length,
        pkg.dimensions.width,
        pkg.dimensions.height,
        divisor
      );
      totalVolumetricWeight += volWeight * qty;
    }
  });

  return {
    totalActualWeight: Math.ceil(totalActualWeight * 100) / 100,
    totalVolumetricWeight: Math.ceil(totalVolumetricWeight * 100) / 100,
    chargeableWeight: calculateChargeableWeight(totalActualWeight, totalVolumetricWeight),
    totalPieces,
  };
}

// =============================================================================
// CHARGE CALCULATIONS
// =============================================================================

/**
 * Calculate base freight charge
 */
export function calculateFreightCharge(
  chargeableWeight: number,
  ratePerKg: number,
  minimumCharge: number = 0
): number {
  const calculated = INR(chargeableWeight).multiply(ratePerKg).value;
  return Math.max(calculated, minimumCharge);
}

/**
 * Calculate fuel surcharge
 */
export function calculateFuelSurcharge(
  baseFreight: number,
  fuelSurchargePercentage: number = 15
): { amount: number; percentage: number } {
  const amount = INR(baseFreight).multiply(fuelSurchargePercentage / 100).value;
  return { amount, percentage: fuelSurchargePercentage };
}

/**
 * Calculate insurance charge based on declared value
 */
export function calculateInsuranceCharge(
  declaredValue: number,
  insuranceRate: number = 1 // 1% of declared value
): number {
  if (!declaredValue || declaredValue <= 0) return 0;
  return INR(declaredValue).multiply(insuranceRate / 100).value;
}

/**
 * Calculate discount amount
 */
export function calculateDiscount(
  subtotal: number,
  discountPercentage: number = 0,
  fixedDiscount: number = 0
): number {
  const percentageDiscount = INR(subtotal).multiply(discountPercentage / 100).value;
  return INR(percentageDiscount).add(fixedDiscount).value;
}

/**
 * Calculate complete charge breakdown
 */
export function calculateCharges(
  chargeableWeight: number,
  ratePerKg: number,
  options: Partial<{
    fuelSurchargePercentage: number;
    pickupCharge: number;
    deliveryCharge: number;
    packingCharge: number;
    handlingCharge: number;
    insuranceCharge: number;
    otherCharges: number;
    remoteAreaSurcharge: number;
    securitySurcharge: number;
    peakSeasonSurcharge: number;
    residentialDeliveryCharge: number;
    discountPercentage: number;
    discountAmount: number;
    declaredValue: number;
    minimumFreight: number;
  }> = {}
): ChargeBreakdown {
  // Base freight
  const baseFreightCharge = calculateFreightCharge(
    chargeableWeight,
    ratePerKg,
    options.minimumFreight
  );

  // Fuel surcharge
  const fuel = calculateFuelSurcharge(
    baseFreightCharge,
    options.fuelSurchargePercentage ?? 15
  );

  // Insurance (calculate if not provided)
  const insuranceCharge = options.insuranceCharge ?? 
    calculateInsuranceCharge(options.declaredValue ?? 0);

  return {
    baseFreightCharge,
    ratePerKg,
    fuelSurcharge: fuel.amount,
    fuelSurchargePercentage: fuel.percentage,
    remoteAreaSurcharge: options.remoteAreaSurcharge ?? 0,
    securitySurcharge: options.securitySurcharge ?? 0,
    peakSeasonSurcharge: options.peakSeasonSurcharge ?? 0,
    residentialDeliveryCharge: options.residentialDeliveryCharge ?? 0,
    pickupCharge: options.pickupCharge ?? 0,
    deliveryCharge: options.deliveryCharge ?? 0,
    packingCharge: options.packingCharge ?? 0,
    handlingCharge: options.handlingCharge ?? 0,
    insuranceCharge,
    otherCharges: options.otherCharges ?? 0,
    discountPercentage: options.discountPercentage ?? 0,
    discountAmount: options.discountAmount ?? 0,
  };
}

// =============================================================================
// TAX CALCULATIONS
// =============================================================================

/**
 * Get state code from state name
 */
export function getStateCode(stateName: string): string {
  const normalized = stateName.toLowerCase().trim();
  return STATE_CODES[normalized] || '';
}

/**
 * Determine if transaction is inter-state
 */
export function isInterStateTransaction(
  originState: string,
  destinationState: string
): boolean {
  const originNormalized = originState.toLowerCase().trim();
  const destNormalized = destinationState.toLowerCase().trim();
  return originNormalized !== destNormalized;
}

/**
 * Calculate GST based on origin and destination states
 */
export function calculateGST(
  subtotal: number,
  originState: string,
  destinationState: string
): TaxBreakdown {
  const isInterState = isInterStateTransaction(originState, destinationState);
  const placeOfSupply = destinationState;

  if (isInterState) {
    // Inter-state: IGST
    const igstRate = TAX_CONFIG.GST.IGST_RATE;
    const igst = INR(subtotal).multiply(igstRate / 100).value;
    
    return {
      subtotal,
      cgst: 0,
      cgstRate: 0,
      sgst: 0,
      sgstRate: 0,
      igst,
      igstRate,
      totalTax: igst,
      isInterState: true,
      placeOfSupply,
    };
  } else {
    // Intra-state: CGST + SGST
    const cgstRate = TAX_CONFIG.GST.CGST_RATE;
    const sgstRate = TAX_CONFIG.GST.SGST_RATE;
    const cgst = INR(subtotal).multiply(cgstRate / 100).value;
    const sgst = INR(subtotal).multiply(sgstRate / 100).value;
    
    return {
      subtotal,
      cgst,
      cgstRate,
      sgst,
      sgstRate,
      igst: 0,
      igstRate: 0,
      totalTax: INR(cgst).add(sgst).value,
      isInterState: false,
      placeOfSupply,
    };
  }
}

// =============================================================================
// INVOICE TOTAL CALCULATION
// =============================================================================

/**
 * Calculate complete invoice totals
 */
export function calculateInvoiceTotals(
  packages: PackageItem[],
  ratePerKg: number,
  originState: string,
  destinationState: string,
  serviceLevel: ServiceLevel = 'standard',
  chargeOptions: Partial<{
    fuelSurchargePercentage: number;
    pickupCharge: number;
    deliveryCharge: number;
    packingCharge: number;
    handlingCharge: number;
    insuranceCharge: number;
    otherCharges: number;
    remoteAreaSurcharge: number;
    securitySurcharge: number;
    peakSeasonSurcharge: number;
    residentialDeliveryCharge: number;
    discountPercentage: number;
    discountAmount: number;
    advancePaid: number;
  }> = {}
): InvoiceTotals {
  // Calculate weights
  const weights = calculatePackageWeights(packages, serviceLevel);

  // Calculate total declared value
  const totalDeclaredValue = packages.reduce(
    (sum, pkg) => sum + (pkg.declaredValue ?? 0) * (pkg.quantity || 1),
    0
  );

  // Calculate charges
  const charges = calculateCharges(weights.chargeableWeight, ratePerKg, {
    ...chargeOptions,
    declaredValue: totalDeclaredValue,
  });

  // Calculate subtotal (sum of all charges minus discounts)
  const chargesTotal = INR(charges.baseFreightCharge)
    .add(charges.fuelSurcharge)
    .add(charges.remoteAreaSurcharge)
    .add(charges.securitySurcharge)
    .add(charges.peakSeasonSurcharge)
    .add(charges.residentialDeliveryCharge)
    .add(charges.pickupCharge)
    .add(charges.deliveryCharge)
    .add(charges.packingCharge)
    .add(charges.handlingCharge)
    .add(charges.insuranceCharge)
    .add(charges.otherCharges)
    .value;

  // Apply discounts
  const discountTotal = calculateDiscount(
    chargesTotal,
    charges.discountPercentage,
    charges.discountAmount
  );
  
  const subtotalAfterDiscount = INR(chargesTotal).subtract(discountTotal).value;

  // Calculate tax
  const tax = calculateGST(subtotalAfterDiscount, originState, destinationState);

  // Calculate grand total
  const grandTotal = INR(subtotalAfterDiscount).add(tax.totalTax).value;
  const advancePaid = chargeOptions.advancePaid ?? 0;
  const balanceDue = Math.max(0, INR(grandTotal).subtract(advancePaid).value);

  return {
    charges,
    tax,
    grandTotal,
    advancePaid,
    balanceDue,
  };
}

// =============================================================================
// FORMATTING UTILITIES
// =============================================================================

/**
 * Format currency for display (Indian format)
 */
export function formatCurrency(
  amount: number,
  currency: string = 'INR',
  showSymbol: boolean = true
): string {
  const formatted = new Intl.NumberFormat('en-IN', {
    style: showSymbol ? 'currency' : 'decimal',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return formatted;
}

/**
 * Format weight for display
 */
export function formatWeight(weight: number, unit: string = 'kg'): string {
  return `${weight.toFixed(2)} ${unit}`;
}

/**
 * Convert number to words (Indian system)
 */
export function numberToWords(num: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (num === 0) return 'Zero';
  if (num < 0) return 'Minus ' + numberToWords(Math.abs(num));

  let words = '';
  const crore = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const hundred = Math.floor((num % 1000) / 100);
  const remainder = Math.floor(num % 100);

  if (crore > 0) {
    words += numberToWords(crore) + ' Crore ';
  }
  if (lakh > 0) {
    words += numberToWords(lakh) + ' Lakh ';
  }
  if (thousand > 0) {
    words += numberToWords(thousand) + ' Thousand ';
  }
  if (hundred > 0) {
    words += ones[hundred] + ' Hundred ';
  }
  if (remainder > 0) {
    if (words) words += 'and ';
    if (remainder < 20) {
      words += ones[remainder];
    } else {
      words += tens[Math.floor(remainder / 10)];
      if (remainder % 10 > 0) {
        words += ' ' + ones[remainder % 10];
      }
    }
  }

  return words.trim();
}

/**
 * Format amount in words for invoice
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Reserved for multi-currency support
export function formatAmountInWords(amount: number, currency: string = 'INR'): string {
  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);

  let result = `Rupees ${numberToWords(rupees)}`;
  if (paise > 0) {
    result += ` and ${numberToWords(paise)} Paise`;
  }
  result += ' Only';

  return result;
}

// =============================================================================
// VALIDATION UTILITIES
// =============================================================================

/**
 * Validate GSTIN format
 */
export function validateGSTIN(gstin: string): { isValid: boolean; stateCode?: string; error?: string } {
  if (!gstin) return { isValid: false, error: 'GSTIN is required' };
  
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  if (!gstinRegex.test(gstin.toUpperCase())) {
    return { isValid: false, error: 'Invalid GSTIN format' };
  }

  const stateCode = gstin.substring(0, 2);
  const validStateCodes = Object.values(STATE_CODES);
  if (!validStateCodes.includes(stateCode)) {
    return { isValid: false, error: 'Invalid state code in GSTIN' };
  }

  return { isValid: true, stateCode };
}

/**
 * Validate HSN code format
 */
export function validateHSNCode(hsn: string): boolean {
  const hsnRegex = /^[0-9]{4,8}$/;
  return hsnRegex.test(hsn);
}

/**
 * Calculate due date based on payment terms
 */
export function calculateDueDate(invoiceDate: Date, paymentTermsDays: number = 14): Date {
  const dueDate = new Date(invoiceDate);
  dueDate.setDate(dueDate.getDate() + paymentTermsDays);
  return dueDate;
}

/**
 * Check if invoice is overdue
 */
export function isInvoiceOverdue(dueDate: string | Date, balanceDue: number): boolean {
  if (balanceDue <= 0) return false;
  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  return today > due;
}
