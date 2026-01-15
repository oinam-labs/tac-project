import React from "react";
import { createClient } from "@/lib/supabase/server";
import { ScannerClient } from "./_components/scanner-client";
import { normalizeJoinSingle } from "@/lib/utils";

async function getWarehouses() {
    const supabase = await createClient();
    
    const { data } = await supabase
        .from("warehouses")
        .select("id, name, code")
        .eq("is_active", true)
        .order("name");

    return data || [];
}

async function getRecentScans() {
    const supabase = await createClient();
    
    const { data } = await supabase
        .from("scan_events")
        .select(`
            id,
            scan_type,
            created_at,
            shipments(reference, consignee_name, status),
            profiles(full_name)
        `)
        .order("created_at", { ascending: false })
        .limit(20);

    return (data || []).map(s => ({
        ...s,
        shipments: normalizeJoinSingle(s.shipments),
        profiles: normalizeJoinSingle(s.profiles),
    }));
}

export default async function ScanningPage() {
    const [warehouses, recentScans] = await Promise.all([
        getWarehouses(),
        getRecentScans(),
    ]);

    return (
        <div className="max-w-[1200px] mx-auto pb-20">
            <ScannerClient 
                warehouses={warehouses}
                initialRecentScans={recentScans}
            />
        </div>
    );
}
