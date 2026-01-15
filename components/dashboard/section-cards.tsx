"use client";

import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SectionCardData {
  title: string;
  value: string | number;
  description: string;
  trend: number;
  trendLabel: string;
  footerLabel: string;
}

interface SectionCardsProps {
  cards?: SectionCardData[];
}

const defaultCards: SectionCardData[] = [
  {
    title: "Total Shipments",
    value: "1,234",
    description: "Active shipments in pipeline",
    trend: 12.5,
    trendLabel: "+12.5%",
    footerLabel: "Trending up this month",
  },
  {
    title: "Delivered Today",
    value: "89",
    description: "Successful deliveries",
    trend: 8.2,
    trendLabel: "+8.2%",
    footerLabel: "Above daily average",
  },
  {
    title: "Revenue",
    value: "₹4.5L",
    description: "This month's collection",
    trend: -3.5,
    trendLabel: "-3.5%",
    footerLabel: "Needs attention",
  },
  {
    title: "Delivery Rate",
    value: "94.5%",
    description: "On-time delivery",
    trend: 2.1,
    trendLabel: "+2.1%",
    footerLabel: "Exceeds target of 90%",
  },
];

export function SectionCards({ cards = defaultCards }: SectionCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => {
        const isPositive = card.trend >= 0;
        const TrendIcon = isPositive ? IconTrendingUp : IconTrendingDown;

        return (
          <Card key={index} className="flex flex-col">
            <CardHeader className="pb-2">
              <CardDescription className="text-sm font-medium">{card.title}</CardDescription>
              <div className="flex items-center justify-between">
                <CardTitle className="text-3xl font-bold tracking-tight tabular-nums">
                  {card.value}
                </CardTitle>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "h-6 gap-1 border px-2 text-xs font-medium",
                    isPositive 
                      ? "bg-success/10 text-success border-success/20" 
                      : "bg-destructive/10 text-destructive border-destructive/20"
                  )}
                >
                  <TrendIcon className="size-3" />
                  {card.trendLabel}
                </Badge>
              </div>
            </CardHeader>
            <CardFooter className="mt-auto pt-0">
              <div className="flex flex-col gap-1 text-xs">
                 <span className="text-muted-foreground">{card.description}</span>
                 <span className={cn("font-medium", isPositive ? "text-success" : "text-muted-foreground")}>
                   {card.footerLabel}
                 </span>
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

export type { SectionCardData };
