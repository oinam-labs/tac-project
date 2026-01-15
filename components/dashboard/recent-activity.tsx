"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Package,
    Truck,
    CheckCircle,
    AlertCircle,
    Clock,
    ArrowRight
} from "lucide-react";
import type { ShipmentStatus } from "@/types/database";

interface RecentActivityProps {
    activities?: Array<{
        id: string;
        reference: string;
        status: ShipmentStatus;
        consignee_name: string | null;
        updated_at: string;
        location?: string;
    }>;
    className?: string;
}

const statusConfig: Record<ShipmentStatus, { label: string; color: string; icon: React.ElementType }> = {
    booked: { label: "Booked", color: "text-muted-foreground bg-muted", icon: Package },
    picked_up: { label: "Picked Up", color: "text-primary bg-primary/10", icon: Truck },
    at_origin_hub: { label: "At Origin Hub", color: "text-primary bg-primary/10", icon: Package },
    in_transit: { label: "In Transit", color: "text-primary bg-primary/10", icon: Truck },
    at_destination_hub: { label: "At Destination Hub", color: "text-primary bg-primary/10", icon: Package },
    out_for_delivery: { label: "Out for Delivery", color: "text-warning bg-warning/10", icon: Truck },
    delivered: { label: "Delivered", color: "text-success bg-success/10", icon: CheckCircle },
    exception: { label: "Exception", color: "text-destructive bg-destructive/10", icon: AlertCircle },
    returned: { label: "Returned", color: "text-warning bg-warning/10", icon: AlertCircle },
    cancelled: { label: "Cancelled", color: "text-muted-foreground bg-muted", icon: Clock },
};

export function RecentActivity({
    activities = [],
    className
}: RecentActivityProps) {

    if (activities.length === 0) {
        return (
            <Card className={cn("h-full", className)}>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center p-8 text-muted-foreground h-[300px]">
                    No recent activity to display
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={cn("flex flex-col h-full overflow-hidden backdrop-blur-sm bg-background/50 border-white/10 shadow-lg", className)}>
            <CardHeader className="flex flex-row items-center justify-between pb-6">
                <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Recent Activity
                </CardTitle>
                <Link href="/dashboard/shipments" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                    View all <ArrowRight className="w-3 h-3" />
                </Link>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-4 pl-0">

                    {activities.slice(0, 8).map((item, index) => {
                        const status = statusConfig[item.status] || statusConfig.booked;
                        const StatusIcon = status.icon;

                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center gap-4 py-3 group hover:bg-white/5 rounded-xl transition-colors px-2"
                            >
                                <div className={cn(
                                    "flex items-center justify-center w-10 h-10 rounded-full border border-white/10 shrink-0",
                                    status.color
                                )}>
                                    <StatusIcon className="w-5 h-5" />
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                    <div>
                                        <Link href={`/dashboard/tracking?id=${item.id}`} className="font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2">
                                            {item.reference}
                                            <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium border", status.color.replace('text-', 'border-').replace('bg-', 'bg-opacity-20 '))} >
                                                {status.label}
                                            </span>
                                        </Link>
                                        <div className="text-sm text-muted-foreground mt-0.5">
                                            {item.consignee_name ? `To: ${item.consignee_name}` : "Details updated"}
                                        </div>
                                    </div>
                                    <div className="text-xs text-muted-foreground font-mono whitespace-nowrap">
                                        {new Date(item.updated_at).toLocaleTimeString("en-IN", {
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
