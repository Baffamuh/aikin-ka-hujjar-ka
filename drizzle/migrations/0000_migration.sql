create type public.app_role as enum ('admin','moderator','user');
create table public.user_roles (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade not null, role app_role not null, unique(user_id, role));
grant select on public.user_roles to authenticated; grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create or replace function public.has_role(_user_id uuid, _role app_role) returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from public.user_roles where user_id=_user_id and role=_role) $$;
create policy "own roles" on public.user_roles for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));

create or replace function public.admin_exists() returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from public.user_roles where role='admin') $$;
grant execute on function public.admin_exists() to anon, authenticated;

create or replace function public.handle_first_admin() returns trigger language plpgsql security definer set search_path=public as $$
begin
  if not exists(select 1 from public.user_roles where role='admin') then
    insert into public.user_roles(user_id, role) values (new.id,'admin');
  end if;
  return new;
end $$;
create trigger on_auth_user_created_first_admin after insert on auth.users for each row execute function public.handle_first_admin();

create or replace function public.touch_updated_at() returns trigger language plpgsql set search_path=public as $$ begin new.updated_at = now(); return new; end $$;

-- projects
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null, slug text unique not null, category text not null,
  tenure text not null default 'completed', -- completed | commitment
  lga text not null default 'Katagum', location text, year int, status text not null default 'Completed',
  summary text, scope text, image_url text, featured boolean not null default false, sort_order int not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now());
grant select on public.projects to anon, authenticated; grant insert, update, delete on public.projects to authenticated; grant all on public.projects to service_role;
alter table public.projects enable row level security;
create policy "public read projects" on public.projects for select using (true);
create policy "admin write projects" on public.projects for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger t_projects before update on public.projects for each row execute function public.touch_updated_at();

-- news
create table public.news_articles (
  id uuid primary key default gen_random_uuid(), title text not null, slug text unique not null,
  category text not null default 'Community Engagement', excerpt text, body text, image_url text,
  published boolean not null default true, published_at timestamptz not null default now(),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now());
grant select on public.news_articles to anon, authenticated; grant insert, update, delete on public.news_articles to authenticated; grant all on public.news_articles to service_role;
alter table public.news_articles enable row level security;
create policy "public read news" on public.news_articles for select using (published or public.has_role(auth.uid(),'admin'));
create policy "admin write news" on public.news_articles for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger t_news before update on public.news_articles for each row execute function public.touch_updated_at();

-- media
create table public.media_items (
  id uuid primary key default gen_random_uuid(), title text not null, category text not null default 'Community Engagements',
  media_type text not null default 'photo', url text not null, caption text, sort_order int not null default 0,
  created_at timestamptz not null default now());
grant select on public.media_items to anon, authenticated; grant insert, update, delete on public.media_items to authenticated; grant all on public.media_items to service_role;
alter table public.media_items enable row level security;
create policy "public read media" on public.media_items for select using (true);
create policy "admin write media" on public.media_items for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- settings
create table public.site_settings (
  id int primary key default 1 check (id = 1),
  hero_title text not null default 'Hon. Ibrahim Mohammed Baba (IMBA)',
  hero_subtitle text not null default 'A proven legislator. A record you can verify. Now seeking to serve all seven LGAs of Bauchi North in the Senate.',
  slogan text not null default 'Aikin Ka Hujjar Ka',
  office_address text not null default 'IMBA Constituency Office, Azare, Katagum LGA, Bauchi State',
  phone text not null default '+234 800 000 0000', email text not null default 'office@imba.ng', office_hours text not null default 'Mon – Fri, 9:00am – 4:00pm',
  updated_at timestamptz not null default now());
grant select on public.site_settings to anon, authenticated; grant update on public.site_settings to authenticated; grant all on public.site_settings to service_role;
alter table public.site_settings enable row level security;
create policy "public read settings" on public.site_settings for select using (true);
create policy "admin update settings" on public.site_settings for update to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
insert into public.site_settings(id) values (1);

-- complaints
create table public.complaints (
  id uuid primary key default gen_random_uuid(), tracking_code text unique not null,
  full_name text not null, phone text not null, email text, lga text not null, ward text not null,
  category text not null, subject text not null, message text not null,
  status text not null default 'Submitted', public_remarks text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now());
grant select, update, delete on public.complaints to authenticated; grant all on public.complaints to service_role;
alter table public.complaints enable row level security;
create policy "admin read complaints" on public.complaints for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin update complaints" on public.complaints for update to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "admin delete complaints" on public.complaints for delete to authenticated using (public.has_role(auth.uid(),'admin'));
create trigger t_complaints before update on public.complaints for each row execute function public.touch_updated_at();

create or replace function public.submit_complaint(_full_name text, _phone text, _email text, _lga text, _ward text, _category text, _subject text, _message text)
returns text language plpgsql security definer set search_path=public as $$
declare code text; tries int := 0;
begin
  if length(trim(coalesce(_full_name,''))) < 2 or length(_full_name) > 120 then raise exception 'Invalid name'; end if;
  if length(trim(coalesce(_phone,''))) < 7 or length(_phone) > 20 then raise exception 'Invalid phone'; end if;
  if _email is not null and length(_email) > 255 then raise exception 'Invalid email'; end if;
  if _lga not in ('Katagum','Jama''are','Itas/Gadau','Zaki','Gamawa','Shira','Giade') then raise exception 'Invalid LGA'; end if;
  if length(trim(coalesce(_ward,''))) < 2 or length(_ward) > 100 then raise exception 'Invalid ward'; end if;
  if length(trim(coalesce(_category,''))) < 2 or length(_category) > 60 then raise exception 'Invalid category'; end if;
  if length(trim(coalesce(_subject,''))) < 3 or length(_subject) > 200 then raise exception 'Invalid subject'; end if;
  if length(trim(coalesce(_message,''))) < 10 or length(_message) > 4000 then raise exception 'Invalid message'; end if;
  loop
    code := 'IMBA-' || to_char(now(),'YYYY') || '-' || upper(substr(translate(encode(gen_random_bytes(6),'base64'),'+/=0O1lI','XYZ'),1,5));
    exit when not exists(select 1 from complaints where tracking_code=code);
    tries := tries + 1; if tries > 10 then raise exception 'Could not generate code'; end if;
  end loop;
  insert into complaints(tracking_code, full_name, phone, email, lga, ward, category, subject, message)
  values (code, trim(_full_name), trim(_phone), nullif(trim(coalesce(_email,'')),''), _lga, trim(_ward), trim(_category), trim(_subject), trim(_message));
  return code;
end $$;
grant execute on function public.submit_complaint(text,text,text,text,text,text,text,text) to anon, authenticated;

create or replace function public.track_complaint(_code text)
returns table(tracking_code text, lga text, category text, subject text, status text, public_remarks text, created_at timestamptz, updated_at timestamptz)
language sql stable security definer set search_path=public as $$
  select c.tracking_code, c.lga, c.category, c.subject, c.status, c.public_remarks, c.created_at, c.updated_at
  from complaints c where c.tracking_code = upper(trim(_code)) limit 1 $$;
grant execute on function public.track_complaint(text) to anon, authenticated;

-- SEED projects
insert into public.projects(title, slug, category, tenure, lga, location, year, status, summary, scope, image_url, featured, sort_order) values
('Central Primary School Yayu','cps-yayu','Education','completed','Katagum','Yayu',2017,'Completed','Three new classroom blocks with staff offices and furniture.','Construction of 3 blocks comprising 9 classrooms, 3 staff offices, and classroom furniture.','/__l5e/assets-v1/9592dee4-f970-4ee1-9c57-a6dcd390bbbb/imba_achievements_poster.jpg',true,1),
('Central Primary School Madara','cps-madara','Education','completed','Katagum','Madara',2017,'Completed','Six equipped classrooms with sanitation facilities.','Construction of 2 blocks of 6 classrooms equipped with student desks, staff offices, and 4 VIP toilets.',null,true,2),
('Magonshi Central Primary School','magonshi-cps','Education','completed','Katagum','Magonshi',2018,'Completed','Two classroom blocks with staff offices and seating.','Construction of 2 blocks of 6 classrooms, 2 staff offices, and standard student seating.',null,false,3),
('Yagana / Katsalle Primary School','yagana-katsalle-ps','Education','completed','Katagum','Yagana / Katsalle, Azare',2018,'Completed','A brand-new, fully equipped primary school for Azare.','Brand-new comprehensive school establishment comprising 3 blocks of 15 classrooms, staff administrative offices, modern toilets, and full furniture.',null,true,4),
('Classrooms Behind ADP, Azare','behind-adp-azare','Education','completed','Katagum','Behind ADP, Azare',2018,'Completed','Two modern classrooms and an admin office.','Construction of 2 modern classrooms and administrative office.',null,false,5),
('Bulkachuwa Upper Basic JSS','bulkachuwa-jss','Education','completed','Katagum','Bulkachuwa',2018,'Completed','Junior secondary expansion with store and toilets.','Construction of 3 blocks with 5 classrooms, staff office, store, and toilet facilities.',null,false,6),
('Buskuri Primary School Wing','buskuri-ps','Education','completed','Katagum','Buskuri',2017,'Completed','New three-classroom wing.','New primary school wing comprising 3 classrooms.',null,false,7),
('Kujuru Primary School, Azare','kujuru-ps','Education','completed','Katagum','Kujuru, Azare',2018,'Completed','Classroom block with office and store.','Construction of 1 block of 2 classrooms, staff office, and store.',null,false,8),
('Kakudi Primary School','kakudi-ps','Education','completed','Katagum','Kakudi',2018,'Completed','Two modern classrooms with office and store.','Construction of 2 modern classrooms, staff office, and store.',null,false,9),
('Sabon Layi Nassarawa B Modern Islamiyya','sabon-layi-islamiyya','Education','completed','Katagum','Sabon Layi Nassarawa B, Azare',2018,'Completed','Islamiyya classrooms with seating and materials.','Construction of 2 classrooms, student seating, and instructional materials.',null,false,10),
('Gundumar Dagalwa Modern Islamiyya','dagalwa-islamiyya','Education','completed','Katagum','Gundumar Dagalwa',2019,'Completed','Two Islamiyya classrooms with seating.','Construction of 2 classrooms with student seating.',null,false,11),
('GSS Chinade ICT Centre','gss-chinade-ict','ICT & Technology','completed','Katagum','GSS Chinade',2018,'Completed','40+ computers with solar backup.','Established and furnished with over 40 desktop computers, networking, and solar inverter backup.',null,true,12),
('Madara ICT Centre','madara-ict','ICT & Technology','completed','Katagum','Madara',2018,'Completed','Upgraded digital learning centre.','Fully upgraded and equipped digital learning centre.',null,false,13),
('GGC Azare ICT Centre','ggc-azare-ict','ICT & Technology','completed','Katagum','GGC Azare',2019,'Completed','Modern computer lab for girls.','Modern computer lab and digital resource centre.',null,true,14),
('Student Transit Buses','student-transit-buses','Student Welfare','completed','Katagum','Azare & environs',2017,'Completed','3 buses for free daily student transport.','Deployment of 3 dedicated mass transit buses for free daily student transportation in Azare and surrounding communities.',null,true,15),
('10,000+ Primary Textbooks','primary-textbooks','Student Welfare','completed','Katagum','All wards',2018,'Completed','Textbooks for Primary 1–6 across all wards.','Procurement and distribution of 10,000+ primary school textbooks (Primary 1–6) across all wards.',null,false,16),
('Scholarships & Community Grants','scholarships-grants','Community Empowerment','completed','Katagum','Katagum Constituency',2019,'Completed','Educational subsidies and grants incl. FOMWAN Katagum.','Direct educational subsidies and community grants to faith and community bodies, including FOMWAN Katagum.',null,false,17),
('Kiwon Lafiya: Primary Healthcare Upgrade','kiwon-lafiya','Healthcare','commitment','All 7 LGAs','Bauchi North',null,'Planned','Upgrade PHCs and run free medical outreaches.','Advocate federal funding to equip primary healthcare centres and organise free medical and eye outreaches across all 7 LGAs.',null,false,20),
('Samar da Ruwan Sha: Solar Boreholes','ruwan-sha','Clean Water','commitment','All 7 LGAs','Bauchi North',null,'Planned','Solar-powered boreholes for rural communities.','Constituency projects for solar boreholes and water schemes in underserved wards.',null,false,21),
('Samar da Ayyukan Yi: Youth Skills','ayyukan-yi','Jobs & Youth','commitment','All 7 LGAs','Bauchi North',null,'Planned','Skills acquisition and starter packs for youth.','Vocational and digital skills programmes with starter packs, plus federal job placement advocacy.',null,false,22),
('Ayyukan Raya Kasa: Rural Roads & Power','raya-kasa','Infrastructure','commitment','All 7 LGAs','Bauchi North',null,'Planned','Rural roads and electrification.','Push for federal inclusion of rural feeder roads, culverts and rural electrification projects.',null,false,23),
('Rabon Romon Dimokuradiyya: Farm Inputs','romon-dimokuradiyya','Agriculture','commitment','All 7 LGAs','Bauchi North',null,'Planned','Fertiliser, seedlings and irrigation support.','Distribution of agricultural inputs and support for irrigation farming along the Jama''are and Katagum river basins.',null,false,24),
('Women Empowerment Fund','women-empowerment','Women Empowerment','commitment','All 7 LGAs','Bauchi North',null,'Planned','Grants and training for women''s cooperatives.','Micro-grants, cooperative support and skills training for women across Bauchi North.',null,false,25),
('Federal Legislative Advocacy','legislative-advocacy','Legislation','commitment','All 7 LGAs','National Assembly',null,'Planned','Bills and motions for Bauchi North.','Sponsor bills and motions for federal institutions, security and infrastructure in Bauchi North.',null,false,26);

insert into public.news_articles(title, slug, category, excerpt, body, image_url, published_at) values
('IMBA Declares for Bauchi North Senate Seat Under APC','imba-declares-senate-apc','Political Meetings','Hon. Ibrahim Mohammed Baba formally declares his intention to represent Bauchi North in the Senate on the platform of the APC.','Before a large gathering of party faithful, Hon. Ibrahim Mohammed Baba (IMBA) declared his intention to contest the Bauchi North Senatorial seat on the platform of the All Progressives Congress.

Anchoring his campaign on the theme "Aikin Ka Hujjar Ka", he pointed to verifiable projects delivered during his 2015–2019 tenure in the House of Representatives, and pledged to extend that record to all seven LGAs of Bauchi North.','/__l5e/assets-v1/ca3f6aa0-0fce-4227-92cf-8a066a64b56b/imba_speaking_rally.jpg', now() - interval '2 days'),
('Massive Crowd Welcomes IMBA in Azare','crowd-welcomes-imba-azare','Rallies','Supporters lined the streets of Azare to welcome Hon. IMBA during his campaign tour.','Thousands of supporters poured into the streets of Azare to welcome Hon. Ibrahim Mohammed Baba during his campaign tour of Katagum LGA. Youth groups, women associations and community leaders joined the procession in a show of solidarity.','/__l5e/assets-v1/72843012-2dd4-4f8f-b4ff-6348f056d97c/imba_rally_procession.jpg', now() - interval '5 days'),
('Stakeholders Meeting with Community Leaders','stakeholders-meeting','Community Engagement','IMBA meets traditional and community leaders to listen to the needs of Bauchi North.','Hon. IMBA held a listening session with traditional rulers, religious leaders and ward stakeholders. Key concerns raised included water supply, youth employment and rural roads — all priorities in his senatorial agenda.','/__l5e/assets-v1/f5aed1dd-8226-424a-bc62-eeeed2c96c2c/imba_seated_event.jpg', now() - interval '9 days'),
('Public Statement: Launch of Citizen Accountability Portal','accountability-portal-launch','Press Statements','Citizens can now submit complaints and track their requests online with a unique tracking code.','In keeping with his commitment to transparent representation, Hon. IMBA has launched this official portal. Any constituent can submit a complaint, petition or request without creating an account, and receive a tracking code to follow its progress.','/__l5e/assets-v1/5ec2cea5-a94d-4abf-be4f-1268e823edc8/imba_seated_notes.jpg', now() - interval '1 day');

insert into public.media_items(title, category, url, caption, sort_order) values
('Official Portrait','Official Portraits','/__l5e/assets-v1/ad4934d7-a136-497f-b412-8c591124853e/imba_seated_portrait.jpg','Hon. Ibrahim Mohammed Baba (IMBA)',1),
('At a community event','Community Engagements','/__l5e/assets-v1/f5aed1dd-8226-424a-bc62-eeeed2c96c2c/imba_seated_event.jpg','Engaging with stakeholders',2),
('Taking notes from constituents','Community Engagements','/__l5e/assets-v1/5ec2cea5-a94d-4abf-be4f-1268e823edc8/imba_seated_notes.jpg','Listening session',3),
('Addressing supporters','Rallies','/__l5e/assets-v1/ca3f6aa0-0fce-4227-92cf-8a066a64b56b/imba_speaking_rally.jpg','Campaign address',4),
('Motorcade greeting','Rallies','/__l5e/assets-v1/e738ae5e-7020-486a-be32-5c96cdbe9684/imba_motorcade_wave.jpg','Campaign tour',5),
('Crowds in the street','Rallies','/__l5e/assets-v1/9b6c97ae-d525-4e0e-b609-6760b4bbe5a1/imba_rally_crowd_street.jpg','Supporters on the move',6),
('Campaign procession','Rallies','/__l5e/assets-v1/72843012-2dd4-4f8f-b4ff-6348f056d97c/imba_rally_procession.jpg','Youth procession',7),
('Aikin Ka Hujjar Ka — project evidence','Project Verification Evidence','/__l5e/assets-v1/9592dee4-f970-4ee1-9c57-a6dcd390bbbb/imba_achievements_poster.jpg','Classrooms, ICT centres and buses delivered 2015–2019',8);