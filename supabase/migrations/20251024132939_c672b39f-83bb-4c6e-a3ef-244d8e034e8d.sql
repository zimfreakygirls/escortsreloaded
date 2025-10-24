-- Add existing admin users to admin_users table
INSERT INTO admin_users (id) 
VALUES 
  ('e1d02798-59d3-40e8-9893-43d07da7f6f6'),  -- mcdchiez16.mtc@proton.me
  ('90305e77-7fa7-4faa-9e10-3bf638700f81')   -- mcdchiez16.mtc@gmail.com
ON CONFLICT (id) DO NOTHING;