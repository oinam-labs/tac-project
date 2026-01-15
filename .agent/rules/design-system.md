# Design System

This file defines the design system rules for the `tac-cargo` project to ensure consistency and maintainability.

## Styling Rules
- **Semantic Tokens**: ALWAYS use semantic tokens (e.g., `bg-primary`, `text-muted-foreground`) instead of raw values.
- **Colors**:
    - **NO** hardcoded hex or RGB values in components.
    - **OKLCH** is the only allowed color space for defining new colors in CSS.
- **Tailwind**: Use utility classes for layout and spacing. Avoid `@apply` in CSS modules unless creating reusable primitives.

## Component Library
- **Radix UI**: Use Radix UI primitives for accessible interactive components.
- **Lucide React**: Use Lucide icons for all iconography.
- **Charts**: Use `recharts` with `chart-*` tokens.

## Theme
- Support **Dark Mode** and **Light Mode**.
- Ensure all components respond correctly to theme switching using CSS variables.
