ALTER TABLE products 
ADD COLUMN IF NOT EXISTS care_instructions TEXT,
ADD COLUMN IF NOT EXISTS material TEXT,
ADD COLUMN IF NOT EXISTS dimensions TEXT;

COMMENT ON COLUMN products.care_instructions IS 'Care and usage instructions for the product';
COMMENT ON COLUMN products.material IS 'Material composition of the product';
COMMENT ON COLUMN products.dimensions IS 'Physical dimensions of the product';
