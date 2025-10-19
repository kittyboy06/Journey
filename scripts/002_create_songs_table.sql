-- Create songs table for storing liked songs
CREATE TABLE IF NOT EXISTS public.songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  spotify_embed_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (no auth required for demo)
CREATE POLICY "Allow public read access on songs"
  ON public.songs FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert on songs"
  ON public.songs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public delete on songs"
  ON public.songs FOR DELETE
  USING (true);

CREATE POLICY "Allow public update on songs"
  ON public.songs FOR UPDATE
  USING (true);
