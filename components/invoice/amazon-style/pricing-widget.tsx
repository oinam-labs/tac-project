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
        <Card className="border-muted shadow-sm h-full">
            <CardContent className="p-6 space-y-6">
                <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Pricing Configuration</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Rate / Kg</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-xs font-bold text-muted-foreground">₹</span>
                                <Input
                                    type="number"
                                    value={data.ratePerKg}
                                    onChange={(e) => onUpdate("ratePerKg", Number(e.target.value))}
                                    className="pl-7 font-black text-primary border-muted focus-visible:ring-primary/20"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">GST Rate %</Label>
                            <Input
                                type="number"
                                value={data.gstRate}
                                onChange={(e) => onUpdate("gstRate", Number(e.target.value))}
                                className="font-bold border-muted focus-visible:ring-primary/20"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <h4 className="text-[9px] font-black uppercase tracking-widest text-muted">Ancillary Charges</h4>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <Label className="text-[9px] uppercase font-bold text-muted-foreground">Pickup</Label>
                            <Input
                                type="number"
                                value={data.pickupCharge}
                                onChange={(e) => onUpdate("pickupCharge", Number(e.target.value))}
                                className="h-8 text-xs font-bold border-muted"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[9px] uppercase font-bold text-muted-foreground">Packing</Label>
                            <Input
                                type="number"
                                value={data.packingCharge}
                                onChange={(e) => onUpdate("packingCharge", Number(e.target.value))}
                                className="h-8 text-xs font-bold border-muted"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[9px] uppercase font-bold text-muted-foreground">Docket</Label>
                            <Input
                                type="number"
                                value={data.docketCharges}
                                onChange={(e) => onUpdate("docketCharges", Number(e.target.value))}
                                className="h-8 text-xs font-bold border-muted"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[9px] uppercase font-bold text-muted-foreground">Insurance</Label>
                            <Input
                                type="number"
                                value={data.insuranceCharge}
                                onChange={(e) => onUpdate("insuranceCharge", Number(e.target.value))}
                                className="h-8 text-xs font-bold border-muted"
                            />
                        </div>
                    </div>
                </div>

                <Separator className="bg-muted" />

                <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        <span>Subtotal</span>
                        <span className="text-foreground">₹{totals.taxableAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        <span>GST ({data.gstRate}%)</span>
                        <span className="text-foreground">₹{totals.taxAmount.toFixed(2)}</span>
                    </div>
                </div>

                <div className="bg-muted p-4 rounded-xl space-y-3 border border-muted">
                    <div className="space-y-1.5">
                        <Label className="text-[9px] uppercase font-bold text-success-foreground">Advance Paid</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-xs font-bold text-success-foreground">₹</span>
                            <Input
                                type="number"
                                value={data.advancePaid}
                                onChange={(e) => onUpdate("advancePaid", Number(e.target.value))}
                                className="pl-7 font-black text-success-foreground bg-white border-success focus-visible:ring-success/20"
                            />
                        </div>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Balance Due</span>
                        <span className="text-xl font-black text-foreground">₹{totals.balance.toFixed(0)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
