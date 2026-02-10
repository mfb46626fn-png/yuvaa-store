-- ==============================================================================
-- 5. FIX RLS RECURSION & SIMPLIFY POLICIES
-- ==============================================================================

-- 1. Create a Secure Function to check Admin Status
-- This function runs with "SECURITY DEFINER" privileges, meaning it bypasses RLS.
-- This prevents the "Infinite Recursion" error where checking if you are admin requires reading the table,
-- but reading the table requires checking if you are admin.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  current_role text;
BEGIN
  SELECT role INTO current_role FROM public.profiles WHERE id = auth.uid();
  RETURN current_role = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop existing policies on profiles to replace them with safer ones
DROP POLICY IF EXISTS "Profiles View Policy" ON profiles;
DROP POLICY IF EXISTS "Profiles Update Policy" ON profiles;
DROP POLICY IF EXISTS "Profiles Insert Policy" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON profiles;

-- 3. Create New, Safer Policies

-- VIEW: Users can see their own profile OR Admins can see ALL profiles
CREATE POLICY "Profiles View Policy" ON profiles
FOR SELECT
USING (
  auth.uid() = id 
  OR 
  public.is_admin() = true
);

-- UPDATE: Users can update their own (limited fields usually, but ok for now) OR Admins can update ALL
CREATE POLICY "Profiles Update Policy" ON profiles
FOR UPDATE
USING (
  auth.uid() = id 
  OR 
  public.is_admin() = true
);

-- INSERT: handled by trigger usually, but allow self-insert for robustness
CREATE POLICY "Profiles Insert Policy" ON profiles
FOR INSERT
WITH CHECK (auth.uid() = id);


-- 4. Apply is_admin() to other tables for consistency (Optional but good)
-- Re-apply Products Admin Policies just to be safe
DROP POLICY IF EXISTS "Products Admin Insert" ON products;
DROP POLICY IF EXISTS "Products Admin Update" ON products;
DROP POLICY IF EXISTS "Products Admin Delete" ON products;

CREATE POLICY "Products Admin Insert" ON products
FOR INSERT WITH CHECK (public.is_admin() = true);

CREATE POLICY "Products Admin Update" ON products
FOR UPDATE USING (public.is_admin() = true);

CREATE POLICY "Products Admin Delete" ON products
FOR DELETE USING (public.is_admin() = true);


-- 5. Re-apply Categories Admin Policy
DROP POLICY IF EXISTS "Categories Admin Manage" ON categories;
CREATE POLICY "Categories Admin Manage" ON categories
FOR ALL USING (public.is_admin() = true);


-- 6. Re-apply Orders Admin Policies
DROP POLICY IF EXISTS "Orders View Policy" ON orders;
CREATE POLICY "Orders View Policy" ON orders
FOR SELECT
USING (auth.uid() = user_id OR public.is_admin() = true);

DROP POLICY IF EXISTS "Orders Admin Update Policy" ON orders;
CREATE POLICY "Orders Admin Update Policy" ON orders
FOR UPDATE USING (public.is_admin() = true);


-- 7. Grant access to data (just in case)
GRANT SELECT ON public.profiles TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;
