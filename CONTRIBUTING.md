# Contributing Guidelines

## Board & Code Permissions

1. **Kanban Access**: The project Kanban board is read-only for contributors. Only maintainers move items across columns.
2. **Review & Approval**: All changes require a Pull Request (PR) and at least one maintainer review before merging into `main`. Direct pushes to `main` are blocked.

## Contribution Workflow

1. **Find an Issue**: Select an issue from the backlog and request assignment in a comment.
2. **Fork & Branch**: Fork the repo and create a descriptive branch:
   - `feature/description`
   - `fix/description`
3. **Build & Test**: Ensure all code passes build validation:
   ```bash
   npm run build
   ```
4. **Submit PR**: Open a Pull Request to `main` referencing the issue number (e.g. `Closes #1`). Maintainers will review and merge upon approval.
