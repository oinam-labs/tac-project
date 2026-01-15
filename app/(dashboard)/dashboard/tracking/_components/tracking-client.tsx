"use client";

import React, { useState, useTransition } from "react";
import {
    Search,
    Package,
    Truck,
    CheckCircle,
    AlertCircle,
    Clock,
    ArrowRight,
    MoreHorizontal,
    RefreshCw,
    MapPin,
    Calendar,
    XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { getTrackingInfo, markAsDelivered } from "@/app/actions/tracking";
import { StatusPipeline } from "@/components/dashboard/status-pipeline";
import { IllustratedEmptyState } from "@/components/dashboard/illustrated-empty-state";
import type { ShipmentStatus } from "@/types/database";

interface TrackingStats {
    pending: number;
    pickedUp: number;
    inTransit: number;
    outForDelivery: number;
    delivered: number;
    failed: number;
    delayed: number;
}

interface Shipment {
    id: string;
    reference: string;
    status: ShipmentStatus;
    consignee_name: string | null;
    consignee_city: string | null;
    transport_mode: string | null;
    created_at: string;
    updated_at: string;
    origin_warehouse: { name: string; code: string } | null;
    destination_warehouse: { name: string; code: string } | null;
    manifest: { manifest_number: string } | null;
}

interface TrackingClientProps {
    stats: TrackingStats;
    initialShipments: Shipment[];
}

const statusConfig: Record<ShipmentStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; className?: string; icon: React.ElementType }> = {
    booked: { label: "Booked", variant: "secondary", className: "bg-muted text-muted-foreground", icon: Clock },
    picked_up: { label: "Picked Up", variant: "default", className: "bg-primary/10 text-primary hover:bg-primary/20", icon: Package },
    at_origin_hub: { label: "At Origin Hub", variant: "default", className: "bg-primary/10 text-primary hover:bg-primary/20", icon: Package },
    in_transit: { label: "In Transit", variant: "default", className: "bg-primary/10 text-primary hover:bg-primary/20", icon: Truck },
    at_destination_hub: { label: "At Destination Hub", variant: "default", className: "bg-primary/10 text-primary hover:bg-primary/20", icon: Package },
    out_for_delivery: { label: "Out for Delivery", variant: "secondary", className: "bg-warning/10 text-warning hover:bg-warning/20", icon: Truck },
    delivered: { label: "Delivered", variant: "secondary", className: "bg-success/10 text-success hover:bg-success/20", icon: CheckCircle },
    exception: { label: "Exception", variant: "destructive", className: "bg-destructive/10 text-destructive hover:bg-destructive/20", icon: AlertCircle },
    returned: { label: "Returned", variant: "secondary", className: "bg-warning/10 text-warning hover:bg-warning/20", icon: RefreshCw },
    cancelled: { label: "Cancelled", variant: "secondary", className: "bg-muted text-muted-foreground", icon: XCircle },
};

export function TrackingClient({ stats, initialShipments }: Readonly<TrackingClientProps>) {
    const [shipments, setShipments] = useState(initialShipments);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<ShipmentStatus | "all">("all");
    const [selectedShipment, setSelectedShipment] = useState<{
        reference: string;
        status: ShipmentStatus;
        consignee_name: string | null;
        origin: string;
        destination: string;
        events: Array<{ status: string; description: string | null; created_at: string }>;
    } | null>(null);
    const [, startTransition] = useTransition();

    const filteredShipments = shipments.filter((s) => {
        const matchesSearch =
            s.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.consignee_name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || s.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleTrack = async (reference: string) => {
        startTransition(async () => {
            const result = await getTrackingInfo(reference);
            if (result.success) {
                setSelectedShipment({
                    reference: result.data.shipment.reference,
                    status: result.data.shipment.status,
                    consignee_name: result.data.shipment.consignee_name,
                    origin: result.data.shipment.origin,
                    destination: result.data.shipment.destination,
                    events: result.data.events.map(e => ({
                        status: e.status,
                        description: e.description,
                        created_at: e.created_at,
                    })),
                });
            } else {
                toast.error(result.error);
            }
        });
    };

    const handleMarkDelivered = async (shipmentId: string) => {
        startTransition(async () => {
            const result = await markAsDelivered(shipmentId);
            if (result.success) {
                setShipments(prev =>
                    prev.map(s => s.id === shipmentId ? { ...s, status: "delivered" as ShipmentStatus } : s)
                );
                toast.success("Marked as delivered");
            } else {
                toast.error(result.error);
            }
        });
    };

    return (
        <div className="space-y-6">
            {/* Status Pipeline */}
            <Card>
                <CardContent className="p-6">
                    <StatusPipeline
                        stages={[
                            { id: "pending", label: "Pending", count: stats.pending, icon: Clock, color: "text-muted-foreground bg-muted" },
                            { id: "picked_up", label: "Picked Up", count: stats.pickedUp, icon: Package, color: "text-info-foreground bg-info" },
                            { id: "in_transit", label: "In Transit", count: stats.inTransit, icon: Truck, color: "text-warning-foreground bg-warning" },
                            { id: "out_for_delivery", label: "Out for Delivery", count: stats.outForDelivery, icon: MapPin, color: "text-accent-foreground bg-accent" },
                            { id: "delivered", label: "Delivered", count: stats.delivered, icon: CheckCircle, color: "text-success-foreground bg-success" },
                            { id: "failed", label: "Failed", count: stats.failed, icon: AlertCircle, color: "text-destructive-foreground bg-destructive" },
                        ]}
                        onStageClick={(stageId) => setStatusFilter(stageId as ShipmentStatus | "all")}
                        activeStage={statusFilter !== "all" ? statusFilter : undefined}
                    />
                </CardContent>
            </Card>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search by reference or consignee..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-10"
                    />
                </div>
                <div className="w-full sm:w-[200px]">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as ShipmentStatus | "all")}
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        <option value="all">All Status</option>
                        {Object.entries(statusConfig).map(([key, { label }]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Shipments List */}
                <div className="lg:col-span-2">
                    <Card className="h-[600px] flex flex-col">
                        <CardHeader className="border-b px-6 py-4">
                            <CardTitle className="text-base font-semibold">
                                Shipments ({filteredShipments.length})
                            </CardTitle>
                        </CardHeader>
                        <div className="flex-1 overflow-y-auto p-0">
                            {filteredShipments.length === 0 ? (
                                <IllustratedEmptyState type="tracking" />
                            ) : (
                                <div className="divide-y divide-border">
                                    {filteredShipments.map((shipment) => {
                                        const status = statusConfig[shipment.status] || statusConfig.booked;
                                        const StatusIcon = status.icon;

                                        return (
                                            <div
                                                key={shipment.id}
                                                className="group p-4 hover:bg-muted/50 transition-all cursor-pointer"
                                                onClick={() => handleTrack(shipment.reference)}
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-start gap-4">
                                                        <div className={cn("p-2.5 rounded-lg border shadow-sm transition-colors group-hover:border-primary/20 group-hover:bg-background", 
                                                            status.className?.includes("bg-primary") ? "bg-primary/5 border-primary/10" : "bg-muted/30 border-transparent"
                                                        )}>
                                                            <StatusIcon className={cn("w-5 h-5", status.variant === "default" ? "text-primary" : "text-muted-foreground")} />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="font-mono text-sm font-medium text-foreground tracking-tight">
                                                                    {shipment.reference}
                                                                </span>
                                                                <Badge variant={status.variant} className={cn("text-[10px] px-1.5 py-0 h-5 font-normal", status.className)}>
                                                                    {status.label}
                                                                </Badge>
                                                            </div>
                                                            <div className="text-sm text-muted-foreground font-medium">
                                                                {shipment.consignee_name || "Unknown Consignee"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                                                <MoreHorizontal className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleTrack(shipment.reference)}>
                                                                View Timeline
                                                            </DropdownMenuItem>
                                                            {shipment.status !== "delivered" && (
                                                                <DropdownMenuItem onClick={() => handleMarkDelivered(shipment.id)}>
                                                                    Mark as Delivered
                                                                </DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                                
                                                <div className="flex items-center gap-4 text-xs text-muted-foreground ml-13">
                                                    <div className="flex items-center gap-1.5 min-w-0">
                                                        <span className="font-mono bg-muted/50 px-1.5 py-0.5 rounded text-[10px]">{shipment.origin_warehouse?.code || "ORG"}</span>
                                                        <ArrowRight className="w-3 h-3 flex-shrink-0 opacity-50" />
                                                        <span className="font-mono bg-muted/50 px-1.5 py-0.5 rounded text-[10px]">{shipment.destination_warehouse?.code || "DST"}</span>
                                                    </div>
                                                    <div className="w-1 h-1 rounded-full bg-border" />
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar className="w-3 h-3 opacity-70" />
                                                        <span>{new Date(shipment.updated_at).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Timeline Panel */}
                <Card className="h-[600px] flex flex-col border-l-4 border-l-primary/20 shadow-lg">
                    <CardHeader className="border-b px-6 py-4 bg-muted/5">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            Tracking Timeline
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="flex-1 overflow-y-auto p-6">
                        {selectedShipment ? (
                            <div className="space-y-6">
                                <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="font-mono text-sm font-bold text-foreground tracking-tight">{selectedShipment.reference}</div>
                                        <Badge variant="outline" className="capitalize">{selectedShipment.status.replace(/_/g, " ")}</Badge>
                                    </div>
                                    <div className="text-sm font-medium text-foreground mb-3">{selectedShipment.consignee_name}</div>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground bg-background p-2 rounded-lg border border-border/50 shadow-sm">
                                        <span className="font-medium">{selectedShipment.origin}</span>
                                        <ArrowRight className="w-3 h-3 text-primary/50" />
                                        <span className="font-medium">{selectedShipment.destination}</span>
                                    </div>
                                </div>

                                <div className="relative pl-4 space-y-6 before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-primary/20 before:via-border before:to-transparent">
                                    {selectedShipment.events.length === 0 ? (
                                        <div className="text-xs text-muted-foreground mt-1">No tracking events yet</div>
                                    ) : (
                                        selectedShipment.events.map((event, idx) => {
                                            const isLatest = idx === 0;
                                            return (
                                                <div key={idx} className="relative group">
                                                    <div className={cn(
                                                        "absolute -left-[19px] w-3 h-3 rounded-full border-2 ring-4 ring-background transition-all",
                                                        isLatest
                                                            ? "bg-primary border-primary ring-primary/10 scale-110"
                                                            : "bg-background border-muted-foreground/30 group-hover:border-primary/50"
                                                    )} />
                                                    <div className={cn(
                                                        "ml-4 transition-all",
                                                        isLatest ? "opacity-100" : "opacity-80 group-hover:opacity-100"
                                                    )}>
                                                        <div className="flex flex-col gap-1">
                                                            <div className="text-sm font-semibold text-foreground capitalize flex items-center gap-2">
                                                                {event.status.replace(/_/g, " ")}
                                                                {isLatest && <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground font-mono">
                                                                {new Date(event.created_at).toLocaleString(undefined, {
                                                                    dateStyle: "medium",
                                                                    timeStyle: "short"
                                                                })}
                                                            </div>
                                                        </div>
                                                        {event.description && (
                                                            <div className="mt-2 text-sm text-muted-foreground bg-muted/30 p-2 rounded-md border border-transparent group-hover:border-border transition-colors">
                                                                {event.description}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-4">
                                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                                    <Package className="w-8 h-8 text-muted-foreground/50" />
                                </div>
                                <h3 className="text-sm font-semibold text-foreground mb-1">No Shipment Selected</h3>
                                <p className="text-xs text-muted-foreground max-w-[200px]">
                                    Select a shipment from the list to view its detailed tracking timeline
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
