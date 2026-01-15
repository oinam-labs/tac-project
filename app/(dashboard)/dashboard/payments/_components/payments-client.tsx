"use client";

import React, { useState, useTransition } from "react";
import {
    Calendar,
    Wallet,
    AlertCircle
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { cn, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { recordPayment } from "@/app/actions/payments";

import { PageShell } from "@/components/dashboard/page-shell";
import { DataTable } from "@/components/dashboard/data-table-premium";
import type { PaymentStatus } from "@/types/database";

// --- Types ---

interface Payment {
    id: string;
    amount: number;
    payment_method: string;
    payment_reference: string | null;
    status: PaymentStatus;
    notes: string | null;
    created_at: string;
    invoices: { invoice_no: string; total_amount: number; customers: { name: string } | null } | null;
}

interface OutstandingInvoice {
    id: string;
    invoice_no: string;
    total_amount: number;
    balance_due: number;
    due_date: string | null;
    status: string;
    customers: { name: string; phone: string } | null;
}

interface PaymentStats {
    totalReceived: number;
    totalOutstanding: number;
    overdueCount: number;
}

interface PaymentsClientProps {
    initialPayments: Payment[];
    outstandingInvoices: OutstandingInvoice[];
    stats: PaymentStats;
}

// --- Configuration ---

const paymentMethodLabels: Record<string, string> = {
    cash: "Cash",
    upi: "UPI",
    bank_transfer: "Bank Transfer",
    card: "Card",
    cheque: "Cheque",
};

export function PaymentsClient({
    initialPayments,
    outstandingInvoices,
    stats
}: PaymentsClientProps) {
    const [payments, setPayments] = useState(initialPayments);
    const [outstanding, setOutstanding] = useState(outstandingInvoices);
    const [selectedInvoice, setSelectedInvoice] = useState<OutstandingInvoice | null>(null);
    const [isRecordOpen, setIsRecordOpen] = useState(false);

    // --- Columns: Outstanding Invoices ---
    const outstandingColumns: ColumnDef<OutstandingInvoice>[] = [
        {
            accessorKey: "invoice_no",
            header: "Invoice",
            cell: ({ row }) => <span className="font-semibold text-foreground">{row.getValue("invoice_no")}</span>,
        },
        {
            header: "Customer",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-medium text-foreground">{row.original.customers?.name || "—"}</span>
                    <span className="text-xs text-muted-foreground">{row.original.customers?.phone}</span>
                </div>
            )
        },
        {
            accessorKey: "due_date",
            header: "Due Date",
            cell: ({ row }) => {
                const date = row.getValue("due_date") as string;
                if (!date) return <span className="text-muted-foreground">—</span>;
                const isOverdue = new Date(date) < new Date();
                return (
                    <div className={cn("flex items-center gap-2", isOverdue ? "text-destructive" : "text-muted-foreground")}>
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(date).toLocaleDateString()}</span>
                    </div>
                )
            }
        },
        {
            accessorKey: "balance_due",
            header: "Balance Due",
            cell: ({ row }) => (
                <span className="font-bold text-foreground">
                    {formatCurrency(row.getValue("balance_due"))}
                </span>
            )
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <div className="text-right">
                    <Button
                        size="sm"
                        onClick={() => {
                            setSelectedInvoice(row.original);
                            setIsRecordOpen(true);
                        }}
                        className="h-8 shadow-sm"
                    >
                        Record Payment
                    </Button>
                </div>
            ),
        }
    ];

    // --- Columns: Payment History ---
    const historyColumns: ColumnDef<Payment>[] = [
        {
            accessorKey: "created_at",
            header: "Date",
            cell: ({ row }) => <span className="text-muted-foreground">{new Date(row.getValue("created_at")).toLocaleDateString()}</span>,
        },
        {
            header: "Invoice",
            cell: ({ row }) => <span className="font-mono text-xs">{row.original.invoices?.invoice_no}</span>,
        },
        {
            header: "Customer",
            cell: ({ row }) => <span className="text-sm font-medium text-foreground">{row.original.invoices?.customers?.name}</span>,
        },
        {
            accessorKey: "amount",
            header: "Amount",
            cell: ({ row }) => (
                <span className="font-bold text-primary">
                    +{formatCurrency(row.getValue("amount"))}
                </span>
            )
        },
        {
            accessorKey: "payment_method",
            header: "Method",
            cell: ({ row }) => (
                <Badge variant="secondary" className="font-normal capitalize">
                    {paymentMethodLabels[row.getValue("payment_method") as string] || row.getValue("payment_method")}
                </Badge>
            )
        },
        {
            accessorKey: "payment_reference",
            header: "Reference",
            cell: ({ row }) => {
                const ref = row.getValue("payment_reference") as string;
                return ref ? <span className="font-mono text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{ref}</span> : <span className="text-muted-foreground">—</span>;
            }
        },
    ];


    return (
        <PageShell
            title="Payments"
            description="Track incoming payments and manage outstanding balances."
            breadcrumb={["Dashboard", "Finance", "Payments"]}
            action={
                <div className="hidden"></div> // Action is handled via table rows for now
            }
        >
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-card rounded-2xl p-6 border border-border shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-start z-10 relative">
                        <div>
                            <p className="text-muted-foreground text-sm font-medium mb-1">Total Received</p>
                            <h3 className="text-3xl font-bold text-primary">
                                {formatCurrency(stats.totalReceived)}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-2">Life-time collections</p>
                        </div>
                        <div className="p-3 bg-primary/10 rounded-xl text-primary">
                            <Wallet className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-card rounded-2xl p-6 border border-border shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-start z-10 relative">
                        <div>
                            <p className="text-muted-foreground text-sm font-medium mb-1">Outstanding</p>
                            <h3 className="text-3xl font-bold text-warning">
                                {formatCurrency(stats.totalOutstanding)}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-2">Pending to be collected</p>
                        </div>
                        <div className="p-3 bg-warning/10 rounded-xl text-warning">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-card rounded-2xl p-6 border border-border shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-start z-10 relative">
                        <div>
                            <p className="text-muted-foreground text-sm font-medium mb-1">Overdue Count</p>
                            <h3 className="text-3xl font-bold text-destructive">
                                {stats.overdueCount}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-2">Invoices past due date</p>
                        </div>
                        <div className="p-3 bg-destructive/10 rounded-xl text-destructive">
                            <Calendar className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="outstanding" className="space-y-4">
                <TabsList className="bg-muted/50 p-1 rounded-xl">
                    <TabsTrigger value="outstanding" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">Outstanding Invoices</TabsTrigger>
                    <TabsTrigger value="history" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">Payment History</TabsTrigger>
                </TabsList>

                <TabsContent value="outstanding" className="space-y-4">
                    <DataTable
                        columns={outstandingColumns}
                        data={outstanding}
                        filterColumn="invoice_no"
                        filterPlaceholder="Search outstanding..."
                    />
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                    <DataTable
                        columns={historyColumns}
                        data={payments}
                        filterColumn="invoices.invoice_no" // Note: This might need flatter structure or custom filter fn for nested props, but for now strict key
                        filterPlaceholder="Search payments..."
                    />
                </TabsContent>
            </Tabs>

            {/* Record Payment Dialog */}
            <Dialog open={isRecordOpen} onOpenChange={setIsRecordOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Record Payment</DialogTitle>
                    </DialogHeader>
                    {selectedInvoice && (
                        <RecordPaymentForm
                            invoice={selectedInvoice}
                            onSuccess={(payment) => {
                                setPayments(prev => [payment as Payment, ...prev]);
                                setOutstanding(prev =>
                                    prev.map(i =>
                                        i.id === selectedInvoice.id
                                            ? { ...i, balance_due: i.balance_due - (payment as Payment).amount }
                                            : i
                                    ).filter(i => i.balance_due > 0)
                                );
                                setIsRecordOpen(false);
                                toast.success("Payment recorded");
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </PageShell>
    );
}

function RecordPaymentForm({
    invoice,
    onSuccess
}: {
    invoice: OutstandingInvoice;
    onSuccess: (payment: Payment) => void;
}) {
    const [isPending, startTransition] = useTransition();
    const [formData, setFormData] = useState({
        amount: invoice.balance_due,
        paymentMethod: "cash" as "cash" | "upi" | "bank_transfer" | "card" | "cheque",
        paymentReference: "",
        notes: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        startTransition(async () => {
            const result = await recordPayment({
                invoiceId: invoice.id,
                amount: formData.amount,
                paymentMethod: formData.paymentMethod,
                paymentReference: formData.paymentReference || undefined,
                notes: formData.notes || undefined,
            });
            if (result.success) {
                // Construct the full payment object with invoice details for the local state
                const newPayment = {
                    ...result.data,
                    invoices: {
                        invoice_no: invoice.invoice_no,
                        total_amount: invoice.total_amount,
                        customers: invoice.customers
                    }
                };
                onSuccess(newPayment as unknown as Payment);
            } else {
                toast.error(result.error);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Invoice</span>
                    <span className="text-foreground font-mono font-medium">{invoice.invoice_no}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Customer</span>
                    <span className="text-foreground font-medium">{invoice.customers?.name}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-border">
                    <span className="text-muted-foreground">Balance Due</span>
                    <span className="text-warning font-mono font-bold">{formatCurrency(invoice.balance_due)}</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Amount</Label>
                    <Input
                        type="number"
                        min={1}
                        max={invoice.balance_due}
                        value={formData.amount}
                        onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <select
                        value={formData.paymentMethod}
                        onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value as typeof formData.paymentMethod }))}
                        className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        <option value="cash">Cash</option>
                        <option value="upi">UPI</option>
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="card">Card</option>
                        <option value="cheque">Cheque</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <Label>Reference / Transaction ID</Label>
                <Input
                    value={formData.paymentReference}
                    onChange={(e) => setFormData(prev => ({ ...prev, paymentReference: e.target.value }))}
                    placeholder="Optional"
                />
            </div>

            <div className="space-y-2">
                <Label>Notes</Label>
                <Input
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Optional"
                />
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isPending} className="w-full">
                    {isPending ? "Recording Payment..." : "Confirm Payment"}
                </Button>
            </div>
        </form>
    );
}
