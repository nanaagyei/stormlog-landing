#!/usr/bin/env bash
# Check Vercel deployment status (preview and production).
# Requires: vercel CLI installed and project linked (vercel link).
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

if ! command -v vercel &> /dev/null; then
  echo "Vercel CLI not found. Install with: npm i -g vercel"
  exit 1
fi

if [[ ! -f "$REPO_ROOT/.vercel/project.json" ]]; then
  echo "Project not linked. Run: vercel link"
  exit 1
fi

echo "=== Recent deployments ==="
(cd "$REPO_ROOT" && vercel ls --limit 10)
