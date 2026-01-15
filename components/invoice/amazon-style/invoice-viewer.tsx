"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Printer, ShieldCheck, Download, FileText, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { InvoicePrint } from "./invoice-print";
import { LabelPrint } from "./label-print";
import { InvoiceCompliance } from "./invoice-compliance";
import { mapDatabaseInvoiceToV2 } from "@/lib/invoice/mapper";
import { calculateLedger } from "@/lib/invoice/generator-v2";
import { SmartExchangeRate } from "../smart-exchange-rate";

interface InvoiceViewerProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Database invoice object with dynamic structure
    invoice: any;
}

export function InvoiceViewer({ invoice }: InvoiceViewerProps) {
    const router = useRouter();
    const data = mapDatabaseInvoiceToV2(invoice);

    // Calculate ledger with new tax breakdown support
    const totals = calculateLedger(data);

    // Override totals with DB values if they exist, but keep the detailed breakdown structure
    const safeTotals = {
        ...totals,
        grandTotal: invoice.total_amount || totals.grandTotal,
        taxAmount: invoice.total_tax || totals.taxAmount
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-6">
            <style jsx global>{`
                @media print {
                    @page { margin: 0; size: auto; }
                    body { background: white; }
                    .no-print { display: none !important; }
                    .print-area { display: block !important; }
                }
            `}</style>

            {/* Header - No Print */}
            <div className="no-print flex flex-col gap-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => router.push("/dashboard/invoices")}
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-xl font-bold tracking-tight text-foreground">
                                    Invoice #{data.invoiceId}
                                </h1>
                                <Badge variant={invoice.status === 'paid' ? 'secondary' : 'outline'} className="capitalize">
                                    {invoice.status || 'Paid'}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Generated on {data.date} • {data.consignee.name}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <SmartExchangeRate />
                        <div className="h-6 w-px bg-border mx-2 hidden md:block"></div>
                        <Button variant="outline" size="sm" className="h-8 gap-2" onClick={() => window.open(invoice.pdf_url, '_blank')} disabled={!invoice.pdf_url}>
                            <Download className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">PDF</span>
                        </Button>
                        <Button onClick={handlePrint} size="sm" className="h-8 gap-2">
                            <Printer className="w-3.5 h-3.5" />
                            <span>Print</span>
                        </Button>
                    </div>
                </div>

                {/* Content Tabs */}
                <Tabs defaultValue="invoice" className="w-full">
                    <div className="flex justify-center mb-6">
                        <TabsList>
                            <TabsTrigger value="invoice" className="gap-2">
                                <FileText className="w-4 h-4" />
                                Tax Invoice
                            </TabsTrigger>
                            <TabsTrigger value="label" className="gap-2">
                                <Tag className="w-4 h-4" />
                                AWB Label
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="invoice" className="flex flex-col items-center space-y-6">
                        <Card className="w-full max-w-[210mm] overflow-hidden">
                            <CardContent className="p-0">
                                {/* Invoice Content */}
                                <InvoicePrint
                                    data={data}
                                    totals={safeTotals}
                                />

                                {/* On-screen only compliance footer */}
                                <div className="p-8 bg-muted/30 border-t border-border no-print">
                                    <InvoiceCompliance />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="label" className="flex justify-center pb-20">
                        <Card className="overflow-hidden">
                            <CardContent className="p-0">
                                <LabelPrint
                                    data={data}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Security Badge */}
                <div className="flex justify-center mt-8 mb-4">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border">
                        <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                        <span>Secured by TAC Logistics • ISO 9001:2015 Certified</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
