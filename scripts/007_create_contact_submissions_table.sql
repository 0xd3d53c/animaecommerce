-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  category TEXT NOT NULL CHECK (category IN ('general', 'order', 'product', 'wholesale', 'artisan', 'press')),
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_category ON contact_submissions(category);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);

-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admin can view all contact submissions" ON contact_submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admin can update contact submissions" ON contact_submissions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Allow anonymous users to insert contact submissions
CREATE POLICY "Anyone can submit contact form" ON contact_submissions
  FOR INSERT WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_contact_submissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_contact_submissions_updated_at
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_contact_submissions_updated_at();

  -- Step 1: Disassociate all existing products from their categories.
UPDATE products SET category_id = NULL;

-- Step 2: Delete all old categories.
DELETE FROM categories;

-- Step 3: Insert the new, simplified, top-level categories without descriptions.
-- The sort_order has been made sequential.
INSERT INTO categories (name, slug, sort_order) VALUES
('Muga Silk', 'muga-silk', 1),
('Eri Silk', 'eri-silk', 2),
('Pat Silk', 'pat-silk', 3),
('Cotton', 'cotton', 4),
('Handloom', 'handloom', 5),
('Hand-embroidered', 'hand-embroidered', 6),
('Zari Woven', 'zari-woven', 7),
('Traditional', 'traditional', 8),
('Bridal', 'bridal', 9),
('Casual', 'casual', 10);

-- Step 4: Re-associate existing products with the new categories based on product titles.
-- Fabric Types
UPDATE products SET category_id = (SELECT id FROM categories WHERE slug = 'muga-silk') WHERE title ILIKE '%Muga Silk%';
UPDATE products SET category_id = (SELECT id FROM categories WHERE slug = 'eri-silk') WHERE title ILIKE '%Eri Silk%';
UPDATE products SET category_id = (SELECT id FROM categories WHERE slug = 'pat-silk') WHERE title ILIKE '%Pat Silk%';
UPDATE products SET category_id = (SELECT id FROM categories WHERE slug = 'cotton') WHERE title ILIKE '%Cotton%';

-- Workmanship & Design
UPDATE products SET category_id = (SELECT id FROM categories WHERE slug = 'handloom') WHERE title ILIKE '%Handloom%';
UPDATE products SET category_id = (SELECT id FROM categories WHERE slug = 'hand-embroidered') WHERE title ILIKE '%embroidered%';
UPDATE products SET category_id = (SELECT id FROM categories WHERE slug = 'zari-woven') WHERE title ILIKE '%Zari%';

-- Occasion & Style
UPDATE products SET category_id = (SELECT id FROM categories WHERE slug = 'traditional') WHERE title ILIKE '%Traditional%';
UPDATE products SET category_id = (SELECT id FROM categories WHERE slug = 'bridal') WHERE title ILIKE '%Bridal%';
UPDATE products SET category_id = (SELECT id FROM categories WHERE slug = 'casual') WHERE title ILIKE '%Casual%';
