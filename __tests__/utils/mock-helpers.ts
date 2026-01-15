/**
 * Shared test utilities for mocking Supabase client
 * Extracted to reduce duplication across test files
 */

import type { Mock } from "jest-mock";
import { jest } from "@jest/globals";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyMock = Mock<(...args: any[]) => any>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mockFn = () => jest.fn() as any;

export interface MockSupabaseClient {
  auth: {
    getUser: AnyMock;
  };
  from: AnyMock;
}

export function createMockSupabaseClient(): MockSupabaseClient {
  return {
    auth: {
      getUser: jest.fn() as AnyMock,
    },
    from: jest.fn() as AnyMock,
  };
}
