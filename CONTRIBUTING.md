# Contributing to DB-Guardian AI

Thank you for your interest in contributing to **DB-Guardian AI**! We welcome open-source contributions, bug fixes, and feature enhancements.

---

## 🔒 Governance & Contribution Rules

### 1. Can contributors edit the GitHub Kanban Board?
**NO.** The official [GitHub Project Kanban Board](https://github.com/users/creepout777/projects/6) is read-only for external contributors.
* Only repository **Maintainers & Admins** have permission to move cards across columns, modify story points, or reorder sprint priorities.
* If a contributor wants to work on a task, they comment on the issue requesting assignment. A maintainer will assign the issue and move its card to **In Progress**.

### 2. Do code contributions require maintainer approval?
**YES, 100%.** Direct pushes to `main` are strictly protected and blocked.
* All code contributions must be submitted via a **Pull Request (PR)**.
* Every PR requires **at least 1 code review approval** from a repository maintainer before merging.

---

## 🛠️ How to Contribute (Step-by-Step)

### Step 1: Pick or Request an Issue
1. Browse open issues on our [GitHub Issues](https://github.com/creepout777/DB-Guardian-AI/issues) page or [Agile Kanban Board](https://github.com/users/creepout777/projects/6).
2. Comment on the issue you'd like to work on:
   ```text
   Hi @creepout777, I'd like to take on this story! Please assign it to me.
   ```

### Step 2: Fork and Clone
1. Fork the repository to your GitHub account.
2. Clone your fork locally:
   ```bash
   git clone https://github.com/<your-username>/DB-Guardian-AI.git
   cd DB-Guardian-AI
   ```

### Step 3: Create a Feature Branch
Create a descriptive branch following our naming convention:
* Features: `feature/short-description` (e.g. `feature/oidc-supabase-auth`)
* Fixes: `fix/short-description` (e.g. `fix/erd-canvas-zoom-offset`)

```bash
git checkout -b feature/user-story-title
```

### Step 4: Write Code & Test
1. Make your changes adhering to our React / Vite enterprise code conventions.
2. Run build verification:
   ```bash
   npm run build
   ```

### Step 5: Commit & Submit Pull Request
1. Commit your changes using conventional commit messages (`feat:`, `fix:`, `docs:`):
   ```bash
   git commit -m "feat(auth): implement OIDC Cloud Provider integration for US-101"
   ```
2. Push your branch to your fork:
   ```bash
   git push origin feature/user-story-title
   ```
3. Open a **Pull Request** targeting `main` on the original `creepout777/DB-Guardian-AI` repository.
4. Reference the issue number in your PR description (e.g. `Closes #1`).

---

## 📋 Code Review & Merging Process

1. **Automated Checks**: Your PR will undergo automated build & lint checks.
2. **Maintainer Review**: A maintainer (`@creepout777`) will review your code for security, AST compliance, and architecture standards.
3. **Approval & Merge**: Once approved, the maintainer will merge your PR, and the associated Kanban card will automatically move to **Completed**.
