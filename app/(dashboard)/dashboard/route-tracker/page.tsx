import React from "react";
import { createClient } from "@/lib/supabase/server";
import { RouteTrackerClient } from "./_components/route-tracker-client";
import { normalizeJoinSingle } from "@/lib/utils";

export const metadata = {
    title: "Route Tracker | TAC Cargo",
    description: "Real-time tracking of shipment routes and manifests",
};

async function getActiveRoutes() {
    const supabase = await createClient();
    
    const { data: manifests } = await supabase
        .from("manifests")
        .select(`
            id,
            manifest_number,
            status,
            transport_mode,
            vehicle_number,
            driver_name,
            driver_phone,
            planned_departure,
            actual_departure,
            planned_arrival,
            actual_arrival,
            total_pieces,
            total_weight,
            origin_warehouse:warehouses!origin_warehouse_id(id, name, code, city),
            destination_warehouse:warehouses!destination_warehouse_id(id, name, code, city)
        `)
        .in("status", ["dispatched", "finalized", "draft"])
        .order("created_at", { ascending: false })
        .limit(50);

    return (manifests || []).map(m => ({
        ...m,
        origin_warehouse: normalizeJoinSingle(m.origin_warehouse),
        destination_warehouse: normalizeJoinSingle(m.destination_warehouse),
    }));
}

async function getRouteStats() {
    const supabase = await createClient();
    
    const { count: activeCount } = await supabase
        .from("manifests")
        .select("id", { count: "exact", head: true })
        .eq("status", "dispatched");

    const { count: completedToday } = await supabase
        .from("manifests")
        .select("id", { count: "exact", head: true })
        .eq("status", "received")
        .gte("actual_arrival", new Date().toISOString().split("T")[0]);

    const { count: pendingCount } = await supabase
        .from("manifests")
        .select("id", { count: "exact", head: true })
        .in("status", ["draft", "finalized"]);

    return {
        active: activeCount || 0,
        completedToday: completedToday || 0,
        pending: pendingCount || 0,
    };
}

export default async function RouteTrackerPage() {
    const [routes, stats] = await Promise.all([
        getActiveRoutes(),
        getRouteStats(),
    ]);

    return (
        <div className="max-w-[1600px] mx-auto pb-20">
            <RouteTrackerClient routes={routes} stats={stats} />
        </div>
    );
}
