/**
 * @jest-environment node
 */

/**
 * Manifest Actions Unit Tests
 * Tests validation logic and error handling
 */

import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import type { Mock } from "jest-mock";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyMock = Mock<(...args: any[]) => any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockFn = () => jest.fn() as any;

interface MockSupabaseClient {
  auth: {
    getUser: AnyMock;
  };
  from: AnyMock;
}

const mockSupabaseClient: MockSupabaseClient = {
  auth: {
    getUser: jest.fn() as AnyMock,
  },
  from: jest.fn() as AnyMock,
};

jest.unstable_mockModule("@/lib/supabase/server", () => ({
  createClient: jest.fn(() => Promise.resolve(mockSupabaseClient)),
}));

jest.unstable_mockModule("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

describe("Manifest Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createManifest", () => {
    it("should return unauthorized error when user is not logged in", async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
      });

      const { createManifest } = await import("@/app/actions/manifests");
      
      // Use valid UUIDs as required by the schema
      const result = await createManifest({
        manifest_number: "MNF-2026TEST",
        origin_warehouse_id: "550e8400-e29b-41d4-a716-446655440000",
        destination_warehouse_id: "550e8400-e29b-41d4-a716-446655440001",
        transport_mode: "surface",
        planned_departure: new Date().toISOString(),
        planned_arrival: new Date(Date.now() + 86400000).toISOString(),
      });

      expect(result.success).toBe(false);
      if (!result.success) expect(result.code).toBe("UNAUTHORIZED");
    });

    it("should create manifest with valid data", async () => {
      const mockUser = { id: "test-user-id" };
      const mockProfile = { organization_id: "test-org-id" };
      const mockManifest = {
        id: "new-manifest-id",
        manifest_number: "MNF-2026TEST",
        status: "draft",
      };

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      });

      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === "profiles") {
          return {
            select: mockFn().mockReturnThis(),
            eq: mockFn().mockReturnThis(),
            single: mockFn().mockResolvedValue({ data: mockProfile }),
          };
        }
        if (table === "manifests") {
          return {
            insert: mockFn().mockReturnThis(),
            select: mockFn().mockReturnThis(),
            single: mockFn().mockResolvedValue({ data: mockManifest, error: null }),
          };
        }
        return {};
      });

      const { createManifest } = await import("@/app/actions/manifests");

      // Use valid UUIDs as required by the schema
      const result = await createManifest({
        manifest_number: "MNF-2026TEST",
        origin_warehouse_id: "550e8400-e29b-41d4-a716-446655440000",
        destination_warehouse_id: "550e8400-e29b-41d4-a716-446655440001",
        transport_mode: "surface",
        planned_departure: new Date().toISOString(),
        planned_arrival: new Date(Date.now() + 86400000).toISOString(),
      });

      expect(result.success).toBe(true);
    });
  });

  describe("lockManifest", () => {
    it("should not lock empty manifest", async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: "test-user-id" } },
      });

      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === "shipments") {
          return {
            select: mockFn().mockReturnThis(),
            eq: mockFn().mockResolvedValue({ count: 0 }),
          };
        }
        return {};
      });

      const { lockManifest } = await import("@/app/actions/manifests");
      
      const result = await lockManifest("manifest-id");

      expect(result.success).toBe(false);
      if (!result.success) expect(result.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("dispatchManifest", () => {
    it("should require manifest to be locked before dispatch", async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: "test-user-id" } },
      });

      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === "manifests") {
          return {
            select: mockFn().mockReturnThis(),
            eq: mockFn().mockReturnThis(),
            single: mockFn().mockResolvedValue({ 
              data: { status: "draft" }, 
              error: null 
            }),
          };
        }
        return {};
      });

      const { dispatchManifest } = await import("@/app/actions/manifests");
      
      const result = await dispatchManifest("manifest-id");

      expect(result.success).toBe(false);
      if (!result.success) expect(result.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("addShipmentToManifest", () => {
    it("should validate route matches between shipment and manifest", async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: "test-user-id" } },
      });

      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === "manifests") {
          return {
            select: mockFn().mockReturnThis(),
            eq: mockFn().mockReturnThis(),
            single: mockFn().mockResolvedValue({ 
              data: { 
                status: "draft",
                origin_warehouse_id: "origin-1",
                destination_warehouse_id: "dest-1",
              }, 
              error: null 
            }),
          };
        }
        if (table === "shipments") {
          return {
            select: mockFn().mockReturnThis(),
            eq: mockFn().mockReturnThis(),
            single: mockFn().mockResolvedValue({ 
              data: { 
                id: "shipment-id",
                reference: "SHP-123",
                manifest_id: null,
                origin_warehouse_id: "origin-2", // Different origin
                destination_warehouse_id: "dest-1",
              }, 
              error: null 
            }),
          };
        }
        return {};
      });

      const { addShipmentToManifest } = await import("@/app/actions/manifests");
      
      const result = await addShipmentToManifest("manifest-id", "SHP-123");

      expect(result.success).toBe(false);
      if (!result.success) expect(result.code).toBe("VALIDATION_ERROR");
    });
  });
});
