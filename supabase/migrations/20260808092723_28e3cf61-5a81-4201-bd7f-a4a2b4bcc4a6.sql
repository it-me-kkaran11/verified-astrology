CREATE TABLE public.partner_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.partner_leads TO anon;
GRANT INSERT ON public.partner_leads TO authenticated;
GRANT ALL ON public.partner_leads TO service_role;

ALTER TABLE public.partner_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can request partner access"
ON public.partner_leads FOR INSERT TO anon, authenticated
WITH CHECK (true);

CREATE TRIGGER update_partner_leads_updated_at
BEFORE UPDATE ON public.partner_leads
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();