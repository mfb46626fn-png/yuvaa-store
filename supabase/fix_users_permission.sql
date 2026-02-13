-- Grant usage on public schema (just in case)
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant SELECT permission on the users table to authenticated users
GRANT SELECT ON TABLE public.users TO authenticated;

-- Enable Row Level Security on the users table if not already enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow users to read their own data
-- Drop existing policy first to avoid conflicts
DROP POLICY IF EXISTS "Allow users to read own profile" ON public.users;

CREATE POLICY "Allow users to read own profile"
ON public.users FOR SELECT
TO authenticated
USING ( id = auth.uid() );

-- If admins need to read all users (e.g. for user management), add another policy
-- assuming there is an 'is_admin' column or role check.
-- For now, allowing reading own profile is usually enough for product creation checks.
