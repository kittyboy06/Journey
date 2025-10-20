-- Create songs table
CREATE TABLE IF NOT EXISTS songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  spotify_embed_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view songs" ON songs
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert songs" ON songs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can delete songs" ON songs
  FOR DELETE USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_songs_created_at ON songs(created_at DESC);
