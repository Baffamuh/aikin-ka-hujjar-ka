// Photo evidence and reported achievements of Hon. IMBA (2015–2019).
const files = import.meta.glob("../assets/evidence/*.asset.json", { eager: true, import: "default" }) as Record<string, { url: string }>;
const img = (id: string) => files[`../assets/evidence/ev_${id}.jpg.asset.json`]?.url ?? "";

export const SECTORS = [
  "Education",
  "ICT",
  "Transport",
  "Health",
  "Water",
  "Electricity",
  "Roads & Drainage",
  "Empowerment",
  "Community",
] as const;
export type Sector = (typeof SECTORS)[number];

export type Evidence = { id: string; src: string; title: string; caption: string; sector: Sector };

const E = (id: string, sector: Sector, title: string, caption: string): Evidence => ({ id, src: img(id), sector, title, caption });

export const EVIDENCE: Evidence[] = [
  E("1793741435915", "Education", "Completed classroom block", "New classroom block with verandah delivered under IMBA's constituency projects in Katagum."),
  E("1793741432563", "Education", "Row of new classrooms", "Long classroom block with covered walkway built for pupils in the constituency."),
  E("1793741368926", "Education", "Classroom project signboard", "Official project signboard for a classroom block construction in Katagum."),
  E("1793741378921", "Education", "School structures delivered", "Collage of school buildings delivered across Katagum Federal Constituency."),
  E("1793741350863", "Education", "Pupils' desks handover", "Distribution of school desks so pupils no longer sit on the floor."),
  E("1793741366266", "Education", "Construction on site", "Block-work in progress during a community building project."),
  E("1793741424091", "ICT", "Computer laboratory", "Desktop workstations installed in a constituency ICT centre."),
  E("1793741415603", "ICT", "Students in ICT centre", "Students using the computer room furnished by IMBA."),
  E("1793741360166", "ICT", "Computers delivered", "Truck delivering computers, printers and power equipment for ICT centres."),
  E("1793741347020", "Transport", "Free student bus", "IMBA-branded bus providing daily transport for pupils in and around Azare."),
  E("1793741354777", "Education", "Civil Defence Training College, Azare", "The Nigeria Security and Civil Defence Training College, Azare — a federal institution attracted to the constituency."),
  E("1793741421065", "Health", "Ambulance & transit vans", "Vehicles provided for emergency health response and community transport."),
  E("1793741381990", "Health", "Constituency ambulance", "Campaign-branded ambulance serving communities in Katagum."),
  E("1793741427132", "Health", "Community facility", "A completed community facility supporting local services."),
  E("1793741429096", "Water", "Water tanks, Sheikh Adam College", "Elevated water tanks at Sheikh Adam College of Arabic and Islamic Studies."),
  E("1793741418161", "Water", "Solar borehole in use", "Residents collecting clean water from an elevated borehole."),
  E("1793741401884", "Water", "Pipes for water works", "Pipes and materials for community water and utility projects."),
  E("1793741396309", "Electricity", "Transformer delivery", "Electrical transformer being transported to a community."),
  E("1793741362863", "Electricity", "Transformer installation", "Transformer being lifted into place to restore power supply."),
  E("1793741372471", "Electricity", "Installed transformer", "Fenced and protected transformer installation."),
  E("1793741409270", "Electricity", "Solar streetlights", "Solar streetlight poles prepared for installation in communities."),
  E("1793741375435", "Roads & Drainage", "Culvert construction", "Drainage and culvert works to prevent flooding and protect roads."),
  E("1793741390749", "Roads & Drainage", "Road works", "Road construction machinery during community development work."),
  E("1793741404847", "Roads & Drainage", "Road inspection", "IMBA's team on a site visit to inspect road works."),
  E("1793741412306", "Empowerment", "Cement for communities", "Truck loaded with cement bags for community building projects."),
  E("1793741399070", "Empowerment", "Roofing sheets & cement", "Distribution of roofing sheets and cement to communities and institutions."),
  E("1793741357389", "Empowerment", "Vehicles for empowerment", "Cars presented to constituents as part of empowerment programmes."),
  E("1793741387531", "Community", "Meeting traditional leaders", "Community gathering with traditional rulers and elders."),
].filter((e) => e.src);

export const RECORD: { sector: Sector; title: string; items: string[] }[] = [
  { sector: "Education", title: "Education & Schools", items: [
    "Central Primary School Yayu — 3 blocks, 9 classrooms, 3 offices, full furniture",
    "Central Primary School Madara — 2 blocks, 6 classrooms, staff office, 4 toilets",
    "Magonshi Central Primary School — 2 blocks, 6 classrooms, 2 offices",
    "Yagana Primary School Katsalle, Azare — new school, 3 blocks of 15 classrooms",
    "Behind ADP Azare, Bulkachuwa UBJSS, Buskuri, Kujuru and Kakudi schools",
    "Modern Islamiyya schools at Sabon Layi Nassarawa B (Azare) and Dagalwa",
    "10,000+ textbooks for Primary 1–6 pupils across all wards",
    "SSCE exam fees and tertiary registration support for students",
    "Nigeria Security and Civil Defence Training College, Azare",
    "School of Health / Nursing & Midwifery training brought to the area",
  ]},
  { sector: "ICT", title: "ICT Centres", items: [
    "GSS Chinade ICT centre — fully equipped",
    "Madara ICT centre — upgraded with all needed equipment",
    "GGC Azare — computer lab for Government Girls College",
  ]},
  { sector: "Transport", title: "Student Mobility", items: [
    "3 large buses for free daily student transport in and around Azare",
    "Modern student bus stops",
  ]},
  { sector: "Health", title: "Healthcare", items: [
    "Diagnostic machines supplied to hospitals across Katagum",
    "New buildings added in some hospitals",
    "Ambulances and financial support for patients",
  ]},
  { sector: "Water", title: "Clean Water", items: [
    "Modern boreholes in many communities",
    "Solar-powered boreholes for farmers",
  ]},
  { sector: "Electricity", title: "Power & Lighting", items: [
    "Electrical transformers for communities",
    "Solar streetlights across towns and villages",
  ]},
  { sector: "Roads & Drainage", title: "Rural Infrastructure", items: [
    "Culverts and drainage channels",
    "Repair of damaged roads to reduce accidents",
    "More refuse collection points",
    "Building and renovation of mosques, with generators and loudspeakers",
  ]},
  { sector: "Empowerment", title: "Youth, Women & Farmers", items: [
    "Jobs for youths, including children of ordinary families",
    "Skills acquisition programmes for youths",
    "Motorcycles, cars, sewing machines, bicycles, grinding and pasta machines",
    "Grants for small traders; goats and livestock for women",
    "Farmers: sprayers, water pumps, fertiliser and cash support",
    "Grants to FOMWAN and community/faith schools",
  ]},
];
