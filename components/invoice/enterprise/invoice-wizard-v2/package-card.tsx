"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Package, 
  Trash2, 
  Scale, 
  Ruler, 
  IndianRupee,
  GripVertical,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { PackageData } from "./types";
import { PACKAGE_CATEGORIES } from "./types";

// =============================================================================
// TYPES
// =============================================================================

interface PackageCardProps {
  pkg: PackageData;
  index: number;
  onChange: (field: keyof PackageData, value: string | number) => void;
  onRemove: () => void;
  canRemove: boolean;
  errors?: Record<string, string>;
  className?: string;
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

interface NumericInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  error?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  suffix?: string;
  min?: number;
  step?: number;
  className?: string;
}

function NumericInput({
  label,
  value,
  onChange,
  error,
  placeholder,
  icon,
  suffix,
  min = 0,
  step = 1,
  className,
}: NumericInputProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-xs font-medium text-muted-foreground/90">{label}</Label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 pointer-events-none">
            {icon}
          </div>
        )}
        <Input
          type="number"
          value={value || ""}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          placeholder={placeholder}
          min={min}
          step={step}
          className={cn(
            "h-10 transition-all border-border/60 focus:border-primary/80 focus:ring-primary/20 placeholder:text-muted-foreground/70",
            icon && "pl-9",
            suffix && "pr-12",
            error && "border-destructive focus-visible:ring-destructive/20"
          )}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium pointer-events-none">
            {suffix}
          </div>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-[11px] text-destructive font-medium flex items-center gap-1 mt-1.5"
          >
            <AlertCircle className="w-3 h-3" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function PackageCard({
  pkg,
  index,
  onChange,
  onRemove,
  canRemove,
  errors = {},
  className,
}: PackageCardProps) {
  // Calculate volumetric weight
  const volumetricWeight = pkg.length && pkg.width && pkg.height
    ? (pkg.length * pkg.width * pkg.height) / 5000
    : 0;
  const chargeableWeight = Math.max(pkg.weight, volumetricWeight);

  const descError = errors[`pkg${index}Desc`];
  const weightError = errors[`pkg${index}Weight`];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          "relative overflow-hidden group transition-all duration-200 border-border/60 shadow-sm",
          "hover:shadow-md hover:border-primary/30",
          className
        )}
      >
        {/* Package number indicator */}
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary via-primary/60 to-primary/20" />

        <CardContent className="p-6 pl-7">
          <div className="flex items-start gap-5">
            {/* Drag Handle & Package Icon */}
            <div className="flex flex-col items-center gap-2 pt-1">
              <div className="cursor-grab text-muted-foreground/40 hover:text-muted-foreground transition-colors p-1">
                <GripVertical className="w-4 h-4" />
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shadow-sm text-primary">
                <Package className="w-5 h-5" />
              </div>
              <Badge variant="outline" className="text-[10px] font-mono h-5 px-1.5">
                #{index + 1}
              </Badge>
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-6">
              {/* Description & Category Row */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                <div className="md:col-span-8 space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground/90 flex items-center">
                    Description <span className="text-destructive ml-1">*</span>
                  </Label>
                  <Input
                    value={pkg.description}
                    onChange={(e) => onChange("description", e.target.value)}
                    placeholder="What's inside? (e.g., Electronics, Documents)"
                    className={cn(
                      "h-10 border-border/60 focus:border-primary/80 focus:ring-primary/20 placeholder:text-muted-foreground/70",
                      descError && "border-destructive focus-visible:ring-destructive/20"
                    )}
                  />
                  {descError && (
                    <p className="text-[11px] text-destructive font-medium flex items-center gap-1 mt-1.5">
                      <AlertCircle className="w-3 h-3" />
                      {descError}
                    </p>
                  )}
                </div>

                <div className="md:col-span-4 space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground/90">Category</Label>
                  <Select
                    value={pkg.category}
                    onValueChange={(v) => onChange("category", v)}
                  >
                    <SelectTrigger className="h-10 border-border/60 focus:ring-primary/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PACKAGE_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          <span className="flex items-center gap-2">
                            <span>{cat.icon}</span>
                            <span>{cat.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Quantity, Weight, Dimensions Row */}
              <div className="grid grid-cols-2 md:grid-cols-12 gap-5">
                <div className="col-span-1 md:col-span-2">
                  <NumericInput
                    label="Qty"
                    value={pkg.quantity}
                    onChange={(v) => onChange("quantity", Math.max(1, v))}
                    min={1}
                    placeholder="1"
                  />
                </div>

                <div className="col-span-1 md:col-span-3">
                  <NumericInput
                    label="Weight"
                    value={pkg.weight}
                    onChange={(v) => onChange("weight", v)}
                    error={weightError}
                    icon={<Scale className="w-3.5 h-3.5" />}
                    suffix="kg"
                    step={0.1}
                    placeholder="0.0"
                  />
                </div>

                <div className="col-span-2 md:col-span-4">
                  <Label className="text-xs font-medium text-muted-foreground/90 mb-2 flex items-center gap-1">
                    <Ruler className="w-3 h-3" />
                    Dimensions (L × W × H)
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={pkg.length || ""}
                      onChange={(e) => onChange("length", parseFloat(e.target.value) || 0)}
                      placeholder="L"
                      className="h-10 text-center border-border/60 focus:border-primary/80 focus:ring-primary/20"
                      min={0}
                    />
                    <span className="text-muted-foreground/50">×</span>
                    <Input
                      type="number"
                      value={pkg.width || ""}
                      onChange={(e) => onChange("width", parseFloat(e.target.value) || 0)}
                      placeholder="W"
                      className="h-10 text-center border-border/60 focus:border-primary/80 focus:ring-primary/20"
                      min={0}
                    />
                    <span className="text-muted-foreground/50">×</span>
                    <Input
                      type="number"
                      value={pkg.height || ""}
                      onChange={(e) => onChange("height", parseFloat(e.target.value) || 0)}
                      placeholder="H"
                      className="h-10 text-center border-border/60 focus:border-primary/80 focus:ring-primary/20"
                      min={0}
                    />
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-1">cm</span>
                  </div>
                </div>

                <div className="col-span-2 md:col-span-3">
                  <NumericInput
                    label="Declared Value"
                    value={pkg.declaredValue}
                    onChange={(v) => onChange("declaredValue", v)}
                    icon={<IndianRupee className="w-3.5 h-3.5" />}
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Weight Summary */}
              <div className="flex items-center gap-4 pt-4 border-t border-dashed">
                <div className="flex items-center gap-6 text-xs">
                  <div>
                    <span className="text-muted-foreground">Vol. Weight: </span>
                    <span className="font-semibold text-info">{volumetricWeight.toFixed(2)} kg</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Chargeable: </span>
                    <span className="font-bold text-primary">{chargeableWeight.toFixed(2)} kg</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Remove Button */}
            {canRemove && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onRemove}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default PackageCard;
