"use client";

import React, { useState } from "react";
import { Filter, AlertTriangle, Droplets, Sparkles } from "lucide-react";
import { FILTER_MEDIA_STAGES, FilterMediaStage } from "./guide-data";

export default function FilterMediaOrderVisual() {
  const [activeStage, setActiveStage] = useState<number>(1);

  const currentStage: FilterMediaStage =
    FILTER_MEDIA_STAGES.find((s) => s.stage === activeStage) || FILTER_MEDIA_STAGES[0];

  return (
    <div className="rounded-2xl sm:rounded-3xl bg-white border border-zinc-200/90 p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-zinc-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200 mb-2">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>Sains Filtrasi Air Canister</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-950 tracking-tight">
            Struktur &amp; Urutan Wajib Isi Media Filter Canister
          </h3>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-2xl leading-relaxed">
            Urutan media filter tidak boleh terbalik. Air kotor dari akuarium wajib mengalir melalui urutan:{" "}
            <strong className="text-zinc-900">Mekanis ➔ Biologis ➔ Kimiawi (Akhir)</strong> agar bakteri pengurai tidak mati lemas akibat tersumbat kotoran padat.
          </p>
        </div>

        {/* Formula reminder box */}
        <div className="p-3.5 rounded-2xl bg-zinc-950 text-white text-xs shrink-0 self-start sm:self-auto space-y-1 shadow-xs">
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
            RUMUS DEBIT FILTER IDEAL:
          </span>
          <div className="font-mono font-bold text-xs text-white">
            (P × L × T / 1000) × 8 s/d 12 L/jam
          </div>
          <span className="text-[10px] text-zinc-400 block">*Kompensasi head loss media 30%–50%</span>
        </div>
      </div>

      {/* Sequential Flow Diagram Bar */}
      <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
        <div className="flex items-center justify-between text-[11px] font-mono font-bold text-zinc-500 mb-3 px-1">
          <span className="flex items-center gap-1.5 text-blue-600">
            <Droplets className="w-3.5 h-3.5" />
            INLET (Air Masuk)
          </span>
          <span className="flex items-center gap-1.5 text-emerald-600">
            OUTLET (Air Bersih Kembali)
            <Sparkles className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* 3 Step Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {FILTER_MEDIA_STAGES.map((s) => {
            const isSelected = activeStage === s.stage;
            return (
              <button
                key={s.stage}
                type="button"
                onClick={() => setActiveStage(s.stage)}
                className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? "bg-zinc-950 text-white border-zinc-950 shadow-md ring-4 ring-zinc-950/15 scale-102"
                    : "bg-white hover:bg-zinc-100 text-zinc-800 border-zinc-200"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                        isSelected
                          ? "bg-zinc-800 text-white border-zinc-700"
                          : s.badgeColor
                      }`}
                    >
                      TAHAP 0{s.stage}
                    </span>
                    <span className="text-[10px] font-mono opacity-70">{s.position.split(" ")[0]}</span>
                  </div>
                  <h4 className="font-extrabold text-sm mt-1">{s.type}</h4>
                </div>

                <div className="mt-3 pt-2.5 border-t border-zinc-200/50 flex items-center justify-between text-[11px]">
                  <span className="font-mono text-[10px] opacity-70 truncate max-w-[170px]">{s.mediaExamples[0]}</span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Canister Cross Section + Detailed Stage Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Canister Diagram Image from PPTX (5 Cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-zinc-950 border border-zinc-800 p-4 overflow-hidden flex flex-col items-center justify-center group shadow-md">
          <div className="w-full flex items-center justify-between text-xs text-zinc-400 mb-2 px-2">
            <span className="font-mono text-[10px] uppercase font-bold text-zinc-400">
              ILUSTRASI RUANG MEDIA FILTER
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">CANISTER SECTION</span>
          </div>

          <div className="relative h-80 sm:h-96 w-full flex items-center justify-center p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/panduan/filter-canister-structure.svg"
              alt="Diagram Struktur Media Filter Canister"
              className="max-h-full max-w-full object-contain group-hover:scale-102 transition-transform duration-500"
            />
          </div>

          <p className="text-[11px] text-zinc-400 text-center mt-2">
            Aliran air bergerak dari lapisan mekanis bawah, menembus media biologis, lalu keluar bersih dari pipa outlet atas.
          </p>
        </div>

        {/* Detailed Inspector Card (7 Cols) */}
        <div className="lg:col-span-7 p-6 sm:p-7 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 font-bold block">
                TAHAP 0{currentStage.stage} DALAM ALIRAN AIR
              </span>
              <h4 className="text-xl font-extrabold text-zinc-950 mt-0.5">{currentStage.name}</h4>
              <span className="text-xs text-zinc-500 font-mono">Posisi: {currentStage.position}</span>
            </div>
            <span className={`text-[10px] font-mono px-3 py-1 rounded-full border font-bold ${currentStage.badgeColor}`}>
              {currentStage.type}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-zinc-200 text-xs space-y-2">
            <span className="font-bold text-zinc-900 block">Fungsi &amp; Cara Kerja:</span>
            <p className="text-zinc-600 leading-relaxed">{currentStage.function}</p>
          </div>

          {/* Media Examples List */}
          <div className="space-y-1.5 text-xs text-zinc-800">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold block">
              CONTOH MEDIA YANG DIGUNAKAN:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {currentStage.mediaExamples.map((ex, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-white border border-zinc-200 text-zinc-800 font-semibold text-xs shadow-xs"
                >
                  ✓ {ex}
                </span>
              ))}
            </div>
          </div>

          {/* Critical Note Warning */}
          <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              <strong>Catatan Krusial:</strong> {currentStage.criticalNote}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
