create or replace function public.submit_complaint(_full_name text, _phone text, _email text, _lga text, _ward text, _category text, _subject text, _message text)
returns text language plpgsql security definer set search_path=public as $$
declare code text; tries int := 0; chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; i int;
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
    code := 'IMBA-' || to_char(now(),'YYYY') || '-';
    for i in 1..5 loop code := code || substr(chars, 1 + floor(random()*length(chars))::int, 1); end loop;
    exit when not exists(select 1 from complaints c where c.tracking_code=code);
    tries := tries + 1; if tries > 10 then raise exception 'Could not generate code'; end if;
  end loop;
  insert into complaints(tracking_code, full_name, phone, email, lga, ward, category, subject, message)
  values (code, trim(_full_name), trim(_phone), nullif(trim(coalesce(_email,'')),''), _lga, trim(_ward), trim(_category), trim(_subject), trim(_message));
  return code;
end $$;