"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Area, AreaChart, ResponsiveContainer, XAxis } from "recharts";

const data = [
    { month: "May", rate: 0.35 },
    { month: "Jun", rate: 0.25 },
    { month: "Jul", rate: 0.15 }, // Low point
    { month: "Aug", rate: 0.22 },
    { month: "Sep", rate: 0.18 },
    { month: "Oct", rate: 0.20 },
];

export function QualityMetric() {
    return (

        <Card className="h-full border-none shadow-sm bg-success/10">
            <CardContent className="p-6 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-bold text-foreground">Quality</h3>
                            <span className="bg-success/20 text-success text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">High</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Low defect rate, %</p>
                    </div>
                    <Select defaultValue="defect-rate">
                        <SelectTrigger className="h-7 text-[10px] w-auto gap-1 bg-transparent border-success/20 text-success rounded-full px-2">
                            <SelectValue placeholder="Metric" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="defect-rate">defect rate</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="h-[120px] w-full mt-auto relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-foreground text-background text-[10px] px-2 py-1 rounded-full z-10 shadow-lg font-bold">
                        0.17%
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#64748b' }}
                                dy={10}
                            />
                            <Area type="monotone" dataKey="rate" stroke="var(--success)" strokeWidth={2} fillOpacity={1} fill="url(#colorRate)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
