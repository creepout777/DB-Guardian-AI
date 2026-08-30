-- 20260830053700_drop_test_tables.sql
-- Safely drop temporary test tables from PostgreSQL schema

DROP TABLE IF EXISTS public.simple_test_table CASCADE;
DROP TABLE IF EXISTS public.github_actions_test CASCADE;
DROP TABLE IF EXISTS public.vercel_test_logs CASCADE;
