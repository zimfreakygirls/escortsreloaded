-- First, update site_status to remove the foreign key reference
UPDATE site_status SET updated_by = NULL WHERE updated_by IS NOT NULL;

-- Now we can safely delete the admin user
DELETE FROM admin_users WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'admin@escortsreloaded.com'
);
DELETE FROM auth.users WHERE email = 'admin@escortsreloaded.com';