"use client";

import React, { useState } from "react";
import {
    Truck,
    MapPin,
    Phone,
    ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ManifestStatus } from "@/types/database";

interface Manifest {
    id: string;
    manifest_number: string;
    status: ManifestStatus;
    transport_mode: string | null;
    vehicle_number: string | null;
    driver_name: string | null;
    driver_phone: string | null;
    planned_departure: string | null;
    actual_departure: string | null;
    planned_arrival: string | null;
    total_pieces: number | null;
    total_weight: number | null;
    origin_warehouse: { name: string; code: string; city: string | null } | null;
    destination_warehouse: { name: string; code: string; city: string | null } | null;
}

interface RoutesClientProps {
    manifests: Manifest[];
}

export function RoutesClient({ manifests }: RoutesClientProps) {
    const [selectedId, setSelectedId] = useState<string | null>(manifests[0]?.id || null);
    const selected = manifests.find(m => m.id === selectedId);

    return (
        <div className="h-[calc(100vh-140px)] rounded-xl border border-border bg-card relative overflow-hidden shadow-sm">
            {/* Map Placeholder */}
            <div className="absolute inset-0 bg-muted/20">
                <div className="absolute inset-0 opacity-10">
                    {/* Grid pattern */}
                    <div className="absolute inset-0" style={{
                        backgroundImage: `
                            linear-gradient(currentColor 1px, transparent 1px),
                            linear-gradient(90deg, currentColor 1px, transparent 1px)
                        `,
                        backgroundSize: "40px 40px"
                    }} />
                </div>

                {/* Route visualization (placeholder) */}
                {selected && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex items-center gap-8">
                            <div className="text-center">
                                <div className="w-12 h-12 rounded-full bg-success/10 border-2 border-success/20 flex items-center justify-center mx-auto mb-3 text-success">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div className="text-sm font-semibold text-foreground">{selected.origin_warehouse?.code}</div>
                                <div className="text-xs text-muted-foreground font-medium">{selected.origin_warehouse?.city}</div>
                            </div>

                            <div className="flex-1 w-64 relative">
                                <div className="h-1 bg-border rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-success via-primary to-muted w-2/3 animate-pulse" />
                                </div>
                                <div className="absolute top-1/2 left-2/3 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-background rounded-full border-2 border-primary flex items-center justify-center shadow-sm z-10">
                                    <Truck className="w-4 h-4 text-primary" />
                                </div>
                            </div>

                            <div className="text-center opacity-60">
                                <div className="w-12 h-12 rounded-full bg-muted border-2 border-border flex items-center justify-center mx-auto mb-3 text-muted-foreground">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div className="text-sm font-semibold text-foreground">{selected.destination_warehouse?.code}</div>
                                <div className="text-xs text-muted-foreground font-medium">{selected.destination_warehouse?.city}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Sidebar - Active Routes */}
            <div className="absolute top-4 left-4 bottom-4 w-80 flex flex-col gap-2 pointer-events-none">
                <Card className="pointer-events-auto h-full flex flex-col border-border/60 shadow-lg bg-background/95 backdrop-blur-sm">
                    <div className="p-4 border-b border-border/60 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                            <span className="text-sm font-semibold tracking-tight">Active Routes</span>
                        </div>
                        <Badge variant="secondary" className="text-xs font-normal">
                            {manifests.length}
                        </Badge>
                    </div>

                    <ScrollArea className="flex-1">
                        <div className="p-3 space-y-2">
                            {manifests.length === 0 ? (
                                <div className="text-center text-muted-foreground text-sm py-8">
                                    No active routes
                                </div>
                            ) : (
                                manifests.map((manifest) => (
                                    <div
                                        key={manifest.id}
                                        onClick={() => setSelectedId(manifest.id)}
                                        className={cn(
                                            "p-3 rounded-lg cursor-pointer transition-all border",
                                            selectedId === manifest.id
                                                ? "bg-primary/5 border-primary/20 shadow-sm"
                                                : "bg-card border-transparent hover:bg-muted/50 hover:border-border"
                                        )}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-mono text-xs font-medium text-foreground">
                                                {manifest.manifest_number}
                                            </span>
                                            <Badge 
                                                variant={manifest.status === "dispatched" ? "default" : "secondary"} 
                                                className={cn("text-[10px] h-5 px-1.5 font-normal capitalize", manifest.status === "dispatched" && "bg-primary/10 text-primary hover:bg-primary/20 border-primary/20")}
                                            >
                                                {manifest.status}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
                                            <span className="font-medium text-foreground/80">{manifest.origin_warehouse?.code}</span>
                                            <ArrowRight className="w-3 h-3 text-muted-foreground/50" />
                                            <span className="font-medium text-foreground/80">{manifest.destination_warehouse?.code}</span>
                                        </div>
                                        {manifest.driver_name && (
                                            <div className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                                                <Truck className="w-3 h-3" />
                                                <span className="truncate">{manifest.driver_name} • {manifest.vehicle_number}</span>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </Card>
            </div>

            {/* Detail Panel */}
            {selected && (
                <div className="absolute top-4 right-4 w-80 pointer-events-none">
                    <Card className="pointer-events-auto border-border/60 shadow-lg bg-background/95 backdrop-blur-sm">
                        <div className="p-4 border-b border-border/60">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-md bg-primary/10 text-primary">
                                    <Truck className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-foreground">{selected.manifest_number}</div>
                                    <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{selected.transport_mode?.toUpperCase()}</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 space-y-6">
                            <div className="relative pl-4 border-l-2 border-muted space-y-6">
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-background border-2 border-success" />
                                    <div className="text-xs font-medium text-muted-foreground mb-1">Origin</div>
                                    <div className="text-sm font-medium text-foreground">{selected.origin_warehouse?.name}</div>
                                    {selected.actual_departure && (
                                        <div className="text-[10px] font-mono text-muted-foreground mt-1 bg-muted/50 w-fit px-1.5 py-0.5 rounded">
                                            {new Date(selected.actual_departure).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                                        </div>
                                    )}
                                </div>

                                <div className="relative">
                                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-background border-2 border-primary" />
                                    <div className="text-xs font-medium text-muted-foreground mb-1">Current Status</div>
                                    <div className="text-sm font-medium text-foreground capitalize">{selected.status}</div>
                                    <div className="text-xs font-mono text-muted-foreground mt-1">
                                        {selected.total_pieces} pcs • {selected.total_weight} kg
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-background border-2 border-muted-foreground/30" />
                                    <div className="text-xs font-medium text-muted-foreground mb-1">Destination</div>
                                    <div className="text-sm font-medium text-foreground">{selected.destination_warehouse?.name}</div>
                                    {selected.planned_arrival && (
                                        <div className="text-[10px] font-mono text-muted-foreground mt-1 bg-muted/50 w-fit px-1.5 py-0.5 rounded">
                                            Est. {new Date(selected.planned_arrival).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {selected.driver_name && (
                                <div className="pt-4 border-t border-border/60">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                                            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                                                <Truck className="w-3 h-3 text-muted-foreground" />
                                            </div>
                                            <span>{selected.driver_name}</span>
                                        </div>
                                        {selected.driver_phone && (
                                            <a
                                                href={`tel:${selected.driver_phone}`}
                                                className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 bg-primary/5 px-2 py-1 rounded hover:bg-primary/10 transition-colors"
                                            >
                                                <Phone className="w-3 h-3" />
                                                <span>Call</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
