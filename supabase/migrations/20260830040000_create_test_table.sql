-- 20260830040000_create_test_table.sql
-- Test Migration: Create policy_audit_logs table with Row-Level Security (RLS)

CREATE TABLE IF NOT EXISTS public.policy_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row-Level Security (RLS)
ALTER TABLE public.policy_audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can read only their own audit logs
CREATE POLICY "Users can read own audit logs"
ON public.policy_audit_logs
FOR SELECT
USING (auth.uid() = user_id);
