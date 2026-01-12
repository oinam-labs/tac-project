import React from "react";
import { ShipmentData, FinancialTotals } from "@/types/invoice-v2";

interface InvoicePrintProps {
    data: ShipmentData;
    totals: FinancialTotals;
}

export function InvoicePrint({ data, totals }: InvoicePrintProps) {
    const TERMS = [
        "Goods once accepted for carriage cannot be taken back.",
        "The consignee must declare the contents and value before booking.",
        "Any illegal/contraband items found will be the sole responsibility of the consignor.",
        "Liability for loss/damage is limited to ₹150 per kg unless insured.",
        "Fragile/Electronics items are carried at Owner's Risk unless specially insured.",
        "Consignments must be collected within 7 days of reaching destination.",
        "Godown charges of ₹55/day apply after 21 days from arrival.",
        "Unclaimed items will be disposed of after 100 days without further notice.",
        "All disputes are subject to Delhi Jurisdiction only."
    ];

    return (
        <div className="print-area bg-white p-12 mx-auto font-sans text-black" style={{ width: '210mm', minHeight: '297mm', margin: '0 auto' }}>
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div className="space-y-2">
                    <h2 className="text-xs font-black text-primary uppercase tracking-widest mb-4">Tax Invoice</h2>
                    <div className="flex items-baseline">
                        <span className="text-4xl font-black tracking-tighter">TAC</span>
                        <span className="ml-1 w-2.5 h-2.5 rounded-full bg-warning"></span>
                    </div>
                    <div className="text-[10px] font-medium text-muted-foreground mt-2">
                        <p className="font-bold">TAPAN ASSOCIATE CARGO SERVICE</p>
                        <p>GSTIN: 26ADCDE3836R1ZQ</p>
                        <p className="w-64 leading-relaxed">{data.consignor.line1}, {data.consignor.city}, {data.consignor.state} - {data.consignor.zip}</p>
                        <p>Mobile: {data.consignor.phone} | Email: {data.consignor.email || "N/A"}</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Original for Recipient</div>
                    <div className="font-mono text-xl text-muted">{data.invoiceId}</div>
                </div>
            </div>

            {/* Meta Row */}
            <div className="grid grid-cols-3 gap-8 border-y border-muted py-6 mb-8 text-[11px]">
                <div>
                    <span className="text-muted-foreground font-bold mr-2 uppercase">Invoice #:</span>
                    <span className="font-black text-foreground">{data.invoiceId}</span>
                </div>
                <div className="text-center">
                    <span className="text-muted-foreground font-bold mr-2 uppercase">Date:</span>
                    <span className="font-black text-foreground">{data.date}</span>
                </div>
                <div className="text-right">
                    <span className="text-muted-foreground font-bold mr-2 uppercase">Place of Supply:</span>
                    <span className="font-black text-foreground">{data.consignee.state.toUpperCase()}</span>
                </div>
            </div>

            {/* Address Blocks */}
            <div className="grid grid-cols-2 gap-12 mb-10">
                <div>
                    <h4 className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-3 border-b border-muted pb-2">Billing Details</h4>
                    <p className="font-black text-sm mb-1">{data.consignor.name}</p>
                    <p className="text-[11px] leading-relaxed text-muted-foreground uppercase">{data.consignor.line1}, {data.consignor.city}, {data.consignor.state} - {data.consignor.zip}</p>
                </div>
                <div>
                    <h4 className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-3 border-b border-muted pb-2">Shipping Details</h4>
                    <p className="font-black text-sm mb-1">{data.consignee.name}</p>
                    <p className="text-[11px] leading-relaxed text-muted-foreground uppercase">{data.consignee.line1}, {data.consignee.city}, {data.consignee.state} - {data.consignee.zip}</p>
                    <p className="text-[11px] font-bold mt-2">Ph: {data.consignee.phone}</p>
                </div>
            </div>

            {/* Item Table */}
            <table className="w-full mb-8 table-fixed">
                <thead>
                    <tr className="text-[10px] font-black text-muted-foreground uppercase border-b-2 border-foreground">
                        <th className="py-4 text-left w-12">#</th>
                        <th className="py-4 text-left w-[40%]">Description of Service</th>
                        <th className="py-4 text-right">Rate</th>
                        <th className="py-4 text-center">Qty</th>
                        <th className="py-4 text-right">Taxable</th>
                        <th className="py-4 text-right">Tax</th>
                        <th className="py-4 text-right">Total</th>
                    </tr>
                </thead>
                <tbody className="text-[11px] divide-y divide-muted">
                    <tr className="align-top">
                        <td className="py-6 font-bold text-muted-foreground">1</td>
                        <td className="py-6 pr-8">
                            <p className="font-black text-foreground uppercase mb-1">Express Cargo Service</p>
                            <p className="text-[9px] text-muted-foreground font-bold mb-2">Category: {data.natureOfQuantity} | Declared: {data.declaredValue}</p>
                            <div className="flex flex-wrap gap-2 text-[8px] text-muted-foreground font-bold uppercase">
                                <span className="bg-muted px-1.5 py-0.5 rounded">AWB: {data.awbNumber}</span>
                                <span className="bg-muted px-1.5 py-0.5 rounded">Wt: {totals.billable.toFixed(2)} Kg</span>
                                {data.items.slice(0, 5).map((item, i) => (
                                    <span key={i} className="bg-muted px-1.5 py-0.5 rounded">{item.description}</span>
                                ))}
                                {data.items.length > 5 && <span className="bg-muted px-1.5 py-0.5 rounded">+{data.items.length - 5} more</span>}
                            </div>
                        </td>
                        <td className="py-6 text-right font-bold text-muted-foreground">{data.ratePerKg.toFixed(2)}</td>
                        <td className="py-6 text-center font-bold text-muted-foreground">{totals.billable.toFixed(2)}</td>
                        <td className="py-6 text-right font-bold">₹{totals.freight.toFixed(2)}</td>
                        <td className="py-6 text-right font-bold text-muted-foreground">₹{(totals.freight * data.gstRate / 100).toFixed(2)}</td>
                        <td className="py-6 text-right font-black">₹{(totals.freight * (1 + data.gstRate / 100)).toFixed(2)}</td>
                    </tr>

                    {/* Surcharge Row */}
                    <tr className="align-top border-t-0">
                        <td className="py-4 font-bold text-muted-foreground">2</td>
                        <td className="py-4">
                            <p className="font-black text-foreground uppercase">Ancillary Charges</p>
                            <p className="text-[9px] text-muted-foreground font-bold">Pickup, Packing, Docket & Insurance</p>
                        </td>
                        <td className="py-4 text-right font-bold text-muted-foreground">--</td>
                        <td className="py-4 text-center font-bold text-muted-foreground">1.00</td>
                        <td className="py-4 text-right font-bold">₹{(data.pickupCharge + data.packingCharge + data.docketCharges + data.insuranceCharge).toFixed(2)}</td>
                        <td className="py-4 text-right font-bold text-muted-foreground">₹{((data.pickupCharge + data.packingCharge + data.docketCharges + data.insuranceCharge) * data.gstRate / 100).toFixed(2)}</td>
                        <td className="py-4 text-right font-black">₹{((data.pickupCharge + data.packingCharge + data.docketCharges + data.insuranceCharge) * (1 + data.gstRate / 100)).toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>

            {/* Summary Section */}
            <div className="flex justify-end mb-12">
                <div className="w-80 space-y-3">
                    <div className="flex justify-between text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                        <span>Taxable Amount</span>
                        <span className="text-foreground">₹{totals.taxableAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                        <span>IGST {data.gstRate}%</span>
                        <span className="text-foreground">₹{totals.taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center border-t-2 border-foreground pt-3">
                        <span className="text-sm font-black uppercase">Total</span>
                        <span className="text-2xl font-black">₹{totals.grandTotal.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-success-foreground uppercase mt-4">
                        <span>Advance Paid</span>
                        <span>- ₹{data.advancePaid.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center bg-card text-white p-4 rounded-xl mt-2">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Payable</span>
                        <span className="text-xl font-black">₹{totals.balance.toFixed(0)}</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="grid grid-cols-2 gap-12 pt-8 border-t border-muted">
                <div className="space-y-6">
                    <div>
                        <h5 className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-3">Bank Details</h5>
                        <div className="text-[10px] font-bold space-y-1">
                            <p className="text-muted-foreground">Bank: <span className="text-foreground">AXIS BANK LTD</span></p>
                            <p className="text-muted-foreground">A/c #: <span className="text-foreground">921020038475921</span></p>
                            <p className="text-muted-foreground">IFSC: <span className="text-foreground">UTIB0001293</span></p>
                            <p className="text-muted-foreground">Branch: <span className="text-foreground">South Extension</span></p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <h5 className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Terms & Conditions</h5>
                        <ol className="text-[8px] leading-relaxed text-muted-foreground space-y-1">
                            {TERMS.slice(0, 5).map((t, i) => <li key={i}>{i + 1}. {t}</li>)}
                        </ol>
                    </div>
                </div>
                <div className="flex flex-col items-end justify-between py-2">
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase mb-4">For TAPAN ASSOCIATE CARGO SERVICE</p>
                        {/* Placeholder Seal */}
                        <div className="w-24 h-24 mb-2 ml-auto opacity-10 border-2 border-foreground rounded-full flex items-center justify-center">
                            <span className="text-[9px] font-black rotate-[-15deg]">DG. SIGNED</span>
                        </div>
                        <div className="w-48 h-[1px] bg-muted mb-2"></div>
                        <p className="text-[10px] font-black uppercase tracking-widest">Authorized Signatory</p>
                    </div>
                    <div className="text-[8px] font-bold text-muted italic">Page 1/1 • Digitally Signed</div>
                </div>
            </div>
        </div>
    );
}
