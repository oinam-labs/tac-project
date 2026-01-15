"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Phone, Mail, Eye, Edit, ArrowUpDown } from "lucide-react";
import type { CustomerType } from "@/types/database";
import Link from "next/link";

export interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  gst_number: string | null;
  customer_type: CustomerType;
  credit_limit: number;
  created_at: string;
}

const typeConfig: Record<CustomerType, { label: string; variant: "default" | "secondary" | "outline" }> = {
  regular: { label: "Regular", variant: "outline" },
  corporate: { label: "Corporate", variant: "default" },
  vip: { label: "VIP", variant: "secondary" },
};

export const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4"
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return <div className="font-medium">{name}</div>;
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.getValue("phone") as string;
      return (
        <a href={`tel:${phone}`} className="text-primary hover:underline flex items-center gap-1.5">
          <Phone className="h-3 w-3" />
          {phone}
        </a>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.getValue("email") as string | null;
      if (!email) return <span className="text-muted-foreground">-</span>;
      return (
        <a href={`mailto:${email}`} className="text-primary hover:underline flex items-center gap-1.5">
          <Mail className="h-3 w-3" />
          {email}
        </a>
      );
    },
  },
  {
    accessorKey: "city",
    header: "Location",
    cell: ({ row }) => {
      const city = row.original.city;
      const state = row.original.state;
      if (!city) return <span className="text-muted-foreground">-</span>;
      return <span>{city}{state ? `, ${state}` : ""}</span>;
    },
  },
  {
    accessorKey: "customer_type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("customer_type") as CustomerType;
      const config = typeConfig[type] || typeConfig.regular;
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "gst_number",
    header: "GST",
    cell: ({ row }) => {
      const gst = row.getValue("gst_number") as string | null;
      if (!gst) return <span className="text-muted-foreground">-</span>;
      return <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{gst}</code>;
    },
  },
  {
    accessorKey: "credit_limit",
    header: () => <div className="text-right">Credit Limit</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("credit_limit") || "0");
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const customer = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(customer.phone)}
            >
              Copy phone number
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/customers/${customer.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/customers/${customer.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit customer
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
