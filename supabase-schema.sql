-- ==============================================================================
-- SURYA TEJA PORTFOLIO · ONLINE DATABASE & STORAGE SETUP SCRIPT
-- ==============================================================================
-- Run this entire script in your Supabase project's SQL Editor (Dashboard > SQL Editor > New query).
-- It creates the tables for:
--   1. 'portfolio_content' (Projects, Case Studies, Profile bio, Process steps, Principles)
--   2. 'portfolio_messages' (Visitor inquiries and contact form submissions)
--   3. 'portfolio-assets' (Public Storage Bucket for compressed WebP images)
-- ==============================================================================

-- 1. PORTFOLIO CONTENT TABLE (Projects, Case Studies, Profile, Steps, Principles)
CREATE TABLE IF NOT EXISTS public.portfolio_content (
  key text PRIMARY KEY,
  data jsonb NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.portfolio_content ENABLE ROW LEVEL SECURITY;

-- Allow EVERY visitor on any device to view your portfolio content
DROP POLICY IF EXISTS "Public can view portfolio content" ON public.portfolio_content;
CREATE POLICY "Public can view portfolio content"
  ON public.portfolio_content
  FOR SELECT
  USING (true);

-- Allow saving and editing portfolio content
DROP POLICY IF EXISTS "Allow write portfolio content" ON public.portfolio_content;
CREATE POLICY "Allow write portfolio content"
  ON public.portfolio_content
  FOR ALL
  USING (true)
  WITH CHECK (true);


-- 2. VISITOR INQUIRIES & MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.portfolio_messages (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  topic text DEFAULT 'General Inquiry',
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for messages
ALTER TABLE public.portfolio_messages ENABLE ROW LEVEL SECURITY;

-- Allow visitors to send you messages through the contact form
DROP POLICY IF EXISTS "Anyone can submit a message" ON public.portfolio_messages;
CREATE POLICY "Anyone can submit a message"
  ON public.portfolio_messages
  FOR INSERT
  WITH CHECK (true);

-- Allow reading messages in your Admin Studio inbox
DROP POLICY IF EXISTS "Allow read portfolio messages" ON public.portfolio_messages;
CREATE POLICY "Allow read portfolio messages"
  ON public.portfolio_messages
  FOR SELECT
  USING (true);

-- Allow marking messages as read or deleting messages
DROP POLICY IF EXISTS "Allow modify portfolio messages" ON public.portfolio_messages;
CREATE POLICY "Allow modify portfolio messages"
  ON public.portfolio_messages
  FOR ALL
  USING (true)
  WITH CHECK (true);


-- 3. STORAGE BUCKET FOR HIGH-RESOLUTION CASE STUDY IMAGES ('portfolio-assets')
-- Creates the public bucket with generous 50MB limit to preserve 100% original quality
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-assets',
  'portfolio-assets',
  true,
  52428800, -- 50MB maximum file size to support 100% uncompressed high-res case study mockups
  ARRAY['image/webp', 'image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = 52428800;

-- Allow everyone to read images from the CDN
DROP POLICY IF EXISTS "Public access to portfolio assets" ON storage.objects;
CREATE POLICY "Public access to portfolio assets"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'portfolio-assets');

-- Allow image uploads from the Admin Studio
DROP POLICY IF EXISTS "Allow uploads to portfolio assets" ON storage.objects;
CREATE POLICY "Allow uploads to portfolio assets"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'portfolio-assets');

-- Allow updating and deleting uploaded images
DROP POLICY IF EXISTS "Allow modify portfolio assets" ON storage.objects;
CREATE POLICY "Allow modify portfolio assets"
  ON storage.objects
  FOR ALL
  USING (bucket_id = 'portfolio-assets')
  WITH CHECK (bucket_id = 'portfolio-assets');

-- Done! Your Supabase database and storage are now 100% ready.
