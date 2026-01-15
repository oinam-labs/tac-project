"use client";

import * as React from "react";
import {
  LayoutDashboard,
  BarChart2,
  Package,
  MapPin,
  Truck,
  ScanBarcode,
  Archive,
  AlertTriangle,
  FileText,
  DollarSign,
  Users,
  Settings,
  Headphones,
  MessageSquare,
  Map,
  Box
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Navigation configuration
const navConfig = {
  overview: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: BarChart2,
    },
  ],
  operations: [
    {
      title: "Shipments",
      url: "/dashboard/shipments",
      icon: Package,
    },
    {
      title: "Route Tracker",
      url: "/dashboard/route-tracker",
      icon: Map,
    },
    {
      title: "Tracking",
      url: "/dashboard/tracking",
      icon: MapPin,
    },
    {
      title: "Manifests",
      url: "/dashboard/manifests",
      icon: Truck,
    },
    {
      title: "Scanning",
      url: "/dashboard/scanning",
      icon: ScanBarcode,
    },
    {
      title: "Inventory",
      url: "/dashboard/inventory",
      icon: Archive,
    },
    {
      title: "Exceptions",
      url: "/dashboard/exceptions",
      icon: AlertTriangle,
    },
  ],
  finance: [
    {
      title: "Invoices",
      url: "/dashboard/invoices",
      icon: FileText,
    },
    {
      title: "Payments",
      url: "/dashboard/payments",
      icon: DollarSign,
    },
  ],
  management: [
    {
      title: "Customers",
      url: "/dashboard/customers",
      icon: Users,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "/dashboard/support",
      icon: Headphones,
    },
    {
      title: "Feedback",
      url: "/dashboard/feedback",
      icon: MessageSquare,
    },
  ],
};

// User type for sidebar
interface SidebarUser {
  name: string;
  email: string;
  avatar?: string;
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: SidebarUser;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  // Default user for development - should come from auth context in production
  const displayUser = {
    name: user?.name ?? "Admin User",
    email: user?.email ?? "admin@taccargo.com",
    avatar:
      user?.avatar ??
      "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png",
  };
  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <a href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Box className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">TAC Cargo</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain label="Overview" items={navConfig.overview} />
        <NavMain label="Operations" items={navConfig.operations} />
        <NavMain label="Finance" items={navConfig.finance} />
        <NavMain label="Management" items={navConfig.management} />

        <NavSecondary
          items={navConfig.navSecondary}
          className="mt-auto"
        />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={displayUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
