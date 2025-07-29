-- Delete any existing admin user to recreate with new credentials
DELETE FROM auth.users WHERE email = 'admin@escortsreloaded.com';
DELETE FROM admin_users WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'admin@escortsreloaded.com'
);