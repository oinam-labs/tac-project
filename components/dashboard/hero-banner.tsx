"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package, TrendingUp } from "lucide-react";

export function HeroBanner() {
  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-card border border-border/50 text-card-foreground shadow-xl dark:shadow-primary/20 min-h-[300px] flex items-center">
      {/* Full Width Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/banner-dashboard.png"
          alt="Logistics Network"
          fill
          className="object-cover object-right"
          priority
        />
        {/* Gradient Overlay for Text Readability - Stronger on left */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/50 to-transparent" />
      </div>

      <div className="relative z-10 w-full p-8 md:p-12">
        <div className="flex flex-col justify-center space-y-6 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-4 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium backdrop-blur-sm border border-primary/20 text-primary">
              <span className="mr-2 flex h-2 w-2 items-center justify-center">
                <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
              System Operational
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-white mb-4">
              Good morning, Team!
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              Your logistics hub is active. You have <span className="font-semibold text-foreground">142 active shipments</span> and <span className="font-semibold text-primary">3 urgent alerts</span> requiring attention.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap gap-4"
          >
            <Button size="lg" className="h-12 px-6 shadow-lg shadow-primary/20 border-0 text-base">
              <Package className="mr-2 h-5 w-5" />
              New Shipment
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-6 border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white backdrop-blur-md text-base">
              View Analytics
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center gap-8 pt-2"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">98.5%</p>
                <p className="text-xs text-primary font-medium">On-time Rate</p>
              </div>
            </div>
            <div className="h-12 w-px bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">+12%</p>
                <p className="text-xs text-primary font-medium">Volume Growth</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
