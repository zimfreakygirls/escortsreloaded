-- Enable leaked password protection for better security
-- This will be configured in Supabase Auth settings

-- Create admin function to securely delete users from auth.users table
CREATE OR REPLACE FUNCTION admin_delete_user(target_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the current user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Only admins can delete users';
  END IF;

  -- Delete from related tables first (in order)
  DELETE FROM user_status WHERE user_id = target_user_id;
  DELETE FROM payment_verifications WHERE user_id = target_user_id;
  DELETE FROM user_profiles WHERE user_id = target_user_id;
  
  -- Delete from auth.users table (requires admin_api key in edge function)
  -- This will be handled by an edge function for security
END;
$$;

-- Grant execute permission to authenticated users (will be checked by function)
GRANT EXECUTE ON FUNCTION admin_delete_user(UUID) TO authenticated;

-- Improve admin_users table security with better RLS policies
DROP POLICY IF EXISTS "Users can view their own admin status" ON admin_users;

CREATE POLICY "Only admins can view admin_users table"
ON admin_users
FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM admin_users 
  WHERE id = auth.uid()
));

-- Ensure only admins can manage admin users
CREATE POLICY "Only existing admins can manage admin users"
ON admin_users
FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM admin_users 
  WHERE id = auth.uid()
))
WITH CHECK (EXISTS (
  SELECT 1 FROM admin_users 
  WHERE id = auth.uid()
));

-- Improve user_profiles DELETE policy to use admin function
DROP POLICY IF EXISTS "Admins can delete profiles" ON user_profiles;
DROP POLICY IF EXISTS "Allow admin delete" ON user_profiles;

CREATE POLICY "Only admins can delete user profiles"
ON user_profiles
FOR DELETE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM admin_users 
  WHERE id = auth.uid()
));

-- Improve user_status table RLS
DROP POLICY IF EXISTS "Authenticated users can manage user status" ON user_status;

CREATE POLICY "Only admins can view user status"
ON user_status
FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM admin_users 
  WHERE id = auth.uid()
));

CREATE POLICY "Only admins can manage user status"
ON user_status
FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM admin_users 
  WHERE id = auth.uid()
))
WITH CHECK (EXISTS (
  SELECT 1 FROM admin_users 
  WHERE id = auth.uid()
));

-- Improve payment_verifications admin access
CREATE POLICY "Only admins can delete payment verifications"
ON payment_verifications
FOR DELETE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM admin_users 
  WHERE id = auth.uid()
));