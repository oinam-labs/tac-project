/**
 * @fileoverview Shipment-related type definitions
 * @module lib/types/shipment
 */

import type { Database } from '@/lib/supabase/types';

// Database types
export type Shipment = Database['public']['Tables']['shipments']['Row'];
export type ShipmentInsert = Database['public']['Tables']['shipments']['Insert'];
export type ShipmentUpdate = Database['public']['Tables']['shipments']['Update'];

export type ScanEvent = Database['public']['Tables']['scan_events']['Row'];

// Extended types for shipment operations
export interface ShipmentWithRelations extends Shipment {
  scan_events?: ScanEvent[];
  packages?: Array<{
    id: string;
    description?: string;
    weight?: number;
    length?: number;
    width?: number;
    height?: number;
  }>;
  origin_warehouse?: {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  destination_warehouse?: {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
}

// Event creation types
export interface EventCreationData {
  shipment_id: string;
  event_type: string;
  status: string;
  location?: string;
  notes?: string;
  scanned_at?: string;
}
