/**
 * Mock data layer.
 *
 * Every page reads from here so the UI is fully explorable before a Supabase
 * project is connected. Swapping to live queries means replacing these
 * functions with `createSupabaseServerClient()` calls — page components do not
 * change shape.
 */

export type EmirateKey =
  | "dubai"
  | "abu_dhabi"
  | "sharjah"
  | "ajman"
  | "umm_al_quwain"
  | "ras_al_khaimah"
  | "fujairah";

export type CategoryKey =
  | "neighbourhood"
  | "families"
  | "newcomers"
  | "heritage"
  | "arts"
  | "sports"
  | "business"
  | "volunteering";

export const EMIRATES: { key: EmirateKey; en: string; ar: string }[] = [
  { key: "dubai", en: "Dubai", ar: "دبي" },
  { key: "abu_dhabi", en: "Abu Dhabi", ar: "أبوظبي" },
  { key: "sharjah", en: "Sharjah", ar: "الشارقة" },
  { key: "ajman", en: "Ajman", ar: "عجمان" },
  { key: "umm_al_quwain", en: "Umm Al Quwain", ar: "أم القيوين" },
  { key: "ras_al_khaimah", en: "Ras Al Khaimah", ar: "رأس الخيمة" },
  { key: "fujairah", en: "Fujairah", ar: "الفجيرة" },
];

export const CATEGORIES: { key: CategoryKey; en: string; ar: string }[] = [
  { key: "neighbourhood", en: "Neighbourhood", ar: "الحي" },
  { key: "families", en: "Families", ar: "العائلات" },
  { key: "newcomers", en: "Newcomers", ar: "الوافدون الجدد" },
  { key: "heritage", en: "Heritage", ar: "التراث" },
  { key: "arts", en: "Arts", ar: "الفنون" },
  { key: "sports", en: "Sports", ar: "الرياضة" },
  { key: "business", en: "Business", ar: "الأعمال" },
  { key: "volunteering", en: "Volunteering", ar: "التطوّع" },
];

export const emirateLabel = (key: EmirateKey) => EMIRATES.find((item) => item.key === key);
export const categoryLabel = (key: CategoryKey) => CATEGORIES.find((item) => item.key === key);

export interface Community {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  descEn: string;
  descAr: string;
  category: CategoryKey;
  emirate: EmirateKey;
  members: number;
  verifiedOnly: boolean;
  accent: string;
  hostEn: string;
  hostAr: string;
  tags: string[];
  createdAt: string;
}

export interface EventItem {
  id: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  communitySlug: string;
  kind: "social" | "cultural" | "workshop" | "heritage";
  startsAt: string;
  endsAt: string;
  venueEn: string;
  venueAr: string;
  emirate: EmirateKey;
  lat: number;
  lng: number;
  capacity: number;
  going: number;
  free: boolean;
  priceAed?: number;
  hostEn: string;
  hostAr: string;
  accent: string;
}

export interface CultureItem {
  id: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  type: "heritage" | "workshop";
  levelEn: string;
  levelAr: string;
  durationEn: string;
  durationAr: string;
  hostEn: string;
  hostAr: string;
  emirate: EmirateKey;
  startsAt: string;
  capacity: number;
  going: number;
  accent: string;
  lessons: { en: string; ar: string }[];
}

export const communities: Community[] = [
  {
    id: "c1",
    slug: "al-barsha-families",
    nameEn: "Al Barsha Families",
    nameAr: "عائلات البرشاء",
    descEn:
      "Neighbours in Al Barsha who share school runs, weekend picnics and a monthly potluck in the park.",
    descAr: "جيران البرشاء الذين يتشاركون رحلات المدرسة والتنزه الأسبوعي والعشاء الشهري في الحديقة.",
    category: "families",
    emirate: "dubai",
    members: 412,
    verifiedOnly: true,
    accent: "from-emerald-900 via-emerald-800 to-emerald-600",
    hostEn: "Noura Al Suwaidi",
    hostAr: "نورة السويدي",
    tags: ["Schools", "Picnics", "Kids"],
    createdAt: "2024-02-11",
  },
  {
    id: "c2",
    slug: "corniche-walkers",
    nameEn: "Corniche Walkers",
    nameAr: "مشاة الكورنيش",
    descEn: "Sunrise walks on the Abu Dhabi Corniche, every Friday at 6am, coffee after.",
    descAr: "جولات الفجر على كورنيش أبوظبي، كل جمعة الساعة ٦ صباحًا، وبعدها قهوة.",
    category: "sports",
    emirate: "abu_dhabi",
    members: 268,
    verifiedOnly: false,
    accent: "from-teal-900 via-emerald-800 to-cyan-600",
    hostEn: "Omar Al Hashmi",
    hostAr: "عمر الهاشمي",
    tags: ["Walking", "Sunrise", "Coffee"],
    createdAt: "2023-11-02",
  },
  {
    id: "c3",
    slug: "sharjah-calligraphers",
    nameEn: "Sharjah Calligraphers",
    nameAr: "خطاطو الشارقة",
    descEn: "A quiet majlis for Arabic calligraphy: practice sessions, ink swaps, museum visits.",
    descAr: "مجلس هادئ للخط العربي: جلسات تدريب، تبادل أحبار، وزيارات متحفية.",
    category: "arts",
    emirate: "sharjah",
    members: 156,
    verifiedOnly: true,
    accent: "from-amber-900 via-emerald-900 to-emerald-700",
    hostEn: "Hessa Al Qasimi",
    hostAr: "حصة القاسمي",
    tags: ["Calligraphy", "Heritage", "Workshops"],
    createdAt: "2024-05-19",
  },
  {
    id: "c4",
    slug: "newcomers-dubai",
    nameEn: "Newcomers Dubai",
    nameAr: "الوافدون الجدد دبي",
    descEn: "Landed in the last 12 months? Ask anything — visas, schools, where to buy good bread.",
    descAr: "وصلت خلال آخر ١٢ شهرًا؟ اسأل عن أي شيء — الإقامة، المدارس، وأين تشتري خبزًا طيبًا.",
    category: "newcomers",
    emirate: "dubai",
    members: 903,
    verifiedOnly: true,
    accent: "from-emerald-950 via-teal-800 to-emerald-600",
    hostEn: "Fatima Rahman",
    hostAr: "فاطمة رحمن",
    tags: ["Relocation", "Advice", "Meetups"],
    createdAt: "2022-09-30",
  },
  {
    id: "c5",
    slug: "al-majaz-evenings",
    nameEn: "Al Majaz Evenings",
    nameAr: "أمسيات المجاز",
    descEn: "Evening walks, board games and tea by the lagoon in Al Majaz.",
    descAr: "جولات مسائية وألعاب لوحية وشاي على ضفاف بحيرة المجاز.",
    category: "neighbourhood",
    emirate: "sharjah",
    members: 221,
    verifiedOnly: false,
    accent: "from-emerald-800 via-teal-700 to-amber-600",
    hostEn: "Yousef Al Ali",
    hostAr: "يوسف العلي",
    tags: ["Evenings", "Board games", "Tea"],
    createdAt: "2024-01-07",
  },
  {
    id: "c6",
    slug: "rak-heritage-circle",
    nameEn: "RAK Heritage Circle",
    nameAr: "دائرة تراث رأس الخيمة",
    descEn: "Fort walks, falconry mornings and oral history evenings with RAK elders.",
    descAr: "جولات في القلعة، صباحات صقارة، وأمسيات تاريخ شفهي مع كبار رأس الخيمة.",
    category: "heritage",
    emirate: "ras_al_khaimah",
    members: 98,
    verifiedOnly: true,
    accent: "from-stone-800 via-emerald-900 to-emerald-700",
    hostEn: "Khalid Al Shehhi",
    hostAr: "خالد الشحي",
    tags: ["Heritage", "Falconry", "History"],
    createdAt: "2023-03-15",
  },
];

export const events: EventItem[] = [
  {
    id: "e1",
    slug: "friday-majlis-dinner",
    titleEn: "Friday majlis dinner",
    titleAr: "عشاء المجلس الجمعة",
    descEn:
      "A home-cooked dinner for twelve neighbours. Bring a dish from home if you can, stories are mandatory. Children welcome.",
    descAr: "عشاء منزلي لاثني عشر جارًا. أحضر طبقًا من بلدك إن أمكن، والحكايات إلزامية. الأطفال مرحّب بهم.",
    communitySlug: "al-barsha-families",
    kind: "social",
    startsAt: "2026-11-06T19:30:00+04:00",
    endsAt: "2026-11-06T22:00:00+04:00",
    venueEn: "Community hall, Al Barsha 2",
    venueAr: "قاعة المجتمع، البرشاء ٢",
    emirate: "dubai",
    lat: 25.1122,
    lng: 55.1991,
    capacity: 12,
    going: 12,
    free: true,
    hostEn: "Noura Al Suwaidi",
    hostAr: "نورة السويدي",
    accent: "from-emerald-900 to-emerald-600",
  },
  {
    id: "e2",
    slug: "sunrise-corniche-walk",
    titleEn: "Sunrise Corniche walk",
    titleAr: "جولة الفجر على الكورنيش",
    descEn: "5km at an easy pace, followed by karak at the little cafés by the marina.",
    descAr: "٥ كم بوتيرة مريحة، ثم كرك عند المقاهي الصغيرة بجوار المارينا.",
    communitySlug: "corniche-walkers",
    kind: "social",
    startsAt: "2026-11-03T06:00:00+04:00",
    endsAt: "2026-11-03T07:30:00+04:00",
    venueEn: "Corniche Beach Gate 4",
    venueAr: "شاطئ الكورنيش، البوابة ٤",
    emirate: "abu_dhabi",
    lat: 24.4764,
    lng: 54.3705,
    capacity: 40,
    going: 27,
    free: true,
    hostEn: "Omar Al Hashmi",
    hostAr: "عمر الهاشمي",
    accent: "from-teal-800 to-cyan-600",
  },
  {
    id: "e3",
    slug: "arabic-calligraphy-basics",
    titleEn: "Arabic calligraphy basics",
    titleAr: "أساسيات الخط العربي",
    descEn: "Naskh script from zero. Materials provided — reed pens, ink and paper.",
    descAr: "خط النسخ من الصفر. المواد متوفرة — أقلام القصب والحبر والورق.",
    communitySlug: "sharjah-calligraphers",
    kind: "workshop",
    startsAt: "2026-11-09T17:00:00+04:00",
    endsAt: "2026-11-09T19:00:00+04:00",
    venueEn: "Sharjah Art Foundation courtyard",
    venueAr: "ساحة مؤسسة الشارقة للفنون",
    emirate: "sharjah",
    lat: 25.3573,
    lng: 55.3862,
    capacity: 18,
    going: 14,
    free: false,
    priceAed: 75,
    hostEn: "Hessa Al Qasimi",
    hostAr: "حصة القاسمي",
    accent: "from-amber-800 to-emerald-700",
  },
  {
    id: "e4",
    slug: "newcomer-coffee-hour",
    titleEn: "Newcomer coffee hour",
    titleAr: "قهوة الوافدين الجدد",
    descEn: "Ask the questions you cannot ask online. Two long-time residents answer everything.",
    descAr: "اسأل ما لا تستطيع سؤاله على الإنترنت. مقيمان قديمان يجيبان عن كل شيء.",
    communitySlug: "newcomers-dubai",
    kind: "social",
    startsAt: "2026-11-12T10:00:00+04:00",
    endsAt: "2026-11-12T11:30:00+04:00",
    venueEn: "Alserkal Avenue, Warehouse 4",
    venueAr: "منطقة السركال، المستودع ٤",
    emirate: "dubai",
    lat: 25.1413,
    lng: 55.2235,
    capacity: 30,
    going: 19,
    free: true,
    hostEn: "Fatima Rahman",
    hostAr: "فاطمة رحمن",
    accent: "from-emerald-950 to-teal-700",
  },
  {
    id: "e5",
    slug: "majaz-board-games",
    titleEn: "Board games by the lagoon",
    titleAr: "ألعاب لوحية على البحيرة",
    descEn: "Bring a game, teach a game. Tea and dates on the house.",
    descAr: "أحضر لعبة وعلّمها. الشاي والتمر على حسابنا.",
    communitySlug: "al-majaz-evenings",
    kind: "social",
    startsAt: "2026-11-15T18:00:00+04:00",
    endsAt: "2026-11-15T21:00:00+04:00",
    venueEn: "Al Majaz Waterfront, picnic lawn",
    venueAr: "واجهة المجاز المائية، المرج",
    emirate: "sharjah",
    lat: 25.3235,
    lng: 55.3832,
    capacity: 24,
    going: 11,
    free: true,
    hostEn: "Yousef Al Ali",
    hostAr: "يوسف العلي",
    accent: "from-emerald-800 to-amber-600",
  },
  {
    id: "e6",
    slug: "falconry-morning",
    titleEn: "Falconry morning",
    titleAr: "صباح الصقارة",
    descEn: "Watch a hunt, learn the vocabulary, hold a bird with guidance.",
    descAr: "شاهد الصيد، تعلّم المصطلحات، وأمسك بطائر بإشراف.",
    communitySlug: "rak-heritage-circle",
    kind: "heritage",
    startsAt: "2026-11-20T07:00:00+04:00",
    endsAt: "2026-11-20T09:30:00+04:00",
    venueEn: "Al Rams desert edge, RAK",
    venueAr: "أطراف الرمس الصحراوية، رأس الخيمة",
    emirate: "ras_al_khaimah",
    lat: 25.8791,
    lng: 56.0184,
    capacity: 16,
    going: 9,
    free: false,
    priceAed: 120,
    hostEn: "Khalid Al Shehhi",
    hostAr: "خالد الشحي",
    accent: "from-stone-800 to-emerald-700",
  },
  {
    id: "e7",
    slug: "henna-and-oud-night",
    titleEn: "Henna and oud night",
    titleAr: "ليلة الحناء والعود",
    descEn: "A heritage evening: henna patterns, oud rhythms and Emirati desserts.",
    descAr: "أمسية تراثية: نقوش الحناء، إيقاعات العود، وحلويات إماراتية.",
    communitySlug: "rak-heritage-circle",
    kind: "cultural",
    startsAt: "2026-11-24T17:30:00+04:00",
    endsAt: "2026-11-24T20:30:00+04:00",
    venueEn: "RAK Old Town courtyard",
    venueAr: "ساحة البلدة القديمة، رأس الخيمة",
    emirate: "ras_al_khaimah",
    lat: 25.7893,
    lng: 55.9428,
    capacity: 35,
    going: 22,
    free: true,
    hostEn: "Khalid Al Shehhi",
    hostAr: "خالد الشحي",
    accent: "from-amber-900 to-emerald-800",
  },
  {
    id: "e8",
    slug: "sunday-park-picnic",
    titleEn: "Sunday park picnic",
    titleAr: "نزهة الأحد في الحديقة",
    descEn: "Blankets, kites and a shared table. The easiest way to meet six neighbours at once.",
    descAr: "بطانيات وطائرات ورقية وطاولة مشتركة. أسهل طريقة للقاء ستة جيران في وقت واحد.",
    communitySlug: "al-barsha-families",
    kind: "social",
    startsAt: "2026-11-28T16:00:00+04:00",
    endsAt: "2026-11-28T19:00:00+04:00",
    venueEn: "Al Barsha Pond Park",
    venueAr: "حديقة بحيرة البرشاء",
    emirate: "dubai",
    lat: 25.1087,
    lng: 55.1968,
    capacity: 60,
    going: 31,
    free: true,
    hostEn: "Noura Al Suwaidi",
    hostAr: "نورة السويدي",
    accent: "from-emerald-900 to-teal-600",
  },
];

export const cultureItems: CultureItem[] = [
  {
    id: "x1",
    slug: "majlis-etiquette",
    titleEn: "Majlis etiquette: the first five minutes",
    titleAr: "آداب المجلس: الخمس دقائق الأولى",
    descEn:
      "Where to sit, how to greet, when to stand. A short, practical guide to entering a majlis with confidence.",
    descAr: "أين تجلس، كيف تسلّم، ومتى تقف. دليل عملي قصير لدخول المجلس بثقة.",
    type: "heritage",
    levelEn: "All levels",
    levelAr: "جميع المستويات",
    durationEn: "1h 30m",
    durationAr: "ساعة و٣٠ دقيقة",
    hostEn: "Mariam Al Falasi",
    hostAr: "مريم الفلاسي",
    emirate: "dubai",
    startsAt: "2026-11-07T17:00:00+04:00",
    capacity: 40,
    going: 33,
    accent: "from-emerald-900 to-emerald-600",
    lessons: [
      { en: "Greetings and the order in which a room is greeted", ar: "السلام وترتيب التحية في المجلس" },
      { en: "Coffee service: how to receive and return a cup", ar: "تقديم القهوة: كيف تستقبل وتعيد الفناجين" },
      { en: "Conversation boundaries and respectful topics", ar: "حدود الحديث والمواضيع المحترمة" },
    ],
  },
  {
    id: "x2",
    slug: "henna-night",
    titleEn: "Henna night",
    titleAr: "ليلة الحناء",
    descEn: "Hands-on henna with a Khaleeji artist. Learn three traditional patterns.",
    descAr: "تطبيق عملي على الحناء مع فنانة خليجية. تعلّم ثلاثة نقوش تقليدية.",
    type: "workshop",
    levelEn: "Beginner",
    levelAr: "مبتدئ",
    durationEn: "2h 15m",
    durationAr: "ساعتان و١٥ دقيقة",
    hostEn: "Asma Al Blooshi",
    hostAr: "أسماء البلوشي",
    emirate: "sharjah",
    startsAt: "2026-11-14T18:00:00+04:00",
    capacity: 20,
    going: 18,
    accent: "from-amber-900 to-emerald-700",
    lessons: [
      { en: "Mixing paste: freshness, oil and consistency", ar: "خلط المعجون: الطزاجة والزيت والقوام" },
      { en: "The palm and the forearm as a canvas", ar: "الكف والساعد كلوحة" },
      { en: "Curing and after-care", ar: "التجفيف والعناية بعد الرسم" },
    ],
  },
  {
    id: "x3",
    slug: "arabic-calligraphy",
    titleEn: "Arabic calligraphy: Naskh in a day",
    titleAr: "الخط العربي: النسخ في يوم",
    descEn: "From a blank page to your first complete word. Pens and ink provided.",
    descAr: "من الصفحة الفارغة إلى أول كلمة كاملة. الأقلام والحبر متوفرة.",
    type: "workshop",
    levelEn: "Beginner",
    levelAr: "مبتدئ",
    durationEn: "3h",
    durationAr: "٣ ساعات",
    hostEn: "Hessa Al Qasimi",
    hostAr: "حصة القاسمي",
    emirate: "sharjah",
    startsAt: "2026-11-21T10:00:00+04:00",
    capacity: 18,
    going: 11,
    accent: "from-stone-800 to-emerald-700",
    lessons: [
      { en: "The reed pen: cutting and holding", ar: "قلم القصب: القطع والإمساك" },
      { en: "Proportions and the dot as a unit", ar: "النسب والنقطة كوحدة قياس" },
      { en: "Writing your name in Naskh", ar: "كتابة اسمك بخط النسخ" },
    ],
  },
  {
    id: "x4",
    slug: "majlis-food",
    titleEn: "The table of the majlis",
    titleAr: "سفرة المجلس",
    descEn: "Cook machboos and luqaimat with a Dubai home cook, then eat together.",
    descAr: "اطبخ المحبوس واللقيمات مع طبّاخة بيتية من دبي، ثم تناولوا الطعام معًا.",
    type: "workshop",
    levelEn: "All levels",
    levelAr: "جميع المستويات",
    durationEn: "2h 45m",
    durationAr: "ساعتان و٤٥ دقيقة",
    hostEn: "Aisha Al Muhairi",
    hostAr: "عائشة المهيري",
    emirate: "abu_dhabi",
    startsAt: "2026-11-27T16:30:00+04:00",
    capacity: 24,
    going: 21,
    accent: "from-amber-800 to-emerald-900",
    lessons: [
      { en: "Baharat: the blend, not the brand", ar: "البهارات: الخلطة لا الماركة" },
      { en: "Rice, meat and patience", ar: "الأرز واللحم والصبر" },
      { en: "Luqaimat: timing the syrup", ar: "اللقيمات: توقيت القطر" },
    ],
  },
];

export interface Person {
  id: string;
  nameEn: string;
  nameAr: string;
  email: string;
  emirate: EmirateKey;
  role: "member" | "moderator" | "admin";
  verified: boolean;
  joined: string;
  majlis: number;
}

export const people: Person[] = [
  { id: "u1", nameEn: "Layla Al Mansoori", nameAr: "ليلى المنصوري", email: "layla@example.ae", emirate: "dubai", role: "admin", verified: true, joined: "2024-01-12", majlis: 4 },
  { id: "u2", nameEn: "Daniel Weber", nameAr: "دانيال فيبر", email: "daniel@example.ae", emirate: "dubai", role: "member", verified: true, joined: "2024-03-04", majlis: 2 },
  { id: "u3", nameEn: "Aisha Rahman", nameAr: "عائشة رحمن", email: "aisha@example.ae", emirate: "sharjah", role: "moderator", verified: true, joined: "2023-11-19", majlis: 5 },
  { id: "u4", nameEn: "Marco Rossi", nameAr: "ماركو روسي", email: "marco@example.ae", emirate: "abu_dhabi", role: "member", verified: false, joined: "2026-09-28", majlis: 1 },
  { id: "u5", nameEn: "Hind Al Zaabi", nameAr: "هند الزعابي", email: "hind@example.ae", emirate: "ras_al_khaimah", role: "member", verified: true, joined: "2025-06-15", majlis: 3 },
  { id: "u6", nameEn: "Priya Nair", nameAr: "بريا ناير", email: "priya@example.ae", emirate: "dubai", role: "member", verified: false, joined: "2026-10-02", majlis: 0 },
  { id: "u7", nameEn: "Salem Al Ketbi", nameAr: "سالم الكتبي", email: "salem@example.ae", emirate: "ajman", role: "member", verified: true, joined: "2025-02-08", majlis: 2 },
  { id: "u8", nameEn: "Zainab Ali", nameAr: "زينب علي", email: "zainab@example.ae", emirate: "fujairah", role: "member", verified: false, joined: "2026-10-21", majlis: 1 },
];

export interface PendingCommunity {
  id: string;
  nameEn: string;
  nameAr: string;
  category: CategoryKey;
  emirate: EmirateKey;
  ownerEn: string;
  ownerAr: string;
  submitted: string;
  members: number;
}

export const pendingCommunities: PendingCommunity[] = [
  {
    id: "p1",
    nameEn: "Yas Island Cyclists",
    nameAr: "درّاجو جزيرة ياس",
    category: "sports",
    emirate: "abu_dhabi",
    ownerEn: "Faisal Al Nuaimi",
    ownerAr: "فيصل النعيمي",
    submitted: "2026-10-29",
    members: 6,
  },
  {
    id: "p2",
    nameEn: "Khor Fakkan Divers",
    nameAr: "غوّاصو خورفكان",
    category: "sports",
    emirate: "fujairah",
    ownerEn: "Reem Al Naqbi",
    ownerAr: "ريم النقبي",
    submitted: "2026-10-28",
    members: 11,
  },
  {
    id: "p3",
    nameEn: "Al Ain Palm Gardeners",
    nameAr: "بستانيو نخيل العين",
    category: "neighbourhood",
    emirate: "abu_dhabi",
    ownerEn: "Saeed Al Dhaheri",
    ownerAr: "سعيد الظاهري",
    submitted: "2026-10-26",
    members: 4,
  },
  {
    id: "p4",
    nameEn: "Umm Al Quwain Fishermen",
    nameAr: "صيادو أم القيوين",
    category: "heritage",
    emirate: "umm_al_quwain",
    ownerEn: "Majid Al Ali",
    ownerAr: "ماجد العلي",
    submitted: "2026-10-24",
    members: 9,
  },
];

export interface Report {
  id: string;
  targetEn: string;
  targetAr: string;
  type: "profile" | "community" | "event";
  reasonEn: string;
  reasonAr: string;
  reporterEn: string;
  reporterAr: string;
  created: string;
  status: "open" | "reviewing" | "resolved" | "dismissed";
}

export const reports: Report[] = [
  {
    id: "r1",
    targetEn: "Event: Friday majlis dinner",
    targetAr: "فعالية: عشاء المجلس الجمعة",
    type: "event",
    reasonEn: "Sharing a private address before approval",
    reasonAr: "نشر عنوان خاص قبل الاعتماد",
    reporterEn: "Hind Al Zaabi",
    reporterAr: "هند الزعابي",
    created: "2026-10-30",
    status: "open",
  },
  {
    id: "r2",
    targetEn: "Community: Newcomers Dubai",
    targetAr: "مجتمع: الوافدون الجدد دبي",
    type: "community",
    reasonEn: "Recruitment for a paid service",
    reasonAr: "ترويج لخدمة مدفوعة",
    reporterEn: "Daniel Weber",
    reporterAr: "دانيال فيبر",
    created: "2026-10-29",
    status: "reviewing",
  },
  {
    id: "r3",
    targetEn: "Profile: Marco Rossi",
    targetAr: "ملف: ماركو روسي",
    type: "profile",
    reasonEn: "Impersonating a verified member",
    reasonAr: "انتحال شخصية عضو موثّق",
    reporterEn: "Aisha Rahman",
    reporterAr: "عائشة رحمن",
    created: "2026-10-27",
    status: "open",
  },
  {
    id: "r4",
    targetEn: "Event: Board games by the lagoon",
    targetAr: "فعالية: ألعاب لوحية على البحيرة",
    type: "event",
    reasonEn: "Duplicate listing",
    reasonAr: "إعلان مكرر",
    reporterEn: "Salem Al Ketbi",
    reporterAr: "سالم الكتبي",
    created: "2026-10-25",
    status: "resolved",
  },
];

export interface ModerationAction {
  id: string;
  actorEn: string;
  actorAr: string;
  actionEn: string;
  actionAr: string;
  targetEn: string;
  targetAr: string;
  at: string;
}

export const moderationActions: ModerationAction[] = [
  { id: "m1", actorEn: "Aisha Rahman", actorAr: "عائشة رحمن", actionEn: "Approved community", actionAr: "اعتمدت مجتمعًا", targetEn: "Al Majaz Evenings", targetAr: "أمسيات المجاز", at: "2026-10-30 18:42" },
  { id: "m2", actorEn: "Aisha Rahman", actorAr: "عائشة رحمن", actionEn: "Verified member", actionAr: "وثّقت عضوًا", targetEn: "Hind Al Zaabi", targetAr: "هند الزعابي", at: "2026-10-30 16:10" },
  { id: "m3", actorEn: "Layla Al Mansoori", actorAr: "ليلى المنصوري", actionEn: "Dismissed report", actionAr: "رفضت بلاغًا", targetEn: "Duplicate listing", targetAr: "إعلان مكرر", at: "2026-10-29 21:05" },
  { id: "m4", actorEn: "Aisha Rahman", actorAr: "عائشة رحمن", actionEn: "Removed content", actionAr: "أزلت محتوى", targetEn: "Spam listing", targetAr: "إعلان مزعج", at: "2026-10-28 11:33" },
  { id: "m5", actorEn: "Layla Al Mansoori", actorAr: "ليلى المنصوري", actionEn: "Suspended user", actionAr: "أوقفت عضوًا", targetEn: "Unverified recruiter", targetAr: "مسوّق غير موثّق", at: "2026-10-27 09:18" },
];

export const activitySeries = [
  { week: "W1", members: 62, events: 4, reports: 3 },
  { week: "W2", members: 78, events: 6, reports: 2 },
  { week: "W3", members: 74, events: 5, reports: 5 },
  { week: "W4", members: 96, events: 9, reports: 4 },
  { week: "W5", members: 110, events: 7, reports: 2 },
  { week: "W6", members: 134, events: 11, reports: 6 },
  { week: "W7", members: 158, events: 12, reports: 3 },
];

export const getCommunity = (slug: string) => communities.find((item) => item.slug === slug);
export const getEvent = (slug: string) => events.find((item) => item.slug === slug);
export const getCulture = (slug: string) => cultureItems.find((item) => item.slug === slug);
export const communityName = (slug: string) => communities.find((item) => item.slug === slug);
export const eventsForCommunity = (slug: string) => events.filter((item) => item.communitySlug === slug);
export const cultureForEmirate = (emirate: EmirateKey) =>
  cultureItems.filter((item) => item.emirate === emirate);
