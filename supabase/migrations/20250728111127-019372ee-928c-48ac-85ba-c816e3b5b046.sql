-- Add new columns to challengers table for expanded registration
ALTER TABLE public.challengers 
ADD COLUMN country TEXT,
ADD COLUMN city TEXT,
ADD COLUMN gender TEXT,
ADD COLUMN guardian_email TEXT,
ADD COLUMN referral_source TEXT;