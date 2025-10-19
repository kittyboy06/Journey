-- Create photos table for storing photo gallery entries
CREATE TABLE IF NOT EXISTS public.photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caption TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (no auth required for demo)
CREATE POLICY "Allow public read access on photos"
  ON public.photos FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert on photos"
  ON public.photos FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public delete on photos"
  ON public.photos FOR DELETE
  USING (true);

CREATE POLICY "Allow public update on photos"
  ON public.photos FOR UPDATE
  USING (true);
