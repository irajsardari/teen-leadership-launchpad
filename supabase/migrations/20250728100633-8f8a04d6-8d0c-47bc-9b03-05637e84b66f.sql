-- Enable Row Level Security on challengers table
ALTER TABLE public.challengers ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Policy 1: Allow anyone to insert challenger registrations (public registration)
CREATE POLICY "Anyone can register as challenger" 
ON public.challengers 
FOR INSERT 
WITH CHECK (true);

-- Policy 2: Users can only view their own challenger records
CREATE POLICY "Users can view own challenger records" 
ON public.challengers 
FOR SELECT 
USING (user_id = auth.uid());

-- Policy 3: Admins can view all challenger records
CREATE POLICY "Admins can view all challenger records" 
ON public.challengers 
FOR SELECT 
USING (public.get_current_user_role() = 'admin');

-- Policy 4: Users can update their own challenger records
CREATE POLICY "Users can update own challenger records" 
ON public.challengers 
FOR UPDATE 
USING (user_id = auth.uid());

-- Policy 5: Admins can update any challenger records
CREATE POLICY "Admins can update all challenger records" 
ON public.challengers 
FOR UPDATE 
USING (public.get_current_user_role() = 'admin');

-- Policy 6: Users can delete their own challenger records
CREATE POLICY "Users can delete own challenger records" 
ON public.challengers 
FOR DELETE 
USING (user_id = auth.uid());

-- Policy 7: Admins can delete any challenger records
CREATE POLICY "Admins can delete all challenger records" 
ON public.challengers 
FOR DELETE 
USING (public.get_current_user_role() = 'admin');