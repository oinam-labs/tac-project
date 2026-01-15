"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, TrendingUp } from "lucide-react";

interface Customer {
    id: string;
    name: string;
    revenue: number;
    shipments: number;
    trend: number;
    avatar?: string;
}

// Mock data - in real app, this would be passed as props
const TOP_CUSTOMERS: Customer[] = [
    { id: "1", name: "Acme Corp", revenue: 125000, shipments: 142, trend: 12, avatar: "/avatars/01.png" },
    { id: "2", name: "Global Logistics", revenue: 98000, shipments: 89, trend: 5, avatar: "/avatars/02.png" },
    { id: "3", name: "TechGiant Inc", revenue: 85400, shipments: 76, trend: -2, avatar: "/avatars/03.png" },
    { id: "4", name: "Retail Solutions", revenue: 62000, shipments: 54, trend: 8, avatar: "/avatars/04.png" },
];

export function TopCustomersWidget() {
    const maxRevenue = Math.max(...TOP_CUSTOMERS.map(c => c.revenue));

    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Top Customers
                </CardTitle>
                <span className="text-xs text-muted-foreground">By Revenue (YTD)</span>
            </CardHeader>
            <CardContent className="space-y-6">
                {TOP_CUSTOMERS.map((customer) => (
                    <div key={customer.id} className="group">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8 border-2 border-background">
                                    <AvatarImage src={customer.avatar} />
                                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                        {customer.name.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                                        {customer.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        {customer.shipments} shipments
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-bold">₹{(customer.revenue / 1000).toFixed(1)}k</div>
                                <div className={`text-xs flex items-center justify-end gap-1 ${customer.trend >= 0 ? 'text-success' : 'text-destructive'}`}>
                                    {customer.trend >= 0 ? '+' : ''}{customer.trend}%
                                    {customer.trend > 0 && <TrendingUp className="w-3 h-3" />}
                                </div>
                            </div>
                        </div>
                        {/* Progress Bar */}
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${(customer.revenue / maxRevenue) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
