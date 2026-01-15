"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PageShellProps {
    children: React.ReactNode;
    title: string;
    description?: string;
    breadcrumb?: string[];
    action?: React.ReactNode;
    className?: string;
}

export function PageShell({
    children,
    title,
    description,
    breadcrumb = ["Dashboard", "Overview"],
    action,
    className
}: PageShellProps) {
    return (
        <div className={cn("space-y-8 animate-in fade-in duration-500", className)}>
            {/* Header Section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-card p-6 rounded-2xl border border-border shadow-sm backdrop-blur-xl">
                <div className="space-y-1">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
                        {breadcrumb.map((item, i) => (
                            <React.Fragment key={i}>
                                <span className={cn(
                                    "transition-colors hover:text-foreground cursor-pointer",
                                    i === breadcrumb.length - 1 && "text-foreground font-semibold cursor-default"
                                )}>
                                    {item}
                                </span>
                                {i < breadcrumb.length - 1 && (
                                    <ChevronRight className="w-3 h-3 text-muted-foreground/50" />
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-sm text-muted-foreground max-w-2xl">
                            {description}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {action}
                    <div className="h-8 w-px bg-border mx-2 hidden md:block" />
                    {/* Common Actions */}
                    <div className="flex items-center gap-2">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Quick search..."
                                className="pl-9 w-[200px] h-9 bg-muted/50 border-none rounded-full text-sm transition-all focus:w-[250px] focus:ring-1 focus:ring-primary/20"
                            />
                        </div>
                        <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground hover:bg-muted">
                            <Bell className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="min-h-[600px]">
                {children}
            </div>
        </div>
    );
}
