-- Create storage buckets for photos and songs
-- Run this in the Supabase SQL Editor

-- Create photos bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- Create songs bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('songs', 'songs', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for photos bucket
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'photos');

CREATE POLICY "Authenticated users can upload photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'photos');

CREATE POLICY "Users can delete their own photos" ON storage.objects
  FOR DELETE USING (bucket_id = 'photos');

-- Set up RLS policies for songs bucket
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'songs');

CREATE POLICY "Authenticated users can upload songs" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'songs');

CREATE POLICY "Users can delete their own songs" ON storage.objects
  FOR DELETE USING (bucket_id = 'songs');
