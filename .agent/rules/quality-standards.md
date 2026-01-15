# Quality Standards

This file defines the quality gates and standards for the `tac-cargo` project.

## Code Quality
- **Linting**: No eslint warnings or errors.
- **Types**: No `any`. Strict type checking is enabled.
- **Unused Code**: Remove unused variables, imports, and functions.

## Performance
- **Load Time**: Target sub-2s page load for all critical routes.
- **Bundle Size**: Import only what is needed (e.g., specific icons, not the whole library).
- **Images**: Use `next/image` for all images with proper sizing and formats.

## Accessibility (a11y)
- **Standard**: WCAG AA compliance is MANDATORY.
- **Keyboard Navigation**: All interactive elements must be focusable and usable via keyboard.
- **Screen Readers**: Provide proper `aria-labels` and `roles` where semantic HTML is insufficient.
- **Color Contrast**: Ensure sufficient contrast ratios for text and UI elements.

## Testing
- **Unit Tests**: Logic-heavy functions must have unit tests (Jest).
- **E2E Tests**: Critical user flows must be covered by E2E tests (Playwright).
