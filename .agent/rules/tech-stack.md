# Tech Stack & Architecture

This file defines the core technology stack and architecture for the `tac-cargo` project.

## Core Stack
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, OKLCH color space
- **Database**: Supabase (PostgreSQL)
- **State Management**: React Server Components (Server State), TanStack Query (Client State), Zustand (Global Client State - avoid if possible)
- **Validation**: Zod
- **Forms**: React Hook Form

## Architecture Guidelines
- **RSC-First**: Default to React Server Components. Use `"use client"` only when necessary (interactivity, hooks, browser APIs).
- **Server Actions**: Use Server Actions for all data mutations.
- **Client Components**: Keep them leaf nodes where possible.
- **API Routes**: Avoid unless Server Actions are technically insufficient (e.g., external webhooks).

## Directory Structure
- `/app`: App Router pages and layouts.
- `/components`: Reusable UI components.
- `/lib`: Utility functions, database clients, shared logic.
- `/hooks`: Custom React hooks.
- `/types`: Shared TypeScript definitions.
- `/supabase`: Database migrations and types.
