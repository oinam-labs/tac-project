import { OpenAI } from "openai";
import { NextResponse } from "next/server";

import { tools, get_shipment_stats, search_shipments, get_anomalies } from "./tools";

const client = new OpenAI({
    apiKey: process.env.THESYS_API_KEY,
    baseURL: "https://api.thesys.dev/v1/embed",
});

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        // 1. Initial Call to AI
        const response = await client.chat.completions.create({
            model: "google/gemini-2.0-flash-001",
            messages: [
                {
                    role: "system",
                    content: `You are the Tac-Cargo Mission Control AI. 
          Your goal is to assist logistics managers by visualizing data and performing operations.
          
          You have access to tools to fetch real-time data.
          ALWAYS use tools when asked about specific shipments or stats.
          Do not hallucinate data.
          
          When the user asks for a summary, use 'get_shipment_stats' and present it clearly.
          When the user searches, use 'search_shipments' and show the results in a list or table.
          `
                },
                ...messages
            ],
            tools: tools,
            tool_choice: "auto",
        });

        const message = response.choices[0].message;

        // 2. Handle Tool Calls
        const toolCalls = message.tool_calls;

        if (toolCalls) {
            const toolMessages: unknown[] = [message];

            for (const toolCall of toolCalls) {
                if (toolCall.type !== "function") continue;

                const functionCall = toolCall.function;
                const functionName = functionCall.name;
                const args = JSON.parse(functionCall.arguments);

                let result;
                if (functionName === "get_shipment_stats") {
                    result = await get_shipment_stats();
                } else if (functionName === "search_shipments") {
                    result = await search_shipments(args);
                } else if (functionName === "get_anomalies") {
                    result = await get_anomalies();
                }

                toolMessages.push({
                    role: "tool",
                    content: JSON.stringify(result),
                    tool_call_id: toolCall.id,
                });
            }

            // 3. Follow-up Call with Tool Results
            const toolResponse = await client.chat.completions.create({
                model: "google/gemini-2.0-flash-001",
                messages: [
                    {
                        role: "system",
                        content: "You are the Tac-Cargo Mission Control AI. Use the provided tool outputs to answer the user request."
                    },
                    ...messages,
                    ...toolMessages
                ]
            });

            return NextResponse.json(toolResponse.choices[0].message);
        }

        // Return initial response if no tools were called
        return NextResponse.json(message);

    } catch (error: unknown) {
        console.error("AI Error:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
