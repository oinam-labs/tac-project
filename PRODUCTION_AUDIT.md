# TAC Cargo - Full Suite Production Audit

**Audit Date**: 2026-01-15
**Requested By**: Development Team
**Scope**: Complete codebase review for production readiness

## Audit Objectives

This PR triggers a comprehensive CodeRabbit review of the entire TAC Cargo codebase to identify:

1. **Security vulnerabilities** - Authentication, authorization, input validation, XSS, CSRF
2. **Performance issues** - N+1 queries, unnecessary re-renders, bundle size
3. **Code quality** - Type safety, error handling, dead code
4. **Architecture compliance** - RSC patterns, Server Actions, design system
5. **Accessibility** - WCAG AA compliance, keyboard navigation, screen readers
6. **Best practices** - Next.js 15 patterns, React 19 features, Supabase integration

## Review Scope

### Core Application (`/app`)

- [ ] Dashboard routes and layouts
- [ ] Server Components vs Client Components usage
- [ ] Server Actions for mutations
- [ ] Error boundaries and loading states
- [ ] Metadata and SEO

### Business Logic (`/app/actions`)

- [ ] Input validation with Zod schemas
- [ ] Error handling patterns
- [ ] Database query efficiency
- [ ] Cache invalidation strategies

### API Routes (`/app/api`)

- [ ] Authentication middleware
- [ ] Rate limiting
- [ ] Request validation
- [ ] Response formatting

### Shared Libraries (`/lib`)

- [ ] Supabase client configuration
- [ ] Security utilities
- [ ] Notification services
- [ ] Payment integration

### UI Components (`/components`)

- [ ] Design system compliance
- [ ] Accessibility attributes
- [ ] Responsive design
- [ ] Performance optimization

### Configuration

- [ ] Next.js configuration
- [ ] TypeScript configuration
- [ ] ESLint/Prettier rules
- [ ] Environment validation

## Quality Gates

All code must pass:

- ESLint: 0 errors
- TypeScript: 0 errors
- Stylelint: 0 errors (OKLCH compliance)
- Unit tests: 100% pass rate
- WCAG AA: Automated checks

## Files for Review

This audit covers **all files** in the repository, with special focus on:

- `app/**/*.tsx` - React components and pages
- `app/actions/**/*.ts` - Server Actions
- `app/api/**/*.ts` - API routes
- `lib/**/*.ts` - Shared utilities
- `components/**/*.tsx` - UI components

---

*This file triggers a full CodeRabbit review of the TAC Cargo project.*
