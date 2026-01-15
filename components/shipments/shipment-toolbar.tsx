"use client";

import { RiFilter3Line, RiAddLine } from "@remixicon/react";

export function ShipmentToolbar() {
  return (
    <div className="flex flex-col items-center justify-between gap-4 p-1 sm:flex-row">
      <div className="flex w-full items-center gap-1 rounded-xl border border-border bg-background/20 p-1 backdrop-blur-md sm:w-auto">
        <button className="bg-primary/20 text-primary border-primary/20 flex items-center gap-2 rounded-lg border px-5 py-2 text-xs font-bold whitespace-nowrap shadow-md shadow-primary/20 transition-all">
          <span>All Shipments</span>
          <span className="bg-primary/20 rounded px-1.5 py-0.5 text-[9px] text-primary">
            84
          </span>
        </button>
        <button className="text-foreground-secondary flex items-center gap-2 rounded-lg px-5 py-2 text-xs font-bold whitespace-nowrap transition-all hover:bg-background/10 hover:text-foreground">
          <span>In Transit</span>
          <span className="text-foreground-secondary rounded border border-border bg-background/30 px-1.5 py-0.5 text-[9px]">
            52
          </span>
        </button>
        <button className="text-foreground-secondary rounded-lg px-5 py-2 text-xs font-bold whitespace-nowrap transition-all hover:bg-background/30 hover:text-foreground">
          Pending
        </button>
        <button className="text-foreground-secondary rounded-lg px-5 py-2 text-xs font-bold whitespace-nowrap transition-all hover:bg-background/30 hover:text-foreground">
          Exceptions
        </button>
      </div>

      <div className="flex w-full items-center gap-3 sm:w-auto">
        <button className="text-muted-foreground flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-xs font-bold transition-all hover:border-border hover:bg-muted/50 hover:text-foreground">
          <RiFilter3Line size={14} />
          Filter
        </button>
        <button className="bg-primary hover:bg-primary/90 border-primary flex items-center gap-2 rounded-xl border px-6 py-2.5 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:scale-105 active:scale-95">
          <RiAddLine size={16} />
          Create <span className="hidden sm:inline">Shipment</span>
        </button>
      </div>
    </div>
  );
}
