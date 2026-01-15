"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { motion } from "framer-motion";
import { Box, Layers, Archive } from "lucide-react";

interface Container3DVizProps {
    className?: string;
}

export function Container3DViz({ className }: Container3DVizProps) {
    return (
        <Card className={cn("overflow-hidden backdrop-blur-sm bg-background/50 border-white/10 shadow-lg group", className)}>
            <CardHeader className="absolute z-20 top-0 left-0 w-full bg-gradient-to-b from-black/60 to-transparent pt-4 px-6 pb-12">
                <CardTitle className="text-white flex items-center gap-2">
                    <Box className="w-5 h-5 text-primary" />
                    Hub Capacity Visualization
                </CardTitle>
            </CardHeader>

            <CardContent className="p-0 relative h-[300px] w-full bg-muted">
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-transparent to-transparent" />

                <motion.div
                    className="relative h-full w-full"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.8 }}
                >
                    <Image
                        src="/images/container-3d.png"
                        alt="3D Container Visualization"
                        fill
                        className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                    />
                </motion.div>

                {/* Overlay Metrics */}
                <div className="absolute bottom-4 left-4 z-20 flex gap-4">
                    <div className="bg-black/40 backdrop-blur-md rounded-lg p-3 border border-white/10">
                        <div className="flex items-center gap-2 text-xs text-primary-foreground/70 mb-1">
                            <Layers className="w-3 h-3" />
                            <span>Space Utilized</span>
                        </div>
                        <div className="text-xl font-bold text-white">87%</div>
                    </div>
                    <div className="bg-black/40 backdrop-blur-md rounded-lg p-3 border border-white/10">
                        <div className="flex items-center gap-2 text-xs text-success-foreground/70 mb-1">
                            <Archive className="w-3 h-3" />
                            <span>Total Units</span>
                        </div>
                        <div className="text-xl font-bold text-white">1,240</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
