"use client";

import { cn } from "@/lib/utils";
import { Package, Truck, CheckCircle, AlertCircle, Clock, MapPin } from "lucide-react";

interface StatusStage {
  id: string;
  label: string;
  count: number;
  icon: React.ElementType;
  color: string;
}

interface StatusPipelineProps {
  stages: StatusStage[];
  onStageClick?: (stageId: string) => void;
  activeStage?: string;
}

const defaultStages: StatusStage[] = [
  { id: "pending", label: "Pending", count: 0, icon: Clock, color: "text-muted-foreground bg-muted" },
  { id: "picked_up", label: "Picked Up", count: 0, icon: Package, color: "text-info-foreground bg-info" },
  { id: "in_transit", label: "In Transit", count: 0, icon: Truck, color: "text-warning-foreground bg-warning" },
  { id: "out_for_delivery", label: "Out for Delivery", count: 0, icon: MapPin, color: "text-accent-foreground bg-accent" },
  { id: "delivered", label: "Delivered", count: 0, icon: CheckCircle, color: "text-success-foreground bg-success" },
  { id: "failed", label: "Failed", count: 0, icon: AlertCircle, color: "text-destructive-foreground bg-destructive" },
];

export function StatusPipeline({
  stages = defaultStages,
  onStageClick,
  activeStage,
}: StatusPipelineProps) {
  return (
    <div className="flex items-stretch gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted-foreground/20">
      {stages.map((stage, index) => {
        const Icon = stage.icon;
        const isActive = activeStage === stage.id;
        const [textColor, bgColor] = stage.color.split(" ");

        return (
          <div key={stage.id} className="flex items-center">
            <button
              onClick={() => onStageClick?.(stage.id)}
              className={cn(
                "flex flex-col items-center justify-center min-w-[110px] px-4 py-3 rounded-lg border transition-all",
                "hover:bg-muted/50 hover:border-primary/30",
                isActive 
                  ? "ring-2 ring-primary border-primary/50 bg-primary/5" 
                  : "border-border bg-card",
              )}
            >
              <div className={cn("p-2 rounded-full mb-2 bg-muted/50", bgColor?.replace("bg-", "bg-opacity-10 " + "bg-"))}>
                 <Icon className={cn("w-5 h-5", textColor)} />
              </div>
              <span className="text-2xl font-bold tracking-tight text-foreground">{stage.count}</span>
              <span className="text-xs text-muted-foreground font-medium mt-0.5">
                {stage.label}
              </span>
            </button>
            
            {index < stages.length - 1 && (
              <div className="mx-2 text-muted-foreground/20">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export { defaultStages };
export type { StatusStage };
