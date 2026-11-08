DROP POLICY IF EXISTS "public read settings" ON public.site_settings;
CREATE POLICY "admin read settings" ON public.site_settings FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
REVOKE SELECT ON public.site_settings FROM anon;
CREATE OR REPLACE FUNCTION public.get_site_settings()
RETURNS SETOF public.site_settings
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT * FROM public.site_settings WHERE id = 1 $$;
REVOKE ALL ON FUNCTION public.get_site_settings() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_site_settings() TO anon, authenticated;