"use client";

import React, { useState } from "react";
import {
    Truck,
    Plane,
    Package,
    Clock,
    MapPin,
    Phone,
    User,
    Search,
    Filter,
    RefreshCw,
    CheckCircle2,
    AlertCircle,
    Timer,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface Warehouse {
    id: string;
    name: string;
    code: string;
    city: string;
}

interface Route {
    id: string;
    manifest_number: string;
    status: string;
    transport_mode: string;
    vehicle_number: string | null;
    driver_name: string | null;
    driver_phone: string | null;
    planned_departure: string;
    actual_departure: string | null;
    planned_arrival: string;
    actual_arrival: string | null;
    total_pieces: number | null;
    total_weight: number | null;
    origin_warehouse: Warehouse | null;
    destination_warehouse: Warehouse | null;
}

interface RouteStats {
    active: number;
    completedToday: number;
    pending: number;
}

interface RouteTrackerClientProps {
    routes: Route[];
    stats: RouteStats;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    draft: { label: "Draft", color: "bg-muted text-muted-foreground", icon: Clock },
    finalized: { label: "Ready", color: "bg-warning/10 text-warning", icon: Timer },
    dispatched: { label: "In Transit", color: "bg-primary/10 text-primary", icon: Truck },
    received: { label: "Delivered", color: "bg-success/10 text-success", icon: CheckCircle2 },
};

const modeConfig: Record<string, { label: string; icon: React.ElementType }> = {
    air: { label: "Air", icon: Plane },
    surface: { label: "Surface", icon: Truck },
    express: { label: "Express", icon: Truck },
    economy: { label: "Economy", icon: Package },
};

export function RouteTrackerClient({ routes, stats }: RouteTrackerClientProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);

    const filteredRoutes = routes.filter((route) => {
        const matchesSearch =
            route.manifest_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
            route.vehicle_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            route.driver_name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || route.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const formatDateTime = (dateStr: string | null) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const calculateETA = (route: Route) => {
        if (route.actual_arrival) return "Arrived";
        if (!route.planned_arrival) return "Unknown";
        
        const eta = new Date(route.planned_arrival);
        const now = new Date();
        const diff = eta.getTime() - now.getTime();
        
        if (diff < 0) return "Delayed";
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (hours > 24) {
            const days = Math.floor(hours / 24);
            return `${days}d ${hours % 24}h`;
        }
        return `${hours}h ${minutes}m`;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Route Tracker</h1>
                    <p className="text-muted-foreground">
                        Monitor shipment routes and delivery status in real-time
                    </p>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Truck className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.active}</p>
                                <p className="text-sm text-muted-foreground">Active Routes</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-success/10">
                                <CheckCircle2 className="h-5 w-5 text-success" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.completedToday}</p>
                                <p className="text-sm text-muted-foreground">Completed Today</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-warning/10">
                                <Timer className="h-5 w-5 text-warning" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.pending}</p>
                                <p className="text-sm text-muted-foreground">Pending Dispatch</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by manifest, vehicle, or driver..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="dispatched">In Transit</SelectItem>
                                <SelectItem value="finalized">Ready</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="received">Delivered</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Routes List & Detail */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Routes List */}
                <Card className="lg:col-span-2">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-medium">
                            Routes ({filteredRoutes.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <ScrollArea className="h-[500px]">
                            {filteredRoutes.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <Truck className="h-12 w-12 text-muted-foreground/30 mb-4" />
                                    <p className="text-muted-foreground">No routes found</p>
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {filteredRoutes.map((route) => {
                                        const status = statusConfig[route.status] || statusConfig.draft;
                                        const mode = modeConfig[route.transport_mode] || modeConfig.surface;
                                        const StatusIcon = status.icon;
                                        const ModeIcon = mode.icon;
                                        const eta = calculateETA(route);

                                        return (
                                            <div
                                                key={route.id}
                                                className={cn(
                                                    "p-4 cursor-pointer transition-colors hover:bg-muted/50",
                                                    selectedRoute?.id === route.id && "bg-muted"
                                                )}
                                                onClick={() => setSelectedRoute(route)}
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="font-mono font-medium">
                                                                {route.manifest_number}
                                                            </span>
                                                            <Badge className={cn("text-xs", status.color)}>
                                                                <StatusIcon className="h-3 w-3 mr-1" />
                                                                {status.label}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                            <span className="flex items-center gap-1">
                                                                <ModeIcon className="h-3 w-3" />
                                                                {mode.label}
                                                            </span>
                                                            {route.vehicle_number && (
                                                                <span>{route.vehicle_number}</span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-2 text-sm">
                                                            <span className="text-muted-foreground">
                                                                {route.origin_warehouse?.code || "N/A"}
                                                            </span>
                                                            <span className="text-muted-foreground">→</span>
                                                            <span className="text-muted-foreground">
                                                                {route.destination_warehouse?.code || "N/A"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className={cn(
                                                            "text-sm font-medium",
                                                            eta === "Delayed" ? "text-destructive" : "text-foreground"
                                                        )}>
                                                            {eta === "Arrived" ? (
                                                                <span className="text-success">Arrived</span>
                                                            ) : eta === "Delayed" ? (
                                                                <span className="flex items-center gap-1">
                                                                    <AlertCircle className="h-3 w-3" />
                                                                    Delayed
                                                                </span>
                                                            ) : (
                                                                <span>ETA: {eta}</span>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground mt-1">
                                                            {route.total_pieces || 0} pcs • {route.total_weight || 0} kg
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </ScrollArea>
                    </CardContent>
                </Card>

                {/* Route Detail */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-medium">Route Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {selectedRoute ? (
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Manifest</p>
                                    <p className="font-mono font-medium">{selectedRoute.manifest_number}</p>
                                </div>
                                
                                <Separator />
                                
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="p-1.5 rounded bg-primary/10">
                                            <MapPin className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Origin</p>
                                            <p className="font-medium">
                                                {selectedRoute.origin_warehouse?.name || "N/A"}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {selectedRoute.origin_warehouse?.city}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-1.5 rounded bg-success/10">
                                            <MapPin className="h-4 w-4 text-success" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Destination</p>
                                            <p className="font-medium">
                                                {selectedRoute.destination_warehouse?.name || "N/A"}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {selectedRoute.destination_warehouse?.city}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Planned Departure</p>
                                        <p className="text-sm font-medium">
                                            {formatDateTime(selectedRoute.planned_departure)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Actual Departure</p>
                                        <p className="text-sm font-medium">
                                            {formatDateTime(selectedRoute.actual_departure)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Planned Arrival</p>
                                        <p className="text-sm font-medium">
                                            {formatDateTime(selectedRoute.planned_arrival)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Actual Arrival</p>
                                        <p className="text-sm font-medium">
                                            {formatDateTime(selectedRoute.actual_arrival)}
                                        </p>
                                    </div>
                                </div>

                                {(selectedRoute.driver_name || selectedRoute.vehicle_number) && (
                                    <>
                                        <Separator />
                                        <div className="space-y-2">
                                            {selectedRoute.driver_name && (
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm">{selectedRoute.driver_name}</span>
                                                </div>
                                            )}
                                            {selectedRoute.driver_phone && (
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                                    <a 
                                                        href={`tel:${selectedRoute.driver_phone}`}
                                                        className="text-sm text-primary hover:underline"
                                                    >
                                                        {selectedRoute.driver_phone}
                                                    </a>
                                                </div>
                                            )}
                                            {selectedRoute.vehicle_number && (
                                                <div className="flex items-center gap-2">
                                                    <Truck className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm">{selectedRoute.vehicle_number}</span>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}

                                <Separator />

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Total Pieces</p>
                                        <p className="text-lg font-bold">{selectedRoute.total_pieces || 0}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Total Weight</p>
                                        <p className="text-lg font-bold">{selectedRoute.total_weight || 0} kg</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Package className="h-12 w-12 text-muted-foreground/30 mb-4" />
                                <p className="text-muted-foreground">Select a route to view details</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
