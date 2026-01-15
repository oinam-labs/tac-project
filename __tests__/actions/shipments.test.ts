/**
 * @jest-environment node
 */

/**
 * Shipment Actions Unit Tests
 * Tests validation logic and error handling
 */

import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { mockFn, createMockSupabaseClient } from "../utils/mock-helpers";

const mockSupabaseClient = createMockSupabaseClient();

// Use unstable_mockModule for ESM compatibility
jest.unstable_mockModule("@/lib/supabase/server", () => ({
  createClient: jest.fn(() => Promise.resolve(mockSupabaseClient)),
}));

jest.unstable_mockModule("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

describe("Shipment Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createShipment", () => {
    it("should return unauthorized error when user is not logged in", async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
      });

      const { createShipment } = await import("@/app/actions/shipments");

      const result = await createShipment({
        transport_mode: "surface",
        pieces: 1,
        consignee_name: "Test Customer",
        consignee_phone: "9876543210",
        consignee_address: "123 Test Street",
        consignee_city: "Mumbai",
        consignee_state: "Maharashtra",
        consignee_pincode: "400001",
      });

      expect(result.success).toBe(false);
      if (!result.success) expect(result.code).toBe("UNAUTHORIZED");
    });

    it("should return validation error for invalid phone number", async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: "test-user-id" } },
      });

      const { createShipment } = await import("@/app/actions/shipments");

      const result = await createShipment({
        transport_mode: "surface",
        pieces: 1,
        consignee_name: "Test Customer",
        consignee_phone: "123", // Too short
        consignee_address: "123 Test Street",
        consignee_city: "Mumbai",
        consignee_state: "Maharashtra",
        consignee_pincode: "400001",
      });

      expect(result.success).toBe(false);
      if (!result.success) expect(result.code).toBe("VALIDATION_ERROR");
    });

    it("should create shipment with valid data", async () => {
      const mockUser = { id: "test-user-id" };
      const mockProfile = { organization_id: "test-org-id" };
      const mockShipment = {
        id: "new-shipment-id",
        reference: "SHP-2026TEST",
        status: "booked",
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
        if (table === "shipments") {
          return {
            insert: mockFn().mockReturnThis(),
            select: mockFn().mockReturnThis(),
            single: mockFn().mockResolvedValue({ data: mockShipment, error: null }),
          };
        }
        return {};
      });

      const { createShipment } = await import("@/app/actions/shipments");

      const result = await createShipment({
        transport_mode: "surface",
        pieces: 1,
        consignee_name: "Test Customer",
        consignee_phone: "9876543210",
        consignee_address: "123 Test Street",
        consignee_city: "Mumbai",
        consignee_state: "Maharashtra",
        consignee_pincode: "400001",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("updateShipmentStatus", () => {
    it("should update shipment status and create tracking event", async () => {
      const mockUser = { id: "test-user-id" };
      const mockShipment = {
        id: "shipment-id",
        status: "in_transit",
      };

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      });

      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === "shipments") {
          return {
            update: mockFn().mockReturnThis(),
            eq: mockFn().mockReturnThis(),
            select: mockFn().mockReturnThis(),
            single: mockFn().mockResolvedValue({ data: mockShipment, error: null }),
          };
        }
        if (table === "tracking_events") {
          return {
            insert: mockFn().mockResolvedValue({ error: null }),
          };
        }
        return {};
      });

      const { updateShipmentStatus } = await import("@/app/actions/shipments");

      const result = await updateShipmentStatus("shipment-id", "in_transit", "Status updated");

      expect(result.success).toBe(true);
    });
  });

  describe("cancelShipment", () => {
    it("should cancel shipment and update status to cancelled", async () => {
      const mockUser = { id: "test-user-id" };

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      });

      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === "shipments") {
          return {
            update: mockFn().mockReturnThis(),
            eq: mockFn().mockResolvedValue({ error: null }),
          };
        }
        return {};
      });

      const { cancelShipment } = await import("@/app/actions/shipments");

      const result = await cancelShipment("shipment-id");

      expect(result.success).toBe(true);
    });
  });

  describe("searchShipments", () => {
    it("should sanitize search query to prevent SQL injection patterns", async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: "test-user-id" } },
      });

      mockSupabaseClient.from.mockImplementation(() => ({
        select: mockFn().mockReturnThis(),
        order: mockFn().mockReturnThis(),
        limit: mockFn().mockReturnThis(),
        or: mockFn().mockReturnThis(),
        eq: mockFn().mockResolvedValue({ data: [], error: null }),
      }));

      const { searchShipments } = await import("@/app/actions/shipments");

      // This should not throw even with SQL-like characters
      const result = await searchShipments("test%_\\pattern");

      expect(result.success).toBe(true);
    });
  });
});
