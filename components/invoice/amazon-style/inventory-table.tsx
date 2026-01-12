"use client";

import React from "react";
import { PackageItem, ShipmentData } from "@/types/invoice-v2";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Package } from "lucide-react";
import { calculateVolumetricWeight } from "@/lib/invoice/generator-v2";
import { Badge } from "@/components/ui/badge";

interface InventoryTableProps {
    items: PackageItem[];
    volumetricFactor: number;
    onUpdate: (items: PackageItem[]) => void;
}

export function InventoryTable({ items, volumetricFactor, onUpdate }: InventoryTableProps) {

    const updateItem = (id: string, field: keyof PackageItem, value: string | number) => {
        const newItems = items.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        );
        onUpdate(newItems);
    };

    const addItem = () => {
        const newItem: PackageItem = {
            id: Math.random().toString(36).substr(2, 9),
            description: "General Merchandise",
            length: 30,
            width: 30,
            height: 30,
            actualWeight: 1
        };
        onUpdate([...items, newItem]);
    };

    const removeItem = (id: string) => {
        onUpdate(items.filter(i => i.id !== id));
    };

    return (
        <div className="border border-muted rounded-xl overflow-hidden shadow-sm bg-white">
            <div className="bg-muted/50 px-6 py-4 border-b border-muted flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Cargo Inventory</h3>
                </div>
                <Button variant="outline" size="sm" onClick={addItem} className="h-8 text-[10px] uppercase font-bold tracking-wider border-muted hover:bg-white hover:text-primary">
                    <Plus className="w-3 h-3 mr-1" /> Add Unit
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50 border-muted hover:bg-muted/50">
                        <TableHead className="w-[40%] text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Description</TableHead>
                        <TableHead className="text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Dims (L/W/H)</TableHead>
                        <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Act. Wt</TableHead>
                        <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Vol. Wt</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map(item => {
                        const volWeight = calculateVolumetricWeight(item.length, item.width, item.height, volumetricFactor);
                        const isVolumetric = volWeight > item.actualWeight;

                        return (
                            <TableRow key={item.id} className="hover:bg-muted/50 border-muted">
                                <TableCell className="py-3">
                                    <Input
                                        value={item.description}
                                        onChange={(e) => updateItem(item.id, "description", e.target.value)}
                                        className="h-8 font-medium border-transparent hover:border-muted focus:border-primary/20 bg-transparent"
                                    />
                                </TableCell>
                                <TableCell className="py-3">
                                    <div className="flex items-center justify-center gap-1">
                                        <Input
                                            type="number"
                                            value={item.length}
                                            onChange={(e) => updateItem(item.id, "length", Number(e.target.value))}
                                            className="h-8 w-12 text-center p-0 text-xs font-bold border-muted"
                                        />
                                        <span className="text-muted">×</span>
                                        <Input
                                            type="number"
                                            value={item.width}
                                            onChange={(e) => updateItem(item.id, "width", Number(e.target.value))}
                                            className="h-8 w-12 text-center p-0 text-xs font-bold border-muted"
                                        />
                                        <span className="text-muted">×</span>
                                        <Input
                                            type="number"
                                            value={item.height}
                                            onChange={(e) => updateItem(item.id, "height", Number(e.target.value))}
                                            className="h-8 w-12 text-center p-0 text-xs font-bold border-muted"
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className="py-3 text-right">
                                    <Input
                                        type="number"
                                        value={item.actualWeight}
                                        onChange={(e) => updateItem(item.id, "actualWeight", Number(e.target.value))}
                                        className="h-8 w-16 text-right ml-auto font-black border-muted"
                                    />
                                </TableCell>
                                <TableCell className="py-3 text-right">
                                    <Badge variant="secondary" className={`font-mono text-[10px] ${isVolumetric ? "bg-warning/10 text-warning-foreground border-warning" : "bg-muted text-muted-foreground"}`}>
                                        {volWeight.toFixed(2)} KG
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-3">
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-muted hover:text-destructive" onClick={() => removeItem(item.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
