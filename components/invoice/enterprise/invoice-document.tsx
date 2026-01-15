"use client";

import React from "react";
import { QRCodeSVG } from "qrcode.react";
// import { format } from "date-fns"; // Reserved for date formatting
import { cn } from "@/lib/utils";
import { 
  // COMPANY_DEFAULTS, // Reserved for company defaults
  INVOICE_STATUS_CONFIG,
  type InvoiceStatusKey 
} from "@/lib/invoice/design-tokens";
// import { formatCurrency, formatAmountInWords } from "@/lib/invoice/enterprise-calculations"; // Reserved for formatting
import type { PrintableInvoice } from "@/types/invoice-enterprise";

// =============================================================================
// TYPES
// =============================================================================

interface InvoiceDocumentProps {
  invoice: PrintableInvoice;
  variant?: "original" | "duplicate" | "triplicate";
  showWatermark?: boolean;
  className?: string;
}

// =============================================================================
// STYLES
// =============================================================================

const styles = {
  page: "w-[210mm] min-h-[297mm] bg-card mx-auto font-sans text-foreground print:shadow-none",
  header: "border-b-2 border-primary pb-4 mb-6",
  section: "mb-6",
  sectionTitle: "text-xs font-bold text-muted-foreground mb-2 pb-1 border-b border-border",
  label: "text-[10px] font-medium text-muted-foreground",
  value: "text-xs font-semibold text-foreground",
  table: "w-full text-[10px] border-collapse",
  tableHeader: "bg-muted text-muted-foreground font-bold",
  tableCell: "border border-border px-2 py-1.5",
  amountCell: "font-mono text-right",
  totalRow: "bg-muted font-bold",
  grandTotalRow: "bg-primary text-primary-foreground font-bold text-sm",
};

// =============================================================================
// SUB COMPONENTS
// =============================================================================

function CompanyHeader({ companyName, companyGstin, companyAddress, companyContact, logo }: {
  companyName: string;
  companyGstin: string;
  companyAddress: string;
  companyContact: string;
  logo?: string;
}) {
  return (
    <div className="flex justify-between items-start">
      <div className="flex items-start gap-4">
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element -- Print-specific component
          <img src={logo} alt="Company Logo" className="h-16 w-auto" />
        ) : (
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-primary">TAC</span>
            <span className="w-3 h-3 rounded-full bg-warning ml-1"></span>
          </div>
        )}
        <div className="space-y-0.5">
          <h1 className="text-lg font-bold text-foreground">{companyName}</h1>
          <h3 className="text-xs font-semibold text-muted-foreground mb-2">Terms & Conditions</h3>
          <p className="text-[10px] text-muted-foreground">GSTIN: {companyGstin}</p>
          <p className="text-[10px] text-muted-foreground max-w-[250px]">{companyAddress}</p>
          <p className="text-[10px] text-muted-foreground">{companyContact}</p>
        </div>
      </div>
      <div className="text-right">
        <h2 className="text-xl font-bold text-primary">Tax Invoice</h2>
      </div>
    </div>
  );
}

function InvoiceMeta({ invoiceNo, invoiceDate, dueDate, awbNo, placeOfSupply, variant }: {
  invoiceNo: string;
  invoiceDate: string;
  dueDate: string;
  awbNo: string;
  placeOfSupply: string;
  variant: string;
}) {
  return (
    <div className="grid grid-cols-3 gap-4 py-4 border-y border-border bg-muted/50">
      <div>
        <p className={styles.label}>Invoice No.</p>
        <p className="text-sm font-bold text-primary">{invoiceNo}</p>
      </div>
      <div>
        <p className={styles.label}>Invoice Date</p>
        <p className={styles.value}>{invoiceDate}</p>
      </div>
      <div>
        <p className={styles.label}>Due Date</p>
        <p className={styles.value}>{dueDate}</p>
      </div>
      <div>
        <p className={styles.label}>AWB / Tracking No.</p>
        <p className="text-xs font-mono font-semibold">{awbNo}</p>
      </div>
      <div>
        <p className={styles.label}>Place of Supply</p>
        <p className={styles.value}>{placeOfSupply}</p>
      </div>
      <div>
        <p className={styles.label}>Copy Type</p>
        <p className={styles.value}>{variant.charAt(0).toUpperCase() + variant.slice(1)} for Recipient</p>
      </div>
    </div>
  );
}

function PartyDetails({ billing, shipping }: {
  billing: PrintableInvoice["billingDetails"];
  shipping: PrintableInvoice["shippingDetails"];
}) {
  return (
    <div className="grid grid-cols-2 gap-8">
      {/* Billing Details */}
      <div>
        <h3 className={styles.sectionTitle}>Billing Details (Consignor)</h3>
        <div className="space-y-1">
          <p className="text-xs font-bold text-foreground">{billing.name}</p>
          {billing.companyName && (
            <p className="text-[10px] text-muted-foreground">{billing.companyName}</p>
          )}
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            {billing.address.line1}
            {billing.address.line2 && <><br />{billing.address.line2}</>}
            <br />
            {billing.address.city}, {billing.address.state} - {billing.address.pincode}
          </p>
          <p className="text-[10px] text-muted-foreground">Phone: {billing.phone}</p>
          {billing.email && (
            <p className="text-[10px] text-muted-foreground">Email: {billing.email}</p>
          )}
          {billing.gstin && (
            <p className="text-[10px] text-muted-foreground font-medium">GSTIN: {billing.gstin}</p>
          )}
        </div>
      </div>

      {/* Shipping Details */}
      <div>
        <h3 className={styles.sectionTitle}>Shipping Details (Consignee)</h3>
        <div className="space-y-1">
          <p className="text-xs font-bold text-foreground">{shipping.name}</p>
          {shipping.companyName && (
            <p className="text-[10px] text-muted-foreground">{shipping.companyName}</p>
          )}
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            {shipping.address.line1}
            {shipping.address.line2 && <><br />{shipping.address.line2}</>}
            <br />
            {shipping.address.city}, {shipping.address.state} - {shipping.address.pincode}
          </p>
          <p className="text-[10px] text-muted-foreground">Phone: {shipping.phone}</p>
          {shipping.email && (
            <p className="text-[10px] text-muted-foreground">Email: {shipping.email}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function ShipmentInfo({ serviceLevel, transportMode, pieces, weight, paymentMode }: {
  serviceLevel: string;
  transportMode: string;
  pieces: number;
  weight: string;
  paymentMode: string;
}) {
  return (
    <div className="grid grid-cols-5 gap-4 py-3 px-4 bg-primary/10 rounded-lg border border-primary/20">
      <div>
        <p className={styles.label}>Service Level</p>
        <p className={styles.value}>{serviceLevel}</p>
      </div>
      <div>
        <p className={styles.label}>Transport Mode</p>
        <p className={styles.value}>{transportMode}</p>
      </div>
      <div>
        <p className={styles.label}>No. of Pieces</p>
        <p className={styles.value}>{pieces}</p>
      </div>
      <div>
        <p className={styles.label}>Chargeable Weight</p>
        <p className={styles.value}>{weight}</p>
      </div>
      <div>
        <p className={styles.label}>Payment Mode</p>
        <p className={cn(styles.value, "text-primary")}>{paymentMode}</p>
      </div>
    </div>
  );
}

function LineItemsTable({ items, isInterState }: {
  items: PrintableInvoice["items"];
  isInterState: boolean;
}) {
  return (
    <table className={styles.table}>
      <thead>
        <tr className={styles.tableHeader}>
          <th className={cn(styles.tableCell, "w-10 text-center")}>#</th>
          <th className={cn(styles.tableCell, "text-left")}>Description</th>
          <th className={cn(styles.tableCell, "w-20 text-left")}>HSN/SAC</th>
          <th className={cn(styles.tableCell, "w-16 text-center")}>Qty</th>
          <th className={cn(styles.tableCell, "w-20 text-right")}>Rate</th>
          <th className={cn(styles.tableCell, "w-24 text-right")}>Taxable Amt</th>
          {isInterState ? (
            <th className={cn(styles.tableCell, "w-24 text-right")}>IGST</th>
          ) : (
            <>
              <th className={cn(styles.tableCell, "w-20 text-right")}>CGST</th>
              <th className={cn(styles.tableCell, "w-20 text-right")}>SGST</th>
            </>
          )}
          <th className={cn(styles.tableCell, "w-24 text-right")}>Total</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <tr key={index} className="hover:bg-muted">
            <td className={cn(styles.tableCell, "text-center text-muted-foreground")}>{item.srNo}</td>
            <td className={cn(styles.tableCell, "text-left")}>
              <p className="font-medium">{item.description}</p>
            </td>
            <td className={cn(styles.tableCell, "text-left font-mono text-[9px]")}>{item.hsnCode || "-"}</td>
            <td className={cn(styles.tableCell, "text-center")}>{item.quantity}</td>
            <td className={cn(styles.tableCell, styles.amountCell)}>{item.rate}</td>
            <td className={cn(styles.tableCell, styles.amountCell)}>{item.taxableAmount}</td>
            {isInterState ? (
              <td className={cn(styles.tableCell, styles.amountCell)}>{item.igst || "-"}</td>
            ) : (
              <>
                <td className={cn(styles.tableCell, styles.amountCell)}>{item.cgst || "-"}</td>
                <td className={cn(styles.tableCell, styles.amountCell)}>{item.sgst || "-"}</td>
              </>
            )}
            <td className={cn(styles.tableCell, styles.amountCell, "font-semibold")}>{item.total}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TotalsSection({ invoice, isInterState }: {
  invoice: PrintableInvoice;
  isInterState: boolean;
}) {
  return (
    <div className="flex justify-end">
      <div className="w-80 space-y-1">
        <div className="flex justify-between py-1.5 px-3 text-[11px]">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-semibold">{invoice.subtotal}</span>
        </div>
        {isInterState ? (
          <div className="flex justify-between py-1.5 px-3 text-[11px]">
            <span className="text-muted-foreground">IGST (18%)</span>
            <span className="font-semibold">{invoice.igstAmount}</span>
          </div>
        ) : (
          <>
            <div className="flex justify-between py-1.5 px-3 text-[11px]">
              <span className="text-muted-foreground">CGST (9%)</span>
              <span className="font-semibold">{invoice.cgstAmount}</span>
            </div>
            <div className="flex justify-between py-1.5 px-3 text-[11px]">
              <span className="text-muted-foreground">SGST (9%)</span>
              <span className="font-semibold">{invoice.sgstAmount}</span>
            </div>
          </>
        )}
        <div className="flex justify-between py-1.5 px-3 text-[11px] border-t border-border">
          <span className="text-muted-foreground">Total Tax</span>
          <span className="font-semibold">{invoice.totalTax}</span>
        </div>
        <div className="flex justify-between py-2 px-3 text-sm bg-primary text-primary-foreground rounded">
          <span className="font-bold">Grand Total</span>
          <span className="font-bold">{invoice.grandTotal}</span>
        </div>
        {parseFloat(invoice.advancePaid.replace(/[^0-9.-]/g, '')) > 0 && (
          <>
            <div className="flex justify-between py-1.5 px-3 text-[11px] text-success">
              <span>Advance Paid</span>
              <span className="font-semibold">- {invoice.advancePaid}</span>
            </div>
            <div className="flex justify-between py-2 px-3 text-[12px] bg-warning/10 border border-warning/30 rounded">
              <span className="font-bold text-warning">Balance Due</span>
              <span className="font-bold text-warning">{invoice.balanceDue}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function AmountInWords({ amount }: { amount: string }) {
  return (
    <div className="py-2 px-3 bg-muted rounded border border-border">
      <p className={styles.label}>Amount in Words</p>
      <p className="text-[11px] font-medium text-foreground italic">{amount}</p>
    </div>
  );
}

function BankDetails({ bank }: { bank: PrintableInvoice["bankDetails"] }) {
  return (
    <div>
      <h3 className={styles.sectionTitle}>Bank Details</h3>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
        <div>
          <span className="text-muted-foreground">Bank Name: </span>
          <span className="font-medium">{bank.bankName}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Branch: </span>
          <span className="font-medium">{bank.branch}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Account No: </span>
          <span className="font-mono font-medium">{bank.accountNo}</span>
        </div>
        <div>
          <span className="text-muted-foreground">IFSC Code: </span>
          <span className="font-mono font-medium">{bank.ifscCode}</span>
        </div>
      </div>
    </div>
  );
}

function TermsAndConditions({ terms }: { terms: string[] }) {
  return (
    <div>
      <h3 className={styles.sectionTitle}>Terms & Conditions</h3>
      <ol className="text-[8px] text-muted-foreground leading-relaxed space-y-0.5">
        {terms.slice(0, 6).map((term, index) => (
          <li key={index}>{index + 1}. {term}</li>
        ))}
      </ol>
    </div>
  );
}

function SignatureSection({ companyName }: { companyName: string }) {
  return (
    <div className="flex flex-col items-end">
      <p className="text-[10px] text-muted-foreground mb-8">For {companyName}</p>
      <div className="w-40 border-b border-border mb-1"></div>
      <p className="text-[10px] font-medium text-muted-foreground">Authorized Signatory</p>
    </div>
  );
}

function QRCodeSection({ data }: { data: string }) {
  return (
    <div className="flex flex-col items-center">
      <QRCodeSVG value={data} size={80} level="M" />
      <p className="text-[8px] text-muted-foreground mt-1">Scan to verify</p>
    </div>
  );
}

function Watermark({ text, status }: { text?: string; status?: InvoiceStatusKey }) {
  const displayText = text || (status ? INVOICE_STATUS_CONFIG[status]?.label.toUpperCase() : "");
  if (!displayText) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      <span 
        className="text-[100px] font-bold text-muted/30 rotate-[-30deg] select-none whitespace-nowrap"
        style={{ opacity: 0.3 }}
      >
        {displayText}
      </span>
    </div>
  );
}

function PageFooter({ pageInfo, generatedAt }: { pageInfo: string; generatedAt: string }) {
  return (
    <div className="flex justify-between items-center pt-4 border-t border-border text-[8px] text-muted-foreground">
      <span>This is a computer-generated invoice and does not require a physical signature.</span>
      <span>{pageInfo} • Generated: {generatedAt}</span>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function InvoiceDocument({
  invoice,
  variant = "original",
  showWatermark = false,
  className,
}: InvoiceDocumentProps) {
  // Determine if inter-state based on items having IGST
  const isInterState = invoice.items.some(item => item.igst && parseFloat(item.igst.replace(/[^0-9.-]/g, '')) > 0);

  return (
    <div className={cn(styles.page, "relative p-10 shadow-lg print:p-8", className)}>
      {/* Watermark */}
      {showWatermark && invoice.watermark && (
        <Watermark text={invoice.watermark} />
      )}

      {/* Content */}
      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className={styles.header}>
          <CompanyHeader
            companyName={invoice.companyName}
            companyGstin={invoice.companyGstin}
            companyAddress={invoice.companyAddress}
            companyContact={invoice.companyContact}
            logo={invoice.logo}
          />
        </div>

        {/* Invoice Meta */}
        <InvoiceMeta
          invoiceNo={invoice.invoiceNo}
          invoiceDate={invoice.invoiceDate}
          dueDate={invoice.dueDate}
          awbNo={invoice.awbNo}
          placeOfSupply={invoice.placeOfSupply}
          variant={variant}
        />

        {/* Party Details */}
        <div className={styles.section}>
          <PartyDetails
            billing={invoice.billingDetails}
            shipping={invoice.shippingDetails}
          />
        </div>

        {/* Shipment Info */}
        <div className={styles.section}>
          <ShipmentInfo
            serviceLevel={invoice.serviceLevel}
            transportMode={invoice.transportMode}
            pieces={invoice.pieces}
            weight={invoice.weight}
            paymentMode={invoice.paymentMode}
          />
        </div>

        {/* Line Items */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Invoice Details</h3>
          <LineItemsTable items={invoice.items} isInterState={isInterState} />
        </div>

        {/* Totals */}
        <div className={styles.section}>
          <TotalsSection invoice={invoice} isInterState={isInterState} />
        </div>

        {/* Amount in Words */}
        <AmountInWords amount={invoice.amountInWords} />

        {/* Footer Section */}
        <div className="grid grid-cols-3 gap-8 pt-6">
          {/* Bank Details */}
          <BankDetails bank={invoice.bankDetails} />

          {/* Terms */}
          <TermsAndConditions terms={invoice.termsAndConditions} />

          {/* QR Code & Signature */}
          <div className="flex flex-col justify-between">
            {invoice.qrCodeData && <QRCodeSection data={invoice.qrCodeData} />}
            <SignatureSection companyName={invoice.companyName} />
          </div>
        </div>

        {/* Page Footer */}
        <PageFooter
          pageInfo={invoice.pageInfo}
          generatedAt={invoice.generatedAt}
        />
      </div>
    </div>
  );
}

export default InvoiceDocument;
