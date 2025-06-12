
-- Add currency and pricing fields to countries table
ALTER TABLE public.countries 
ADD COLUMN currency TEXT DEFAULT 'USD',
ADD COLUMN signup_price NUMERIC DEFAULT 49.99,
ADD COLUMN payment_phone TEXT,
ADD COLUMN payment_name TEXT DEFAULT 'Escorts Reloaded';

-- Update existing countries with default values
UPDATE public.countries 
SET currency = 'USD', 
    signup_price = 49.99, 
    payment_phone = '+1 234-567-8900',
    payment_name = 'Escorts Reloaded'
WHERE currency IS NULL;

-- Add currency field to profiles table to track which currency was used
ALTER TABLE public.profiles 
ADD COLUMN currency TEXT DEFAULT 'USD';
