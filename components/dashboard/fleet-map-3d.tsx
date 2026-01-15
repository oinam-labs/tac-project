"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { motion } from "framer-motion";
import { Globe, Navigation, Wifi } from "lucide-react";

interface FleetMap3DProps {
    className?: string;
}

export function FleetMap3D({ className }: FleetMap3DProps) {
    return (
        <Card className={cn("overflow-hidden backdrop-blur-sm bg-background/50 border-white/10 shadow-lg group", className)}>
            <CardHeader className="absolute z-20 top-0 left-0 w-full bg-gradient-to-b from-black/60 to-transparent pt-4 px-6 pb-12">
                <CardTitle className="text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-primary" />
                        Global Fleet Tracking
                    </div>
                    <div className="flex items-center gap-2 text-xs font-normal bg-success/20 text-success px-2 py-1 rounded-full backdrop-blur-md border border-success/30">
                        <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                        LIVE
                    </div>
                </CardTitle>
            </CardHeader>

            <CardContent className="p-0 relative h-[300px] w-full bg-muted">
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-transparent to-transparent" />

                <motion.div
                    className="relative h-full w-full"
                    initial={{ rotate: 0 }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.8 }}
                >
                    <Image
                        src="/images/fleet-map.png"
                        alt="Global Fleet Tracking Map"
                        fill
                        className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                    />
                </motion.div>

                {/* Interactive Points (Mock) */}
                {[
                    { top: '30%', left: '20%', delay: 0 },
                    { top: '45%', left: '50%', delay: 1 },
                    { top: '60%', left: '75%', delay: 2 },
                ].map((point, i) => (
                    <div
                        key={i}
                        className="absolute w-3 h-3 z-20"
                        style={{ top: point.top, left: point.left }}
                    >
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" style={{ animationDelay: `${point.delay}s` }}></span>
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-primary border border-white/50"></span>
                    </div>
                ))}

                {/* Overlay Metrics */}
                <div className="absolute bottom-4 right-4 z-20">
                    <div className="bg-black/40 backdrop-blur-md rounded-lg p-3 border border-white/10 flex items-center gap-4">
                        <div className="text-center">
                            <div className="text-xs text-muted-foreground mb-0.5 flex items-center justify-center gap-1">
                                <Navigation className="w-3 h-3" />
                                Active
                            </div>
                            <div className="text-lg font-bold text-white">42</div>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <div className="text-center">
                            <div className="text-xs text-muted-foreground mb-0.5 flex items-center justify-center gap-1">
                                <Wifi className="w-3 h-3" />
                                Signal
                            </div>
                            <div className="text-lg font-bold text-white">100%</div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
