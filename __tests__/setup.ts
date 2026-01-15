/**
 * Jest Global Setup
 * Runs before all tests
 */

import { jest, beforeAll, afterAll } from "@jest/globals";

// Set test environment variables (use Object.defineProperty to avoid read-only error)
Object.defineProperty(process.env, "NODE_ENV", { value: "test", writable: true });
process.env.NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:54321";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "test-anon-key";

// Global test timeout
jest.setTimeout(10000);

// Mock console.error to keep test output clean (optional)
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Warning: ReactDOM.render is no longer supported")
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
