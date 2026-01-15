"use client";

import { RiCheckboxMultipleLine, RiTimeLine } from "@remixicon/react";

export function ShipmentStats() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-card/50 group flex h-24 flex-col justify-between rounded-2xl border border-border p-4 backdrop-blur-xl transition-all hover:border-primary/30 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/20 text-card-foreground">
        <RiCheckboxMultipleLine size={20} className="mb-2 text-primary" />
        <div>
          <div className="font-mono text-3xl font-bold tracking-tight text-foreground">
            24
          </div>
          <div className="text-muted-foreground text-[9px] font-bold">
            Delivered Today
          </div>
        </div>
      </div>
      <div className="bg-card/50 group hover:border-warning/30 hover:bg-warning/5 flex h-24 flex-col justify-between rounded-2xl border border-border p-4 backdrop-blur-xl transition-all hover:shadow-lg hover:shadow-warning/20 text-card-foreground">
        <RiTimeLine size={20} className="text-warning mb-2" />
        <div>
          <div className="font-mono text-3xl font-bold tracking-tight text-foreground">
            3
          </div>
          <div className="text-muted-foreground text-[9px] font-bold">
            Pending Approval
          </div>
        </div>
      </div>
    </div>
  );
}
