"use client";

import React, { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Building2, 
  Clock,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { AddressData, CustomerSuggestion } from "./types";

// =============================================================================
// CONSTANTS
// =============================================================================

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal",
];

// =============================================================================
// TYPES
// =============================================================================

interface AddressCardProps {
  title: string;
  variant: "shipper" | "consignee";
  data: AddressData;
  onChange: (field: keyof AddressData, value: string) => void;
  onCustomerSelect?: (customer: CustomerSuggestion) => void;
  errors?: Partial<Record<keyof AddressData, string>>;
  recentCustomers?: CustomerSuggestion[];
  className?: string;
}

// =============================================================================
// FIELD INPUT COMPONENT
// =============================================================================

interface FieldInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  type?: string;
  required?: boolean;
  className?: string;
}

function FieldInput({
  label,
  value,
  onChange,
  error,
  placeholder,
  icon,
  type = "text",
  required,
  className,
}: FieldInputProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium text-muted-foreground/90 flex items-center">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 pointer-events-none">
            {icon}
          </div>
        )}
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "h-10 text-sm transition-all duration-200 border-border/60 focus:border-primary/80 focus:ring-primary/20 placeholder:text-muted-foreground/70",
            icon && "pl-10",
            error && "border-destructive focus-visible:ring-destructive/20"
          )}
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-[11px] text-destructive font-medium mt-1.5"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function AddressCard({
  title,
  variant,
  data,
  onChange,
  onCustomerSelect,
  errors = {},
  recentCustomers = [],
  className,
}: AddressCardProps) {
  const [isCustomerOpen, setIsCustomerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isShipper = variant === "shipper";
  const Icon = isShipper ? User : MapPin;

  // Filter customers based on search
  const filteredCustomers = recentCustomers.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  const handleCustomerSelect = useCallback((customer: CustomerSuggestion) => {
    onChange("name", customer.name);
    onChange("phone", customer.phone);
    onChange("email", customer.email || "");
    onChange("address", customer.address || "");
    onChange("city", customer.city || "");
    onChange("state", customer.state || "");
    onChange("pincode", customer.pincode || "");
    onChange("gstin", customer.gstin || "");
    onCustomerSelect?.(customer);
    setIsCustomerOpen(false);
  }, [onChange, onCustomerSelect]);

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:shadow-lg border-border/60 shadow-sm",
        isShipper 
          ? "hover:border-primary/40 hover:shadow-primary/5" 
          : "hover:border-success/40 hover:shadow-success/5",
        className
      )}
    >
      {/* Gradient accent bar */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-1",
          isShipper 
          ? "bg-gradient-to-r from-primary via-primary/80 to-primary/60 dark:from-primary dark:via-primary/90 dark:to-primary/70" 
          : "bg-gradient-to-r from-success via-success/80 to-success/60 dark:from-success dark:via-success/90 dark:to-success/70"
        )}
      />

      <CardHeader className="p-6 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm",
                isShipper ? "bg-primary/10 dark:bg-primary/20 text-primary" : "bg-success/10 dark:bg-success/20 text-success"
              )}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold tracking-tight">{title}</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                {isShipper ? "Sender details" : "Receiver details"}
              </p>
            </div>
          </div>

          {/* Customer Search Popover */}
          {recentCustomers.length > 0 && (
            <Popover open={isCustomerOpen} onOpenChange={setIsCustomerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-xs h-8 border-border/60 hover:bg-muted/50"
                >
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  Recent
                  <ChevronDown className="w-3 h-3 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <Command>
                  <CommandInput
                    placeholder="Search customers..."
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                    className="h-10 text-sm"
                  />
                  <CommandList>
                    <CommandEmpty>No customers found.</CommandEmpty>
                    <CommandGroup heading="Recent Customers">
                      {filteredCustomers.slice(0, 5).map((customer) => (
                        <CommandItem
                          key={customer.id}
                          value={customer.name}
                          onSelect={() => handleCustomerSelect(customer)}
                          className="flex items-center gap-3 py-3 cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                            <User className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate text-sm">{customer.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{customer.phone}</p>
                          </div>
                          <Badge variant="secondary" className="text-[10px] shrink-0 h-5 px-1.5">
                            {customer.invoiceCount}
                          </Badge>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-4 space-y-6">
        {/* Grid System for Fields */}
        <div className="grid grid-cols-12 gap-x-4 gap-y-5">
          {/* Name & Phone */}
          <div className="col-span-12 md:col-span-6">
            <FieldInput
              label="Full Name"
              value={data.name}
              onChange={(v) => onChange("name", v)}
              error={errors.name}
              placeholder="Enter full name"
              icon={<User className="w-4 h-4" />}
              required
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <FieldInput
              label="Phone"
              value={data.phone}
              onChange={(v) => onChange("phone", v)}
              error={errors.phone}
              placeholder="+91 XXXXX XXXXX"
              icon={<Phone className="w-4 h-4" />}
              type="tel"
              required
            />
          </div>

          {/* Email */}
          <div className={cn("col-span-12", isShipper ? "md:col-span-6" : "md:col-span-12")}>
            <FieldInput
              label="Email"
              value={data.email}
              onChange={(v) => onChange("email", v)}
              error={errors.email}
              placeholder="email@example.com"
              icon={<Mail className="w-4 h-4" />}
              type="email"
            />
          </div>

          {/* GSTIN (Shipper only) */}
          {isShipper && (
            <div className="col-span-12 md:col-span-6">
              <FieldInput
                label="GSTIN"
                value={data.gstin}
                onChange={(v) => onChange("gstin", v.toUpperCase())}
                error={errors.gstin}
                placeholder="22AAAAA0000A1Z5"
                icon={<Building2 className="w-4 h-4" />}
              />
            </div>
          )}

          {/* Address */}
          <div className="col-span-12">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground/90">Address</Label>
              <Textarea
                value={data.address}
                onChange={(e) => onChange("address", e.target.value)}
                placeholder="Street address, building, landmark..."
                rows={2}
                className="resize-none text-sm min-h-[72px] border-border/60 focus:border-primary/80 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* City, State, Pincode */}
          <div className="col-span-12 md:col-span-4">
            <FieldInput
              label="City"
              value={data.city}
              onChange={(v) => onChange("city", v)}
              error={errors.city}
              placeholder="City"
              required
            />
          </div>

          <div className="col-span-12 md:col-span-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground/90 flex items-center gap-1">
                State
                <span className="text-destructive ml-1">*</span>
              </Label>
              <Select value={data.state} onValueChange={(v) => onChange("state", v)}>
                <SelectTrigger className={cn("h-10 text-sm border-border/60 focus:ring-primary/20", errors.state && "border-destructive")}>
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  {INDIAN_STATES.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.state && (
                <p className="text-[11px] text-destructive font-medium mt-1.5">{errors.state}</p>
              )}
            </div>
          </div>

          <div className="col-span-12 md:col-span-4">
            <FieldInput
              label="Pincode"
              value={data.pincode}
              onChange={(v) => onChange("pincode", v.replace(/\D/g, "").slice(0, 6))}
              error={errors.pincode}
              placeholder="110001"
              required={!isShipper}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default AddressCard;
