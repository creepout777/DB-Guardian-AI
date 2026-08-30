# Contributing Guidelines

## Governance & Permissions

1. **Kanban Board**: The GitHub Project Kanban board is read-only for contributors. Only repository maintainers move items across columns.
2. **Pull Requests & Approvals**: All contributions require a Pull Request (PR) and maintainer review before merging into `main`. Direct pushes to `main` are blocked.

## Atomic PR Requirement

Each Pull Request must represent a single, atomic feature or fix:
* **Single Migration**: If schema changes are required, include exactly **one** new timestamped migration file generated via `npx supabase migration new <name>`.
* **Environment Keys**: If new environment variables are needed, update `.env.example` with the new key name (prefixed with `VITE_`). Never commit real secrets or `.env.local`.
* **Atomic Scope**: Do not combine multiple unrelated user stories or features into one PR.

## Database Migration Rules

1. **Never Edit Past Migrations**: Do not modify existing, committed migration files. Always create a new timestamped migration file for schema changes.
2. **Local Verification**: Test migrations locally before opening a PR:
   ```bash
   npx supabase db reset
   ```

## Contribution Workflow

1. **Select an Issue**: Choose an issue from the backlog and comment to request assignment.
2. **Create Branch**: Create a branch from `main`:
   - `feature/description`
   - `fix/description`
3. **Build & Test**: Ensure all tests and build validations pass:
   ```bash
   npm run build
   ```
4. **Submit PR**: Open a PR targeting `main` referencing the issue number (e.g., `Closes #1`).
