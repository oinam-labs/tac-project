# Component Authoring Rules

These rules apply to all reusable components.

## Component Design
- Components must be reusable and composable.
- Prefer stateless components.
- Business logic must live outside UI components.

## Styling
- Semantic tokens only.
- No hex, rgb, hsl, or Tailwind color scales.
- Elevation via elevation tokens only.
- Motion via duration + easing tokens only.

## Composition
- Build on shadcn-compatible primitives.
- No component-specific color logic.
- Variants must map to semantic intent.

## Accessibility
- Keyboard navigation is mandatory.
- Focus-visible styles are required.
- ARIA labels required where applicable.
