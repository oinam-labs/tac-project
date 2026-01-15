"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Truck, CheckCircle2, MapPin, Clock } from "lucide-react";

interface TimelineEvent {
    id: string;
    title: string;
    time: string;
    description: string;
    status: "completed" | "current" | "upcoming" | "delayed";
    icon?: React.ElementType;
}

interface ShipmentTimelineProps {
    events?: TimelineEvent[];
    className?: string;
}

const defaultEvents: TimelineEvent[] = [
    {
        id: "1",
        title: "Order Placed",
        time: "10:00 AM",
        description: "Shipment #SH-2938 created by sender",
        status: "completed",
        icon: CheckCircle2
    },
    {
        id: "2",
        title: "Picked Up",
        time: "12:30 PM",
        description: "Driver arrived at pickup location",
        status: "completed",
        icon: Truck
    },
    {
        id: "3",
        title: "In Transit",
        time: "Ongoing",
        description: "En route to central distribution hub",
        status: "current",
        icon: Clock
    },
    {
        id: "4",
        title: "Hub Processing",
        time: "Est. 4:00 PM",
        description: "Sorting and routing at Main Hub",
        status: "upcoming",
        icon: MapPin
    },
    {
        id: "5",
        title: "Out for Delivery",
        time: "Tomorrow",
        description: "Final mile delivery",
        status: "upcoming",
        icon: Truck
    }
];

export function ShipmentTimeline({
    events = defaultEvents,
    className
}: ShipmentTimelineProps) {
    return (
        <Card className={cn("overflow-hidden backdrop-blur-sm bg-background/50 border-white/10 shadow-lg", className)}>
            <CardHeader>
                <CardTitle>Shipment Route</CardTitle>
                <CardDescription>Live tracking for Shipment #SH-2938</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative pl-6 border-l-2 border-muted/30 space-y-8 ml-3 my-2">
                    {events.map((event, index) => {
                        const Icon = event.icon || MapPin;
                        const isCompleted = event.status === "completed";
                        const isCurrent = event.status === "current";
                        const isDelayed = event.status === "delayed";

                        let dotColor = "bg-muted border-muted-foreground";
                        if (isCompleted) dotColor = "bg-success border-success shadow-lg shadow-success/40";
                        if (isCurrent) dotColor = "bg-primary border-primary animate-pulse shadow-lg shadow-primary/50";
                        if (isDelayed) dotColor = "bg-destructive border-destructive";

                        return (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative"
                            >
                                {/* Timeline Dot */}
                                <div className={cn(
                                    "absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 transition-all duration-300 z-10",
                                    dotColor
                                )} />

                                <div className="flex flex-col space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className={cn(
                                            "font-semibold text-sm",
                                            isCurrent ? "text-primary" : "text-foreground"
                                        )}>
                                            <Icon className="w-4 h-4 mr-2 text-muted-foreground" />
                                            {event.title}
                                        </span>
                                        <span className="text-xs text-muted-foreground font-mono">{event.time}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{event.description}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
