-- Fix admin_users RLS policy to allow first admin creation
DROP POLICY IF EXISTS "Only admins can insert admin users" ON public.admin_users;

-- Allow admin insertion when either:
-- 1. User is already an admin (existing functionality)
-- 2. No admins exist yet (bootstrap first admin)
CREATE POLICY "Allow admin insertion for bootstrapping" ON public.admin_users
FOR INSERT 
WITH CHECK (
  is_admin() OR 
  NOT EXISTS (SELECT 1 FROM public.admin_users LIMIT 1)
);