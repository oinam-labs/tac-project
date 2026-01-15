"use strict";
/**
 * TAC Cargo MCP Server - Shipment Query Tool
 * Provides MCP interface for querying shipment data
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const server_1 = require("@/lib/supabase/server");
const node_url_1 = require("node:url");
const node_path_1 = require("node:path");
const zod_1 = require("zod");
/**
 * Create MCP server instance
 */
const server = new mcp_js_1.McpServer({
    name: "tac-cargo-shipment-server",
    version: "1.0.0",
});
exports.server = server;
function createTextContent(text) {
    const result = {
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
server.registerTool("query_shipment", {
    title: "Query shipment",
    description: "Query shipment information by reference number",
    inputSchema: {
        reference: zod_1.z.string().min(1, "Reference is required"),
    },
}, async ({ reference }) => {
    return await queryShipment(reference);
});
server.registerTool("list_recent_shipments", {
    title: "List recent shipments",
    description: "List recent shipments with optional limit",
    inputSchema: {
        limit: zod_1.z
            .number()
            .int()
            .min(1)
            .max(100)
            .optional(),
    },
}, async ({ limit }) => {
    const effectiveLimit = typeof limit === "number" ? limit : 10;
    return await listRecentShipments(effectiveLimit);
});
server.registerTool("get_shipment_status", {
    title: "Get shipment status",
    description: "Get current status of a shipment",
    inputSchema: {
        reference: zod_1.z.string().min(1, "Reference is required"),
    },
}, async ({ reference }) => {
    return await getShipmentStatus(reference);
});
/**
 * Query shipment by reference
 */
async function queryShipment(reference) {
    const supabase = await (0, server_1.createClient)();
    const { data, error } = await supabase
        .from("shipments")
        .select(`
      *,
      origin_warehouse:warehouses!origin_warehouse_id(code, name, city, state),
      destination_warehouse:warehouses!destination_warehouse_id(code, name, city, state),
      customer:customers(name, email)
    `)
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
async function listRecentShipments(limit = 10) {
    const supabase = await (0, server_1.createClient)();
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
async function getShipmentStatus(reference) {
    const supabase = await (0, server_1.createClient)();
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
    return createTextContent(JSON.stringify({
        reference: data.reference,
        status: data.status,
        eta: data.eta,
        delivered_at: data.delivered_at,
    }, null, 2));
}
/**
 * Start MCP server
 */
async function main() {
    try {
        const transport = new stdio_js_1.StdioServerTransport();
        await server.connect(transport);
        console.error("TAC Cargo MCP Shipment Server running");
    }
    catch (error) {
        console.error("Failed to start MCP server:", error);
        process.exit(1);
    }
}
// Start server if run directly (ES module compatible, cross-platform)
const currentFilePath = (0, node_url_1.fileURLToPath)(import.meta.url);
const executedFilePath = process.argv[1] ? node_path_1.default.resolve(process.argv[1]) : "";
// Strict path comparison
const normalizedCurrentPath = node_path_1.default.normalize(currentFilePath);
const normalizedExecutedPath = node_path_1.default.normalize(executedFilePath);
const isMainModule = normalizedCurrentPath === normalizedExecutedPath;
if (isMainModule) {
    try {
        await main();
    }
    catch (error) {
        console.error("Server error:", error);
        process.exit(1);
    }
}
