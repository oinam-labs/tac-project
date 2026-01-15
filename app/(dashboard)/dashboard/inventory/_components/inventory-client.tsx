"use client";

import React, { useState } from "react";
import {
    Package,
    MapPin,
    ArrowRight,
    Clock,
    MoreHorizontal,
    Box,
    AlertTriangle,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { PageShell } from "@/components/dashboard/page-shell";
import { DataTable } from "@/components/dashboard/data-table-premium";
import type { ShipmentStatus } from "@/types/database";

// --- Types ---

interface Warehouse {
    id: string;
    name: string;
    code: string;
}

interface InventoryItem {
    id: string;
    reference: string;
    status: ShipmentStatus;
    consignee_name: string | null;
    consignee_city: string | null;
    pieces: number | null;
    weight_kg: number | null;
    manifest_id: string | null;
    created_at: string;
    origin_warehouse: { id: string; name: string; code: string } | null;
    destination_warehouse: { id: string; name: string; code: string } | null;
    manifests: { manifest_number: string; status: string } | null;
}

interface InventoryClientProps {
    warehouses: Warehouse[];
    initialInventory: InventoryItem[];
}

// --- Configuration ---

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; className?: string }> = {
    booked: { label: "Booked", variant: "secondary", className: "bg-muted text-muted-foreground border-border" },
    picked_up: { label: "Picked Up", variant: "default", className: "bg-primary/10 text-primary border-primary/20" },
    at_origin_hub: { label: "At Origin Hub", variant: "default", className: "bg-primary/20 text-primary border-primary/20" },
    in_transit: { label: "In Transit", variant: "default", className: "bg-info/10 text-info border-info/20" },
    at_destination_hub: { label: "At Dest Hub", variant: "default", className: "bg-primary/20 text-primary border-primary/20" },
    out_for_delivery: { label: "Out for Delivery", variant: "default", className: "bg-warning/10 text-warning border-warning/20" },
    delivered: { label: "Delivered", variant: "default", className: "bg-success/10 text-success border-success/20" },
    exception: { label: "Exception", variant: "destructive", className: "bg-destructive/10 text-destructive border-destructive/20" },
    returned: { label: "Returned", variant: "destructive", className: "bg-warning/10 text-warning border-warning/20" },
    cancelled: { label: "Cancelled", variant: "secondary", className: "text-muted-foreground" },
};

// --- Main Component ---

export function InventoryClient({ warehouses, initialInventory }: InventoryClientProps) {
    const [inventory] = useState<InventoryItem[]>(initialInventory);


    // -- Columns --

    const columns: ColumnDef<InventoryItem>[] = [
        {
            accessorKey: "reference",
            header: "Control ID",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-foreground">{row.getValue("reference")}</span>
                    {row.original.manifests ? (
                        <span className="text-[10px] text-primary bg-primary/10 px-1 rounded w-fit mt-0.5">
                            {row.original.manifests.manifest_number}
                        </span>
                    ) : (
                        <span className="text-[10px] text-muted-foreground mt-0.5">No Manifest</span>
                    )}
                </div>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string;
                const config = statusConfig[status] || statusConfig.booked;
                return (
                    <Badge variant="outline" className={cn("rounded-md", config.className)}>
                        {config.label}
                    </Badge>
                );
            },
        },
        {
            header: "Route",
            cell: ({ row }) => (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-mono text-xs font-medium bg-muted px-1.5 py-0.5 rounded text-foreground">
                        {row.original.origin_warehouse?.code}
                    </span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground/50" />
                    <span className="font-mono text-xs font-medium bg-muted px-1.5 py-0.5 rounded text-foreground">
                        {row.original.destination_warehouse?.code}
                    </span>
                </div>
            )
        },
        {
            header: "Consignee",
            cell: ({ row }) => (
                <div className="flex flex-col text-sm max-w-[150px]">
                    <span className="truncate text-foreground font-medium">{row.original.consignee_name || "—"}</span>
                    <span className="truncate text-xs text-muted-foreground">{row.original.consignee_city}</span>
                </div>
            )
        },
        {
            header: "Dimensions",
            cell: ({ row }) => (
                <div className="flex gap-3 text-xs text-muted-foreground">
                    <span>{row.original.pieces} pcs</span>
                    <span className="text-muted-foreground/30">|</span>
                    <span>{row.original.weight_kg} kg</span>
                </div>
            )
        },
        {
            id: "actions",
            cell: () => (
                <div className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Update Status</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Mark as Lost</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        }
    ];

    // -- Stats --
    const totalPieces = inventory.reduce((sum, item) => sum + (item.pieces || 0), 0);
    const unmanifested = inventory.filter(i => !i.manifest_id).length;
    const exceptions = inventory.filter(i => i.status === 'exception').length;

    // -- Render --

    return (
        <PageShell
            title="Inventory"
            description="Track items across the network, manage stock levels, and monitor holding times."
            breadcrumb={["Dashboard", "Operations", "Inventory"]}
            action={
                <Button
                    className="rounded-full shadow-lg shadow-primary/20"
                    onClick={() => window.location.href = '/dashboard/shipments?action=create'}
                >
                    <Box className="w-4 h-4 mr-2" />
                    Add Item
                </Button>
            }
        >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-card rounded-xl p-4 border border-border shadow-sm flex flex-col">
                    <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1">Total Items</span>
                    <div className="flex items-end justify-between">
                        <span className="text-2xl font-bold text-foreground">{inventory.length}</span>
                        <Package className="w-5 h-5 text-muted-foreground" />
                    </div>
                </div>
                <div className="bg-card rounded-xl p-4 border border-border shadow-sm flex flex-col">
                    <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1">Total Pieces</span>
                    <div className="flex items-end justify-between">
                        <span className="text-2xl font-bold text-foreground">{totalPieces}</span>
                        <Box className="w-5 h-5 text-primary" />
                    </div>
                </div>
                <div className="bg-card rounded-xl p-4 border border-border shadow-sm flex flex-col">
                    <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1">Unmanifested</span>
                    <div className="flex items-end justify-between">
                        <span className="text-2xl font-bold text-foreground">{unmanifested}</span>
                        <Clock className="w-5 h-5 text-warning" />
                    </div>
                </div>
                <div className="bg-destructive/10 rounded-xl p-4 border border-destructive/20 shadow-sm flex flex-col">
                    <span className="text-destructive text-xs font-medium uppercase tracking-wider mb-1">Exceptions</span>
                    <div className="flex items-end justify-between">
                        <span className="text-2xl font-bold text-destructive">{exceptions}</span>
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                    </div>
                </div>
            </div>

            <Tabs defaultValue="list" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="list">Inventory List</TabsTrigger>
                    <TabsTrigger value="warehouses">Warehouse Summary</TabsTrigger>
                </TabsList>

                <TabsContent value="list" className="space-y-4">
                    <DataTable
                        columns={columns}
                        data={inventory}
                        filterColumn="reference"
                        filterPlaceholder="Search inventory by reference..."
                    />
                </TabsContent>

                <TabsContent value="warehouses">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {warehouses.map((warehouse) => {
                            const items = inventory.filter(
                                (item) =>
                                    item.origin_warehouse?.id === warehouse.id ||
                                    item.destination_warehouse?.id === warehouse.id
                            );

                            if (items.length === 0) return null;

                            return (
                                <Card key={warehouse.id} className="hover:shadow-md transition-all">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                                                    <MapPin className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-base font-semibold">{warehouse.name}</CardTitle>
                                                    <p className="text-xs text-muted-foreground font-mono">{warehouse.code}</p>
                                                </div>
                                            </div>
                                            <Badge variant="secondary">{items.length} items</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div className="p-3 bg-muted/50 rounded-lg border border-border">
                                                <div className="text-xs text-muted-foreground mb-1">Total Pcs</div>
                                                <div className="font-semibold text-foreground">{items.reduce((acc, i) => acc + (i.pieces || 0), 0)}</div>
                                            </div>
                                            <div className="p-3 bg-muted/50 rounded-lg border border-border">
                                                <div className="text-xs text-muted-foreground mb-1">Total Weight</div>
                                                <div className="font-semibold text-foreground">{items.reduce((acc, i) => acc + (i.weight_kg || 0), 0)} kg</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </TabsContent>
            </Tabs>
        </PageShell>
    );
}
