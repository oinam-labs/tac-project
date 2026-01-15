import React from "react";
import { ShipmentData } from "@/types/invoice-v2";
import { calculateVolumetricWeight } from "@/lib/invoice/generator-v2";

interface LabelPrintProps {
    data: ShipmentData;
}

export function LabelPrint({ data }: LabelPrintProps) {
    const totalActual = data.items.reduce((acc, item) => acc + item.actualWeight, 0);
    const totalVolumetric = data.items.reduce((acc, item) => {
        return acc + calculateVolumetricWeight(item.length, item.width, item.height, data.volumetricFactor);
    }, 0);
    const billableWeight = Math.max(totalActual, totalVolumetric);

    return (
        <div className="print-area w-[100mm] bg-card border border-border p-6 text-foreground mx-auto font-sans overflow-hidden" style={{ width: '100mm', margin: '0 auto', pageBreakBefore: 'always' }}>
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-baseline">
                    <span className="text-2xl font-bold tracking-tight">TAC</span>
                    <span className="ml-0.5 w-1.5 h-1.5 rounded-full bg-warning"></span>
                </div>
                <div className="text-right">
                    <div className="text-xs font-medium bg-primary text-primary-foreground px-3 py-1 rounded-full">
                        {data.paymentMode}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center border-b border-border pb-6 mb-6">
                <div className="text-center">
                    {/* Placeholder Barcode */}
                    <div className="font-mono text-3xl font-bold mb-1">{data.awbNumber}</div>
                    <div className="text-xs font-medium text-muted-foreground">AWB: {data.awbNumber}</div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 border-b border-border pb-6">
                <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground/70">Deliver To</div>
                    <div className="text-sm font-bold text-foreground leading-tight">{data.consignee.name}</div>
                    <div className="text-xs leading-relaxed text-muted-foreground font-medium">
                        {data.consignee.city}, {data.consignee.state}<br />{data.consignee.zip}
                    </div>
                </div>
                <div className="flex flex-col justify-end items-end gap-3">
                    <div className="text-right">
                        <div className="text-xs font-medium text-muted-foreground/70 mb-1">Weight</div>
                        <div className="text-xl font-bold text-foreground">{billableWeight.toFixed(1)}<span className="text-xs ml-1">KG</span></div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <div className="text-left">
                    <div className="text-xs font-medium text-muted-foreground/70 mb-1">Station Code</div>
                    <div className="text-3xl font-bold text-foreground">{data.consignee.city.substring(0, 3).toUpperCase()}/{data.consignee.zip.slice(-2)}</div>
                </div>
            </div>

            <div className="text-[10px] mt-6 leading-tight font-medium text-muted-foreground/70 text-center">
                INTERNAL TRACKING LABEL
            </div>
        </div>
    );
}
