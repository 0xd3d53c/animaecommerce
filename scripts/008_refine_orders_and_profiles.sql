BEGIN;

-- This script refines the database schema to properly support the production checkout logic.
-- It moves address storage to the 'profiles' table and cleans up the 'orders' table.

-- Step 1: Add a JSONB column to the 'profiles' table to store an array of addresses.
-- This is a more scalable approach for managing user addresses.
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS addresses JSONB;

-- Step 2: Remove the temporary, flat columns that were added to the 'orders' table.
-- The application logic has been corrected to no longer use these.
ALTER TABLE public.orders
DROP COLUMN IF EXISTS first_name,
DROP COLUMN IF EXISTS last_name,
DROP COLUMN IF EXISTS email,
DROP COLUMN IF EXISTS phone,
DROP COLUMN IF EXISTS address,
DROP COLUMN IF EXISTS city,
DROP COLUMN IF EXISTS state,
DROP COLUMN IF EXISTS postal_code,
DROP COLUMN IF EXISTS total;

-- Step 3: Ensure the proper JSONB address columns exist on the 'orders' table.
-- The original schema (001) should have already created these.
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS shipping_address JSONB,
ADD COLUMN IF NOT EXISTS billing_address JSONB;

CREATE POLICY "Users can create their own order items"
ON public.order_items
FOR INSERT
TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.orders
    WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
  )
);

COMMIT;