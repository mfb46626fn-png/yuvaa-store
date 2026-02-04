-- ==============================================================================
-- YUVAA STORE SECURITY OVERHAUL (RLS POLICIES)
-- ==============================================================================

-- 1. ENABLE ROW LEVEL SECURITY
-- Ensure RLS is active on all critical tables.
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY; -- Included for consistency

-- 2. CLEANUP: DROP EXISTING POLICIES
-- We drop all existing policies to avoid conflicts and ensure a clean slate.
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON profiles;

DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "Admins can insert products" ON products;
DROP POLICY IF EXISTS "Admins can update products" ON products;
DROP POLICY IF EXISTS "Admins can delete products" ON products;

DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can create orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can update orders" ON orders;

-- (Repeat generic drops for safety on other tables if names vary, using generic names below)
-- Note: 'DROP POLICY IF EXISTS' doesn't throw if policy doesn't exist, so we can be thorough.


-- ==============================================================================
-- 3. PROFILES TABLE
-- Rule: Users see/edit ONLY their own. Admins see/edit ALL.
-- ==============================================================================

-- VIEW: Self or Admin
CREATE POLICY "Profiles View Policy" ON profiles
FOR SELECT
USING (
  auth.uid() = id 
  OR 
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- UPDATE: Self or Admin
CREATE POLICY "Profiles Update Policy" ON profiles
FOR UPDATE
USING (
  auth.uid() = id 
  OR 
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- INSERT: Managed by Auth Triggers mostly, but allow self-insert just in case for registration
CREATE POLICY "Profiles Insert Policy" ON profiles
FOR INSERT
WITH CHECK (auth.uid() = id);


-- ==============================================================================
-- 4. PRODUCTS TABLE (& CATEGORIES)
-- Rule: Public Read. Admin Write Only.
-- ==============================================================================

-- VIEW: Everyone (Anon included)
CREATE POLICY "Products Public View" ON products
FOR SELECT
USING (true);

CREATE POLICY "Categories Public View" ON categories
FOR SELECT
USING (true);

-- WRITE (Insert/Update/Delete): Admin Only
CREATE POLICY "Products Admin Insert" ON products
FOR INSERT
WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Products Admin Update" ON products
FOR UPDATE
USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Products Admin Delete" ON products
FOR DELETE
USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Categories Write
CREATE POLICY "Categories Admin Manage" ON categories
FOR ALL
USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');


-- ==============================================================================
-- 5. ORDERS TABLE
-- Rule: Users see their own. Users CREATE their own. Users CANNOT edit/delete.
-- Admin sees all, updates all (status).
-- ==============================================================================

-- VIEW: Own orders OR Admin
CREATE POLICY "Orders View Policy" ON orders
FOR SELECT
USING (
  auth.uid() = user_id 
  OR 
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- INSERT: Users can create orders for themselves
CREATE POLICY "Orders Create Policy" ON orders
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- UPDATE: Admin Only (User cannot edit order after placed)
CREATE POLICY "Orders Admin Update Policy" ON orders
FOR UPDATE
USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- DELETE: Admin Only (Optional, usually we don't delete orders but cancel them)
CREATE POLICY "Orders Admin Delete Policy" ON orders
FOR DELETE
USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');


-- ==============================================================================
-- 6. RETURNS TABLE
-- Rule: Same as Orders. Users see own.
-- ==============================================================================

-- VIEW: Own returns OR Admin
CREATE POLICY "Returns View Policy" ON returns
FOR SELECT
USING (
  auth.uid() = user_id 
  OR 
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- INSERT: Users can request returns
CREATE POLICY "Returns Create Policy" ON returns
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- UPDATE: Admin Only (To approve/reject)
CREATE POLICY "Returns Admin Update Policy" ON returns
FOR UPDATE
USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- DELETE: Admin Only
CREATE POLICY "Returns Admin Delete Policy" ON returns
FOR DELETE
USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
