-- Insert initial categories
INSERT INTO categories (name, slug, description, sort_order) VALUES
('Mekhela Chador', 'mekhela-chador', 'Traditional Assamese two-piece attire for women', 1),
('Buwa Magur', 'buwa-magur', 'Traditional Assamese blouse worn with mekhela', 2),
('Gamusa', 'gamusa', 'Sacred Assamese towel with cultural significance', 3),
('Ethnic Wear', 'ethnic-wear', 'Contemporary ethnic clothing with traditional elements', 4);

-- Insert sample artisans
INSERT INTO artisans (name, village, region, bio, loom_type, years_experience, specialties) VALUES
('Kamala Devi', 'Sualkuchi', 'Kamrup', 'Master weaver specializing in traditional silk mekhela chador with intricate motifs', 'Handloom', 25, ARRAY['silk_weaving', 'traditional_motifs']),
('Ramen Kalita', 'Hajo', 'Kamrup', 'Expert in gamusa weaving with natural dyes and traditional patterns', 'Handloom', 18, ARRAY['cotton_weaving', 'natural_dyes']),
('Mina Bora', 'Majuli', 'Jorhat', 'Renowned for her contemporary interpretations of traditional Assamese textiles', 'Handloom', 22, ARRAY['contemporary_design', 'cultural_fusion']);

-- Insert traditional motifs
INSERT INTO motifs (name, meaning, description, cultural_significance) VALUES
('Kingkhap', 'Royal Pattern', 'Geometric diamond pattern symbolizing prosperity', 'Traditionally worn by royalty and during special occasions'),
('Phool', 'Flower', 'Floral motifs representing nature and beauty', 'Symbol of femininity and natural beauty in Assamese culture'),
('Tara', 'Star', 'Star patterns representing guidance and hope', 'Believed to bring good fortune and protection'),
('Kolka', 'Bud', 'Stylized flower bud patterns', 'Represents new beginnings and growth');

-- Insert sample products
INSERT INTO products (title, slug, description, cultural_story, care_instructions, price, category_id, artisan_id, status, stock_quantity, materials, weave_technique, time_to_weave_days, badges) VALUES
('Royal Silk Mekhela Chador - Kingkhap Design', 'royal-silk-mekhela-kingkhap', 
'Exquisite handwoven silk mekhela chador featuring the traditional Kingkhap motif in rich burgundy and gold.', 
'The Kingkhap pattern has been woven by Assamese artisans for centuries, originally created for royal families. Each diamond represents prosperity and the interconnected design symbolizes the unity of community.',
'Dry clean only. Store in cotton cloth. Avoid direct sunlight.',
15999.00, 
(SELECT id FROM categories WHERE slug = 'mekhela-chador'),
(SELECT id FROM artisans WHERE name = 'Kamala Devi'),
'published', 5, 
ARRAY['mulberry_silk', 'gold_thread'], 'Traditional Handloom', 15,
ARRAY['handwoven', 'natural_dyes', 'limited_edition']),

('Heritage Cotton Gamusa - Traditional Red Border', 'heritage-cotton-gamusa-red', 
'Authentic Assamese gamusa handwoven with organic cotton and natural red border dye.',
'The gamusa holds sacred significance in Assamese culture, used in religious ceremonies and as a symbol of respect. The red border represents the life force and is considered auspicious.',
'Hand wash with mild detergent. Air dry in shade.',
899.00,
(SELECT id FROM categories WHERE slug = 'gamusa'),
(SELECT id FROM artisans WHERE name = 'Ramen Kalita'),
'published', 25,
ARRAY['organic_cotton'], 'Traditional Handloom', 3,
ARRAY['handwoven', 'natural_dyes', 'fair_trade']);

-- Link products with motifs
INSERT INTO product_motifs (product_id, motif_id) VALUES
((SELECT id FROM products WHERE slug = 'royal-silk-mekhela-kingkhap'), (SELECT id FROM motifs WHERE name = 'Kingkhap')),
((SELECT id FROM products WHERE slug = 'heritage-cotton-gamusa-red'), (SELECT id FROM motifs WHERE name = 'Phool'));

-- Insert initial settings
INSERT INTO settings (key, value) VALUES
('store_name', '"Anima – The Ethic Store"'),
('store_description', '"Authentic Assamese textiles with cultural storytelling"'),
('business_hours', '{"open": "10:00", "close": "20:00", "timezone": "Asia/Kolkata"}'),
('contact_phone', '"+91 80112 55880"'),
('contact_email', '"info@animastore.com"'),
('whatsapp_number', '"+91 80112 55880"'),
('facebook_url', '"https://facebook.com/animastore"'),
('shipping_rates', '{"standard": 99, "expedited": 199, "free_threshold": 2000}'),
('tax_rate', '0.18'),
('currency', '"INR"'),
('payment_methods', '{"razorpay": true, "stripe": false}');

-- Insert sample pages
INSERT INTO pages (title, slug, content, is_published) VALUES
('About Us', 'about', 'Learn about our mission to preserve Assamese textile heritage through ethical trade and artisan empowerment.', true),
('Ethical Sourcing', 'ethical-sourcing', 'Our commitment to fair trade practices and supporting traditional artisans.', true),
('Care Guide', 'care-guide', 'How to care for your authentic Assamese textiles to ensure longevity.', true),
('Shipping & Returns', 'shipping-returns', 'Information about our shipping methods and return policy.', true);
