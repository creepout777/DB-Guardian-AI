-- 20260830042800_github_action_test.sql
-- Automated Migration Test via GitHub Actions (Trigger Run 2)

CREATE TABLE IF NOT EXISTS public.github_actions_test (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_name VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'success',
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row-Level Security (RLS)
ALTER TABLE public.github_actions_test ENABLE ROW LEVEL SECURITY;

-- Allow public read access for verification
CREATE POLICY "Public read test table"
ON public.github_actions_test
FOR SELECT
USING (true);
