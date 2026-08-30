-- 20260830053300_simple_test_migration.sql
-- Simple Test Migration

CREATE TABLE IF NOT EXISTS public.simple_test_table (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'active' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Postgres Row-Level Security (RLS)
ALTER TABLE public.simple_test_table ENABLE ROW LEVEL SECURITY;

-- Allow public read access for testing
CREATE POLICY "Public read simple test table"
ON public.simple_test_table
FOR SELECT
USING (true);
