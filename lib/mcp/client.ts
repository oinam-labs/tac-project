/**
 * MCP Client for TAC Cargo
 * Provides a client interface to interact with the MCP server
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

export class TacCargoMcpClient {
  private client: Client;
  private transport: StdioClientTransport | null = null;

  constructor() {
    this.client = new Client(
      {
        name: "tac-cargo-mcp-client",
        version: "1.0.0",
      },
      {
        capabilities: {},
      },
    );
  }

  /**
   * Connect to MCP server
   */
  async connect() {
    try {
      this.transport = new StdioClientTransport({
        command: "node",
        args: ["dist/lib/mcp/shipment-server.js"],
      });

      await this.client.connect(this.transport);

      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Query shipment by reference
   */
  async queryShipment(reference: string) {
    try {
      const result = await this.client.callTool({
        name: "query_shipment",
        arguments: { reference },
      });

      // Validate content structure before type assertion
      if (
        !result.content ||
        !Array.isArray(result.content) ||
        result.content.length === 0
      ) {
        throw new Error("Invalid MCP response: empty or missing content");
      }

      const firstContent = result.content[0];
      if (
        typeof firstContent !== "object" ||
        firstContent === null ||
        !("type" in firstContent) ||
        !("text" in firstContent) ||
        typeof (firstContent as { text: unknown }).text !== "string"
      ) {
        throw new Error(
          "Invalid MCP response: malformed content structure",
        );
      }

      const content = result.content as Array<{
        type: string;
        text: string;
      }>;
      return JSON.parse(content[0].text);
    } catch (error) {
      throw error;
    }
  }

  /**
   * List recent shipments
   */
  async listRecentShipments(limit: number = 10) {
    try {
      const result = await this.client.callTool({
        name: "list_recent_shipments",
        arguments: { limit },
      });

      const content = result.content as Array<{
        type: string;
        text: string;
      }>;
      if (!content || !Array.isArray(content) || content.length === 0) {
        throw new Error("Invalid MCP response: empty or missing content");
      }
      return JSON.parse(content[0].text);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get shipment status
   */
  async getShipmentStatus(reference: string) {
    try {
      const result = await this.client.callTool({
        name: "get_shipment_status",
        arguments: { reference },
      });

      const content = result.content as Array<{
        type: string;
        text: string;
      }>;
      if (!content || !Array.isArray(content) || content.length === 0) {
        throw new Error("Invalid MCP response: empty or missing content");
      }
      return JSON.parse(content[0].text);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Disconnect from MCP server
   */
  async disconnect() {
    if (this.transport) {
      await this.client.close();
      this.transport = null;
    }
  }
}
