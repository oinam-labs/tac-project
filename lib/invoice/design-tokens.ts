/**
 * Enterprise Invoice Design System Tokens
 * Professional B2B logistics design system based on industry standards
 * 
 * Reference: DHL, FedEx, UPS, Maersk design patterns
 * Compliance: WCAG 2.1 Level AA
 */

// =============================================================================
// COLOR PALETTE - Professional Logistics Theme
// =============================================================================

export const INVOICE_COLORS = {
  // Primary - Trust & Reliability (Blue)
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF', // Primary brand color
    900: '#1E3A8A',
    950: '#172554',
  },

  // Semantic Colors
  semantic: {
    success: {
      light: '#D1FAE5',
      DEFAULT: '#059669',
      dark: '#047857',
    },
    warning: {
      light: '#FEF3C7',
      DEFAULT: '#D97706',
      dark: '#B45309',
    },
    danger: {
      light: '#FEE2E2',
      DEFAULT: '#DC2626',
      dark: '#B91C1C',
    },
    info: {
      light: '#E0F2FE',
      DEFAULT: '#0284C7',
      dark: '#0369A1',
    },
  },

  // Neutral Palette
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
    950: '#030712',
  },

  // Accent - Call to Action (Orange)
  accent: {
    DEFAULT: '#EA580C',
    light: '#FB923C',
    dark: '#C2410C',
  },
} as const;

// =============================================================================
// TYPOGRAPHY SYSTEM
// =============================================================================

export const INVOICE_TYPOGRAPHY = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['IBM Plex Mono', 'Consolas', 'monospace'],
    serif: ['Merriweather', 'Georgia', 'serif'],
  },

  fontSize: {
    micro: ['0.625rem', { lineHeight: '0.875rem' }],    // 10px - disclaimers
    caption: ['0.75rem', { lineHeight: '1rem' }],       // 12px - labels, metadata
    small: ['0.875rem', { lineHeight: '1.25rem' }],     // 14px - secondary info
    base: ['1rem', { lineHeight: '1.5rem' }],           // 16px - default body
    large: ['1.125rem', { lineHeight: '1.75rem' }],     // 18px - important body
    h4: ['1.25rem', { lineHeight: '1.75rem' }],         // 20px - card titles
    h3: ['1.5rem', { lineHeight: '2rem' }],             // 24px - subsections
    h2: ['1.875rem', { lineHeight: '2.25rem' }],        // 30px - sections
    h1: ['2.25rem', { lineHeight: '2.5rem' }],          // 36px - page headers
    display: ['3rem', { lineHeight: '3.5rem' }],        // 48px - invoice titles
  },

  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

// =============================================================================
// SPACING SYSTEM
// =============================================================================

export const INVOICE_SPACING = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
} as const;

// =============================================================================
// LAYOUT CONSTANTS
// =============================================================================

export const INVOICE_LAYOUT = {
  maxContentWidth: '1400px',
  sidebarWidth: '280px',
  formMaxWidth: '800px',
  documentWidth: '210mm',  // A4
  documentHeight: '297mm', // A4
  cardBorderRadius: '8px',
  inputBorderRadius: '6px',
  buttonBorderRadius: '6px',
} as const;

// =============================================================================
// STATUS CONFIGURATION - Industry Standard Terminology
// =============================================================================

export type InvoiceStatusKey = 'draft' | 'pending' | 'paid' | 'partial' | 'overdue' | 'cancelled';

export interface StatusConfig {
  label: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  allowedTransitions: InvoiceStatusKey[];
}

export const INVOICE_STATUS_CONFIG: Record<InvoiceStatusKey, StatusConfig> = {
  draft: {
    label: 'Draft',
    description: 'Invoice is being prepared',
    color: INVOICE_COLORS.neutral[600],
    bgColor: INVOICE_COLORS.neutral[100],
    borderColor: INVOICE_COLORS.neutral[300],
    icon: 'FileEdit',
    allowedTransitions: ['pending', 'cancelled'],
  },
  pending: {
    label: 'Pending Payment',
    description: 'Awaiting customer payment',
    color: INVOICE_COLORS.semantic.warning.DEFAULT,
    bgColor: INVOICE_COLORS.semantic.warning.light,
    borderColor: INVOICE_COLORS.semantic.warning.DEFAULT,
    icon: 'Clock',
    allowedTransitions: ['paid', 'partial', 'overdue', 'cancelled'],
  },
  paid: {
    label: 'Paid',
    description: 'Payment received in full',
    color: INVOICE_COLORS.semantic.success.DEFAULT,
    bgColor: INVOICE_COLORS.semantic.success.light,
    borderColor: INVOICE_COLORS.semantic.success.DEFAULT,
    icon: 'CheckCircle',
    allowedTransitions: [],
  },
  partial: {
    label: 'Partially Paid',
    description: 'Partial payment received',
    color: INVOICE_COLORS.primary[600],
    bgColor: INVOICE_COLORS.primary[100],
    borderColor: INVOICE_COLORS.primary[600],
    icon: 'CircleDashed',
    allowedTransitions: ['paid', 'overdue'],
  },
  overdue: {
    label: 'Overdue',
    description: 'Payment past due date',
    color: INVOICE_COLORS.semantic.danger.DEFAULT,
    bgColor: INVOICE_COLORS.semantic.danger.light,
    borderColor: INVOICE_COLORS.semantic.danger.DEFAULT,
    icon: 'AlertTriangle',
    allowedTransitions: ['paid', 'partial', 'cancelled'],
  },
  cancelled: {
    label: 'Cancelled',
    description: 'Invoice has been voided',
    color: INVOICE_COLORS.neutral[500],
    bgColor: INVOICE_COLORS.neutral[100],
    borderColor: INVOICE_COLORS.neutral[300],
    icon: 'XCircle',
    allowedTransitions: [],
  },
} as const;

// =============================================================================
// SERVICE LEVELS - IATA Standard
// =============================================================================

export type ServiceLevel = 'express' | 'priority' | 'economy' | 'standard';

export interface ServiceLevelConfig {
  label: string;
  description: string;
  icon: string;
  color: string;
  estimatedDays: string;
  volumetricDivisor: number;
}

export const SERVICE_LEVEL_CONFIG: Record<ServiceLevel, ServiceLevelConfig> = {
  express: {
    label: 'Express',
    description: 'Next day delivery',
    icon: 'Zap',
    color: INVOICE_COLORS.semantic.danger.DEFAULT,
    estimatedDays: '1-2 days',
    volumetricDivisor: 5000,
  },
  priority: {
    label: 'Priority',
    description: 'Fast delivery',
    icon: 'Rocket',
    color: INVOICE_COLORS.accent.DEFAULT,
    estimatedDays: '2-3 days',
    volumetricDivisor: 5000,
  },
  economy: {
    label: 'Economy',
    description: 'Cost-effective delivery',
    icon: 'Truck',
    color: INVOICE_COLORS.primary[600],
    estimatedDays: '5-7 days',
    volumetricDivisor: 6000,
  },
  standard: {
    label: 'Standard',
    description: 'Regular delivery',
    icon: 'Package',
    color: INVOICE_COLORS.neutral[600],
    estimatedDays: '3-5 days',
    volumetricDivisor: 5000,
  },
} as const;

// =============================================================================
// PAYMENT MODES
// =============================================================================

export type PaymentMode = 'prepaid' | 'cod' | 'credit' | 'to_pay';

export interface PaymentModeConfig {
  label: string;
  description: string;
  icon: string;
}

export const PAYMENT_MODE_CONFIG: Record<PaymentMode, PaymentModeConfig> = {
  prepaid: {
    label: 'Prepaid',
    description: 'Payment collected at booking',
    icon: 'CreditCard',
  },
  cod: {
    label: 'Cash on Delivery',
    description: 'Payment collected at delivery',
    icon: 'Banknote',
  },
  credit: {
    label: 'Credit Account',
    description: 'Billed to customer account',
    icon: 'Wallet',
  },
  to_pay: {
    label: 'To Pay',
    description: 'Consignee pays at destination',
    icon: 'Receipt',
  },
} as const;

// =============================================================================
// INCOTERMS - International Commerce
// =============================================================================

export type Incoterm = 'EXW' | 'FCA' | 'CPT' | 'CIP' | 'DAP' | 'DPU' | 'DDP' | 'FAS' | 'FOB' | 'CFR' | 'CIF';

export const INCOTERMS: Record<Incoterm, string> = {
  EXW: 'Ex Works',
  FCA: 'Free Carrier',
  CPT: 'Carriage Paid To',
  CIP: 'Carriage and Insurance Paid To',
  DAP: 'Delivered at Place',
  DPU: 'Delivered at Place Unloaded',
  DDP: 'Delivered Duty Paid',
  FAS: 'Free Alongside Ship',
  FOB: 'Free on Board',
  CFR: 'Cost and Freight',
  CIF: 'Cost, Insurance and Freight',
} as const;

// =============================================================================
// TAX CONFIGURATION - GST India
// =============================================================================

export const TAX_CONFIG = {
  GST: {
    CGST_RATE: 9,
    SGST_RATE: 9,
    IGST_RATE: 18,
  },
  HSN_CODES: {
    FREIGHT_SERVICES: '996511',
    COURIER_SERVICES: '996812',
    PACKING_SERVICES: '998540',
    INSURANCE_SERVICES: '997135',
  },
} as const;

// =============================================================================
// PRINT STYLES
// =============================================================================

export const PRINT_STYLES = {
  pageMargin: '10mm',
  headerHeight: '30mm',
  footerHeight: '25mm',
  contentPadding: '8mm',
  tableRowHeight: '8mm',
  fontSize: {
    header: '14pt',
    subheader: '11pt',
    body: '9pt',
    small: '8pt',
    micro: '7pt',
  },
} as const;

// =============================================================================
// VALIDATION PATTERNS
// =============================================================================

export const VALIDATION_PATTERNS = {
  GSTIN: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
  PAN: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  PINCODE_INDIA: /^[1-9][0-9]{5}$/,
  AWB_NUMBER: /^[0-9]{11}$/,
  PHONE_INDIA: /^[6-9]\d{9}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  HSN_CODE: /^[0-9]{4,8}$/,
} as const;

// =============================================================================
// CURRENCY CONFIGURATION
// =============================================================================

export const CURRENCY_CONFIG = {
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    locale: 'en-IN',
    decimalPlaces: 2,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    locale: 'en-US',
    decimalPlaces: 2,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    locale: 'de-DE',
    decimalPlaces: 2,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    locale: 'en-GB',
    decimalPlaces: 2,
  },
} as const;

// =============================================================================
// COMPANY DEFAULTS
// =============================================================================

export const COMPANY_DEFAULTS = {
  name: 'TAPAN ASSOCIATE CARGO SERVICE',
  shortName: 'TAC Cargo',
  gstin: '07AAMFT6165B1Z3',
  pan: 'AAMFT6165B',
  address: {
    line1: '1498, Wazir Nagar',
    line2: 'Kotla Mubarakpur',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110003',
    country: 'India',
  },
  contact: {
    phone: '+91 9876543210',
    email: 'info@taccargo.com',
    website: 'www.taccargo.com',
  },
  bank: {
    name: 'AXIS BANK LTD',
    accountNo: '921020038475921',
    ifsc: 'UTIB0001293',
    branch: 'South Extension',
    accountType: 'Current',
  },
  termsAndConditions: [
    'Goods once accepted for carriage cannot be taken back.',
    'The consignee must declare the contents and value before booking.',
    'Any illegal/contraband items found will be the sole responsibility of the consignor.',
    'Liability for loss/damage is limited to ₹150 per kg unless insured.',
    'Fragile/Electronics items are carried at Owner\'s Risk unless specially insured.',
    'Consignments must be collected within 7 days of reaching destination.',
    'Godown charges of ₹55/day apply after 21 days from arrival.',
    'Unclaimed items will be disposed of after 100 days without further notice.',
    'All disputes are subject to Delhi Jurisdiction only.',
  ],
} as const;
