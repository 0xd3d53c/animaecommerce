-- This script adds the missing Row-Level Security (RLS) policy
-- to allow authenticated users to create new orders for themselves.

BEGIN;

-- Create the policy that allows a user to insert an order if the user_id matches their own.
CREATE POLICY "Users can create their own orders"
ON public.orders
FOR INSERT
TO authenticated -- This policy applies only to logged-in users
WITH CHECK (auth.uid() = user_id);

-- Alter the 'order_number' column to set its default value by calling the
-- generate_order_number() function, which was created in a previous script.
ALTER TABLE public.orders
ALTER COLUMN order_number SET DEFAULT generate_order_number();

COMMIT;