-- Database Verification Script
-- This script checks if all tables and RLS policies are properly created

-- Check if all required tables exist
SELECT 
  'Tables Check' as check_type,
  CASE 
    WHEN COUNT(*) = 20 THEN 'PASS - All 20 tables exist'
    ELSE 'FAIL - Missing tables: ' || (20 - COUNT(*))::text
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'profiles', 'categories', 'artisans', 'motifs', 'products', 
  'product_media', 'product_motifs', 'variants', 'carts', 'cart_items',
  'addresses', 'orders', 'order_items', 'reviews', 'coupons',
  'pages', 'posts', 'media', 'audit_logs', 'settings'
);

-- Check if RLS is enabled on all tables
SELECT 
  'RLS Check' as check_type,
  CASE 
    WHEN COUNT(*) = 0 THEN 'PASS - RLS enabled on all tables'
    ELSE 'FAIL - RLS not enabled on: ' || string_agg(tablename, ', ')
  END as status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
  'profiles', 'categories', 'artisans', 'motifs', 'products', 
  'product_media', 'product_motifs', 'variants', 'carts', 'cart_items',
  'addresses', 'orders', 'order_items', 'reviews', 'coupons',
  'pages', 'posts', 'media', 'audit_logs', 'settings'
)
AND NOT EXISTS (
  SELECT 1 FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE c.relname = pg_tables.tablename
  AND n.nspname = 'public'
  AND c.relrowsecurity = true
);

-- Check if policies exist for key tables
SELECT 
  'Policies Check' as check_type,
  CASE 
    WHEN COUNT(*) >= 10 THEN 'PASS - Security policies exist'
    ELSE 'FAIL - Missing security policies: ' || COUNT(*)::text
  END as status
FROM pg_policies 
WHERE schemaname = 'public';

-- Check if functions and triggers exist
SELECT 
  'Functions Check' as check_type,
  CASE 
    WHEN COUNT(*) >= 3 THEN 'PASS - Required functions exist'
    ELSE 'FAIL - Missing functions'
  END as status
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('handle_new_user', 'update_updated_at_column');

-- Check if sample data exists
SELECT 
  'Sample Data Check' as check_type,
  CASE 
    WHEN (SELECT COUNT(*) FROM categories) > 0 
     AND (SELECT COUNT(*) FROM artisans) > 0 
     AND (SELECT COUNT(*) FROM motifs) > 0 
    THEN 'PASS - Sample data exists'
    ELSE 'FAIL - Missing sample data'
  END as status;

-- Final summary
SELECT 
  'SUMMARY' as check_type,
  'Database setup verification complete. Check results above.' as status;
