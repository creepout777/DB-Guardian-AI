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

The application uses environment variables in three distinct locations.

**Contributors only ever touch `.env.local` on their local machine. Vercel and GitHub Secrets are managed exclusively by the maintainer (`@creepout777`) and are never accessible to contributors.**

| Variable | Contributor `.env.local` | Maintainer: Vercel | Maintainer: GitHub Secrets |
| :--- | :---: | :---: | :---: |
| `VITE_SUPABASE_URL` | Yes (personal sandbox) | Yes (production) | No |
| `VITE_SUPABASE_ANON_KEY` | Yes (personal sandbox) | Yes (production) | No |
| `SUPABASE_ACCESS_TOKEN` | No | No | Yes |
| `SUPABASE_PROJECT_ID` | No | No | Yes |
| `SUPABASE_DB_PASSWORD` | No | No | Yes (optional) |

### Variable Descriptions

**`.env.local`** (each developer's machine — git-ignored, never committed):
- `VITE_SUPABASE_URL`: HTTPS URL of your personal Supabase sandbox project.
- `VITE_SUPABASE_ANON_KEY`: Public anonymous API key of your sandbox project.

**Vercel Dashboard** (maintainer only):
- Same `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` but pointing to the production Supabase project.

**GitHub Repository Secrets** (maintainer only):
- `SUPABASE_ACCESS_TOKEN`: CLI token used by GitHub Actions to authenticate with Supabase.
- `SUPABASE_PROJECT_ID`: Project reference ID that GitHub Actions deploys migrations to.
- `SUPABASE_DB_PASSWORD`: Optional database password.

### When a New Environment Variable Is Added

1. The developer adds a placeholder entry to `.env.example` with a comment explaining the variable.
2. The PR description lists the variable name and whether it goes to Vercel or GitHub Secrets.
3. After merge, the maintainer adds the real production value to Vercel or GitHub Secrets.
4. Contributors copy the new key name from `.env.example` into their local `.env.local` and fill in their own sandbox value.

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

## Contributor Quick Start

As a contributor, this is everything you need to set up locally. No Vercel access. No GitHub Secrets. Just these steps:

```bash
# 1. Clone the repository
git clone https://github.com/creepout777/DB-Guardian-AI.git
cd DB-Guardian-AI
npm install

# 2. Create your local environment file
cp .env.example .env.local
# Then open .env.local and add your personal Supabase sandbox keys

# 3. Apply the repository database schema to your sandbox
npx supabase link --project-ref <your-sandbox-ref>
npx supabase db push

# 4. Run the app
npm run dev
```

That is it. Your `.env.local` contains your personal sandbox values and is never committed.

---

## Local Setup (Detailed)

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
