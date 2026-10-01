"use client";

import React from "react";
import { RefreshCw, Droplets, Clock, Sparkles } from "lucide-react";

export default function NitrogenCycleVisual() {
  return (
    <div className="rounded-2xl sm:rounded-3xl bg-white border border-zinc-200/90 p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-zinc-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-800 border border-zinc-200 mb-2">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Manajemen Ekologis &amp; Biologis</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-950 tracking-tight">
            Siklus Nitrogen, Pematangan Bakteri &amp; Tim Pembersih
          </h3>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-2xl leading-relaxed">
            Akuarium yang sehat bukan air yang steril seperti air minum isi ulang, melainkan air yang kaya akan jutaan mikroorganisme pengurai alami. Wajib melalui fase *cycling* selama 2–4 pekan sebelum memasukkan ikan.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs shrink-0 self-start sm:self-auto flex items-center gap-2">
          <Clock className="w-4 h-4 text-zinc-500" />
          <div>
            <span className="text-[10px] uppercase font-mono text-zinc-400 block">Waktu Cycling Wajib:</span>
            <span className="font-bold text-zinc-950 font-mono">14 – 28 Hari</span>
          </div>
        </div>
      </div>

      {/* Real Nitrogen Cycle Infographic from PPTX */}
      <div className="mt-6 rounded-2xl bg-zinc-900 border border-zinc-200 overflow-hidden flex flex-col md:flex-row items-center p-4 gap-6">
        <div className="relative h-64 sm:h-72 w-full md:w-1/2 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/panduan/image43.png"
            alt="Diagram Siklus Nitrogen & Tim Pembersih"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="w-full md:w-1/2 text-white space-y-3 p-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
            INFOGRAFIS BIOSAINS
          </span>
          <h4 className="text-lg font-bold">
            Mengapa Cycling Wajib Ditunggu dengan Sabar?
          </h4>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Bakteri nitrifikasi (<em>Nitrosomonas</em> &amp; <em>Nitrobacter</em>) berkembang biak sangat lambat (membelah diri setiap 15–20 jam). Memasukkan ikan di awal tanpa bakteri matang sama dengan menempatkan ikan dalam gas amonia beracun mematikan.
          </p>
          <div className="p-3 rounded-xl bg-zinc-800/80 border border-zinc-700 text-xs text-zinc-200 space-y-1">
            <span className="font-bold text-emerald-400 block">Pekan ke-2:</span>
            <p>Masukkan Udang Red Cherry, Keong Tanduk, dan Otocinclus untuk mengendalikan lumut diatom cokelat secara biologis.</p>
          </div>
        </div>
      </div>

      {/* 3 Phases Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
        {/* Phase 1: Amonia */}
        <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/90 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
              <span className="font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-[10px]">
                TAHAP 1 (Hari 1–7)
              </span>
              <span className="text-rose-600 font-bold text-xs">Sangat Toksik</span>
            </div>
            <h4 className="font-extrabold text-base text-zinc-950 mt-1">Amonia (NH3 / NH4+)</h4>
            <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
              Berasal dari pelepasan nutrisi awal aqua soil aktif vulkanik dan sisa daun tanaman yang beradaptasi.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-200/80 text-[11px] text-zinc-700 font-semibold">
            Status: ❌ Dilarang keras memasukkan ikan hias apapun.
          </div>
        </div>

        {/* Phase 2: Nitrit */}
        <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/90 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
              <span className="font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[10px]">
                TAHAP 2 (Hari 7–14)
              </span>
              <span className="text-amber-700 font-bold text-xs">Toksik</span>
            </div>
            <h4 className="font-extrabold text-base text-zinc-950 mt-1">Nitrit (NO2-)</h4>
            <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
              Bakteri <em>Nitrosomonas</em> memecah amonia menjadi nitrit. Bersamaan dengan ini, lumut cokelat (diatom) mulai muncul di kaca dan batu.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-200/80 text-[11px] text-emerald-800 font-semibold">
            Aksi: ✅ Masukkan Pasukan Pembersih (Udang &amp; Keong Tanduk).
          </div>
        </div>

        {/* Phase 3: Nitrat */}
        <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/90 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
              <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                TAHAP 3 (Hari 14–28)
              </span>
              <span className="text-emerald-700 font-bold text-xs">Aman</span>
            </div>
            <h4 className="font-extrabold text-base text-zinc-950 mt-1">Nitrat (NO3-)</h4>
            <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
              Bakteri <em>Nitrobacter</em> mengubah nitrit menjadi nitrat yang relatif aman dan diserap sebagai pupuk alami oleh daun tanaman air.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-200/80 text-[11px] text-zinc-900 font-semibold">
            Status: 🎉 Parameter stabil! Ikan schooling siap masuk bertahap.
          </div>
        </div>
      </div>

      {/* Critical Water Change Protocol & Plant Melting Notice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* Protocol Water Change */}
        <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs">
          <div className="flex items-center gap-2 font-bold text-zinc-900 text-sm mb-2">
            <Droplets className="w-4 h-4 text-zinc-700" />
            <span>Protokol Ganti Air (Water Change) Fase Awal</span>
          </div>
          <div className="space-y-2 text-zinc-600">
            <p>
              <strong className="text-zinc-900">Minggu 1:</strong> Ganti air <strong>50% setiap 2 hari sekali</strong> untuk membuang luapan amonia awal dari soil baru.
            </p>
            <p>
              <strong className="text-zinc-900">Minggu 2:</strong> Ganti air <strong>30–50% setiap 3 hari sekali</strong>.
            </p>
            <p>
              <strong className="text-zinc-900">Minggu 3 dst:</strong> Cukup ganti air rutin <strong>20–30% seminggu sekali</strong>.
            </p>
          </div>
        </div>

        {/* Plant Melting Note */}
        <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs">
          <div className="flex items-center gap-2 font-bold text-zinc-900 text-sm mb-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Memahami Fenomena Daun Lumer (&quot;Plant Melting&quot;)</span>
          </div>
          <p className="text-zinc-600 leading-relaxed">
            Jangan panik jika di minggu 1–2 sebagian daun tanaman Anda menguning atau meleleh! Mayoritas tanaman di pasaran dibudidayakan di darat (<em>emersed</em>). Saat dimasukkan ke air, tanaman akan merontokkan daun darat lamanya dan menumbuhkan daun air baru (<em>submerged</em>) yang lebih segar dan berkilau.
          </p>
        </div>
      </div>
    </div>
  );
}
