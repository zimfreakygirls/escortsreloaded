-- Enable RLS on tables that need it
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for countries table - allow public read access
CREATE POLICY "Allow public read access to countries" 
ON countries 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage countries" 
ON countries 
FOR ALL 
USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()));

-- Create policies for user_status table - admin only access
CREATE POLICY "Admins can manage user status" 
ON user_status 
FOR ALL 
USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()));

-- Create policies for contact_info table - allow public read access
CREATE POLICY "Allow public read access to contact info" 
ON contact_info 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage contact info" 
ON contact_info 
FOR ALL 
USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()));

-- Create policies for admin_users table - admin only access
CREATE POLICY "Admins can view admin users" 
ON admin_users 
FOR SELECT 
USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()));

CREATE POLICY "Admins can manage admin users" 
ON admin_users 
FOR ALL 
USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()));

-- Create policies for admin_settings table - admin only access
CREATE POLICY "Admins can view admin settings" 
ON admin_settings 
FOR SELECT 
USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()));

CREATE POLICY "Admins can manage admin settings" 
ON admin_settings 
FOR ALL 
USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()));