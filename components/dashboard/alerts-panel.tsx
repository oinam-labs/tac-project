"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Clock, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Alert {
    id: string;
    type: "warning" | "destructive" | "info";
    message: string;
    time: string;
    count?: number;
}

// In a real app, this would come from props or a hook
const MOCK_ALERTS: Alert[] = [
    { id: "1", type: "destructive", message: "Failed deliveries requiring action", time: "2h ago", count: 3 },
    { id: "2", type: "warning", message: "Shipments delayed due to weather", time: "4h ago", count: 12 },
    { id: "3", type: "info", message: "System maintenance scheduled", time: "1d ago" },
];

export function AlertsPanel({ className }: { className?: string }) {
    return (
        <Card className={cn("border-l-4 border-l-warning/50", className)}>
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <TriangleAlert className="w-4 h-4 text-warning" />
                    Active Alerts
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {MOCK_ALERTS.map((alert) => (
                    <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 hover:bg-muted transition-colors">
                        {alert.type === 'destructive' && <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />}
                        {alert.type === 'warning' && <Clock className="w-5 h-5 text-warning shrink-0 mt-0.5" />}
                        {alert.type === 'info' && <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />}

                        <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">
                                {alert.message}
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">{alert.time}</span>
                                {alert.count && (
                                    <span className={cn(
                                        "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                                        alert.type === 'destructive' ? "bg-destructive/10 text-destructive" :
                                            alert.type === 'warning' ? "bg-warning/10 text-warning" : "bg-primary/10 text-primary"
                                    )}>
                                        {alert.count} AFFECTED
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                <Link href="/dashboard/exceptions" className="block text-center text-xs text-muted-foreground hover:text-primary mt-4 transition-colors">
                    View all system alerts
                </Link>
            </CardContent>
        </Card>
    );
}
