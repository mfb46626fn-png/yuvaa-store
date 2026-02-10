-- ==============================================================================
-- 4. FIX ADMIN ACCESS & ENSURE PROFILES EXIST (Corrected Email Column)
-- ==============================================================================

-- 1. Add email column to profiles if it's missing (Fix for your error)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;

-- 2. Create the Trigger Function with email handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, email)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    'customer', -- Default role
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create the Trigger on auth.users (if not already there)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. Backfill missing profiles (Create rows for users who have NONE)
INSERT INTO public.profiles (id, email, role, full_name)
SELECT 
    id, 
    email, 
    'customer',
    raw_user_meta_data->>'full_name'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);

-- 5. Backfill email for existing profiles (Update NULL emails)
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id AND (p.email IS NULL OR p.email = '');

-- 6. Give Admin Role (Using your email from the screenshot)
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'huseyin321@gmail.com';  -- Your email

-- 7. Verification Query
SELECT * FROM public.profiles WHERE role = 'admin';
