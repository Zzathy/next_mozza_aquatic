"use client";

import React, { useState } from "react";
import { Sun, Cpu, Layers, AlertTriangle, CheckCircle2, Sparkles } from "lucide-react";

export default function PhotosynthesisLiebigVisual() {
  const [scenario, setScenario] = useState<"balanced" | "excess_light" | "low_co2">("balanced");

  return (
    <div className="rounded-2xl sm:rounded-3xl bg-white border border-zinc-200/90 p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-zinc-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-800 border border-zinc-200 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Dinamika Fotosintesis &amp; Biosains</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-950 tracking-tight">
            Segitiga Emas Keseimbangan &amp; Simulasi Tong Liebig
          </h3>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-2xl leading-relaxed">
            Tanaman air bertumbuh secepat faktor nutrisi yang paling rendah (*Law of the Minimum*). Pelajari interaksi antara Cahaya, CO2, dan Pupuk melalui simulasi interaktif di bawah.
          </p>
        </div>

        {/* Scenario Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto bg-zinc-100/80 p-1.5 rounded-xl border border-zinc-200">
          <button
            type="button"
            onClick={() => setScenario("balanced")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              scenario === "balanced"
                ? "bg-zinc-950 text-white shadow-xs"
                : "text-zinc-600 hover:text-zinc-950"
            }`}
          >
            Seimbang (Ideal)
          </button>
          <button
            type="button"
            onClick={() => setScenario("excess_light")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              scenario === "excess_light"
                ? "bg-rose-600 text-white shadow-xs"
                : "text-zinc-600 hover:text-zinc-950"
            }`}
          >
            Cahaya Berlebih
          </button>
          <button
            type="button"
            onClick={() => setScenario("low_co2")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              scenario === "low_co2"
                ? "bg-amber-600 text-white shadow-xs"
                : "text-zinc-600 hover:text-zinc-950"
            }`}
          >
            CO2 Rendah
          </button>
        </div>
      </div>

      {/* Visual Infographic Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Interactive Triangle Diagram (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-zinc-950 text-white flex flex-col items-center justify-center relative overflow-hidden select-none">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-6 text-center">
            TRIANGLE OF PHOTOSYNTHESIS
          </div>

          {/* SVG Triangle with Glowing Nodes */}
          <div className="relative w-56 h-52 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 200 180" fill="none">
              {/* Connecting Lines */}
              <polygon
                points="100,25 25,155 175,155"
                stroke={scenario === "balanced" ? "#10b981" : scenario === "excess_light" ? "#f43f5e" : "#f59e0b"}
                strokeWidth="2.5"
                strokeDasharray={scenario === "balanced" ? "none" : "4 4"}
                className="transition-colors duration-500"
              />

              {/* Center Water / Plant Icon */}
              <circle cx="100" cy="115" r="24" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
              <text x="100" y="119" textAnchor="middle" fill="#e4e4e7" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
                {scenario === "balanced" ? "SEHAT" : scenario === "excess_light" ? "ALGA!" : "KERDIL"}
              </text>
            </svg>

            {/* Top Node: Light */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center border shadow-md transition-all ${
                scenario === "excess_light"
                  ? "bg-rose-500 text-white border-rose-300 ring-4 ring-rose-500/20 scale-110"
                  : "bg-amber-400 text-zinc-950 border-amber-300"
              }`}>
                <Sun className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono mt-1 font-bold">CAHAYA</span>
            </div>

            {/* Bottom-Left Node: CO2 */}
            <div className="absolute bottom-0 left-0 flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center border shadow-md transition-all ${
                scenario === "low_co2"
                  ? "bg-amber-500 text-white border-amber-300 ring-4 ring-amber-500/20 scale-110"
                  : "bg-sky-500 text-white border-sky-300"
              }`}>
                <Cpu className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono mt-1 font-bold">CO2</span>
            </div>

            {/* Bottom-Right Node: Nutrisi */}
            <div className="absolute bottom-0 right-0 flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center border border-emerald-300 shadow-md">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono mt-1 font-bold">PUPUK</span>
            </div>
          </div>

          <div className="mt-6 text-center text-[11px] text-zinc-400">
            {scenario === "balanced" && "Semua pilar seimbang = Tanaman bubbling oksigen murni."}
            {scenario === "excess_light" && "Lampu terlalu lama/kuat tanpa CO2 = Alga mengambil alih!"}
            {scenario === "low_co2" && "CO2 minim = Pertumbuhan berhenti, daun meluruh."}
          </div>
        </div>

        {/* Dynamic Scenario Breakdown (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className={`p-5 rounded-2xl border transition-all ${
            scenario === "balanced"
              ? "bg-emerald-50/50 border-emerald-200"
              : scenario === "excess_light"
              ? "bg-rose-50/50 border-rose-200"
              : "bg-amber-50/50 border-amber-200"
          }`}>
            <div className="flex items-center gap-2 mb-2 font-bold text-sm">
              {scenario === "balanced" ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="text-emerald-950">Kondisi Ideal: Biosfer Stabil &amp; Bening</span>
                </>
              ) : scenario === "excess_light" ? (
                <>
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  <span className="text-rose-950">Anomali: Cahaya Meluap (Algae Bloom)</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span className="text-amber-950">Anomali: Karbon Defisit (Tanaman Terhenti)</span>
                </>
              )}
            </div>

            <p className="text-xs text-zinc-700 leading-relaxed">
              {scenario === "balanced" &&
                "Ketika fotoperiode (6–8 jam tangki baru, 8–10 jam tangki matang) diimbangi dengan injeksi CO2 terlarut (~20–30 ppm) dan dosis pupuk cair mikro-makro teratur, tanaman menyerap semua nutrisi. Alga tidak mendapatkan ruang berkembang."}
              {scenario === "excess_light" &&
                "Menyalakan lampu intensitas tinggi lebih dari 10 jam sehari pada tangki baru. Tanaman tidak mampu memproses energi foton berlebih karena kapasitas metabolisme terbatas. Energi cahaya yang lolos langsung diserap oleh spora alga rambut dan bintik hijau."}
              {scenario === "low_co2" &&
                "Lampu dan pupuk cukup, tetapi tidak ada suplai karbon. Daun tanaman menghitam di pinggiran, laju fotosintesis macet, dan memicu kemunculan lumut janggut hitam (Black Beard Algae / BBA) di kayu dan batu."}
            </p>

            <div className="mt-4 pt-3 border-t border-zinc-200/70 text-xs">
              <strong className="text-zinc-900">Solusi Aksi:</strong>{" "}
              {scenario === "balanced" && "Pertahankan jadwal ganti air 20–30% mingguan dan bersihkan kaca berkala."}
              {scenario === "excess_light" && "Segera pasang timer listrik otomatis dan batasi durasi lampu maksimal 6–7 jam/hari!"}
              {scenario === "low_co2" && "Pasang tabung CO2 tertekanan atau semprot Liquid Carbon pada titik lumut."}
            </div>
          </div>

          {/* Liebig's Barrel Explainer */}
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs space-y-1.5">
            <span className="font-mono text-[10px] uppercase font-bold text-zinc-500 block">
              PRINSIP HUKUM TONG KAYU LIEBIG (1840)
            </span>
            <p className="text-zinc-600 leading-relaxed">
              Bayangkan sebuah tong kayu penampung air yang tersusun dari bilah papan-papan: bilah Cahaya, bilah CO2, dan bilah Pupuk. Air (pertumbuhan tanaman) hanya bisa terisi setinggi bilah yang <strong>paling pendek</strong>. Air akan tumpah (menjadi alga) jika ada satu bilah yang terlalu jangkung tanpa diimbangi bilah lainnya!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
