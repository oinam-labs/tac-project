"use client";

import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Plus,
  Plane,
  Truck,
  Zap,
  Info,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { StepIndicator } from "./step-indicator";
import { AddressCard } from "./address-card";
import { PackageCard } from "./package-card";
import { ChargesSection } from "./charges-section";
import { TotalsSummary } from "./totals-summary";

import {
  SERVICE_LEVEL_CONFIG,
  PAYMENT_MODE_CONFIG,
  type ServiceLevel,
  type PaymentMode,
} from "@/lib/invoice/design-tokens";
import {
  calculateInvoiceTotals,
} from "@/lib/invoice/enterprise-calculations";
import {
  generateInvoiceNumber,
  generateAWBNumber,
} from "@/lib/invoice/id-generator";
import { createEnterpriseInvoice } from "@/app/actions/invoice-enterprise";
import { getRecentCustomers } from "@/app/actions/customer-autocomplete";

import type {
  WizardStep,
  InvoiceFormState,
  AddressData,
  PackageData,
  ChargesData,
  WeightSummary,
  ChargeSummary,
  InvoiceWizardProps,
  CustomerSuggestion,
} from "./types";

// =============================================================================
// CONSTANTS
// =============================================================================

const DRAFT_STORAGE_KEY = "invoice-wizard-draft";
const DRAFT_SAVE_DELAY = 1000; // ms

const WIZARD_STEPS: WizardStep[] = [
  { id: "parties", title: "Parties", description: "Shipper & Consignee", icon: "parties" },
  { id: "shipment", title: "Shipment", description: "Package Details", icon: "shipment" },
  { id: "charges", title: "Charges", description: "Pricing & Fees", icon: "charges" },
  { id: "review", title: "Review", description: "Confirm & Create", icon: "review" },
];

const TRANSPORT_MODES = [
  { value: "air", label: "Air Freight", icon: Plane, description: "Fastest delivery" },
  { value: "surface", label: "Surface", icon: Truck, description: "Economical option" },
  { value: "express", label: "Express", icon: Zap, description: "Priority handling" },
];

// =============================================================================
// INITIAL STATE HELPERS
// =============================================================================

function createEmptyAddress(): AddressData {
  return {
    name: "",
    phone: "",
    email: "",
    gstin: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  };
}

function createEmptyPackage(): PackageData {
  return {
    id: `pkg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    description: "",
    category: "general",
    quantity: 1,
    weight: 0,
    length: 0,
    width: 0,
    height: 0,
    declaredValue: 0,
  };
}

function createInitialCharges(): ChargesData {
  return {
    ratePerKg: 0,
    fuelSurchargePercentage: 15,
    pickupCharge: 0,
    deliveryCharge: 0,
    packingCharge: 0,
    insuranceCharge: 0,
    handlingCharge: 0,
    otherCharges: 0,
    discountPercentage: 0,
    advancePaid: 0,
  };
}

function createInitialState(): InvoiceFormState {
  return {
    transportMode: "air",
    serviceLevel: "standard",
    paymentMode: "prepaid",
    shipper: createEmptyAddress(),
    consignee: createEmptyAddress(),
    packages: [createEmptyPackage()],
    charges: createInitialCharges(),
    specialInstructions: "",
    internalNotes: "",
  };
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function InvoiceWizard({ onSuccess, onCancel }: InvoiceWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formState, setFormState] = useState<InvoiceFormState>(createInitialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invoiceNo, setInvoiceNo] = useState("");
  const [awbNo, setAwbNo] = useState("");
  const [recentCustomers, setRecentCustomers] = useState<CustomerSuggestion[]>([]);
  const draftSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load draft from localStorage on mount
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed.formState && parsed.timestamp) {
          const hoursSinceSave = (Date.now() - parsed.timestamp) / (1000 * 60 * 60);
          if (hoursSinceSave < 24) {
            setFormState(parsed.formState);
            setCurrentStep(parsed.currentStep || 0);
            toast.info("Draft restored from previous session");
          } else {
            localStorage.removeItem(DRAFT_STORAGE_KEY);
          }
        }
      }
    } catch (e) {
      console.error("Failed to restore draft:", e);
    }
  }, []);

  // Auto-save draft to localStorage
  useEffect(() => {
    if (draftSaveTimeoutRef.current) {
      clearTimeout(draftSaveTimeoutRef.current);
    }
    draftSaveTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({
          formState,
          currentStep,
          timestamp: Date.now(),
        }));
      } catch (e) {
        console.error("Failed to save draft:", e);
      }
    }, DRAFT_SAVE_DELAY);

    return () => {
      if (draftSaveTimeoutRef.current) {
        clearTimeout(draftSaveTimeoutRef.current);
      }
    };
  }, [formState, currentStep]);

  // Fetch recent customers for autocomplete
  useEffect(() => {
    async function loadCustomers() {
      const result = await getRecentCustomers(10);
      if (result.success) {
        setRecentCustomers(result.data);
      }
    }
    loadCustomers();
  }, []);

  // Generate IDs on mount
  useEffect(() => {
    setInvoiceNo(generateInvoiceNumber());
    setAwbNo(generateAWBNumber());
  }, []);

  // Keyboard navigation refs (to avoid stale closures)
  const validateStepRef = useRef<(step: number) => boolean>(() => true);
  const handleSubmitRef = useRef<() => void>(() => { });

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === "ArrowRight" && currentStep < WIZARD_STEPS.length - 1) {
        e.preventDefault();
        if (validateStepRef.current(currentStep)) {
          setCurrentStep((s) => s + 1);
        }
      } else if (e.key === "ArrowLeft" && currentStep > 0) {
        e.preventDefault();
        setCurrentStep((s) => s - 1);
      } else if (e.key === "Enter" && e.ctrlKey && currentStep === WIZARD_STEPS.length - 1) {
        e.preventDefault();
        handleSubmitRef.current();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep]);

  // Clear draft after successful submission
  const clearDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  }, []);

  // Calculate weights
  const weights = useMemo<WeightSummary>(() => {
    const totalPieces = formState.packages.reduce((sum, p) => sum + p.quantity, 0);
    const actualWeight = formState.packages.reduce((sum, p) => sum + p.weight * p.quantity, 0);
    const volumetricWeight = formState.packages.reduce((sum, p) => {
      if (p.length && p.width && p.height) {
        return sum + ((p.length * p.width * p.height) / 5000) * p.quantity;
      }
      return sum;
    }, 0);
    const chargeableWeight = Math.max(actualWeight, volumetricWeight);

    return { totalPieces, actualWeight, volumetricWeight, chargeableWeight };
  }, [formState.packages]);

  // Calculate charges
  const charges = useMemo<ChargeSummary>(() => {
    const packageItems = formState.packages.map((pkg) => ({
      id: pkg.id,
      description: pkg.description,
      quantity: pkg.quantity,
      actualWeight: pkg.weight,
      dimensions: pkg.length && pkg.width && pkg.height
        ? { length: pkg.length, width: pkg.width, height: pkg.height }
        : undefined,
      declaredValue: pkg.declaredValue,
    }));

    const totals = calculateInvoiceTotals(
      packageItems,
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

    return {
      baseFreight: totals.charges.baseFreightCharge,
      fuelSurcharge: totals.charges.fuelSurcharge,
      serviceCharges: totals.charges.pickupCharge + totals.charges.deliveryCharge +
        totals.charges.packingCharge + totals.charges.handlingCharge +
        totals.charges.insuranceCharge + totals.charges.otherCharges,
      discount: totals.charges.discountAmount,
      subtotal: totals.tax.subtotal,
      cgst: totals.tax.cgst,
      sgst: totals.tax.sgst,
      igst: totals.tax.igst,
      totalTax: totals.tax.totalTax,
      grandTotal: totals.grandTotal,
      advancePaid: totals.advancePaid,
      balanceDue: totals.balanceDue,
      isInterState: totals.tax.isInterState,
    };
  }, [formState]);

  // Update handlers
  const updateShipper = useCallback((field: keyof AddressData, value: string) => {
    setFormState((s) => ({ ...s, shipper: { ...s.shipper, [field]: value } }));
    setErrors((e) => ({ ...e, [`shipper.${field}`]: "" }));
  }, []);

  const updateConsignee = useCallback((field: keyof AddressData, value: string) => {
    setFormState((s) => ({ ...s, consignee: { ...s.consignee, [field]: value } }));
    setErrors((e) => ({ ...e, [`consignee.${field}`]: "" }));
  }, []);

  const updatePackage = useCallback((id: string, field: keyof PackageData, value: string | number) => {
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
  const validateStep = useCallback((step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (!formState.shipper.name) newErrors["shipper.name"] = "Shipper name is required";
      if (!formState.shipper.phone) newErrors["shipper.phone"] = "Phone is required";
      if (!formState.shipper.city) newErrors["shipper.city"] = "City is required";
      if (!formState.shipper.state) newErrors["shipper.state"] = "State is required";

      if (!formState.consignee.name) newErrors["consignee.name"] = "Consignee name is required";
      if (!formState.consignee.phone) newErrors["consignee.phone"] = "Phone is required";
      if (!formState.consignee.city) newErrors["consignee.city"] = "City is required";
      if (!formState.consignee.state) newErrors["consignee.state"] = "State is required";
      if (!formState.consignee.pincode) newErrors["consignee.pincode"] = "Pincode is required";
    }

    if (step === 1) {
      formState.packages.forEach((pkg, i) => {
        if (!pkg.description) newErrors[`pkg${i}Desc`] = "Description required";
        if (pkg.weight <= 0) newErrors[`pkg${i}Weight`] = "Weight must be > 0";
      });
    }

    if (step === 2) {
      if (formState.charges.ratePerKg <= 0) newErrors["ratePerKg"] = "Rate must be > 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formState]);

  // Update refs for keyboard navigation
  useEffect(() => {
    validateStepRef.current = validateStep;
  }, [validateStep]);

  const handleNext = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep((s) => Math.min(s + 1, WIZARD_STEPS.length - 1));
    } else {
      toast.error("Please fill in all required fields");
    }
  }, [currentStep, validateStep]);

  const handleBack = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 0));
  }, []);

  const handleStepClick = useCallback((stepIndex: number) => {
    if (stepIndex < currentStep) {
      setCurrentStep(stepIndex);
    } else if (stepIndex === currentStep + 1) {
      handleNext();
    }
  }, [currentStep, handleNext]);

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      toast.error("Please review the form");
      return;
    }

    setIsSubmitting(true);
    try {
      const input = {
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
        clearDraft();
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

  // Update handleSubmit ref for keyboard navigation
  useEffect(() => {
    handleSubmitRef.current = handleSubmit;
  });

  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  }, [onCancel, router]);

  // ==========================================================================
  // RENDER STEP CONTENT
  // ==========================================================================

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Parties
        return (
          <motion.div
            key="parties"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Transport & Service Mode */}
            <Card className="border-border/60 shadow-sm">
              <CardContent className="p-6">
                <div className="grid grid-cols-12 gap-6">
                  {/* Transport Mode - Col Span 6 */}
                  <div className="col-span-12 lg:col-span-6 space-y-3">
                    <Label className="text-sm font-medium text-muted-foreground/90">Transport Mode</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {TRANSPORT_MODES.map((mode) => {
                        const Icon = mode.icon;
                        const isSelected = formState.transportMode === mode.value;
                        return (
                          <button
                            key={mode.value}
                            type="button"
                            onClick={() => setFormState((s) => ({ ...s, transportMode: mode.value as InvoiceFormState["transportMode"] }))}
                            className={cn(
                              "flex flex-col items-center justify-center gap-2 p-3 rounded-lg border transition-all duration-200",
                              isSelected
                                ? "border-primary bg-primary/5 text-primary shadow-sm"
                                : "border-border/60 hover:border-primary/30 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                          >
                            <Icon className="w-5 h-5" />
                            <span className="text-xs font-medium">{mode.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Service Level - Col Span 3 */}
                  <div className="col-span-12 md:col-span-6 lg:col-span-3 space-y-3">
                    <Label className="text-sm font-medium text-muted-foreground/90">Service Level</Label>
                    <Select
                      value={formState.serviceLevel}
                      onValueChange={(v) => setFormState((s) => ({ ...s, serviceLevel: v as ServiceLevel }))}
                    >
                      <SelectTrigger className="h-[58px] rounded-lg border-border/60">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(SERVICE_LEVEL_CONFIG).map(([key, config]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex flex-col gap-0.5 items-start py-0.5">
                              <span className="font-medium text-sm">{config.label}</span>
                              <Badge variant="secondary" className="text-[10px] h-4 px-1">{config.estimatedDays}</Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Payment Mode - Col Span 3 */}
                  <div className="col-span-12 md:col-span-6 lg:col-span-3 space-y-3">
                    <Label className="text-sm font-medium text-muted-foreground/90">Payment Mode</Label>
                    <Select
                      value={formState.paymentMode}
                      onValueChange={(v) => setFormState((s) => ({ ...s, paymentMode: v as PaymentMode }))}
                    >
                      <SelectTrigger className="h-[58px] rounded-lg border-border/60">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PAYMENT_MODE_CONFIG).map(([key, config]) => (
                          <SelectItem key={key} value={key}>
                            <span className="text-sm font-medium">{config.label}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address Cards */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <AddressCard
                title="Shipper (Sender)"
                variant="shipper"
                data={formState.shipper}
                onChange={updateShipper}
                recentCustomers={recentCustomers}
                errors={{
                  name: errors["shipper.name"],
                  phone: errors["shipper.phone"],
                  city: errors["shipper.city"],
                  state: errors["shipper.state"],
                }}
              />
              <AddressCard
                title="Consignee (Receiver)"
                variant="consignee"
                data={formState.consignee}
                onChange={updateConsignee}
                recentCustomers={recentCustomers}
                errors={{
                  name: errors["consignee.name"],
                  phone: errors["consignee.phone"],
                  city: errors["consignee.city"],
                  state: errors["consignee.state"],
                  pincode: errors["consignee.pincode"],
                }}
              />
            </div>
          </motion.div>
        );

      case 1: // Shipment
        return (
          <motion.div
            key="shipment"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Package Details</h3>
                <p className="text-sm text-muted-foreground">Add all packages for this shipment</p>
              </div>
              <Button onClick={addPackage} variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Package
              </Button>
            </div>

            {/* Package Cards */}
            <AnimatePresence mode="popLayout">
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
            </AnimatePresence>

            {/* Weight Summary */}
            <TotalsSummary weights={weights} charges={charges} />
          </motion.div>
        );

      case 2: // Charges
        return (
          <motion.div
            key="charges"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 xl:grid-cols-3 gap-6"
          >
            <div className="xl:col-span-2">
              <ChargesSection
                charges={formState.charges}
                onChange={updateCharge}
              />
            </div>
            <div>
              <TotalsSummary
                weights={weights}
                charges={charges}
                invoiceNo={invoiceNo}
                awbNo={awbNo}
              />
            </div>
          </motion.div>
        );

      case 3: // Review
        return (
          <motion.div
            key="review"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 xl:grid-cols-3 gap-6"
          >
            <div className="xl:col-span-2 space-y-6">
              {/* Invoice Header */}
              <Card className="bg-gradient-to-br from-primary/5 via-primary/10 to-transparent border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge variant="outline" className="mb-2">Invoice Preview</Badge>
                      <h2 className="text-2xl font-bold font-mono">{invoiceNo}</h2>
                      <p className="text-sm text-muted-foreground mt-1">AWB: {awbNo}</p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-primary/10 text-primary border-primary/20 mb-2">
                        {SERVICE_LEVEL_CONFIG[formState.serviceLevel]?.label}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        {formState.transportMode.charAt(0).toUpperCase() + formState.transportMode.slice(1)} • {PAYMENT_MODE_CONFIG[formState.paymentMode]?.label}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Party Summary */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">From (Shipper)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold">{formState.shipper.name}</p>
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
                    <p className="font-semibold">{formState.consignee.name}</p>
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
                  <CardTitle className="text-sm text-muted-foreground flex items-center justify-between">
                    <span>Packages ({formState.packages.length})</span>
                    <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)}>
                      Edit
                    </Button>
                  </CardTitle>
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

              {/* Additional Info */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Special Instructions</Label>
                    <Textarea
                      value={formState.specialInstructions}
                      onChange={(e) => setFormState((s) => ({ ...s, specialInstructions: e.target.value }))}
                      placeholder="Any special handling or delivery instructions..."
                      rows={2}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Internal Notes (not visible to customer)</Label>
                    <Textarea
                      value={formState.internalNotes}
                      onChange={(e) => setFormState((s) => ({ ...s, internalNotes: e.target.value }))}
                      placeholder="Internal notes for your team..."
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              <Alert>
                <Info className="w-4 h-4" />
                <AlertDescription className="text-xs">
                  By creating this invoice, you confirm that all details are accurate.
                  The invoice will be sent to the consignee upon request.
                </AlertDescription>
              </Alert>
            </div>

            {/* Final Totals */}
            <div>
              <TotalsSummary
                weights={weights}
                charges={charges}
                invoiceNo={invoiceNo}
                awbNo={awbNo}
              />
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  // ==========================================================================
  // MAIN RENDER
  // ==========================================================================

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground tracking-tight">Create Invoice</h1>
            <p className="text-muted-foreground text-xs">
              Step {currentStep + 1} of {WIZARD_STEPS.length} — {WIZARD_STEPS[currentStep].title}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancel}
            className="rounded-full hover:bg-muted/50"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Step Indicator */}
        <StepIndicator
          steps={WIZARD_STEPS}
          currentStep={currentStep}
          onStepClick={handleStepClick}
          className="mb-4"
        />

        {/* Content */}
        <div className="pb-8">
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>
        </div>

        {/* Navigation - Sticky at bottom */}
        <div className="sticky bottom-0 bg-background/80 backdrop-blur-md border-t z-10">
          <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="gap-2 pl-0 hover:bg-transparent hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <div className="flex items-center gap-3">
              {currentStep === WIZARD_STEPS.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="gap-2 min-w-[140px] shadow-lg shadow-primary/20"
                  size="default"
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
                <Button onClick={handleNext} className="gap-2 shadow-lg shadow-primary/20" size="default">
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceWizard;
