-- Fix the infinite recursion issue by creating a security definer function
-- that bypasses RLS for admin checking

-- Drop the problematic recursive policies
DROP POLICY IF EXISTS "Authenticated users can check their own admin status" ON admin_users;
DROP POLICY IF EXISTS "Only admins can manage admin_users" ON admin_users;

-- Create a security definer function to check admin status without RLS
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = user_id
  );
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;

-- Create simple, non-recursive policies for admin_users table
-- Allow anyone to check if they are an admin (using the function above)
CREATE POLICY "Allow users to check admin status via function"
ON admin_users
FOR SELECT
TO authenticated
USING (true);

-- Only allow existing admins to manage admin users
CREATE POLICY "Only admins can insert admin users"
ON admin_users
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update admin users"
ON admin_users
FOR UPDATE
TO authenticated
USING (public.is_admin());

CREATE POLICY "Only admins can delete admin users"
ON admin_users
FOR DELETE
TO authenticated
USING (public.is_admin());