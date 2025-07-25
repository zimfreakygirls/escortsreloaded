-- Make payment-proofs bucket public so admins can view images
UPDATE storage.buckets 
SET public = true 
WHERE id = 'payment-proofs';