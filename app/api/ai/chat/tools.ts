import { createClient } from "@/lib/supabase/server";

export async function get_shipment_stats() {
    const supabase = await createClient();

    const { count: total } = await supabase.from('shipments').select('*', { count: 'exact', head: true });
    const { count: delayed } = await supabase.from('shipments').select('*', { count: 'exact', head: true }).eq('status', 'exception');
    const { count: in_transit } = await supabase.from('shipments').select('*', { count: 'exact', head: true }).eq('status', 'in_transit');

    return { total, delayed, in_transit };
}

export async function search_shipments({ query }: { query: string }) {
    const supabase = await createClient();

    const { data } = await supabase
        .from('shipments')
        .select('id, reference, status, origin, destination, eta')
        .or(`reference.ilike.%${query}%,consignee_name.ilike.%${query}%`)
        .limit(5);

    return data;
}

export async function get_anomalies() {
    const supabase = await createClient();
    // Placeholder for anomaly detection logic
    const { data } = await supabase
        .from('shipments')
        .select('id, reference, status, updated_at')
        .eq('status', 'exception')
        .limit(5);
    return data;
}

export const tools = [
    {
        type: "function" as const,
        function: {
            name: "get_shipment_stats",
            description: "Get current shipment statistics (total, delayed, in_transit)",
            parameters: { type: "object", properties: {} },
        },
    },
    {
        type: "function" as const,
        function: {
            name: "search_shipments",
            description: "Search for shipments by reference or consignee",
            parameters: {
                type: "object",
                properties: {
                    query: { type: "string", description: "The search query" },
                },
                required: ["query"],
            },
        },
    },
    {
        type: "function" as const,
        function: {
            name: "get_anomalies",
            description: "Get recent shipment anomalies or exceptions",
            parameters: { type: "object", properties: {} }
        }
    }
];
