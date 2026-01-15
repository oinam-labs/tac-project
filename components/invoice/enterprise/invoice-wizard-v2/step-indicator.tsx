"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { WizardStep } from "./types";

interface StepIndicatorProps {
  steps: WizardStep[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  className?: string;
}

export function StepIndicator({ steps, currentStep, onStepClick, className }: StepIndicatorProps) {
  const progressPercentage = ((currentStep) / (steps.length - 1)) * 100;

  return (
    <div className={cn("w-full space-y-2", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            {steps[currentStep].title}
          </h2>
          <p className="text-xs text-muted-foreground">
            Step {currentStep + 1} of {steps.length} • {steps[currentStep].description}
          </p>
        </div>

        {/* Step dots for quick navigation */}
        <div className="flex items-center gap-2">
          {steps.map((step, index) => {
            const status = index < currentStep ? "completed" : index === currentStep ? "current" : "pending";
            return (
              <button
                key={step.id}
                onClick={() => status === "completed" && onStepClick?.(index)}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all duration-300",
                  status === "completed" ? "bg-primary hover:bg-primary/80 cursor-pointer" :
                    status === "current" ? "bg-primary scale-125" : "bg-muted"
                )}
                aria-label={`Go to step ${index + 1}`}
                disabled={status !== "completed"}
              />
            )
          })}
        </div>
      </div>

      {/* Sleek Progress Line */}
      <div className="h-1 w-full bg-muted/50 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full shadow-lg shadow-primary/20"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}

export default StepIndicator;
