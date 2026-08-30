# Contributing Guidelines

## Governance & Permissions

1. **Kanban Board**: The GitHub Project Kanban board is read-only for contributors. Only repository maintainers move items across columns.
2. **Pull Requests & Approvals**: All contributions require a Pull Request (PR) and maintainer review before merging into `main`. Direct pushes to `main` are blocked.

## Supabase Development Environment Setup

Contributors can use either of the following two Supabase setups:

### Option A: Personal Supabase Sandbox (Recommended for Open Source)
1. Create a free account at [Supabase.com](https://supabase.com) and create a personal development project.
2. Add your sandbox keys to `.env.local` (ignored by git):
   ```bash
   VITE_SUPABASE_URL=https://your-sandbox.supabase.co
   VITE_SUPABASE_ANON_KEY=your-sandbox-anon-key
   ```
3. Apply repository schema migrations to your sandbox:
   ```bash
   npx supabase link --project-ref <your-sandbox-ref>
   npx supabase db push
   ```

### Option B: Team Staging Access (For Core Contributors)
If invited to the organization's shared **Staging** project by the maintainer:
1. Accept the email invite to join as a **Developer**.
2. Link your CLI to the Staging project reference ID provided by the maintainer.

## Atomic PR Requirement

Each Pull Request must represent a single, atomic feature or fix:
* **Single Migration**: If schema changes are required, include exactly **one** new timestamped migration file generated via `npx supabase migration new <name>`.
* **Environment Keys**: If new environment variables are needed, update `.env.example` with the new key name (prefixed with `VITE_`). Never commit real secrets or `.env.local`.
* **Atomic Scope**: Do not combine multiple unrelated user stories or features into one PR.

## Contribution Workflow

1. **Select an Issue**: Choose an issue from the backlog and comment to request assignment.
2. **Create Branch**: Create a branch from `main` (`feature/description` or `fix/description`).
3. **Build & Test**: Ensure all tests and build validations pass:
   ```bash
   npm run build
   ```
4. **Submit PR**: Open a PR targeting `main` referencing the issue number (e.g., `Closes #1`).
