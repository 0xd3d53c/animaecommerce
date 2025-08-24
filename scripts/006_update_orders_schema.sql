-- Update orders table to include proper payment tracking fields
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_reference TEXT,
ADD COLUMN IF NOT EXISTS payment_status payment_status DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS order_number TEXT;

-- Generate order numbers for existing orders
UPDATE orders 
SET order_number = 'ORD-' || EXTRACT(YEAR FROM created_at) || '-' || LPAD(EXTRACT(DOY FROM created_at)::TEXT, 3, '0') || '-' || LPAD(id::TEXT, 6, '0')
WHERE order_number IS NULL;

-- Make order_number NOT NULL after populating existing records
ALTER TABLE orders ALTER COLUMN order_number SET NOT NULL;

-- Add unique constraint
ALTER TABLE orders ADD CONSTRAINT orders_order_number_unique UNIQUE (order_number);

-- Update the orders table structure to match the new schema
ALTER TABLE orders 
RENAME COLUMN total TO total_amount;

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS tax_amount DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS shipping_amount DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10,2) DEFAULT 0;

-- Update existing orders to have proper totals
UPDATE orders 
SET subtotal = total_amount,
    shipping_amount = CASE 
      WHEN shipping_method = 'standard' THEN 99
      WHEN shipping_method = 'express' THEN 199
      ELSE 0
    END
WHERE subtotal IS NULL;

-- Create index for order number lookups
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
