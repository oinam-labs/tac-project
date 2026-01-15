/**
 * TAC Cargo Design System
 * 
 * Centralized exports for all design system utilities.
 * Import from '@/lib/design-system' for all token and theming needs.
 */

// Token exports
export {
  surfaceTokens,
  textTokens,
  borderTokens,
  stateTokens,
  interactiveTokens,
  chartColors as tokenChartColors,
  chartColorArray,
  chartSemanticColors,
  invoiceStatusConfig,
  shipmentStatusConfig,
  getStatusClasses,
  getChartColor,
  combineTokens,
} from './tokens';

export type {
  SurfaceToken,
  TextToken,
  BorderToken,
  StateToken,
  ChartColor,
  InvoiceStatus,
  ShipmentStatus,
} from './tokens';

// Chart theme exports
export {
  chartColors,
  chartTheme,
  chartGradients,
  getChartColorArray,
  getChartColorByIndex,
  buildChartConfig,
  getChartMargin,
  chartAnimationConfig,
  responsiveContainerProps,
  ChartThemeAdapter,
  getCSSVariable,
  resolveChartColor,
} from './chart-theme';

export type { ChartConfig } from './chart-theme';
