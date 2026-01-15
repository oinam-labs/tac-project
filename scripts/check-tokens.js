#!/usr/bin/env node
/**
 * Design Token Compliance Checker
 * Scans TSX/CSS files for hardcoded colors and design token violations.
 * 
 * Usage: node scripts/check-tokens.js
 * Exit code 0 = compliant, 1 = violations found
 */

const fs = require('fs');
const path = require('path');

const SCAN_DIRS = ['app', 'components', 'lib'];
const EXTENSIONS = ['.tsx', '.jsx', '.ts', '.js', '.css'];

// Patterns that indicate design token violations
const VIOLATION_PATTERNS = [
    // Hardcoded hex colors
    { pattern: /#[0-9a-fA-F]{3,8}(?![0-9a-fA-F])/g, name: 'Hardcoded hex color' },
    // rgb/rgba/hsl/hsla functions (but allow in CSS var definitions)
    { pattern: /(?<!var\([^)]*)\b(rgb|rgba|hsl|hsla)\s*\(/g, name: 'Direct color function' },
    // Tailwind arbitrary colors
    { pattern: /\b(bg|text|border|ring|shadow)-\[#[^\]]+\]/g, name: 'Tailwind arbitrary color' },
    // Inline style with color
    { pattern: /style\s*=\s*\{\s*\{[^}]*color\s*:/gi, name: 'Inline style with color' },
    // Tailwind palette colors (comprehensive list)
    { pattern: /\b(bg|text|border|ring|shadow|from|to|via)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}/g, name: 'Tailwind palette color' },
];

// Files/patterns to ignore
const IGNORE_PATTERNS = [
    /node_modules/,
    /\.next/,
    /dist/,
    /\.git/,
    /\.d\.ts$/,
];

let violations = [];
let filesScanned = 0;

function shouldIgnore(filePath) {
    return IGNORE_PATTERNS.some(pattern => pattern.test(filePath));
}

function scanFile(filePath) {
    if (shouldIgnore(filePath)) return;

    const ext = path.extname(filePath);
    if (!EXTENSIONS.includes(ext)) return;

    filesScanned++;
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, lineIndex) => {
        // Skip CSS variable definitions in :root or .dark
        if (line.includes('--') && (line.includes(':root') || line.includes('.dark'))) return;

        VIOLATION_PATTERNS.forEach(({ pattern, name }) => {
            const matches = line.matchAll(pattern);
            for (const match of matches) {
                // Skip if it's inside a CSS variable definition
                if (/^\s*--[\w-]+\s*:/.test(line)) continue;
                // Skip comments
                if (/^\s*(\/\/|\/\*|\*)/.test(line)) continue;

                violations.push({
                    file: filePath,
                    line: lineIndex + 1,
                    column: match.index + 1,
                    type: name,
                    match: match[0],
                });
            }
        });
    });
}

function scanDirectory(dir) {
    if (!fs.existsSync(dir)) return;

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (shouldIgnore(fullPath)) continue;

        if (entry.isDirectory()) {
            scanDirectory(fullPath);
        } else if (entry.isFile()) {
            scanFile(fullPath);
        }
    }
}

// Main execution
console.log('🔍 Design Token Compliance Check');
console.log('================================\n');

SCAN_DIRS.forEach(dir => {
    const fullDir = path.join(process.cwd(), dir);
    scanDirectory(fullDir);
});

console.log(`📁 Scanned ${filesScanned} files\n`);

if (violations.length === 0) {
    console.log('✅ No design token violations found!\n');
    process.exit(0);
} else {
    console.log(`❌ Found ${violations.length} violation(s):\n`);

    // Group by file
    const byFile = {};
    violations.forEach(v => {
        if (!byFile[v.file]) byFile[v.file] = [];
        byFile[v.file].push(v);
    });

    Object.entries(byFile).forEach(([file, fileViolations]) => {
        console.log(`📄 ${file}`);
        fileViolations.forEach(v => {
            console.log(`   Line ${v.line}:${v.column} - ${v.type}: "${v.match}"`);
        });
        console.log('');
    });

    console.log('💡 Fix: Replace hardcoded values with semantic design tokens.');
    console.log('   Examples: bg-primary, text-foreground, border-border, var(--primary)\n');

    process.exit(1);
}
