-- 1. Grant SELECT permission on the profiles table (not users)
GRANT SELECT ON TABLE public.profiles TO authenticated;

-- 2. Enable RLS on profiles if not already enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Allow users to read their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
TO authenticated
USING ( id = auth.uid() );

-- 4. Allow users to update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING ( id = auth.uid() );

-- 5. Allow users to insert their own profile (e.g. on signup trigger)
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK ( id = auth.uid() );

-- 6. Important: Allow admins to read all profiles (if needed for admin panel logic)
-- Assuming 'is_admin' is a boolean column on profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING ( role = 'admin' );
