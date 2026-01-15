---
name: supabase-migration
description: Create and manage Supabase database migrations, tables, and RLS policies. Use when the user asks to "create a table", "modify database", "add schema", or "change RLS".
allowed-tools:
  - Read
  - Write
  - RunCommand
  - ListDir
  - Grep
---

# Supabase Migration

This skill helps you create and manage Supabase database migrations safely and consistently.

## Instructions

1.  **Create Migration File**
    - **ALWAYS** use the helper script to create a new migration file. This ensures the correct timestamp format (`YYYYMMDDHHMMSS_name.sql`).
    - Run:
      ```bash
      node .agent/skills/supabase-migration/scripts/create_migration.js <name_of_migration>
      ```
    - Example: `node .agent/skills/supabase-migration/scripts/create_migration.js create_users_table`

2.  **Edit Migration File**
    - The script will output the path to the newly created file.
    - Open the file and write your SQL.
    - **CRITICAL**: If creating a table, **ALWAYS** enable Row Level Security (RLS) and add policies.
      ```sql
      create table "public"."items" (
        "id" uuid not null default gen_random_uuid(),
        "created_at" timestamp with time zone not null default now(),
        "name" text not null,
        primary key ("id")
      );

      alter table "public"."items" enable row level security;

      create policy "Enable read access for all users"
      on "public"."items"
      as permissive
      for select
      to public
      using (true);
      ```

3.  **Apply Migration**
    - In Development:
      - If Supabase CLI is active: `npx supabase db push`
      - If not: Instruct the user to run the SQL content in their Supabase Dashboard SQL Editor.

## Best Practices
- **Idempotency**: Use `create table if not exists`, `do $$ begin ... exception end $$;` blocks where possible to make migrations replayable.
- **Naming**: Use snake_case for tables and columns.
- **Foreign Keys**: Always define foreign keys for relationships.
