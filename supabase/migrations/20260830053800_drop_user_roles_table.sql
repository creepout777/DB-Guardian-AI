-- 20260830053800_drop_user_roles_table.sql
-- Safely drop user_roles table from PostgreSQL schema

DROP TABLE IF EXISTS public.user_roles CASCADE;
