"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function RevenueMetric() {
    return (

        <Card className="col-span-1 md:col-span-2 h-full border-none shadow-md bg-warning text-warning-foreground overflow-hidden relative">
            <CardContent className="p-6 h-full flex flex-col justify-between relative z-10">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wallet"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" /><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" /></svg>
                        </div>
                        <h3 className="text-xl font-medium tracking-tight">Total revenue</h3>
                    </div>
                    <Select defaultValue="usd">
                        <SelectTrigger className="h-8 text-xs w-auto gap-1 bg-white/20 border-white/20 text-white rounded-full px-3 hover:bg-white/30">
                            <SelectValue placeholder="Currency" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="usd">USD, $</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="mt-8 flex items-end justify-between">
                    <div>
                        <h2 className="text-4xl font-bold tracking-tighter mb-1">$2,456,900</h2>
                        <div className="flex items-center gap-2">
                            <span className="bg-foreground text-background text-[10px] font-bold px-2 py-0.5 rounded-full">+2.5%</span>
                            <span className="text-xs text-white/80 leading-tight block w-20">revenue growth rates</span>
                        </div>
                    </div>

                    {/* Simulated bar chart visualization */}
                    <div className="flex items-end gap-1.5 h-16 pb-1">
                        {[40, 60, 30, 70, 50, 80, 45, 60, 90, 75, 50, 65].map((h, i) => (
                            <div key={i} className="w-1 bg-white/30 rounded-full relative group cursor-pointer hover:bg-white transition-colors" style={{ height: `${h}%` }}>
                                <div className="w-2 h-2 bg-foreground rounded-full absolute -top-1 -left-0.5 opacity-0 group-hover:opacity-100 transition-opacity transform scale-0 group-hover:scale-100" />
                            </div>
                        ))}
                    </div>
                    <div className="absolute top-1/2 right-12 bg-foreground text-background text-xs px-2 py-1 rounded shadow-xl transform -translate-y-4">
                        $87,512
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-foreground transform rotate-45" />
                    </div>
                </div>
            </CardContent>
            {/* Decorative background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-warning/20 rounded-full blur-3xl pointer-events-none transform translate-x-1/2 -translate-y-1/2" />
        </Card>
    );
}
