"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DonutChartStatusProps {
    data?: Array<{ name: string; value: number; color?: string }>;
    className?: string;
}

const defaultData = [
    { name: "In Transit", value: 35, color: "var(--color-primary)" },
    { name: "Delivered", value: 45, color: "var(--color-success)" },
    { name: "Pending", value: 15, color: "var(--color-warning)" },
    { name: "Failed", value: 5, color: "var(--color-destructive)" },
];

export function DonutChartStatus({
    data = defaultData,
    className
}: DonutChartStatusProps) {
    const total = data.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <Card className={cn("overflow-hidden backdrop-blur-sm bg-background/50 border-white/10 shadow-lg", className)}>
            <CardHeader>
                <CardTitle>Shipment Status</CardTitle>
                <CardDescription>Current status distribution</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
                <div className="relative h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={2}
                                dataKey="value"
                                strokeWidth={0}
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color || "var(--color-primary)"}
                                        className="stroke-background hover:opacity-80 transition-opacity"
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0].payload;
                                        return (
                                            <div className="rounded-lg border bg-background p-2 shadow-md">
                                                <div className="flex flex-col">
                                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                        {data.name}
                                                    </span>
                                                    <span className="font-bold">
                                                        {data.value} ({((data.value / total) * 100).toFixed(1)}%)
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                iconType="circle"
                                wrapperStyle={{ fontSize: '12px' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Center Text */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                            <div className="text-3xl font-bold">{total}</div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider">Total</div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
