export interface AquascapeStyle {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  difficulty: "Ramah Pemula" | "Menengah" | "Tinggi" | "Sangat Tinggi";
  difficultyColor: string;
  description: string;
  characteristics: string[];
  recommendedPlants: string[];
  recommendedHardscape: string;
}

export interface SetupStep {
  number: string;
  phase: "Konstruksi" | "Biologis";
  title: string;
  subtitle: string;
  image: string;
  summary: string;
  details: string[];
  criticalTip: string;
}

export interface SubstrateLayer {
  level: number;
  name: string;
  role: string;
  description: string;
  tag: string;
}

export interface AlgaeGuide {
  name: string;
  latin: string;
  image: string;
  cause: string;
  solution: string;
  faunaHero: string;
}

export const AQUASCAPE_STYLES: AquascapeStyle[] = [
  {
    id: "jungle",
    name: "Jungle Style",
    subtitle: "Rimbun Rimba Alami & Minim Intervensi",
    image: "/panduan/jungle-style-highres.jpg",
    difficulty: "Ramah Pemula",
    difficultyColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    description:
      "Gaya menyerupai sungai tropis liar di mana tanaman dibiarkan bertumbuh rimbun menyatu tanpa batas kaku. Sangat toleran terhadap fluktuasi parameter air dan tidak menuntut jadwal pemangkasan yang ketat.",
    characteristics: [
      "Kombinasi tanaman cepat tumbuh dan epifit rimbun",
      "Minim pemangkasan daun harian",
      "Sangat toleran dan ramah untuk pemula",
      "Keseimbangan biologis alami yang stabil",
    ],
    recommendedPlants: ["Vallisneria", "Amazon Sword", "Cryptocoryne", "Java Fern", "Water Sprite"],
    recommendedHardscape: "Akar Rasamala liar, Kayu Santigi, dan Batu Kali halus",
  },
  {
    id: "nature",
    name: "Nature Aquarium Style",
    subtitle: "Replikasi Lanskap Alam Karya Takashi Amano",
    image: "/panduan/nature-style-highres.jpg",
    difficulty: "Menengah",
    difficultyColor: "bg-zinc-100 text-zinc-900 border-zinc-300",
    description:
      "Dipelopori oleh maestro Takashi Amano (ADA Jepang). Mengadopsi prinsip wabi-sabi dan hukum golden ratio (1:1.618) untuk menciptakan lanskap miniatur alam seperti hutan berkabut, lembah sungai, atau tebing pegunungan.",
    characteristics: [
      "Menggunakan batu dan ranting kayu sebagai kerangka utama",
      "Fokus pada tanaman epifit, moss, dan stem plant",
      "Menciptakan ilusi perspektif dan kedalaman visual (depth)",
      "Butuh tata kelola pencahayaan dan CO2 yang presisi",
    ],
    recommendedPlants: ["Anubias Nana Petite", "Bucephalandra", "Christmas Moss", "Rotala rotundifolia"],
    recommendedHardscape: "Batu Seiryu / Ryuoh Stone & Kayu Senggani / Bogwood",
  },
  {
    id: "iwagumi",
    name: "Iwagumi Style",
    subtitle: "Filosofi Zen Bebatuan Berjumlah Ganjil",
    image: "/panduan/iwagumi-real.jpg",
    difficulty: "Tinggi",
    difficultyColor: "bg-amber-100 text-amber-900 border-amber-300",
    description:
      "Seni penataan batu spiritual Jepang dengan formasi batuan ganjil (minimal 3 atau 5 batu) di atas hamparan karpet hijau terhampar. Membutuhkan kontrol parameter air ketat karena batuan dapat menaikkan kesadahan (TDS/GH).",
    characteristics: [
      "Formasi bebatuan ganjil: Oyaishi (batu utama), Fukuishi, Soeishi, Suteishi",
      "Tanpa menggunakan kayu apung sama sekali",
      "Didominasi tanaman karpet rumput tunggal",
      "Rentan ledakan alga jika cahaya dan CO2 tidak seimbang",
    ],
    recommendedPlants: ["Micranthemum 'Monte Carlo'", "Glossostigma", "Eleocharis 'Hairgrass'"],
    recommendedHardscape: "Seiryu Stone, Dragon Stone (Ohko Stone), Frodo Stone",
  },
  {
    id: "dutch",
    name: "Dutch Aquarium Style",
    subtitle: "Taman Bunga Air Terasering Klasik Belanda",
    image: "/panduan/dutch-style-crisp.webp",
    difficulty: "Sangat Tinggi",
    difficultyColor: "bg-rose-100 text-rose-900 border-rose-300",
    description:
      "Aliran klasik Eropa tertua sejak 1930-an. Menitikberatkan pada keindahan kontras warna, tekstur, dan ketinggian tanaman batang (stem plants) yang ditata rapi layaknya petak taman bunga Belanda tanpa kayu atau batu dekorasi.",
    characteristics: [
      "100% didominasi tanaman batang tanpa hardscape batu/kayu",
      "Aturan ketat jalur jalanan (Dutch street) dan zonasi terasering",
      "Kontras warna hijau cerah, merah darah, hingga tembaga",
      "Menuntut pemangkasan super disiplin dan dosis pupuk harian",
    ],
    recommendedPlants: ["Ludwigia glandulosa", "Rotala Macrandra", "Lobelia cardinalis", "Pogostemon helferi"],
    recommendedHardscape: "Tanpa Hardscape (Murni tanaman dan substrat)",
  },
];

export const SETUP_STEPS: SetupStep[] = [
  {
    number: "01",
    phase: "Konstruksi",
    title: "Sketsa & Penentuan Konsep",
    subtitle: "Tentukan Aliran Gaya & Dimensi Tangki",
    image: "/panduan/optiwhite-tank.jpg",
    summary:
      "Pilih salah satu dari 4 aliran gaya utama sesuai komitmen waktu Anda. Rencanakan titik fokus visual (focal point) berdasarkan aturan rasio emas sepertiga (rule of thirds).",
    details: [
      "Pilih dimensi tank: Rekomendasi pemula adalah panjang 60 cm (volume ~54 liter) karena parameter air jauh lebih stabil dibanding nano tank.",
      "Tentukan apakah ingin menggunakan sistem CO2 tabung tertekanan atau low-tech tanpa CO2.",
      "Siapkan sketsa kasar letak titik berat batu dan arah ranting kayu.",
    ],
    criticalTip: "Jangan gunakan tangki terlalu kecil (< 20L) untuk percobaan pertama; air lekas berfluktuasi dan memicu kematian tanaman.",
  },
  {
    number: "02",
    phase: "Konstruksi",
    title: "Hardware & Alat Planting",
    subtitle: "Pilar Peralatan Penunjang Hidup",
    image: "/panduan/step02-tools-complete.jpg",
    summary:
      "Siapkan perangkat fisik utama: Kaca Opti-white rimless, Lampu LED WRGB, Filter Canister, sistem CO2, serta set pinset lurus, pinset bengkok, dan gunting wave.",
    details: [
      "Kaca Opti-White (low-iron): Bebas distorsi warna kehijauan, kejernihan visual kristal 99%.",
      "Pinset & Gunting Wave: Memudahkan penanaman sudut sempit tanpa membongkar butiran soil sekitar.",
      "Filter Canister: Berikan kapasitas turnover minimal 5–8x volume air per jam dengan media biologis berpori.",
    ],
    criticalTip: "Gunting wave melengkung memudahkan pemangkasan tanaman karpet (Monte Carlo) di dasar tanpa menekuk pergelangan tangan.",
  },
  {
    number: "03",
    phase: "Konstruksi",
    title: "Dry Scape (Penataan Kering)",
    subtitle: "Eksplorasi Formasi Batu & Kayu Tanpa Air",
    image: "/panduan/step03-dryscape-seiryu.jpg",
    summary:
      "Susun kerangka batu dan kayu saat tangki masih benar-benar kering tanpa setetes air pun. Rekatkan sambungan menggunakan lem khusus cyanoacrylate dan bubuk kayu agar kokoh dan tidak roboh.",
    details: [
      "Gunakan kardus tebal di bawah tangki saat menyusun batu agar kaca dasar tidak retak atau tergores.",
      "Pastikan ada jarak 3–4 cm antara hardscape dengan kaca depan/samping agar scraper pembersih lumut bisa lewat.",
      "Eksplorasi berbagai sudut sebelum pengeleman permanen saat tangki masih kering total.",
    ],
    criticalTip: "Uji kekokohan hardscape dengan menggoyangnya perlahan; hardscape yang roboh saat sudah terisi air dapat memecahkan kaca!",
  },
  {
    number: "04",
    phase: "Konstruksi",
    title: "Fondasi 5 Lapisan Substrat",
    subtitle: "Struktur Tanah & Kemiringan Lereng",
    image: "/panduan/step04-5-layers-substrate.svg",
    summary:
      "Terapkan aturan kemiringan lereng: tebal 3–4 cm di kaca depan dan 7–10 cm di kaca belakang guna menciptakan ilusi kedalaman ruang visual yang mendalam.",
    details: [
      "Lapisan 1: Taburkan bubuk bakteri starter merata di atas kaca dasar kering.",
      "Lapisan 2: Masukkan batu apung/pumice di kantung jaring sebagai rumah bakteri dan pencegah zona anaerobik busuk.",
      "Lapisan 3: Tabur pupuk dasar lepas lambat sebagai tabungan nutrisi jangka panjang akar.",
      "Lapisan 4: Tutup dengan aqua soil aktif vulkanik berkualitas dengan sudut kemiringan tajam ke belakang.",
    ],
    criticalTip: "Jangan pernah mencuci aqua soil aktif dengan air sebelum dituangkan; tanah akan langsung hancur menjadi bubur lumpur.",
  },
  {
    number: "05",
    phase: "Konstruksi",
    title: "Penanaman Flora Teratur",
    subtitle: "Zonasi Ketinggian & Mist Semprot",
    image: "/panduan/step05-tweezers-planting-anubias.jpg",
    summary:
      "Semprot soil hingga lembap tetapi tidak menggenang. Gunakan pinset penjepit dengan sudut 45 derajat agar akar tertanam kuat tanpa tertarik kembali saat pinset ditarik keluar.",
    details: [
      "Foreground (Depan): Tanaman karpet pendek seperti Monte Carlo, Hairgrass.",
      "Midground (Tengah): Epifit Anubias, Buce, Cryptocoryne yang ditempel pada celah kayu/batu.",
      "Background (Belakang): Tanaman batang tinggi seperti Rotala, Ludwigia, Vallisneria.",
      "Semprot mist air bersih setiap 5 menit agar daun tidak dehidrasi selama proses tanam.",
    ],
    criticalTip: "Untuk tanaman epifit (Anubias/Buce), jangan kubur batangnya! Ikat atau rekatkan pada batu menggunakan lem khusus.",
  },
  {
    number: "06",
    phase: "Biologis",
    title: "Pengisian Air Tanpa Keruh",
    subtitle: "Alirkan Perlahan di Atas Plastik",
    image: "/panduan/step06-filling-water-guide.svg",
    summary:
      "Tutup seluruh tanaman dan substrat menggunakan lembaran plastik pembungkus atau piring kecil. Alirkan air melalui selang kecil secara perlahan di atas plastik pelindung.",
    details: [
      "Aliran air yang terlalu deras langsung mengenai soil akan mengaduk tanah vulkanik dan membuat air keruh pekat berhari-hari.",
      "Isi air hingga 3/4 tangki, angkat plastik secara perlahan, lalu isi penuh.",
      "Nyalakan filter canister dan pasang skimmer jika ada minyak organik di permukaan air.",
    ],
    criticalTip: "Gunakan air bersumber aman (air tanah matang/air RO/air PAM yang sudah dideklorinasi dengan anti-klorin).",
  },
  {
    number: "07",
    phase: "Biologis",
    title: "Siklus Nitrogen & Cycling",
    subtitle: "Pematangan Koloni Bakteri (2–4 Minggu)",
    image: "/panduan/step07-nitrogen-cycle-diagram.png",
    summary:
      "Jangan masukkan ikan hias selama proses ini! Bakteri nitrifikasi membutuhkan waktu 14–28 hari untuk mengonversi amonia beracun menjadi nitrit lalu menjadi nitrat yang aman.",
    details: [
      "Hari 1–3: Amonia melonjak tajam dari nutrisi soil baru.",
      "Hari 7–14: Bakteri Nitrosomonas berkembang mengubah amonia menjadi nitrit (NO2-).",
      "Hari 14–28: Bakteri Nitrobacter mengubah nitrit menjadi nitrat (NO3-) yang diserap tanaman.",
      "Cycling selesai ditandai dengan parameter amonia = 0 ppm dan nitrit = 0 ppm pada tes kit.",
    ],
    criticalTip: "Lakukan ganti air 50% setiap 2 hari pada minggu ke-1 untuk membuang kelebihan amonia awal yang memicu lumut cokelat.",
  },
  {
    number: "08",
    phase: "Biologis",
    title: "Pelepasan Pasukan Pembersih",
    subtitle: "Cleaning Crew Masuk di Pekan ke-2",
    image: "/panduan/cleaning-crew.jpg",
    summary:
      "Ketika lumut cokelat (diatom) mulai muncul di akhir pekan ke-2 dan amonia mulai turun, masukkan tim pembersih alami untuk mengendalikan lumut secara biologis.",
    details: [
      "Udang Red Cherry / Amano Shrimp: Memakan lumut benang halus dan sisa daun lumer.",
      "Keong Tanduk (Horned Nerite Snail): Rajin membersihkan lapisan diatom cokelat dan biofilm di kaca dan batu tanpa memakan tanaman hidup.",
      "Ikan Otocinclus Affinis: Pemakan lumut cokelat paling rakus dan sangat ramah tanaman.",
    ],
    criticalTip: "Lakukan aklimatisasi suhu dan air selama minimal 30 menit sebelum melepaskan udang/keong ke dalam tangki.",
  },
  {
    number: "09",
    phase: "Biologis",
    title: "Pelepasan Fauna Sekolah",
    subtitle: "Ikan Hias Masuk Bertahap",
    image: "/panduan/fish-schooling.jpg",
    summary:
      "Setelah parameter air 100% stabil (pekan ke-4), masukkan ikan hias perenang berkelompok (schooling fish) seperti Neon Tetra, Harlequin Rasbora, atau Manfish secara bertahap.",
    details: [
      "Jangan masukkan seluruh ikan sekaligus agar koloni bakteri tidak kaget oleh lonjakan kotoran tiba-tiba.",
      "Beri pakan secukupnya dalam porsi kecil yang habis dalam 1–2 menit untuk mencegah endapan pakan basi di dasar tangki.",
      "Fauna berperan menghasilkan CO2 alami dan nitrat organik bagi kesuburan tanaman.",
    ],
    criticalTip: "Pilih fauna yang tidak agresif dan tidak gemar mengacak-acak tanaman karpet di dasar tangki.",
  },
  {
    number: "10",
    phase: "Biologis",
    title: "SOP Perawatan Rutin",
    subtitle: "Konsistensi Kunci Akuarium Abadi",
    image: "/panduan/water-change.png",
    summary:
      "Ganti air 20–30% setiap pekan sekali, bersihkan kaca akuarium dengan spons halus, pangkas pucuk tanaman batang, dan berikan pupuk cair makro-mikro terukur.",
    details: [
      "Water Change mingguan membuang hormon penghambat tumbuh dan menjaga kejernihan kristal air.",
      "Pangkas tanaman batang secara teratur agar tunas baru bercabang lebat (bushy effect).",
      "Bersihkan media busa mekanis filter setiap 1–2 bulan sekali menggunakan air kurasan akuarium (bukan air kran berkaustik).",
    ],
    criticalTip: "Aquascape yang berhasil bukan ditentukan oleh mahalnya alat, melainkan kesabaran dan konsistensi perawatannya.",
  },
];

export const SUBSTRATE_LAYERS: SubstrateLayer[] = [
  {
    level: 1,
    name: "Bakteri Starter Aktif (Glass Base)",
    role: "Fondasi Dekomposisi Awal",
    description:
      "Bubuk mikroba nitrifikasi aktif ditabur langsung di atas kaca dasar kering. Berperan mengaktifkan dekomposisi organik dan mempercepat kolonisasi bakteri pengurai sejak hari pertama pengisian air.",
    tag: "Wajib di Kaca Dasar",
  },
  {
    level: 2,
    name: "Rumah Bakteri (Pumice / Volcanic Lava Rock)",
    role: "Pencegah Zona Busuk Anaerobik",
    description:
      "Batu apung berpori mikro tinggi yang dimasukkan ke dalam kantung jaring. Menyediakan oksigen bagi akar terdalam dan mencegah pemadatan tanah yang memicu timbunan gas beracun hidrogen sulfida (H2S).",
    tag: "Aerasi Dasar & Sirkulasi",
  },
  {
    level: 3,
    name: "Pupuk Dasar (Base Fertilizer)",
    role: "Tabungan Nutrisi Akar Jangka Panjang",
    description:
      "Nutrisi mineral pelepasan lambat (slow-release) kaya unsur makro (N, P, K) dan mikro (Fe, Mn, B). Menyuplai makanan akar tanaman bawah tanah selama 6–12 bulan pertama kehidupan ekosistem.",
    tag: "Nutrisi Pelepasan Lambat",
  },
  {
    level: 4,
    name: "Aqua Soil Aktif Vulkanik (Top Soil Layer)",
    role: "Penyangga pH & Cation Exchange Capacity",
    description:
      "Tanah vulkanik butiran hitam yang kaya asam humat dan fulvat. Berfungsi menurunkan dan menyangga pH air di kisaran ideal (6.0–6.8), mengikat kation pupuk cair, dan memudahkan akar mencengkeram tanah.",
    tag: "Media Tanam Utama",
  },
  {
    level: 5,
    name: "Pasir Kosmetik / Detail Hardscape (Opsional)",
    role: "Aksen Estetika Natural",
    description:
      "Pasir silika alami, pasir garnet, atau pasir sungai yang digunakan untuk membentuk ilusi aliran sungai, pantai miniatur, atau pemisah jalur terasering alami tanpa mengubah kesadahan air.",
    tag: "Aksen Estetika Visual",
  },
];

export interface PlantMorphology {
  id: string;
  name: string;
  latinType: string;
  image: string;
  tag: string;
  definition: string;
  keyRule: string;
  characteristics: string[];
  examples: string[];
}

export interface PlantZone {
  id: string;
  name: string;
  zoneType: "Foreground" | "Midground" | "Background";
  heightRange: string;
  image: string;
  role: string;
  description: string;
  placementTip: string;
  examples: string[];
}

export interface FilterMediaStage {
  stage: number;
  name: string;
  type: "Mekanis (Tahap 1)" | "Biologis (Tahap 2)" | "Kimiawi (Tahap 3)";
  badgeColor: string;
  position: "Bagian Bawah (Masuk Awal)" | "Bagian Tengah (Volume Terbesar)" | "Bagian Atas (Pintu Keluar)";
  mediaExamples: string[];
  function: string;
  criticalNote: string;
}

export const PLANT_MORPHOLOGIES: PlantMorphology[] = [
  {
    id: "epifit",
    name: "Tanaman Epifit",
    latinType: "Epiphytic Plants",
    image: "/panduan/plant-epifit.png",
    tag: "Menempel di Kayu/Batu",
    definition:
      "Tumbuh dengan cara menempel erat pada batuan alam atau ranting kayu hardscape tanpa memerlukan substrat tanah. Epifit bukan parasit; tanaman ini menyerap nutrisi murni langsung dari kolom air melalui pori daun dan akarnya.",
    keyRule: "Gunakan lem gel cyanoacrylate khusus aquascape atau ikat dengan benang nilon tipis pada celah hardscape.",
    characteristics: [
      "Tidak menyerap nutrisi dari inang batu/kayu",
      "Sistem perakaran berfungsi sebagai perekat / cengkeraman",
      "Sangat fleksibel dipindah atau diatur ulang",
      "Tahan naungan dan cocok untuk pencahayaan rendah–sedang",
    ],
    examples: ["Anubias Nana Petite", "Bucephalandra Kishii", "Java Fern (Microsorum)", "Aquatic Moss (Christmas/Java)"],
  },
  {
    id: "rhizome",
    name: "Tanaman Rhizome",
    latinType: "Rhizomatous Plants",
    image: "/panduan/plant-rhizome.png",
    tag: "Batang Horizontal Tebal",
    definition:
      "Memiliki batang modifikasi horizontal tebal (rhizome/rimpang) yang berfungsi sebagai pusat metabolisme, cadangan karbohidrat, serta tempat bertunas daun dan akar serabut.",
    keyRule: "PANTANGAN FATAL: Jangan kubur batang rhizome di dalam aqua soil! Wajib terpapar sirkulasi air terbuka agar tidak busuk.",
    characteristics: [
      "Batang horizontal padat dan lambat bertumbuh",
      "Sangat sensitif terhadap zona anaerobik tertutup",
      "Perbanyakan mudah dengan memotong rhizome minimal 3–4 helai daun",
      "Daun tebal berlapis kutikula lilin alami",
    ],
    examples: ["Anubias Barteri var. Nana", "Anubias Coffeefolia", "Bucephalandra Velvet", "Bolbitis heudelotii"],
  },
  {
    id: "rosette",
    name: "Tanaman Rosette",
    latinType: "Rosette Plants",
    image: "/panduan/plant-rosette.png",
    tag: "Daun Melingkar Memusat",
    definition:
      "Memiliki struktur tajuk daun yang tumbuh melingkar memusat dari satu titik basal pendek di permukaan tanah. Memiliki sistem perakaran masif dan dalam yang sangat rakus menyerap nutrisi dari dasar substrat.",
    keyRule: "Tancap akar ke dalam aqua soil aktif dan berikan pupuk tancap (root tabs) berkala di dekat perakaran.",
    characteristics: [
      "Daun memancar melingkar dari tengah tanaman",
      "Rakus menyerap zat besi (Fe) dan makro dari tanah",
      "Perbanyakan melalui tunas anakan samping (runner/stolons)",
      "Sangat kokoh dan tidak mudah tercabut fauna",
    ],
    examples: ["Cryptocoryne wendtii 'Brown'", "Amazon Sword (Echinodorus)", "Vallisneria spiralis", "Helanthium tenellum"],
  },
  {
    id: "stem",
    name: "Tanaman Batang (Stem)",
    latinType: "Stem / Caulescent Plants",
    image: "/panduan/plant-stem.png",
    tag: "Tegak Menjulang & Cepat Tumbuh",
    definition:
      "Tumbuh memanjang vertikal ke atas dengan ruas-ruas buku (nodes) tempat daun bertingkat keluar. Merupakan penyerap nutrisi nitrat terbesar di akuarium dan sangat efektif mencegah ledakan lumut.",
    keyRule: "Perbanyakan lewat teknik potong stek (trim & replant) pucuk atas untuk ditancapkan kembali ke substrat.",
    characteristics: [
      "Laju pertumbuhan sangat pesat (fast grower)",
      "Menuntut intensitas cahaya WRGB dan CO2 stabil untuk warna merah",
      "Membentuk semak lebat (bushy effect) jika dipangkas teratur",
      "Menyerap nutrisi ganda: dari air dan dari akar tanah",
    ],
    examples: ["Rotala H'ra / rotundifolia", "Ludwigia repens 'Super Red'", "Bacopa caroliniana", "Pogostemon erectus"],
  },
];

export const PLANT_ZONES: PlantZone[] = [
  {
    id: "foreground",
    name: "Foreground (Latar Depan)",
    zoneType: "Foreground",
    heightRange: "1 – 3 cm",
    image: "/panduan/zone-foreground.png",
    role: "Karpet Hijau Muka Tangki",
    description:
      "Area paling depan di dekat kaca akuarium. Ditanami tanaman berkarakter merayap rendah yang membentuk padang rumput lebat (carpet effect) tanpa menghalangi pandangan ke bagian tengah dan belakang.",
    placementTip: "Bagi tanaman karpet menjadi gumpalan kecil seukuran koin, lalu tancap serong berselang-seling dengan pola zig-zag agar cepat merambat rapat.",
    examples: ["Micranthemum 'Monte Carlo'", "Eleocharis acicularis (Hairgrass)", "Glossostigma elatinoides", "Marsilea hirsuta"],
  },
  {
    id: "midground",
    name: "Midground (Latar Tengah)",
    zoneType: "Midground",
    heightRange: "5 – 15 cm",
    image: "/panduan/zone-midground.png",
    role: "Transisi Alami & Penutup Hardscape",
    description:
      "Zona transisi antara karpet depan dan latar belakang. Berperan menutupi celah semen pengeleman batu/kayu, sambungan akar, dan menciptakan ilusi gradasi kedalaman perspektif ruang (3D depth).",
    placementTip: "Selipkan epifit Anubias Petite atau Bucephalandra di celah bayangan kayu, dan tanam semak Cryptocoryne di lereng transisi.",
    examples: ["Anubias Nana Petite", "Bucephalandra sp.", "Staurogyne repens", "Cryptocoryne parva", "Blyxa japonica"],
  },
  {
    id: "background",
    name: "Background (Latar Belakang)",
    zoneType: "Background",
    heightRange: "20 – 40+ cm",
    image: "/panduan/zone-background.png",
    role: "Tirai Hijau Rimbun Penutup Kaca Belakang",
    description:
      "Area paling belakang akuarium tempat tanaman berdaun panjang atau berbatang tinggi tumbuh menjulang. Berfungsi menutupi pipa inlet/outlet filter, pemanas, dan menjadi penyerap kelebihan nitrat utama ekosistem.",
    placementTip: "Pangkas pucuk tanaman batang secara berkala saat mencapai 3/4 ketinggian air; 2–3 tunas baru akan bercabang dari setiap buku pemangkasan.",
    examples: ["Rotala rotundifolia / Green", "Ludwigia glandulosa", "Vallisneria americana", "Cyperus helferi", "Amazon Sword"],
  },
];

export const FILTER_MEDIA_STAGES: FilterMediaStage[] = [
  {
    stage: 1,
    name: "Filtrasi Mekanis (Pintu Masuk Pertama)",
    type: "Mekanis (Tahap 1)",
    badgeColor: "bg-blue-100 text-blue-900 border-blue-300",
    position: "Bagian Bawah (Masuk Awal)",
    mediaExamples: ["Coarse Bio-Foam (Busa Kasar)", "Jap Mat", "Dacron (Kapas Filter Putih Halus)"],
    function:
      "Menyaring dan memerangkap kotoran fisik kasar, serpihan daun busuk, dan feses ikan yang terhisap pipa inlet sebelum air menyentuh media biologis.",
    criticalNote:
      "MENGAPA HARUS PERTAMA? Mencegah partikel lumpur dan kotoran padat menyumbat pori-pori mikroskopis rumah bakteri. Jika pori tersumbat, bakteri mati lemas akibat kekurangan oksigen!",
  },
  {
    stage: 2,
    name: "Filtrasi Biologis (Jantung Ekosistem Filter)",
    type: "Biologis (Tahap 2)",
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
    position: "Bagian Tengah (Volume Terbesar)",
    mediaExamples: ["Seachem Matrix", "Ceramic Rings Berpori", "Pumice (Batu Apung)", "Sintered Bio-Glass"],
    function:
      "Menyediakan luas permukaan biologis mikroskopis raksasa (hingga 700 m² per liter media) sebagai hunian koloni jutaan bakteri nitrifikasi (Nitrosomonas & Nitrobacter) yang memecah amonia menjadi nitrat.",
    criticalNote:
      "PANTANGAN FATAL: Jangan pernah mencuci media biologis menggunakan air kran berkaporit! Klorin akan memusnahkan koloni bakteri. Cuci perlahan menggunakan air buangan kurasan tangki.",
  },
  {
    stage: 3,
    name: "Filtrasi Kimiawi (Pintu Keluar - Opsional)",
    type: "Kimiawi (Tahap 3)",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
    position: "Bagian Atas (Pintu Keluar)",
    mediaExamples: ["Seachem Purigen", "Karbon Aktif Berkualitas", "Phosphate Remover Resin"],
    function:
      "Menyerap zat kimia mikroskopis terlarut, membuang tanin kuning pekat yang keluar dari kayu apung baru, menghilangkan bau amis, dan menjadikan air berkilau sebening kristal.",
    criticalNote:
      "Ditaruh paling akhir sebelum air bersih dipompa kembali ke akuarium. Wajib dikeluarkan saat Anda sedang memberikan obat karantina pada ikan hias.",
  },
];

export const ALGAE_GUIDES: AlgaeGuide[] = [
  {
    name: "Lumut Cokelat / Diatom",
    latin: "Bacillariophyta (Brown Algae)",
    image: "/panduan/algae-diatom.jpg",
    cause:
      "Sangat wajar terjadi pada tangki baru usia 1–3 pekan akibat tingginya kandungan silikat pada kaca/pasir dan ekosistem bakteri nitrifikasi yang belum matang sepenuhnya.",
    solution:
      "Akan hilang dengan sendirinya seiring stabilnya siklus nitrogen. Lakukan ganti air teratur dan masukkan tim pembersih alami.",
    faunaHero: "Keong Tanduk (Horned Snail) & Otocinclus Affinis",
  },
  {
    name: "Green Spot Algae (GSA)",
    latin: "Choleochaete (Bintik Hijau Kaca)",
    image: "/panduan/algae-greenspot.jpg",
    cause:
      "Bintik hijau keras menempel di kaca atau daun tua Anubias. Dipicu durasi pencahayaan terlalu panjang (> 10 jam) atau rasio fosfat (PO4) yang terlalu rendah.",
    solution:
      "Kurangi durasi pencahayaan harian, bersihkan kaca menggunakan scraper silet akrilik, dan periksa suplai pupuk cair fosfat.",
    faunaHero: "Keong Tanduk Nerite & Scraper Kaca Manual",
  },
  {
    name: "Lumut Benang / Hair Algae",
    latin: "Spirogyra / Rhizoclonium",
    image: "/panduan/algae-hair.jpg",
    cause:
      "Untaian benang hijau halus kusut di sela-sela daun tanaman. Dipicu kelebihan zat besi (Fe) terlarut dan kelebihan cahaya tanpa diimbangi suplai CO2 yang memadai.",
    solution:
      "Gulung benang menggunakan tusuk gigi atau sikat gigi bekas, kurangi dosis pupuk besi sementara, dan naikkan suplai gas CO2.",
    faunaHero: "Udang Amano (Caridina multidentata) & Udang Red Cherry",
  },
  {
    name: "Black Beard Algae (BBA)",
    latin: "Audouinella (Lumut Janggut Hitam)",
    image: "/panduan/algae-bba.jpg",
    cause:
      "Rumpun bulu hitam/kelabu pekat menempel erat di ujung kayu, batu, atau pinggiran daun lambat tumbuh. Penyebab utama: fluktuasi kadar CO2 yang naik-turun dan arus air kencang kotor.",
    solution:
      "Stabilkan injeksi CO2 menggunakan timer, semprot langsung titik lumut menggunakan cairan Liquid Carbon (Glutaraldehyde) dengan spuit suntikan saat filter dimatikan.",
    faunaHero: "Ikan Siamese Algae Eater (SAE) & Semprot Spot Liquid Carbon",
  },
];
