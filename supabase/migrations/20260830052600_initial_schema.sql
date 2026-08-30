-- 20260830052600_initial_schema.sql
-- DB-Guardian AI: Initial Consolidated Database Schema & Row-Level Security Policies

-- 1. Create Policy Audit Logs Table
CREATE TABLE IF NOT EXISTS public.policy_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.policy_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own audit logs"
ON public.policy_audit_logs
FOR SELECT
USING (auth.uid() = user_id);

-- 2. Create User Dashboards Table
CREATE TABLE IF NOT EXISTS public.user_dashboards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    layout_config JSONB DEFAULT '[]'::jsonb NOT NULL,
    is_published BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.user_dashboards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own dashboards"
ON public.user_dashboards
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 3. Create System Status Logs Table
CREATE TABLE IF NOT EXISTS public.system_status_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'active' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.system_status_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read status logs"
ON public.system_status_logs
FOR SELECT
USING (true);
