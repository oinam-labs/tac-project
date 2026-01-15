"use client";

import React, { useState, useTransition } from "react";
import {
    AlertOctagon,
    Clock,
    AlertTriangle,
    ArrowRight,
    Plus,
    Search,
    MoreHorizontal,
    CheckCircle,
    Repeat
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

import { PageShell } from "@/components/dashboard/page-shell";
import { DataTable } from "@/components/dashboard/data-table-premium";
import { updateShipmentStatus } from "@/app/actions/shipments";
import type { ShipmentStatus } from "@/types/database";

// --- Types ---

type ExceptionType = "failed" | "delayed";

interface Exception {
    id: string;
    reference: string;
    status: ShipmentStatus;
    consignee_name: string | null;
    consignee_city: string | null;
    updated_at: string;
    origin_warehouse: { name: string; code: string } | null;
    destination_warehouse: { name: string; code: string } | null;
    exception_type: ExceptionType;
}

interface Shipment {
    id: string;
    reference: string;
    consignee_name: string | null;
    consignee_city: string | null;
    status: ShipmentStatus;
}

interface ExceptionsClientProps {
    initialExceptions: Exception[];
    availableShipments?: Shipment[];
}

// --- Configuration ---

const exceptionConfig: Record<ExceptionType, { label: string; variant: "destructive" | "warning"; icon: React.ElementType, className: string }> = {
    failed: { label: "Failed Delivery", variant: "destructive", icon: AlertOctagon, className: "bg-destructive/10 text-destructive border-destructive/20" },
    delayed: { label: "Delayed", variant: "warning", icon: Clock, className: "bg-warning/10 text-warning border-warning/20" },
};

// --- Main Component ---

export function ExceptionsClient({ initialExceptions, availableShipments = [] }: Readonly<ExceptionsClientProps>) {
    const [exceptions, setExceptions] = useState<Exception[]>(initialExceptions);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [createForm, setCreateForm] = useState({
        shipmentId: "",
        exceptionType: "failed" as ExceptionType,
        reason: "",
    });
    const [isPending, startTransition] = useTransition();

    const failedCount = exceptions.filter(e => e.exception_type === "failed").length;
    const delayedCount = exceptions.filter(e => e.exception_type === "delayed").length;

    // -- Actions --

    const handleCreateException = async () => {
        if (!createForm.shipmentId) {
            toast.error("Please select a shipment");
            return;
        }

        startTransition(async () => {
            const newStatus: ShipmentStatus = createForm.exceptionType === "failed" ? "exception" : "in_transit";
            const result = await updateShipmentStatus(createForm.shipmentId, newStatus, createForm.reason);

            if (result.success) {
                const shipment = availableShipments.find(s => s.id === createForm.shipmentId);
                if (shipment) {
                    const newException: Exception = {
                        id: shipment.id,
                        reference: shipment.reference,
                        status: newStatus,
                        consignee_name: shipment.consignee_name,
                        consignee_city: shipment.consignee_city,
                        updated_at: new Date().toISOString(),
                        origin_warehouse: null,
                        destination_warehouse: null,
                        exception_type: createForm.exceptionType,
                    };
                    setExceptions(prev => [newException, ...prev]);
                }
                setIsCreateOpen(false);
                setCreateForm({ shipmentId: "", exceptionType: "failed", reason: "" });
                toast.success("Exception created successfully");
            } else {
                toast.error(result.error || "Failed to create exception");
            }
        });
    };

    const handleResolve = async (shipmentId: string) => {
        const result = await updateShipmentStatus(shipmentId, "booked");
        if (result.success) {
            setExceptions(prev => prev.filter(e => e.id !== shipmentId));
            toast.success("Exception resolved successfully");
        } else {
            toast.error(result.error);
        }
    };

    const handleRetry = async (shipmentId: string) => {
        const result = await updateShipmentStatus(shipmentId, "out_for_delivery");
        if (result.success) {
            setExceptions(prev => prev.filter(e => e.id !== shipmentId));
            toast.success("Shipment scheduled for retry");
        } else {
            toast.error(result.error);
        }
    };

    // -- Columns --

    const columns: ColumnDef<Exception>[] = [
        {
            accessorKey: "reference",
            header: "Reference",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-foreground">{row.getValue("reference")}</span>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        {row.original.origin_warehouse?.code || "—"}
                        <ArrowRight className="w-3 h-3" />
                        {row.original.destination_warehouse?.code || "—"}
                    </div>
                </div>
            ),
        },
        {
            header: "Type",
            cell: ({ row }) => {
                const config = exceptionConfig[row.original.exception_type];
                const Icon = config.icon;
                return (
                    <Badge variant="outline" className={cn("rounded-md", config.className)}>
                        <Icon className="w-3 h-3 mr-1.5" />
                        {config.label}
                    </Badge>
                );
            },
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
            header: "Last Update",
            cell: ({ row }) => (
                <span className="text-xs text-muted-foreground">{getTimeAgo(row.original.updated_at)}</span>
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
                            {row.original.exception_type === "failed" && (
                                <DropdownMenuItem onClick={() => handleRetry(row.original.id)}>
                                    <Repeat className="w-4 h-4 mr-2" /> Retry Delivery
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleResolve(row.original.id)}>
                                <CheckCircle className="w-4 h-4 mr-2" /> Mark Resolved
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
            title="Exceptions"
            description="Manage shipment irregularities, failures, and delays."
            breadcrumb={["Dashboard", "Operations", "Exceptions"]}
            action={
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-full shadow-lg shadow-destructive/20 bg-destructive hover:bg-destructive/90 text-white">
                            <Plus className="w-4 h-4 mr-2" />
                            Report Exception
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Report Exception</DialogTitle>
                            <DialogDescription>
                                Manually flag a shipment as failed or delayed.
                            </DialogDescription>
                        </DialogHeader>
                        <CreateExceptionForm
                            createForm={createForm}
                            setCreateForm={setCreateForm}
                            availableShipments={availableShipments}
                            onConfirm={handleCreateException}
                            isPending={isPending}
                            onCancel={() => setIsCreateOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            }
        >
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-card rounded-xl p-4 border border-border shadow-sm flex flex-col">
                    <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1">Total Issues</span>
                    <div className="flex items-end justify-between">
                        <span className="text-2xl font-bold text-foreground">{exceptions.length}</span>
                        <AlertTriangle className="w-5 h-5 text-muted-foreground" />
                    </div>
                </div>
                <div className="bg-destructive/5 rounded-xl p-4 border border-destructive/10 shadow-sm flex flex-col">
                    <span className="text-destructive text-xs font-medium uppercase tracking-wider mb-1">Failed Deliveries</span>
                    <div className="flex items-end justify-between">
                        <span className="text-2xl font-bold text-destructive">{failedCount}</span>
                        <AlertOctagon className="w-5 h-5 text-destructive" />
                    </div>
                </div>
                <div className="bg-warning/5 rounded-xl p-4 border border-warning/10 shadow-sm flex flex-col">
                    <span className="text-warning text-xs font-medium uppercase tracking-wider mb-1">Delayed</span>
                    <div className="flex items-end justify-between">
                        <span className="text-2xl font-bold text-warning">{delayedCount}</span>
                        <Clock className="w-5 h-5 text-warning" />
                    </div>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={exceptions}
                filterColumn="reference"
                filterPlaceholder="Search exceptions..."
            />
        </PageShell>
    );
}

interface ExceptionFormState {
    exceptionType: ExceptionType;
    shipmentId: string;
    reason: string;
}

// --- Subcomponents ---

function CreateExceptionForm({
    createForm,
    setCreateForm,
    availableShipments,
    onConfirm,
    isPending,
    onCancel
}: {
    createForm: ExceptionFormState,
    setCreateForm: React.Dispatch<React.SetStateAction<ExceptionFormState>>,
    availableShipments: Shipment[],
    onConfirm: () => void,
    isPending: boolean,
    onCancel: () => void
}) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredShipments = availableShipments.filter(s =>
        s.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.consignee_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-4 py-4">
            <div className="space-y-2">
                <Label>Exception Type</Label>
                <Select
                    value={createForm.exceptionType}
                    onValueChange={(value) => setCreateForm(prev => ({ ...prev, exceptionType: value as ExceptionType }))}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="failed">
                            <div className="flex items-center gap-2">
                                <AlertOctagon className="w-4 h-4 text-destructive" />
                                Failed Delivery
                            </div>
                        </SelectItem>
                        <SelectItem value="delayed">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-warning" />
                                Delayed Shipment
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Select Shipment</Label>
                <div className="relative mb-2">
                    <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search shipments..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <div className="max-h-48 overflow-y-auto border rounded-md">
                    {filteredShipments.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            No shipments found
                        </div>
                    ) : (
                        filteredShipments.map((shipment) => (
                            <div
                                key={shipment.id}
                                onClick={() => setCreateForm(prev => ({ ...prev, shipmentId: shipment.id }))}
                                className={cn(
                                    "p-3 cursor-pointer border-b last:border-b-0 transition-colors",
                                    createForm.shipmentId === shipment.id
                                        ? "bg-primary/10 border-primary/20"
                                        : "hover:bg-muted/50"
                                )}
                            >
                                <div className="font-mono text-xs font-medium">{shipment.reference}</div>
                                <div className="text-xs text-muted-foreground">
                                    {shipment.consignee_name || "Unknown"} • {shipment.consignee_city || "—"}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label>Reason (Optional)</Label>
                <Textarea
                    placeholder="Describe the reason for this exception..."
                    value={createForm.reason}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, reason: e.target.value }))}
                    rows={3}
                />
            </div>

            <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button
                    onClick={onConfirm}
                    disabled={isPending || !createForm.shipmentId}
                    variant="destructive"
                >
                    {isPending ? "Creating..." : "Confirm Exception"}
                </Button>
            </div>
        </div>
    );
}

function getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
}
