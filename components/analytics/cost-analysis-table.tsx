"use client";


export function CostAnalysisTable() {
  const routes = [
    { id: "NY-BOS-01", dist: "340 km", cost: "$1,240" },
    { id: "LA-SF-Express", dist: "610 km", cost: "$2,850" },
    { id: "MIA-ORL-04", dist: "220 km", cost: "$890" },
    { id: "TX-HOU-09", dist: "180 km", cost: "$620" },
  ];

  return (
    <div className="bg-card/50 h-full rounded-[24px] border border-border p-6 backdrop-blur-xl transition-colors hover:border-border/80">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <span className="bg-warning h-1.5 w-1.5 animate-pulse rounded-full" />{" "}
          Route Efficiency
        </h3>
        <button className="text-primary hover:text-primary/80 bg-primary/10 border-primary/20 rounded-full border px-3 py-1 text-xs font-medium transition-colors">
          View Report
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {/* Header */}
        <div className="text-muted-foreground mb-1 grid grid-cols-4 border-b border-border px-3 pb-2 text-xs font-medium">
          <span className="col-span-2">Route ID</span>
          <span className="text-right">Distance</span>
          <span className="text-right">Cost</span>
        </div>

        {/* Rows */}
        {routes.map((route, i) => (
          <div
            key={i}
            className="group grid cursor-pointer grid-cols-4 items-center rounded-xl border border-transparent px-3 py-3 text-sm transition-colors hover:border-border hover:bg-muted/50"
          >
            <div className="col-span-2 flex items-center gap-3">
              <div className="bg-primary/50 group-hover:bg-primary h-1.5 w-1.5 rounded-full transition-all group-hover:shadow-sm group-hover:shadow-primary/50"></div>
              <span className="font-mono text-xs text-white">{route.id}</span>
            </div>
            <div className="text-muted-foreground text-right text-xs">
              {route.dist}
            </div>
            <div className="group-hover:text-primary text-right font-mono text-xs font-bold text-white transition-colors">
              {route.cost}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
