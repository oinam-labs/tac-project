"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, DollarSign, AlertOctagon, CloudRain, Package, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

const revenueData = [
    { value: 10 },
    { value: 25 },
    { value: 15 },
    { value: 30 },
    { value: 20 },
    { value: 50 },
];

export function OverviewMapCard() {
    return (
        <Card className="md:col-span-2 md:row-span-2 relative overflow-hidden group p-0 border-border/60 shadow-sm">
            <div className="absolute inset-0 bg-muted/20">
                {/* Abstract Map Pattern */}
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
                    backgroundSize: '24px 24px'
                }}></div>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent pointer-events-none"></div>

            {/* Status Badge */}
            <div className="absolute top-4 left-4 z-10">
                <Badge variant="outline" className="bg-background/80 backdrop-blur-sm shadow-sm gap-2 pl-1.5 py-1">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                    <span className="font-medium">Global Fleet</span>
                    <span className="text-muted-foreground border-l pl-2 ml-1">
                        248 Active
                    </span>
                </Badge>
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                <div className="flex justify-between items-end">
                    <div>
                        <div className="text-3xl font-bold tracking-tight text-foreground mb-1">98.2%</div>
                        <div className="text-sm text-muted-foreground font-medium">On-Time Performance</div>
                    </div>
                    <Link
                        href="/dashboard/routes"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                    >
                        View Map
                    </Link>
                </div>
            </div>
        </Card>
    );
}

export function OverviewRevenueCard() {
    return (
        <Card className="md:col-span-1 md:row-span-2 flex flex-col relative overflow-hidden border-border/60 shadow-sm">
            <CardContent className="p-6 flex flex-col h-full">
                <div className="flex justify-between items-center mb-6 z-10">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <DollarSign className="text-primary w-5 h-5" />
                    </div>
                    <Badge variant="secondary" className="text-success bg-success/10 hover:bg-success/20 border-success/20">
                        +14%
                    </Badge>
                </div>
                <div className="mb-auto z-10">
                    <div className="text-3xl font-bold tracking-tight text-foreground">$2.4M</div>
                    <div className="text-sm text-muted-foreground font-medium mt-1">Monthly Revenue</div>
                </div>
                {/* Decorative Chart */}
                <div className="absolute bottom-0 left-0 right-0 h-32 opacity-20 pointer-events-none">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="currentColor" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="currentColor" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="currentColor"
                                strokeWidth={2}
                                fill="url(#colorValue)"
                                className="text-primary"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

export function OverviewAlertCard() {
    return (
        <Card className="md:col-span-1 md:row-span-1 border-destructive/20 bg-destructive/5 hover:bg-destructive/10 transition-colors cursor-pointer group shadow-sm">
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive">
                        <AlertOctagon className="w-5 h-5" />
                    </div>
                    <ArrowRight className="text-muted-foreground group-hover:text-destructive transition-all -rotate-45 group-hover:rotate-0 w-5 h-5" />
                </div>
                <div className="mt-4">
                    <div className="text-2xl font-bold text-foreground group-hover:text-destructive transition-colors">
                        3 Holds
                    </div>
                    <div className="text-sm text-destructive/80 font-medium mt-1">Customs Clearance</div>
                </div>
            </CardContent>
        </Card>
    );
}

export function OverviewInventoryCard() {
    return (
        <Card className="md:col-span-1 md:row-span-1 relative overflow-hidden group border-border/60 shadow-sm">
            <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            <CardContent className="p-6 relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                        <Package className="w-4 h-4" />
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">Inventory</div>
                </div>
                
                <div className="flex items-end justify-between mb-2">
                    <div className="text-2xl font-bold text-foreground">12.4k</div>
                    <div className="text-xs font-medium text-muted-foreground">70% Capacity</div>
                </div>
                
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full w-[70%] rounded-full"></div>
                </div>
            </CardContent>
        </Card>
    );
}

export function OverviewActivityFeed() {
    return (
        <Card className="md:col-span-2 md:row-span-1 border-border/60 shadow-sm flex flex-col justify-center">
            <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Activity className="w-4 h-4 text-muted-foreground" />
                    <div className="text-sm font-medium text-muted-foreground">Live Feed</div>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-medium">
                            SM
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground truncate">
                                <span className="font-semibold">Sarah M.</span> approved manifest <span className="text-primary font-mono">#M-9921</span>
                            </p>
                        </div>
                        <span className="text-xs text-muted-foreground">2m ago</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-medium text-primary font-mono">
                            SYS
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground truncate">Automated route optimization complete.</p>
                        </div>
                        <span className="text-xs text-muted-foreground">5m ago</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export function OverviewWeatherCard() {
    return (
        <Card className="md:col-span-2 md:row-span-1 flex items-center justify-between relative overflow-hidden border-border/60 shadow-sm bg-gradient-to-r from-primary/5 to-transparent">
            <CardContent className="p-6 w-full flex items-center justify-between relative z-10">
                <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-xl bg-background border border-border/50 flex items-center justify-center shadow-sm">
                        <CloudRain className="text-primary w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-base font-semibold text-foreground">Storm Warning</div>
                        <div className="text-sm text-muted-foreground">North Atlantic Route • Delay +2h</div>
                    </div>
                </div>
                <div className="text-right">
                    <Badge variant="secondary" className="font-mono bg-background/50 border-primary/20 text-primary">
                        ALERT-99
                    </Badge>
                </div>
            </CardContent>
        </Card>
    )
}
