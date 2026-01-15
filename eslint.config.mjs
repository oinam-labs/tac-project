import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Note: eslint-plugin-tailwindcss is incompatible with Tailwind CSS v4
// and has been removed. The design token rules below still enforce
// semantic color usage.

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Design System Enforcement Rules (warn for now, can be upgraded to error later)
      "no-restricted-syntax": [
        "warn",
        {
          selector: "Literal[value=/bg-\\[(#|rgb|hsl)/]",
          message: "❌ Hardcoded colors are forbidden. Use semantic design tokens: bg-primary, bg-secondary, bg-muted, etc."
        },
        {
          selector: "Literal[value=/text-\\[(#|rgb|hsl)/]",
          message: "❌ Hardcoded text colors are forbidden. Use semantic design tokens: text-foreground, text-muted-foreground, etc."
        },
        {
          selector: "Literal[value=/border-\\[(#|rgb|hsl)/]",
          message: "❌ Hardcoded border colors are forbidden. Use semantic design tokens: border, border-input, etc."
        },
        {
          selector: "Literal[value=/bg-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-/]",
          message: "❌ Tailwind palette colors are forbidden. Use semantic design tokens: bg-primary, bg-secondary, bg-muted, etc."
        },
        {
          selector: "Literal[value=/text-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-/]",
          message: "❌ Tailwind palette text colors are forbidden. Use semantic design tokens: text-foreground, text-muted-foreground, etc."
        },
        {
          selector: "Literal[value=/border-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-/]",
          message: "❌ Tailwind palette border colors are forbidden. Use semantic design tokens: border, border-input, etc."
        },
        {
          selector: "Literal[value=/shadow-\\[/]",
          message: "❌ Arbitrary shadow values are forbidden. Use elevation system: shadow-elevation-1, shadow-elevation-2, etc."
        },
        {
          selector: "Literal[value=/p-\\[|m-\\[|px-\\[|py-\\[|mx-\\[|my-\\[|pt-\\[|pb-\\[|pl-\\[|pr-\\[|mt-\\[|mb-\\[|ml-\\[|mr-\\[/]",
          message: "❌ Arbitrary spacing values are forbidden. Use semantic spacing: p-section, p-group, p-field, or standard Tailwind spacing."
        }
      ]
    }
  },
  // Allow `any` types in specific dashboard components during refactoring
  // These files have complex type relationships that need proper typing later
  {
    files: [
      "**/components/dashboard/**/*.tsx",
      "**/app/**/shipments/**/*.tsx",
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn"
    }
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "dist/**",
    "node_modules/**",
    "next-env.d.ts",
    // Custom ignores:
    "scripts/**",  // CommonJS utility scripts
  ]),
]);

export default eslintConfig;

