/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const name = args[0];

if (!name) {
    console.error('Error: Please provide a migration name (e.g., "create_users_table").');
    process.exit(1);
}

// Generate timestamp YYYYMMDDHHMMSS
const now = new Date();
const timestamp = now.toISOString().replace(/[-T:.Z]/g, '').slice(0, 14);

const filename = `${timestamp}_${name}.sql`;
// Assuming this script is run from project root, and migrations are in supabase/migrations
const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
const filePath = path.join(migrationsDir, filename);

// Ensure directory exists
if (!fs.existsSync(migrationsDir)) {
    console.log(`Creating migrations directory: ${migrationsDir}`);
    fs.mkdirSync(migrationsDir, { recursive: true });
}

// Create empty file
fs.writeFileSync(filePath, `-- Migration: ${name}\n-- Created at: ${now.toISOString()}\n\n`);

console.log(`Migration file created: ${filePath}`);
