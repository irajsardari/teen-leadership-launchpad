-- Create audio-cache storage bucket for TMA Voices
INSERT INTO storage.buckets (id, name, public) 
VALUES ('audio-cache', 'audio-cache', false)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow authenticated users to read their cached audio
CREATE POLICY "Users can read cached audio" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'audio-cache');

-- Create policy to allow the system to upload cached audio  
CREATE POLICY "System can upload cached audio" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'audio-cache');

-- Create policy to allow updating cached audio
CREATE POLICY "System can update cached audio" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'audio-cache');