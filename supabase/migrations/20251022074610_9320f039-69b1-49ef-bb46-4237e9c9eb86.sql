-- Add the new admin user that was created during credential update
INSERT INTO admin_users (id) 
VALUES ('166b0b23-4571-489b-b090-f7f06299204c')
ON CONFLICT (id) DO NOTHING;