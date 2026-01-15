"use client";

import React, { useState, useTransition } from "react";
import {
    Plus,
    MoreHorizontal,
    FileText,
    Phone,
    Mail,
    MapPin,
    Building2,
    Crown,
    Users,
    User
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { formatCurrency } from "@/lib/utils";
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createCustomer } from "@/app/actions/customers";

import { PageShell } from "@/components/dashboard/page-shell";
import { DataTable } from "@/components/dashboard/data-table-premium";
import { type Customer } from "./columns"; // reusing type definition if suitable, or redefining

// --- Types ---

interface CustomerStats {
    total: number;
    vip: number;
    corporate: number;
    regular: number;
}

interface CustomersClientProps {
    initialCustomers: Customer[];
    stats: CustomerStats;
}

// --- Configuration ---

const customerTypeConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline"; icon: React.ElementType; className?: string }> = {
    vip: { label: "VIP", variant: "default", icon: Crown, className: "bg-warning/10 text-warning border-warning/20" },
    corporate: { label: "Corporate", variant: "secondary", icon: Building2, className: "bg-primary/10 text-primary border-primary/20" },
    regular: { label: "Regular", variant: "outline", icon: User, className: "text-muted-foreground" },
};

export function CustomersClient({ initialCustomers, stats }: CustomersClientProps) {
    const [customers, setCustomers] = useState(initialCustomers);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // --- Columns ---
    const columns: ColumnDef<Customer>[] = [
        {
            accessorKey: "name",
            header: "Customer",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-foreground">{row.getValue("name")}</span>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                        <Mail className="w-3 h-3" />
                        {row.original.email}
                    </div>
                </div>
            ),
        },
        {
            header: "Contact",
            cell: ({ row }) => (
                <div className="flex flex-col text-sm">
                    <span className="text-foreground font-medium">{row.original.name}</span>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                        <Phone className="w-3 h-3" />
                        {row.original.phone}
                    </div>
                </div>
            )
        },
        {
            accessorKey: "customer_type",
            header: "Type",
            cell: ({ row }) => {
                const type = row.getValue("customer_type") as string;
                const config = customerTypeConfig[type] || customerTypeConfig.regular;
                const Icon = config.icon;
                return (
                    <Badge variant="outline" className={config.className}>
                        <Icon className="w-3 h-3 mr-1.5" />
                        <span className="capitalize">{config.label}</span>
                    </Badge>
                );
            }
        },
        {
            header: "Location",
            cell: ({ row }) => (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>{row.original.city}, {row.original.state}</span>
                </div>
            )
        },
        {
            accessorKey: "credit_limit",
            header: "Credit Limit",
            cell: ({ row }) => {
                const limit = row.getValue("credit_limit") as number;
                return limit > 0 ? (
                    <span className="font-medium text-foreground">{formatCurrency(limit)}</span>
                ) : (
                    <span className="text-muted-foreground italic text-xs">No limit</span>
                );
            }
        },
        {
            id: "actions",
            cell: () => (
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
                            <DropdownMenuItem>
                                <FileText className="mr-2 h-4 w-4" /> View Invoices
                            </DropdownMenuItem>
                            <DropdownMenuItem>Edit Details</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Delete Customer</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        }
    ];

    return (
        <PageShell
            title="Customers"
            description="Manage client relationships, contact details, and credit profiles."
            breadcrumb={["Dashboard", "Finance", "Customers"]}
            action={
                <Button onClick={() => setIsCreateOpen(true)} className="rounded-full shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Customer
                </Button>
            }
        >
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-card rounded-2xl p-6 border border-border shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-start z-10 relative">
                        <div>
                            <p className="text-muted-foreground text-sm font-medium mb-1">Total</p>
                            <h3 className="text-3xl font-bold text-foreground">
                                {stats.total}
                            </h3>
                        </div>
                        <div className="p-3 bg-muted rounded-xl text-muted-foreground">
                            <Users className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-card rounded-2xl p-6 border border-border shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-start z-10 relative">
                        <div>
                            <p className="text-muted-foreground text-sm font-medium mb-1">VIP</p>
                            <h3 className="text-3xl font-bold text-warning">
                                {stats.vip}
                            </h3>
                        </div>
                        <div className="p-3 bg-warning/10 rounded-xl text-warning">
                            <Crown className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-card rounded-2xl p-6 border border-border shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-start z-10 relative">
                        <div>
                            <p className="text-muted-foreground text-sm font-medium mb-1">Corporate</p>
                            <h3 className="text-3xl font-bold text-primary">
                                {stats.corporate}
                            </h3>
                        </div>
                        <div className="p-3 bg-primary/10 rounded-xl text-primary">
                            <Building2 className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-card rounded-2xl p-6 border border-border shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-start z-10 relative">
                        <div>
                            <p className="text-muted-foreground text-sm font-medium mb-1">Regular</p>
                            <h3 className="text-3xl font-bold text-muted-foreground">
                                {stats.regular}
                            </h3>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-xl text-muted-foreground">
                            <User className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={customers}
                filterColumn="name"
                filterPlaceholder="Search customers..."
            />

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Add Customer</DialogTitle>
                        <DialogDescription>Fill in the details below to add a new customer.</DialogDescription>
                    </DialogHeader>
                    <CreateCustomerForm
                        onSuccess={(newCustomer) => {
                            setCustomers(prev => [newCustomer as Customer, ...prev]);
                            setIsCreateOpen(false);
                            toast.success("Customer added");
                        }}
                    />
                </DialogContent>
            </Dialog>
        </PageShell>
    );
}

function CreateCustomerForm({ onSuccess }: { onSuccess: (customer: unknown) => void }) {
    const [isPending, startTransition] = useTransition();
    const [formData, setFormData] = useState({
        name: "",
        contact_person: "",
        contact_email: "",
        contact_phone: "",
        billing_address: "",
        city: "",
        state: "",
        pincode: "",
        gst_number: "",
        credit_limit: 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        startTransition(async () => {
            const result = await createCustomer({
                ...formData,
                contact_person: formData.contact_person || formData.name,
            });
            if (result.success) {
                onSuccess(result.data);
            } else {
                toast.error(result.error);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                    <Label>Company / Customer Name</Label>
                    <Input
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                        value={formData.contact_phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                        placeholder="+919876543210"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                        type="email"
                        value={formData.contact_email}
                        onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Address</Label>
                <Input
                    value={formData.billing_address}
                    onChange={(e) => setFormData(prev => ({ ...prev, billing_address: e.target.value }))}
                    required
                />
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label>City</Label>
                    <Input
                        value={formData.city}
                        onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label>State</Label>
                    <Input
                        value={formData.state}
                        onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label>Pincode</Label>
                    <Input
                        value={formData.pincode}
                        onChange={(e) => setFormData(prev => ({ ...prev, pincode: e.target.value }))}
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>GST Number (Optional)</Label>
                    <Input
                        value={formData.gst_number}
                        onChange={(e) => setFormData(prev => ({ ...prev, gst_number: e.target.value }))}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Credit Limit</Label>
                    <Input
                        type="number"
                        value={formData.credit_limit}
                        onChange={(e) => setFormData(prev => ({ ...prev, credit_limit: parseInt(e.target.value) || 0 }))}
                    />
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isPending} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    {isPending ? "Adding..." : "Add Customer"}
                </Button>
            </div>
        </form>
    );
}
