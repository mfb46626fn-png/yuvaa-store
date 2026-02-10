-- ==============================================================================
-- 4. FIX ADMIN ACCESS & ENSURE PROFILES EXIST
-- ==============================================================================

-- 1. Create a Trigger Function to handle new user signups
-- This ensures every new user in auth.users gets a corresponding row in public.profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, email)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    'customer', -- Default role is always customer
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- SECURITY DEFINER is crucial: it allows this function to bypass RLS policies
-- so it can insert into profiles even if no user is logged in yet (during signup).

-- 2. Create the Trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Backfill missing profiles for existing users
-- If you signed up BEFORE the trigger existed, you have no profile. This fixes it.
INSERT INTO public.profiles (id, email, role)
SELECT id, email, 'customer'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);

-- 4. UPDATE YOUR ADMIN USER AGAIN
-- Replace 'destek@yuvaastore.com' with your actual email address
-- This line is safe to run multiple times.
UPDATE public.profiles
SET role = 'admin'
WHERE id IN (
    SELECT id FROM auth.users WHERE email = 'destek@yuvaastore.com' -- BURAYA KENDİ EMAİLİNİZİ YAZIN
);

-- 5. VALIDATION
-- Check if the profile exists now
SELECT * FROM public.profiles WHERE role = 'admin';
