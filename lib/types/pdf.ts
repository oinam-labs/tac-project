/**
 * @fileoverview PDF generation type definitions
 * @module lib/types/pdf
 */

import type { InvoiceWithRelations } from './invoice';

// PDF generation types
export interface PDFInvoiceData {
  invoice: InvoiceWithRelations;
  organization: {
    name?: string;
    gstin?: string;
    address?: string;
    phone?: string;
    email?: string;
    logo_url?: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    weight: number;
    rate: number;
    amount: number;
  }>;
}

export interface PDFLabelData {
  invoice: InvoiceWithRelations;
}

// MCP client return types
export interface MCPResponse<T = any> {
  data: T;
  error: any;
}

export interface MCPListResponse<T = any> {
  data: T[];
  error: any;
}
