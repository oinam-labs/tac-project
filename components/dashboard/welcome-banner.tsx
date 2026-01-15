"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight, X } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface WelcomeBannerProps {
  userName?: string;
  greeting?: string;
  showQuickStats?: boolean;
  stats?: {
    todayShipments?: number;
    pendingTasks?: number;
    revenue?: number;
  };
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function WelcomeBanner({
  userName = "there",
  greeting,
  showQuickStats = true,
  stats,
  dismissible = true,
  onDismiss,
  className,
}: WelcomeBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const displayGreeting = greeting || getGreeting();

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  return (
    <Card
      className={cn(
        "relative overflow-hidden border-primary/10 bg-gradient-to-r from-primary/5 via-background to-background",
        className
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-6">
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {displayGreeting}, {userName}!
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">
                Here&apos;s what&apos;s happening with your logistics operations today. You have pending tasks that require your attention.
              </p>
            </div>

            {showQuickStats && stats && (
              <div className="flex flex-wrap items-center gap-8 py-2">
                {stats.todayShipments !== undefined && (
                  <div className="space-y-1">
                    <div className="text-2xl font-bold tabular-nums text-foreground">
                      {stats.todayShipments}
                    </div>
                    <div className="text-xs font-medium text-muted-foreground">
                      Today&apos;s Shipments
                    </div>
                  </div>
                )}
                {stats.pendingTasks !== undefined && (
                  <div className="space-y-1">
                    <div className="text-2xl font-bold tabular-nums text-warning">
                      {stats.pendingTasks}
                    </div>
                    <div className="text-xs font-medium text-muted-foreground">
                      Pending Tasks
                    </div>
                  </div>
                )}
                {stats.revenue !== undefined && (
                  <div className="space-y-1">
                    <div className="text-2xl font-bold tabular-nums text-success">
                      ₹{(stats.revenue / 1000).toFixed(1)}K
                    </div>
                    <div className="text-xs font-medium text-muted-foreground">
                      Today&apos;s Revenue
                    </div>
                  </div>
                )}
              </div>
            )}

            <Button asChild size="default" className="mt-2">
              <Link href="/dashboard/shipments?action=create">
                Create Shipment
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>

          {/* Illustration */}
          <div className="hidden lg:block relative w-64 h-48 flex-shrink-0">
            <Image
              src="/images/dashboard-welcome.png"
              alt="Dashboard Welcome"
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              className="object-contain object-right"
              priority
            />
          </div>

          {/* Dismiss button */}
          {dismissible && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
              onClick={handleDismiss}
            >
              <X className="size-4" />
              <span className="sr-only">Dismiss</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
