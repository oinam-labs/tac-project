"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
    Plus,
    FileText,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    Clock,
    MoreHorizontal,
    Download,
    Eye,
    Send,
    XCircle
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { cn, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


import { PageShell } from "@/components/dashboard/page-shell";
import { DataTable } from "@/components/dashboard/data-table-premium";
import type { InvoiceListItem, InvoiceStatusKey } from "@/types/invoice-enterprise";

// --- Configuration ---

const statusConfig: Record<InvoiceStatusKey, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; className?: string; icon: React.ElementType }> = {
    draft: { label: "Draft", variant: "secondary", className: "bg-muted text-muted-foreground border-border", icon: FileText },
    pending: { label: "Pending", variant: "default", className: "bg-warning/10 text-warning border-warning/20", icon: Clock },
    paid: { label: "Paid", variant: "default", className: "bg-primary/20 text-primary border-primary/20", icon: CheckCircle2 },
    partial: { label: "Partial", variant: "default", className: "bg-primary/10 text-primary border-primary/20", icon: Clock },
    overdue: { label: "Overdue", variant: "destructive", className: "bg-destructive/10 text-destructive border-destructive/20", icon: AlertCircle },
    cancelled: { label: "Cancelled", variant: "secondary", className: "bg-muted text-muted-foreground border-border", icon: XCircle },
};

interface InvoicesClientProps {
    invoices: InvoiceListItem[];
}

export function InvoicesClient({ invoices }: InvoicesClientProps) {
    const router = useRouter();

    // -- Columns --

    const columns: ColumnDef<InvoiceListItem>[] = [
        {
            accessorKey: "invoiceNo",
            header: "Invoice",
            cell: ({ row }) => (
                <div
                    className="flex flex-col cursor-pointer group"
                    onClick={() => router.push(`/dashboard/invoices/${row.original.id}`)}
                >
                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {row.getValue("invoiceNo")}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {new Date(row.original.invoiceDate!).toLocaleDateString()}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.original.status;
                const config = statusConfig[status] || statusConfig.draft;
                const Icon = config.icon;

                return (
                    <Badge variant="outline" className={config.className}>
                        <Icon className="w-3 h-3 mr-1.5" />
                        {config.label}
                    </Badge>
                );
            },
        },
        {
            header: "Customer",
            cell: ({ row }) => (
                <div className="flex flex-col text-sm">
                    <span className="font-medium text-foreground">{row.original.customerName}</span>
                    <span className="text-xs text-muted-foreground">{row.original.consigneeCity || "—"}</span>
                </div>
            )
        },
        {
            accessorKey: "totalAmount",
            header: "Amount",
            cell: ({ row }) => (
                <span className="font-semibold text-foreground">
                    {formatCurrency(row.getValue("totalAmount"))}
                </span>
            )
        },
        {
            accessorKey: "balanceDue",
            header: "Balance",
            cell: ({ row }) => {
                const balance = row.getValue("balanceDue") as number;
                return (
                    <span className={cn(
                        "font-medium",
                        balance > 0 ? "text-destructive" : "text-primary"
                    )}>
                        {formatCurrency(balance)}
                    </span>
                );
            }
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <div className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => router.push(`/dashboard/invoices/${row.original.id}`)}>
                                <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/dashboard/invoices/${row.original.id}/edit`)}>
                                <FileText className="mr-2 h-4 w-4" /> Edit Invoice
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Send className="mr-2 h-4 w-4" /> Send Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" /> Download PDF
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        }
    ];

    // -- Stats --
    const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
    const pendingAmount = invoices
        .filter(inv => inv.status === 'pending' || inv.status === 'overdue')
        .reduce((sum, inv) => sum + (inv.balanceDue || 0), 0);
    const overdueCount = invoices.filter(inv => inv.status === 'overdue').length;

    // -- Render --

    return (
        <PageShell
            title="Invoices"
            description="Manage billing, track payments, and handle financial records."
            breadcrumb={["Dashboard", "Finance", "Invoices"]}
            action={
                <Button onClick={() => router.push("/dashboard/invoices/create")} className="rounded-full shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Invoice
                </Button>
            }
        >
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-card rounded-2xl p-6 border border-border shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-start z-10 relative">
                        <div>
                            <p className="text-muted-foreground text-sm font-medium mb-1">Total Revenue</p>
                            <h3 className="text-3xl font-bold text-foreground">
                                {formatCurrency(totalRevenue)}
                            </h3>
                            <div className="flex items-center mt-2 text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full w-fit">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                +12.5% this month
                            </div>
                        </div>
                        <div className="p-3 bg-muted rounded-xl text-muted-foreground">
                            <FileText className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-card rounded-2xl p-6 border border-border shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-start z-10 relative">
                        <div>
                            <p className="text-muted-foreground text-sm font-medium mb-1">Outstanding</p>
                            <h3 className="text-3xl font-bold text-foreground">
                                {formatCurrency(pendingAmount)}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-2">Pending collection</p>
                        </div>
                        <div className="p-3 bg-warning/10 rounded-xl text-warning">
                            <Clock className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-card rounded-2xl p-6 border border-border shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-start z-10 relative">
                        <div>
                            <p className="text-muted-foreground text-sm font-medium mb-1">Overdue Invoices</p>
                            <h3 className="text-3xl font-bold text-foreground">
                                {overdueCount}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-2">Requires attention</p>
                        </div>
                        <div className="p-3 bg-destructive/10 rounded-xl text-destructive">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={invoices}
                filterColumn="invoiceNo"
                filterPlaceholder="Search invoices..."
            />
        </PageShell>
    );
}
