-- Fix payment proofs storage bucket name
-- First, let's check if the bucket exists with spaces
DO $$
BEGIN
    -- Create payment-proofs bucket (without spaces) if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM storage.buckets WHERE id = 'payment-proofs'
    ) THEN
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('payment-proofs', 'payment-proofs', true);
    END IF;
END $$;

-- Create storage policies for payment-proofs bucket
CREATE POLICY "Allow public access to payment proofs" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'payment-proofs');

CREATE POLICY "Allow authenticated users to upload payment proofs" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'payment-proofs' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update payment proofs" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'payment-proofs' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete payment proofs" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'payment-proofs' AND auth.role() = 'authenticated');