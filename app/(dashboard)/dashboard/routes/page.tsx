import React from "react";
import { createClient } from "@/lib/supabase/server";
import { RoutesClient } from "./_components/routes-client";
import { normalizeJoinSingle } from "@/lib/utils";

async function getActiveManifests() {
    const supabase = await createClient();
    
    const { data } = await supabase
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
            total_pieces,
            total_weight,
            origin_warehouse:warehouses!origin_warehouse_id(name, code, city),
            destination_warehouse:warehouses!destination_warehouse_id(name, code, city)
        `)
        .in("status", ["dispatched", "locked"])
        .order("actual_departure", { ascending: false })
        .limit(20);

    return (data || []).map(m => ({
        ...m,
        origin_warehouse: normalizeJoinSingle(m.origin_warehouse),
        destination_warehouse: normalizeJoinSingle(m.destination_warehouse),
    }));
}

export default async function RoutesPage() {
    const manifests = await getActiveManifests();

    return (
        <div className="max-w-[1600px] mx-auto pb-20">
            <RoutesClient manifests={manifests} />
        </div>
    );
}
