---
description: Verify changes before submission
---
# Verify Changes

Run this workflow to ensure your changes meet the quality standards before asking for review or merging.

1. **Linting**
   - Run `npm run lint` to check for code style and potential errors.
   - Fix any reported issues.

2. **Type Checking**
   - Run `npx tsc --noEmit` to verify type safety.
   - Ensure there are no TypeScript errors.

3. **Unit Tests**
   - Run `npm test` to execute unit tests.
   - Verify that all tests pass and coverage is acceptable.

4. **E2E Tests**
   - Run `npm run test:e2e` to verify critical user flows.
   - **Note**: This may take some time.
   - If UI changes were made, run `npm run test:e2e:ui` to visually inspect.

5. **Build Check**
   - Run `npm run build` to ensure the project builds successfully for production.
