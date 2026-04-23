
-- 1. Fix content table: remove overly permissive ALL policy for authenticated users
DROP POLICY IF EXISTS "Authenticated users can manage content" ON public.content;

-- Add scoped write policies for content
CREATE POLICY "Authors can insert their own content"
ON public.content FOR INSERT
TO authenticated
WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors can update their own content"
ON public.content FOR UPDATE
TO authenticated
USING (author_id = auth.uid())
WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors can delete their own content"
ON public.content FOR DELETE
TO authenticated
USING (author_id = auth.uid());

-- Authenticated users can view all content (not just published)
CREATE POLICY "Authenticated users can view all content"
ON public.content FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);

-- 2. Fix lexicon_generation_queue: restrict INSERT to authenticated users only
DROP POLICY IF EXISTS "Anyone can request term generation" ON public.lexicon_generation_queue;

CREATE POLICY "Authenticated users can request term generation"
ON public.lexicon_generation_queue FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- 3. Fix audio-cache storage bucket: add auth checks
-- Drop existing public policies on audio-cache
DROP POLICY IF EXISTS "Public audio cache read" ON storage.objects;
DROP POLICY IF EXISTS "Public audio cache insert" ON storage.objects;
DROP POLICY IF EXISTS "Public audio cache update" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can read audio cache" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can insert audio cache" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update audio cache" ON storage.objects;
DROP POLICY IF EXISTS "audio_cache_public_read" ON storage.objects;
DROP POLICY IF EXISTS "audio_cache_public_insert" ON storage.objects;
DROP POLICY IF EXISTS "audio_cache_public_update" ON storage.objects;
DROP POLICY IF EXISTS "audio_cache_select" ON storage.objects;
DROP POLICY IF EXISTS "audio_cache_insert" ON storage.objects;
DROP POLICY IF EXISTS "audio_cache_update" ON storage.objects;

-- Recreate with auth checks
CREATE POLICY "Authenticated users can read audio cache"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'audio-cache');

CREATE POLICY "Authenticated users can insert audio cache"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'audio-cache');

CREATE POLICY "Authenticated users can update audio cache"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'audio-cache');
