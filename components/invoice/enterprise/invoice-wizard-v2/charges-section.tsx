"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  IndianRupee, 
  Percent, 
  Truck, 
  Package, 
  Shield, 
  Wrench,
  Tags,
  CreditCard,
  Fuel,
} from "lucide-react";
import type { ChargesData } from "./types";

// =============================================================================
// TYPES
// =============================================================================

interface ChargesSectionProps {
  charges: ChargesData;
  onChange: (field: keyof ChargesData, value: number) => void;
  className?: string;
}

interface ChargeInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  icon: React.ElementType;
  suffix?: string;
  step?: number;
  hint?: string;
}

// =============================================================================
// CHARGE INPUT COMPONENT
// =============================================================================

function ChargeInput({
  label,
  value,
  onChange,
  icon: Icon,
  suffix = "₹",
  step = 0.01,
  hint,
}: ChargeInputProps) {
  const isPercentage = suffix === "%";

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-muted-foreground/90 flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5 text-muted-foreground/70" />
        {label}
      </Label>
      <div className="relative">
        {!isPercentage && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium pointer-events-none">
            ₹
          </div>
        )}
        <Input
          type="number"
          value={value || ""}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          step={step}
          min={0}
          className={cn(
            "h-10 transition-all border-border/60 focus:border-primary/80 focus:ring-primary/20 placeholder:text-muted-foreground/70",
            !isPercentage && "pl-8",
            isPercentage && "pr-8"
          )}
          placeholder="0.00"
        />
        {isPercentage && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium pointer-events-none">
            %
          </div>
        )}
      </div>
      {hint && <p className="text-[10px] text-muted-foreground/80">{hint}</p>}
    </div>
  );
}

// =============================================================================
// CHARGE GROUP COMPONENT
// =============================================================================

interface ChargeGroupProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  className?: string;
}

function ChargeGroup({ title, icon: Icon, children, className }: ChargeGroupProps) {
  return (
    <Card className={cn("transition-all hover:shadow-md border-border/60 shadow-sm", className)}>
      <CardHeader className="p-6 pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shadow-sm">
            <Icon className="w-4 h-4" />
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-4">{children}</CardContent>
    </Card>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function ChargesSection({ charges, onChange, className }: ChargesSectionProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Freight Charges */}
      <ChargeGroup title="Freight Charges" icon={Truck}>
        <div className="grid grid-cols-2 gap-4">
          <ChargeInput
            label="Rate per Kg"
            value={charges.ratePerKg}
            onChange={(v) => onChange("ratePerKg", v)}
            icon={IndianRupee}
            hint="Base freight rate"
          />
          <ChargeInput
            label="Fuel Surcharge"
            value={charges.fuelSurchargePercentage}
            onChange={(v) => onChange("fuelSurchargePercentage", v)}
            icon={Fuel}
            suffix="%"
            step={0.5}
            hint="Applied on base freight"
          />
        </div>
      </ChargeGroup>

      {/* Service Charges */}
      <ChargeGroup title="Service Charges" icon={Package}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <ChargeInput
            label="Pickup Charge"
            value={charges.pickupCharge}
            onChange={(v) => onChange("pickupCharge", v)}
            icon={Truck}
          />
          <ChargeInput
            label="Delivery Charge"
            value={charges.deliveryCharge}
            onChange={(v) => onChange("deliveryCharge", v)}
            icon={Truck}
          />
          <ChargeInput
            label="Packing Charge"
            value={charges.packingCharge}
            onChange={(v) => onChange("packingCharge", v)}
            icon={Package}
          />
          <ChargeInput
            label="Handling Charge"
            value={charges.handlingCharge}
            onChange={(v) => onChange("handlingCharge", v)}
            icon={Wrench}
          />
          <ChargeInput
            label="Insurance Charge"
            value={charges.insuranceCharge}
            onChange={(v) => onChange("insuranceCharge", v)}
            icon={Shield}
          />
          <ChargeInput
            label="Other Charges"
            value={charges.otherCharges}
            onChange={(v) => onChange("otherCharges", v)}
            icon={Tags}
          />
        </div>
      </ChargeGroup>

      {/* Discounts & Advance */}
      <ChargeGroup title="Discounts & Advance" icon={CreditCard}>
        <div className="grid grid-cols-2 gap-4">
          <ChargeInput
            label="Discount"
            value={charges.discountPercentage}
            onChange={(v) => onChange("discountPercentage", v)}
            icon={Percent}
            suffix="%"
            step={0.5}
            hint="Applied on subtotal"
          />
          <ChargeInput
            label="Advance Paid"
            value={charges.advancePaid}
            onChange={(v) => onChange("advancePaid", v)}
            icon={CreditCard}
            hint="Amount already received"
          />
        </div>
      </ChargeGroup>
    </div>
  );
}

export default ChargesSection;
