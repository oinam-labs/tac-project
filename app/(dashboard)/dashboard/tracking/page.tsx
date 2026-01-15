import React from "react";
import { createClient } from "@/lib/supabase/server";
import { TrackingClient } from "./_components/tracking-client";
import { normalizeJoinSingle } from "@/lib/utils";

async function getTrackingStats() {
    const supabase = await createClient();
    
    const statuses = ["booked", "picked_up", "in_transit", "out_for_delivery", "delivered", "exception"] as const;
    const counts: Record<string, number> = {};

    for (const status of statuses) {
        const { count } = await supabase
            .from("shipments")
            .select("id", { count: "exact", head: true })
            .eq("status", status);
        counts[status] = count || 0;
    }

    // Delayed shipments (in transit > 3 days)
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const { count: delayedCount } = await supabase
        .from("shipments")
        .select("id", { count: "exact", head: true })
        .eq("status", "in_transit")
        .lt("updated_at", threeDaysAgo.toISOString());

    return {
        pending: counts.pending,
        pickedUp: counts.picked_up,
        inTransit: counts.in_transit,
        outForDelivery: counts.out_for_delivery,
        delivered: counts.delivered,
        failed: counts.failed,
        delayed: delayedCount || 0,
    };
}

async function getShipmentsByStatus(status?: string) {
    const supabase = await createClient();
    
    let query = supabase
        .from("shipments")
        .select(`
            id,
            reference,
            status,
            consignee_name,
            consignee_city,
            transport_mode,
            created_at,
            updated_at,
            origin_warehouse:warehouses!origin_warehouse_id(name, code),
            destination_warehouse:warehouses!destination_warehouse_id(name, code),
            manifest:manifests!manifest_id(manifest_number)
        `)
        .order("updated_at", { ascending: false })
        .limit(50);

    if (status && status !== "all") {
        query = query.eq("status", status);
    }

    const { data } = await query;
    return (data || []).map(s => ({
        ...s,
        origin_warehouse: normalizeJoinSingle(s.origin_warehouse),
        destination_warehouse: normalizeJoinSingle(s.destination_warehouse),
        manifest: normalizeJoinSingle(s.manifest),
    }));
}

export default async function TrackingPage() {
    const [stats, shipments] = await Promise.all([
        getTrackingStats(),
        getShipmentsByStatus(),
    ]);

    return (
        <div className="max-w-[1600px] mx-auto pb-20">
            <TrackingClient 
                stats={stats}
                initialShipments={shipments}
            />
        </div>
    );
}
