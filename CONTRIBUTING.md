# Contributing Guidelines

## Governance and Permissions

1. **Kanban Board**: The GitHub Project Kanban board is read-only for external contributors. Only repository maintainers move items across columns.
2. **Mandatory PR Approval**: Direct pushes to `main` are blocked by branch protection. All code and database schema changes require a Pull Request (PR) and approval from the maintainer (`@creepout777`).

---

## Supabase Development Environment Setup

Contributors can use either of the following two Supabase setups:

### Option A: Personal Supabase Sandbox (Recommended for Open Source)
1. Create a free account at [Supabase.com](https://supabase.com) and create a personal development project.
2. Add your sandbox keys to `.env.local` (ignored by git):
   ```bash
   VITE_SUPABASE_URL=https://your-sandbox.supabase.co
   VITE_SUPABASE_ANON_KEY=your-sandbox-anon-key
   ```
3. Apply repository schema migrations to your personal sandbox:
   ```bash
   npx supabase link --project-ref <your-sandbox-ref>
   npx supabase db push
   ```

### Option B: Team Staging Access (For Core Contributors)
If invited to the organization's shared **Staging** project by the maintainer:
1. Accept the email invite to join as a **Developer**.
2. Link your CLI to the Staging project reference ID provided by the maintainer.

---

## Atomic Pull Request (PR) Requirements

Each Pull Request must represent a single, atomic feature or fix:

* **Single Migration File**: If schema changes are required, include exactly **one** new timestamped migration file generated via:
  ```bash
  npx supabase migration new <feature_name>
  ```
* **Never Edit Past Migrations**: Do not modify existing, committed migration files. Always create a new timestamped file for schema changes.
* **Environment Keys**: If new environment variables are needed, document the key name in `.env.example` (prefixed with `VITE_`). Never commit real secrets or `.env.local`.
* **Atomic Scope**: Do not combine multiple unrelated user stories or features into one PR.

---

## Step-by-Step Contribution Workflow

```
[1. Select Issue] ──► [2. Create Branch] ──► [3. Code & Test] ──► [4. Open PR] ──► [5. Maintainer Approval & Auto-Deploy]
```

1. **Select an Issue**: Choose an issue from the backlog and comment to request assignment.
2. **Create Branch**: Create a descriptive branch from `main`:
   * Features: `feature/description` (e.g. `feature/user-profiles`)
   * Fixes: `fix/description` (e.g. `fix/erd-canvas-zoom`)
3. **Build and Test**: Verify all tests and production builds pass locally:
   ```bash
   npm run build
   ```
4. **Submit PR**: Open a PR targeting `main` referencing the issue number (e.g., `Closes #1`).
5. **Vercel Preview**: Vercel automatically generates a temporary Preview URL for testing.
6. **Maintainer Review & Merge**: Once approved by the maintainer, merging to `main` automatically triggers:
   * **Vercel**: Deploys frontend code to production.
   * **GitHub Actions**: Executes `supabase db push` to apply the SQL migration file to the production database.
