"use client";

import React from "react";
import { Frown, Meh, Smile, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export default function V2FeedbackPage() {
    const [rating, setRating] = React.useState<"bad" | "okay" | "good" | null>(null);

    return (
        <div className="max-w-xl mx-auto pb-20 mt-10">
            <Card className="border-border shadow-sm">
                <CardHeader className="text-center pb-2">
                    <CardTitle className="text-2xl">How is your experience?</CardTitle>
                    <CardDescription>
                        We value your feedback to improve TAC Cargo Command.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pt-6">
                    <div className="flex justify-center gap-6">
                        <button 
                            onClick={() => setRating("bad")}
                            className={cn(
                                "flex flex-col items-center gap-3 group transition-all p-4 rounded-xl border border-transparent hover:bg-muted",
                                rating === "bad" && "bg-destructive/10 border-destructive/20"
                            )}
                        >
                            <div className={cn(
                                "w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all bg-card shadow-sm",
                                rating === "bad" 
                                    ? "border-destructive text-destructive scale-110" 
                                    : "border-border text-muted-foreground group-hover:border-destructive/50 group-hover:text-destructive group-hover:-translate-y-1"
                            )}>
                                <Frown className="w-8 h-8" />
                            </div>
                            <span className={cn(
                                "text-xs font-medium transition-colors",
                                rating === "bad" ? "text-destructive" : "text-muted-foreground group-hover:text-destructive"
                            )}>Bad</span>
                        </button>

                        <button 
                            onClick={() => setRating("okay")}
                            className={cn(
                                "flex flex-col items-center gap-3 group transition-all p-4 rounded-xl border border-transparent hover:bg-muted",
                                rating === "okay" && "bg-warning/10 border-warning/20"
                            )}
                        >
                            <div className={cn(
                                "w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all bg-card shadow-sm",
                                rating === "okay"
                                    ? "border-warning text-warning scale-110"
                                    : "border-border text-muted-foreground group-hover:border-warning/50 group-hover:text-warning group-hover:-translate-y-1"
                            )}>
                                <Meh className="w-8 h-8" />
                            </div>
                            <span className={cn(
                                "text-xs font-medium transition-colors",
                                rating === "okay" ? "text-warning" : "text-muted-foreground group-hover:text-warning"
                            )}>Okay</span>
                        </button>

                        <button 
                            onClick={() => setRating("good")}
                            className={cn(
                                "flex flex-col items-center gap-3 group transition-all p-4 rounded-xl border border-transparent hover:bg-muted",
                                rating === "good" && "bg-success/10 border-success/20"
                            )}
                        >
                            <div className={cn(
                                "w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all bg-card shadow-sm",
                                rating === "good"
                                    ? "border-success text-success scale-110"
                                    : "border-border text-muted-foreground group-hover:border-success/50 group-hover:text-success group-hover:-translate-y-1"
                            )}>
                                <Smile className="w-8 h-8" />
                            </div>
                            <span className={cn(
                                "text-xs font-medium transition-colors",
                                rating === "good" ? "text-success" : "text-muted-foreground group-hover:text-success"
                            )}>Good</span>
                        </button>
                    </div>

                    <div className="space-y-4">
                        <Textarea 
                            placeholder="Tell us more about your experience..." 
                            className="min-h-[120px] resize-none text-base"
                        />
                        <Button className="w-full h-11 gap-2 text-base">
                            <Send className="w-4 h-4" />
                            Send Feedback
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
