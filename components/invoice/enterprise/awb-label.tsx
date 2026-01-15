"use client";

import React from "react";
import Barcode from "react-barcode";
// import { QRCodeSVG } from "qrcode.react"; // Reserved for QR code rendering
import { cn } from "@/lib/utils";
import { 
  Plane, 
  Truck, 
  Zap, 
  Package,
  AlertTriangle,
  Snowflake,
  Droplets,
} from "lucide-react";
import type { AWBLabelData } from "@/types/invoice-enterprise";

// =============================================================================
// TYPES
// =============================================================================

interface AWBLabelProps {
  data: AWBLabelData;
  size?: "standard" | "compact";
  className?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const TRANSPORT_ICONS: Record<string, React.ElementType> = {
  air: Plane,
  surface: Truck,
  express: Zap,
  sea: Package,
};

const SERVICE_COLORS: Record<string, string> = {
  express: "bg-destructive",
  priority: "bg-warning",
  standard: "bg-primary",
  economy: "bg-success",
};

// =============================================================================
// SUB COMPONENTS
// =============================================================================

function LabelHeader({ 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  companyName, // Reserved for company branding
  companyLogo,
  awbNo,
  paymentMode,
}: {
  companyName: string;
  companyLogo?: string;
  awbNo: string;
  paymentMode: string;
}) {
  return (
    <div className="flex justify-between items-start border-b-2 border-foreground pb-3">
      {/* Company Logo/Name */}
      <div className="flex items-center gap-2">
        {companyLogo ? (
          // eslint-disable-next-line @next/next/no-img-element -- Print-specific component
          <img src={companyLogo} alt="Logo" className="h-8 w-auto" />
        ) : (
          <div className="flex items-baseline">
            <span className="text-2xl font-bold tracking-tight">TAC</span>
            <span className="w-2 h-2 rounded-full bg-warning ml-0.5"></span>
          </div>
        )}
      </div>

      {/* AWB Number */}
      <div className="text-right">
        <p className="text-[10px] font-medium text-muted-foreground">Air Waybill</p>
        <p className="text-xl font-bold font-mono text-primary">{awbNo}</p>
      </div>

      {/* Payment Badge */}
      <div className={cn(
        "px-3 py-1 rounded-full text-xs font-medium",
        paymentMode.toLowerCase() === "prepaid" 
          ? "bg-success/10 text-success border border-success/30"
          : paymentMode.toLowerCase() === "cod"
          ? "bg-warning/10 text-warning border border-warning/30"
          : "bg-info/10 text-info border border-info/30"
      )}>
        {paymentMode}
      </div>
    </div>
  );
}

function RouteDisplay({
  originCode,
  destinationCode,
  serviceLevel,
  transportMode,
}: {
  originCode: string;
  destinationCode: string;
  serviceLevel: string;
  transportMode: string;
}) {
  const TransportIcon = TRANSPORT_ICONS[transportMode.toLowerCase()] || Package;
  const serviceColor = SERVICE_COLORS[serviceLevel.toLowerCase()] || SERVICE_COLORS.standard;

  return (
    <div className="flex items-center justify-center gap-4 py-4 bg-muted rounded-lg my-3">
      {/* Origin */}
      <div className="text-center">
        <p className="text-3xl font-bold tracking-tight">{originCode}</p>
        <p className="text-xs text-muted-foreground font-medium">Origin</p>
      </div>

      {/* Route Line with Icon */}
      <div className="flex items-center gap-2">
        <div className="w-12 h-0.5 bg-border"></div>
        <div className={cn("p-2 rounded-full text-white", serviceColor)}>
          <TransportIcon className="w-5 h-5" />
        </div>
        <div className="w-12 h-0.5 bg-border"></div>
      </div>

      {/* Destination */}
      <div className="text-center">
        <p className="text-3xl font-bold tracking-tight">{destinationCode}</p>
        <p className="text-xs text-muted-foreground font-medium">Destination</p>
      </div>
    </div>
  );
}

function PartySection({
  title,
  name,
  address,
  phone,
  icon,
}: {
  title: string;
  name: string;
  address: string;
  phone: string;
  icon: "from" | "to";
}) {
  return (
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-2">
        <span className={cn(
          "text-xs font-medium px-2 py-0.5 rounded",
          icon === "from" ? "bg-info/10 text-info" : "bg-success/10 text-success"
        )}>
          {title}
        </span>
      </div>
      <p className="text-sm font-bold text-foreground">{name}</p>
      <p className="text-[10px] text-muted-foreground leading-relaxed mt-1">{address}</p>
      <p className="text-[10px] font-medium text-muted-foreground mt-1">Ph: {phone}</p>
    </div>
  );
}

function ShipmentDetails({
  pieces,
  weight,
  declaredValue,
}: {
  pieces: string;
  weight: string;
  declaredValue?: string;
}) {
  return (
    <div className="grid grid-cols-3 gap-3 py-3 px-4 bg-muted rounded-lg">
      <div className="text-center">
        <p className="text-xs font-medium text-muted-foreground">Pieces</p>
        <p className="text-lg font-bold">{pieces}</p>
      </div>
      <div className="text-center border-x border-border">
        <p className="text-xs font-medium text-muted-foreground">Weight</p>
        <p className="text-lg font-bold">{weight}</p>
      </div>
      <div className="text-center">
        <p className="text-xs font-medium text-muted-foreground">Value</p>
        <p className="text-lg font-bold">{declaredValue || "N/A"}</p>
      </div>
    </div>
  );
}

function SpecialInstructions({ instructions }: { instructions?: string }) {
  if (!instructions) return null;

  return (
    <div className="py-2 px-3 bg-warning/10 border border-warning/30 rounded-lg">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-warning" />
        <span className="text-xs font-bold text-warning">Special Instructions</span>
      </div>
      <p className="text-[10px] text-foreground mt-1">{instructions}</p>
    </div>
  );
}

function HandlingIcons({ instructions }: { instructions?: string }) {
  const icons = [];
  const lower = (instructions || "").toLowerCase();

  if (lower.includes("fragile")) {
    icons.push({ icon: AlertTriangle, label: "Fragile", color: "text-destructive" });
  }
  if (lower.includes("cold") || lower.includes("refrigerat")) {
    icons.push({ icon: Snowflake, label: "Keep Cold", color: "text-info" });
  }
  if (lower.includes("dry") || lower.includes("moisture")) {
    icons.push({ icon: Droplets, label: "Keep Dry", color: "text-info" });
  }

  if (icons.length === 0) return null;

  return (
    <div className="flex gap-3 justify-center py-2">
      {icons.map(({ icon: Icon, label, color }, index) => (
        <div key={index} className="flex flex-col items-center">
          <Icon className={cn("w-6 h-6", color)} />
          <span className="text-[10px] font-medium text-muted-foreground mt-0.5">{label}</span>
        </div>
      ))}
    </div>
  );
}

function BarcodeSection({ awbNo, barcodeData }: { awbNo: string; barcodeData: string }) {
  return (
    <div className="flex flex-col items-center py-4 border-t border-dashed border-border">
      <Barcode
        value={barcodeData || awbNo}
        format="CODE128"
        width={2}
        height={60}
        displayValue={false}
        background="transparent"
      />
      <p className="text-lg font-bold font-mono mt-2">
        {awbNo.replace(/(.{4})/g, "$1 ").trim()}
      </p>
    </div>
  );
}

function LabelFooter({
  stationCode,
  pieceInfo,
  invoiceNo,
  invoiceDate,
}: {
  stationCode: string;
  pieceInfo: string;
  invoiceNo: string;
  invoiceDate: string;
}) {
  return (
    <div className="flex justify-between items-center pt-3 border-t border-border text-[9px]">
      <div className="flex gap-4">
        <span className="text-muted-foreground">
          Station: <span className="font-bold text-foreground">{stationCode}</span>
        </span>
        <span className="text-muted-foreground">
          Piece: <span className="font-bold text-foreground">{pieceInfo}</span>
        </span>
      </div>
      <div className="flex gap-4">
        <span className="text-muted-foreground">
          Inv: <span className="font-bold text-foreground">{invoiceNo}</span>
        </span>
        <span className="text-muted-foreground">
          Date: <span className="font-bold text-foreground">{invoiceDate}</span>
        </span>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function AWBLabel({
  data,
  size = "standard",
  className,
}: AWBLabelProps) {
  const isCompact = size === "compact";

  return (
    <div 
      className={cn(
        "bg-card border-2 border-foreground rounded-lg overflow-hidden font-sans",
        isCompact ? "w-[100mm] p-4" : "w-[150mm] p-6",
        className
      )}
    >
      {/* Header */}
      <LabelHeader
        companyName={data.companyName}
        companyLogo={data.companyLogo}
        awbNo={data.awbNo}
        paymentMode={data.paymentMode}
      />

      {/* Route Display */}
      <RouteDisplay
        originCode={data.originCode}
        destinationCode={data.destinationCode}
        serviceLevel={data.serviceLevel}
        transportMode={data.transportMode}
      />

      {/* Parties */}
      <div className="grid grid-cols-2 gap-4 py-3 border-y border-border">
        <PartySection
          title="Shipper / From"
          name={data.shipperName}
          address={data.shipperAddress}
          phone={data.shipperPhone}
          icon="from"
        />
        <PartySection
          title="Consignee / To"
          name={data.consigneeName}
          address={data.consigneeAddress}
          phone={data.consigneePhone}
          icon="to"
        />
      </div>

      {/* Shipment Details */}
      <div className="py-3">
        <ShipmentDetails
          pieces={data.pieces}
          weight={data.weight}
          declaredValue={data.declaredValue}
        />
      </div>

      {/* Special Instructions */}
      {data.specialInstructions && (
        <div className="py-2">
          <SpecialInstructions instructions={data.specialInstructions} />
        </div>
      )}

      {/* Handling Icons */}
      <HandlingIcons instructions={data.specialInstructions} />

      {/* Barcode */}
      <BarcodeSection awbNo={data.awbNo} barcodeData={data.barcodeData} />

      {/* Footer */}
      <LabelFooter
        stationCode={data.stationCode}
        pieceInfo={data.pieceInfo}
        invoiceNo={data.invoiceNo}
        invoiceDate={data.invoiceDate}
      />
    </div>
  );
}

export default AWBLabel;
