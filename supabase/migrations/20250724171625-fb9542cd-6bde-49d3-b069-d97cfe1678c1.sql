-- Fix storage bucket name for payment proofs
UPDATE storage.buckets SET name = 'payment-proofs' WHERE id = 'payment-proofs';