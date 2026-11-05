UPDATE public.projects SET image_url = regexp_replace(image_url, '^/__l5e/assets-v1/[^/]+/', '/media/') WHERE image_url LIKE '/__l5e/%';
UPDATE public.media_items SET url = regexp_replace(url, '^/__l5e/assets-v1/[^/]+/', '/media/') WHERE url LIKE '/__l5e/%';
UPDATE public.news_articles SET image_url = regexp_replace(image_url, '^/__l5e/assets-v1/[^/]+/', '/media/') WHERE image_url LIKE '/__l5e/%';

UPDATE public.projects p SET image_url = v.u FROM (VALUES
 ('cps-madara','/media/ev_1793741432563.jpg'),
 ('magonshi-cps','/media/ev_1793741435915.jpg'),
 ('yagana-katsalle-ps','/media/ev_1793741378921.jpg'),
 ('behind-adp-azare','/media/ev_1793741368926.jpg'),
 ('bulkachuwa-jss','/media/ev_1793741366266.jpg'),
 ('buskuri-ps','/media/ev_1793741350863.jpg'),
 ('kujuru-ps','/media/ev_1793741435915.jpg'),
 ('kakudi-ps','/media/ev_1793741432563.jpg'),
 ('sabon-layi-islamiyya','/media/ev_1793741350863.jpg'),
 ('dagalwa-islamiyya','/media/ev_1793741378921.jpg'),
 ('gss-chinade-ict','/media/ev_1793741424091.jpg'),
 ('madara-ict','/media/ev_1793741415603.jpg'),
 ('ggc-azare-ict','/media/ev_1793741360166.jpg'),
 ('student-transit-buses','/media/ev_1793741347020.jpg'),
 ('primary-textbooks','/media/imba_achievements_poster.jpg'),
 ('scholarships-grants','/media/imba_seated_notes.jpg'),
 ('kiwon-lafiya','/media/ev_1793741381990.jpg'),
 ('ruwan-sha','/media/ev_1793741421065.jpg'),
 ('ayyukan-yi','/media/ev_1793741387531.jpg'),
 ('raya-kasa','/media/ev_1793741396309.jpg'),
 ('romon-dimokuradiyya','/media/ev_1793741399070.jpg'),
 ('women-empowerment','/media/imba_seated_event.jpg'),
 ('legislative-advocacy','/media/imba_speaking_rally.jpg')
) AS v(s,u) WHERE p.slug = v.s AND p.image_url IS NULL;

CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  event_type text NOT NULL DEFAULT 'Campaign Rally',
  starts_at timestamptz NOT NULL,
  venue text,
  lga text NOT NULL DEFAULT 'Katagum',
  description text,
  image_url text,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.events TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read events" ON public.events FOR SELECT USING (published OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin write events" ON public.events FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));