# Contributing Guidelines

---

## How the Environment Variables Work

This project has three separate environments. Each holds different keys for different purposes.

### Environment Variable Map

| Variable | Local `.env.local` | Vercel Dashboard | GitHub Secrets | Purpose |
| :--- | :---: | :---: | :---: | :--- |
| `VITE_SUPABASE_URL` | Yes | Yes | No | Supabase HTTPS project URL used by the React frontend |
| `VITE_SUPABASE_ANON_KEY` | Yes | Yes | No | Supabase public anonymous API key used by the React frontend |
| `SUPABASE_ACCESS_TOKEN` | No | No | Yes | CLI token that lets GitHub Actions authenticate with Supabase |
| `SUPABASE_PROJECT_ID` | No | No | Yes | The Supabase project reference ID GitHub Actions deploys migrations to |
| `SUPABASE_DB_PASSWORD` | No | No | Yes (optional) | Database password required by some Supabase projects |

**Key rules:**
- Variables starting with `VITE_` are bundled into the browser bundle by Vite. Only public, non-sensitive values go here.
- Variables in GitHub Secrets are server-side only. They are never exposed to the browser or Vercel.
- `.env.local` is git-ignored and never committed. Each developer has their own copy pointing to their personal sandbox.

---

## New Contributor Setup (Step by Step)

### Step 1: Fork and Clone

Fork the repository on GitHub, then clone your fork:

```bash
git clone https://github.com/<your-username>/DB-Guardian-AI.git
cd DB-Guardian-AI
npm install
```

### Step 2: Create a Personal Supabase Sandbox

1. Sign up for a free account at [Supabase.com](https://supabase.com).
2. Create a new project (e.g. `db-guardian-dev`).
3. Go to **Project Settings → API** and copy:
   - **Project URL** (`https://xyz.supabase.co`)
   - **anon public key** (`eyJ...`)

### Step 3: Set Up Local Environment Variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your sandbox values:

```bash
VITE_SUPABASE_URL=https://your-sandbox.supabase.co
VITE_SUPABASE_ANON_KEY=your-sandbox-anon-key
```

Do not commit `.env.local`. It is already listed in `.gitignore`.

### Step 4: Apply Database Migrations to Your Sandbox

This copies all current database tables, RLS policies, and schema from the repository to your personal sandbox:

```bash
npx supabase link --project-ref <your-sandbox-ref>
npx supabase db push
```

Your sandbox reference ID is found in Supabase Dashboard → Project Settings → General → Reference ID.

### Step 5: Run Locally

```bash
npm run dev
```

Open `http://localhost:5173/`. If your `.env.local` is configured correctly, the application will connect to your sandbox Supabase project.

> If `VITE_SUPABASE_URL` is not set, the application runs in demo mode. All UI is still usable with local mock data.

---

## Adding or Modifying Features

### Frontend or Auth Code Changes
- Edit `src/pages/Auth.jsx` for authentication UI.
- Edit `src/lib/supabase.js` for Supabase client helpers.
- Edit `src/pages/` for any other page components.

### Database Schema Changes (New Tables or RLS Policies)
1. Generate a new timestamped migration file:
   ```bash
   npx supabase migration new <feature_name>
   ```
2. Write your SQL DDL and RLS policy inside the generated file in `supabase/migrations/`.
3. Never edit or rename existing migration files that have already been committed.

### Auth or Project Configuration Changes (Email Verification, OAuth Settings)
- Edit `supabase/config.toml` to toggle settings such as `enable_confirmations = true`.

### Verifying Your Changes Locally

Always verify the frontend build passes cleanly before submitting a PR:

```bash
npm run build
```

---

## When a New Environment Variable Is Introduced

If your feature requires a new environment key, follow this process:

1. Add the variable name and a description comment to `.env.example`. Use a placeholder value, never a real secret:
   ```bash
   # OpenAI API Key for Text-to-SQL generation (backend only)
   VITE_OPENAI_API_KEY=your-openai-key-here
   ```
2. Reference the variable in code using `import.meta.env.VITE_YOUR_KEY` for frontend keys.
3. In your Pull Request description, list the new variable name and where it needs to be added (Vercel or GitHub Secrets).
4. The maintainer will add the real production value to Vercel Environment Variables or GitHub Secrets after reviewing and merging the PR.

---

## Pull Request Requirements

Each PR must be atomic: one feature or fix per PR.

- **One migration file per PR**: If schema changes are needed, include exactly one new timestamped `.sql` file.
- **Document new env keys**: Add placeholder entries to `.env.example`.
- **Clean build**: Run `npm run build` and verify it passes before opening the PR.
- **Reference the issue**: Include `Closes #N` in the PR description.

---

## Contribution Workflow

```
[1. Select Issue] → [2. Create Branch] → [3. Code and Test] → [4. Open PR] → [5. Vercel Preview] → [6. Maintainer Approval] → [7. Auto Deploy]
```

1. Comment on an issue to request assignment.
2. Create a branch from `main`: `feature/description` or `fix/description`.
3. Build and test locally with `npm run build`.
4. Open a PR targeting `main` with `Closes #N` in the description.
5. Vercel automatically generates a preview URL for the PR.
6. The maintainer reviews code, migration SQL, and preview URL.
7. After approval and merge:
   - Vercel deploys the updated frontend to production.
   - GitHub Actions runs `supabase db push` and applies any migration files to the production database.

---

## Governance

- Direct pushes to `main` are blocked by branch protection rules.
- All changes require PR approval from `@creepout777`.
- The Kanban board is read-only for contributors. Only maintainers move items between columns.
