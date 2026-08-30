# DB-Guardian AI

Enterprise Text-to-SQL & Visual Dashboard Studio with AST Security Guardrails, Interactive ERD Schema Canvas, and Supabase 2-Layer Data Isolation.

---

## 🌟 Architecture & Core Features

* **Supabase Authentication**: Email/Password Registration with Email Verification, Supabase OAuth2 (GitHub & Google), and Forgot Password recovery.
* **2-Layer User Data Isolation**:
  * **Layer 1 (Database)**: Automatic Postgres Row-Level Security (RLS) policies (`auth.uid() = user_id`).
  * **Layer 2 (Backend API)**: JWT session token validation middleware.
* **Visual Dashboard Studio**: Drag-and-drop widget reordering, 8 enterprise widget types, and Full-Screen Presentation view.
* **Interactive ERD Schema Canvas**: Pan & Zoom controls, draggable table cards, and dynamic SVG foreign key relationship curves.
* **2-Tier Account Role Model**: `Global Administrator` (Full setup & policy control) vs `Regular User` (Scoped to assigned dashboard & data).

---

## 🚀 Quick Setup Instructions

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

Visit **[http://localhost:5173/](http://localhost:5173/)** in your browser.

### 3. Production Build
Verify production compilation:
```bash
npm run build
```

---

## 🔒 Governance & Contribution Rules

For guidelines on setting up your local Supabase sandbox, branch protection rules, single-migration atomic PRs, and Kanban board governance, see **[CONTRIBUTING.md](CONTRIBUTING.md)**.
