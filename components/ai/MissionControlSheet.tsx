"use client"

import { useState } from "react"
import { Bot, Sparkles } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { C1Chat } from "@thesysai/genui-sdk"
import "@crayonai/react-ui/styles/index.css"

export function MissionControlSheet() {
    const [open, setOpen] = useState(false)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="default"
                    size="icon"
                    className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl z-50 bg-primary hover:bg-primary/90 transition-all hover:scale-105 border-2 border-white/20"
                >
                    <Sparkles className="h-6 w-6 text-primary-foreground animate-pulse" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[400px] sm:w-[540px] p-0 border-l border-border/50 bg-background/95 backdrop-blur-xl flex flex-col">
                <SheetHeader className="px-6 py-4 border-b border-border/50 shrink-0">
                    <SheetTitle className="flex items-center gap-2 text-primary">
                        <Bot className="h-5 w-5" />
                        Mission Control AI
                    </SheetTitle>
                </SheetHeader>
                <div className="flex-1 min-h-0 relative">

                    <C1Chat
                        apiUrl="/api/ai/chat"
                    />
                </div>
            </SheetContent>
        </Sheet>
    )
}
