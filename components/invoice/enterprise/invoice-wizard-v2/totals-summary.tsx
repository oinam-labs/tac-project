"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Receipt, 
  Calculator,
  Wallet,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import type { ChargeSummary, WeightSummary } from "./types";

// =============================================================================
// TYPES
// =============================================================================

interface TotalsSummaryProps {
  weights: WeightSummary;
  charges: ChargeSummary;
  invoiceNo?: string;
  awbNo?: string;
  className?: string;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
}

// =============================================================================
// LINE ITEM COMPONENT
// =============================================================================

interface LineItemProps {
  label: string;
  value: string;
  variant?: "default" | "success" | "warning" | "muted";
  className?: string;
}

function LineItem({ label, value, variant = "default", className }: LineItemProps) {
  return (
    <div className={cn("flex items-center justify-between py-1.5", className)}>
      <span className="text-sm text-muted-foreground">{label}</span>
      <span
        className={cn(
          "text-sm font-medium",
          variant === "success" && "text-success",
          variant === "warning" && "text-warning",
          variant === "muted" && "text-muted-foreground"
        )}
      >
        {value}
      </span>
    </div>
  );
}

// =============================================================================
// WEIGHT SUMMARY CARD
// =============================================================================

interface WeightCardProps {
  weights: WeightSummary;
}

function WeightCard({ weights }: WeightCardProps) {
  return (
    <Card className="bg-gradient-to-br from-info/5 to-info/10 dark:from-info/10 dark:to-info/20 border-info/20 dark:border-info/30 shadow-sm">
      <CardContent className="p-6">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-[10px] font-semibold text-info mb-1">Pieces</p>
            <p className="text-xl font-bold text-info">{weights.totalPieces}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-info mb-1">Actual</p>
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-info leading-none">{weights.actualWeight.toFixed(2)}</span>
              <span className="text-[10px] text-info/70 mt-0.5">kg</span>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-info mb-1">Volumetric</p>
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-info leading-none">{weights.volumetricWeight.toFixed(2)}</span>
              <span className="text-[10px] text-info/70 mt-0.5">kg</span>
            </div>
          </div>
          <div className="bg-info/20 dark:bg-info/30 rounded-lg py-1.5 px-2 -my-1.5 flex flex-col justify-center">
            <p className="text-[10px] font-semibold text-info mb-0.5">Chargeable</p>
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-info leading-none">{weights.chargeableWeight.toFixed(2)}</span>
              <span className="text-[10px] text-info/70 mt-0.5">kg</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function TotalsSummary({
  weights,
  charges,
  invoiceNo,
  awbNo,
  className,
}: TotalsSummaryProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Invoice & AWB Numbers */}
      {(invoiceNo || awbNo) && (
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold text-primary mb-1">Invoice No.</p>
                <p className="text-lg font-bold font-mono text-primary">{invoiceNo || "---"}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-primary/30" />
              <div className="text-right">
                <p className="text-[10px] font-semibold text-primary mb-1">AWB No.</p>
                <p className="text-lg font-bold font-mono text-primary">{awbNo || "---"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weight Summary */}
      <WeightCard weights={weights} />

      {/* Invoice Summary */}
      <Card className="overflow-hidden border-border/60 shadow-sm">
        <CardHeader className="p-6 pb-4 bg-muted/30 border-b border-border/50">
          <CardTitle className="text-sm font-semibold flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-primary/10 text-primary">
              <Receipt className="w-4 h-4" />
            </div>
            Invoice Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-3">
          <LineItem label="Base Freight" value={formatCurrency(charges.baseFreight)} />
          <LineItem 
            label="Fuel Surcharge (15%)" 
            value={formatCurrency(charges.fuelSurcharge)} 
            variant="muted" 
          />
          <LineItem 
            label="Other Charges" 
            value={formatCurrency(charges.serviceCharges)} 
            variant="muted" 
          />
          
          {charges.discount > 0 && (
            <LineItem 
              label="Discount" 
              value={`-${formatCurrency(charges.discount)}`} 
              variant="success" 
            />
          )}

          <Separator className="my-1" />

          <LineItem label="Subtotal" value={formatCurrency(charges.subtotal)} className="font-medium" />

          <LineItem
            label={charges.isInterState ? "IGST (18%)" : "CGST + SGST (18%)"}
            value={formatCurrency(charges.totalTax)}
            variant="muted"
          />

          <Separator className="my-1" />

          {/* Grand Total */}
          <motion.div
            className="flex items-center justify-between py-3 px-4 bg-primary/5 rounded-xl border border-primary/10 -mx-2 mt-2"
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
          >
            <span className="font-semibold text-foreground flex items-center gap-2">
              <Calculator className="w-4 h-4 text-primary" />
              Grand Total
            </span>
            <span className="text-xl font-bold text-primary">
              {formatCurrency(charges.grandTotal)}
            </span>
          </motion.div>

          {/* Advance & Balance */}
          {charges.advancePaid > 0 && (
            <div className="pt-2 space-y-2">
              <LineItem 
                label="Advance Paid" 
                value={`-${formatCurrency(charges.advancePaid)}`} 
                variant="success" 
              />
              <motion.div
                className="flex items-center justify-between py-3 px-4 bg-warning/10 rounded-xl border border-warning/20 -mx-2"
                initial={{ scale: 0.98 }}
                animate={{ scale: 1 }}
              >
                <span className="font-semibold text-warning-foreground flex items-center gap-2">
                  <Wallet className="w-4 h-4" />
                  Balance Due
                </span>
                <span className="text-lg font-bold text-warning-foreground">
                  {formatCurrency(charges.balanceDue)}
                </span>
              </motion.div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tax Badge */}
      <div className="flex justify-center">
        <Badge variant="outline" className="text-[10px] text-muted-foreground bg-muted/20 border-border/50 px-3 py-1">
          {charges.isInterState ? "Inter-State Supply (IGST)" : "Intra-State Supply (CGST + SGST)"}
        </Badge>
      </div>
    </div>
  );
}

export default TotalsSummary;
