"use client";

import React, { useState, useMemo } from "react";
import {
  Calculator,
  Lightbulb,
  Clock,
  Droplets,
  Sun,
  Moon,
  Gauge,
} from "lucide-react";

export default function TankCalculator() {
  const [length, setLength] = useState<number>(60);
  const [width, setWidth] = useState<number>(30);
  const [height, setHeight] = useState<number>(30);
  const [isTankMatured, setIsTankMatured] = useState<boolean>(false);

  // Calculation results
  const grossVolume = useMemo(() => {
    const vol = (length * width * height) / 1000;
    return Math.max(1, Math.round(vol * 10) / 10);
  }, [length, width, height]);

  // Net water volume (approx 85% after substrate & hardscape deduction)
  const netVolume = useMemo(() => {
    return Math.round(grossVolume * 0.85 * 10) / 10;
  }, [grossVolume]);

  // Watt calculations (based on gross volume formula in slide 9)
  const lowWatt = useMemo(() => Math.round(grossVolume * 0.3 * 10) / 10, [grossVolume]);
  const medWatt = useMemo(() => Math.round(grossVolume * 0.6 * 10) / 10, [grossVolume]);
  const highWatt = useMemo(() => Math.round(grossVolume * 0.9 * 10) / 10, [grossVolume]);

  // Filter pump flow rate recommendation: (P x L x T / 1000) x (8 to 12)
  const minPumpFlow = useMemo(() => Math.round(grossVolume * 8), [grossVolume]);
  const idealPumpFlow = useMemo(() => Math.round(grossVolume * 10), [grossVolume]);
  const maxPumpFlow = useMemo(() => Math.round(grossVolume * 12), [grossVolume]);

  const setPreset = (l: number, w: number, h: number) => {
    setLength(l);
    setWidth(w);
    setHeight(h);
  };

  return (
    <div className="rounded-2xl sm:rounded-3xl bg-white border border-zinc-200/90 p-6 sm:p-8 shadow-xs space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2.5 rounded-xl bg-zinc-950 text-white shadow-xs">
              <Calculator className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-zinc-950">
                Kalkulator Teknis Volume, Mesin Filter &amp; Lampu
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Rumus presisi volume air, kekuatan pompa canister (8x–12x), dan fotoperiode fotosintesis.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
          <span className="text-[10px] uppercase font-mono text-zinc-400 mr-1 font-semibold">Preset Tangki:</span>
          <button
            type="button"
            onClick={() => setPreset(30, 20, 20)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              length === 30 && width === 20 && height === 20
                ? "bg-zinc-950 text-white font-bold shadow-xs"
                : "bg-zinc-100 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200"
            }`}
          >
            30cm (12L)
          </button>
          <button
            type="button"
            onClick={() => setPreset(60, 30, 30)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              length === 60 && width === 30 && height === 30
                ? "bg-zinc-950 text-white font-bold shadow-xs"
                : "bg-zinc-100 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200"
            }`}
          >
            60cm (54L)
          </button>
          <button
            type="button"
            onClick={() => setPreset(90, 45, 45)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              length === 90 && width === 45 && height === 45
                ? "bg-zinc-950 text-white font-bold shadow-xs"
                : "bg-zinc-100 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200"
            }`}
          >
            90cm (182L)
          </button>
        </div>
      </div>

      {/* Inputs Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
            Panjang Tangki (cm)
          </label>
          <div className="relative">
            <input
              type="number"
              min={15}
              max={300}
              value={length || ""}
              onChange={(e) => setLength(Number(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-zinc-500 focus:ring-1 focus:ring-zinc-400 text-sm font-mono text-zinc-900 outline-hidden transition-all"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400">
              cm
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
            Lebar Tangki (cm)
          </label>
          <div className="relative">
            <input
              type="number"
              min={15}
              max={150}
              value={width || ""}
              onChange={(e) => setWidth(Number(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-zinc-500 focus:ring-1 focus:ring-zinc-400 text-sm font-mono text-zinc-900 outline-hidden transition-all"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400">
              cm
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
            Tinggi Tangki (cm)
          </label>
          <div className="relative">
            <input
              type="number"
              min={15}
              max={150}
              value={height || ""}
              onChange={(e) => setHeight(Number(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-zinc-500 focus:ring-1 focus:ring-zinc-400 text-sm font-mono text-zinc-900 outline-hidden transition-all"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400">
              cm
            </span>
          </div>
        </div>
      </div>

      {/* Maturity Toggle */}
      <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-zinc-700" />
          <span className="text-xs font-semibold text-zinc-800">
            Fase Ekosistem Akuarium Anda Saat Ini:
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsTankMatured(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              !isTankMatured
                ? "bg-zinc-950 text-white font-semibold shadow-xs"
                : "bg-white text-zinc-600 hover:text-zinc-950 border border-zinc-200"
            }`}
          >
            Tangki Baru (Minggu 1–4)
          </button>
          <button
            type="button"
            onClick={() => setIsTankMatured(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isTankMatured
                ? "bg-zinc-950 text-white font-semibold shadow-xs"
                : "bg-white text-zinc-600 hover:text-zinc-950 border border-zinc-200"
            }`}
          >
            Ekosistem Stabil (&gt; 1–2 Bulan)
          </button>
        </div>
      </div>

      {/* FEATURED: KEKUATAN MESIN POMPA / CANISTER FILTER FORMULA CARD */}
      <div className="rounded-2xl bg-zinc-950 text-white p-5 sm:p-7 border border-zinc-800 shadow-md relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-5 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Gauge className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                  STANDAR INTERNASIONAL AQUASCAPING
                </span>
                <h4 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                  Kekuatan Mesin / Flow Rate Canister Filter
                </h4>
              </div>
            </div>
            <p className="text-xs text-zinc-400 mt-2 max-w-xl leading-relaxed">
              Rumus turnover ideal untuk menyuplai nutrisi &amp; CO2 merata tanpa zona mati (dead spot):
            </p>
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 font-mono text-xs text-emerald-300 font-bold">
              <span>Debit Pompa = (P × L × T / 1000) × 8 s/d 12 L/jam</span>
            </div>
          </div>

          {/* Result Highlight */}
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-700/80 shrink-0 flex flex-col items-center sm:items-start">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              Rekomendasi Flow Rate:
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-3xl font-black font-mono text-emerald-400">
                {minPumpFlow} – {maxPumpFlow}
              </span>
              <span className="text-xs font-semibold text-zinc-300">Liter / Jam</span>
            </div>
            <span className="text-[11px] font-mono text-zinc-400 mt-1">
              Nilai Manis (Sweet Spot): <strong className="text-white font-bold">{idealPumpFlow} L/jam (10x)</strong>
            </span>
          </div>
        </div>

        {/* 3 Scientific Reasons Why 8x - 12x is Mandatory */}
        <div className="pt-5 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold block">
            MENGAPA HARUS 8x SAMPAI 12x VOLUME TANGKI?
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-zinc-300">
            <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800">
              <span className="font-bold text-white block mb-1">1. Head Loss Media (30%–50%)</span>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                Spesifikasi pabrik dihitung tanpa media filter. Saat canister diisi busa, kapas, dan batu pumice porus tebal, debit air riil turun drastis hingga tersisa separuhnya.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800">
              <span className="font-bold text-white block mb-1">2. Sirkulasi Memutar (Gyre Flow)</span>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                Tanaman air tidak bisa bergerak mencari makan. Arus deras yang halus mutlak dibutuhkan untuk mengantarkan gelembung gas CO2 mikro ke setiap helai daun hingga karpet dasar.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800">
              <span className="font-bold text-white block mb-1">3. Mencegah Lumut BBA</span>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                Arus lambat memicu timbunan kotoran organik yang mengundang ledakan alga janggut hitam (*Black Beard Algae*) di kayu dan daun tua.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Photoperiod Dial Bar (24-Hour Timeline) */}
      <div className="p-4 rounded-2xl bg-zinc-900 text-white space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-[10px] uppercase font-bold text-zinc-400">
            VISUALISASI SIKLUS SIRKADIAN 24 JAM
          </span>
          <span className="text-emerald-400 font-mono text-xs font-semibold">
            {!isTankMatured ? "FOTOPERIODE: 7 JAM CAHAYA" : "FOTOPERIODE: 9 JAM CAHAYA"}
          </span>
        </div>

        {/* 24h Bar representation */}
        <div className="space-y-1.5">
          <div className="h-6 w-full rounded-lg bg-zinc-800 flex overflow-hidden border border-zinc-700 select-none">
            {/* Dark morning period */}
            <div className="w-[37.5%] bg-zinc-950 flex items-center justify-center text-[9px] text-zinc-500 font-mono border-r border-zinc-800">
              <Moon className="w-3 h-3 mr-1 text-zinc-600" />
              00:00 - 09:00
            </div>
            {/* Light active period */}
            <div
              className={`flex items-center justify-center text-[10px] font-mono font-bold text-zinc-950 transition-all ${
                !isTankMatured ? "w-[29.1%] bg-emerald-400" : "w-[37.5%] bg-emerald-300"
              }`}
            >
              <Sun className="w-3.5 h-3.5 mr-1 text-zinc-950" />
              {!isTankMatured ? "09:00 - 16:00 (7 Jam)" : "09:00 - 18:00 (9 Jam)"}
            </div>
            {/* Dark evening period */}
            <div className="flex-1 bg-zinc-950 flex items-center justify-center text-[9px] text-zinc-500 font-mono border-l border-zinc-800">
              <Moon className="w-3 h-3 mr-1 text-zinc-600" />
              Malam
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 px-1">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>24:00</span>
          </div>
        </div>
      </div>

      {/* Calculated Results Cards (Volume & Lampu) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {/* Card 1: Volume */}
        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/90 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Volume Air</span>
            <Droplets className="w-4 h-4 text-zinc-500" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-zinc-950 font-mono tracking-tight">
                {grossVolume}
              </span>
              <span className="text-sm font-medium text-zinc-600">Liter (Kotor)</span>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Estimasi air bersih: <span className="font-semibold text-zinc-800 font-mono">~{netVolume} Liter</span> (setelah dikurangi hardscape &amp; soil).
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-zinc-200 text-[11px] text-zinc-600">
            Kapasitas Bersih: ~85% Volume Kotor
          </div>
        </div>

        {/* Card 2: Daya Watt Lampu */}
        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/90 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Rekomendasi Daya LED WRGB</span>
            <Lightbulb className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between py-0.5 border-b border-zinc-200/60">
              <span className="text-zinc-600">Low (0.3 W/L):</span>
              <span className="font-bold text-zinc-900 font-mono">{lowWatt} Watt</span>
            </div>
            <div className="flex items-center justify-between py-0.5 border-b border-zinc-200/60">
              <span className="text-zinc-600">Medium (0.6 W/L):</span>
              <span className="font-bold text-zinc-900 font-mono">{medWatt} Watt</span>
            </div>
            <div className="flex items-center justify-between py-0.5">
              <span className="text-zinc-600">High Light (0.9 W/L):</span>
              <span className="font-bold text-zinc-900 font-mono">{highWatt} Watt</span>
            </div>
          </div>
          <div className="mt-2 text-[10px] text-zinc-500">
            *Medium cocok untuk mayoritas tanaman aquascape umum.
          </div>
        </div>

        {/* Card 3: Durasi Pencahayaan */}
        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/90 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Durasi Lampu Harian</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-zinc-950 font-mono tracking-tight">
                {!isTankMatured ? "6–8" : "8–10"}
              </span>
              <span className="text-sm font-semibold text-zinc-800">Jam / Hari</span>
            </div>
            <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
              {!isTankMatured ? (
                <>
                  <strong className="text-zinc-900">Tangki Baru:</strong> Batasi 6–8 jam agar spora alga tidak meledak akibat adaptasi akar tanaman baru dan amonia tanah.
                </>
              ) : (
                <>
                  <strong className="text-zinc-900">Tangki Stabil:</strong> Tingkatkan ke 8–10 jam untuk laju fotosintesis optimal diimbangi suplai pupuk dan CO2 stabil.
                </>
              )}
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-zinc-200 text-[11px] text-zinc-600 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Gunakan timer listrik otomatis agar jam lampu presisi.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
