#!/bin/bash
# CodeRabbit CLI Review Helper for WSL
# Usage: wsl bash /mnt/c/tac-saas/tac-cargo/scripts/coderabbit-review.sh [options]
# 
# Examples:
#   wsl bash /mnt/c/tac-saas/tac-cargo/scripts/coderabbit-review.sh                    # Review all changes
#   wsl bash /mnt/c/tac-saas/tac-cargo/scripts/coderabbit-review.sh -t uncommitted     # Review uncommitted only
#   wsl bash /mnt/c/tac-saas/tac-cargo/scripts/coderabbit-review.sh --base main        # Review against main branch

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PROJECT_DIR="/mnt/c/tac-saas/tac-cargo"
CODERABBIT_BIN="$HOME/.local/bin/coderabbit"

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║          CodeRabbit CLI Review - TAC Cargo                   ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Step 1: Check if CodeRabbit CLI is installed
if [ ! -f "$CODERABBIT_BIN" ]; then
    echo -e "${YELLOW}[!] CodeRabbit CLI not found. Installing...${NC}"
    curl -fsSL https://cli.coderabbit.ai/install.sh | sh
    source ~/.bashrc
fi

# Step 2: Initialize gnome-keyring for credential access
echo -e "${BLUE}[*] Initializing keyring...${NC}"
export GNOME_KEYRING_CONTROL=/run/user/$(id -u)/keyring
mkdir -p /run/user/$(id -u) 2>/dev/null || true
echo -n '' | gnome-keyring-daemon --unlock --replace --components=secrets 2>/dev/null || true

# Step 3: Navigate to project directory
if [ ! -d "$PROJECT_DIR" ]; then
    echo -e "${RED}[ERROR] Project directory not found: $PROJECT_DIR${NC}"
    exit 1
fi
cd "$PROJECT_DIR"

# Step 4: Verify git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}[ERROR] Not a git repository${NC}"
    exit 1
fi

# Step 5: Check authentication status
echo -e "${BLUE}[*] Checking authentication...${NC}"
AUTH_STATUS=$($CODERABBIT_BIN auth status 2>&1 || true)
if echo "$AUTH_STATUS" | grep -q "Not logged in"; then
    echo -e "${YELLOW}[!] Not authenticated. Please run: coderabbit auth login${NC}"
    echo -e "${YELLOW}    Or set CODERABBIT_API_KEY environment variable${NC}"
    exit 1
fi
echo -e "${GREEN}[✓] Authenticated${NC}"

# Step 6: Show git status summary
echo ""
echo -e "${BLUE}[*] Git Status Summary:${NC}"
UNCOMMITTED=$(git status --porcelain | wc -l)
BRANCH=$(git branch --show-current)
echo -e "    Branch: ${GREEN}$BRANCH${NC}"
echo -e "    Uncommitted changes: ${YELLOW}$UNCOMMITTED files${NC}"

# Step 7: Run CodeRabbit review
echo ""
echo -e "${BLUE}[*] Starting CodeRabbit review...${NC}"
echo -e "    Arguments: ${YELLOW}$@${NC}"
echo ""

# Default to --prompt-only if no flags provided
if [ $# -eq 0 ]; then
    $CODERABBIT_BIN review --prompt-only -t uncommitted
else
    $CODERABBIT_BIN review --prompt-only "$@"
fi

echo ""
echo -e "${GREEN}[✓] Review complete${NC}"
