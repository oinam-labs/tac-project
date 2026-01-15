"use client";

import { motion } from "framer-motion";

import {
  Package,
  Truck,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Clock,
  MapPin,
  Activity
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusPipeline } from "@/components/dashboard/status-pipeline";
import { HeroBanner } from "@/components/dashboard/hero-banner";
import { AlertsPanel } from "@/components/dashboard/alerts-panel";
import { GradientKPICard } from "@/components/dashboard/gradient-kpi-card";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { ShipmentTrendsChart } from "@/components/dashboard/shipment-trends-chart";
import type { ShipmentStatus } from "@/types/database";

interface MissionControlProps {
  stats: {
    shipments: {
      total: number;
      pending: number;
      inTransit: number;
      delivered: number;
      failed: number;
      today: number;
      delayed: number;
    };
    finance: {
      revenue: number;
      outstanding: number;
    };
    operations: {
      activeManifests: number;
    };
  };
  recentActivity: Array<{
    id: string;
    reference: string;
    status: ShipmentStatus;
    consignee_name: string | null;
    updated_at: string;
  }>;

  shipmentTrend?: Array<{ date: string; count: number; delivered?: number }>;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};



export function MissionControl({
  stats,
  recentActivity,
  shipmentTrend = []
}: MissionControlProps) {
  // Demo data for empty states
  const DEMO_STATS = {
    shipments: {
      total: 1248,
      pending: 45,
      inTransit: 842,
      delivered: 325,
      failed: 12,
      today: 18,
      delayed: 3
    },
    finance: {
      revenue: 4250000,
      outstanding: 150000
    },
    operations: {
      activeManifests: 14
    }
  };

  // Generate 90 days of demo trend data for comprehensive chart visualization
  const DEMO_TREND = Array.from({ length: 90 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (89 - i));
    // Generate realistic shipment counts (100-500 range) with variation
    const baseCount = 150;
    const variation = ((i + 1) * 17 * 23) % 250;
    const weekdayBoost = (d.getDay() === 0 || d.getDay() === 6) ? -50 : 80; // Lower on weekends
    const count = Math.max(80, baseCount + variation + weekdayBoost);
    return {
      date: d.toISOString().split('T')[0],
      count: count,
      delivered: Math.floor(count * 0.85)
    };
  });

  // Use demo data if total shipments is 0 (assuming fresh instance)
  const activeStats = stats.shipments.total === 0 ? DEMO_STATS : stats;
  const activeTrend = (shipmentTrend.length === 0 || stats.shipments.total === 0) ? DEMO_TREND : shipmentTrend;

  const deliveryRate = activeStats.shipments.total > 0
    ? Math.round((activeStats.shipments.delivered / activeStats.shipments.total) * 100)
    : 0;



  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Hero Banner */}
      <motion.div variants={itemVariants}>
        <HeroBanner />
      </motion.div>

      {/* Enhanced KPI Section Cards */}
      <motion.div variants={itemVariants} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <GradientKPICard
          title="Total Shipments"
          value={activeStats.shipments.total.toLocaleString()}
          description={`${activeStats.shipments.today} created today`}
          icon={Package}
          trend={activeStats.shipments.today > 0 ? 12.5 : 0}
          trendLabel={activeStats.shipments.today > 0 ? "+12.5%" : "0%"}
          gradientCode="shipments"
          data={[
            { value: activeStats.shipments.total * 0.8 },
            { value: activeStats.shipments.total * 0.9 },
            { value: activeStats.shipments.total * 0.85 },
            { value: activeStats.shipments.total * 0.95 },
            { value: activeStats.shipments.total },
            { value: activeStats.shipments.total * 1.1 },
            { value: activeStats.shipments.total * 1.125 }
          ]}
        />
        <GradientKPICard
          title="In Transit"
          value={activeStats.shipments.inTransit.toLocaleString()}
          description={activeStats.shipments.delayed > 0 ? `${activeStats.shipments.delayed} interrupted` : "On schedule"}
          icon={Truck}
          trend={activeStats.shipments.delayed > 0 ? -activeStats.shipments.delayed : 5.2}
          trendLabel={activeStats.shipments.delayed > 0 ? `-${activeStats.shipments.delayed}` : "+5.2%"}
          gradientCode={activeStats.shipments.delayed > 0 ? "alerts" : "shipments"}
          data={[
            { value: 45 },
            { value: 52 },
            { value: 48 },
            { value: 55 },
            { value: 50 },
            { value: 58 },
            { value: 60 }
          ]}
        />
        <GradientKPICard
          title="Total Revenue"
          value={`₹${(activeStats.finance.revenue / 1000).toFixed(1)}K`}
          description="Monthly revenue"
          icon={DollarSign}
          trend={8.3}
          trendLabel="+8.3%"
          gradientCode="revenue"
          data={[
            { value: 100 },
            { value: 120 },
            { value: 110 },
            { value: 140 },
            { value: 130 },
            { value: 160 },
            { value: 175 }
          ]}
        />
        <GradientKPICard
          title="Delivery Rate"
          value={`${deliveryRate}%`}
          description="Successful deliveries"
          icon={CheckCircle}
          trend={deliveryRate >= 90 ? 2.1 : -1.5}
          trendLabel={deliveryRate >= 90 ? "+2.1%" : "-1.5%"}
          gradientCode="success"
          data={[
            { value: 85 },
            { value: 88 },
            { value: 86 },
            { value: 89 },
            { value: 92 },
            { value: 90 },
            { value: 95 }
          ]}
        />
      </motion.div>

      {/* Shipment Trends Chart */}
      <motion.div variants={itemVariants}>
        <ShipmentTrendsChart
          data={activeTrend.map(d => ({
            date: d.date,
            shipments: d.count,
            delivered: d.delivered ?? Math.floor(d.count * 0.85)
          }))}
          totalShipments={activeStats.shipments.total}
          deliveryRateProp={deliveryRate}
        />
      </motion.div>

      {/* Status Pipeline */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Shipment Pipeline</CardTitle>
            <span className="text-sm text-muted-foreground">
              {deliveryRate}% delivery rate
            </span>
          </CardHeader>
          <CardContent>
            <StatusPipeline
              stages={[
                { id: "pending", label: "Pending", count: activeStats.shipments.pending, icon: Clock, color: "text-muted-foreground bg-muted" },
                { id: "in_transit", label: "In Transit", count: activeStats.shipments.inTransit, icon: Truck, color: "text-warning-foreground bg-warning" },
                { id: "out_for_delivery", label: "Out for Delivery", count: 0, icon: MapPin, color: "text-info-foreground bg-info" },
                { id: "delivered", label: "Delivered", count: activeStats.shipments.delivered, icon: CheckCircle, color: "text-success-foreground bg-success" },
                { id: "failed", label: "Failed", count: activeStats.shipments.failed, icon: AlertCircle, color: "text-destructive-foreground bg-destructive" },
              ]}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Bottom Row: Recent Activity, Quick Actions, Alerts */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 h-full">
          <RecentActivity activities={recentActivity} />
        </div>

        {/* Quick Actions & Alerts */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <QuickActionLink href="/dashboard/shipments?action=create" label="New Shipment" icon={Package} />
              <QuickActionLink href="/dashboard/manifests?action=create" label="New Manifest" icon={Truck} />
              <QuickActionLink href="/dashboard/scanning" label="Scan" icon={Activity} />
              <QuickActionLink href="/dashboard/tracking" label="Track" icon={Clock} />
            </CardContent>
          </Card>

          {/* Alerts */}
          <AlertsPanel />
        </div>
      </motion.div>
    </motion.div>
  );
}

function QuickActionLink({
  href,
  label,
  icon: Icon
}: {
  href: string;
  label: string;
  icon: React.ElementType;
}) {
  return (
    <Link href={href} className="w-full">
      <div className="flex items-center gap-3 p-3 rounded-md hover:bg-muted/50 transition-colors group border border-transparent hover:border-border">
        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-sm font-medium text-foreground">
          {label}
        </span>
      </div>
    </Link>
  );
}
