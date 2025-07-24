-- CRITICAL SECURITY FIX: Remove old admin accounts and users safely
-- First, delete payment verifications for old users
DELETE FROM payment_verifications WHERE user_id != 'eac0e529-ec56-4bcc-afa3-01c72c24850a';

-- Delete profiles for old users
DELETE FROM profiles WHERE created_at < '2025-07-24'::date;

-- Delete user_status for old users  
DELETE FROM user_status WHERE user_id != 'eac0e529-ec56-4bcc-afa3-01c72c24850a';

-- Remove old admin accounts from admin_users table
DELETE FROM admin_users WHERE id != 'eac0e529-ec56-4bcc-afa3-01c72c24850a';

-- Now safely delete old user accounts
DELETE FROM auth.users WHERE id != 'eac0e529-ec56-4bcc-afa3-01c72c24850a';

-- Fix storage bucket naming issue
-- Drop and recreate the bucket with correct name
DELETE FROM storage.buckets WHERE id = 'Payment Proofs';
INSERT INTO storage.buckets (id, name, public) VALUES ('payment-proofs', 'payment-proofs', true);

-- Create storage policies for the new bucket
CREATE POLICY "Public can view payment proofs" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'payment-proofs');

CREATE POLICY "Authenticated users can upload payment proofs" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'payment-proofs' AND auth.role() = 'authenticated');