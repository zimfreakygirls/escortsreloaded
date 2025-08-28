-- Fix admin_settings RLS policies to allow registration checks
DROP POLICY IF EXISTS "Only admins can view admin settings" ON public.admin_settings;

CREATE POLICY "Allow reading admin settings for registration" ON public.admin_settings
FOR SELECT USING (true);

-- Insert default admin settings if they don't exist
INSERT INTO public.admin_settings (id, signup_enabled, signup_code)
VALUES ('default', true, 'admin123')
ON CONFLICT (id) DO NOTHING;