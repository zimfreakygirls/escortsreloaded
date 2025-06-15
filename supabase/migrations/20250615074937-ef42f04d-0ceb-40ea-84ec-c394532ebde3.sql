
-- Create a table to store site status
CREATE TABLE public.site_status (
  id TEXT PRIMARY KEY DEFAULT 'global',
  is_online BOOLEAN NOT NULL DEFAULT true,
  maintenance_message TEXT DEFAULT 'The site is currently under maintenance. Please check back later.',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Insert default record
INSERT INTO public.site_status (id, is_online) VALUES ('global', true);

-- Enable RLS
ALTER TABLE public.site_status ENABLE ROW LEVEL SECURITY;

-- Allow admins to read site status
CREATE POLICY "Admins can view site status" 
  ON public.site_status 
  FOR SELECT 
  USING (true);

-- Allow admins to update site status (you'll need to implement admin check)
CREATE POLICY "Admins can update site status" 
  ON public.site_status 
  FOR UPDATE 
  USING (true);
