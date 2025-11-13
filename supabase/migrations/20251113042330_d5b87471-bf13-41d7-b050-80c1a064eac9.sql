-- Add foreign key relationship between driver_verifications and profiles
-- First, ensure all user_ids in driver_verifications have corresponding profiles
-- Then add the foreign key constraint

-- Note: profiles.id references auth.users(id), and driver_verifications.user_id also references auth.users(id)
-- To join them, we don't need an explicit foreign key, but we need to ensure the query works properly

-- Add an index for better query performance
CREATE INDEX IF NOT EXISTS idx_driver_verifications_user_id ON public.driver_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);