# TAC Cargo – Global Engineering Directives

This is an enterprise-grade logistics and freight management platform.

These instructions apply to the entire repository.

## Architecture
- Default to React Server Components (RSC-first).
- Client Components are allowed only for interaction, real-time updates, or browser APIs.
- All mutations must use Server Actions.
- API routes are allowed only when Server Actions are insufficient.

## Design System
- All UI must use semantic tokens.
- Hardcoded colors (hex, rgb, Tailwind palettes) are forbidden.
- OKLCH is the only allowed color space.
- Elevation must use elevation tokens only.
- Charts must use chart-* tokens exclusively.

## Data & State
- Initial data loading must occur on the server.
- Client fetching must use TanStack Query.
- No client state may duplicate server state.
- Cache invalidation must be explicit and minimal.

## Quality Gates
- WCAG AA accessibility is mandatory.
- Performance is a feature: sub-2s page load.
- Any violation of system rules blocks merge.

If a requirement cannot be expressed within the system,
the system must be extended — never bypassed.
