"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    MoreHorizontal,
    ArrowRight,
    Plus,
    Package,
    Truck,
    CheckCircle,
    Clock,
    AlertCircle,
    XCircle,
    RefreshCw,
    Tag,
    Trash
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PageShell } from "@/components/dashboard/page-shell";
import { DataTable } from "@/components/dashboard/data-table-premium";
import { ShipmentWizard } from "@/components/shipments/shipment-wizard";
import { ShipmentDrawer } from "@/components/dashboard/shipment-drawer";
import { generateLabelInvoice } from "@/app/actions/invoices";
import { updateShipmentStatus, deleteShipment } from "@/app/actions/shipments";
import type { ShipmentStatus, Warehouse, Customer, TransportMode } from "@/types/database";

// --- Types ---

interface Shipment {
    id: string;
    reference: string;
    created_at: string;
    updated_at: string;
    origin_warehouse: { name: string; code: string } | null;
    destination_warehouse: { name: string; code: string } | null;
    pieces: number | null;
    weight_kg: number | null;
    status: ShipmentStatus;
    transport_mode: TransportMode | null;
    consignee_name: string | null;
    consignee_city: string | null;
}

interface ShipmentsTableClientProps {
    initialShipments: Shipment[];
    warehouses: Warehouse[];
    customers: Customer[];
}

// --- Configuration ---

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; className?: string; icon: React.ElementType }> = {
    booked: { label: "Booked", variant: "secondary", className: "bg-muted text-muted-foreground border-border", icon: Clock },
    picked_up: { label: "Picked Up", variant: "default", className: "bg-primary/5 text-primary border-primary/20", icon: Package },
    at_origin_hub: { label: "At Origin Hub", variant: "default", className: "bg-primary/5 text-primary border-primary/20", icon: Package },
    in_transit: { label: "In Transit", variant: "default", className: "bg-primary/10 text-primary border-primary/20", icon: Truck },
    at_destination_hub: { label: "At Dest. Hub", variant: "default", className: "bg-primary/5 text-primary border-primary/20", icon: Package },
    out_for_delivery: { label: "Out for Delivery", variant: "default", className: "bg-warning/10 text-warning border-warning/20", icon: Truck },
    delivered: { label: "Delivered", variant: "default", className: "bg-primary/20 text-primary border-primary/20", icon: CheckCircle },
    exception: { label: "Exception", variant: "destructive", className: "bg-destructive/10 text-destructive border-destructive/20", icon: AlertCircle },
    returned: { label: "Returned", variant: "destructive", className: "bg-warning/10 text-warning border-warning/20", icon: RefreshCw },
    cancelled: { label: "Cancelled", variant: "secondary", className: "bg-muted text-muted-foreground border-border", icon: XCircle },
};

// --- Main Component ---

export function ShipmentsTableClient({
    initialShipments,
    warehouses,
    customers
}: ShipmentsTableClientProps) {
    const router = useRouter();
    const [shipments, setShipments] = useState(initialShipments);
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

    // -- Actions --

    const handleGenerateLabel = async (shipmentId: string) => {
        const result = await generateLabelInvoice({ shipmentId });
        if (result.success) toast.success("Label generated successfully");
        else toast.error(result.error);
    };

    const handleUpdateStatus = async (shipmentId: string, status: ShipmentStatus) => {
        const result = await updateShipmentStatus(shipmentId, status);
        if (result.success) {
            setShipments(prev => prev.map(s => s.id === shipmentId ? { ...s, status } : s));
            toast.success("Status updated");
        } else {
            toast.error(result.error);
        }
    };

    const handleDelete = async (shipmentId: string) => {
        const result = await deleteShipment(shipmentId);
        if (result.success) {
            setShipments(prev => prev.filter(s => s.id !== shipmentId));
            toast.success("Shipment cancelled");
        } else {
            toast.error(result.error);
        }
    };

    // -- Columns Definition --

    const columns: ColumnDef<Shipment>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                    className="translate-y-[2px]"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    className="translate-y-[2px]"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "reference",
            header: "Details",
            cell: ({ row }) => (
                <div
                    className="flex flex-col cursor-pointer group"
                    onClick={() => setSelectedShipment(row.original)}
                >
                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {row.getValue("reference")}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                        {new Date(row.original.created_at).toLocaleDateString()}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string;
                const config = statusConfig[status] || statusConfig.booked;
                const Icon = config.icon;

                return (
                    <Badge variant="outline" className={config.className}>
                        <Icon className="w-3 h-3 mr-1.5" />
                        {config.label}
                    </Badge>
                )
            },
        },
        {
            accessorKey: "route",
            header: "Route",
            cell: ({ row }) => (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex flex-col items-center">
                        <span className="font-mono text-xs font-medium bg-muted px-1.5 py-0.5 rounded text-foreground">
                            {row.original.origin_warehouse?.code || "N/A"}
                        </span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-muted-foreground/50" />
                    <div className="flex flex-col items-center">
                        <span className="font-mono text-xs font-medium bg-muted px-1.5 py-0.5 rounded text-foreground">
                            {row.original.destination_warehouse?.code || "N/A"}
                        </span>
                    </div>
                </div>
            )
        },
        {
            accessorKey: "consignee_name",
            header: "Consignee",
            cell: ({ row }) => (
                <div className="flex flex-col text-sm">
                    <span className="font-medium text-foreground">{row.getValue("consignee_name")}</span>
                    <span className="text-xs text-muted-foreground">
                        {row.original.consignee_city}
                    </span>
                </div>
            )
        },
        {
            accessorKey: "info",
            header: "Info",
            cell: ({ row }) => (
                <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                    <span>{row.original.pieces} pcs</span>
                    <span className="text-muted-foreground/70">{row.original.weight_kg} kg</span>
                </div>
            )
        },
        {
            id: "actions",
            cell: ({ row }) => (
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
                            <DropdownMenuItem onClick={() => setSelectedShipment(row.original)}>
                                Quick View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/dashboard/shipments/${row.original.id}`)}>
                                Full Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>Update Status</DropdownMenuSubTrigger>
                                <DropdownMenuSubContent>
                                    {Object.entries(statusConfig).map(([key, config]) => (
                                        <DropdownMenuItem key={key} onClick={() => handleUpdateStatus(row.original.id, key as ShipmentStatus)}>
                                            <config.icon className="mr-2 h-4 w-4" />
                                            {config.label}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            <DropdownMenuItem onClick={() => toast.info("Driver assignment coming soon")}>
                                <Truck className="mr-2 h-4 w-4" /> Assign Driver
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleGenerateLabel(row.original.id)}>
                                <Tag className="mr-2 h-4 w-4" /> Generate Label
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(row.original.id)} className="text-destructive focus:text-destructive">
                                <Trash className="mr-2 h-4 w-4" /> Cancel Shipment
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        }
    ];

    // -- Render --

    return (
        <PageShell
            title="Shipments"
            description="Manage your logistics operations, track shipments, and oversee deliveries."
            breadcrumb={["Dashboard", "Operations", "Shipments"]}
            action={
                <Button onClick={() => setIsWizardOpen(true)} className="rounded-full shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    New Shipment
                </Button>
            }
        >
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-primary rounded-2xl p-6 text-primary-foreground shadow-xl shadow-primary/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Package className="w-24 h-24" />
                    </div>
                    <p className="text-primary-foreground/80 text-sm font-medium mb-1">Total Shipments</p>
                    <h3 className="text-4xl font-bold tracking-tight">{shipments.length}</h3>
                    <div className="mt-4 flex items-center text-xs text-primary-foreground font-medium bg-primary-foreground/10 w-fit px-2 py-1 rounded-full border border-primary-foreground/10">
                        <span className="mr-1">Active Network</span>
                    </div>
                </div>

                <div className="bg-card rounded-2xl p-6 border border-border shadow-sm relative overflow-hidden group hover:border-primary/50 transition-colors">
                    <div className="flex justify-between items-start z-10 relative">
                        <div>
                            <p className="text-muted-foreground text-sm font-medium mb-1">In Transit</p>
                            <h3 className="text-3xl font-bold text-foreground">
                                {shipments.filter(s => s.status === 'in_transit').length}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-2">Moving across hubs</p>
                        </div>
                        <div className="p-3 bg-primary/10 rounded-xl text-primary">
                            <Truck className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="absolute -bottom-4 -right-4 text-primary/5 opacity-[0.03] rotate-12 group-hover:scale-110 transition-transform">
                        <Truck className="w-32 h-32" />
                    </div>
                </div>

                <div className="bg-card rounded-2xl p-6 border border-border shadow-sm relative overflow-hidden group hover:border-primary/50 transition-colors">
                    <div className="flex justify-between items-start z-10 relative">
                        <div>
                            <p className="text-muted-foreground text-sm font-medium mb-1">Delivered (Today)</p>
                            <h3 className="text-3xl font-bold text-foreground">
                                {shipments.filter(s => s.status === 'delivered').length}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-2">Successful drop-offs</p>
                        </div>
                        <div className="p-3 bg-primary/10 rounded-xl text-primary">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={shipments}
                filterColumn="reference"
                filterPlaceholder="Search by reference..."
            />

            <ShipmentDrawer
                open={!!selectedShipment}
                onOpenChange={(open) => !open && setSelectedShipment(null)}
                shipment={selectedShipment}
            />

            <Dialog open={isWizardOpen} onOpenChange={setIsWizardOpen}>
                <DialogContent className="max-w-4xl h-[90vh] p-0 overflow-hidden">
                    <ShipmentWizard
                        warehouses={warehouses}
                        customers={customers}
                        onSuccess={(newShipment) => {
                            setShipments(prev => [newShipment as Shipment, ...prev]);
                            toast.success("Shipment created successfully!");
                            setIsWizardOpen(false);
                        }}
                        onCancel={() => setIsWizardOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </PageShell>
    );
}

