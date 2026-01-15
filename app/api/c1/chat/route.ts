import { NextRequest, NextResponse } from "next/server";
import { c1Client, LOGISTICS_SYSTEM_PROMPT } from "@/lib/c1-client";
import {
    allTools,
    getShipmentsSchema,
    getRevenueSchema,
    getCustomersSchema,
    getExceptionsSchema,
    executeGetShipments,
    executeGetRevenue,
    executeGetCustomers,
    executeGetExceptions,
    executeGetDashboardStats,
} from "@/lib/c1-tools";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

export const runtime = "nodejs";
export const maxDuration = 30;

interface ChatRequest {
    prompt: string;
    history?: ChatCompletionMessageParam[];
}

/**
 * POST /api/c1/chat
 * Handler for C1 Generative UI chat completions
 * Supports tool calling for database queries
 */
export async function POST(req: NextRequest) {
    try {
        const { prompt, history = [] }: ChatRequest = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }

        // Verify Thesys API key is configured
        if (!process.env.THESYS_API_KEY) {
            return NextResponse.json(
                { error: "Thesys API key not configured. Please set THESYS_API_KEY in environment variables." },
                { status: 500 }
            );
        }

        // Build messages array with system prompt, history, and user prompt
        const messages: ChatCompletionMessageParam[] = [
            { role: "system", content: LOGISTICS_SYSTEM_PROMPT },
            ...history,
            { role: "user", content: prompt },
        ];

        // Call C1 API with tool definitions
        const completion = await c1Client.chat.completions.create({
            model: "gpt-4o", // or your preferred C1-supported model
            messages,
            tools: allTools,
            temperature: 0.7,
            max_tokens: 2000,
        });

        const assistantMessage = completion.choices[0].message;

        // Handle tool calls if present
        if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
            // Add assistant message with tool calls to history
            messages.push(assistantMessage);

            // Execute tool calls
            for (const toolCall of assistantMessage.tool_calls) {
                if (toolCall.type !== "function") continue;

                try {
                    let result: string;
                    const args = JSON.parse(toolCall.function.arguments);

                    // Execute the appropriate tool function
                    switch (toolCall.function.name) {
                        case "get_shipments":
                            result = await executeGetShipments(getShipmentsSchema.parse(args));
                            break;
                        case "get_revenue":
                            result = await executeGetRevenue(getRevenueSchema.parse(args));
                            break;
                        case "get_customers":
                            result = await executeGetCustomers(getCustomersSchema.parse(args));
                            break;
                        case "get_exceptions":
                            result = await executeGetExceptions(getExceptionsSchema.parse(args));
                            break;
                        case "get_dashboard_stats":
                            result = await executeGetDashboardStats();
                            break;
                        default:
                            result = JSON.stringify({ error: `Unknown tool: ${toolCall.function.name}` });
                    }

                    // Add tool result to messages
                    messages.push({
                        role: "tool",
                        tool_call_id: toolCall.id,
                        content: result,
                    });
                } catch (error) {
                    console.error(`Error executing tool ${toolCall.function.name}:`, error);
                    messages.push({
                        role: "tool",
                        tool_call_id: toolCall.id,
                        content: JSON.stringify({ error: "Tool execution failed" }),
                    });
                }
            }

            // Make second API call with tool results
            const secondCompletion = await c1Client.chat.completions.create({
                model: "gpt-4o",
                messages,
                temperature: 0.7,
                max_tokens: 2000,
            });

            const finalMessage = secondCompletion.choices[0].message;

            return NextResponse.json({
                content: finalMessage.content,
                role: "assistant",
                usage: secondCompletion.usage,
            });
        }

        // No tool calls, return response directly
        return NextResponse.json({
            content: assistantMessage.content,
            role: "assistant",
            usage: completion.usage,
        });
    } catch (error) {
        console.error("C1 API Error:", error);

        if (error instanceof Error) {
            return NextResponse.json({ error: error.message || "Failed to generate response" }, { status: 500 });
        }

        return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
    }
}
