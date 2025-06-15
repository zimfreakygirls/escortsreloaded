
-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow select for admins
CREATE POLICY "Admins can select profiles"
  ON profiles
  FOR SELECT
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()));

-- Allow update for admins
CREATE POLICY "Admins can update profiles"
  ON profiles
  FOR UPDATE
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()));
