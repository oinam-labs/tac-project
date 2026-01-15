import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { createClient } from "@/lib/supabase/server";
import type { ChatCompletionTool } from "openai/resources/chat/completions";

/**
 * Tool: Get Shipments
 * Fetches shipments from database with optional filters
 */
export const getShipmentsSchema = z.object({
    status: z
        .enum(["booked", "picked_up", "in_transit", "out_for_delivery", "delivered", "exception"])
        .optional()
        .describe("Filter by shipment status"),
    dateFrom: z.string().optional().describe("Filter shipments created after this date (ISO format)"),
    dateTo: z.string().optional().describe("Filter shipments created before this date (ISO format)"),
    customerId: z.string().optional().describe("Filter by customer UUID"),
    reference: z.string().optional().describe("Search by tracking reference number"),
    limit: z.number().default(50).describe("Maximum number of results to return"),
});

export const getShipmentsTool: ChatCompletionTool = {
    type: "function",
    function: {
        name: "get_shipments",
        description:
            "Fetch shipments from the database with optional filters. Use this to query shipment data, track packages, analyze shipment patterns, or respond to tracking inquiries.",
        // @ts-expect-error - zodToJsonSchema works with ZodObject despite strict typing
        parameters: zodToJsonSchema(getShipmentsSchema) as Record<string, unknown>,
    },
};

export async function executeGetShipments(params: z.infer<typeof getShipmentsSchema>) {
    const supabase = await createClient();
    const { status, dateFrom, dateTo, customerId, reference, limit } = params;

    let query = supabase
        .from("shipments")
        .select(
            `
          id,
          reference,
          status,
          consignee_name,
          consignee_city,
          consignee_state,
          shipper_name,
          shipper_city,
          shipper_state,
          weight,
          declared_value,
          service_type,
          created_at,
          updated_at,
          customer:customers(name, email)
        `
        )
        .order("created_at", { ascending: false })
        .limit(limit);

    if (status) query = query.eq("status", status);
    if (dateFrom) query = query.gte("created_at", dateFrom);
    if (dateTo) query = query.lte("created_at", dateTo);
    if (customerId) query = query.eq("customer_id", customerId);
    if (reference) query = query.ilike("reference", `%${reference}%`);

    const { data, error } = await query;

    if (error) {
        return JSON.stringify({ error: error.message });
    }

    return JSON.stringify({
        count: data?.length || 0,
        shipments: data,
    });
}

/**
 * Tool: Get Revenue Metrics
 * Fetches financial data including revenue, outstanding balances
 */
export const getRevenueSchema = z.object({
    dateFrom: z.string().optional().describe("Calculate revenue from this date (ISO format)"),
    dateTo: z.string().optional().describe("Calculate revenue up to this date (ISO format)"),
    customerId: z.string().optional().describe("Filter by specific customer UUID"),
});

export const getRevenueTool: ChatCompletionTool = {
    type: "function",
    function: {
        name: "get_revenue",
        description:
            "Fetch revenue and financial metrics including total revenue, outstanding balances, paid invoices, and payment trends. Use this for financial reporting and analysis.",
        // @ts-expect-error - zodToJsonSchema works with ZodObject despite strict typing
        parameters: zodToJsonSchema(getRevenueSchema) as Record<string, unknown>,
    },
};

export async function executeGetRevenue(params: z.infer<typeof getRevenueSchema>) {
    const supabase = await createClient();
    const { dateFrom, dateTo, customerId } = params;

    // Paid invoices (revenue)
    let paidQuery = supabase.from("invoices").select("total_amount, customer_id, created_at").eq("status", "paid");

    if (dateFrom) paidQuery = paidQuery.gte("created_at", dateFrom);
    if (dateTo) paidQuery = paidQuery.lte("created_at", dateTo);
    if (customerId) paidQuery = paidQuery.eq("customer_id", customerId);

    const { data: paidInvoices } = await paidQuery;
    const totalRevenue = (paidInvoices || []).reduce((sum, i) => sum + i.total_amount, 0);

    // Outstanding invoices
    let outstandingQuery = supabase
        .from("invoices")
        .select("balance_due, customer_id, due_date")
        .gt("balance_due", 0);

    if (customerId) outstandingQuery = outstandingQuery.eq("customer_id", customerId);

    const { data: outstandingInvoices } = await outstandingQuery;
    const totalOutstanding = (outstandingInvoices || []).reduce((sum, i) => sum + i.balance_due, 0);

    // Overdue invoices
    const today = new Date().toISOString();
    const overdueInvoices = (outstandingInvoices || []).filter((inv) => inv.due_date < today);
    const totalOverdue = overdueInvoices.reduce((sum, i) => sum + i.balance_due, 0);

    return JSON.stringify({
        totalRevenue,
        totalOutstanding,
        totalOverdue,
        paidInvoicesCount: paidInvoices?.length || 0,
        outstandingInvoicesCount: outstandingInvoices?.length || 0,
        overdueInvoicesCount: overdueInvoices.length,
    });
}

/**
 * Tool: Get Customers
 * Fetches customer data with optional filters
 */
export const getCustomersSchema = z.object({
    searchTerm: z.string().optional().describe("Search customers by name or email"),
    limit: z.number().default(50).describe("Maximum number of results"),
});

export const getCustomersTool: ChatCompletionTool = {
    type: "function",
    function: {
        name: "get_customers",
        description:
            "Fetch customer information including contact details, shipment counts, and payment history. Use this to query customer data or analyze customer patterns.",
        // @ts-expect-error - zodToJsonSchema works with ZodObject despite strict typing
        parameters: zodToJsonSchema(getCustomersSchema) as Record<string, unknown>,
    },
};

export async function executeGetCustomers(params: z.infer<typeof getCustomersSchema>) {
    const supabase = await createClient();
    const { searchTerm, limit } = params;

    let query = supabase
        .from("customers")
        .select(
            `
          id,
          name,
          email,
          phone,
          billing_city,
          billing_state,
          created_at
        `
        )
        .order("created_at", { ascending: false })
        .limit(limit);

    if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
    }

    const { data, error } = await query;

    if (error) {
        return JSON.stringify({ error: error.message });
    }

    // Enrich with shipment counts
    const enrichedData = await Promise.all(
        (data || []).map(async (customer) => {
            const { count: shipmentCount } = await supabase
                .from("shipments")
                .select("id", { count: "exact", head: true })
                .eq("customer_id", customer.id);

            return {
                ...customer,
                shipmentCount: shipmentCount || 0,
            };
        })
    );

    return JSON.stringify({
        count: enrichedData.length,
        customers: enrichedData,
    });
}

/**
 * Tool: Get Exceptions
 * Fetches shipment exceptions and issues
 */
export const getExceptionsSchema = z.object({
    status: z.enum(["open", "in_progress", "resolved"]).optional().describe("Filter by exception status"),
    dateFrom: z.string().optional().describe("Filter exceptions created after this date"),
    limit: z.number().default(50).describe("Maximum number of results"),
});

export const getExceptionsTool: ChatCompletionTool = {
    type: "function",
    function: {
        name: "get_exceptions",
        description:
            "Fetch shipment exceptions including damaged packages, address issues, delays, and other problems. Use this to monitor operational issues and exception patterns.",
        // @ts-expect-error - zodToJsonSchema works with ZodObject despite strict typing
        parameters: zodToJsonSchema(getExceptionsSchema) as Record<string, unknown>,
    },
};

export async function executeGetExceptions(params: z.infer<typeof getExceptionsSchema>) {
    const supabase = await createClient();
    const { status, dateFrom, limit } = params;

    let query = supabase
        .from("exceptions")
        .select(
            `
          id,
          shipment_id,
          type,
          description,
          status,
          priority,
          created_at,
          resolved_at,
          shipment:shipments(reference, status, consignee_name)
        `
        )
        .order("created_at", { ascending: false })
        .limit(limit);

    if (status) query = query.eq("status", status);
    if (dateFrom) query = query.gte("created_at", dateFrom);

    const { data, error } = await query;

    if (error) {
        return JSON.stringify({ error: error.message });
    }

    return JSON.stringify({
        count: data?.length || 0,
        exceptions: data,
    });
}

/**
 * Tool: Get Dashboard Stats
 * Fetches high-level KPI metrics for the dashboard
 */
export const getDashboardStatsTool: ChatCompletionTool = {
    type: "function",
    function: {
        name: "get_dashboard_stats",
        description:
            "Fetch high-level dashboard statistics including total shipments, revenue, active deliveries, exceptions count, and other KPIs. Use this for overview and summary information.",
        parameters: {
            type: "object",
            properties: {},
        },
    },
};

export async function executeGetDashboardStats() {
    const supabase = await createClient();

    const [
        { count: totalShipments },
        { count: inTransitShipments },
        { count: deliveredToday },
        { count: openExceptions },
        { data: paidInvoices },
        { data: outstandingInvoices },
    ] = await Promise.all([
        supabase.from("shipments").select("id", { count: "exact", head: true }),
        supabase.from("shipments").select("id", { count: "exact", head: true }).eq("status", "in_transit"),
        supabase
            .from("shipments")
            .select("id", { count: "exact", head: true })
            .eq("status", "delivered")
            .gte("updated_at", new Date().toISOString().split("T")[0]),
        supabase.from("exceptions").select("id", { count: "exact", head: true }).eq("status", "open"),
        supabase.from("invoices").select("total_amount").eq("status", "paid"),
        supabase.from("invoices").select("balance_due").gt("balance_due", 0),
    ]);

    const totalRevenue = (paidInvoices || []).reduce((sum, i) => sum + i.total_amount, 0);
    const totalOutstanding = (outstandingInvoices || []).reduce((sum, i) => sum + i.balance_due, 0);

    return JSON.stringify({
        totalShipments: totalShipments || 0,
        inTransitShipments: inTransitShipments || 0,
        deliveredToday: deliveredToday || 0,
        openExceptions: openExceptions || 0,
        totalRevenue,
        totalOutstanding,
    });
}

/**
 * All available tools for the C1 API
 */
export const allTools: ChatCompletionTool[] = [
    getShipmentsTool,
    getRevenueTool,
    getCustomersTool,
    getExceptionsTool,
    getDashboardStatsTool,
];
