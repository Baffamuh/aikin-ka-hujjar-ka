# Aikin Ka Hujjar Ka

# PROJECT: OFFICIAL POLITICAL, PUBLIC ACCOUNTABILITY & CITIZEN ENGAGEMENT PLATFORM FOR HON. IBRAHIM MOHAMMED BABA (IMBA)

Build a complete, professional, modern, and mobile-responsive official digital platform and public accountability website for Hon. Ibrahim Mohammed Baba (IMBA), former Member of the House of Representatives for Katagum Federal Constituency (2015–2019) and current APC (All Progressives Congress) contestant for Senator, Bauchi North Senatorial District, Bauchi State, Nigeria.

This must be a fully functional web application with public engagement features, an interactive complaints submission and tracking system, and a comprehensive, secure Admin Dashboard. It must NOT be a static landing page or mock prototype.

---

## 1. MANDATORY ZERO-BUDGET & TECHNICAL CONSTRAINTS
- Zero Paid Dependencies: Do not integrate any paid AI APIs (no OpenAI, Gemini, Claude, or token-based LLM APIs).
- No Paid Communication Gateways: No paid SMS, WhatsApp APIs, or paid transactional email services.
- Backend & Database: Use Lovable Cloud (Supabase free-tier compatible) for database storage, authentication, and file/image uploads.
- Public Friction-Free Access: Citizens and constituents must NEVER be required to sign up or log in to browse content, view projects, submit complaints, or track their requests.
- Admin Authentication: Secure admin dashboard accessed via `/admin/login` using email and password, with no mandatory email confirmation blocker.
- Deployment Ready: Clean, lightweight code compatible with Vercel hosting.

---

## 2. OFFICIAL CANDIDATE IDENTITY & POLITICAL PROFILE
- Full Name: Hon. Ibrahim Mohammed Baba (IMBA)
- Political Party: All Progressives Congress (APC) — strictly APC (not SDP).
- Current Office Contested: Senator, Bauchi North Senatorial District, Bauchi State.
- Senatorial District Scope: 7 Local Government Areas — Katagum, Jama'are, Itas/Gadau, Zaki, Gamawa, Shira, and Giade.
- Previous Legislative Tenure: Member, House of Representatives, Katagum Federal Constituency, Bauchi State (2015–2019).
- Official Campaign Theme: "Aikin Ka Hujjar Ka" ("Your work is your proof" / "Aikin ka shine hujjarka"), anchoring his senatorial bid on verifiable past constituency achievements.

---

## 3. VERIFIED 2015–2019 TENURE ACHIEVEMENTS (DATABASE PRE-SEEDED)
Pre-seed the database with these verified projects delivered during his 2015–2019 tenure in Katagum Federal Constituency:

### A. Educational Infrastructure
1. Central Primary School Yayu: Construction of 3 blocks comprising 9 classrooms, 3 staff offices, and classroom furniture.
2. Central Primary School Madara: Construction of 2 blocks of 6 classrooms equipped with student desks, staff offices, and 4 VIP toilets.
3. Magonshi Central Primary School: Construction of 2 blocks of 6 classrooms, 2 staff offices, and standard student seating.
4. Yagana / Katsalle Primary School (Azare): Brand-new comprehensive school establishment comprising 3 blocks of 15 classrooms, staff administrative offices, modern toilets, and full furniture.
5. Behind ADP (Azare): Construction of 2 modern classrooms and administrative office.
6. Bulkachuwa Upper Basic Junior Secondary School: Construction of 3 blocks with 5 classrooms, staff office, store, and toilet facilities.
7. Buskuri Primary School: New primary school wing comprising 3 classrooms.
8. Kujuru Primary School (Azare): Construction of 1 block of 2 classrooms, staff office, and store.
9. Kakudi Primary School: Construction of 2 modern classrooms, staff office, and store.
10. Sabon Layi Nassarawa B Modern Islamiyya (Azare): Construction of 2 classrooms, student seating, and instructional materials.
11. Gundumar Dagalwa Modern Islamiyya: Construction of 2 classrooms with student seating.

### B. ICT & Technology Centres
12. GSS Chinade ICT Centre: Established and furnished with over 40 desktop computers, networking, and solar inverter backup.
13. Madara ICT Centre: Fully upgraded and equipped digital learning centre.
14. GGC Azare ICT Centre: Modern computer lab and digital resource centre.

### C. Student Welfare & Community Empowerment
15. Student Transit Buses: Deployment of 3 dedicated mass transit buses for free daily student transportation in Azare and surrounding communities.
16. Instructional Materials: Procurement and distribution of 10,000+ primary school textbooks (Primary 1–6) across all wards.
17. Scholarships & Grants: Direct educational subsidies and community grants to faith and community bodies, including FOMWAN Katagum.

### D. Upcoming Priority Sectors (Senatorial Agenda)
Structure the achievements and commitments database to also support future records across:
- Kiwon Lafiya (Healthcare Infrastructure & Medical Outreaches)
- Samar da Ruwan Sha (Clean Water & Solar Boreholes)
- Samar da Ayyukan Yi (Job Creation & Youth Skills Acquisition)
- Ayyukan Raya Kasa (Rural Infrastructure, Roads & Electrification)
- Rabon Romon Dimokuradiyya (Dividends of Democracy & Agricultural Inputs)

---

## 4. DESIGN SYSTEM & VISUAL DIRECTION
- Visual Aesthetic: Premium, dignified Nigerian statesman and public service design.
- Color Palette: Deep Nigerian emerald green (`#006432`), rich gold/amber accents (`#D4AF37`), clean white, slate gray typography, and warm off-white backgrounds. Full support for clean light and dark modes via semantic CSS tokens.
- Typography: Elegant serif or modern sans headings (e.g. Outfit / Sora / Plus Jakarta Sans) with highly legible body copy.
- Responsiveness: Flawless layout on mobile phones (Android/iPhone), tablets, laptops, and desktop screens.
- Badges: Clear APC party pill badges and official "Contestant for Senator · Bauchi North Senatorial District" indicators.
- Media & Photography: Utilize the attached official campaign photos, portraits, and event images across hero banners, biography, track record showcases, and media galleries.

---

## 5. COMPLETE SITE ARCHITECTURE & PAGES

### 1. Home Page (`/`)
- Hero Section: Official portrait of Hon. Ibrahim Mohammed Baba, prominent APC branding, "Contestant for Senator · Bauchi North", short executive biography, and dual call-to-action buttons: "View Track Record" and "Submit a Complaint/Request".
- "Aikin Ka Hujjar Ka" Showcase: Highlight card highlighting key numbers (50+ Classrooms Built, 3 ICT Centres, 3 School Buses, 10,000+ Textbooks, 7 LGAs in Bauchi North).
- Featured Projects Carousel/Grid: Filterable preview of completed constituency projects with status badges and locations.
- Senatorial Vision & Agenda: Pillars for the 7 LGAs of Bauchi North (Katagum, Jama'are, Itas/Gadau, Zaki, Gamawa, Shira, Giade).
- Latest Activities & News: Recent community visits, rallies, and press statements.
- Public Accountability Callout: Quick link to submit community petitions or track prior submissions.

### 2. About IMBA (`/about`)
- Comprehensive biography detailing his background, public service career, stewardship in the 8th National Assembly (House of Reps, 2015–2019), and his legislative record.
- Core philosophy: Transparent representation, educational empowerment, and constituency accessibility.

### 3. Track Record & Projects (`/projects`)
- Searchable and filterable database of verified projects.
- Filters by Category, LGA/Location, and Tenure (2015–2019 Completed vs. Senatorial Commitments).
- Each project card displays title, sector, exact location/school, year completed, photo, and detailed scope of work.

### 4. Senatorial Agenda & Commitments (`/senatorial-agenda`)
- Transparent documentation of campaign commitments for Bauchi North Senatorial District across youth development, women empowerment, irrigation farming support, healthcare facilities, and federal legislative advocacy.

### 5. News & Activities (`/news` & `/news/:slug`)
- Dynamic news stream covering community engagements, political meetings, project inspections, and public statements with category filtering and individual detail pages.

### 6. Media Centre & Gallery (`/media`)
- Photo and video galleries categorized by Official Portraits, Community Engagements, Rallies, and Project Verification Evidence.

### 7. Citizen Complaints & Petitions System (`/complaints` and `/track`)
- Submission Form (`/complaints`): Full Name, Phone Number, Email (optional), LGA (7 Bauchi North LGAs), Ward, Category, Subject, and Detailed Message. Automatically generates a unique, human-friendly tracking code (e.g., `IMBA-2026-XXXX`) with a "Copy Code" button and tracking instructions.
- Public Tracking Page (`/track`): Citizen enters tracking code to view status (`Submitted`, `Under Review`, `Assigned to Constituency Office`, `In Progress`, `Resolved`, `Closed`) and official updates without revealing sensitive personal details.

### 8. Contact & Constituency Offices (`/contact`)
- Contact directory for the central constituency office in Azare and liaison contacts across Bauchi North LGAs.

---

## 6. SECURE ADMIN DASHBOARD (`/admin`)
- Authentication: Secure admin login at `/admin/login`.
- Overview Dashboard: Total projects, news articles published, total citizen complaints received, and status breakdown.
- Projects Manager: Full CRUD for constituency projects.
- News & Media Manager: Publish and edit press releases, rallies, and media links.
- Complaints Desk: View incoming citizen complaints with filtering by LGA, category, and status. Update status and post official remarks visible on the public tracking page. Export summary data.
- Site Settings: Update hero banner text, campaign slogan, and contact information.

---

## 7. DATABASE SCHEMA REQUIREMENTS
Implement Supabase tables with Row Level Security (RLS):
1. `projects`
2. `news_articles`
3. `media_items`
4. `complaints` (Public INSERT; Public SELECT of non-sensitive status details by `tracking_code`; Admin full CRUD)
5. `user_roles` (admin authorization)

Seed the database with all verified 2015–2019 projects, introductory news items, and the official Bauchi North senatorial agenda.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d68a4222-33c6-49e4-93fc-873b6872f8a4).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
