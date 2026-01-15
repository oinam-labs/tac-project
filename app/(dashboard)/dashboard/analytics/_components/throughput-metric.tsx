"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpRight } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import Image from "next/image";

const data = [
    { day: "Mon", value: 45 },
    { day: "Tue", value: 52 },
    { day: "Wen", value: 48 },
    { day: "Thu", value: 85 }, // Highlighted day
    { day: "Fri", value: 55 },
    { day: "Sat", value: 40 },
    { day: "Sun", value: 35 },
];

export function ThroughputMetric() {
    return (
        <Card className="col-span-1 md:col-span-2 overflow-hidden border-border/50 shadow-sm bg-card">
            <CardContent className="p-6 md:p-8 flex flex-col md:flex-row gap-8 h-full">
                {/* Left Side: Controls & Chart */}
                <div className="flex-1 flex flex-col justify-between space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-muted">
                                <ArrowUpRight className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight">Throughput</h2>
                        </div>
                        <Select defaultValue="this-week">
                            <SelectTrigger className="w-[120px] h-9 text-xs rounded-full border-border">
                                <SelectValue placeholder="Period" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="this-week">this week</SelectItem>
                                <SelectItem value="last-week">last week</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-4">
                        <Select defaultValue="line-1">
                            <SelectTrigger className="w-full md:w-[240px] bg-muted/50 border-border/50 rounded-lg">
                                <SelectValue placeholder="Select Line" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="line-1">Production line 1</SelectItem>
                                <SelectItem value="line-2">Production line 2</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="h-[200px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                    <XAxis
                                        dataKey="day"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: '#94a3b8' }}
                                        dy={10}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="bg-primary text-primary-foreground text-xs py-1 px-3 rounded-full flex flex-col items-center shadow-xl">
                                                        <span className="font-bold">{payload[0].value} pcs</span>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Bar
                                        dataKey="value"
                                        radius={[4, 4, 4, 4]}
                                        barSize={32}
                                        className="fill-muted hover:fill-muted-foreground transition-colors"
                                    />
                                    {/* Highlight bar via custom shape or just simpler data split? For simplicity, we stick to unified color but could customize */}
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold tracking-tighter text-foreground">+4.2%</span>
                            <span className="text-sm font-medium text-muted-foreground">production volume growth</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: 3D Illustration */}
                <div className="flex-1 flex items-center justify-center relative min-h-[300px] md:min-h-0">
                    <div className="relative w-full h-full flex items-center justify-center">
                        <Image
                            src="/assets/throughput-isometric.png"
                            alt="Throughput Visualization"
                            width={350}
                            height={350}
                            className="object-contain max-h-[350px] w-auto drop-shadow-2xl hover:scale-105 transition-transform duration-700 ease-in-out"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
