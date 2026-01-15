"use client";

import React, { useState, useTransition } from "react";
import { useTheme } from "next-themes";
import {
    User,
    Shield,
    Bell,
    Save,
    Mail,
    Building2,
    Warehouse,
    Palette,
    LogOut,
    CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { PageShell } from "@/components/dashboard/page-shell";
import type { UserRole } from "@/types/database";
import { Badge } from "@/components/ui/badge";

interface Profile {
    id: string;
    email: string;
    full_name: string | null;
    phone: string | null;
    role: UserRole;
    preferences: { theme?: string; notifications?: boolean } | null;
    warehouse_id: string | null;
    organization_id: string | null;
    warehouses: { name: string; code: string } | null;
    organizations: { name: string } | null;
}

interface Warehouse {
    id: string;
    name: string;
    code: string;
}

interface SettingsClientProps {
    profile: Profile | null;
    warehouses: Warehouse[];
}

export function SettingsClient({ profile, warehouses }: SettingsClientProps) {
    const [isPending, startTransition] = useTransition();
    const { setTheme: applyTheme } = useTheme();

    const [formData, setFormData] = useState({
        full_name: profile?.full_name || "",
        phone: profile?.phone || "",
        warehouse_id: profile?.warehouse_id || "",
        notifications: profile?.preferences?.notifications ?? true,
        theme: profile?.preferences?.theme || "system",
    });

    const handleSave = async () => {
        startTransition(async () => {
            const supabase = createClient();

            const { error } = await supabase
                .from("profiles")
                .update({
                    full_name: formData.full_name,
                    phone: formData.phone,
                    warehouse_id: formData.warehouse_id || null,
                    preferences: {
                        theme: formData.theme,
                        notifications: formData.notifications,
                    },
                    updated_at: new Date().toISOString(),
                })
                .eq("id", profile?.id);

            if (error) {
                toast.error("Failed to save settings");
            } else {
                toast.success("Settings saved successfully");
            }
        });
    };

    if (!profile) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center p-8 text-center">
                <User className="w-16 h-16 mb-6 text-muted" />
                <h2 className="text-2xl font-bold text-foreground mb-2">Not Logged In</h2>
                <p className="text-muted-foreground mb-6">Please log in to access your account settings.</p>
                <Button>Go to Login</Button>
            </div>
        );
    }

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <PageShell
            title="Settings"
            description="Manage your personal information, security preferences, and notification settings."
            breadcrumb={["Dashboard", "Settings"]}
            action={
                <Button
                    onClick={handleSave}
                    disabled={isPending}
                    className="rounded-full shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90"
                >
                    {isPending ? (
                        <>Saving...</>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                        </>
                    )}
                </Button>
            }
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Sidebar / Quick User Info */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="overflow-hidden border-border shadow-sm">
                        <div className="h-32 bg-primary/10 relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20" />
                        </div>
                        <CardContent className="pt-0 relative">
                            <div className="flex justify-center -mt-16 mb-4">
                                <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
                                    <AvatarImage src={`https://avatar.vercel.sh/${profile.email}`} />
                                    <AvatarFallback className="text-2xl font-bold bg-muted">
                                        {formData.full_name ? getInitials(formData.full_name) : "?"}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="text-center space-y-1 mb-6">
                                <h3 className="text-xl font-bold text-foreground">
                                    {formData.full_name || "User"}
                                </h3>
                                <p className="text-sm text-muted-foreground">{profile.email}</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-card rounded-md shadow-sm text-muted-foreground">
                                            <Building2 className="w-4 h-4" />
                                        </div>
                                        <div className="text-sm">
                                            <p className="text-xs text-muted-foreground font-medium">Organization</p>
                                            <p className="font-medium text-foreground">{profile.organizations?.name || "—"}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-card rounded-md shadow-sm text-muted-foreground">
                                            <Shield className="w-4 h-4" />
                                        </div>
                                        <div className="text-sm">
                                            <p className="text-xs text-muted-foreground font-medium">Role</p>
                                            <Badge variant="secondary" className="mt-0.5 capitalize font-normal">
                                                {profile.role}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-destructive/20 bg-destructive/5">
                        <CardContent className="p-4 flex items-center justify-between">
                            <span className="text-sm font-medium text-destructive">Sign Out</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => {/* Sign out logic would go here */ }}
                            >
                                <LogOut className="w-4 h-4" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Settings Form */}
                <div className="lg:col-span-8">
                    <Tabs defaultValue="account" className="space-y-6">
                        <TabsList className="bg-muted/50 p-1 rounded-xl w-full justify-start overflow-x-auto">
                            <TabsTrigger value="account" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm gap-2">
                                <User className="w-4 h-4" />
                                General
                            </TabsTrigger>
                            <TabsTrigger value="preferences" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm gap-2">
                                <Palette className="w-4 h-4" />
                                Preferences
                            </TabsTrigger>
                            <TabsTrigger value="notifications" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm gap-2">
                                <Bell className="w-4 h-4" />
                                Notifications
                            </TabsTrigger>
                            <TabsTrigger value="security" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm gap-2">
                                <Shield className="w-4 h-4" />
                                Security
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="account" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Personal Information</CardTitle>
                                    <CardDescription>Update your personal details here.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label>Full Name</Label>
                                            <Input
                                                value={formData.full_name}
                                                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                                                className="bg-muted/50 border-input focus:bg-background transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Phone Number</Label>
                                            <Input
                                                value={formData.phone}
                                                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                                className="bg-muted/50 border-input focus:bg-background transition-colors"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Email Address</Label>
                                        <div className="relative">
                                            <Input
                                                value={profile.email}
                                                disabled
                                                className="bg-muted text-muted-foreground pl-9"
                                            />
                                            <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                                        </div>
                                        <p className="text-[11px] text-muted-foreground">Email cannot be changed manually. Contact support.</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Work Information</CardTitle>
                                    <CardDescription>Warehouse and organization details.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label>Default Warehouse</Label>
                                        <div className="relative">
                                            <select
                                                value={formData.warehouse_id}
                                                onChange={(e) => setFormData(prev => ({ ...prev, warehouse_id: e.target.value }))}
                                                className="w-full h-10 rounded-md border border-input bg-muted/50 pl-9 px-3 py-2 text-sm focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                                            >
                                                <option value="">No default assigned</option>
                                                {warehouses.map((w) => (
                                                    <option key={w.id} value={w.id}>{w.name} ({w.code})</option>
                                                ))}
                                            </select>
                                            <Warehouse className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                                        </div>
                                        <p className="text-[11px] text-muted-foreground">Preferred warehouse for inventory and shipping operations.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="preferences" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Appearance</CardTitle>
                                    <CardDescription>Customize how the dashboard looks on your device.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <Label>Interface Theme</Label>
                                        <div className="grid grid-cols-3 gap-4">
                                            {["light", "dark", "system"].map((theme) => (
                                                <button
                                                    key={theme}
                                                    onClick={() => {
                                                        setFormData(prev => ({ ...prev, theme }));
                                                        applyTheme(theme);
                                                    }}
                                                    className={cn(
                                                        "flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all",
                                                        formData.theme === theme
                                                            ? "border-primary bg-primary/5 text-primary"
                                                            : "border-border bg-card hover:border-primary/50 text-muted-foreground"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "w-full h-20 rounded-lg mb-2 relative overflow-hidden ring-1 ring-border",
                                                        theme === "light" ? "bg-white" :
                                                            theme === "dark" ? "bg-black" : "bg-gradient-to-br from-white to-black"
                                                    )}>
                                                        {/* Mock UI elements */}
                                                        <div className="absolute top-2 left-2 right-2 h-2 rounded bg-current opacity-10" />
                                                        <div className="absolute top-6 left-2 w-8 h-8 rounded bg-current opacity-10" />
                                                        <div className="absolute top-6 left-12 right-2 h-8 rounded bg-current opacity-5" />
                                                    </div>
                                                    <span className="capitalize font-medium text-sm">{theme}</span>
                                                    {formData.theme === theme && (
                                                        <CheckCircle2 className="w-4 h-4 absolute top-2 right-2 text-primary opacity-0" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="notifications" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Notification Channels</CardTitle>
                                    <CardDescription>Choose how you want to be notified.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-0 divide-y divide-border">
                                    <div className="flex items-center justify-between py-4">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-primary/10 text-primary rounded-lg">
                                                <Mail className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">Email Notifications</p>
                                                <p className="text-sm text-muted-foreground">Receive digests and important alerts</p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={formData.notifications}
                                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, notifications: checked }))}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between py-4 opacity-50">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-muted text-muted-foreground rounded-lg">
                                                <Bell className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">Push Notifications</p>
                                                <p className="text-sm text-muted-foreground">Real-time browser alerts (Coming Soon)</p>
                                            </div>
                                        </div>
                                        <Switch disabled />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="security" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Security Preferences</CardTitle>
                                    <CardDescription>Manage your password and authentication methods.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg text-warning text-sm">
                                        <p className="font-medium mb-1">Managed By Organization</p>
                                        <p>Your security settings are currently managed by your organization&apos;s administrator. Please contact them to reset your password or enable 2FA.</p>
                                    </div>
                                    <Button variant="outline" className="w-full justify-between" disabled>
                                        Change Password
                                        <Shield className="w-4 h-4 text-muted-foreground" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </PageShell>
    );
}
