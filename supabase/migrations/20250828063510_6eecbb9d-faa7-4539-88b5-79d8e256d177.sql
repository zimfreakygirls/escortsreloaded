-- Fix admin_users RLS policy to avoid recursion
DROP POLICY IF EXISTS "Allow admin insertion for bootstrapping" ON public.admin_users;

-- Simple policy: allow insertion when no admins exist (bootstrap) or when user is authenticated and already in admin_users
CREATE POLICY "Allow first admin creation" ON public.admin_users
FOR INSERT 
WITH CHECK (
  -- Allow if no admins exist yet (bootstrap case)
  NOT EXISTS (SELECT 1 FROM public.admin_users LIMIT 1)
  OR
  -- Allow if current user is already an admin (existing functionality)
  auth.uid() IN (SELECT id FROM public.admin_users)
);