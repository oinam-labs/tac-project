"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Plus,
  Search,
  Download,
  MoreHorizontal,
  Eye,
  Printer,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  CircleDashed,
  FileEdit,
  ChevronDown,
  RefreshCw,
  MessageCircle,
  IndianRupee,
  ArrowUpDown,
  Mail,
  Calendar as CalendarIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { INVOICE_STATUS_CONFIG, type InvoiceStatusKey } from "@/lib/invoice/design-tokens";
import { formatCurrency } from "@/lib/invoice/enterprise-calculations";
import type { InvoiceListItem } from "@/types/invoice-enterprise";

// =============================================================================
// TYPES
// =============================================================================

interface InvoiceListProps {
  invoices: InvoiceListItem[];
  onRefresh?: () => void;
  isLoading?: boolean;
}

interface FilterState {
  search: string;
  status: InvoiceStatusKey | "all";
  dateRange: { from?: Date; to?: Date };
  sortBy: "date" | "amount" | "invoice";
  sortOrder: "asc" | "desc";
}

// =============================================================================
// STATUS ICON MAPPING
// =============================================================================

const StatusIcon: Record<InvoiceStatusKey, React.ElementType> = {
  draft: FileEdit,
  pending: Clock,
  paid: CheckCircle,
  partial: CircleDashed,
  overdue: AlertTriangle,
  cancelled: XCircle,
};

// =============================================================================
// STATS CARD COMPONENT
// =============================================================================

function StatsCard({
  label,
  value,
  subValue,
  icon: Icon,
  className,
}: {
  label: string;
  value: string | number;
  subValue?: string;
  icon: React.ElementType;
  className?: string;
}) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        {subValue && (
          <p className="text-xs text-muted-foreground mt-1">
            {subValue}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function EnterpriseInvoiceList({ 
  invoices, 
  onRefresh,
  isLoading = false 
}: InvoiceListProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "all",
    dateRange: {},
    sortBy: "date",
    sortOrder: "desc",
  });

  // Calculate stats
  const stats = useMemo(() => {
    const total = invoices.length;
    const draft = invoices.filter(i => i.status === "draft").length;
    const pending = invoices.filter(i => i.status === "pending").length;
    const paid = invoices.filter(i => i.status === "paid").length;
    const overdue = invoices.filter(i => i.status === "overdue").length;
    const totalAmount = invoices.reduce((sum, i) => sum + i.totalAmount, 0);
    const paidAmount = invoices.reduce((sum, i) => sum + i.paidAmount, 0);
    const outstandingAmount = invoices.reduce((sum, i) => sum + i.balanceDue, 0);

    return {
      total,
      draft,
      pending,
      paid,
      overdue,
      totalAmount,
      paidAmount,
      outstandingAmount,
      collectionRate: total > 0 ? Math.round((paid / total) * 100) : 0,
    };
  }, [invoices]);

  // Filter and sort invoices
  const filteredInvoices = useMemo(() => {
    let result = [...invoices];

    // Search filter
    if (filters.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(
        (inv) =>
          inv.invoiceNo.toLowerCase().includes(query) ||
          inv.awbNo?.toLowerCase().includes(query) ||
          inv.customerName?.toLowerCase().includes(query) ||
          inv.consigneeName?.toLowerCase().includes(query) ||
          inv.consigneeCity?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (filters.status !== "all") {
      result = result.filter((inv) => inv.status === filters.status);
    }

    // Date range filter
    if (filters.dateRange.from) {
      result = result.filter(
        (inv) => new Date(inv.invoiceDate) >= filters.dateRange.from!
      );
    }
    if (filters.dateRange.to) {
      result = result.filter(
        (inv) => new Date(inv.invoiceDate) <= filters.dateRange.to!
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (filters.sortBy) {
        case "date":
          comparison = new Date(a.invoiceDate).getTime() - new Date(b.invoiceDate).getTime();
          break;
        case "amount":
          comparison = a.totalAmount - b.totalAmount;
          break;
        case "invoice":
          comparison = a.invoiceNo.localeCompare(b.invoiceNo);
          break;
      }
      return filters.sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [invoices, filters]);

  // Selection handlers
  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredInvoices.map((i) => i.id)));
    } else {
      setSelectedIds(new Set());
    }
  }, [filteredInvoices]);

  const handleSelectOne = useCallback((id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }, []);

  // Action handlers
  const handleViewInvoice = (id: string) => {
    router.push(`/dashboard/invoices/${id}`);
  };

  const handleCreateInvoice = () => {
    router.push("/dashboard/invoices/create");
  };

  const handleBulkAction = (action: string) => {
    const count = selectedIds.size;
    if (count === 0) {
      toast.error("Please select invoices first");
      return;
    }
    toast.info(`${action} ${count} invoice(s)...`);
    // Implement bulk actions
  };

  const handleExport = (format: string) => {
    toast.info(`Exporting to ${format}...`);
    // Implement export
  };

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Total Invoices"
          value={stats.total}
          subValue={`${formatCurrency(stats.totalAmount)} total value`}
          icon={FileEdit}
        />
        <StatsCard
          label="Paid"
          value={stats.paid}
          subValue={`${stats.collectionRate}% collection rate`}
          icon={CheckCircle}
        />
        <StatsCard
          label="Pending"
          value={stats.pending}
          subValue="Awaiting payment"
          icon={Clock}
        />
        <StatsCard
          label="Overdue"
          value={stats.overdue}
          subValue={`${formatCurrency(stats.outstandingAmount)} outstanding`}
          icon={AlertTriangle}
          className="border-destructive/50 bg-destructive/5"
        />
      </div>

      <Card className="overflow-hidden">
        {/* Filters & Actions Bar */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between p-4 border-b">
          {/* Search & Filters */}
          <div className="flex flex-wrap gap-3 items-center w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px] lg:w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={filters.search}
                onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                className="pl-9 h-9"
              />
            </div>

            {/* Status Filter */}
            <Select
              value={filters.status}
              onValueChange={(v) => setFilters((f) => ({ ...f, status: v as FilterState["status"] }))}
            >
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Range */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-9 gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Date</span>
                  <ChevronDown className="w-3 h-3 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={{
                    from: filters.dateRange.from,
                    to: filters.dateRange.to,
                  }}
                  onSelect={(range) =>
                    setFilters((f) => ({
                      ...f,
                      dateRange: { from: range?.from, to: range?.to },
                    }))
                  }
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            {/* Refresh */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={onRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
            </Button>
          </div>

          {/* Actions */}
          <div className="flex gap-2 items-center w-full lg:w-auto justify-between lg:justify-end">
            {/* Bulk Actions (when selected) */}
            {selectedIds.size > 0 && (
              <div className="flex items-center gap-2 mr-2">
                <Badge variant="secondary" className="hidden sm:flex">
                  {selectedIds.size} selected
                </Badge>
                <Separator orientation="vertical" className="h-6 hidden sm:block" />
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9"
                  onClick={() => handleBulkAction("Download")}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" className="h-9 gap-2" onClick={() => handleExport("CSV")}>
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>

              <Button onClick={handleCreateInvoice} className="h-9 gap-2">
                <Plus className="w-4 h-4" />
                Create
              </Button>
            </div>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedIds.size === filteredInvoices.length && filteredInvoices.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" className="-ml-3 h-8 text-xs font-semibold" onClick={() => setFilters((f) => ({ ...f, sortBy: "invoice", sortOrder: f.sortOrder === "asc" ? "desc" : "asc" }))}>
                    Invoice #
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" className="-ml-3 h-8 text-xs font-semibold" onClick={() => setFilters((f) => ({ ...f, sortBy: "date", sortOrder: f.sortOrder === "asc" ? "desc" : "asc" }))}>
                    Date
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" size="sm" className="-mr-3 h-8 text-xs font-semibold" onClick={() => setFilters((f) => ({ ...f, sortBy: "amount", sortOrder: f.sortOrder === "asc" ? "desc" : "asc" }))}>
                    Amount
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <FileEdit className="w-12 h-12 mb-4 text-muted-foreground/20" />
                      <p className="text-lg font-medium text-foreground">No invoices found</p>
                      <p className="text-sm mt-1">
                        {filters.search || filters.status !== "all"
                          ? "Try adjusting your filters"
                          : "Create your first invoice to get started"}
                      </p>
                      {!filters.search && filters.status === "all" && (
                        <Button onClick={handleCreateInvoice} className="mt-4" variant="outline">
                          <Plus className="w-4 h-4 mr-2" />
                          Create Invoice
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvoices.map((invoice) => {
                  const statusConfig = INVOICE_STATUS_CONFIG[invoice.status];
                  const StatusIconComponent = StatusIcon[invoice.status];

                  return (
                    <TableRow
                      key={invoice.id}
                      className="cursor-pointer"
                      onClick={() => handleViewInvoice(invoice.id)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedIds.has(invoice.id)}
                          onCheckedChange={(checked) => handleSelectOne(invoice.id, !!checked)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-mono text-sm font-medium">{invoice.invoiceNo}</span>
                          {invoice.awbNo && (
                            <span className="text-xs text-muted-foreground font-mono">{invoice.awbNo}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{invoice.customerName || "Walk-in"}</span>
                          <span className="text-xs text-muted-foreground">{invoice.customerPhone}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{invoice.consigneeName || "-"}</span>
                          <span className="text-xs text-muted-foreground">
                            {[invoice.consigneeCity, invoice.consigneeState].filter(Boolean).join(", ")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">{format(new Date(invoice.invoiceDate), "dd MMM yyyy")}</span>
                          {invoice.dueDate && (
                            <span className={cn(
                              "text-xs",
                              invoice.isOverdue ? "text-destructive font-medium" : "text-muted-foreground"
                            )}>
                              Due: {format(new Date(invoice.dueDate), "dd MMM")}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end">
                          <span className="font-mono text-sm font-medium">
                            {formatCurrency(invoice.totalAmount)}
                          </span>
                          {invoice.balanceDue > 0 && invoice.balanceDue < invoice.totalAmount && (
                            <span className="text-xs text-warning">
                              Due: {formatCurrency(invoice.balanceDue)}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Badge
                            variant="outline"
                            className={cn(
                              "gap-1.5 font-medium border-0",
                            )}
                            style={{
                              color: statusConfig.color,
                              backgroundColor: statusConfig.bgColor,
                            }}
                          >
                            <StatusIconComponent className="w-3 h-3" />
                            {statusConfig.label}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewInvoice(invoice.id)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Printer className="w-4 h-4 mr-2" />
                              Print Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" />
                              Download PDF
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Mail className="w-4 h-4 mr-2" />
                              Send via Email
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Send via WhatsApp
                            </DropdownMenuItem>
                            {invoice.status === "pending" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <IndianRupee className="w-4 h-4 mr-2" />
                                  Record Payment
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Footer */}
        {filteredInvoices.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/20">
            <p className="text-xs text-muted-foreground">
              Showing {filteredInvoices.length} of {invoices.length} invoices
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="h-8" disabled>
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

export default EnterpriseInvoiceList;
