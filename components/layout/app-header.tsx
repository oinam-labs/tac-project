"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";
import { BellIcon, SearchIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";

import ProfileDropdown from "@/components/shadcn-studio/blocks/dropdown-profile";

export function AppHeader() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  return (
    <header className="bg-background/80 sticky top-0 z-40 flex h-16 shrink-0 items-center gap-4 border-b border-border px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-muted-foreground hover:bg-accent hover:text-foreground size-9 rounded-md transition-all" />
        <Separator orientation="vertical" className="h-6" />

        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList className="gap-1.5">
            {pathSegments.map((segment, index) => {
              const isLast = index === pathSegments.length - 1;
              const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
              const title =
                segment.charAt(0).toUpperCase() +
                segment.slice(1).replace(/-/g, " ");

              return (
                <React.Fragment key={segment}>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="text-foreground font-semibold">
                        {title}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        href={href}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {title}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && (
                    <BreadcrumbSeparator className="text-muted-foreground/40" />
                  )}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Central Command Input */}
      <div className="mx-auto flex max-w-xl flex-1 justify-center">
        <div className="group relative w-full">
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
            <SearchIcon className="text-muted-foreground group-focus-within:text-primary size-4 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search shipments, routes, or drivers..."
            className="placeholder:text-muted-foreground/70 focus:border-ring focus:ring-ring/30 h-10 w-full rounded-md border border-input bg-background pr-12 pl-10 text-sm text-foreground transition-all focus:ring-2 focus:outline-none"
          />
          <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center gap-1 opacity-50">
            <span className="bg-muted text-muted-foreground border-border rounded border px-1.5 py-0.5 text-[10px] font-medium">
              ⌘ K
            </span>
          </div>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Status Indicators */}
        <div className="mr-4 hidden items-center gap-4 md:flex">
          <div className="flex items-center gap-2">
            <span className="bg-success/20 size-2 animate-pulse rounded-full" />
            <span className="text-muted-foreground text-xs font-medium">
              System Online
            </span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground relative size-9"
        >
          <BellIcon className="size-5" />
          <span className="bg-destructive border-background absolute top-2 right-2 size-2 rounded-full border-2" />
        </Button>

        <ThemeToggle />

        <Separator orientation="vertical" className="mx-1 h-6" />

        <ProfileDropdown
          trigger={
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-accent size-9 rounded-full p-0"
            >
              <Avatar className="size-8 border border-border">
                <AvatarImage src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png" />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  TC
                </AvatarFallback>
              </Avatar>
            </Button>
          }
        />
      </div>
    </header>
  );
}
