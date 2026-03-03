-- Add variants column to products table
-- Structure will be a JSONB array of objects: [{ "name": "50x70cm", "price": 250, "stock": 10 }]

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]'::jsonb;

-- Comment for the column
COMMENT ON COLUMN products.variants IS 'Array of size/option variants with separate prices and stock';
