-- Add the new admin user to admin_users table
INSERT INTO admin_users (id) 
VALUES ('1c8589e7-3d66-4f37-9b41-d3c54d717bf2')
ON CONFLICT (id) DO NOTHING;