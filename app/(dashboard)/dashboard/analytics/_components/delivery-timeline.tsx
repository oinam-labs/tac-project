"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Box, Globe, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TimelineItem {
    id: string;
    time: string;
    title: string;
    description: string;
    status: "Dispatch" | "Preparation" | "In Transit";
    items: string;
    weight: string;
    location: string;
    totalOrders: number;
}

const ITEMS: TimelineItem[] = [
    {
        id: "1",
        time: "4:00 pm",
        title: "Urgent Steel Delivery to New York, USA (depo 1)",
        description: "Prioritized to meet critical timelines required by key clients.",
        status: "Dispatch",
        items: "120 pcs",
        weight: "45 tons",
        location: "Depo 1, New York, USA",
        totalOrders: 12
    },
    {
        id: "2",
        time: "6:00 pm",
        title: "International Freight Shipment to Paris (depo 2)",
        description: "Prioritized to meet critical timelines required by key clients.",
        status: "Preparation",
        items: "1,007 pcs",
        weight: "213 tons",
        location: "Depo 2, Paris, FRA",
        totalOrders: 12
    }
]

export function DeliveryTimeline() {
    return (
        <Card className="h-full border-border/50 shadow-sm bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-6">
                <CardTitle className="text-lg font-semibold text-foreground">On-time delivery</CardTitle>
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
                    View All <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
            </CardHeader>
            <CardContent className="space-y-8 pl-4">
                {ITEMS.map((item) => (
                    <div key={item.id} className="relative pl-8 border-l border-border pb-8 last:pb-0 last:border-0">
                        {/* Time marker */}
                        <div className="absolute -left-[58px] top-0 text-xs font-medium text-muted-foreground w-12 text-right">
                            {item.time}
                        </div>
                        {/* Dot */}
                        <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-muted-foreground ring-4 ring-background" />

                        {/* Card */}
                        <div className="bg-card rounded-xl p-5 shadow-sm border border-border/50">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-foreground pr-4">{item.title}</h3>
                                <button className="text-muted-foreground hover:text-foreground">
                                    <MoreHorizontal className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                                {item.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <Badge className={item.status === 'Dispatch' ? 'bg-warning hover:bg-warning/90 text-white border-0' : 'bg-muted text-foreground hover:bg-muted/80'}>
                                    {item.status}
                                </Badge>
                                <Badge variant="outline" className="text-muted-foreground border-border font-normal">
                                    <Box className="w-3 h-3 mr-1" /> {item.items}
                                </Badge>
                                <Badge variant="outline" className="text-muted-foreground border-border font-normal">
                                    {item.weight}
                                </Badge>
                            </div>

                            <div className="flex items-center gap-4 text-xs text-muted-foreground border-t border-border pt-3 mt-2">
                                <div className="flex items-center gap-1">
                                    <Globe className="w-3 h-3" />
                                    {item.location}
                                </div>
                                <div className="h-3 w-px bg-border" />
                                <div>
                                    Total Orders: <span className="text-foreground font-medium">{item.totalOrders}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
