"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import {
  calculateInvoiceTotals,
  calculatePackageWeights,
  calculateDueDate,
  // validateGSTIN, // Reserved for GSTIN validation
  // formatAmountInWords, // Reserved for amount formatting
} from "@/lib/invoice/enterprise-calculations";
import {
  generateInvoiceNumber,
  generateAWBNumber,
} from "@/lib/invoice/id-generator";
import { TAX_CONFIG, COMPANY_DEFAULTS } from "@/lib/invoice/design-tokens";
import type {
  InvoiceFormInput,
  InvoiceListResponse,
  InvoiceStatusKey,
} from "@/types/invoice-enterprise";

// Validation schemas
const packageSchema = z.object({
  description: z.string().min(1, "Description required"),
  category: z.string().optional(),
  quantity: z.number().min(1).default(1),
  weight: z.number().min(0.01, "Weight must be greater than 0"),
  length: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  declaredValue: z.number().optional(),
});

const addressSchema = z.object({
  name: z.string().min(1, "Name required"),
  phone: z.string().min(7, "Valid phone required"),
  email: z.string().email().optional().or(z.literal("")),
  gstin: z.string().optional(),
  address: z.string().optional(),
  city: z.string().min(1, "City required"),
  state: z.string().min(1, "State required"),
  pincode: z.string().min(1, "Pincode required"),
});

const chargesSchema = z.object({
  ratePerKg: z.number().min(0).default(0),
  fuelSurchargePercentage: z.number().min(0).default(15),
  pickupCharge: z.number().min(0).default(0),
  deliveryCharge: z.number().min(0).default(0),
  packingCharge: z.number().min(0).default(0),
  insuranceCharge: z.number().min(0).default(0),
  handlingCharge: z.number().min(0).default(0),
  otherCharges: z.number().min(0).default(0),
  discountPercentage: z.number().min(0).max(100).default(0),
  advancePaid: z.number().min(0).default(0),
});

const createInvoiceSchema = z.object({
  transportMode: z.enum(["air", "surface", "express"]),
  serviceLevel: z.enum(["express", "priority", "economy", "standard"]).default("standard"),
  paymentMode: z.enum(["prepaid", "cod", "credit", "to_pay"]).default("prepaid"),
  shipper: addressSchema,
  consignee: addressSchema,
  packages: z.array(packageSchema).min(1, "At least one package required"),
  charges: chargesSchema,
  templateId: z.string().uuid().optional(),
  specialInstructions: z.string().optional(),
  internalNotes: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

async function getAuthContext() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id, role")
    .eq("id", user.id)
    .single();

  return {
    userId: user.id,
    organizationId: profile?.organization_id,
    role: profile?.role || "user",
  };
}

export async function createEnterpriseInvoice(
  input: InvoiceFormInput
): Promise<ActionResult<{ id: string; invoice_no: string; awb_no: string }>> {
  try {
    const auth = await getAuthContext();
    if (!auth) {
      return { success: false, error: "Unauthorized" };
    }

    const validated = createInvoiceSchema.safeParse(input);
    if (!validated.success) {
      const firstError = validated.error.issues[0];
      return { success: false, error: firstError?.message || "Validation failed" };
    }

    const data = validated.data;
    const supabase = await createClient();

    // Generate IDs
    const invoiceNo = generateInvoiceNumber();
    const awbNo = generateAWBNumber();

    // Calculate weights
    const packageItems = data.packages.map((pkg, idx) => ({
      id: `pkg-${idx}`,
      description: pkg.description,
      category: pkg.category,
      quantity: pkg.quantity,
      actualWeight: pkg.weight,
      dimensions: pkg.length && pkg.width && pkg.height
        ? { length: pkg.length, width: pkg.width, height: pkg.height }
        : undefined,
      declaredValue: pkg.declaredValue,
    }));

    const weights = calculatePackageWeights(packageItems, data.serviceLevel);

    // Calculate totals
    const totals = calculateInvoiceTotals(
      packageItems,
      data.charges.ratePerKg,
      data.shipper.state,
      data.consignee.state,
      data.serviceLevel,
      {
        fuelSurchargePercentage: data.charges.fuelSurchargePercentage,
        pickupCharge: data.charges.pickupCharge,
        deliveryCharge: data.charges.deliveryCharge,
        packingCharge: data.charges.packingCharge,
        insuranceCharge: data.charges.insuranceCharge,
        handlingCharge: data.charges.handlingCharge,
        otherCharges: data.charges.otherCharges,
        discountPercentage: data.charges.discountPercentage,
        advancePaid: data.charges.advancePaid,
      }
    );

    // Calculate due date
    const invoiceDate = new Date();
    const dueDate = calculateDueDate(invoiceDate, 14);

    // Insert invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .insert({
        invoice_no: invoiceNo,
        awb_no: awbNo,
        type: "customer",
        status: "pending",
        organization_id: auth.organizationId,
        created_by: auth.userId,
        
        // Dates
        invoice_date: invoiceDate.toISOString(),
        due_date: dueDate.toISOString(),
        
        // Shipper
        shipper_name: data.shipper.name,
        shipper_phone: data.shipper.phone,
        shipper_address: data.shipper.address,
        shipper_gstin: data.shipper.gstin,
        
        // Consignee
        consignee_name: data.consignee.name,
        consignee_phone: data.consignee.phone,
        consignee_email: data.consignee.email,
        consignee_address: data.consignee.address,
        consignee_city: data.consignee.city,
        consignee_state: data.consignee.state,
        consignee_pincode: data.consignee.pincode,
        
        // Service
        service_level: data.serviceLevel,
        transport_mode: data.transportMode,
        payment_method: data.paymentMode,
        
        // Weights
        total_pieces: weights.totalPieces,
        actual_weight: weights.totalActualWeight,
        volumetric_weight: weights.totalVolumetricWeight,
        chargeable_weight: weights.chargeableWeight,
        
        // Charges
        base_freight_charge: totals.charges.baseFreightCharge,
        fuel_surcharge: totals.charges.fuelSurcharge,
        fuel_surcharge_percentage: totals.charges.fuelSurchargePercentage,
        pickup_charge: totals.charges.pickupCharge,
        delivery_charge: totals.charges.deliveryCharge,
        packing_charge: totals.charges.packingCharge,
        handling_charge: totals.charges.handlingCharge,
        insurance_charge: totals.charges.insuranceCharge,
        other_charges: totals.charges.otherCharges,
        
        // Tax
        subtotal: totals.tax.subtotal,
        cgst: totals.tax.cgst,
        sgst: totals.tax.sgst,
        igst: totals.tax.igst,
        total_tax: totals.tax.totalTax,
        place_of_supply: data.consignee.state,
        hsn_sac_code: TAX_CONFIG.HSN_CODES.FREIGHT_SERVICES,
        
        // Totals
        total_amount: totals.grandTotal,
        paid_amount: totals.advancePaid,
        balance_due: totals.balanceDue,
        
        // Optional
        special_instructions: data.specialInstructions,
        internal_notes: data.internalNotes,
        tags: data.tags,
      })
      .select("id, invoice_no, awb_no")
      .single();

    if (invoiceError) {
      console.error("Invoice creation error:", invoiceError);
      return { success: false, error: "Failed to create invoice" };
    }

    // Insert packages
    const packageInserts = data.packages.map((pkg, index) => ({
      invoice_id: invoice.id,
      package_no: index + 1,
      description: pkg.description,
      quantity: pkg.quantity,
      actual_weight: pkg.weight,
      length: pkg.length,
      width: pkg.width,
      height: pkg.height,
      declared_value: pkg.declaredValue,
    }));

    const { error: packagesError } = await supabase
      .from("packages")
      .insert(packageInserts);

    if (packagesError) {
      console.error("Packages error:", packagesError);
    }

    // Create audit log entry
    await supabase.from("invoice_audit_log").insert({
      invoice_id: invoice.id,
      action: "created",
      performed_by: auth.userId,
      metadata: { source: "enterprise_form" },
    });

    revalidatePath("/dashboard/invoices");

    return {
      success: true,
      data: {
        id: invoice.id,
        invoice_no: invoice.invoice_no,
        awb_no: invoice.awb_no,
      },
    };
  } catch (error) {
    console.error("Create invoice error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getInvoiceList(
  filters?: {
    search?: string;
    status?: InvoiceStatusKey[];
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    pageSize?: number;
  }
): Promise<ActionResult<InvoiceListResponse>> {
  try {
    const auth = await getAuthContext();
    if (!auth) {
      return { success: false, error: "Unauthorized" };
    }

    const supabase = await createClient();
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 50;
    const offset = (page - 1) * pageSize;

    let query = supabase
      .from("invoices")
      .select(`
        id,
        invoice_no,
        awb_no,
        type,
        status,
        consignee_name,
        consignee_city,
        consignee_state,
        invoice_date,
        due_date,
        total_amount,
        paid_amount,
        balance_due,
        pdf_url,
        sent_via_email_at,
        sent_via_whatsapp_at,
        customers(name, phone)
      `, { count: "exact" })
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .range(offset, offset + pageSize - 1);

    // Apply filters
    if (filters?.search) {
      const search = `%${filters.search}%`;
      query = query.or(`invoice_no.ilike.${search},awb_no.ilike.${search},consignee_name.ilike.${search}`);
    }

    if (filters?.status && filters.status.length > 0) {
      query = query.in("status", filters.status);
    }

    if (filters?.dateFrom) {
      query = query.gte("invoice_date", filters.dateFrom);
    }

    if (filters?.dateTo) {
      query = query.lte("invoice_date", filters.dateTo);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("List invoices error:", error);
      return { success: false, error: "Failed to fetch invoices" };
    }

    // Get stats
    const { data: statsData } = await supabase
      .from("invoices")
      .select("status, total_amount, paid_amount, balance_due")
      .is("deleted_at", null);

    const stats = {
      total: statsData?.length || 0,
      draft: statsData?.filter(i => i.status === "draft").length || 0,
      pending: statsData?.filter(i => i.status === "pending").length || 0,
      paid: statsData?.filter(i => i.status === "paid").length || 0,
      partial: statsData?.filter(i => i.status === "partial").length || 0,
      overdue: statsData?.filter(i => i.status === "overdue").length || 0,
      cancelled: statsData?.filter(i => i.status === "cancelled").length || 0,
      totalAmount: statsData?.reduce((sum, i) => sum + (i.total_amount || 0), 0) || 0,
      paidAmount: statsData?.reduce((sum, i) => sum + (i.paid_amount || 0), 0) || 0,
      outstandingAmount: statsData?.reduce((sum, i) => sum + (i.balance_due || 0), 0) || 0,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Database response has dynamic structure
const invoices: InvoiceListResponse["invoices"] = (data || []).map((inv: any) => ({
      id: inv.id,
      invoiceNo: inv.invoice_no,
      awbNo: inv.awb_no || "",
      type: inv.type,
      status: inv.status as InvoiceStatusKey,
      customerName: inv.customers?.name || COMPANY_DEFAULTS.shortName,
      customerPhone: inv.customers?.phone || "",
      consigneeName: inv.consignee_name || "",
      consigneeCity: inv.consignee_city || "",
      consigneeState: inv.consignee_state || "",
      invoiceDate: inv.invoice_date,
      dueDate: inv.due_date,
      totalAmount: inv.total_amount || 0,
      paidAmount: inv.paid_amount || 0,
      balanceDue: inv.balance_due || 0,
      isOverdue: inv.status === "overdue" || (inv.due_date && new Date(inv.due_date) < new Date() && inv.balance_due > 0),
      hasPdf: !!inv.pdf_url,
      wasSent: !!(inv.sent_via_email_at || inv.sent_via_whatsapp_at),
    }));

    return {
      success: true,
      data: {
        invoices,
        total: count || 0,
        page,
        pageSize,
        stats,
      },
    };
  } catch (error) {
    console.error("Get invoice list error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function recordPayment(
  invoiceId: string,
  payment: {
    amount: number;
    paymentMethod: string;
    referenceNo?: string;
    notes?: string;
  }
): Promise<ActionResult<{ paymentId: string; newBalance: number }>> {
  try {
    const auth = await getAuthContext();
    if (!auth) {
      return { success: false, error: "Unauthorized" };
    }

    const supabase = await createClient();

    // Get current invoice
    const { data: invoice, error: fetchError } = await supabase
      .from("invoices")
      .select("id, total_amount, paid_amount, balance_due, status")
      .eq("id", invoiceId)
      .single();

    if (fetchError || !invoice) {
      return { success: false, error: "Invoice not found" };
    }

    if (payment.amount > invoice.balance_due) {
      return { success: false, error: "Payment amount exceeds balance due" };
    }

    // Insert payment record
    const { data: paymentRecord, error: paymentError } = await supabase
      .from("invoice_payments")
      .insert({
        invoice_id: invoiceId,
        amount: payment.amount,
        payment_method: payment.paymentMethod,
        reference_no: payment.referenceNo,
        notes: payment.notes,
        recorded_by: auth.userId,
      })
      .select("id")
      .single();

    if (paymentError) {
      console.error("Payment error:", paymentError);
      return { success: false, error: "Failed to record payment" };
    }

    // Audit log
    await supabase.from("invoice_audit_log").insert({
      invoice_id: invoiceId,
      action: "payment_recorded",
      performed_by: auth.userId,
      metadata: { 
        amount: payment.amount, 
        method: payment.paymentMethod,
        reference: payment.referenceNo,
      },
    });

    revalidatePath("/dashboard/invoices");
    revalidatePath(`/dashboard/invoices/${invoiceId}`);

    return {
      success: true,
      data: {
        paymentId: paymentRecord.id,
        newBalance: invoice.balance_due - payment.amount,
      },
    };
  } catch (error) {
    console.error("Record payment error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function updateInvoiceStatus(
  invoiceId: string,
  newStatus: InvoiceStatusKey,
  reason?: string
): Promise<ActionResult<{ status: InvoiceStatusKey }>> {
  try {
    const auth = await getAuthContext();
    if (!auth) {
      return { success: false, error: "Unauthorized" };
    }

    const supabase = await createClient();

    // Get current status
    const { data: invoice, error: fetchError } = await supabase
      .from("invoices")
      .select("id, status")
      .eq("id", invoiceId)
      .single();

    if (fetchError || !invoice) {
      return { success: false, error: "Invoice not found" };
    }

    const oldStatus = invoice.status;

    // Update status
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Dynamic update data structure
const updateData: Record<string, any> = { status: newStatus };
    
    if (newStatus === "cancelled") {
      updateData.cancelled_by = auth.userId;
      updateData.cancelled_at = new Date().toISOString();
      updateData.cancellation_reason = reason;
    }

    const { error: updateError } = await supabase
      .from("invoices")
      .update(updateData)
      .eq("id", invoiceId);

    if (updateError) {
      console.error("Status update error:", updateError);
      return { success: false, error: "Failed to update status" };
    }

    // Audit log
    await supabase.from("invoice_audit_log").insert({
      invoice_id: invoiceId,
      action: "status_changed",
      field_changed: "status",
      old_value: oldStatus,
      new_value: newStatus,
      performed_by: auth.userId,
      metadata: reason ? { reason } : undefined,
    });

    revalidatePath("/dashboard/invoices");
    revalidatePath(`/dashboard/invoices/${invoiceId}`);

    return { success: true, data: { status: newStatus } };
  } catch (error) {
    console.error("Update status error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getInvoiceDetail(
  invoiceId: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Invoice detail has dynamic structure
): Promise<ActionResult<any>> {
  try {
    const auth = await getAuthContext();
    if (!auth) {
      return { success: false, error: "Unauthorized" };
    }

    const supabase = await createClient();

    // Get invoice with relations
    const { data: invoice, error } = await supabase
      .from("invoices")
      .select(`
        *,
        customers(id, name, phone, email),
        packages(*)
      `)
      .eq("id", invoiceId)
      .single();

    if (error || !invoice) {
      return { success: false, error: "Invoice not found" };
    }

    // Get payments
    const { data: payments } = await supabase
      .from("invoice_payments")
      .select("*")
      .eq("invoice_id", invoiceId)
      .order("payment_date", { ascending: false });

    // Get audit log
    const { data: auditLog } = await supabase
      .from("invoice_audit_log")
      .select("*")
      .eq("invoice_id", invoiceId)
      .order("performed_at", { ascending: false })
      .limit(50);

    // Record view
    await supabase.from("invoice_audit_log").insert({
      invoice_id: invoiceId,
      action: "viewed",
      performed_by: auth.userId,
    });

    await supabase
      .from("invoices")
      .update({ last_viewed_at: new Date().toISOString() })
      .eq("id", invoiceId);

    return {
      success: true,
      data: {
        invoice,
        payments: payments || [],
        auditLog: auditLog || [],
      },
    };
  } catch (error) {
    console.error("Get invoice detail error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
