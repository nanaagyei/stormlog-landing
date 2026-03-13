# Vercel Deployment Verification

This folder documents how to verify that **preview** and **production** deployments have passed or failed before they are promoted.

## Deployment Flow

```mermaid
flowchart LR
    subgraph Push [Push to main]
        A[Code pushed]
    end
    subgraph CI [GitHub Actions CI]
        B[Lint]
        C[Typecheck]
        D[Build]
    end
    subgraph Vercel [Vercel]
        E[Preview deploy]
        F[Production deploy]
        G[Deployment checks]
    end
    A --> CI
    B --> C --> D
    D --> E
    E --> G
    G -->|Pass| F
    G -->|Fail| H[Block production]
```

## Preview vs Production

| Environment | Trigger | Status |
|-------------|---------|--------|
| **Preview** | Every push and PR | Built immediately; shows build logs in Vercel dashboard |
| **Production** | Merge to `main` | Blocked until Deployment Checks pass (CI) |

## Verifying Deployment Status

### 1. Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select the **stormlog-landing** project
3. Open **Deployments**
4. Check each deployment:
   - **Ready** — Build succeeded, deployment is live
   - **Building** — In progress
   - **Error** — Build or checks failed
   - **Canceled** — Deployment was canceled

### 2. Deployment Checks (Production)

Production deployments are promoted only after required checks pass:

1. **Settings** → **Git** → **Deployment Protection**
2. Enable **Deployment Checks**
3. Add required check: **CI** (or **Lint, Typecheck & Build**)
4. Vercel waits for the [CI workflow](../.github/workflows/ci.yml) to pass before promoting to production

### 3. CLI (when project is linked)

If the project is linked via `vercel link`:

```bash
# List recent deployments (preview and production)
./scripts/check-deployment-status.sh

# Or run directly
vercel ls
vercel inspect <deployment-url>
```

## Quick Reference

- **CI workflow**: [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) — runs lint, typecheck, build
- **Vercel config**: [`vercel.json`](../vercel.json) — project settings (deployments enabled for all branches)
- **Deployment checks**: Configure in Vercel → Project Settings → Git → Deployment Protection

## Branch Behavior

| Branch | Deployment type |
|--------|-----------------|
| `main` | Production (aliased to production domain) |
| `dev`  | Preview |
| Other  | Preview |
