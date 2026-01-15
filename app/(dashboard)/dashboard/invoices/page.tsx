import React from "react";
import { createClient } from "@/lib/supabase/server";
import { InvoicesClient } from "./_components/invoices-client";
import { normalizeJoinSingle } from "@/lib/utils";
import type { InvoiceListItem, InvoiceStatusKey } from "@/types/invoice-enterprise";

async function getInvoices(): Promise<InvoiceListItem[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("invoices")
        .select(`
            id,
            invoice_no,
            type,
            status,
            awb_no,
            consignee_name,
            consignee_city,
            consignee_state,
            subtotal,
            total_tax,
            total_amount,
            paid_amount,
            balance_due,
            invoice_date,
            due_date,
            pdf_url,
            sent_via_email_at,
            sent_via_whatsapp_at,
            created_at,
            customers(id, name, phone, email)
        `)
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(100);

    if (error) {
        console.error("Failed to fetch invoices:", JSON.stringify(error, null, 2));
        return [];
    }

    if (!data) {
        return [];
    }

    return (data || []).map((inv): InvoiceListItem => {
        const customer = normalizeJoinSingle(inv.customers);
        const isOverdue = inv.status === "overdue" ||
            (inv.due_date && new Date(inv.due_date) < new Date() && (inv.balance_due || 0) > 0);

        return {
            id: inv.id,
            invoiceNo: inv.invoice_no,
            awbNo: inv.awb_no || "",
            type: inv.type,
            status: (inv.status || "pending") as InvoiceStatusKey,
            customerName: customer?.name || "Walk-in",
            customerPhone: customer?.phone || "",
            consigneeName: inv.consignee_name || "",
            consigneeCity: inv.consignee_city || "",
            consigneeState: inv.consignee_state || "",
            invoiceDate: inv.invoice_date,
            dueDate: inv.due_date,
            totalAmount: inv.total_amount || 0,
            paidAmount: inv.paid_amount || 0,
            balanceDue: inv.balance_due || 0,
            isOverdue,
            hasPdf: !!inv.pdf_url,
            wasSent: !!(inv.sent_via_email_at || inv.sent_via_whatsapp_at),
        };
    });
}

export default async function InvoicesPage() {
    const invoices = await getInvoices();

    return (
        <div className="max-w-[1600px] mx-auto pb-20">
            <InvoicesClient invoices={invoices} />
        </div>
    );
}
