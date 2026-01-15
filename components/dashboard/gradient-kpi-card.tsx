"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import {
    Area,
    AreaChart,
    ResponsiveContainer
} from "recharts";

interface GradientKPICardProps {
    title: string;
    value: string;
    description?: string;
    icon: LucideIcon;
    trend?: number;
    trendLabel?: string;
    gradientCode: "revenue" | "shipments" | "success" | "alerts";
    data?: Array<{ value: number }>;
    className?: string;
    variant?: "default" | "solid";
}

const themeMap = {
    revenue: {
        gradient: "from-primary/20 to-primary/5",
        solidGradient: "from-blue-600 to-indigo-700",
        border: "border-primary/50",
        iconBg: "bg-primary/10",
        solidIconBg: "bg-white/20",
        iconColor: "text-primary",
        solidIconColor: "text-white",
        chartColor: "var(--primary)",
        solidChartColor: "#ffffff",
        textColor: "text-foreground",
        solidTextColor: "text-white",
        mutedTextColor: "text-muted-foreground",
        solidMutedTextColor: "text-white/70",
    },
    shipments: {
        gradient: "from-info/20 to-info/5",
        solidGradient: "from-sky-500 to-blue-600",
        border: "border-info/50",
        iconBg: "bg-info/10",
        solidIconBg: "bg-white/20",
        iconColor: "text-info",
        solidIconColor: "text-white",
        chartColor: "var(--info)",
        solidChartColor: "#ffffff",
        textColor: "text-foreground",
        solidTextColor: "text-white",
        mutedTextColor: "text-muted-foreground",
        solidMutedTextColor: "text-white/70",
    },
    success: {
        gradient: "from-success/20 to-success/5",
        solidGradient: "from-emerald-500 to-green-600",
        border: "border-success/50",
        iconBg: "bg-success/10",
        solidIconBg: "bg-white/20",
        iconColor: "text-success",
        solidIconColor: "text-white",
        chartColor: "var(--success)",
        solidChartColor: "#ffffff",
        textColor: "text-foreground",
        solidTextColor: "text-white",
        mutedTextColor: "text-muted-foreground",
        solidMutedTextColor: "text-white/70",
    },
    alerts: {
        gradient: "from-destructive/20 to-destructive/5",
        solidGradient: "from-red-500 to-rose-600",
        border: "border-destructive/50",
        iconBg: "bg-destructive/10",
        solidIconBg: "bg-white/20",
        iconColor: "text-destructive",
        solidIconColor: "text-white",
        chartColor: "var(--destructive)",
        solidChartColor: "#ffffff",
        textColor: "text-foreground",
        solidTextColor: "text-white",
        mutedTextColor: "text-muted-foreground",
        solidMutedTextColor: "text-white/70",
    },
};

const defaultChartData = [
    { value: 40 },
    { value: 30 },
    { value: 50 },
    { value: 45 },
    { value: 60 },
    { value: 55 },
    { value: 70 },
];

export function GradientKPICard({
    title,
    value,
    description,
    icon: Icon,
    trend,
    trendLabel,
    gradientCode = "shipments",
    data = defaultChartData,
    className,
    variant = "default",
}: GradientKPICardProps) {
    const theme = themeMap[gradientCode] || themeMap.shipments;
    const isPositive = trend && trend >= 0;
    const isSolid = variant === "solid";

    return (
        <motion.div
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={cn(
                "relative overflow-hidden rounded-xl border p-6 backdrop-blur-xl shadow-sm transition-shadow hover:shadow-md",
                isSolid ? "border-transparent" : ["bg-background/50", theme.border],
                className
            )}
        >
            {/* Background Gradient */}
            <div
                className={cn(
                    "absolute inset-0 bg-gradient-to-br",
                    isSolid ? [theme.solidGradient, "opacity-100"] : [theme.gradient, "opacity-30"]
                )}
            />

            <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <span className={cn("text-sm font-medium", isSolid ? theme.solidMutedTextColor : "text-muted-foreground")}>
                            {title}
                        </span>
                        <div className="flex items-baseline gap-2">
                            <h2 className={cn("text-3xl font-bold tracking-tight", isSolid ? theme.solidTextColor : "text-foreground")}>
                                {value}
                            </h2>
                        </div>
                    </div>
                    <div className={cn("p-2.5 rounded-lg", isSolid ? theme.solidIconBg : theme.iconBg)}>
                        <Icon className={cn("h-5 w-5", isSolid ? theme.solidIconColor : theme.iconColor)} />
                    </div>
                </div>

                <div className="mt-4 flex items-end justify-between">
                    <div className="space-y-1">
                        {trendLabel && (
                            <div
                                className={cn(
                                    "flex items-center text-xs font-medium",
                                    isSolid ? "text-white/90" : (isPositive ? "text-success" : "text-destructive")
                                )}
                            >
                                {isPositive ? (
                                    <ArrowUpRight className="mr-1 h-3 w-3" />
                                ) : (
                                    <ArrowDownRight className="mr-1 h-3 w-3" />
                                )}
                                {trendLabel}
                                <span className={cn("ml-1 hidden sm:inline", isSolid ? "text-white/60" : "text-muted-foreground")}>
                                    vs last period
                                </span>
                            </div>
                        )}
                        {description && (
                            <p className={cn("text-xs", isSolid ? theme.solidMutedTextColor : "text-muted-foreground")}>{description}</p>
                        )}
                    </div>

                    <div className="h-12 w-24">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id={`gradient-${gradientCode}-${isSolid ? 'solid' : 'default'}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={isSolid ? theme.solidChartColor : theme.chartColor} stopOpacity={0.5} />
                                        <stop offset="95%" stopColor={isSolid ? theme.solidChartColor : theme.chartColor} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke={isSolid ? theme.solidChartColor : theme.chartColor}
                                    fill={`url(#gradient-${gradientCode}-${isSolid ? 'solid' : 'default'})`}
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
