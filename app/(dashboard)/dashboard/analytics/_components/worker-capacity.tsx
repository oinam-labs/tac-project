"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const WORKERS = [
    { name: "John S.", avatar: "/avatars/john.jpg", hours: 34, capacity: 85 },
    { name: "Maria J.", avatar: "/avatars/maria.jpg", hours: 36.8, capacity: 92 },
];

export function WorkerCapacity() {
    return (
        <Card className="h-full border-border/50 shadow-sm bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold text-foreground">Worker capacity</CardTitle>
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
                    View All <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                {WORKERS.map((worker, i) => (
                    <div key={i} className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8 border-2 border-background shadow-sm">
                                    <AvatarImage src={worker.avatar} />
                                    <AvatarFallback className="bg-muted text-muted-foreground font-medium text-xs">
                                        {worker.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="font-semibold text-sm text-foreground">{worker.name}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                                Productivity Hours: <span className="font-medium text-foreground">{worker.hours}</span>
                            </span>
                        </div>
                        <div className="relative pt-1">
                            <Progress value={worker.capacity} className="h-2 bg-muted" />
                            <div className="flex justify-end mt-1">
                                <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full font-bold">
                                    {worker.capacity}%
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
