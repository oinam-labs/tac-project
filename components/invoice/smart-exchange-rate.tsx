
"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export function SmartExchangeRate({ baseCurrency = "USD", targetCurrency = "INR" }: { baseCurrency?: string, targetCurrency?: string }) {
    const [rate, setRate] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchRate = async () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setRate(83.50 + Math.random()); // Randomize slightly for "live" feel
            setLoading(false);
        }, 1500);
    };

    useEffect(() => {
        // Initial fetch on mount
        const controller = new AbortController();
        // eslint-disable-next-line react-hooks/set-state-in-effect -- Initial state setup is intentional
        setLoading(true);
        const timeoutId = setTimeout(() => {
            if (!controller.signal.aborted) {
                setRate(83.50 + Math.random());
                setLoading(false);
            }
        }, 1500);
        return () => {
            controller.abort();
            clearTimeout(timeoutId);
        };
    }, []);

    return (
        <div className="flex items-center gap-2 p-2 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex flex-col">
                <span className="text-[10px] font-bold text-primary/70">Exchange Rate</span>
                <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-primary">
                        1 {baseCurrency} = {rate ? rate.toFixed(2) : "..."} {targetCurrency}
                    </span>
                </div>
            </div>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-full hover:bg-primary/10 text-primary/70"
                            onClick={fetchRate}
                            disabled={loading}
                        >
                            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Refresh live exchange rate</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
}
