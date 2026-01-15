"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ShipmentTrendsChartProps {
    data?: Array<{ date: string; shipments: number; delivered: number }>;
    totalShipments?: number;
    deliveryRateProp?: number;
    className?: string;
}

const chartConfig = {
    shipments: {
        label: "Total Shipments",
        color: "var(--chart-1)",
    },
    delivered: {
        label: "Delivered",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig;

export function ShipmentTrendsChart({ data = [], totalShipments: totalShipmentsProp, deliveryRateProp, className }: ShipmentTrendsChartProps) {
    const [timeRange, setTimeRange] = React.useState("30d");

    // Filter data based on time range
    const filteredData = React.useMemo(() => {
        if (data.length === 0) return [];

        const now = new Date();
        let daysToSubtract = 7;

        if (timeRange === "30d") {
            daysToSubtract = 30;
        } else if (timeRange === "90d") {
            daysToSubtract = 90;
        }

        const startDate = new Date(now);
        startDate.setDate(startDate.getDate() - daysToSubtract);

        return data.filter((item) => {
            const itemDate = new Date(item.date);
            return itemDate >= startDate;
        });
    }, [data, timeRange]);

    const calculatedTotalShipments = filteredData.reduce((sum, item) => sum + item.shipments, 0);
    const calculatedTotalDelivered = filteredData.reduce((sum, item) => sum + item.delivered, 0);
    const calculatedDeliveryRate = calculatedTotalShipments > 0 ? Math.round((calculatedTotalDelivered / calculatedTotalShipments) * 100) : 0;

    // Use prop values when available (for demo data display)
    const displayTotalShipments = totalShipmentsProp ?? calculatedTotalShipments;
    const displayDeliveryRate = deliveryRateProp ?? calculatedDeliveryRate;

    return (
        <Card className={className}>
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1">
                    <CardTitle>Shipment Trends</CardTitle>
                    <CardDescription>
                        {displayDeliveryRate}% delivery rate • {displayTotalShipments.toLocaleString()} total shipments
                    </CardDescription>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger
                        className="w-[160px] rounded-lg sm:ml-auto"
                        aria-label="Select time range"
                    >
                        <SelectValue placeholder="Last 30 days" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="7d" className="rounded-lg">
                            Last 7 days
                        </SelectItem>
                        <SelectItem value="30d" className="rounded-lg">
                            Last 30 days
                        </SelectItem>
                        <SelectItem value="90d" className="rounded-lg">
                            Last 90 days
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                {filteredData.length === 0 ? (
                    <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
                        No shipment data available
                    </div>
                ) : (
                    <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                        <AreaChart data={filteredData}>
                            <defs>
                                <linearGradient id="fillShipments" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="5%"
                                        stopColor="var(--color-shipments)"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="var(--color-shipments)"
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                                <linearGradient id="fillDelivered" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="5%"
                                        stopColor="var(--color-delivered)"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="var(--color-delivered)"
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={32}
                                tickFormatter={(value) => {
                                    const date = new Date(value);
                                    return date.toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                    });
                                }}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent
                                        labelFormatter={(value) => {
                                            return new Date(value).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            });
                                        }}
                                        indicator="dot"
                                    />
                                }
                            />
                            <Area
                                dataKey="delivered"
                                type="monotone"
                                fill="url(#fillDelivered)"
                                stroke="var(--color-delivered)"
                                strokeWidth={2}
                            />
                            <Area
                                dataKey="shipments"
                                type="monotone"
                                fill="url(#fillShipments)"
                                stroke="var(--color-shipments)"
                                strokeWidth={2}
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                        </AreaChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    );
}
