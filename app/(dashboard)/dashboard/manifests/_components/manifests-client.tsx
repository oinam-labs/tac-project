"use client";

import React, { useState, useTransition } from "react";
import {
    Plus,
    Lock,
    Truck,
    Package,
    ArrowRight,
    CheckCircle,
    FileText,
    MoreHorizontal,
    Calendar,
    User,
    Weight,
    Layers,
    MapPin,
    AlertCircle
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

import { PageShell } from "@/components/dashboard/page-shell";
import { DataTable } from "@/components/dashboard/data-table-premium";
import {
    createManifest,
    lockManifest,
    dispatchManifest,
    addShipmentToManifest
} from "@/app/actions/manifests";
import type { ManifestStatus } from "@/types/database";

// --- Types ---

interface Manifest {
    id: string;
    manifest_number: string;
    status: ManifestStatus;
    transport_mode: string | null;
    vehicle_number: string | null;
    driver_name: string | null;
    planned_departure: string | null;
    actual_departure: string | null;
    total_pieces: number | null;
    total_weight: number | null;
    origin_warehouse: { name: string; code: string } | null;
    destination_warehouse: { name: string; code: string } | null;
    created_at: string;
}

interface Shipment {
    id: string;
    reference: string;
    consignee_name: string | null;
    consignee_city: string | null;
    pieces: number | null;
    weight_kg: number | null;
    origin_warehouse: { name: string; code: string } | null;
    destination_warehouse: { name: string; code: string } | null;
}

interface Warehouse {
    id: string;
    name: string;
    code: string;
}

interface ManifestsClientProps {
    initialManifests: Manifest[];
    unassignedShipments: Shipment[];
    warehouses: Warehouse[];
}

// --- Configuration ---

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; className?: string; icon: React.ElementType }> = {
    draft: { label: "Draft", variant: "secondary", className: "bg-muted text-muted-foreground border-border", icon: FileText },
    finalized: { label: "Finalized", variant: "default", className: "bg-warning/10 text-warning border-warning/20", icon: Lock },
    dispatched: { label: "Dispatched", variant: "default", className: "bg-primary/20 text-primary border-primary/20", icon: Truck },
    in_transit: { label: "In Transit", variant: "default", className: "bg-primary/10 text-primary border-primary/20", icon: Truck },
    arrived: { label: "Arrived", variant: "default", className: "bg-primary/20 text-primary border-primary/20", icon: MapPin },
    completed: { label: "Completed", variant: "secondary", className: "bg-primary/10 text-primary border-primary/20", icon: CheckCircle },
};

// --- Main Component ---

export function ManifestsClient({
    initialManifests,
    unassignedShipments: initialUnassigned,
    warehouses
}: ManifestsClientProps) {
    const [manifests, setManifests] = useState<Manifest[]>(initialManifests);
    const [unassigned, setUnassigned] = useState<Shipment[]>(initialUnassigned);
    const [isCreateOpen, setIsCreateOpen] = useState(false);


    const draftManifests = manifests.filter(m => m.status === "draft");

    // -- Actions --

    const handleLock = async (manifestId: string) => {
        const result = await lockManifest(manifestId);
        if (result.success) {
            setManifests(prev => prev.map(m => m.id === manifestId ? { ...m, status: "finalized" as ManifestStatus } : m));
            toast.success("Manifest locked successfully");
        } else {
            toast.error(result.error);
        }
    };

    const handleDispatch = async (manifestId: string) => {
        const result = await dispatchManifest(manifestId);
        if (result.success) {
            setManifests(prev => prev.map(m => m.id === manifestId ? { ...m, status: "dispatched" as ManifestStatus } : m));
            toast.success("Manifest dispatched successfully");
        } else {
            toast.error(result.error);
        }
    };

    const handleAddToManifest = async (manifestId: string, shipmentRef: string) => {
        const result = await addShipmentToManifest(manifestId, shipmentRef);
        if (result.success) {
            setUnassigned(prev => prev.filter(s => s.reference !== shipmentRef));
            toast.success("Shipment added to manifest");
        } else {
            toast.error(result.error);
        }
    };

    // -- Columns: Manifests --

    const manifestColumns: ColumnDef<Manifest>[] = [
        {
            accessorKey: "manifest_number",
            header: "Manifest ID",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-foreground">{row.getValue("manifest_number")}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
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
                const config = statusConfig[status] || statusConfig.draft;
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
                <div className="flex items-center gap-2 text-sm text-foreground">
                    <div className="flex flex-col items-center">
                        <span className="font-mono text-xs font-medium bg-muted px-1.5 py-0.5 rounded text-foreground">
                            {row.original.origin_warehouse?.code || "N/A"}
                        </span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-muted-foreground/50" />
                    <div className="flex flex-col items-center">
                        <span className="font-mono text-xs font-medium bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                            {row.original.destination_warehouse?.code || "N/A"}
                        </span>
                    </div>
                </div>
            )
        },
        {
            header: "Driver & Vehicle",
            cell: ({ row }) => (
                <div className="flex flex-col text-sm">
                    {row.original.driver_name ? (
                        <>
                            <span className="flex items-center gap-1 text-foreground">
                                <User className="w-3 h-3 text-muted-foreground" /> {row.original.driver_name}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Truck className="w-3 h-3 text-muted-foreground" /> {row.original.vehicle_number}
                            </span>
                        </>
                    ) : (
                        <span className="text-muted-foreground/50 italic text-xs">Unassigned</span>
                    )}
                </div>
            )
        },
        {
            header: "Load",
            cell: ({ row }) => (
                <div className="flex flex-col gap-1 text-xs">
                    <span className="flex items-center gap-1 text-muted-foreground">
                        <Layers className="w-3 h-3" /> {row.original.total_pieces || 0} pcs
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                        <Weight className="w-3 h-3" /> {row.original.total_weight || 0} kg
                    </span>
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
                            <DropdownMenuSeparator />
                            {row.original.status === 'draft' && (
                                <DropdownMenuItem onClick={() => handleLock(row.original.id)}>
                                    <Lock className="mr-2 h-4 w-4" /> Lock Manifest
                                </DropdownMenuItem>
                            )}
                            {row.original.status === 'finalized' && (
                                <DropdownMenuItem onClick={() => handleDispatch(row.original.id)}>
                                    <Truck className="mr-2 h-4 w-4" /> Dispatch
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        }
    ];

    // -- Columns: Unassigned Shipments --

    const shipmentColumns: ColumnDef<Shipment>[] = [
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
            header: "Reference",
            cell: ({ row }) => <span className="font-medium">{row.getValue("reference")}</span>
        },
        {
            accessorKey: "route",
            header: "Route",
            cell: ({ row }) => (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="bg-muted px-1.5 rounded text-foreground">{row.original.origin_warehouse?.code}</span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground/30" />
                    <span className="bg-muted px-1.5 rounded text-foreground">{row.original.destination_warehouse?.code}</span>
                </div>
            )
        },
        {
            accessorKey: "details",
            header: "Details",
            cell: ({ row }) => (
                <div className="text-xs text-muted-foreground">
                    {row.original.pieces} pcs • {row.original.weight_kg} kg
                </div>
            )
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                            Actions
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Add to Manifest</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {draftManifests.length > 0 ? (
                            draftManifests.map(m => (
                                <DropdownMenuItem key={m.id} onClick={() => handleAddToManifest(m.id, row.original.reference)}>
                                    {m.manifest_number} ({m.destination_warehouse?.code})
                                </DropdownMenuItem>
                            ))
                        ) : (
                            <DropdownMenuItem disabled>No draft manifests</DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    ];


    return (
        <PageShell
            title="Manifests"
            description="Consolidate shipments, assign drivers, and manage linehaul transport."
            breadcrumb={["Dashboard", "Operations", "Manifests"]}
            action={
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-full shadow-lg shadow-primary/20">
                            <Plus className="w-4 h-4 mr-2" />
                            New Manifest
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Manifest</DialogTitle>
                            <DialogDescription>
                                Fill in the details below to create a new manifest for shipping.
                            </DialogDescription>
                        </DialogHeader>
                        <CreateManifestForm
                            warehouses={warehouses}
                            onSuccess={(newManifest) => {
                                setManifests(prev => [newManifest as Manifest, ...prev]);
                                setIsCreateOpen(false);
                                toast.success("Manifest created successfully");
                            }}
                        />
                    </DialogContent>
                </Dialog>
            }
        >
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-card rounded-xl p-4 border border-border shadow-sm flex flex-col">
                    <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1">Open Drafts</span>
                    <div className="flex items-end justify-between">
                        <span className="text-2xl font-bold text-foreground">{draftManifests.length}</span>
                        <FileText className="w-5 h-5 text-muted-foreground" />
                    </div>
                </div>
                <div className="bg-card rounded-xl p-4 border border-border shadow-sm flex flex-col">
                    <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1">In Transit</span>
                    <div className="flex items-end justify-between">
                        <span className="text-2xl font-bold text-foreground">
                            {manifests.filter(m => ['dispatched', 'in_transit'].includes(m.status)).length}
                        </span>
                        <Truck className="w-5 h-5 text-primary" />
                    </div>
                </div>
                <div className="bg-card rounded-xl p-4 border border-border shadow-sm flex flex-col">
                    <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1">Arrived</span>
                    <div className="flex items-end justify-between">
                        <span className="text-2xl font-bold text-foreground">
                            {manifests.filter(m => m.status === 'arrived').length}
                        </span>
                        <Package className="w-5 h-5 text-primary" />
                    </div>
                </div>
                <div className="bg-warning/10 rounded-xl p-4 border border-warning/20 shadow-sm flex flex-col">
                    <span className="text-warning text-xs font-medium uppercase tracking-wider mb-1">Queue</span>
                    <div className="flex items-end justify-between">
                        <span className="text-2xl font-bold text-warning">{unassigned.length}</span>
                        <AlertCircle className="w-5 h-5 text-warning" />
                    </div>
                </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
                <div className="flex items-center justify-between mb-4">
                    <TabsList>
                        <TabsTrigger value="all">All Manifests</TabsTrigger>
                        <TabsTrigger value="queue">Unassigned Queue ({unassigned.length})</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="all" className="mt-0">
                    <DataTable
                        columns={manifestColumns}
                        data={manifests}
                        filterColumn="manifest_number"
                        filterPlaceholder="Search manifests..."
                    />
                </TabsContent>

                <TabsContent value="queue" className="mt-0">
                    <DataTable
                        columns={shipmentColumns}
                        data={unassigned}
                        filterColumn="reference"
                        filterPlaceholder="Search reference..."
                    />
                </TabsContent>
            </Tabs>
        </PageShell>
    );
}

// --- Forms ---

interface CreateManifestFormProps {
    warehouses: Warehouse[];
    onSuccess: (manifest: unknown) => void;
}

function CreateManifestForm({ warehouses, onSuccess }: CreateManifestFormProps) {
    const [isPending, startTransition] = useTransition();
    const [formData, setFormData] = useState(() => ({
        manifest_number: `MNF-${new Date().getFullYear()}${Date.now().toString(36).toUpperCase()}`,
        origin_warehouse_id: "",
        destination_warehouse_id: "",
        transport_mode: "surface" as "air" | "surface" | "express" | "economy",
        vehicle_number: "",
        driver_name: "",
        driver_phone: "",
        planned_departure: new Date().toISOString().slice(0, 16),
        planned_arrival: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        startTransition(async () => {
            const result = await createManifest({
                ...formData,
                planned_departure: new Date(formData.planned_departure).toISOString(),
                planned_arrival: new Date(formData.planned_arrival).toISOString(),
            });
            if (result.success) {
                onSuccess(result.data);
            } else {
                toast.error(result.error);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Manifest Number</Label>
                    <Input
                        value={formData.manifest_number}
                        onChange={(e) => setFormData(prev => ({ ...prev, manifest_number: e.target.value }))}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label>Transport Mode</Label>
                    <select
                        value={formData.transport_mode}
                        onChange={(e) => setFormData(prev => ({ ...prev, transport_mode: e.target.value as "air" | "surface" | "express" | "economy" }))}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="air">Air</option>
                        <option value="surface">Surface</option>
                        <option value="express">Express</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Origin Warehouse</Label>
                    <select
                        value={formData.origin_warehouse_id}
                        onChange={(e) => setFormData(prev => ({ ...prev, origin_warehouse_id: e.target.value }))}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                    >
                        <option value="">Select origin</option>
                        {warehouses.map((w) => (
                            <option key={w.id} value={w.id}>{w.name} ({w.code})</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <Label>Destination Warehouse</Label>
                    <select
                        value={formData.destination_warehouse_id}
                        onChange={(e) => setFormData(prev => ({ ...prev, destination_warehouse_id: e.target.value }))}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                    >
                        <option value="">Select destination</option>
                        {warehouses.map((w) => (
                            <option key={w.id} value={w.id}>{w.name} ({w.code})</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Planned Departure</Label>
                    <Input
                        type="datetime-local"
                        value={formData.planned_departure}
                        onChange={(e) => setFormData(prev => ({ ...prev, planned_departure: e.target.value }))}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label>Planned Arrival</Label>
                    <Input
                        type="datetime-local"
                        value={formData.planned_arrival}
                        onChange={(e) => setFormData(prev => ({ ...prev, planned_arrival: e.target.value }))}
                        required
                    />
                </div>
            </div>

            <div className="border-t border-border pt-4">
                <h3 className="text-sm font-medium text-foreground mb-3">Driver Details (Optional)</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Driver Name</Label>
                        <Input
                            value={formData.driver_name}
                            onChange={(e) => setFormData(prev => ({ ...prev, driver_name: e.target.value }))}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Vehicle Number</Label>
                        <Input
                            value={formData.vehicle_number}
                            onChange={(e) => setFormData(prev => ({ ...prev, vehicle_number: e.target.value }))}
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Creating..." : "Create Manifest"}
                </Button>
            </div>
        </form>
    );
}
