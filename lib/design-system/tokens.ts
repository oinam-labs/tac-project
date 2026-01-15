/**
 * TAC Cargo Design System Tokens
 * 
 * This file defines the semantic design tokens used throughout the application.
 * All components should reference these tokens instead of raw color values.
 * 
 * @see docs/DESIGN_SYSTEM_AUDIT.md for the full audit report
 */

// =============================================================================
// SEMANTIC COLOR TOKENS
// =============================================================================

/**
 * Surface tokens for backgrounds
 * Use these for component backgrounds based on elevation
 */
export const surfaceTokens = {
  page: 'bg-background',
  card: 'bg-card',
  elevated: 'bg-popover',
  muted: 'bg-muted',
  inverse: 'bg-foreground',
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  accent: 'bg-accent',
} as const;

/**
 * Text color tokens
 * Use these for all text elements
 */
export const textTokens = {
  primary: 'text-foreground',
  secondary: 'text-muted-foreground',
  muted: 'text-muted-foreground/70',
  disabled: 'text-muted-foreground/50',
  inverse: 'text-background',
  brand: 'text-primary',
  onPrimary: 'text-primary-foreground',
  onDestructive: 'text-destructive-foreground',
} as const;

/**
 * Border tokens
 * Use these for all border colors
 */
export const borderTokens = {
  default: 'border-border',
  muted: 'border-border/50',
  focus: 'border-ring',
  input: 'border-input',
  primary: 'border-primary',
  destructive: 'border-destructive',
  success: 'border-success',
  warning: 'border-warning',
} as const;

/**
 * State tokens for status indicators
 * Use these for badges, alerts, and status displays
 */
export const stateTokens = {
  success: {
    bg: 'bg-success',
    bgMuted: 'bg-success/10',
    text: 'text-success',
    border: 'border-success',
  },
  warning: {
    bg: 'bg-warning',
    bgMuted: 'bg-warning/10',
    text: 'text-warning',
    border: 'border-warning',
  },
  error: {
    bg: 'bg-destructive',
    bgMuted: 'bg-destructive/10',
    text: 'text-destructive',
    border: 'border-destructive',
  },
  info: {
    bg: 'bg-info',
    bgMuted: 'bg-info/10',
    text: 'text-info',
    border: 'border-info',
  },
  neutral: {
    bg: 'bg-muted',
    bgMuted: 'bg-muted/50',
    text: 'text-muted-foreground',
    border: 'border-border',
  },
} as const;

/**
 * Interactive state tokens
 * Use these for buttons, links, and interactive elements
 */
export const interactiveTokens = {
  default: 'bg-primary text-primary-foreground',
  hover: 'hover:bg-primary/90',
  active: 'active:bg-primary/80',
  disabled: 'disabled:bg-muted disabled:text-muted-foreground',
  ghost: 'bg-transparent hover:bg-accent hover:text-accent-foreground',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
} as const;

// =============================================================================
// CHART THEME TOKENS
// =============================================================================

/**
 * Chart color palette using CSS variables
 * These integrate with the globals.css chart tokens
 */
export const chartColors = {
  primary: 'var(--chart-1)',
  secondary: 'var(--chart-2)',
  tertiary: 'var(--chart-3)',
  quaternary: 'var(--chart-4)',
  quinary: 'var(--chart-5)',
} as const;

/**
 * Chart color array for iterating
 */
export const chartColorArray = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
] as const;

/**
 * Semantic chart colors for specific data types
 */
export const chartSemanticColors = {
  revenue: 'var(--chart-1)',
  expense: 'var(--chart-2)',
  profit: 'var(--success)',
  loss: 'var(--destructive)',
  growth: 'var(--success)',
  decline: 'var(--destructive)',
  pending: 'var(--warning)',
  completed: 'var(--success)',
} as const;

// =============================================================================
// STATUS CONFIGURATION
// =============================================================================

/**
 * Invoice status configuration
 * Maps status keys to visual tokens
 */
export const invoiceStatusConfig = {
  draft: {
    label: 'Draft',
    bg: 'bg-muted',
    text: 'text-muted-foreground',
    border: 'border-border',
    dot: 'bg-muted-foreground',
  },
  pending: {
    label: 'Pending',
    bg: 'bg-warning/10',
    text: 'text-warning',
    border: 'border-warning/30',
    dot: 'bg-warning',
  },
  sent: {
    label: 'Sent',
    bg: 'bg-info/10',
    text: 'text-info',
    border: 'border-info/30',
    dot: 'bg-info',
  },
  paid: {
    label: 'Paid',
    bg: 'bg-success/10',
    text: 'text-success',
    border: 'border-success/30',
    dot: 'bg-success',
  },
  partial: {
    label: 'Partial',
    bg: 'bg-warning/10',
    text: 'text-warning',
    border: 'border-warning/30',
    dot: 'bg-warning',
  },
  overdue: {
    label: 'Overdue',
    bg: 'bg-destructive/10',
    text: 'text-destructive',
    border: 'border-destructive/30',
    dot: 'bg-destructive',
  },
  cancelled: {
    label: 'Cancelled',
    bg: 'bg-muted',
    text: 'text-muted-foreground',
    border: 'border-border',
    dot: 'bg-muted-foreground',
  },
} as const;

/**
 * Shipment status configuration
 */
export const shipmentStatusConfig = {
  pending: {
    label: 'Pending',
    bg: 'bg-muted',
    text: 'text-muted-foreground',
    border: 'border-border',
  },
  picked_up: {
    label: 'Picked Up',
    bg: 'bg-info/10',
    text: 'text-info',
    border: 'border-info/30',
  },
  in_transit: {
    label: 'In Transit',
    bg: 'bg-primary/10',
    text: 'text-primary',
    border: 'border-primary/30',
  },
  out_for_delivery: {
    label: 'Out for Delivery',
    bg: 'bg-warning/10',
    text: 'text-warning',
    border: 'border-warning/30',
  },
  delivered: {
    label: 'Delivered',
    bg: 'bg-success/10',
    text: 'text-success',
    border: 'border-success/30',
  },
  cancelled: {
    label: 'Cancelled',
    bg: 'bg-destructive/10',
    text: 'text-destructive',
    border: 'border-destructive/30',
  },
} as const;

// =============================================================================
// UTILITY TYPES
// =============================================================================

export type SurfaceToken = keyof typeof surfaceTokens;
export type TextToken = keyof typeof textTokens;
export type BorderToken = keyof typeof borderTokens;
export type StateToken = keyof typeof stateTokens;
export type ChartColor = keyof typeof chartColors;
export type InvoiceStatus = keyof typeof invoiceStatusConfig;
export type ShipmentStatus = keyof typeof shipmentStatusConfig;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get status styling classes for a given status
 */
export function getStatusClasses(
  status: InvoiceStatus | ShipmentStatus,
  type: 'invoice' | 'shipment' = 'invoice'
): { bg: string; text: string; border: string } {
  const config = type === 'invoice' 
    ? invoiceStatusConfig[status as InvoiceStatus]
    : shipmentStatusConfig[status as ShipmentStatus];
  
  return {
    bg: config?.bg || 'bg-muted',
    text: config?.text || 'text-muted-foreground',
    border: config?.border || 'border-border',
  };
}

/**
 * Get chart color by index (cycles through palette)
 */
export function getChartColor(index: number): string {
  return chartColorArray[index % chartColorArray.length];
}

/**
 * Combine multiple token classes
 */
export function combineTokens(...tokens: (string | undefined | null | false)[]): string {
  return tokens.filter(Boolean).join(' ');
}
