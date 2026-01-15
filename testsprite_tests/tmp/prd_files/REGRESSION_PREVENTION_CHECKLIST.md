# Regression Prevention Checklist
## TAC Cargo Design System

---

## Pre-Refactor Checklist

### Visual Documentation

- [ ] Screenshot all dashboard pages in **light mode**
  - [ ] Overview/Home
  - [ ] Invoices list
  - [ ] Invoice detail
  - [ ] Invoice create form
  - [ ] Shipments list
  - [ ] Shipment detail
  - [ ] Customers list
  - [ ] Settings
  - [ ] Analytics/Reports

- [ ] Screenshot all dashboard pages in **dark mode**
  - [ ] Same pages as above

- [ ] Screenshot all marketing/public pages
  - [ ] Landing page
  - [ ] About page
  - [ ] Tracking page
  - [ ] Login/Register

### Brand Assets

- [ ] Document current brand colors (hex values)
- [ ] Document logo usage and placement
- [ ] Note any brand-specific styling

### Component Inventory

- [ ] List all components using hardcoded colors
- [ ] Note custom animations/transitions
- [ ] Document any third-party component overrides

---

## During Refactor Checklist

### Per-Component Process

For each component being refactored:

1. **Before Changes**
   - [ ] Read the component thoroughly
   - [ ] Identify all hardcoded color classes
   - [ ] Note any special styling requirements

2. **Make Changes**
   - [ ] Replace hardcoded colors with tokens
   - [ ] Use semantic tokens, not just CSS variables
   - [ ] Preserve all functionality

3. **Verify Changes**
   - [ ] Test in light mode
   - [ ] Test in dark mode
   - [ ] Compare with pre-refactor screenshots
   - [ ] Check responsive behavior

4. **Document**
   - [ ] Note any edge cases
   - [ ] Update component comments if needed

### Token Compliance Rules

- [ ] **NO** `bg-{color}-{shade}` (e.g., `bg-blue-500`)
- [ ] **NO** `text-{color}-{shade}` (e.g., `text-gray-600`)
- [ ] **NO** `border-{color}-{shade}` (e.g., `border-gray-200`)
- [ ] **NO** arbitrary values (e.g., `bg-[#3b82f6]`)
- [ ] **NO** inline color styles
- [ ] **YES** semantic tokens only

### Allowed Token Classes

```
✅ bg-background, bg-card, bg-muted, bg-popover
✅ bg-primary, bg-secondary, bg-accent
✅ bg-destructive, bg-success, bg-warning, bg-info
✅ bg-primary/10, bg-success/10 (opacity variants)

✅ text-foreground, text-muted-foreground
✅ text-primary, text-destructive, text-success, text-warning, text-info
✅ text-primary-foreground (for text on colored backgrounds)

✅ border-border, border-input, border-ring
✅ border-primary, border-destructive, border-success, border-warning
```

---

## Post-Refactor Checklist

### Visual Verification

- [ ] Compare all pages with pre-refactor screenshots
- [ ] Verify light mode appearance
- [ ] Verify dark mode appearance
- [ ] Check theme toggle works smoothly
- [ ] No flickering on theme change

### Functional Verification

- [ ] All buttons clickable
- [ ] All forms submittable
- [ ] All modals/dialogs open correctly
- [ ] All dropdowns work
- [ ] Navigation works
- [ ] Data displays correctly

### Cross-Browser Testing

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### Accessibility

- [ ] Color contrast meets WCAG 2.1 AA
- [ ] Focus states visible
- [ ] No color-only information

### Performance

- [ ] No CSS bloat
- [ ] Theme toggle is instant
- [ ] No layout shifts

---

## PR Review Checklist

### Code Quality

- [ ] No hardcoded color classes
- [ ] Imports from `@/lib/design-system` where applicable
- [ ] Consistent token usage
- [ ] No duplicate styles

### Testing Evidence

- [ ] Screenshots attached (before/after)
- [ ] Light mode tested
- [ ] Dark mode tested
- [ ] Edge cases documented

### Documentation

- [ ] Component changes documented
- [ ] Any new tokens documented
- [ ] Breaking changes noted

---

## Automated Checks (Recommended)

### ESLint Rule

```javascript
// Detect hardcoded Tailwind color classes
{
  'no-restricted-syntax': [
    'warn',
    {
      selector: 'Literal[value=/\\b(bg|text|border)-(gray|blue|red|green|yellow|slate|zinc|neutral|amber|emerald|cyan|indigo|purple|pink|rose|orange|teal|lime|sky|violet|fuchsia)-\\d{2,3}\\b/]',
      message: 'Use semantic design tokens instead of hardcoded Tailwind colors. See docs/TOKEN_NAMING_CONVENTION.md'
    }
  ]
}
```

### Grep Script

```bash
# Find hardcoded colors in components
grep -rn "bg-\(gray\|blue\|red\|green\|yellow\|slate\)-[0-9]\{2,3\}" ./components ./app
grep -rn "text-\(gray\|blue\|red\|green\|yellow\|slate\)-[0-9]\{2,3\}" ./components ./app
grep -rn "border-\(gray\|blue\|red\|green\|yellow\|slate\)-[0-9]\{2,3\}" ./components ./app
```

### CI Pipeline Check

```yaml
# Add to CI workflow
- name: Check for hardcoded colors
  run: |
    if grep -rn "bg-\(gray\|blue\|red\)-[0-9]\{2,3\}" ./components ./app; then
      echo "❌ Found hardcoded colors. Please use design tokens."
      exit 1
    fi
    echo "✅ No hardcoded colors found"
```

---

## Emergency Rollback Plan

If visual regressions are detected:

1. **Identify** the specific commit causing issues
2. **Revert** the commit or PR
3. **Document** what went wrong
4. **Fix** the issue in a new branch
5. **Re-test** thoroughly before merging again

### Rollback Commands

```bash
# Revert last commit
git revert HEAD

# Revert specific commit
git revert <commit-hash>

# Reset to previous state (destructive)
git reset --hard <commit-hash>
```

---

## Sign-Off Requirements

Before marking the design system refactor as complete:

- [ ] **Engineering Lead** reviewed code changes
- [ ] **Design Lead** approved visual parity
- [ ] **QA** verified all pages/components
- [ ] **Product Owner** signed off on dark mode

---

## Maintenance Schedule

### Weekly

- [ ] Review any new components for token compliance
- [ ] Check for newly introduced hardcoded colors

### Monthly

- [ ] Run full visual regression test
- [ ] Review and update documentation
- [ ] Address any accumulated tech debt

### Quarterly

- [ ] Audit entire codebase for compliance
- [ ] Review token architecture for improvements
- [ ] Update dependencies (Tailwind, etc.)

---

*Last Updated: January 13, 2026*
