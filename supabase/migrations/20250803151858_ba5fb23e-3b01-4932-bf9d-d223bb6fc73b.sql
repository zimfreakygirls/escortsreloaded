-- Fix the admin_users RLS policies to allow proper admin checking
-- Remove the overly restrictive policies that require admin status to check admin status

DROP POLICY IF EXISTS "Only admins can view admin_users table" ON admin_users;
DROP POLICY IF EXISTS "Only existing admins can manage admin users" ON admin_users;

-- Create a more permissive policy for checking admin status
-- This allows authenticated users to check if they are admins
CREATE POLICY "Authenticated users can check their own admin status"
ON admin_users
FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Keep admin management restricted to existing admins
CREATE POLICY "Only admins can manage admin_users"
ON admin_users
FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM admin_users a
  WHERE a.id = auth.uid()
))
WITH CHECK (EXISTS (
  SELECT 1 FROM admin_users a
  WHERE a.id = auth.uid()
));