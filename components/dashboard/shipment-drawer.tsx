"use client";

import React from "react";
import { Shipment, Warehouse } from "@/types/database";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
    MapPin,
    Package,
    FileText,
    Truck,
    User,
    ArrowRight
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";


// Extended type for the drawer to handle relations
interface ShipmentDetail extends Partial<Shipment> {
    origin_warehouse?: Pick<Warehouse, "name"> | null;
    destination_warehouse?: Pick<Warehouse, "name"> | null;
}

interface ShipmentDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    shipment: ShipmentDetail | null;
}

export function ShipmentDrawer({ open, onOpenChange, shipment }: ShipmentDrawerProps) {
    if (!shipment) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                <SheetHeader className="mb-6">
                    <div className="flex items-center justify-between">
                        <Badge variant="outline" className="font-mono">{shipment.reference}</Badge>
                        <Badge>{shipment.status?.replace(/_/g, " ") || "Unknown"}</Badge>
                    </div>
                    <SheetTitle className="text-xl">Shipment Details</SheetTitle>
                    <SheetDescription>
                        View tracking history, documents, and manage shipment.
                    </SheetDescription>
                </SheetHeader>

                <Tabs defaultValue="overview" className="h-full">
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="timeline">Timeline</TabsTrigger>
                        <TabsTrigger value="documents">Documents</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        {/* Route Info */}
                        <div className="rounded-lg border bg-card p-4">
                            <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Route</h3>
                            <div className="flex items-center gap-3">
                                <div className="flex flex-col items-center">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="font-medium text-sm">Origin</p>
                                    <p className="text-xs text-muted-foreground">{shipment.origin_warehouse?.name || "N/A"}</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                                <div className="flex-1 space-y-1 text-right">
                                    <p className="font-medium text-sm">Destination</p>
                                    <p className="text-xs text-muted-foreground">{shipment.destination_warehouse?.name || "N/A"}</p>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Customer Info */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Consignee</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-start gap-3">
                                    <User className="w-4 h-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">{shipment.consignee_name || "Unknown"}</p>
                                        <p className="text-xs text-muted-foreground">Consignee Name</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">{shipment.consignee_city || "Unknown"}</p>
                                        <p className="text-xs text-muted-foreground">City</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Package Details */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Package Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-start gap-3">
                                    <Package className="w-4 h-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">{shipment.pieces || 0} pcs</p>
                                        <p className="text-xs text-muted-foreground">Quantity</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Truck className="w-4 h-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">{shipment.weight_kg || 0} kg</p>
                                        <p className="text-xs text-muted-foreground">Total Weight</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="timeline">
                        <ScrollArea className="h-[400px] pr-4">
                            <div className="relative pl-6 border-l border-muted space-y-8">
                                {/* Current Status */}
                                <div className="relative">
                                    <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-primary border-2 border-background ring-4 ring-primary/20" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">{shipment.status?.replace(/_/g, " ") || "Unknown"}</p>
                                        <p className="text-xs text-muted-foreground">{shipment.updated_at ? new Date(shipment.updated_at).toLocaleString() : "-"}</p>
                                    </div>
                                </div>

                                {/* Creation */}
                                <div className="relative">
                                    <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-muted border-2 border-background" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">Shipment Created</p>
                                        <p className="text-xs text-muted-foreground">{shipment.created_at ? new Date(shipment.created_at).toLocaleString() : "-"}</p>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value="documents">
                        <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                <FileText className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <div>
                                <h3 className="font-semibold">No documents attached</h3>
                                <p className="text-sm text-muted-foreground">Upload invoices, PODs, or labels here.</p>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </SheetContent>
        </Sheet>
    );
}
