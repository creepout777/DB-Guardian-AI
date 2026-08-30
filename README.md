# DB-Guardian AI

Enterprise Text-to-SQL and Visual Dashboard Studio with AST Security Guardrails, Interactive ERD Schema Canvas, and Supabase 2-Layer Data Isolation.

---

## Architecture and Core Features

- **Supabase Authentication**: Email/Password with Email Verification, OAuth2 (GitHub and Google), Password Reset.
- **2-Layer Data Isolation**: Layer 1 is Postgres Row-Level Security (RLS) policies per user. Layer 2 is JWT session token validation.
- **Visual Dashboard Studio**: Drag-and-drop widgets, 8 enterprise widget types, Full-Screen Presentation mode.
- **Interactive ERD Schema Canvas**: Pan and Zoom, draggable table cards, SVG foreign key curves.
- **2-Tier Roles**: Global Administrator (full setup access) and Regular User (scoped to own data only).

---

## Environment Variables Reference

The application uses environment variables in three distinct locations. Each location serves a different purpose and holds different keys.

### Where Each Variable Lives

| Variable | Local `.env.local` | Vercel Dashboard | GitHub Secrets |
| :--- | :---: | :---: | :---: |
| `VITE_SUPABASE_URL` | Yes | Yes | No |
| `VITE_SUPABASE_ANON_KEY` | Yes | Yes | No |
| `SUPABASE_ACCESS_TOKEN` | No | No | Yes |
| `SUPABASE_PROJECT_ID` | No | No | Yes |
| `SUPABASE_DB_PASSWORD` | No | No | Yes (optional) |

### What Each Variable Does

**Local Development** (`.env.local` — never committed to git):
- `VITE_SUPABASE_URL`: The HTTPS URL of your personal Supabase sandbox project. Used by the React frontend to connect to Supabase Auth.
- `VITE_SUPABASE_ANON_KEY`: The public anonymous API key of your sandbox project. Safe to use in browser code.

**Vercel Dashboard** (Settings → Environment Variables):
- `VITE_SUPABASE_URL`: The URL of your production Supabase project. Required for the live website to connect to Supabase Auth.
- `VITE_SUPABASE_ANON_KEY`: The public anonymous API key of your production project.

> Note: Vercel may also auto-inject `SUPABASE_URL` and `SUPABASE_ANON_KEY` if you use the Vercel Supabase integration. The application reads both formats automatically.

**GitHub Repository Secrets** (Settings → Secrets and variables → Actions):
- `SUPABASE_ACCESS_TOKEN`: Your personal Supabase CLI token (`sbp_...`). Allows GitHub Actions to authenticate with your Supabase account and push database migrations.
- `SUPABASE_PROJECT_ID`: Your project reference ID (found in Supabase Dashboard → Project Settings → General). Tells GitHub Actions which project to deploy migrations to.
- `SUPABASE_DB_PASSWORD`: Optional. Your database password, required when the project uses a custom password.

### When a New Environment Variable Is Added

1. The developer adds its placeholder name and description to `.env.example` in their Pull Request.
2. The maintainer reviews and merges the PR.
3. The maintainer then manually adds the real value to Vercel Environment Variables (if it is a frontend `VITE_` key) or GitHub Secrets (if it is a backend migration key).
4. Contributors get the new key name from `.env.example` and paste their own value into their local `.env.local`.

---

## CI/CD Pipeline

```
[PR Merged to main]
       │
       ├── Vercel: Builds and deploys the React frontend to production
       │
       └── GitHub Actions: Runs `supabase db push` to apply new SQL migrations to production database
```

Vercel and GitHub Actions run independently and in parallel. They do not share environment variables with each other.

---

## Local Setup

### 1. Clone and Install

```bash
git clone https://github.com/creepout777/DB-Guardian-AI.git
cd DB-Guardian-AI
npm install
```

### 2. Create Local Environment File

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your values:

```bash
VITE_SUPABASE_URL=https://your-sandbox.supabase.co
VITE_SUPABASE_ANON_KEY=your-sandbox-anon-key
```

### 3. Apply Database Migrations to Your Sandbox

```bash
npx supabase link --project-ref <your-sandbox-project-ref>
npx supabase db push
```

### 4. Run the Application

```bash
npm run dev
```

Open `http://localhost:5173/` in your browser.

> If `VITE_SUPABASE_URL` is not set, the application runs in demo mode with local mock data. All UI features remain accessible.

### 5. Verify the Build

```bash
npm run build
```

---

## Governance and Contribution Rules

See [CONTRIBUTING.md](CONTRIBUTING.md) for step-by-step contribution workflow, PR requirements, and Supabase feature development guidelines.
