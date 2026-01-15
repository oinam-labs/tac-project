"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ActivityHeatmapProps {
    data?: number[][]; // 7 days x 24 hours (or simplified blocks)
    className?: string;
}

// Generate mock data: 7 days (rows) x 12 blocks (cols - 2hr blocks)
// Values 0-10 representing intensity
const generateMockData = () => {
    return Array.from({ length: 7 }, (_, dayIndex) =>
        Array.from({ length: 12 }, (_, hourIndex) => {
            // Deterministic pseudo-random generation to avoid hydration mismatch
            // Using a combination of indices and modulo to create varied but consistent data
            const seed = (dayIndex + 1) * (hourIndex + 1);
            return (seed * 9301 + 49297) % 233280 % 5;
        })
    );
};

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const times = ["12am", "4am", "8am", "12pm", "4pm", "8pm"];

export function ActivityHeatmap({
    data = generateMockData(),
    className
}: ActivityHeatmapProps) {

    const getColor = (value: number) => {
        if (value === 0) return "bg-muted/30";
        if (value === 1) return "bg-primary/20";
        if (value === 2) return "bg-primary/40";
        if (value === 3) return "bg-primary/60";
        if (value >= 4) return "bg-primary text-primary-foreground";
        return "bg-muted";
    };

    return (
        <Card className={cn("overflow-hidden backdrop-blur-sm bg-background/50 border-white/10 shadow-lg", className)}>
            <CardHeader>
                <CardTitle>Activity Heatmap</CardTitle>
                <CardDescription>Shipment processing intensity by day and time</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col space-y-2">
                    {/* Time Labels */}
                    <div className="flex pl-12">
                        {times.map((time, i) => (
                            <div key={i} className="flex-1 text-xs text-muted-foreground text-center">
                                {time}
                            </div>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="grid gap-2">
                        {data.map((row, dayIndex) => (
                            <div key={dayIndex} className="flex items-center gap-2">
                                <span className="w-10 text-xs text-muted-foreground font-medium">{days[dayIndex]}</span>
                                <div className="flex-1 grid grid-cols-12 gap-1 h-8">
                                    {row.map((value, hourIndex) => (
                                        <TooltipProvider key={hourIndex}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div
                                                        className={cn(
                                                            "rounded-sm transition-all hover:scale-110 cursor-pointer",
                                                            getColor(value)
                                                        )}
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{value * 12} shipments processing</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-end gap-2 mt-4 text-xs text-muted-foreground">
                    <span>Less</span>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-sm bg-muted/30"></div>
                        <div className="w-3 h-3 rounded-sm bg-primary/20"></div>
                        <div className="w-3 h-3 rounded-sm bg-primary/60"></div>
                        <div className="w-3 h-3 rounded-sm bg-primary"></div>
                    </div>
                    <span>More</span>
                </div>
            </CardContent>
        </Card>
    );
}
