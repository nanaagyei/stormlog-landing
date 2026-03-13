#!/usr/bin/env bash
# Check Vercel deployment status (preview and production).
# Requires: vercel CLI installed and project linked (vercel link).
set -e

if ! command -v vercel &> /dev/null; then
  echo "Vercel CLI not found. Install with: npm i -g vercel"
  exit 1
fi

if [[ ! -f .vercel/project.json ]]; then
  echo "Project not linked. Run: vercel link"
  exit 1
fi

echo "=== Recent deployments ==="
vercel ls --limit 10
