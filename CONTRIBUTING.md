# Contributing Guidelines

## Backend & Frontend Architecture Overview

This project uses a modern serverless architecture:
* **Frontend**: React + Vite hosted on Vercel CDN.
* **Backend API & AST Engine**: Vercel Serverless Functions (`/api/*`) or Supabase Edge Functions (`/supabase/functions/*`).
* **Database & Auth**: Supabase PostgreSQL with Row-Level Security (RLS) policies.

---

## What a Contributor Must Do for Backend Features

### 1. Local Backend Development
Contributors build and test backend API routes and SQL queries locally using either:
* **Option A**: A free personal Supabase sandbox project connected via keys in `.env.local`.
* **Option B**: Local Supabase CLI stack (`npx supabase start`).

### 2. Adding Database Migrations
If a backend feature requires new database tables, columns, or RLS policies:
1. Generate a new timestamped migration file:
   ```bash
   npx supabase migration new <feature_name>
   ```
2. Write the SQL DDL statements inside the generated file in `supabase/migrations/`.
3. Never edit existing committed migration files.

### 3. Environment Variable Documentation
If a backend feature introduces a new environment key:
1. Add the variable name to `.env.example` (prefixed with `VITE_` for frontend or standard name for serverless functions).
2. Never commit real credentials or `.env.local`.

### 4. Pull Request & Deployment Flow

```
[Developer Local Work] ──► [Submit GitHub PR] ──► [Vercel PR Preview URL] ──► [Your Approval] ──► [Production Deploy]
```

1. **Submit PR**: Contributor pushes their branch and opens a PR on GitHub.
2. **Vercel Preview Deployment**: Vercel automatically builds a staging preview URL for the PR so you can test the backend API and frontend live.
3. **Maintainer Approval**: GitHub blocks merging until you review and approve the PR.
4. **Automatic Production Deployment**:
   * Merging to `main` triggers Vercel to deploy updated backend API routes to production.
   * Supabase CLI applies the new database migration file to your production Supabase database.
