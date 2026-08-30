# Contributing Guidelines

## Backend and Supabase Feature Architecture

This repository uses version-controlled configuration and migration files:
* **Database Schema and Policies**: Managed in `supabase/migrations/*.sql`.
* **Auth and Project Settings**: Managed in `supabase/config.toml` (site URL, JWT expiry, email verification toggles).
* **Frontend Supabase Client**: Configured in `src/lib/supabase.js` using `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
* **Automated CI/CD**: Managed via GitHub Actions (`.github/workflows/supabase-deploy.yml`).

---

## Contributor Scenario: Adding or Updating Auth, Email, or Database Features

Suppose you are a contributor building or modifying a feature (such as Email Verification, Supabase Auth flows, or Storage rules). Follow these exact steps:

### Step 1: Set Up Local Development Sandbox
1. Fork the repository and clone your fork locally.
2. Create a free personal development project on [Supabase.com](https://supabase.com).
3. Create `.env.local` in your root folder and add your personal sandbox keys:
   ```bash
   VITE_SUPABASE_URL=https://your-sandbox.supabase.co
   VITE_SUPABASE_ANON_KEY=your-sandbox-anon-key
   ```
4. Link your CLI and apply the repository schema to your personal sandbox:
   ```bash
   npx supabase link --project-ref <your-sandbox-ref>
   npx supabase db push
   ```

### Step 2: Implement the Feature
* **For UI/Auth Code**: Add your React code or Supabase client calls (`supabase.auth.signUp()`, `supabase.auth.signInWithOAuth()`, `supabase.auth.resetPasswordForEmail()`) in `src/pages/Auth.jsx` or `src/lib/supabase.js`.
* **For Auth/Project Settings**: Update `supabase/config.toml` (such as enabling email confirmations).
* **For Database Tables or Policies**: Generate a new timestamped migration file:
  ```bash
  npx supabase migration new <feature_name>
  ```
  Write your DDL and RLS policy SQL inside the generated `.sql` file in `supabase/migrations/`.

### Step 3: Local Build Verification
Verify that your changes compile cleanly without errors:
```bash
npm run build
```

### Step 4: Open a Pull Request (PR)
1. Commit your changes and push your feature branch to your fork.
2. Open a Pull Request targeting `main` on the primary repository (`creepout777/DB-Guardian-AI`).
3. Include a clear description of the feature added.

### Step 5: Maintainer Approval and Production Deployment
1. **Vercel Preview**: Vercel automatically builds a temporary staging URL for your PR so the maintainer can test your UI live.
2. **Third-Party Secrets**: If your feature requires private third-party credentials (such as Google OAuth Client Secrets or custom SendGrid SMTP passwords), list the placeholder key names in your PR description. The maintainer will paste secret values into the main Supabase Dashboard.
3. **Merge**: Once the maintainer approves and merges your PR:
   * **Vercel**: Deploys frontend code to production.
   * **GitHub Actions**: Runs `supabase db push` to apply migration files and configurations to the production database automatically.
