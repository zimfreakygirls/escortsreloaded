
-- Backfill: Insert missing profiles for users without a matching profile row
INSERT INTO public.profiles (id, name, age, price_per_hour, location, city, country)
SELECT
  u.id,
  COALESCE(u.raw_user_meta_data ->> 'name', split_part(u.email, '@', 1)),
  25,       -- Default age
  50,       -- Default price_per_hour
  'Location', -- Default location
  'City',     -- Default city
  'Country'   -- Default country
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;
