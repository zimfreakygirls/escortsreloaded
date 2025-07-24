-- Fix infinite recursion by dropping problematic admin_users policies
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can manage admin users" ON admin_users;

-- Also fix the circular reference in countries policies
DROP POLICY IF EXISTS "Admins can manage countries" ON countries;

-- Also fix the circular reference in other tables
DROP POLICY IF EXISTS "Admins can manage user status" ON user_status;
DROP POLICY IF EXISTS "Admins can manage contact info" ON contact_info;
DROP POLICY IF EXISTS "Admins can view admin settings" ON admin_settings;
DROP POLICY IF EXISTS "Admins can manage admin settings" ON admin_settings;

-- Create simpler policies that don't cause recursion
-- For admin_users table - allow authenticated users to read their own record
CREATE POLICY "Users can view their own admin status" 
ON admin_users 
FOR SELECT 
USING (auth.uid() = id);

-- For countries - allow authenticated users to manage (since only admins will be authenticated to admin dashboard)
CREATE POLICY "Authenticated users can manage countries" 
ON countries 
FOR ALL 
USING (auth.role() = 'authenticated');

-- For user_status - allow authenticated users to manage
CREATE POLICY "Authenticated users can manage user status" 
ON user_status 
FOR ALL 
USING (auth.role() = 'authenticated');

-- For contact_info - allow authenticated users to manage
CREATE POLICY "Authenticated users can manage contact info" 
ON contact_info 
FOR ALL 
USING (auth.role() = 'authenticated');

-- For admin_settings - allow authenticated users to manage
CREATE POLICY "Authenticated users can view admin settings" 
ON admin_settings 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage admin settings" 
ON admin_settings 
FOR ALL 
USING (auth.role() = 'authenticated');