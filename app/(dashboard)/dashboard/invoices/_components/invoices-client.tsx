"use client";

import React, { useState, useTransition, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Plus,
    AlertCircle,
    Search,
    Eye,
    Download,
    MessageCircle,
    RefreshCw,
    Receipt,
    TrendingUp,
    Hourglass,
    Tag,
    CheckCircle2,
    Truck
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
// Sheet imports removed as they are currently unused
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
    generateLabelInvoice,
    regenerateInvoice
} from "@/app/actions/invoices";
import { sendInvoiceViaWhatsApp, getWhatsAppLink } from "@/app/actions/whatsapp";
import { IllustratedEmptyState } from "@/components/dashboard/illustrated-empty-state";
// import { InvoiceCreationForm } from "@/components/invoice"; // Removed legacy form import
import type { InvoiceType, InvoiceStatus } from "@/types/database";

interface Invoice {
    id: string;
    invoice_no: string;
    type: InvoiceType;
    status: InvoiceStatus;
    awb_no: string | null;
    consignee_name: string | null;
    consignee_address: string | null;
    consignee_city: string | null;
    consignee_state: string | null;
    consignee_pincode: string | null;
    subtotal: number;
    total_tax: number;
    total_amount: number;
    balance_due: number;
    invoice_date: string;
    due_date: string | null;
    pdf_url: string | null;
    sent_via_whatsapp_at: string | null;
    created_at: string;
    customers: { id: string; name: string; phone: string; email: string | null } | null;
    shipments: { id: string; reference: string; pieces: number | null } | null;
}

interface ShipmentWithoutInvoice {
    id: string;
    reference: string;
    consignee_name: string | null;
    pieces: number | null;
    customers: { name: string; phone: string } | null;
}

interface InvoicesClientProps {
    initialInvoices: Invoice[];
    shipmentsWithoutInvoice: ShipmentWithoutInvoice[];
}

const statusConfig: Record<InvoiceStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; bgColor: string; dotColor: string }> = {
    draft: { label: "Draft Protocol", variant: "outline", bgColor: "bg-muted/10 text-muted-foreground border-muted", dotColor: "bg-muted-foreground" },
    pending: { label: "Awaiting Settlement", variant: "secondary", bgColor: "bg-warning/10 text-warning border-warning", dotColor: "bg-warning" },
    paid: { label: "Settlement Confirmed", variant: "default", bgColor: "bg-primary/10 text-primary border-primary", dotColor: "bg-primary" },
    partial: { label: "Partial Settlement", variant: "secondary", bgColor: "bg-primary/10 text-primary border-primary", dotColor: "bg-primary" },
    overdue: { label: "Overdue Alert", variant: "destructive", bgColor: "bg-destructive/10 text-destructive border-destructive", dotColor: "bg-destructive" },
    cancelled: { label: "Protocol Aborted", variant: "outline", bgColor: "bg-muted/10 text-muted-foreground border-muted", dotColor: "bg-muted" },
};

export function InvoicesClient({
    initialInvoices,
    shipmentsWithoutInvoice: initialShipments
}: Readonly<InvoicesClientProps>) {
    const router = useRouter();
    const [isHydrated, setIsHydrated] = useState(false);
    const [invoices, setInvoices] = useState(initialInvoices);
    const [shipments] = useState(initialShipments);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [isPending, startTransition] = useTransition();
    // const [isCreateOpen, setIsCreateOpen] = useState(false); // Removed legacy modal state
    // const [isViewOpen, setIsViewOpen] = useState(false); // Removed legacy view modal
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Prevent hydration mismatch by only rendering Radix components after mount
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsHydrated(true);
    }, []);

    // Stats calculations
    const stats = useMemo(() => ({
        total: invoices.length,
        pending: invoices.filter(i => i.status === "pending").length,
        paid: invoices.filter(i => i.status === "paid").length,
        overdue: invoices.filter(i => i.status === "overdue").length,
    }), [invoices]);

    // Filtered invoices based on search
    const filteredInvoices = useMemo(() => {
        if (!searchQuery.trim()) return invoices;
        const query = searchQuery.toLowerCase();
        return invoices.filter((invoice) => {
            return (
                invoice.invoice_no.toLowerCase().includes(query) ||
                invoice.consignee_name?.toLowerCase().includes(query) ||
                invoice.consignee_city?.toLowerCase().includes(query) ||
                invoice.consignee_state?.toLowerCase().includes(query) ||
                invoice.customers?.name?.toLowerCase().includes(query) ||
                invoice.type.toLowerCase().includes(query) ||
                invoice.awb_no?.toLowerCase().includes(query)
            );
        });
    }, [invoices, searchQuery]);

    const handleGenerateLabel = async (shipmentId: string) => {
        startTransition(async () => {
            const result = await generateLabelInvoice({ shipmentId });
            if (result.success) {
                setInvoices(prev => [{
                    ...result.data,
                    customers: null,
                    shipments: null,
                } as Invoice, ...prev]);
                toast.success("Label generated");
            } else {
                toast.error(result.error);
            }
        });
    };

    const handleSendWhatsApp = async (invoiceId: string) => {
        startTransition(async () => {
            const linkResult = await getWhatsAppLink(invoiceId);
            if (linkResult.success) {
                window.open(linkResult.data.url, "_blank");

                const sendResult = await sendInvoiceViaWhatsApp(invoiceId);
                if (sendResult.success) {
                    setInvoices(prev =>
                        prev.map(i => i.id === invoiceId ? { ...i, sent_via_whatsapp_at: new Date().toISOString() } : i)
                    );
                    toast.success("Invoice sent via WhatsApp");
                }
            } else {
                toast.error(linkResult.error);
            }
        });
    };

    const handleRegenerate = async (invoiceId: string) => {
        startTransition(async () => {
            const result = await regenerateInvoice(invoiceId);
            if (result.success) {
                toast.success("Invoice queued for regeneration");
            } else {
                toast.error(result.error);
            }
        });
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(new Set(filteredInvoices.map(i => i.id)));
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleSelectOne = (id: string, checked: boolean) => {
        const newSet = new Set(selectedIds);
        if (checked) {
            newSet.add(id);
        } else {
            newSet.delete(id);
        }
        setSelectedIds(newSet);
    };

    const handleViewInvoice = (invoice: Invoice) => {
        router.push(`/dashboard/invoices/${invoice.id}`);
    };

    return (
        <div className="space-y-6 p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    icon={Receipt}
                    iconBg="bg-primary/10"
                    iconColor="text-primary"
                    label="Total Invoices"
                    value={stats.total.toString()}
                    subValue="All time"
                />
                <StatsCard
                    icon={TrendingUp}
                    iconBg="bg-primary/10"
                    iconColor="text-primary"
                    label="Paid Invoices"
                    value={stats.paid.toString()}
                    subValue={`${Math.round((stats.paid / (stats.total || 1)) * 100)}% completion`}
                />
                <StatsCard
                    icon={Hourglass}
                    iconBg="bg-warning/10"
                    iconColor="text-warning"
                    label="Pending Invoices"
                    value={stats.pending.toString()}
                    subValue="Awaiting payment"
                />
                <StatsCard
                    icon={AlertCircle}
                    iconBg="bg-destructive/10"
                    iconColor="text-destructive"
                    label="Overdue Invoices"
                    value={stats.overdue.toString()}
                    subValue="Action required"
                />
            </div>

            {/* Controls Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="relative w-full sm:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search Central Ledger (Invoice, Customer, City)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-11 h-12 rounded-2xl bg-white border-2 border-muted focus:border-primary/20 focus:bg-muted/10 transition-all font-bold"
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    {/* Quick Label from existing shipment - only render after hydration */}
                    {isHydrated && shipments.length > 0 && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="gap-2 w-full sm:w-auto">
                                    <Tag className="w-4 h-4" />
                                    Quick Label
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Generate Label for Shipment</DialogTitle>
                                    <DialogDescription>Select a shipment below to generate a shipping label.</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-2 max-h-96 overflow-y-auto mt-2">
                                    {shipments.map((s) => (
                                        <div
                                            key={s.id}
                                            className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 transition-colors"
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-foreground">{s.reference}</span>
                                                <span className="text-xs text-muted-foreground">{s.consignee_name} • {s.pieces} pcs</span>
                                            </div>
                                            <Button
                                                size="sm"
                                                onClick={() => handleGenerateLabel(s.id)}
                                                disabled={isPending}
                                            >
                                                Generate
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}

                    {/* Create Invoice - Navigate to new page */}
                    <Button
                        onClick={() => router.push("/dashboard/invoices/create")}
                        className="h-12 px-6 rounded-2xl gap-2 w-full sm:w-auto shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 font-black uppercase tracking-widest text-[10px]"
                    >
                        <Plus className="w-4 h-4" />
                        Initiate Invoice
                    </Button>
                </div>
            </div>

            {/* Invoice Table */}
            <Card className="border-border shadow-sm overflow-hidden">
                <CardContent className="p-0">
                    {filteredInvoices.length === 0 ? (
                        <div className="py-16 px-6">
                            <IllustratedEmptyState
                                type="invoices"
                                title={searchQuery ? "No matching invoices" : "No invoices found"}
                                description={searchQuery ? `No invoices found matching "${searchQuery}"` : "Get started by creating your first invoice."}
                                actionLabel={searchQuery ? "Clear Search" : "Create Invoice"}
                                onAction={searchQuery ? () => setSearchQuery("") : () => router.push("/dashboard/invoices/create")}
                            />
                        </div>
                    ) : (
                        <div className="relative overflow-auto max-h-[calc(100vh-350px)]">
                            <Table>
                                <TableHeader className="bg-muted/50 sticky top-0 z-10">
                                    <TableRow className="border-0 hover:bg-transparent">
                                        <TableHead className="w-12 pl-6 bg-muted/10 rounded-l-3xl">
                                            <Checkbox
                                                checked={selectedIds.size === filteredInvoices.length && filteredInvoices.length > 0}
                                                onCheckedChange={handleSelectAll}
                                                className="border-muted data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                            />
                                        </TableHead>
                                        <TableHead className="w-[140px] bg-muted/10 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">ID / Hash</TableHead>
                                        <TableHead className="w-[100px] bg-muted/10 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Protocol</TableHead>
                                        <TableHead className="min-w-[180px] bg-muted/10 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Entity (Origin)</TableHead>
                                        <TableHead className="min-w-[180px] bg-muted/10 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Destination</TableHead>
                                        <TableHead className="w-[140px] bg-muted/10 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Timeline</TableHead>
                                        <TableHead className="w-[140px] text-right bg-muted/10 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Net Value</TableHead>
                                        <TableHead className="w-[140px] text-center bg-muted/10 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Status</TableHead>
                                        <TableHead className="w-[140px] text-right pr-6 bg-muted/10 rounded-r-3xl text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredInvoices.map((invoice) => {
                                        const status = statusConfig[invoice.status] || statusConfig.draft;
                                        return (
                                            <TableRow
                                                key={invoice.id}
                                                className="group border-b border-muted hover:bg-primary/10 transition-colors cursor-pointer"
                                                onClick={() => router.push(`/dashboard/invoices/${invoice.id}`)}
                                            >
                                                <TableCell className="pl-6" onClick={(e) => e.stopPropagation()}>
                                                    <Checkbox
                                                        checked={selectedIds.has(invoice.id)}
                                                        onCheckedChange={(checked) => handleSelectOne(invoice.id, !!checked)}
                                                        className="border-muted data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                                    />
                                                </TableCell>
                                                <TableCell className="py-5 font-black text-[13px] text-foreground tracking-tight">
                                                    {invoice.invoice_no}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="h-6 rounded-lg uppercase text-[9px] font-black tracking-widest bg-muted/10 border-muted text-muted-foreground py-0 px-2">
                                                        {invoice.type}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-bold text-[13px] text-foreground">{invoice.customers?.name || "TAC Cargo"}</div>
                                                    <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-0.5">Origin Protocol</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-bold text-[13px] text-foreground">{invoice.consignee_name || "-"}</div>
                                                    <div className="text-[10px] text-primary font-black uppercase tracking-widest mt-0.5">{invoice.consignee_city}</div>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-[11px] font-bold">
                                                    {new Date(invoice.invoice_date).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </TableCell>
                                                <TableCell className="text-right font-black text-[14px] text-foreground tracking-tighter">
                                                    ₹{invoice.total_amount.toLocaleString("en-IN")}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge
                                                        variant={status.variant}
                                                        className={cn("h-7 rounded-full uppercase text-[9px] font-black tracking-[0.1em] px-3 flex items-center justify-center gap-1.5 border w-fit mx-auto", status.bgColor)}
                                                    >
                                                        <span className={cn("w-1.5 h-1.5 rounded-full", status.dotColor)} />
                                                        {status.label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right pr-4" onClick={(e) => e.stopPropagation()}>
                                                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                            onClick={() => handleViewInvoice(invoice)}
                                                            title="View Details"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                            onClick={() => handleRegenerate(invoice.id)}
                                                            disabled={isPending}
                                                            title="Regenerate PDF"
                                                        >
                                                            <RefreshCw className="w-4 h-4" />
                                                        </Button>
                                                        {/* WhatsApp Button shortcut */}
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:text-green-600"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleSendWhatsApp(invoice.id);
                                                            }}
                                                            disabled={isPending}
                                                            title="Send WhatsApp"
                                                        >
                                                            <MessageCircle className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* View Invoice Dialog - only render after hydration */}
            {/* View Invoice Dialog - Removed and replaced with navigation */}
        </div>
    );
}

function StatsCard({
    icon: Icon,
    iconBg,
    iconColor,
    label,
    value,
    subValue
}: {
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
    label: string;
    value: string;
    subValue?: string;
}) {
    return (
        <Card className="border-2 border-muted rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white overflow-hidden group">
            <CardContent className="p-6">
                <div className="flex items-center gap-5">
                    <div className={cn("p-4 rounded-2xl transition-transform group-hover:scale-110 duration-500", iconBg)}>
                        <Icon className={cn("w-6 h-6", iconColor)} />
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
                        <div className="text-3xl font-black tracking-tighter text-foreground leading-none">{value}</div>
                        {subValue && (
                            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest pt-1">{subValue}</div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}



// InvoiceDetailPanel removed as it is replaced by the new InvoiceViewer page.
// function InvoiceDetailPanel(...) { ... }
