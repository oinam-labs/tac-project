# Dashboard Architecture Rules

These rules apply to all dashboard routes.

## Routing & Layout
- Routes must follow the documented route structure.
- Authentication is enforced via middleware.
- Layouts own navigation, headers, and auth checks.
- Pages must not duplicate layout responsibilities.

## Rendering
- Pages must support loading.tsx and error.tsx.
- Suspense boundaries are required for heavy data.
- Streaming is allowed only for data-heavy sections.

## UI Composition
- Use canonical dashboard components only.
- KPI values must never be colorized.
- Tables must use density tokens.
- Status must use state-* tokens (never primary).

## Behavior
- No client-side redirects on initial load.
- No duplicated auth logic.
- No inline styles except CSS variables.
