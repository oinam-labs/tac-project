"use client";

import React from "react";
import { Search, BookOpen, MessageCircle, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function V2SupportPage() {
    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="text-center mb-12 mt-8">
                <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">How can we help today?</h1>
                <p className="text-muted-foreground mb-8">Search our knowledge base or get in touch with our team.</p>
                
                <div className="max-w-lg mx-auto relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input 
                        type="text" 
                        placeholder="Search documentation, guides, or ask a question..." 
                        className="pl-10 h-12 bg-background shadow-sm" 
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="hover:shadow-md transition-all cursor-pointer group">
                    <CardContent className="p-6">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                            <BookOpen className="text-primary w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-semibold text-foreground mb-2">Documentation</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Comprehensive guides for API integration, Dashboard usage, and tracking systems.
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-all cursor-pointer group">
                    <CardContent className="p-6">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                            <MessageCircle className="text-primary w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-semibold text-foreground mb-2">Live Chat</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Connect with our support team instantly. Available 24/7 for critical shipment issues.
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-all cursor-pointer group">
                    <CardContent className="p-6">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                            <ShieldCheck className="text-primary w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-semibold text-foreground mb-2">System Status</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Current system uptime: 99.99%. View active incidents and scheduled maintenance.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
