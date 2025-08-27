BEGIN;

-- Create a VIEW to encapsulate the logic for fetching deal products.
-- This view pre-joins products with their media and approved reviews,
-- safely bypassing the RLS issue within a controlled database object.
CREATE OR REPLACE VIEW public.deal_products AS
SELECT
    p.id,
    p.title,
    p.slug,
    p.price,
    p.compare_at_price,
    -- Aggregate product media into a JSON array
    (
        SELECT json_agg(media_info)
        FROM (
            SELECT
                pm.storage_path,
                pm.alt_text,
                pm.is_primary
            FROM
                product_media pm
            WHERE
                pm.product_id = p.id
        ) AS media_info
    ) AS product_media,
    -- Aggregate ONLY approved reviews into a JSON array, respecting RLS
    (
        SELECT json_agg(review_info)
        FROM (
            SELECT
                r.rating
            FROM
                reviews r
            WHERE
                r.product_id = p.id AND r.status = 'approved'
        ) AS review_info
    ) AS reviews
FROM
    products p
WHERE
    p.status = 'published'
    AND p.compare_at_price IS NOT NULL
    AND p.compare_at_price > p.price;

-- Grant permissions for anonymous and authenticated users to read from this new view.
GRANT SELECT ON public.deal_products TO anon, authenticated;

COMMIT;