"use client";

import React from "react";
import { AlertTriangle, CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function RhizomeVisualGuide() {
  const epiphyteSpecies = [
    {
      name: "Anubias Nana",
      image: "/panduan/anubias-nana-real.jpg",
      tag: "Sangat Kokoh",
      desc: "Daun tebal berlapis lilin, tangguh pada cahaya rendah dan tahan gigitan fauna.",
    },
    {
      name: "Bucephalandra",
      image: "/panduan/buce-highres.jpg",
      tag: "Kilau Metalik",
      desc: "Flora endemik pulau Kalimantan dengan bintik mutiara eksotis bernuansa kebiruan/keunguan.",
    },
    {
      name: "Java Fern (Microsorum)",
      image: "/panduan/javafern-highres.jpg",
      tag: "Semak Lebat",
      desc: "Pakis air berdaun menjari panjang, sangat efektif menutupi sambungan kayu dan pipa filter.",
    },
    {
      name: "Aquatic Moss",
      image: "/panduan/aquatic-moss-real.jpg",
      tag: "Kanopi Ranting",
      desc: "Lumut air tanpa akar tanah yang diikat tipis pada ranting untuk membentuk kanopi pohon bonsai.",
    },
  ];

  return (
    <div className="rounded-2xl sm:rounded-3xl bg-white border border-zinc-200/90 p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-zinc-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 mb-2">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Aturan Fatal Penanaman Flora Epifit</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-950 tracking-tight">
            Membedakan Anatomi Rhizome vs. Akar Epifit
          </h3>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-2xl leading-relaxed">
            Kesalahan #1 pemula aquascape adalah menancapkan batang Anubias atau Bucephalandra langsung ke dalam aqua soil layaknya menanam padi. Hal ini memicu pembusukan rhizome (*rhizome rot*) dan kematian total.
          </p>
        </div>

        <Link
          href="/katalog"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold border border-zinc-200/80 transition-colors shrink-0"
        >
          <span>Cek Stok Epifit di Katalog</span>
          <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
        </Link>
      </div>

      {/* Anatomical Diagram Banner from PPTX */}
      <div className="mt-6 rounded-2xl bg-zinc-50 border border-zinc-200 overflow-hidden grid grid-cols-1 md:grid-cols-12 items-center">
        <div className="md:col-span-6 relative h-64 sm:h-72 w-full bg-zinc-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/panduan/image41.png"
            alt="Anatomi Rhizome vs Akar Serabut"
            className="w-full h-full object-contain p-2"
          />
        </div>

        <div className="md:col-span-6 p-6 space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-rose-600 font-bold">
              PERHATIKAN ANATOMI TANAMAN
            </span>
            <h4 className="text-lg font-bold text-zinc-950">
              1. Batang Rhizome (Horizontal Tebal)
            </h4>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Merupakan pusat metabolisme tempat tunas daun dan akar baru keluar. <strong className="text-zinc-900">Wajib dialiri sirkulasi air terbuka yang kaya oksigen</strong>. Menimbun rhizome di bawah tanah memicu pembusukan anaerob dalam 14 hari.
            </p>
          </div>

          <div className="pt-3 border-t border-zinc-200 space-y-1">
            <h4 className="text-sm font-bold text-zinc-900">
              2. Akar Serabut (Roots)
            </h4>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Berfungsi mencengkeram celah batu/kayu. Bagian akar serabut boleh menyentuh atau masuk substrat untuk menyerap nutrisi.
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Do NOT Bury (Salah Fatal) */}
        <div className="rounded-2xl bg-rose-50/50 border border-rose-200 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm mb-3">
              <XCircle className="w-5 h-5 shrink-0" />
              <span>JANGAN KUBUR RHIZOME DI DALAM SOIL</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-rose-200/80 text-xs space-y-2 mb-4">
              <div className="font-semibold text-zinc-900 flex items-center justify-between">
                <span>Rhizome (Batang Hijau Horizontal Tebal)</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                  Wajib Terbuka
                </span>
              </div>
              <p className="text-zinc-600 leading-relaxed">
                Rhizome adalah organ metabolisme pusat. Jika tertimbun tanah, rhizome mengalami hipoksia (kekurangan oksigen) dan diserang bakteri anaerob.
              </p>
            </div>

            <div className="space-y-1.5 text-xs text-rose-900/90 font-medium">
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span>Hari 3–7: Batang rhizome melunak dan berlendir kecokelatan.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span>Hari 8–14: Daun lepas satu per satu dari batang (*melting*) dan tanaman mati total.</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-rose-200/80 text-[11px] text-rose-700 font-semibold">
            Status: ❌ 90% Kasus kematian Anubias pemula diakibatkan kesalahan ini.
          </div>
        </div>

        {/* Correct Method (Benar) */}
        <div className="rounded-2xl bg-zinc-50 border border-zinc-200 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-zinc-950 font-bold text-sm mb-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>CARA PENANAMAN YANG BENAR &amp; SEHAT</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-zinc-200 text-xs space-y-2 mb-4">
              <div className="font-semibold text-zinc-900 flex items-center justify-between">
                <span>Tempel di Hardscape (Batu / Kayu)</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Rekomendasi
                </span>
              </div>
              <p className="text-zinc-600 leading-relaxed">
                Biarkan rhizome terpapar sirkulasi air terbuka yang kaya oksigen terlarut. Akar serabut halusnya akan merambat sendiri dan mencengkeram pori batu atau lekukan kayu dalam 2–4 minggu.
              </p>
            </div>

            <div className="space-y-2 text-xs text-zinc-700">
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>
                  <strong>Metode 1 (Lem Gel Cyanoacrylate):</strong> Teteskan 1 titik lem gel khusus aquascape pada celah batu/kayu, tempelkan rhizome selama 10 detik.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>
                  <strong>Metode 2 (Ikat Benang):</strong> Lilitkan benang katun tipis di antara cabang kayu hingga akar mencengkeram kuat.
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-200 text-[11px] text-zinc-600">
            Tanaman Target: <span className="font-semibold text-zinc-900">Anubias, Bucephalandra, Java Fern, Bolbitis.</span>
          </div>
        </div>
      </div>

      {/* 4 Epiphyte Species Showcase */}
      <div className="mt-8 pt-6 border-t border-zinc-100">
        <h4 className="text-sm font-bold text-zinc-950 mb-3">
          4 Spesies Epifit &amp; Moss Paling Populer:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {epiphyteSpecies.map((item, idx) => (
            <div key={idx} className="rounded-xl bg-zinc-50 border border-zinc-200 overflow-hidden flex flex-col justify-between">
              <div className="relative h-36 w-full bg-zinc-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 right-2 text-[9px] font-mono px-2 py-0.5 rounded bg-black/70 text-white backdrop-blur-md">
                  {item.tag}
                </span>
              </div>
              <div className="p-3">
                <h5 className="font-bold text-xs text-zinc-950">{item.name}</h5>
                <p className="text-[11px] text-zinc-600 mt-1 leading-snug">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
