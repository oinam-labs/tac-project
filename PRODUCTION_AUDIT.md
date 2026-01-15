# TAC Cargo - Full Suite Production Audit

**Audit Date**: 2026-01-15
**Requested By**: @oinam-labs (Release Manager)
**Scope**: Complete codebase review for production readiness

## Audit Objectives

> **Priority Legend**: P0 = Critical (blocks release), P1 = High (should fix), P2 = Medium (nice to have)

This PR triggers a comprehensive CodeRabbit review of the entire TAC Cargo codebase to identify:

1. **Security vulnerabilities** _(P0-Critical)_ - Authentication, authorization, input validation, XSS, CSRF
2. **Performance issues** _(P0-Critical)_ - N+1 queries, unnecessary re-renders, bundle size
3. **Architecture compliance** _(P1-High)_ - RSC patterns, Server Actions, design system
4. **Code quality** _(P1-High)_ - Type safety, error handling, dead code
5. **Accessibility** _(P1-High)_ - WCAG AA compliance, keyboard navigation, screen readers
6. **Best practices** _(P2-Medium)_ - Next.js 15 patterns, React 19 features, Supabase integration

## Review Scope

*Check items below as they are reviewed and verified during the audit process.*

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

All code must pass these checks before merge:

| Check | Command | Threshold |
|-------|---------|-----------|
| ESLint | `npm run lint` | 0 errors |
| TypeScript | `npx tsc --noEmit` | 0 errors |
| Stylelint | `npm run lint:css` | 0 errors (OKLCH compliance) |
| Unit Tests | `npm test` | 100% pass rate |
| WCAG AA | Automated via axe-core in tests | Pass all rules |

## Files for Review

This audit reviews **all files** in the repository, with the following priority focus:

**Critical Files** (P0 - Priority Review):

- `lib/supabase/middleware.ts` - Authentication middleware and session handling
- `app/actions/*.ts` - All 19 Server Action files
- `lib/supabase/server.ts` - Server-side Supabase client
- `lib/security/*.ts` - Security utilities and headers

**High Priority Patterns**:

- `app/**/*.tsx` - React components and pages
- `app/actions/**/*.ts` - Server Actions
- `app/api/**/*.ts` - API routes
- `lib/**/*.ts` - Shared utilities
- `components/**/*.tsx` - UI components

---

## Trigger Mechanism

This PR triggers CodeRabbit's automated review when:
1. The PR is opened or updated against the `main` branch
2. A `@coderabbitai full review` comment is posted

For manual review, run: `wsl bash scripts/coderabbit-review.sh`

*Contact @oinam-labs if the review fails or requires escalation.*
