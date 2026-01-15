"use client";

import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface RadialProgressKPIProps {
    title: string;
    value: number;
    total: number;
    unit?: string;
    description?: string;
    color?: string;
    className?: string;
}

export function RadialProgressKPI({
    title,
    value,
    total,
    unit = "%",
    description,
    color = "var(--color-primary)",
    className
}: RadialProgressKPIProps) {
    const percentage = Math.min(100, Math.max(0, (value / total) * 100));

    const data = [
        {
            name: title,
            value: percentage,
            fill: color
        }
    ];

    return (
        <Card className={cn("overflow-hidden backdrop-blur-sm bg-background/50 border-white/10 shadow-lg", className)}>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</CardTitle>
            </CardHeader>
            <CardContent className="h-[200px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                        cx="50%"
                        cy="50%"
                        innerRadius="70%"
                        outerRadius="100%"
                        barSize={10}
                        data={data}
                        startAngle={90}
                        endAngle={-270}
                    >
                        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                        <RadialBar
                            background={{ fill: 'var(--color-muted)' }}
                            dataKey="value"
                            cornerRadius={30 / 2}
                        />
                    </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-bold">{Math.round(percentage)}{unit}</span>
                    {description && <span className="text-xs text-muted-foreground">{description}</span>}
                </div>
            </CardContent>
        </Card>
    );
}
