-- 20260830045200_create_user_dashboards_table.sql
-- Create user_dashboards table with Row-Level Security (RLS) policies

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

-- Enable Postgres Row-Level Security (RLS)
ALTER TABLE public.user_dashboards ENABLE ROW LEVEL SECURITY;

-- Layer 1 Database RLS Policy: Users can view and modify ONLY their own dashboards
CREATE POLICY "Users can manage own dashboards"
ON public.user_dashboards
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
