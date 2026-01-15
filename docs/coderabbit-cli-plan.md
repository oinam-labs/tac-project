# CodeRabbit CLI Integration Plan for TAC Cargo

## Executive Summary

This plan implements CodeRabbit CLI for AI-powered code review integrated directly into the development workflow. The CLI approach is chosen over GitHub App integration because:

1. **Immediate feedback** – Review code locally before pushing
2. **Agent integration** – Works seamlessly with Cursor/Windsurf AI assistants
3. **Autonomous workflows** – AI can code, review, and fix issues in a loop
4. **No PR noise** – Catch issues before they reach the PR stage

---

## Architecture Overview

```text
┌─────────────────────────────────────────────────────────────────┐
│                    Developer Workflow                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   1. Write Code (Manual or AI Agent)                            │
│          ↓                                                      │
│   2. Run CodeRabbit CLI Review                                  │
│          ↓                                                      │
│   3. AI Agent Receives Review (--prompt-only)                   │
│          ↓                                                      │
│   4. Fix Issues Automatically                                   │
│          ↓                                                      │
│   5. Commit & Push (Clean Code)                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Prerequisites

### Windows Requirement: WSL

CodeRabbit CLI requires **WSL (Windows Subsystem for Linux)** on Windows.

```powershell
# Install WSL (run as Administrator)
wsl --install

# After restart, set up Ubuntu (default)
wsl --set-default-version 2
```

### Node.js / pnpm Environment

Ensure your WSL environment has access to the project:
```bash
# Access Windows files from WSL
cd /mnt/c/tac-saas/tac-cargo
```

---

## Installation Steps

### Step 1: Install CodeRabbit CLI

```bash
# In WSL terminal
curl -fsSL https://cli.coderabbit.ai/install.sh | sh

# Restart shell to load PATH
source ~/.bashrc
# or
source ~/.zshrc
```

### Step 2: Authenticate

```bash
# Login to CodeRabbit
coderabbit auth login
```

This opens a browser for OAuth. Copy the token back to the terminal.

### Step 3: Verify Installation

```bash
coderabbit auth status
# Should show: Logged in as <your-username>

# Check available commands
cr -h
```

---

## CLI Commands Reference

### Core Review Commands

| Command | Description |
|---------|-------------|
| `coderabbit` | Review all changes (committed + uncommitted) |
| `coderabbit --type uncommitted` | Review only uncommitted changes |
| `coderabbit --type committed` | Review only committed changes |
| `coderabbit --prompt-only` | Output optimized for AI agents |
| `coderabbit --base main` | Compare against specific branch |

### Shorthand

```bash
cr                          # Alias for coderabbit
cr --prompt-only -t uncommitted  # Common workflow command
```

### Recommended Workflows

**Before committing:**
```bash
cr --prompt-only -t uncommitted
```

**Before pushing a feature branch:**
```bash
cr --prompt-only --base main
```

**Full review of branch:**
```bash
cr --prompt-only -t all --base main
```

---

## AI Agent Integration

### Cursor/Windsurf Rule

Create a rule file that instructs the AI agent how to use CodeRabbit:

**Location:** `.cursor/rules/coderabbit.mdc` or `.windsurfrules`

```markdown
# CodeRabbit CLI Integration

CodeRabbit is installed in the terminal (via WSL on Windows). Use it to review code changes.

## Commands

- `cr -h` - Show help
- `cr --prompt-only -t uncommitted` - Review uncommitted changes (most common)
- `cr --prompt-only --base main` - Review branch against main

## Workflow Rules

1. After implementing a feature, run CodeRabbit review
2. Always use `--prompt-only` flag for AI-optimized output
3. Fix critical and major issues; nitpicks are optional
4. Maximum 3 review cycles per feature
5. Focus on issues matching TAC Cargo's quality gates:
   - WCAG AA accessibility violations
   - Performance anti-patterns
   - RSC vs Client Component misuse
   - Hardcoded colors or non-semantic tokens
```

### Autonomous Development Loop

```text
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   User Prompt: "Implement feature X"                         │
│         ↓                                                    │
│   AI Agent: Implements feature                               │
│         ↓                                                    │
│   AI Agent: Runs `cr --prompt-only -t uncommitted`           │
│         ↓                                                    │
│   CodeRabbit: Returns issues (race conditions, security,     │
│               accessibility, etc.)                           │
│         ↓                                                    │
│   AI Agent: Fixes critical/major issues                      │
│         ↓                                                    │
│   Repeat (max 3 times) or Complete                           │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Configuration: .coderabbit.yaml

Place this file in the repository root for consistent review behavior:

```yaml
# yaml-language-server: $schema=https://coderabbit.ai/integrations/schema.v2.json

language: "en-US"
early_access: false

reviews:
  profile: "assertive"  # Comprehensive feedback
  request_changes_workflow: false
  high_level_summary: true
  review_status: true
  collapse_walkthrough: false
  
  path_instructions:
    - path: "src/components/**"
      instructions: |
        - Verify RSC vs Client Component usage is correct
        - Check for hardcoded colors (must use semantic tokens)
        - Ensure WCAG AA accessibility compliance
        - Verify proper use of elevation tokens
    
    - path: "src/app/**"
      instructions: |
        - Confirm Server Actions for all mutations
        - Check initial data loading happens on server
        - Verify TanStack Query for client fetching
        - No client state duplicating server state
    
    - path: "**/*.tsx"
      instructions: |
        - All UI must use semantic tokens from design system
        - No hex, rgb, or Tailwind color classes
        - OKLCH is the only allowed color space
        - Charts must use chart-* tokens
  
  auto_review:
    enabled: true
    drafts: false
    ignore_usernames:
      - "dependabot[bot]"
      - "renovate[bot]"

  tools:
    eslint:
      enabled: true
    biome:
      enabled: true

chat:
  auto_reply: true
```

---

## TAC Cargo Specific Rules

CodeRabbit should enforce these project-specific standards:

### Architecture Rules

| Rule | Enforcement |
|------|-------------|
| RSC-first | Flag unnecessary Client Components |
| Server Actions for mutations | Flag API routes doing mutations |
| TanStack Query for client data | Flag other client fetch patterns |

### Design System Rules

| Rule | Enforcement |
|------|-------------|
| Semantic tokens only | Flag hex/rgb/Tailwind colors |
| OKLCH color space | Flag other color spaces |
| Elevation tokens | Flag hardcoded shadows |
| Chart tokens | Flag non-chart-* colors in charts |

### Quality Gates

| Rule | Enforcement |
|------|-------------|
| WCAG AA | Flag accessibility violations |
| Performance | Flag patterns causing >2s loads |
| No rule bypass | Flag workarounds to system rules |

---

## Review Duration Expectations

| Change Size | Expected Duration |
|-------------|-------------------|
| Small (1-5 files) | 2-5 minutes |
| Medium (5-20 files) | 5-15 minutes |
| Large (20+ files) | 15-30 minutes |

**Tips for faster reviews:**
- Use `--type uncommitted` to review only working changes
- Work on smaller, focused feature branches
- Break large features into smaller PRs

---

## Troubleshooting

### Issue: "Command not found"
```bash
# Reinstall and source shell
curl -fsSL https://cli.coderabbit.ai/install.sh | sh
source ~/.bashrc
```

### Issue: "Authentication expired"
```bash
coderabbit auth login
```

### Issue: Review takes too long
```bash
# Review smaller scope
cr --prompt-only -t uncommitted

# Or specify base branch
cr --prompt-only --base develop
```

### Issue: WSL can't access project
```bash
# Access Windows files via /mnt/
cd /mnt/c/tac-saas/tac-cargo

# Or create symlink
ln -s /mnt/c/tac-saas/tac-cargo ~/tac-cargo
```

---

## Integration Checklist

- [ ] WSL installed and configured (Windows)
- [ ] CodeRabbit CLI installed (`curl -fsSL https://cli.coderabbit.ai/install.sh | sh`)
- [ ] Authentication complete (`coderabbit auth login`)
- [ ] `.coderabbit.yaml` added to repository root
- [ ] Cursor/Windsurf rule created for CodeRabbit
- [ ] Team trained on workflow

---

## Next Steps

1. **Immediate**: Install CLI and authenticate
2. **Configure**: Add `.coderabbit.yaml` to repository
3. **Integrate**: Create AI agent rule for CodeRabbit
4. **Train**: Share workflow with team
5. **Iterate**: Refine path instructions based on review feedback

---

## References

- [CodeRabbit CLI Documentation](https://www.coderabbit.ai/cli)
- [Cursor Integration Guide](https://docs.coderabbit.ai/code-editors/cursor)
- [YAML Configuration Reference](https://docs.coderabbit.ai/reference/configuration)
