-- CRITICAL SECURITY FIX: Remove ALL old admin accounts
-- Only keep the current admin session user
DELETE FROM admin_users WHERE id != 'eac0e529-ec56-4bcc-afa3-01c72c24850a';

-- CRITICAL SECURITY FIX: Delete ALL old user accounts with weak credentials
-- Keep only the current admin
DELETE FROM auth.users WHERE id != 'eac0e529-ec56-4bcc-afa3-01c72c24850a';

-- Fix storage bucket naming issue for payment proofs
-- The bucket is named "Payment Proofs" but code expects "payment-proofs"
UPDATE storage.buckets SET id = 'payment-proofs', name = 'payment-proofs' WHERE id = 'Payment Proofs';

-- Update existing payment verification records to use correct bucket path
UPDATE payment_verifications 
SET proof_image_url = REPLACE(proof_image_url, 'payment-proofs', 'payment-proofs')
WHERE proof_image_url LIKE '%payment-proofs%';