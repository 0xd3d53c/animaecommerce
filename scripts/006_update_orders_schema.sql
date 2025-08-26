BEGIN;

-- This script enhances the 'orders' table with better tracking and financial details.

-- Add columns for payment tracking if they do not already exist.
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS payment_reference TEXT,
ADD COLUMN IF NOT EXISTS payment_status payment_status DEFAULT 'pending';

-- Add a column for the user-friendly order number if it doesn't exist.
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS order_number TEXT;

-- Generate unique, user-friendly order numbers for any existing orders that might be missing one.
UPDATE public.orders
SET order_number = 'ORD-' || EXTRACT(YEAR FROM created_at) || '-' || LPAD(EXTRACT(DOY FROM created_at)::TEXT, 3, '0') || '-' || LPAD(id::TEXT, 6, '0')
WHERE order_number IS NULL;

-- Now that all rows have a value, enforce the NOT NULL constraint.
-- We wrap this in a DO block to handle cases where the constraint might already exist.
DO $$
BEGIN
    -- Check if the column is nullable before trying to alter it.
    IF (SELECT is_nullable FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'order_number') = 'YES' THEN
        ALTER TABLE public.orders ALTER COLUMN order_number SET NOT NULL;
    END IF;
END;
$$;


-- Add a unique constraint to ensure no two orders have the same order number.
-- We wrap this in a DO block to handle cases where the constraint might already exist.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'orders_order_number_unique' AND conrelid = 'public.orders'::regclass
    ) THEN
        ALTER TABLE public.orders ADD CONSTRAINT orders_order_number_unique UNIQUE (order_number);
    END IF;
END;
$$;


-- Add columns for detailed financial breakdowns if they don't exist.
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS tax_amount DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS shipping_amount DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10,2) DEFAULT 0;

-- For existing orders, populate the new financial columns based on available data.
-- CORRECTED: Changed 'express' to 'expedited' to match the enum definition.
UPDATE public.orders
SET
    subtotal = total_amount - COALESCE(shipping_amount, 0) - COALESCE(tax_amount, 0) + COALESCE(discount_amount, 0),
    shipping_amount = CASE
      WHEN shipping_method = 'standard' THEN 99
      WHEN shipping_method = 'expedited' THEN 199 -- Corrected value
      ELSE 0
    END
WHERE subtotal IS NULL; -- Only update rows that haven't been processed yet.

-- Create an index on the order_number for faster lookups.
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);

COMMIT;