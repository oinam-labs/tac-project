"use client";

import React from "react";
import { ShipmentData, FinancialTotals } from "@/types/invoice-v2";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface PricingWidgetProps {
    data: ShipmentData;
    totals: FinancialTotals;
    onUpdate: (field: keyof ShipmentData, value: number) => void;
}

export function PricingWidget({ data, totals, onUpdate }: PricingWidgetProps) {
    return (
        <Card className="border-border shadow-sm h-full">
            <CardContent className="p-6 space-y-6">
                <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-4">Pricing Configuration</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-muted-foreground">Rate / Kg</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-xs font-bold text-muted-foreground">₹</span>
                                <Input
                                    type="number"
                                    value={data.ratePerKg}
                                    onChange={(e) => onUpdate("ratePerKg", Number(e.target.value))}
                                    className="pl-7 font-bold text-primary border-border focus-visible:ring-primary/20"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-muted-foreground">GST Rate %</Label>
                            <Input
                                type="number"
                                value={data.gstRate}
                                onChange={(e) => onUpdate("gstRate", Number(e.target.value))}
                                className="font-bold border-border focus-visible:ring-primary/20"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-muted-foreground/70">Ancillary Charges</h4>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Pickup</Label>
                            <Input
                                type="number"
                                value={data.pickupCharge}
                                onChange={(e) => onUpdate("pickupCharge", Number(e.target.value))}
                                className="h-8 text-xs font-bold border-border"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Packing</Label>
                            <Input
                                type="number"
                                value={data.packingCharge}
                                onChange={(e) => onUpdate("packingCharge", Number(e.target.value))}
                                className="h-8 text-xs font-bold border-border"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Docket</Label>
                            <Input
                                type="number"
                                value={data.docketCharges}
                                onChange={(e) => onUpdate("docketCharges", Number(e.target.value))}
                                className="h-8 text-xs font-bold border-border"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Insurance</Label>
                            <Input
                                type="number"
                                value={data.insuranceCharge}
                                onChange={(e) => onUpdate("insuranceCharge", Number(e.target.value))}
                                className="h-8 text-xs font-bold border-border"
                            />
                        </div>
                    </div>
                </div>

                <Separator className="bg-border" />

                <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-medium text-muted-foreground">
                        <span>Subtotal</span>
                        <span className="text-foreground">₹{totals.taxableAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-medium text-muted-foreground">
                        <span>GST ({data.gstRate}%)</span>
                        <span className="text-foreground">₹{totals.taxAmount.toFixed(2)}</span>
                    </div>
                </div>

                <div className="bg-muted p-4 rounded-xl space-y-3 border border-border">
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-success">Advance Paid</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-xs font-bold text-success">₹</span>
                            <Input
                                type="number"
                                value={data.advancePaid}
                                onChange={(e) => onUpdate("advancePaid", Number(e.target.value))}
                                className="pl-7 font-bold text-success bg-card border-success/20 focus-visible:ring-success/20"
                            />
                        </div>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                        <span className="text-xs font-medium text-muted-foreground">Balance Due</span>
                        <span className="text-xl font-bold text-foreground">₹{totals.balance.toFixed(0)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
