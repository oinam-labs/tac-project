"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
// import { format } from "date-fns"; // Reserved for date formatting
import {
  ArrowLeft,
  ArrowRight,
  Check,
  User,
  MapPin,
  Package,
  Calculator,
  FileText,
  Plus,
  Trash2,
  Info,
  AlertCircle,
  Loader2,
  Building2,
  Phone,
  Mail,
  Scale,
  IndianRupee,
  Percent,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip"; // Reserved for tooltips
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import { toast } from "sonner";

import {
  SERVICE_LEVEL_CONFIG,
  PAYMENT_MODE_CONFIG,
  type ServiceLevel,
  type PaymentMode,
} from "@/lib/invoice/design-tokens";
import {
  calculateInvoiceTotals,
  formatCurrency,
} from "@/lib/invoice/enterprise-calculations";
import {
  generateInvoiceNumber,
  generateAWBNumber,
} from "@/lib/invoice/id-generator";
import { createEnterpriseInvoice } from "@/app/actions/invoice-enterprise";
import type { InvoiceFormInput } from "@/types/invoice-enterprise";

// =============================================================================
// TYPES
// =============================================================================

interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

interface AddressData {
  name: string;
  phone: string;
  email: string;
  gstin: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface PackageData {
  id: string;
  description: string;
  category: string;
  quantity: number;
  weight: number;
  length: number;
  width: number;
  height: number;
  declaredValue: number;
}

interface ChargesData {
  ratePerKg: number;
  fuelSurchargePercentage: number;
  pickupCharge: number;
  deliveryCharge: number;
  packingCharge: number;
  insuranceCharge: number;
  handlingCharge: number;
  otherCharges: number;
  discountPercentage: number;
  advancePaid: number;
}

interface FormState {
  serviceLevel: ServiceLevel;
  paymentMode: PaymentMode;
  transportMode: "air" | "surface" | "express";
  shipper: AddressData;
  consignee: AddressData;
  packages: PackageData[];
  charges: ChargesData;
  specialInstructions: string;
  internalNotes: string;
}

interface InvoiceFormWizardProps {
  onSuccess?: (invoice: { id: string; invoice_no: string; awb_no: string }) => void;
  onCancel?: () => void;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const WIZARD_STEPS: WizardStep[] = [
  { id: "parties", title: "Parties", description: "Shipper & Consignee", icon: User },
  { id: "shipment", title: "Shipment", description: "Package Details", icon: Package },
  { id: "charges", title: "Charges", description: "Pricing & Fees", icon: Calculator },
  { id: "review", title: "Review", description: "Confirm & Create", icon: FileText },
];

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Jammu and Kashmir", "Ladakh",
];

const PACKAGE_CATEGORIES = [
  "General", "Electronics", "Documents", "Fragile", "Perishable",
  "Clothing", "Machinery", "Pharmaceuticals", "Chemicals", "Other",
];

const createEmptyAddress = (): AddressData => ({
  name: "", phone: "", email: "", gstin: "",
  address: "", city: "", state: "", pincode: "",
});

const createEmptyPackage = (): PackageData => ({
  id: crypto.randomUUID(),
  description: "", category: "General", quantity: 1,
  weight: 0, length: 0, width: 0, height: 0, declaredValue: 0,
});

const createInitialState = (): FormState => ({
  serviceLevel: "standard",
  paymentMode: "prepaid",
  transportMode: "air",
  shipper: createEmptyAddress(),
  consignee: createEmptyAddress(),
  packages: [createEmptyPackage()],
  charges: {
    ratePerKg: 0, fuelSurchargePercentage: 15,
    pickupCharge: 0, deliveryCharge: 0, packingCharge: 0,
    insuranceCharge: 0, handlingCharge: 0, otherCharges: 0,
    discountPercentage: 0, advancePaid: 0,
  },
  specialInstructions: "",
  internalNotes: "",
});

// =============================================================================
// SUB COMPONENTS
// =============================================================================

function StepIndicator({ steps, currentStep, onStepClick }: {
  steps: WizardStep[];
  currentStep: number;
  onStepClick: (index: number) => void;
}) {
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const Icon = step.icon;

        return (
          <React.Fragment key={step.id}>
            <button
              onClick={() => index < currentStep && onStepClick(index)}
              disabled={index > currentStep}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg transition-all",
                isCompleted && "cursor-pointer hover:bg-success/10",
                isCurrent && "bg-primary/10",
                index > currentStep && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                isCompleted && "bg-success text-success-foreground",
                isCurrent && "bg-primary text-primary-foreground",
                !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
              )}>
                {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>
              <div className="text-left hidden md:block">
                <p className={cn(
                  "text-sm font-bold",
                  isCurrent && "text-primary",
                  isCompleted && "text-success"
                )}>
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </button>
            {index < steps.length - 1 && (
              <div className={cn(
                "flex-1 h-0.5 mx-2",
                index < currentStep ? "bg-success" : "bg-muted"
              )} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function FormField({ label, required, error, hint, children, className }: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-sm font-bold text-foreground">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}

function AddressCard({ title, icon, data, onChange, errors, variant }: {
  title: string;
  icon: React.ElementType;
  data: AddressData;
  onChange: (field: keyof AddressData, value: string) => void;
  errors: Partial<Record<keyof AddressData, string>>;
  variant: "shipper" | "consignee";
}) {
  const Icon = icon;
  const colorClass = variant === "shipper" ? "text-info bg-info/10" : "text-success bg-success/10";

  return (
    <Card className="flex-1">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <div className={cn("p-2 rounded-lg", colorClass)}>
            <Icon className="w-4 h-4" />
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField label="Full Name" required error={errors.name}>
          <Input
            value={data.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="Enter full name"
            className={cn(errors.name && "border-destructive")}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Phone" required error={errors.phone}>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={data.phone}
                onChange={(e) => onChange("phone", e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className={cn("pl-10", errors.phone && "border-destructive")}
              />
            </div>
          </FormField>
          <FormField label="Email" hint="For notifications">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                value={data.email}
                onChange={(e) => onChange("email", e.target.value)}
                placeholder="email@example.com"
                className="pl-10"
              />
            </div>
          </FormField>
        </div>

        {variant === "shipper" && (
          <FormField label="GSTIN" hint="For GST invoicing">
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={data.gstin}
                onChange={(e) => onChange("gstin", e.target.value.toUpperCase())}
                placeholder="22AAAAA0000A1Z5"
                className="pl-10"
                maxLength={15}
              />
            </div>
          </FormField>
        )}

        <FormField label="Address">
          <Textarea
            value={data.address}
            onChange={(e) => onChange("address", e.target.value)}
            placeholder="Street address, building, landmark..."
            rows={2}
          />
        </FormField>

        <div className="grid grid-cols-3 gap-4">
          <FormField label="City" required error={errors.city}>
            <Input
              value={data.city}
              onChange={(e) => onChange("city", e.target.value)}
              placeholder="City"
              className={cn(errors.city && "border-destructive")}
            />
          </FormField>
          <FormField label="State" required error={errors.state}>
            <Select value={data.state} onValueChange={(v) => onChange("state", v)}>
              <SelectTrigger className={cn(errors.state && "border-destructive")}>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {INDIAN_STATES.map((state) => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Pincode" required error={errors.pincode}>
            <Input
              value={data.pincode}
              onChange={(e) => onChange("pincode", e.target.value)}
              placeholder="110001"
              maxLength={6}
              className={cn(errors.pincode && "border-destructive")}
            />
          </FormField>
        </div>
      </CardContent>
    </Card>
  );
}

function PackageCard({ pkg, index, onChange, onRemove, canRemove, errors }: {
  pkg: PackageData;
  index: number;
  onChange: (field: keyof PackageData, value: unknown) => void;
  onRemove: () => void;
  canRemove: boolean;
  errors: Partial<Record<string, string>>;
}) {
  const volumetricWeight = pkg.length && pkg.width && pkg.height
    ? ((pkg.length * pkg.width * pkg.height) / 5000).toFixed(2)
    : "0.00";

  return (
    <Card className="relative group">
      {canRemove && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onRemove}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      )}
      <CardContent className="p-5 pt-4">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline" className="font-mono">Package {index + 1}</Badge>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8">
            <FormField label="Description" required error={errors[`pkg${index}Desc`]}>
              <Input
                value={pkg.description}
                onChange={(e) => onChange("description", e.target.value)}
                placeholder="What's inside? (e.g., Electronics, Documents)"
                className={cn(errors[`pkg${index}Desc`] && "border-destructive")}
              />
            </FormField>
          </div>
          <div className="col-span-4">
            <FormField label="Category">
              <Select value={pkg.category} onValueChange={(v) => onChange("category", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PACKAGE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <div className="col-span-2">
            <FormField label="Qty">
              <Input
                type="number"
                min={1}
                value={pkg.quantity}
                onChange={(e) => onChange("quantity", parseInt(e.target.value) || 1)}
              />
            </FormField>
          </div>
          <div className="col-span-3">
            <FormField label="Weight (kg)" required error={errors[`pkg${index}Weight`]}>
              <div className="relative">
                <Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="number"
                  step="0.1"
                  min={0}
                  value={pkg.weight || ""}
                  onChange={(e) => onChange("weight", parseFloat(e.target.value) || 0)}
                  placeholder="0.0"
                  className={cn("pl-10", errors[`pkg${index}Weight`] && "border-destructive")}
                />
              </div>
            </FormField>
          </div>
          <div className="col-span-4">
            <FormField label="Dimensions (L×W×H cm)" hint={`Vol: ${volumetricWeight} kg`}>
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  placeholder="L"
                  value={pkg.length || ""}
                  onChange={(e) => onChange("length", parseFloat(e.target.value) || 0)}
                  className="text-center"
                />
                <span className="text-muted-foreground">×</span>
                <Input
                  type="number"
                  placeholder="W"
                  value={pkg.width || ""}
                  onChange={(e) => onChange("width", parseFloat(e.target.value) || 0)}
                  className="text-center"
                />
                <span className="text-muted-foreground">×</span>
                <Input
                  type="number"
                  placeholder="H"
                  value={pkg.height || ""}
                  onChange={(e) => onChange("height", parseFloat(e.target.value) || 0)}
                  className="text-center"
                />
              </div>
            </FormField>
          </div>
          <div className="col-span-3">
            <FormField label="Declared Value" hint="For insurance">
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="number"
                  min={0}
                  value={pkg.declaredValue || ""}
                  onChange={(e) => onChange("declaredValue", parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="pl-10"
                />
              </div>
            </FormField>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ChargeInput({ label, value, onChange, icon: Icon, hint, suffix }: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  icon?: React.ElementType;
  hint?: string;
  suffix?: string;
}) {
  return (
    <FormField label={label} hint={hint}>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        )}
        <Input
          type="number"
          min={0}
          step="0.01"
          value={value || ""}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          placeholder="0.00"
          className={cn(Icon && "pl-10", suffix && "pr-10")}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
    </FormField>
  );
}

function TotalsSummary({ totals, className }: {
  totals: ReturnType<typeof calculateInvoiceTotals>;
  className?: string;
}) {
  return (
    <Card className={cn("bg-muted", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold text-muted-foreground">Invoice Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Base Freight</span>
          <span>{formatCurrency(totals.charges.baseFreightCharge)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Fuel Surcharge ({totals.charges.fuelSurchargePercentage}%)</span>
          <span>{formatCurrency(totals.charges.fuelSurcharge)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Other Charges</span>
          <span>{formatCurrency(
            totals.charges.pickupCharge + totals.charges.deliveryCharge +
            totals.charges.packingCharge + totals.charges.handlingCharge +
            totals.charges.insuranceCharge + totals.charges.otherCharges
          )}</span>
        </div>
        {totals.charges.discountAmount > 0 && (
          <div className="flex justify-between text-sm text-success">
            <span>Discount</span>
            <span>-{formatCurrency(totals.charges.discountAmount)}</span>
          </div>
        )}
        <Separator />
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatCurrency(totals.tax.subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            {totals.tax.isInterState ? "IGST (18%)" : "CGST + SGST (18%)"}
          </span>
          <span>{formatCurrency(totals.tax.totalTax)}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-bold text-lg">
          <span>Grand Total</span>
          <span className="text-primary">{formatCurrency(totals.grandTotal)}</span>
        </div>
        {totals.advancePaid > 0 && (
          <>
            <div className="flex justify-between text-sm text-success">
              <span>Advance Paid</span>
              <span>-{formatCurrency(totals.advancePaid)}</span>
            </div>
            <div className="flex justify-between font-semibold text-warning">
              <span>Balance Due</span>
              <span>{formatCurrency(totals.balanceDue)}</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function InvoiceFormWizard({ onSuccess, onCancel }: InvoiceFormWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formState, setFormState] = useState<FormState>(createInitialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invoiceNo, setInvoiceNo] = useState("");
  const [awbNo, setAwbNo] = useState("");

  // Generate IDs on mount
  useEffect(() => {
    setInvoiceNo(generateInvoiceNumber());
    setAwbNo(generateAWBNumber());
  }, []);

  // Calculate totals
  const totals = useMemo(() => {
    const packages = formState.packages.map((pkg) => ({
      id: pkg.id,
      description: pkg.description,
      actualWeight: pkg.weight,
      quantity: pkg.quantity,
      dimensions: pkg.length && pkg.width && pkg.height
        ? { length: pkg.length, width: pkg.width, height: pkg.height }
        : undefined,
      declaredValue: pkg.declaredValue,
    }));

    return calculateInvoiceTotals(
      packages,
      formState.charges.ratePerKg,
      formState.shipper.state || "Delhi",
      formState.consignee.state || "Delhi",
      formState.serviceLevel,
      {
        fuelSurchargePercentage: formState.charges.fuelSurchargePercentage,
        pickupCharge: formState.charges.pickupCharge,
        deliveryCharge: formState.charges.deliveryCharge,
        packingCharge: formState.charges.packingCharge,
        insuranceCharge: formState.charges.insuranceCharge,
        handlingCharge: formState.charges.handlingCharge,
        otherCharges: formState.charges.otherCharges,
        discountPercentage: formState.charges.discountPercentage,
        advancePaid: formState.charges.advancePaid,
      }
    );
  }, [formState]);

  // Update helpers
  const updateShipper = useCallback((field: keyof AddressData, value: string) => {
    setFormState((s) => ({ ...s, shipper: { ...s.shipper, [field]: value } }));
    setErrors((e) => ({ ...e, [`shipper.${field}`]: "" }));
  }, []);

  const updateConsignee = useCallback((field: keyof AddressData, value: string) => {
    setFormState((s) => ({ ...s, consignee: { ...s.consignee, [field]: value } }));
    setErrors((e) => ({ ...e, [`consignee.${field}`]: "" }));
  }, []);

  const updatePackage = useCallback((id: string, field: keyof PackageData, value: unknown) => {
    setFormState((s) => ({
      ...s,
      packages: s.packages.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    }));
  }, []);

  const addPackage = useCallback(() => {
    setFormState((s) => ({ ...s, packages: [...s.packages, createEmptyPackage()] }));
  }, []);

  const removePackage = useCallback((id: string) => {
    setFormState((s) => ({ ...s, packages: s.packages.filter((p) => p.id !== id) }));
  }, []);

  const updateCharge = useCallback((field: keyof ChargesData, value: number) => {
    setFormState((s) => ({ ...s, charges: { ...s.charges, [field]: value } }));
  }, []);

  // Validation
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      // Parties validation
      if (!formState.shipper.name) newErrors["shipper.name"] = "Required";
      if (!formState.shipper.phone) newErrors["shipper.phone"] = "Required";
      if (!formState.shipper.city) newErrors["shipper.city"] = "Required";
      if (!formState.shipper.state) newErrors["shipper.state"] = "Required";

      if (!formState.consignee.name) newErrors["consignee.name"] = "Required";
      if (!formState.consignee.phone) newErrors["consignee.phone"] = "Required";
      if (!formState.consignee.city) newErrors["consignee.city"] = "Required";
      if (!formState.consignee.state) newErrors["consignee.state"] = "Required";
      if (!formState.consignee.pincode) newErrors["consignee.pincode"] = "Required";
    }

    if (step === 1) {
      // Packages validation
      formState.packages.forEach((pkg, i) => {
        if (!pkg.description) newErrors[`pkg${i}Desc`] = "Required";
        if (pkg.weight <= 0) newErrors[`pkg${i}Weight`] = "Required";
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((s) => Math.min(s + 1, WIZARD_STEPS.length - 1));
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const handleBack = () => {
    setCurrentStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      toast.error("Please review the form");
      return;
    }

    setIsSubmitting(true);
    try {
      const input: InvoiceFormInput = {
        transportMode: formState.transportMode,
        serviceLevel: formState.serviceLevel,
        paymentMode: formState.paymentMode,
        shipper: formState.shipper,
        consignee: formState.consignee,
        packages: formState.packages.map((p) => ({
          description: p.description,
          category: p.category,
          quantity: p.quantity,
          weight: p.weight,
          length: p.length || undefined,
          width: p.width || undefined,
          height: p.height || undefined,
          declaredValue: p.declaredValue || undefined,
        })),
        charges: formState.charges,
        specialInstructions: formState.specialInstructions,
        internalNotes: formState.internalNotes,
      };

      const result = await createEnterpriseInvoice(input);

      if (result.success) {
        toast.success(`Invoice ${result.data.invoice_no} created successfully!`);
        onSuccess?.(result.data);
        router.push(`/dashboard/invoices/${result.data.id}`);
      } else {
        toast.error(result.error || "Failed to create invoice");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Parties
        return (
          <div className="space-y-6">
            {/* Service & Payment Mode */}
            <div className="grid grid-cols-3 gap-4">
              <FormField label="Transport Mode">
                <Select
                  value={formState.transportMode}
                  onValueChange={(v) => setFormState((s) => ({ ...s, transportMode: v as FormState["transportMode"] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="air">✈️ Air Freight</SelectItem>
                    <SelectItem value="surface">🚚 Surface</SelectItem>
                    <SelectItem value="express">⚡ Express</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Service Level">
                <Select
                  value={formState.serviceLevel}
                  onValueChange={(v) => setFormState((s) => ({ ...s, serviceLevel: v as ServiceLevel }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SERVICE_LEVEL_CONFIG).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label} - {config.estimatedDays}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Payment Mode">
                <Select
                  value={formState.paymentMode}
                  onValueChange={(v) => setFormState((s) => ({ ...s, paymentMode: v as PaymentMode }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PAYMENT_MODE_CONFIG).map(([key, config]) => (
                      <SelectItem key={key} value={key}>{config.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </div>

            {/* Shipper & Consignee Cards */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <AddressCard
                title="Shipper (Sender)"
                icon={User}
                data={formState.shipper}
                onChange={updateShipper}
                errors={{
                  name: errors["shipper.name"],
                  phone: errors["shipper.phone"],
                  city: errors["shipper.city"],
                  state: errors["shipper.state"],
                }}
                variant="shipper"
              />
              <AddressCard
                title="Consignee (Receiver)"
                icon={MapPin}
                data={formState.consignee}
                onChange={updateConsignee}
                errors={{
                  name: errors["consignee.name"],
                  phone: errors["consignee.phone"],
                  city: errors["consignee.city"],
                  state: errors["consignee.state"],
                  pincode: errors["consignee.pincode"],
                }}
                variant="consignee"
              />
            </div>
          </div>
        );

      case 1: // Shipment
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Package Details</h3>
                <p className="text-sm text-muted-foreground">Add all packages for this shipment</p>
              </div>
              <Button onClick={addPackage} variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Package
              </Button>
            </div>

            <div className="space-y-4">
              {formState.packages.map((pkg, index) => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  index={index}
                  onChange={(field, value) => updatePackage(pkg.id, field, value)}
                  onRemove={() => removePackage(pkg.id)}
                  canRemove={formState.packages.length > 1}
                  errors={errors}
                />
              ))}
            </div>

            {/* Weight Summary */}
            <Card className="bg-info/10 border-info/30">
              <CardContent className="p-4">
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Total Pieces</h4>
                    <p className="text-xl font-bold text-info">
                      {formState.packages.reduce((sum, p) => sum + p.quantity, 0)}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Actual Weight</h4>
                    <p className="text-xl font-bold text-info">
                      {formState.packages.reduce((sum, p) => sum + p.weight * p.quantity, 0).toFixed(2)} kg
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Volumetric Weight</h4>
                    <p className="text-xl font-bold text-info">
                      {formState.packages.reduce((sum, p) => {
                        if (p.length && p.width && p.height) {
                          return sum + ((p.length * p.width * p.height) / 5000) * p.quantity;
                        }
                        return sum;
                      }, 0).toFixed(2)} kg
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Chargeable Weight</h4>
                    <p className="text-2xl font-bold text-info">
                      {Math.max(
                        formState.packages.reduce((sum, p) => sum + p.weight * p.quantity, 0),
                        formState.packages.reduce((sum, p) => {
                          if (p.length && p.width && p.height) {
                            return sum + ((p.length * p.width * p.height) / 5000) * p.quantity;
                          }
                          return sum;
                        }, 0)
                      ).toFixed(2)} kg
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 2: // Charges
        return (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              {/* Freight Charges */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-bold">Freight Charges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <ChargeInput
                      label="Rate per Kg"
                      value={formState.charges.ratePerKg}
                      onChange={(v) => updateCharge("ratePerKg", v)}
                      icon={IndianRupee}
                    />
                    <ChargeInput
                      label="Fuel Surcharge"
                      value={formState.charges.fuelSurchargePercentage}
                      onChange={(v) => updateCharge("fuelSurchargePercentage", v)}
                      icon={Percent}
                      suffix="%"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Service Charges */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-bold">Service Charges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <ChargeInput
                      label="Pickup Charge"
                      value={formState.charges.pickupCharge}
                      onChange={(v) => updateCharge("pickupCharge", v)}
                      icon={IndianRupee}
                    />
                    <ChargeInput
                      label="Delivery Charge"
                      value={formState.charges.deliveryCharge}
                      onChange={(v) => updateCharge("deliveryCharge", v)}
                      icon={IndianRupee}
                    />
                    <ChargeInput
                      label="Packing Charge"
                      value={formState.charges.packingCharge}
                      onChange={(v) => updateCharge("packingCharge", v)}
                      icon={IndianRupee}
                    />
                    <ChargeInput
                      label="Handling Charge"
                      value={formState.charges.handlingCharge}
                      onChange={(v) => updateCharge("handlingCharge", v)}
                      icon={IndianRupee}
                    />
                    <ChargeInput
                      label="Insurance Charge"
                      value={formState.charges.insuranceCharge}
                      onChange={(v) => updateCharge("insuranceCharge", v)}
                      icon={IndianRupee}
                    />
                    <ChargeInput
                      label="Other Charges"
                      value={formState.charges.otherCharges}
                      onChange={(v) => updateCharge("otherCharges", v)}
                      icon={IndianRupee}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Discounts & Advance */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-bold">Discounts & Advance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <ChargeInput
                      label="Discount"
                      value={formState.charges.discountPercentage}
                      onChange={(v) => updateCharge("discountPercentage", v)}
                      icon={Percent}
                      suffix="%"
                    />
                    <ChargeInput
                      label="Advance Paid"
                      value={formState.charges.advancePaid}
                      onChange={(v) => updateCharge("advancePaid", v)}
                      icon={IndianRupee}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Totals Summary */}
            <div>
              <TotalsSummary totals={totals} />
            </div>
          </div>
        );

      case 3: // Review
        return (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              {/* Invoice Header */}
              <Card className="bg-primary/10 border-primary/30">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-primary font-bold">Invoice Number</p>
                      <p className="text-2xl font-bold text-foreground">{invoiceNo}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-primary font-bold">AWB Number</p>
                      <p className="text-lg font-mono font-bold text-primary">{awbNo}</p>
                    </div>
                  </div>
                  <Separator className="my-4 bg-primary/30" />
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-primary">Transport</p>
                      <p className="font-bold capitalize">{formState.transportMode}</p>
                    </div>
                    <div>
                      <p className="text-primary">Service</p>
                      <p className="font-bold capitalize">{formState.serviceLevel}</p>
                    </div>
                    <div>
                      <p className="text-primary">Payment</p>
                      <p className="font-bold capitalize">{formState.paymentMode.replace("_", " ")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Parties Summary */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">From (Shipper)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-bold">{formState.shipper.name}</p>
                    <p className="text-sm text-muted-foreground">{formState.shipper.phone}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formState.shipper.city}, {formState.shipper.state}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">To (Consignee)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-bold">{formState.consignee.name}</p>
                    <p className="text-sm text-muted-foreground">{formState.consignee.phone}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formState.consignee.city}, {formState.consignee.state} - {formState.consignee.pincode}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Packages Summary */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Packages ({formState.packages.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {formState.packages.map((pkg, i) => (
                      <div key={pkg.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div>
                          <p className="font-medium">{pkg.description || `Package ${i + 1}`}</p>
                          <p className="text-xs text-muted-foreground">
                            {pkg.quantity} pcs × {pkg.weight} kg
                            {pkg.length && pkg.width && pkg.height && ` • ${pkg.length}×${pkg.width}×${pkg.height} cm`}
                          </p>
                        </div>
                        <Badge variant="outline">{pkg.category}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Special Instructions */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField label="Special Instructions">
                    <Textarea
                      value={formState.specialInstructions}
                      onChange={(e) => setFormState((s) => ({ ...s, specialInstructions: e.target.value }))}
                      placeholder="Any special handling or delivery instructions..."
                      rows={2}
                    />
                  </FormField>
                  <FormField label="Internal Notes" hint="Not visible to customer">
                    <Textarea
                      value={formState.internalNotes}
                      onChange={(e) => setFormState((s) => ({ ...s, internalNotes: e.target.value }))}
                      placeholder="Internal notes for your team..."
                      rows={2}
                    />
                  </FormField>
                </CardContent>
              </Card>
            </div>

            {/* Final Totals */}
            <div className="space-y-4">
              <TotalsSummary totals={totals} />
              <Alert>
                <Info className="w-4 h-4" />
                <AlertDescription className="text-xs">
                  By creating this invoice, you confirm that all details are accurate. 
                  The invoice will be sent to the consignee upon request.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-muted p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Create Invoice</h1>
            <p className="text-muted-foreground">Step {currentStep + 1} of {WIZARD_STEPS.length}</p>
          </div>
          <Button variant="ghost" onClick={onCancel || (() => router.back())}>
            Cancel
          </Button>
        </div>

        {/* Step Indicator */}
        <StepIndicator
          steps={WIZARD_STEPS}
          currentStep={currentStep}
          onStepClick={setCurrentStep}
        />

        {/* Content */}
        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="pr-4">
            {renderStepContent()}
          </div>
        </ScrollArea>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <div className="flex items-center gap-3">
            {currentStep === WIZARD_STEPS.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Create Invoice
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={handleNext} className="gap-2">
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceFormWizard;
