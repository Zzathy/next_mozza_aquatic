import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  Sparkles,
  ArrowRight,
  MessageCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  AQUASCAPE_STYLES,
  ALGAE_GUIDES,
} from "./guide-data";
import PublicNavbar from "@/components/PublicNavbar";
import SetupStepsExplorer from "./SetupStepsExplorer";
import TankCalculator from "./TankCalculator";
import RhizomeVisualGuide from "./RhizomeVisualGuide";
import SubstrateLayersVisual from "./SubstrateLayersVisual";
import NitrogenCycleVisual from "./NitrogenCycleVisual";
import PhotosynthesisLiebigVisual from "./PhotosynthesisLiebigVisual";
import PlantVarietiesVisual from "./PlantVarietiesVisual";
import FilterMediaOrderVisual from "./FilterMediaOrderVisual";

export const metadata: Metadata = {
  title: "Panduan Aquascape dari Nol | Mozza Aquatic Banyuwangi",
  description:
    "Pelajari seni dan teknik aquascape dari nol: 4 aliran gaya estetika, 10 langkah eksekusi terpadu, struktur substrat 5 lapisan, anatomi rhizome, durasi pencahayaan, dan siklus nitrogen mandiri.",
  openGraph: {
    title: "Panduan Aquascape dari Nol | Mozza Aquatic",
    description:
      "Panduan komprehensif seni merancang ekosistem akuarium mandiri: dari pemilihan hardscape, substrat, penanaman epifit, hingga cycling biologis.",
    type: "article",
  },
};

export default function PanduanPage() {
  const storePhone = process.env.NEXT_PUBLIC_STORE_WHATSAPP || "6281234567890";
  const cleanPhone = storePhone.replace(/[^0-9]/g, "");
  const waConsultUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    "Halo Mozza Aquatic Banyuwangi, saya sedang membaca Panduan Aquascape di website dan ingin konsultasi mengenai setting tangki impian saya."
  )}`;

  const hardwareItems = [
    {
      name: "Tank Opti-White Rimless",
      image: "/panduan/optiwhite-tank.jpg",
      tag: "Kaca Low-Iron",
      role: "Pandangan Visual Kristal",
      desc: "Kaca khusus low-iron tanpa sabuk atas dan sambungan lem silikon transparan super rapi untuk pandangan jernih tanpa distorsi kehijauan.",
    },
    {
      name: "Lampu LED WRGB Spektrum Penuh",
      image: "/panduan/lighting-wrgb.jpg",
      tag: "Spektrum Fotosintetis",
      role: "Pemicu Klorofil Daun",
      desc: "Kombinasi spektrum White, Red, Green, Blue untuk memicu fotosintesis aktif dan mengeluarkan warna merah darah tanaman batang.",
    },
    {
      name: "Filter Canister Berkapasitas Besar",
      image: "/panduan/canister-filter.jpg",
      tag: "Filtrasi Biologis",
      role: "Rumah Koloni Bakteri",
      desc: "Menyediakan ruang media biologis berpori mikro besar. Rumus debit ideal: (P × L × T / 1000) × 8 s/d 12 L/jam untuk mengantisipasi head loss media 30%–50%.",
    },
    {
      name: "Sistem Injeksi CO2 Presisi",
      image: "/panduan/co2-system.jpg",
      tag: "Injeksi Karbon",
      role: "Bahan Baku Sel Daun",
      desc: "Regulator solenoid dengan bubble counter dan diffuser keramik mikro untuk menyuplai karbon terlarut stabil sepanjang jam lampu menyala.",
    },
    {
      name: "Set Pinset & Gunting Wave Aquascape",
      image: "/panduan/step02-tools-complete.jpg",
      tag: "Alat Planting Presisi",
      role: "Penanaman & Trimming",
      desc: "Pinset lurus, pinset bengkok, dan gunting wave melengkung stainless steel untuk menjepit tanaman sudut sempit dan memangkas karpet dasar tanpa mencabut tanah.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fbfbfb] text-zinc-900 selection:bg-zinc-200 selection:text-zinc-950 font-sans">
      {/* Top Shared Navbar */}
      <PublicNavbar storePhone={storePhone} />

      {/* Hero Section with Showcase Visual */}
      <section className="relative border-b border-zinc-200 bg-white py-12 sm:py-16 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 border border-zinc-200 text-zinc-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>WORKSHOP &amp; PANDUAN PRAKTIS BIOSAINS</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-zinc-950 tracking-tight leading-[1.12]">
              Seni &amp; Teknik Aquascape dari Nol
            </h1>

            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
              Panduan visual merancang ekosistem biosfer mini mandiri: harmoni tata kelola hardscape, biologi substrat, flora epifit, hingga siklus nitrogen stabil tanpa kuras habis.
            </p>
          </div>

          {/* Hero Image Showcase (Takashi Amano Nature Aquarium Masterpiece) */}
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-zinc-200 shadow-xl bg-zinc-950 max-w-4xl mx-auto">
            <div className="relative h-64 sm:h-96 w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/panduan/image4.png"
                alt="Nature Aquarium Masterpiece karya Takashi Amano"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

              <div className="absolute bottom-4 sm:bottom-6 inset-x-4 sm:inset-x-8 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold block mb-1">
                    FILOSOFI NATURE AQUARIUM
                  </span>
                  <p className="italic text-xs sm:text-sm text-zinc-200 max-w-xl leading-relaxed">
                    &ldquo;Belajarlah dari alam, tirulah keharmonisan alam, dan biarkan ekosistem berjalan seimbang dengan sabar.&rdquo;
                  </p>
                  <p className="text-xs font-bold text-white mt-1">
                    — Takashi Amano <span className="font-normal text-zinc-300">(Pelopor Aquascape Modern)</span>
                  </p>
                </div>

                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/20 text-xs font-mono backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Keseimbangan Flora &amp; Fauna</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Jump Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs pt-2">
            <a href="#komparasi" className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium transition-colors">
              Konvensional vs Biosfer
            </a>
            <a href="#fotosintesis" className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium transition-colors">
              Segitiga Fotosintesis
            </a>
            <a href="#gaya" className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium transition-colors">
              4 Aliran Gaya
            </a>
            <a href="#langkah" className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium transition-colors">
              10 Langkah Eksekusi
            </a>
            <a href="#hardware" className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium transition-colors">
              Hardware &amp; Pinset
            </a>
            <a href="#mediafilter" className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium transition-colors">
              Urutan Media Filter
            </a>
            <a href="#substrat" className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium transition-colors">
              5 Lapisan Substrat
            </a>
            <a href="#botani" className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium transition-colors">
              Morfologi &amp; Zonasi Flora
            </a>
            <a href="#epifit" className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium transition-colors">
              Aturan Rhizome
            </a>
            <a href="#siklus" className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium transition-colors">
              Siklus Nitrogen
            </a>
            <a href="#kalkulator" className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium transition-colors">
              Kalkulator Mesin &amp; Lampu
            </a>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
        {/* Module 1: Studi Komparasi Side-by-Side dengan Foto Asli Jelas */}
        <section id="komparasi" className="scroll-mt-24 space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 font-mono">
              FILOSOFI &amp; PRINSIP
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight mt-1">
              Bukan Sekadar Wadah Ikan, Melainkan Biosfer Hidup
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Perbandingan visual langsung antara akuarium konvensional dan ekosistem aquascape mandiri.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Akuarium Konvensional (Foto Nyata Jelas) */}
            <div className="rounded-2xl sm:rounded-3xl bg-white border border-zinc-200 shadow-xs overflow-hidden flex flex-col justify-between">
              <div className="relative h-56 sm:h-64 w-full bg-zinc-950 border-b border-zinc-200 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/panduan/conventional-tank-real.jpg"
                  alt="Akuarium Konvensional dengan Pasir Warna & Ornamen Plastik"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/80 text-zinc-200 backdrop-blur-md font-bold border border-white/10">
                  Sistem Konvensional
                </span>
              </div>

              <div className="p-5 sm:p-6 space-y-4">
                <h3 className="text-lg font-bold text-zinc-950">Akuarium Konvensional</h3>
                <ul className="space-y-2.5 text-xs text-zinc-600">
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span><strong>Fokus:</strong> Pajangan ikan semata tanpa tanaman air asli.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span><strong>Dekorasi:</strong> Ornamen plastik sintetis dan pasir warna buatan.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span><strong>Filtrasi:</strong> Ketergantungan obat kimia anti-keruh dan kuras air 100%.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span><strong>Kendala:</strong> Air cepat keruh, berbau, dan ikan mudah stres.</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-zinc-50 border-t border-zinc-100 text-xs text-zinc-500 font-medium">
                Tantangan: Memerlukan tenaga kuras fisik yang melelahkan.
              </div>
            </div>

            {/* Aquascape Ekosistem Mandiri */}
            <div className="rounded-2xl sm:rounded-3xl bg-white border border-zinc-900 shadow-sm overflow-hidden flex flex-col justify-between">
              <div className="relative h-56 sm:h-64 w-full bg-zinc-900 border-b border-zinc-200 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/panduan/image15.png"
                  alt="Aquascape Ekosistem Mandiri"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-zinc-950 text-white border border-white/20 backdrop-blur-md font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Biosfer Mandiri
                </span>
              </div>

              <div className="p-5 sm:p-6 space-y-4">
                <h3 className="text-lg font-bold text-zinc-950">Aquascape Mandiri Berkelanjutan</h3>
                <ul className="space-y-2.5 text-xs text-zinc-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Fokus:</strong> Tanaman hidup alami sebagai aktor primer penyuplai oksigen.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Dekorasi:</strong> 100% batuan alam, kayu apung alami, dan soil vulkanik aktif.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Filtrasi:</strong> Koloni bakteri nitrifikasi mandiri pengurai racun kotoran.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Keunggulan:</strong> Air selalu jernih kristal tanpa pernah perlu kuras total 100%!</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-zinc-50 border-t border-zinc-100 text-xs font-semibold text-zinc-900 flex items-center justify-between">
                <span>Hasil: Relaksasi visual dan terapi batin alami.</span>
                <span className="text-[10px] text-emerald-600 font-mono">AIR SEJERNIH KRISTAL</span>
              </div>
            </div>
          </div>
        </section>

        {/* Module 2: Segitiga Emas Fotosintesis & Simulasi Tong Liebig */}
        <section id="fotosintesis" className="scroll-mt-24">
          <PhotosynthesisLiebigVisual />
        </section>

        {/* Module 3: 4 Aliran Estetika Aquascape Dunia (Foto Jelas & Uncropped) */}
        <section id="gaya" className="scroll-mt-24 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 font-mono">
                KLASIFIKASI ESTETIKA
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight mt-1">
                4 Aliran Utama Gaya Aquascape Dunia
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Pilih aliran yang sesuai dengan ketersediaan waktu luang dan preferensi visual Anda.
              </p>
            </div>

            <Link
              href="/katalog"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold border border-zinc-200/80 transition-colors shrink-0"
            >
              <span>Eksplorasi Tanaman di Katalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {AQUASCAPE_STYLES.map((style) => (
              <div
                key={style.id}
                className="rounded-2xl sm:rounded-3xl bg-white border border-zinc-200/90 shadow-xs overflow-hidden flex flex-col justify-between hover:border-zinc-400 transition-colors group"
              >
                {/* Style Photo Banner (Natural aspect ratio, never awkwardly cropped) */}
                <div className="relative h-60 sm:h-68 w-full bg-zinc-950 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={style.image}
                    alt={style.name}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  <span className={`absolute top-3 right-3 text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border font-semibold shadow-xs ${style.difficultyColor}`}>
                    {style.difficulty}
                  </span>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-950">{style.name}</h3>
                    <p className="text-xs font-medium text-zinc-500 mt-0.5">{style.subtitle}</p>
                    <p className="text-xs text-zinc-600 leading-relaxed mt-2.5">{style.description}</p>
                  </div>

                  <div className="space-y-1.5 text-xs text-zinc-700 bg-zinc-50 p-3.5 rounded-xl border border-zinc-200/70">
                    <span className="text-[10px] uppercase font-mono text-zinc-400 block font-semibold">
                      Karakteristik Kunci:
                    </span>
                    {style.characteristics.map((char, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-zinc-400 mt-2 shrink-0" />
                        <span>{char}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-zinc-100 space-y-1.5 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-zinc-400 block">Tanaman Rekomendasi:</span>
                      <span className="font-semibold text-zinc-900">{style.recommendedPlants.join(", ")}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono text-zinc-400 block">Hardscape:</span>
                      <span className="text-zinc-600">{style.recommendedHardscape}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Module 4: 10 Tahapan Eksekusi (Redesigned Sequential Explorer) */}
        <section id="langkah" className="scroll-mt-24">
          <SetupStepsExplorer />
        </section>

        {/* Module 5: Hardware & Pinset Gunting Wave Showcase */}
        <section id="hardware" className="scroll-mt-24 space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 font-mono">
              PERANGKAT &amp; ALAT KERJA
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight mt-1">
              5 Pilar Hardware &amp; Alat Planting Esensial
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Spesifikasi peralatan standar toko untuk menjaga ekosistem tetap bening, subur, dan mudah dirawat.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {hardwareItems.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-zinc-200 overflow-hidden shadow-xs flex flex-col justify-between group hover:border-zinc-400 transition-colors"
              >
                <div>
                  <div className="relative h-44 w-full bg-zinc-950 overflow-hidden flex items-center justify-center p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2 right-2 text-[9px] font-mono px-2 py-0.5 rounded bg-black/75 text-white backdrop-blur-md">
                      {item.tag}
                    </span>
                  </div>

                  <div className="p-4 space-y-1.5">
                    <span className="text-[10px] font-mono uppercase text-zinc-400 font-semibold block">
                      {item.role}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-zinc-950 leading-snug">{item.name}</h4>
                    <p className="text-[11px] text-zinc-600 leading-relaxed mt-1">{item.desc}</p>
                  </div>
                </div>

                <div className="p-3 border-t border-zinc-100 text-[10px] font-mono text-emerald-600 font-semibold text-center">
                  Tersedia di Mozza Aquatic
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Module 6: Struktur & Urutan Media Filter Canister */}
        <section id="mediafilter" className="scroll-mt-24">
          <FilterMediaOrderVisual />
        </section>

        {/* Module 7: 5 Lapisan Substrat Interaktif */}
        <section id="substrat" className="scroll-mt-24">
          <SubstrateLayersVisual />
        </section>

        {/* Module 8: Botani Aquascape - 4 Morfologi & 3 Zonasi Flora */}
        <section id="botani" className="scroll-mt-24">
          <PlantVarietiesVisual />
        </section>

        {/* Module 9: Aturan Fatal Epifit & Rhizome dengan Anatomi */}
        <section id="epifit" className="scroll-mt-24">
          <RhizomeVisualGuide />
        </section>

        {/* Module 10: Siklus Nitrogen & Cleaning Crew dengan Infografis */}
        <section id="siklus" className="scroll-mt-24">
          <NitrogenCycleVisual />
        </section>

        {/* Module 11: Kalkulator Tangki, Kekuatan Mesin 8x-12x & Durasi Lampu */}
        <section id="kalkulator" className="scroll-mt-24">
          <TankCalculator />
        </section>

        {/* Module 12: Diagnosis Cepat Masalah Alga */}
        <section id="alga" className="scroll-mt-24 space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 font-mono">
              TROUBLESHOOTING &amp; SOLUSI
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight mt-1">
              Diagnosis &amp; Penanganan Cepat 4 Jenis Alga Umum
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Alga adalah bagian alami dari ekosistem. Jangan gunakan obat racun alga keras yang dapat mematikan bakteri filter Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {ALGAE_GUIDES.map((alga, idx) => (
              <div
                key={idx}
                className="rounded-2xl sm:rounded-3xl bg-white border border-zinc-200/90 shadow-xs overflow-hidden flex flex-col justify-between hover:border-zinc-400 transition-colors group"
              >
                <div>
                  {/* Algae Photo Thumbnail */}
                  <div className="relative h-44 sm:h-48 w-full bg-zinc-950 overflow-hidden border-b border-zinc-100 flex items-center justify-center p-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={alga.image}
                      alt={alga.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2.5 right-2.5 text-[9px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-black/75 text-white backdrop-blur-md border border-white/20">
                      Identifikasi Visual
                    </span>
                  </div>

                  <div className="p-5 sm:p-6 space-y-3">
                    <div>
                      <h3 className="font-bold text-base sm:text-lg text-zinc-950">{alga.name}</h3>
                      <span className="italic text-xs text-zinc-500 font-serif block mt-0.5">{alga.latin}</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80">
                        <span className="font-semibold text-zinc-900 block mb-0.5">Pemicu Utama:</span>
                        <p className="text-zinc-600 leading-relaxed">{alga.cause}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80">
                        <span className="font-semibold text-zinc-900 block mb-0.5">Solusi Tepat:</span>
                        <p className="text-zinc-600 leading-relaxed">{alga.solution}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5 bg-zinc-50/70 border-t border-zinc-100 flex items-center justify-between text-xs">
                  <span className="text-zinc-500 text-[11px]">Pasukan Pembersih Alami:</span>
                  <span className="font-bold text-zinc-900 text-xs text-right">{alga.faunaHero}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Call to Action: Hubungkan ke Katalog & WhatsApp */}
        <section className="rounded-2xl sm:rounded-3xl bg-zinc-950 text-white p-8 sm:p-12 text-center space-y-5 shadow-xl relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-200 border border-zinc-700">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>KONSULTASI GRATIS DENGAN KAMI</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight max-w-xl mx-auto">
            Siap Memulai Proyek Tangki Aquascape Impian Anda?
          </h2>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Kunjungi langsung galeri toko Mozza Aquatic di Banyuwangi atau cek ketersediaan stok fisik tanaman segar, batu hardscape, kayu, dan peralatan akuarium kami secara real-time.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/katalog"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Buka Katalog &amp; Cek Stok Produk</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={waConsultUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs border border-zinc-700 transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
              <span>Chat Admin via WhatsApp</span>
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white py-8 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <p className="font-semibold text-zinc-950">Mozza Aquatic Banyuwangi</p>
          <p>Galeri Akuarium, Aquascape, Ikan Hias &amp; Tanaman Segar • Banyuwangi, Jawa Timur</p>
          <p className="text-[11px] text-zinc-400">
            Materi panduan diadaptasi dari Workshop &amp; Kuliah Tamu Biosains: &quot;Seni dan Teknik Aquascape dari Nol&quot;.
          </p>
        </div>
      </footer>
    </div>
  );
}
