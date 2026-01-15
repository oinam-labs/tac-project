/**
 * TAC Cargo MCP Server - Shipment Query Tool
 * Provides MCP interface for querying shipment data
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createClient } from "../../lib/supabase/server";
import { fileURLToPath } from "url";
import path from "path";
import { z } from "zod";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

/**
 * Create MCP server instance
 */
const server = new McpServer({
  name: "tac-cargo-shipment-server",
  version: "1.0.0",
});

function createTextContent(text: string): CallToolResult {
  const result: CallToolResult = {
    content: [
      {
        type: "text",
        text,
      },
    ],
  };

  return result;
}

/**
 * Register tools
 */
server.registerTool(
  "query_shipment",
  {
    title: "Query shipment",
    description: "Query shipment information by reference number",
    inputSchema: {
      reference: z.string().min(1, "Reference is required"),
    },
  },
  async ({ reference }) => {
    return await queryShipment(reference);
  },
);

server.registerTool(
  "list_recent_shipments",
  {
    title: "List recent shipments",
    description: "List recent shipments with optional limit",
    inputSchema: {
      limit: z
        .number()
        .int()
        .min(1)
        .max(100)
        .optional(),
    },
  },
  async ({ limit }) => {
    const effectiveLimit = typeof limit === "number" ? limit : 10;
    return await listRecentShipments(effectiveLimit);
  },
);

server.registerTool(
  "get_shipment_status",
  {
    title: "Get shipment status",
    description: "Get current status of a shipment",
    inputSchema: {
      reference: z.string().min(1, "Reference is required"),
    },
  },
  async ({ reference }) => {
    return await getShipmentStatus(reference);
  },
);

/**
 * Query shipment by reference
 */
async function queryShipment(reference: string): Promise<CallToolResult> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("shipments")
    .select(
      `
      *,
      origin_warehouse:warehouses!origin_warehouse_id(code, name, city, state),
      destination_warehouse:warehouses!destination_warehouse_id(code, name, city, state),
      customer:customers(name, email)
    `,
    )
    .eq("reference", reference)
    .single();

  if (error) {
    throw new Error(`Failed to query shipment: ${error.message}`);
  }

  if (!data) {
    throw new Error(`Shipment not found: ${reference}`);
  }

  return createTextContent(JSON.stringify(data, null, 2));
}

/**
 * List recent shipments
 */
async function listRecentShipments(limit: number = 10): Promise<CallToolResult> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("shipments")
    .select("reference, status, created_at, eta")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to list shipments: ${error.message}`);
  }

  return createTextContent(JSON.stringify(data, null, 2));
}

/**
 * Get shipment status
 */
async function getShipmentStatus(reference: string): Promise<CallToolResult> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("shipments")
    .select("reference, status, eta, delivered_at")
    .eq("reference", reference)
    .single();

  if (error) {
    throw new Error(`Failed to get shipment status: ${error.message}`);
  }

  if (!data) {
    throw new Error(`Shipment not found: ${reference}`);
  }

  return createTextContent(
    JSON.stringify(
      {
        reference: data.reference,
        status: data.status,
        eta: data.eta,
        delivered_at: data.delivered_at,
      },
      null,
      2,
    ),
  );
}

/**
 * Start MCP server
 */
async function main() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);

    console.error(
      "TAC Cargo MCP Shipment Server running",
    );
  } catch (error) {
    console.error("Failed to start MCP server:", error);
    process.exit(1);
  }
}

// Start server if run directly (ES module compatible, cross-platform)
const currentFilePath = fileURLToPath(import.meta.url);
const executedFilePath = process.argv[1] ? path.resolve(process.argv[1]) : "";

// Strict path comparison
const normalizedCurrentPath = path.normalize(currentFilePath);
const normalizedExecutedPath = path.normalize(executedFilePath);
const isMainModule = normalizedCurrentPath === normalizedExecutedPath;

if (isMainModule) {
  try {
    await main();
  } catch (error) {
    console.error("Server error:", error);
    process.exit(1);
  }
}

export { server };
