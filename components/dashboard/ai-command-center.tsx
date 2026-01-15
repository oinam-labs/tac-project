"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, Sparkles, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

interface AICommandCenterProps {
    className?: string;
    placeholder?: string;
}

/**
 * AI Command Center Component
 * Conversational interface for querying logistics data using C1 Generative UI
 */
export function AICommandCenter({ className, placeholder }: AICommandCenterProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Example prompts to show users what they can ask
    const examplePrompts = [
        "Show me dashboard statistics",
        "List all in-transit shipments",
        "What's my total revenue this month?",
        "Show me open exceptions",
        "Find customers with recent activity",
    ];

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            role: "user",
            content: input,
            timestamp: new Date(),
        };

        // Add user message to chat
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);
        setError(null);

        try {
            // Call C1 API
            const response = await fetch("/api/c1/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: input,
                    history: messages.map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to get response");
            }

            const data = await response.json();

            const assistantMessage: Message = {
                role: "assistant",
                content: data.content || "I couldn't generate a response. Please try again.",
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (err) {
            console.error("AI Command Center Error:", err);
            setError(err instanceof Error ? err.message : "An error occurred");

            // Add error message to chat
            const errorMessage: Message = {
                role: "assistant",
                content: `Sorry, I encountered an error: ${err instanceof Error ? err.message : "Unknown error"}. Please try again.`,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExampleClick = (prompt: string) => {
        setInput(prompt);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <Card className={cn("flex flex-col h-[600px]", className)}>
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b bg-gradient-to-r from-primary/5 to-primary/10">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                    <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h3 className="font-semibold">AI Command Center</h3>
                    <p className="text-sm text-muted-foreground">Ask me anything about your logistics operations</p>
                </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary/10">
                            <Bot className="w-8 h-8 text-primary" />
                        </div>
                        <h4 className="mb-2 text-lg font-semibold">Welcome to AI Command Center</h4>
                        <p className="mb-6 text-sm text-muted-foreground max-w-md">
                            Ask questions about shipments, revenue, customers, and more. I&apos;ll fetch live data and generate insights for you.
                        </p>

                        {/* Example Prompts */}
                        <div className="space-y-2 w-full max-w-md">
                            <p className="text-xs font-medium text-muted-foreground mb-2">Try asking:</p>
                            {examplePrompts.map((prompt, idx) => (
                                <Button
                                    key={idx}
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-start text-left h-auto py-2 px-3"
                                    onClick={() => handleExampleClick(prompt)}
                                >
                                    <Sparkles className="w-3 h-3 mr-2 flex-shrink-0" />
                                    <span className="text-sm">{prompt}</span>
                                </Button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((message, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "flex gap-3",
                                    message.role === "user" ? "justify-end" : "justify-start"
                                )}
                            >
                                {message.role === "assistant" && (
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 flex-shrink-0">
                                        <Bot className="w-4 h-4 text-primary" />
                                    </div>
                                )}

                                <div
                                    className={cn(
                                        "rounded-lg px-4 py-2 max-w-[80%]",
                                        message.role === "user"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted"
                                    )}
                                >
                                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                    <p className="text-xs opacity-70 mt-1">
                                        {message.timestamp.toLocaleTimeString()}
                                    </p>
                                </div>

                                {message.role === "user" && (
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary flex-shrink-0">
                                        <User className="w-4 h-4 text-primary-foreground" />
                                    </div>
                                )}
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex gap-3">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                                    <Bot className="w-4 h-4 text-primary" />
                                </div>
                                <div className="bg-muted rounded-lg px-4 py-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </ScrollArea>

            {/* Error Display */}
            {error && (
                <div className="px-4 py-2 bg-destructive/10 border-t border-destructive/20">
                    <p className="text-sm text-destructive">{error}</p>
                </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t bg-background">
                <div className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={placeholder || "Ask about shipments, revenue, customers..."}
                        disabled={isLoading}
                        className="flex-1"
                    />
                    <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()} size="icon">
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                    Press Enter to send, Shift+Enter for new line
                </p>
            </div>
        </Card>
    );
}
