-- CRITICAL SECURITY FIXES

-- 1. Fix profiles table RLS policies - remove overly permissive public access
DROP POLICY IF EXISTS "Allow anyone to delete profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow anyone to insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow public read access" ON public.profiles;

-- Create secure policies for profiles table
CREATE POLICY "Public can view basic profile info" ON public.profiles
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can insert profiles" ON public.profiles
FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "Only admins can delete profiles" ON public.profiles
FOR DELETE 
USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- 2. Secure admin_settings table - remove overly permissive authenticated access
DROP POLICY IF EXISTS "Authenticated users can manage admin settings" ON public.admin_settings;
DROP POLICY IF EXISTS "Authenticated users can view admin settings" ON public.admin_settings;

CREATE POLICY "Only admins can view admin settings" ON public.admin_settings
FOR SELECT 
USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "Only admins can manage admin settings" ON public.admin_settings
FOR ALL 
USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- 3. Secure settings table - restrict modifications to admins only
DROP POLICY IF EXISTS "Allow authenticated users to modify settings" ON public.settings;

CREATE POLICY "Only admins can modify settings" ON public.settings
FOR UPDATE 
USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "Only admins can insert settings" ON public.settings
FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "Only admins can delete settings" ON public.settings
FOR DELETE 
USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- 4. Secure contact_info table - restrict modifications to admins
DROP POLICY IF EXISTS "Authenticated users can manage contact info" ON public.contact_info;

CREATE POLICY "Only admins can manage contact info" ON public.contact_info
FOR ALL 
USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- 5. Secure countries table - restrict modifications to admins
DROP POLICY IF EXISTS "Authenticated users can manage countries" ON public.countries;

CREATE POLICY "Only admins can manage countries" ON public.countries
FOR UPDATE 
USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "Only admins can insert countries" ON public.countries
FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "Only admins can delete countries" ON public.countries
FOR DELETE 
USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- 6. Secure site_status table policies
DROP POLICY IF EXISTS "Admins can update site status" ON public.site_status;
DROP POLICY IF EXISTS "Admins can view site status" ON public.site_status;

CREATE POLICY "Only verified admins can view site status" ON public.site_status
FOR SELECT 
USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "Only verified admins can update site status" ON public.site_status
FOR UPDATE 
USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- 7. Create audit log table for admin actions
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  table_name text,
  record_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view audit logs" ON public.admin_audit_log
FOR SELECT 
USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- 8. Add indexes for better performance on security checks
CREATE INDEX IF NOT EXISTS idx_admin_users_id ON public.admin_users(id);
CREATE INDEX IF NOT EXISTS idx_audit_log_admin_user ON public.admin_audit_log(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON public.admin_audit_log(created_at);