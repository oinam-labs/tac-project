"use client";

import React from "react";
import Link from "next/link";
import {
    Package,
    Truck,
    AlertCircle,
    DollarSign,
    Clock,
    ArrowUpRight,
    Activity,
    CheckCircle,
    MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusPipeline } from "@/components/dashboard/status-pipeline";
import type { ShipmentStatus } from "@/types/database";

interface DashboardStats {
    shipments: {
        total: number;
        pending: number;
        inTransit: number;
        delivered: number;
        failed: number;
        today: number;
        delayed: number;
    };
    finance: {
        revenue: number;
        outstanding: number;
    };
    operations: {
        activeManifests: number;
    };
}

interface RecentActivity {
    id: string;
    reference: string;
    status: ShipmentStatus;
    consignee_name: string | null;
    updated_at: string;
}

interface OverviewClientProps {
    stats: DashboardStats;
    recentActivity: RecentActivity[];
}

const statusConfig: Record<ShipmentStatus, { label: string; color: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    booked: { label: "Booked", color: "text-muted-foreground", variant: "secondary" },
    picked_up: { label: "Picked Up", color: "text-primary", variant: "default" },
    at_origin_hub: { label: "At Origin Hub", color: "text-primary", variant: "default" },
    in_transit: { label: "In Transit", color: "text-primary", variant: "default" },
    at_destination_hub: { label: "At Destination Hub", color: "text-primary", variant: "default" },
    out_for_delivery: { label: "Out for Delivery", color: "text-warning", variant: "secondary" },
    delivered: { label: "Delivered", color: "text-success", variant: "secondary" },
    exception: { label: "Exception", color: "text-destructive", variant: "destructive" },
    returned: { label: "Returned", color: "text-warning", variant: "secondary" },
    cancelled: { label: "Cancelled", color: "text-muted-foreground", variant: "outline" },
};

export function OverviewClient({ stats, recentActivity }: OverviewClientProps) {
    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                    title="Total Shipments"
                    value={stats.shipments.total}
                    subtitle={`${stats.shipments.today} today`}
                    icon={Package}
                    color="text-foreground"
                    href="/dashboard/shipments"
                />
                <StatCard
                    title="In Transit"
                    value={stats.shipments.inTransit}
                    subtitle={stats.shipments.delayed > 0 ? `${stats.shipments.delayed} delayed` : "On schedule"}
                    icon={Truck}
                    color="text-primary"
                    highlight={stats.shipments.delayed > 0}
                    href="/dashboard/tracking"
                />
                <StatCard
                    title="Revenue"
                    value={`₹${(stats.finance.revenue / 1000).toFixed(1)}K`}
                    subtitle={`₹${(stats.finance.outstanding / 1000).toFixed(1)}K outstanding`}
                    icon={DollarSign}
                    color="text-success"
                    href="/dashboard/payments"
                />
                <StatCard
                    title="Active Manifests"
                    value={stats.operations.activeManifests}
                    subtitle="Open & dispatched"
                    icon={Activity}
                    color="text-warning"
                    href="/dashboard/manifests"
                />
            </div>

            {/* Status Pipeline */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold">Shipment Pipeline</CardTitle>
                </CardHeader>
                <CardContent>
                    <StatusPipeline
                        stages={[
                            { id: "pending", label: "Pending", count: stats.shipments.pending, icon: Clock, color: "text-muted-foreground bg-muted" },
                            { id: "in_transit", label: "In Transit", count: stats.shipments.inTransit, icon: Truck, color: "text-warning-foreground bg-warning" },
                            { id: "out_for_delivery", label: "Out for Delivery", count: 0, icon: MapPin, color: "text-info-foreground bg-info" },
                            { id: "delivered", label: "Delivered", count: stats.shipments.delivered, icon: CheckCircle, color: "text-success-foreground bg-success" },
                            { id: "failed", label: "Failed", count: stats.shipments.failed, icon: AlertCircle, color: "text-destructive-foreground bg-destructive" },
                        ]}
                    />
                </CardContent>
            </Card>

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <Card className="lg:col-span-2 flex flex-col h-full">
                    <CardHeader className="border-b px-6 py-4 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
                        <Link href="/dashboard/shipments" className="text-sm text-primary hover:text-primary/80 font-medium">
                            View all
                        </Link>
                    </CardHeader>
                    <div className="divide-y divide-border flex-1 overflow-auto">
                        {recentActivity.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground text-sm">No recent activity</div>
                        ) : (
                            recentActivity.map((item) => {
                                const status = statusConfig[item.status] || statusConfig.booked;
                                return (
                                    <Link
                                        key={item.id}
                                        href={`/dashboard/tracking`}
                                        className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={cn("w-2 h-2 rounded-full ring-2 ring-transparent group-hover:ring-background transition-all", status.color.replace("text-", "bg-"))} />
                                            <div>
                                                <div className="font-mono text-sm font-medium text-foreground">{item.reference}</div>
                                                <div className="text-xs text-muted-foreground mt-0.5">{item.consignee_name || "—"}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant={status.variant} className="text-[10px] h-5 px-1.5 font-normal">
                                                {status.label}
                                            </Badge>
                                            <div className="text-[10px] text-muted-foreground mt-1 font-mono">
                                                {new Date(item.updated_at).toLocaleTimeString("en-IN", {
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })
                        )}
                    </div>
                </Card>

                {/* Quick Actions */}
                <Card className="h-fit">
                    <CardHeader className="border-b px-6 py-4">
                        <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 grid grid-cols-2 gap-3">
                        <QuickActionLink href="/dashboard/shipments" label="Create Shipment" icon={Package} />
                        <QuickActionLink href="/dashboard/manifests" label="New Manifest" icon={Truck} />
                        <QuickActionLink href="/dashboard/scanning" label="Scan Barcode" icon={Activity} />
                        <QuickActionLink href="/dashboard/invoices" label="Generate Invoice" icon={DollarSign} />
                        <QuickActionLink href="/dashboard/tracking" label="Track Shipment" icon={Clock} />
                        <QuickActionLink href="/dashboard/exceptions" label="View Exceptions" icon={AlertCircle} />
                    </CardContent>
                </Card>
            </div>

            {/* Alerts Section */}
            {(stats.shipments.delayed > 0 || stats.shipments.failed > 0) && (
                <Card className="border-warning/30 bg-warning/5">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <AlertCircle className="w-5 h-5 text-warning" />
                            <h3 className="text-sm font-semibold text-foreground">Attention Required</h3>
                        </div>
                        <div className="space-y-2 text-sm">
                            {stats.shipments.delayed > 0 && (
                                <div className="flex items-center justify-between text-foreground">
                                    <span>{stats.shipments.delayed} shipments delayed</span>
                                    <Link href="/dashboard/tracking" className="text-warning text-xs font-medium hover:underline">
                                        View Details →
                                    </Link>
                                </div>
                            )}
                            {stats.shipments.failed > 0 && (
                                <div className="flex items-center justify-between text-foreground">
                                    <span>{stats.shipments.failed} failed deliveries</span>
                                    <Link href="/dashboard/exceptions" className="text-warning text-xs font-medium hover:underline">
                                        View Details →
                                    </Link>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    color,
    highlight,
    href
}: {
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ElementType;
    color: string;
    highlight?: boolean;
    href: string;
}) {
    return (
        <Link href={href}>
            <Card className={cn(
                "p-5 hover:border-primary/40 transition-all cursor-pointer group shadow-sm hover:shadow-md",
                highlight && "border-warning/50 bg-warning/5"
            )}>
                <div className="flex items-start justify-between mb-3">
                    <div className={cn("p-2 rounded-lg transition-colors",
                        highlight ? "bg-warning/20 text-warning" : "bg-muted group-hover:bg-primary/10 group-hover:text-primary"
                    )}>
                        <Icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", highlight ? "text-warning" : "text-muted-foreground group-hover:text-primary")} />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <div className={cn("text-2xl font-bold mb-1 tracking-tight", color)}>{value}</div>
                <div className="text-xs font-medium text-muted-foreground">{title}</div>
                <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>
            </Card>
        </Link>
    );
}

function QuickActionLink({
    href,
    label,
    icon: Icon
}: {
    href: string;
    label: string;
    icon: React.ElementType;
}) {
    return (
        <Link
            href={href}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-border hover:bg-muted/50 hover:border-primary/20 transition-all group text-center"
        >
            <div className="p-2 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
        </Link>
    );
}
