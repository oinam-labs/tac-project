import React from "react";
import { ThroughputMetric } from "./throughput-metric";
import { DeliveryTimeline } from "./delivery-timeline";
import { WorkerCapacity } from "./worker-capacity";
import { QualityMetric } from "./quality-metric";
import { RevenueMetric } from "./revenue-metric";

interface AnalyticsData {
    summary: {
        totalShipments: number;
        deliveredCount: number;
        failedCount: number;
        deliveryRate: number;
        totalWeight: number;
        totalPieces: number;
        totalRevenue: number;
    };
    charts: {
        shipmentsByDate: Array<{ date: string; count: number }>;
        revenueByDate: Array<{ date: string; amount: number }>;
    };
    statusDistribution?: Array<{ name: string; value: number; fill: string }>;
    topCustomers?: Array<{ name: string; value: number }>;
}

interface AnalyticsClientProps {
    data: AnalyticsData;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function AnalyticsClient({ data }: AnalyticsClientProps) {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-center bg-card p-4 rounded-xl border border-border/50 shadow-sm">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Capacity plans</span>
                    <span className="text-muted-foreground/50">/</span>
                    <span>Dashboard</span>
                    <span className="text-muted-foreground/50">/</span>
                    <span className="font-semibold text-foreground">Overview</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by serial number or name"
                            className="h-10 w-[300px] pl-10 pr-4 rounded-full bg-muted/50 border-none text-sm focus:ring-1 focus:ring-primary/20 placeholder:text-muted-foreground"
                        />
                        <svg className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <button className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors">
                        <svg className="w-5 h-5 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </button>
                    <button className="h-10 w-10 rounded-full bg-background border border-border shadow-sm flex items-center justify-center hover:bg-muted/50 transition-colors relative">
                        <svg className="w-5 h-5 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-warning rounded-full border-2 border-background"></span>
                    </button>
                </div>
            </div>

            {/* Custom Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto">
                {/* Left Column (2/3 width) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Hero Throughput Card */}
                    <div className="h-[400px]">
                        <ThroughputMetric />
                    </div>

                    {/* Bottom Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-[260px]">
                        {/* Worker Capacity (1 col) */}
                        <div className="lg:col-span-1 h-full">
                            <WorkerCapacity />
                        </div>

                        {/* Quality (1 col) */}
                        <div className="lg:col-span-1 h-full">
                            <QualityMetric />
                        </div>

                        {/* Revenue (2 cols) */}
                        <div className="lg:col-span-2 h-full">
                            <RevenueMetric />
                        </div>
                    </div>
                </div>

                {/* Right Column (1/3 width) - Timeline */}
                <div className="lg:col-span-1 h-full min-h-[684px]">
                    <DeliveryTimeline />
                </div>
            </div>
        </div>
    );
}

