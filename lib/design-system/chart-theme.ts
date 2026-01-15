/**
 * TAC Cargo Unified Chart Theme Adapter
 * 
 * This adapter provides consistent theming for all charts in the application.
 * It integrates with the design system tokens and supports light/dark modes.
 * 
 * Usage:
 * ```tsx
 * import { chartTheme, getChartColors } from '@/lib/design-system/chart-theme';
 * 
 * <AreaChart>
 *   <Area fill={getChartColors().primary} />
 *   <XAxis {...chartTheme.axis} />
 *   <CartesianGrid {...chartTheme.grid} />
 *   <Tooltip {...chartTheme.tooltip} />
 * </AreaChart>
 * ```
 */

// =============================================================================
// CSS VARIABLE HELPERS
// =============================================================================

/**
 * Get computed CSS variable value
 * Falls back to provided default if variable not found
 */
export function getCSSVariable(name: string, fallback: string = ''): string {
  if (typeof window === 'undefined') return fallback;
  
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  
  return value || fallback;
}

/**
 * Convert OKLCH CSS variable to a usable color string
 */
export function resolveChartColor(cssVar: string): string {
  return `oklch(${getCSSVariable(cssVar)})`;
}

// =============================================================================
// CHART COLOR PALETTE
// =============================================================================

/**
 * Chart colors using CSS variables
 * These automatically adapt to light/dark mode
 */
export const chartColors = {
  // Primary palette (5 colors for data series)
  primary: 'var(--chart-1)',
  secondary: 'var(--chart-2)',
  tertiary: 'var(--chart-3)',
  quaternary: 'var(--chart-4)',
  quinary: 'var(--chart-5)',
  
  // Semantic colors for specific meanings
  success: 'var(--success)',
  warning: 'var(--warning)',
  error: 'var(--destructive)',
  info: 'var(--info)',
  
  // UI colors
  grid: 'var(--border)',
  axis: 'var(--muted-foreground)',
  text: 'var(--foreground)',
  textMuted: 'var(--muted-foreground)',
  background: 'var(--background)',
  card: 'var(--card)',
  tooltip: 'var(--popover)',
  tooltipBorder: 'var(--border)',
} as const;

/**
 * Get chart colors as an array for iterating over data series
 */
export function getChartColorArray(): string[] {
  return [
    chartColors.primary,
    chartColors.secondary,
    chartColors.tertiary,
    chartColors.quaternary,
    chartColors.quinary,
  ];
}

/**
 * Get a chart color by index (cycles through palette)
 */
export function getChartColorByIndex(index: number): string {
  const colors = getChartColorArray();
  return colors[index % colors.length];
}

// =============================================================================
// RECHARTS THEME CONFIGURATION
// =============================================================================

/**
 * Unified theme configuration for Recharts components
 */
export const chartTheme = {
  /**
   * CartesianGrid styling
   */
  grid: {
    stroke: 'hsl(var(--border))',
    strokeDasharray: '3 3',
    strokeOpacity: 0.5,
    vertical: false,
  },
  
  /**
   * XAxis styling
   */
  xAxis: {
    stroke: 'hsl(var(--border))',
    tick: {
      fill: 'hsl(var(--muted-foreground))',
      fontSize: 12,
    },
    tickLine: false,
    axisLine: {
      stroke: 'hsl(var(--border))',
    },
  },
  
  /**
   * YAxis styling
   */
  yAxis: {
    stroke: 'hsl(var(--border))',
    tick: {
      fill: 'hsl(var(--muted-foreground))',
      fontSize: 12,
    },
    tickLine: false,
    axisLine: false,
    width: 60,
  },
  
  /**
   * Tooltip styling
   */
  tooltip: {
    contentStyle: {
      backgroundColor: 'hsl(var(--popover))',
      border: '1px solid hsl(var(--border))',
      borderRadius: '6px',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      padding: '8px 12px',
    },
    labelStyle: {
      color: 'hsl(var(--foreground))',
      fontWeight: 600,
      marginBottom: '4px',
    },
    itemStyle: {
      color: 'hsl(var(--muted-foreground))',
      fontSize: '12px',
      padding: '2px 0',
    },
    cursor: {
      stroke: 'hsl(var(--muted-foreground))',
      strokeDasharray: '4 4',
    },
  },
  
  /**
   * Legend styling
   */
  legend: {
    wrapperStyle: {
      paddingTop: '20px',
    },
    iconType: 'circle' as const,
    iconSize: 8,
  },
  
  /**
   * Area chart specific styling
   */
  area: {
    strokeWidth: 2,
    fillOpacity: 0.1,
    activeDot: {
      r: 6,
      strokeWidth: 2,
      stroke: 'hsl(var(--background))',
    },
  },
  
  /**
   * Line chart specific styling
   */
  line: {
    strokeWidth: 2,
    dot: false,
    activeDot: {
      r: 6,
      strokeWidth: 2,
      stroke: 'hsl(var(--background))',
    },
  },
  
  /**
   * Bar chart specific styling
   */
  bar: {
    radius: [4, 4, 0, 0] as [number, number, number, number],
    barSize: 24,
  },
  
  /**
   * Pie chart specific styling
   */
  pie: {
    innerRadius: '60%',
    outerRadius: '80%',
    paddingAngle: 2,
    strokeWidth: 2,
    stroke: 'hsl(var(--background))',
  },
} as const;

// =============================================================================
// GRADIENT DEFINITIONS
// =============================================================================

/**
 * Gradient definitions for area charts
 * Use with <defs> in your chart SVG
 */
export const chartGradients = {
  /**
   * Generate a vertical gradient definition for area charts
   */
  areaGradient: (id: string, color: string) => ({
    id,
    x1: '0',
    y1: '0',
    x2: '0',
    y2: '1',
    stops: [
      { offset: '0%', stopColor: color, stopOpacity: 0.3 },
      { offset: '100%', stopColor: color, stopOpacity: 0 },
    ],
  }),
  
  /**
   * Generate a horizontal gradient for bars
   */
  barGradient: (id: string, colorStart: string, colorEnd: string) => ({
    id,
    x1: '0',
    y1: '0',
    x2: '1',
    y2: '0',
    stops: [
      { offset: '0%', stopColor: colorStart, stopOpacity: 1 },
      { offset: '100%', stopColor: colorEnd, stopOpacity: 1 },
    ],
  }),
};

// =============================================================================
// CHART CONFIG BUILDER
// =============================================================================

export interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
    icon?: React.ComponentType;
  };
}

/**
 * Build a chart config object for shadcn/ui chart components
 */
export function buildChartConfig(
  items: Array<{ key: string; label: string; colorIndex?: number; color?: string }>
): ChartConfig {
  const config: ChartConfig = {};
  
  items.forEach((item, index) => {
    config[item.key] = {
      label: item.label,
      color: item.color || getChartColorByIndex(item.colorIndex ?? index),
    };
  });
  
  return config;
}

// =============================================================================
// RESPONSIVE CHART HELPERS
// =============================================================================

/**
 * Default responsive container props
 */
export const responsiveContainerProps = {
  width: '100%',
  height: '100%',
  minHeight: 300,
} as const;

/**
 * Get chart margin based on container size
 */
export function getChartMargin(size: 'sm' | 'md' | 'lg' = 'md') {
  const margins = {
    sm: { top: 10, right: 10, left: 0, bottom: 0 },
    md: { top: 20, right: 20, left: 0, bottom: 0 },
    lg: { top: 30, right: 30, left: 10, bottom: 10 },
  };
  return margins[size];
}

// =============================================================================
// ANIMATION CONFIG
// =============================================================================

/**
 * Default animation settings for charts
 */
export const chartAnimationConfig = {
  duration: 300,
  easing: 'ease-out',
} as const;

// =============================================================================
// EXPORT CONVENIENCE OBJECT
// =============================================================================

/**
 * All chart theming utilities in one object
 */
export const ChartThemeAdapter = {
  colors: chartColors,
  theme: chartTheme,
  gradients: chartGradients,
  getColorArray: getChartColorArray,
  getColorByIndex: getChartColorByIndex,
  buildConfig: buildChartConfig,
  getMargin: getChartMargin,
  animation: chartAnimationConfig,
  responsive: responsiveContainerProps,
} as const;

export default ChartThemeAdapter;
