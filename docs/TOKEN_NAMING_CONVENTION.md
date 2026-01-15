# Token Naming Convention
## TAC Cargo Design System

---

## Overview

This document defines the naming convention for all design tokens in the TAC Cargo application. Following these conventions ensures consistency, predictability, and maintainability.

---

## Token Structure

```
[category]-[property]-[variant]-[state]
```

### Categories

| Category | Description | Example |
|----------|-------------|---------|
| `bg` | Background colors | `bg-card`, `bg-muted` |
| `text` | Text colors | `text-foreground`, `text-muted-foreground` |
| `border` | Border colors | `border-border`, `border-input` |
| `ring` | Focus ring colors | `ring-ring`, `ring-primary` |
| `shadow` | Shadow styles | `shadow-sm`, `shadow-lg` |

### Properties (Semantic)

| Property | Description | Usage |
|----------|-------------|-------|
| `background` | Page-level background | Main page surface |
| `foreground` | Primary text color | Headlines, body text |
| `card` | Card surface | Card backgrounds |
| `popover` | Elevated surface | Dropdowns, tooltips |
| `muted` | Subtle surface | Secondary backgrounds |
| `accent` | Highlight surface | Hover states |
| `primary` | Brand color | CTAs, links |
| `secondary` | Secondary brand | Less prominent actions |
| `destructive` | Error/danger | Delete, error states |
| `success` | Success state | Confirmations |
| `warning` | Warning state | Alerts |
| `info` | Information state | Notices |

### Variants

| Variant | Description | Example |
|---------|-------------|---------|
| `-foreground` | Text on colored bg | `primary-foreground` |
| `/10` - `/90` | Opacity modifiers | `bg-primary/10` |

### States

| State | Description | Example |
|-------|-------------|---------|
| `hover:` | Hover state | `hover:bg-accent` |
| `focus:` | Focus state | `focus:ring-ring` |
| `active:` | Active/pressed | `active:bg-primary/80` |
| `disabled:` | Disabled state | `disabled:opacity-50` |

---

## CSS Variable Naming

### Root Variables (globals.css)

```css
/* Pattern: --[property] */
--background: oklch(1.0 0 0);
--foreground: oklch(0.32 0 0);
--primary: oklch(0.62 0.19 260);

/* Pattern: --[property]-[variant] */
--primary-foreground: oklch(1.0 0 0);
--muted-foreground: oklch(0.55 0.02 264);

/* Pattern: --[category]-[number] */
--chart-1: oklch(0.62 0.19 260);
--chart-2: oklch(0.55 0.22 263);
```

### Tailwind Mapping (tailwind.config.ts)

```typescript
colors: {
  background: "var(--color-background)",
  foreground: "var(--color-foreground)",
  primary: "var(--color-primary)",
  "primary-foreground": "var(--color-primary-foreground)",
}
```

---

## Component Token Usage

### Surface Hierarchy

```
Level 0 (Page)     → bg-background
Level 1 (Card)     → bg-card
Level 2 (Nested)   → bg-muted
Level 3 (Elevated) → bg-popover
```

### Text Hierarchy

```
Primary     → text-foreground
Secondary   → text-muted-foreground
Tertiary    → text-muted-foreground/70
Disabled    → text-muted-foreground/50
```

### Border Usage

```
Default     → border-border
Subtle      → border-border/50
Input       → border-input
Focus       → border-ring / ring-ring
```

---

## Status Tokens

### Invoice Status

| Status | Background | Text | Border |
|--------|------------|------|--------|
| Draft | `bg-muted` | `text-muted-foreground` | `border-border` |
| Pending | `bg-warning/10` | `text-warning` | `border-warning/30` |
| Sent | `bg-info/10` | `text-info` | `border-info/30` |
| Paid | `bg-success/10` | `text-success` | `border-success/30` |
| Partial | `bg-warning/10` | `text-warning` | `border-warning/30` |
| Overdue | `bg-destructive/10` | `text-destructive` | `border-destructive/30` |
| Cancelled | `bg-muted` | `text-muted-foreground` | `border-border` |

### Shipment Status

| Status | Background | Text | Border |
|--------|------------|------|--------|
| Pending | `bg-muted` | `text-muted-foreground` | `border-border` |
| Picked Up | `bg-info/10` | `text-info` | `border-info/30` |
| In Transit | `bg-primary/10` | `text-primary` | `border-primary/30` |
| Out for Delivery | `bg-warning/10` | `text-warning` | `border-warning/30` |
| Delivered | `bg-success/10` | `text-success` | `border-success/30` |
| Cancelled | `bg-destructive/10` | `text-destructive` | `border-destructive/30` |

---

## Chart Tokens

### Color Palette

```typescript
chart-1  → Primary data series
chart-2  → Secondary data series
chart-3  → Tertiary data series
chart-4  → Quaternary data series
chart-5  → Quinary data series
```

### Semantic Chart Colors

```typescript
revenue    → chart-1
expense    → chart-2
profit     → success
loss       → destructive
growth     → success
decline    → destructive
pending    → warning
completed  → success
```

---

## Anti-Patterns (DO NOT USE)

### ❌ Hardcoded Colors

```tsx
// BAD
className="bg-blue-500 text-gray-900 border-gray-200"

// GOOD
className="bg-primary text-foreground border-border"
```

### ❌ Arbitrary Values

```tsx
// BAD
className="bg-[#3b82f6] text-[#111827]"

// GOOD
className="bg-primary text-foreground"
```

### ❌ Inline Styles for Colors

```tsx
// BAD
style={{ backgroundColor: '#3b82f6', color: 'white' }}

// GOOD
className="bg-primary text-primary-foreground"
```

### ❌ Raw Tailwind Palette

```tsx
// BAD
className="bg-slate-100 text-slate-900"

// GOOD
className="bg-muted text-foreground"
```

---

## Migration Guide

### From Hardcoded to Tokens

| Old (Hardcoded) | New (Token) |
|-----------------|-------------|
| `bg-white` | `bg-background` or `bg-card` |
| `bg-gray-50` | `bg-muted` |
| `bg-gray-100` | `bg-muted` |
| `bg-blue-500` | `bg-primary` |
| `bg-blue-600` | `bg-primary` |
| `bg-green-500` | `bg-success` |
| `bg-red-500` | `bg-destructive` |
| `bg-yellow-500` | `bg-warning` |
| `text-gray-900` | `text-foreground` |
| `text-gray-700` | `text-foreground` |
| `text-gray-600` | `text-muted-foreground` |
| `text-gray-500` | `text-muted-foreground` |
| `text-gray-400` | `text-muted-foreground/70` |
| `text-blue-600` | `text-primary` |
| `text-green-600` | `text-success` |
| `text-red-600` | `text-destructive` |
| `border-gray-200` | `border-border` |
| `border-gray-300` | `border-border` |

---

## Validation

### ESLint Rule (Recommended)

Consider adding an ESLint rule to catch hardcoded colors:

```javascript
// .eslintrc.js
rules: {
  'no-restricted-syntax': [
    'error',
    {
      selector: 'Literal[value=/bg-(gray|blue|red|green|yellow|slate|zinc|neutral)-\\d{2,3}/]',
      message: 'Use semantic tokens instead of hardcoded Tailwind colors',
    },
  ],
}
```

### PR Checklist

- [ ] No hardcoded color classes (bg-blue-500, text-gray-600, etc.)
- [ ] No arbitrary color values (bg-[#hex])
- [ ] No inline color styles
- [ ] Light/dark mode tested
- [ ] Tokens imported from `@/lib/design-system`

---

## Quick Reference Card

```
BACKGROUNDS
  Page:     bg-background
  Card:     bg-card
  Muted:    bg-muted
  Elevated: bg-popover
  Primary:  bg-primary
  
TEXT
  Primary:   text-foreground
  Secondary: text-muted-foreground
  On Color:  text-primary-foreground
  
BORDERS
  Default: border-border
  Input:   border-input
  Focus:   ring-ring
  
STATES
  Success: bg-success/10 text-success
  Warning: bg-warning/10 text-warning
  Error:   bg-destructive/10 text-destructive
  Info:    bg-info/10 text-info
```

---

*Last Updated: January 13, 2026*
