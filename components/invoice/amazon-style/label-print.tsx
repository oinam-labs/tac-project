import React, { useMemo } from "react";
import { ShipmentData, FinancialTotals } from "@/types/invoice-v2";
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
        <div className="print-area w-[100mm] bg-white border border-muted p-6 text-black mx-auto font-sans overflow-hidden" style={{ width: '100mm', margin: '0 auto', pageBreakBefore: 'always' }}>
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-baseline">
                    <span className="text-2xl font-black tracking-tighter">TAC</span>
                    <span className="ml-0.5 w-1.5 h-1.5 rounded-full bg-warning"></span>
                </div>
                <div className="text-right">
                    <div className="text-[10px] font-black bg-card text-white px-3 py-1 rounded-full uppercase tracking-tighter">
                        {data.paymentMode}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center border-b border-muted pb-6 mb-6">
                <div className="text-center">
                    {/* Placeholder Barcode */}
                    <div className="font-mono text-3xl font-black tracking-widest mb-1">{data.awbNumber}</div>
                    <div className="text-[11px] font-black tracking-[0.4em] text-muted-foreground">AWB: {data.awbNumber}</div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 border-b border-muted pb-6">
                <div className="space-y-2">
                    <div className="text-[9px] font-black uppercase text-muted tracking-widest">Deliver To</div>
                    <div className="text-sm font-black uppercase text-foreground leading-tight">{data.consignee.name}</div>
                    <div className="text-[10px] leading-relaxed text-muted-foreground font-medium uppercase">
                        {data.consignee.city}, {data.consignee.state}<br />{data.consignee.zip}
                    </div>
                </div>
                <div className="flex flex-col justify-end items-end gap-3">
                    <div className="text-right">
                        <div className="text-[9px] font-black uppercase text-muted tracking-widest mb-1">Weight</div>
                        <div className="text-xl font-black text-foreground">{billableWeight.toFixed(1)}<span className="text-xs ml-1">KG</span></div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <div className="text-left">
                    <div className="text-[9px] font-black uppercase text-muted tracking-widest mb-1">Station Code</div>
                    <div className="text-3xl font-black text-foreground tracking-tighter">{data.consignee.city.substring(0, 3).toUpperCase()}/{data.consignee.zip.slice(-2)}</div>
                </div>
            </div>

            <div className="text-[8px] mt-6 leading-tight uppercase font-black text-muted text-center tracking-widest">
                INTERNAL TRACKING LABEL
            </div>
        </div>
    );
}
