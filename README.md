# DB-Guardian AI

Enterprise Text-to-SQL and Visual Dashboard Studio with AST Security Guardrails, Interactive ERD Schema Canvas, and Supabase 2-Layer Data Isolation.

---

## Architecture and Core Features

* **Supabase Authentication**: Email/Password Registration with Email Verification, Supabase OAuth2 (GitHub and Google), and Password Reset recovery.
* **2-Layer User Data Isolation**:
  * **Layer 1 (Database)**: Automatic Postgres Row-Level Security (RLS) policies (`auth.uid() = user_id`).
  * **Layer 2 (Backend API)**: JWT session token validation middleware.
* **Visual Dashboard Studio**: Drag-and-drop widget reordering, 8 enterprise widget types, and Full-Screen Presentation view.
* **Interactive ERD Schema Canvas**: Pan and Zoom controls, draggable table cards, and dynamic SVG foreign key relationship curves.
* **2-Tier Account Role Model**: `Global Administrator` (Full setup and policy control) vs `Regular User` (Scoped to assigned dashboard and data).

---

## Technical Stack and CI/CD Pipeline

```
[Git Push / PR Merge to main]
          │
          ├──► Vercel CDN ──────────────► Deploys React Frontend Website
          │
          └──► GitHub Actions Workflow ──► Runs `supabase db push` to Deploy Database Migrations
```

* **Frontend**: React + Vite deployed automatically via Vercel.
* **Database & Auth**: Supabase PostgreSQL with Row-Level Security (RLS).
* **Automated Database CI/CD**: GitHub Actions deploys timestamped SQL migration files (`supabase/migrations/*.sql`) directly to Supabase upon PR merge.

---

## Quick Setup Instructions

### 1. Environment Setup
Copy `.env.example` to `.env.local` for local development:
```bash
cp .env.example .env.local
```

Populate your Supabase Project credentials:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Local Development
Install dependencies and launch the dev server:
```bash
npm install
npm run dev
```

Open `http://localhost:5173/` in your browser.

### 3. Production Build
Verify production compilation:
```bash
npm run build
```

---

## Governance and Contribution Rules

For step-by-step guidelines on local Supabase sandbox setups, single-migration atomic PRs, branch protection rules, and Kanban board workflows, see [CONTRIBUTING.md](CONTRIBUTING.md).
