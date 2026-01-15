"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface RevenueBarChartProps {
    data?: Array<{ name: string; total: number }>;
    className?: string;
}

const defaultData = [
    { name: "Jan", total: 4500 },
    { name: "Feb", total: 3200 },
    { name: "Mar", total: 6000 },
    { name: "Apr", total: 4800 },
    { name: "May", total: 5200 },
    { name: "Jun", total: 4200 },
    { name: "Jul", total: 5500 },
];

export function RevenueBarChart({
    data = defaultData,
    className
}: RevenueBarChartProps) {
    return (
        <Card className={cn("overflow-hidden backdrop-blur-sm bg-background/50 border-white/10 shadow-lg", className)}>
            <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue performance</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <defs>
                            <linearGradient id="gradient-bar-primary" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.8} />
                                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted/20" vertical={false} />
                        <XAxis
                            dataKey="name"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            className="fill-muted-foreground"
                        />
                        <YAxis
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `₹${value}`}
                            className="fill-muted-foreground"
                        />
                        <Tooltip
                            cursor={{ fill: 'var(--color-muted)', opacity: 0.1 }}
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="rounded-lg border bg-background p-2 shadow-md">
                                            <div className="flex flex-col">
                                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                    {label}
                                                </span>
                                                <span className="font-bold text-primary">
                                                    ₹{payload[0].value?.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar
                            dataKey="total"
                            radius={[4, 4, 0, 0]}
                            fill="url(#gradient-bar-primary)"
                            className="animate-in fade-in zoom-in duration-500"
                            barSize={32}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
