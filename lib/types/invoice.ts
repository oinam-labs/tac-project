/**
 * @fileoverview Invoice-related type definitions
 * @module lib/types/invoice
 */

import type { Database } from '@/lib/supabase/types';

// Database types
export type Invoice = Database['public']['Tables']['invoices']['Row'];
export type InvoiceInsert = Database['public']['Tables']['invoices']['Insert'];
export type InvoiceUpdate = Database['public']['Tables']['invoices']['Update'];

export type InvoiceItem = Database['public']['Tables']['invoice_items']['Row'];
export type Package = Database['public']['Tables']['packages']['Row'];
export type Warehouse = Database['public']['Tables']['warehouses']['Row'];

// Extended types for invoice operations
export interface InvoiceWithRelations extends Invoice {
  invoice_items?: InvoiceItem[];
  packages?: Package[];
  origin_warehouse?: Warehouse;
  destination_warehouse?: Warehouse;
  customer?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
  };
}

// PDF generation types
export interface InvoicePDFData {
  invoice: InvoiceWithRelations;
  organization: {
    id: string;
    name: string;
    address?: string;
    phone?: string;
    email?: string;
    logo_url?: string;
  };
}

// Mapper types
export interface ShipmentData {
  id: string;
  reference: string;
  status: string;
  origin: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  destination: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    weight: number;
    value: number;
  }>;
  totalWeight: number;
  totalValue: number;
  createdAt: string;
}
