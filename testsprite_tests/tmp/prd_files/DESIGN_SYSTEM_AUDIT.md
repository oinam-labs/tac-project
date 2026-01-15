# Design System Audit Report
## TAC Cargo Dashboard Application

**Audit Date:** January 13, 2026  
**Auditor:** Cascade AI  
**Status:** Phase 1 Complete - Awaiting Approval

---

## Executive Summary

The TAC Cargo dashboard currently uses a **hybrid color system** with:
- ✅ A well-defined OKLCH token foundation in `globals.css`
- ❌ ~600+ instances of hardcoded Tailwind color classes
- ❌ 95+ files using gradient/glass effects inconsistently
- ❌ No unified chart theming

**Recommendation:** Freeze features, approve single visual direction, then refactor.

---

## Phase 1: Color Usage Audit

### 1.1 Token Foundation (GOOD)

The `globals.css` already defines semantic tokens using OKLCH:

| Token | Light Mode | Dark Mode | Purpose |
|-------|-----------|-----------|---------|
| `--background` | `oklch(1.0 0 0)` | `oklch(0.2046 0 0)` | Page background |
| `--foreground` | `oklch(0.3211 0 0)` | `oklch(0.9219 0 0)` | Primary text |
| `--card` | `oklch(1.0 0 0)` | `oklch(0.2686 0 0)` | Card surfaces |
| `--muted` | `oklch(0.9846 0.0017 247)` | `oklch(0.2393 0 0)` | Subtle backgrounds |
| `--primary` | `oklch(0.6231 0.188 259.8)` | Same | Brand color |
| `--destructive` | `oklch(0.6368 0.2078 25.3)` | Same | Error states |
| `--success` | `oklch(0.623 0.188 145.4)` | `oklch(0.723 ...)` | Success states |
| `--warning` | `oklch(0.769 0.188 70.08)` | Same | Warning states |
| `--border` | `oklch(0.9276 0.0058 264.5)` | `oklch(0.3715 0 0)` | Borders |

### 1.2 Hardcoded Color Classes (BAD)

**Files with highest violations:**

| File | Hardcoded Colors | Priority |
|------|------------------|----------|
| `invoice-document.tsx` | 91 | 🔴 Critical |
| `invoice-form-wizard.tsx` | 75 | 🔴 Critical |
| `invoice-creation-form.tsx` | 64 | 🔴 Critical |
| `awb-label.tsx` | 61 | 🔴 Critical |
| `invoice-print.tsx` | 53 | 🟠 High |
| `page.tsx` (multiple) | 35 | 🟠 High |
| `pricing-widget.tsx` | 27 | 🟠 High |
| `invoice-print-view.tsx` | 23 | 🟡 Medium |
| `address-card.tsx` | 21 | 🟡 Medium |
| `inventory-table.tsx` | 20 | 🟡 Medium |

**Common violations:**
```
bg-blue-500, bg-blue-600, bg-blue-50
text-gray-500, text-gray-600, text-gray-700, text-gray-900
border-gray-200, border-gray-300
bg-green-500, text-green-600
bg-red-500, text-red-600
bg-amber-500, text-amber-600
bg-neutral-50, bg-neutral-100
```

### 1.3 Gradient & Glass Effects (INCONSISTENT)

**Files using gradients/glass:**

| Category | Count | Files |
|----------|-------|-------|
| Glassmorphism | 20 | `glassmorphism-card.tsx` |
| Hero gradients | 14 | `hero-section.tsx` |
| Overview cards | 18 | `overview-cards.tsx` |
| KPI grids | 12 | `kpi-grid.tsx` |
| Chart gradients | 8 | Multiple chart files |
| Customer pages | 12 | `customers-client.tsx` |
| Mission control | 11 | `mission-control.tsx` |

**Problem:** Gradients use hardcoded hex values, not tokens.

---

## Phase 1: Component Surface Mapping

### 2.1 Surface Hierarchy

| Surface Level | Semantic Token | Current Usage |
|---------------|----------------|---------------|
| Level 0 (Page) | `bg-background` | ✅ Correct |
| Level 1 (Card) | `bg-card` | ❌ Mixed with `bg-white` |
| Level 2 (Nested) | `bg-muted` | ❌ Mixed with `bg-gray-50` |
| Level 3 (Interactive) | `bg-accent` | ❌ Rarely used |

### 2.2 Component → Surface Mapping

| Component Type | Expected Surface | Actual |
|----------------|------------------|--------|
| Page container | `bg-background` | ✅ |
| Cards | `bg-card` | ❌ `bg-white` |
| Table headers | `bg-muted` | ❌ `bg-gray-50` |
| Table rows hover | `hover:bg-muted` | ❌ `hover:bg-gray-50` |
| Inputs | `bg-background` | ✅ |
| Dropdowns | `bg-popover` | ✅ |
| Sidebars | `bg-sidebar` | ✅ |
| Status badges | Semantic colors | ❌ Hardcoded |

### 2.3 Text Hierarchy

| Role | Semantic Token | Current Usage |
|------|----------------|---------------|
| Primary text | `text-foreground` | ❌ `text-gray-900` |
| Secondary text | `text-muted-foreground` | ❌ `text-gray-500/600` |
| Disabled text | `text-muted-foreground/50` | ❌ `text-gray-400` |
| Link text | `text-primary` | ❌ `text-blue-600` |
| Error text | `text-destructive` | ❌ `text-red-600` |
| Success text | `text-success` | ❌ `text-green-600` |

---

## Phase 1: Chart Theming Audit

### 3.1 Current Chart Colors

Charts are using a mix of:
- CSS variables: `--chart-1` through `--chart-5`
- Hardcoded: `#3b82f6`, `#10b981`, `#f59e0b`, etc.
- Library defaults from Recharts

### 3.2 Chart Files Requiring Updates

| File | Chart Library | Issue |
|------|---------------|-------|
| `revenue-summary-chart.tsx` | Recharts | Hardcoded colors |
| `customer-analytics.tsx` | Recharts | Hardcoded colors |
| `performance-chart.tsx` | Recharts | Hardcoded gradients |
| `shipment-trends-chart.tsx` | Recharts | Hardcoded colors |
| `fleet-activity-chart.tsx` | Recharts | Hardcoded colors |
| `area-chart-gradient.tsx` | Recharts | Hardcoded gradients |

### 3.3 Recommended Chart Palette

```typescript
// Using semantic tokens
const chartColors = {
  primary: 'hsl(var(--chart-1))',
  secondary: 'hsl(var(--chart-2))',
  tertiary: 'hsl(var(--chart-3))',
  quaternary: 'hsl(var(--chart-4))',
  quinary: 'hsl(var(--chart-5))',
};
```

---

## Phase 2: Proposed Token Architecture

### 4.1 Semantic Token Categories

```css
/* Surface Tokens */
--surface-page: var(--background)
--surface-card: var(--card)
--surface-elevated: var(--popover)
--surface-muted: var(--muted)
--surface-inverse: var(--foreground)

/* Text Tokens */
--text-primary: var(--foreground)
--text-secondary: var(--muted-foreground)
--text-tertiary: color-mix(in oklch, var(--muted-foreground) 70%, transparent)
--text-inverse: var(--background)
--text-brand: var(--primary)

/* Border Tokens */
--border-default: var(--border)
--border-muted: color-mix(in oklch, var(--border) 50%, transparent)
--border-focus: var(--ring)

/* State Tokens */
--state-success: var(--success)
--state-warning: var(--warning)
--state-error: var(--destructive)
--state-info: var(--info)

/* Interactive Tokens */
--interactive-default: var(--primary)
--interactive-hover: color-mix(in oklch, var(--primary) 90%, black)
--interactive-active: color-mix(in oklch, var(--primary) 80%, black)
--interactive-disabled: var(--muted)
```

### 4.2 Token Naming Convention

```
[category]-[property]-[variant]-[state]

Examples:
- bg-surface-card
- text-primary
- border-default
- state-success
- interactive-hover
```

---

## Phase 3: Refactoring Priority

### 5.1 Critical Path (Week 1)

1. **Invoice components** (highest visibility)
   - `invoice-document.tsx`
   - `invoice-form-wizard.tsx`
   - `invoice-print.tsx`
   - `awb-label.tsx`

2. **Dashboard overview**
   - `overview-cards.tsx`
   - `section-cards.tsx`
   - `kpi-grid.tsx`

### 5.2 High Priority (Week 2)

1. **List/Table components**
   - `inventory-table.tsx`
   - `shipments-table-client.tsx`
   - All `*-client.tsx` files

2. **Form components**
   - `invoice-creation-form.tsx`
   - `address-card.tsx`

### 5.3 Medium Priority (Week 3)

1. **Charts**
   - Create unified chart theme adapter
   - Update all chart components

2. **Marketing pages**
   - `hero-section.tsx`
   - Landing page components

---

## Phase 4: Chart Theme Adapter Spec

### 6.1 Adapter Interface

```typescript
// lib/charts/theme-adapter.ts
export const chartTheme = {
  colors: {
    primary: 'var(--chart-1)',
    secondary: 'var(--chart-2)',
    tertiary: 'var(--chart-3)',
    quaternary: 'var(--chart-4)',
    quinary: 'var(--chart-5)',
  },
  grid: {
    stroke: 'var(--border)',
    strokeDasharray: '3 3',
  },
  axis: {
    stroke: 'var(--muted-foreground)',
    fontSize: 12,
    fontFamily: 'var(--font-sans)',
  },
  tooltip: {
    background: 'var(--popover)',
    border: 'var(--border)',
    text: 'var(--popover-foreground)',
  },
};
```

---

## Regression Prevention Checklist

### Pre-Refactor
- [ ] Screenshot all pages in light mode
- [ ] Screenshot all pages in dark mode
- [ ] Document current brand colors
- [ ] List all custom animations

### During Refactor
- [ ] One component at a time
- [ ] Test light/dark toggle after each change
- [ ] No new hardcoded colors
- [ ] PR review for token compliance

### Post-Refactor
- [ ] Visual comparison with pre-refactor screenshots
- [ ] Automated color audit script
- [ ] Design token documentation
- [ ] Component storybook (optional)

---

## Deliverables Checklist

- [x] Color usage audit
- [x] Surface mapping
- [x] Chart theming audit
- [ ] **PENDING: User approval of visual direction**
- [ ] Tailwind config rewrite
- [ ] Token naming convention document
- [ ] Chart theming spec implementation
- [ ] Component refactoring
- [ ] Design system documentation

---

## Next Steps

**ACTION REQUIRED:** Please review this audit and approve:

1. ✅ Freeze feature development
2. 🔲 Approve the semantic token architecture (Section 4)
3. 🔲 Approve the token naming convention (Section 4.2)
4. 🔲 Approve the refactoring priority (Section 5)
5. 🔲 Approve the chart theme adapter spec (Section 6)

Once approved, I will proceed with:
1. Tailwind config rewrite with extended tokens
2. Component-by-component refactoring
3. Chart theme adapter implementation
4. Final documentation

---

*This audit follows the principle: "Make the UI boring, predictable, and scalable. Visual polish comes after correctness."*
