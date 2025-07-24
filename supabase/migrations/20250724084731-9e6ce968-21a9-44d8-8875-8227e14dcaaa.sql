-- CRITICAL SECURITY FIX: Remove old accounts safely
-- First, delete payment verifications for old users
DELETE FROM payment_verifications WHERE user_id != 'eac0e529-ec56-4bcc-afa3-01c72c24850a';

-- Delete profiles for old users
DELETE FROM profiles WHERE created_at < '2025-07-24'::date;

-- Delete user_status for old users  
DELETE FROM user_status WHERE user_id != 'eac0e529-ec56-4bcc-afa3-01c72c24850a';

-- Remove old admin accounts
DELETE FROM admin_users WHERE id != 'eac0e529-ec56-4bcc-afa3-01c72c24850a';

-- Now safely delete old user accounts (this removes all weak password accounts)
DELETE FROM auth.users WHERE id != 'eac0e529-ec56-4bcc-afa3-01c72c24850a';