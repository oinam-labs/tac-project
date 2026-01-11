import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "28px",
      },
      screens: {
        lg: "1100px",
        xl: "1240px",
      },
    },
    extend: {
      // OKLCH Design System Colors - Semantic Tokens
      colors: {
        // Base semantic colors (mapped from CSS variables)
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        card: "var(--color-card)",
        "card-foreground": "var(--color-card-foreground)",
        popover: "var(--color-popover)",
        "popover-foreground": "var(--color-popover-foreground)",
        primary: "var(--color-primary)",
        "primary-foreground": "var(--color-primary-foreground)",
        secondary: "var(--color-secondary)",
        "secondary-foreground": "var(--color-secondary-foreground)",
        muted: "var(--color-muted)",
        "muted-foreground": "var(--color-muted-foreground)",
        accent: "var(--color-accent)",
        "accent-foreground": "var(--color-accent-foreground)",
        destructive: "var(--color-destructive)",
        "destructive-foreground": "var(--color-destructive-foreground)",
        success: "var(--color-success)",
        "success-foreground": "var(--color-success-foreground)",
        warning: "var(--color-warning)",
        "warning-foreground": "var(--color-warning-foreground)",
        info: "var(--color-info)",
        "info-foreground": "var(--color-info-foreground)",
        border: "var(--color-border)",
        input: "var(--color-input)",
        ring: "var(--color-ring)",
        
        // Chart colors
        "chart-1": "var(--color-chart-1)",
        "chart-2": "var(--color-chart-2)",
        "chart-3": "var(--color-chart-3)",
        "chart-4": "var(--color-chart-4)",
        "chart-5": "var(--color-chart-5)",
        
        // Sidebar colors
        sidebar: "var(--color-sidebar)",
        "sidebar-foreground": "var(--color-sidebar-foreground)",
        "sidebar-primary": "var(--color-sidebar-primary)",
        "sidebar-primary-foreground": "var(--color-sidebar-primary-foreground)",
        "sidebar-accent": "var(--color-sidebar-accent)",
        "sidebar-accent-foreground": "var(--color-sidebar-accent-foreground)",
        "sidebar-border": "var(--color-sidebar-border)",
        "sidebar-ring": "var(--color-sidebar-ring)",
      },
      
      // Elevation System (Enterprise-grade shadows)
      boxShadow: {
        "elevation-1": "var(--shadow-xs)",
        "elevation-2": "var(--shadow-sm)",
        "elevation-3": "var(--shadow-md)",
        "elevation-4": "var(--shadow-lg)",
        "elevation-5": "var(--shadow-xl)",
        "elevation-6": "var(--shadow-2xl)",
      },
      
      // Semantic Border Radius
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      
      // Typography System
      fontFamily: {
        sans: "var(--font-sans)",
        serif: "var(--font-serif)",
        mono: "var(--font-mono)",
      },
      
      // Layout System
      maxWidth: {
        "form": "var(--max-width-form)",
        "form-min": "var(--max-width-form-min)",
        "summary": "var(--max-width-summary)",
      },
      
      // Semantic Spacing System
      spacing: {
        "section": "var(--spacing-section)",
        "group": "var(--spacing-group)",
        "field": "var(--spacing-field)",
      },
      
      // Grid System
      gridTemplateColumns: {
        "12": "repeat(12, minmax(0, 1fr))",
      },
      
      // Semantic Gaps
      gap: {
        "x": "var(--spacing-group)",
        "y": "var(--spacing-section)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
export default config;
