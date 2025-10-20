-- Create photos table
CREATE TABLE IF NOT EXISTS photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caption TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view photos" ON photos
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert photos" ON photos
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can delete photos" ON photos
  FOR DELETE USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_photos_created_at ON photos(created_at DESC);
