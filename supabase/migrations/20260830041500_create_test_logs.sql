-- 20260830041500_create_test_logs.sql
-- Test Migration for Vercel Automated Deployment

CREATE TABLE IF NOT EXISTS public.vercel_test_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'success',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row-Level Security
ALTER TABLE public.vercel_test_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read access for test verification
CREATE POLICY "Public read test logs"
ON public.vercel_test_logs
FOR SELECT
USING (true);
