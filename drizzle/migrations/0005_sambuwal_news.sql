insert into public.news_articles (title,slug,category,excerpt,body,image_url,published_at) values
($q$“Duk Wanda Yake Sona Tsakanin Da Allah, To Ya Zaɓi Dukkan ’Yan Takarkarun APC” — Hon. Sirajo Ibrahim Tanko$q$,
'sirajo-tanko-sambuwal-shira-apc-rally','Rally',
$q$Hon. Sirajo Ibrahim Tanko ya buƙaci magoya bayansa da masoyansa su zaɓi dukkan ’yan takarkarun jam’iyyar APC a zaɓe mai zuwa.$q$,
$q$Hon. Sirajo Ibrahim Tanko ya buƙaci magoya bayansa da masoyansa da su zaɓi dukkan ’yan takarkarun jam’iyyar APC a zaɓe mai zuwa.

Ya bayyana hakan ne yayin da yake jawabi ga magoya bayansa a wajen taron jam’iyyar APC da aka gudanar a garin Sambuwal da ke ƙaramar hukumar Shira, inda aka karɓi Hon. Babangida Maliya bayan ficewarsa daga jam’iyyar APM zuwa APC.$q$,
'/media/news_sambuwal_shira_apc.jpg', now())
on conflict (slug) do nothing;
