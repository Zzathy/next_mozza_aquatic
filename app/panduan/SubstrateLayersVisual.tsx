"use client";

import React, { useState } from "react";
import { Layers, AlertCircle, CheckCircle2, Sparkles } from "lucide-react";
import { SUBSTRATE_LAYERS } from "./guide-data";

export default function SubstrateLayersVisual() {
  const [activeLayer, setActiveLayer] = useState<number>(4);

  return (
    <div className="rounded-2xl sm:rounded-3xl bg-white border border-zinc-200/90 p-6 sm:p-8 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-zinc-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Struktur Fondasi Biologis Bawah Tanah</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-950 tracking-tight">
            5 Lapisan Substrat &amp; Aturan Sudut Kemiringan Lereng
          </h3>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-2xl leading-relaxed">
            Keberhasilan jangka panjang aquascape bergantung pada kualitas media tanam. Klik tiap lapisan pada diagram penampang atau daftar di samping untuk melihat peran biologisnya.
          </p>
        </div>

        {/* Slope rule indicator */}
        <div className="p-4 rounded-2xl bg-zinc-950 text-white text-xs shrink-0 self-start sm:self-auto space-y-1.5 shadow-md">
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
            ATURAN KEMIRINGAN LERENG:
          </span>
          <div className="flex items-center gap-3 font-bold text-white font-mono text-sm">
            <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700">Depan: 3–4 cm</span>
            <span className="text-emerald-400">➜</span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/50 text-emerald-300">Belakang: 7–10 cm</span>
          </div>
        </div>
      </div>

      {/* Visual Cross-Section Diagram + Interactive Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
        {/* Tank Cross-Section Graphic (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-2xl bg-zinc-950 text-white border border-zinc-800 shadow-md">
          <div>
            <div className="flex items-center justify-between text-xs mb-3 pb-2 border-b border-zinc-800">
              <span className="font-mono text-[11px] uppercase font-bold text-zinc-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>DIAGRAM PENAMPANG MELINTANG</span>
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 text-emerald-400 border border-emerald-500/30">
                KLIK LAPISAN
              </span>
            </div>

            {/* Simulated Acrylic Tank Cross Section - Tall & Spacious Nature Tank */}
            <div className="relative h-[650px] rounded-2xl border-2 border-zinc-700 bg-gradient-to-b from-sky-950/40 via-sky-950/15 to-[#0b0f0d] overflow-hidden flex flex-col justify-between p-4 select-none shadow-inner">
              {/* Massive Water Column Area (Top Half: 280px of Crystal Water) */}
              <div className="relative h-72 w-full flex flex-col justify-between pb-4">
                {/* Water surface ripple & meniscus */}
                <div className="border-b-2 border-dashed border-sky-400/70 pb-2 flex items-center justify-between text-xs font-mono text-sky-300 font-bold">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                    <span>Permukaan Air Tangki (Water Level ~90%)</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-sky-950/80 border border-sky-500/40 text-[10px]">
                    Kolom Air Bening ~35–40 cm
                  </span>
                </div>

                {/* God rays streaming down through open water */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400/15 via-transparent to-transparent pointer-events-none" />

                {/* Swimming Schooling Fish (Neon Tetra & Rasbora) Silhouettes */}
                <svg className="absolute top-16 left-12 w-32 h-16 text-teal-300 opacity-80" viewBox="0 0 120 60" fill="none">
                  {/* Fish 1 */}
                  <path d="M12 24 C24 18 42 18 54 24 C42 30 24 30 12 24 Z" fill="currentColor" />
                  <path d="M12 24 L0 15 L0 33 Z" fill="currentColor" />
                  <circle cx="45" cy="22" r="2" fill="#042f2e" />
                  {/* Fish 2 */}
                  <path d="M60 38 C72 32 90 32 102 38 C90 44 72 44 60 38 Z" fill="currentColor" opacity="0.9" />
                  <path d="M60 38 L48 30 L48 46 Z" fill="currentColor" opacity="0.9" />
                  <circle cx="93" cy="36" r="1.5" fill="#042f2e" />
                  {/* Fish 3 */}
                  <path d="M30 46 C40 41 54 41 64 46 C54 51 40 51 30 46 Z" fill="currentColor" opacity="0.75" />
                  <path d="M30 46 L20 40 L20 52 Z" fill="currentColor" opacity="0.75" />
                </svg>

                {/* Water Column Height Indicator Bracket */}
                <div className="absolute right-3 top-10 flex items-center gap-1.5 text-[10px] font-mono text-sky-400/80">
                  <div className="h-28 w-1 border-r-2 border-dashed border-sky-400/50" />
                  <span className="rotate-90 origin-left translate-y-6 whitespace-nowrap uppercase tracking-wider">
                    Ruang Bebas Berenang
                  </span>
                </div>

                {/* Lush Plant stems emerging from substrate upward into water */}
                <div className="absolute bottom-0 left-6 text-emerald-500/80 pointer-events-none">
                  <svg className="w-16 h-36" viewBox="0 0 50 100" fill="none">
                    <path d="M25 100 C25 60 15 30 25 5 M25 70 C40 60 48 45 44 25 C30 30 25 48 25 70 Z" stroke="#34d399" strokeWidth="2.5" fill="#059669" fillOpacity="0.6" />
                    <path d="M25 50 C10 42 2 28 6 12 C18 16 25 32 25 50 Z" stroke="#34d399" strokeWidth="2" fill="#059669" fillOpacity="0.5" />
                  </svg>
                </div>

                <div className="absolute bottom-0 right-14 text-emerald-500/80 pointer-events-none">
                  <svg className="w-20 h-40" viewBox="0 0 50 100" fill="none">
                    <path d="M25 100 C25 55 35 25 25 5 M25 50 C12 42 4 28 8 10 C22 15 25 32 25 50 Z" stroke="#34d399" strokeWidth="2.5" fill="#059669" fillOpacity="0.6" />
                    <path d="M25 75 C38 65 46 50 42 30 C30 35 25 52 25 75 Z" stroke="#34d399" strokeWidth="2" fill="#059669" fillOpacity="0.5" />
                  </svg>
                </div>
              </div>

              {/* Layer Stacks with Intense Highlight States - Sitting at the Bottom Third */}
              <div className="relative z-10 space-y-1.5 pt-6 border-t border-sky-400/20">
                {/* Layer 5: Pasir Kosmetik / Aksen Foreground (Optional) */}
                <button
                  type="button"
                  onClick={() => setActiveLayer(5)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg transition-all text-xs font-mono font-bold border flex items-center justify-between ${
                    activeLayer === 5
                      ? "bg-amber-400 text-zinc-950 border-amber-300 ring-4 ring-amber-400/40 shadow-lg scale-102 z-20"
                      : "bg-[#e2d5b8] text-zinc-800 border-[#c5b592] opacity-60 hover:opacity-100"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-600" />
                    <span>05. Pasir Kosmetik / Detail Sungai</span>
                  </span>
                  {activeLayer === 5 && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-950 text-white font-bold animate-pulse">
                      TERPILIH
                    </span>
                  )}
                </button>

                {/* Layer 4: Soil Layer with slope */}
                <button
                  type="button"
                  onClick={() => setActiveLayer(4)}
                  className={`w-full text-left p-3 rounded-lg transition-all border relative ${
                    activeLayer === 4
                      ? "bg-zinc-900 text-white border-emerald-400 ring-4 ring-emerald-500/50 shadow-2xl scale-102 z-20"
                      : "bg-zinc-800/90 text-zinc-300 border-zinc-700 opacity-60 hover:opacity-100"
                  }`}
                  style={{
                    clipPath: "polygon(0 35%, 100% 0, 100% 100%, 0 100%)",
                    height: "82px",
                    display: "flex",
                    alignItems: "flex-end",
                  }}
                >
                  <div className="w-full flex items-center justify-between pl-2 pb-1">
                    <span className="text-xs font-mono font-bold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>04. Aqua Soil Aktif (Lereng 3cm ➜ 8cm)</span>
                    </span>
                    {activeLayer === 4 && (
                      <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500 text-zinc-950 font-bold animate-pulse">
                        TERPILIH
                      </span>
                    )}
                  </div>
                </button>

                {/* Layer 3: Base Fertilizer */}
                <button
                  type="button"
                  onClick={() => setActiveLayer(3)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all text-xs font-mono font-bold border flex items-center justify-between ${
                    activeLayer === 3
                      ? "bg-amber-500 text-zinc-950 border-amber-300 ring-4 ring-amber-400/50 shadow-lg scale-102 z-20 font-black"
                      : "bg-amber-600/80 text-amber-100 border-amber-700 opacity-60 hover:opacity-100"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-950" />
                    <span>03. Pupuk Dasar Slow-Release</span>
                  </span>
                  {activeLayer === 3 && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-950 text-white font-bold animate-pulse">
                      TERPILIH
                    </span>
                  )}
                </button>

                {/* Layer 2: Pumice Mesh */}
                <button
                  type="button"
                  onClick={() => setActiveLayer(2)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all text-xs font-mono font-bold border flex items-center justify-between ${
                    activeLayer === 2
                      ? "bg-zinc-200 text-zinc-950 border-white ring-4 ring-white/50 shadow-lg scale-102 z-20 font-black"
                      : "bg-zinc-600 text-zinc-200 border-zinc-500 opacity-60 hover:opacity-100"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-zinc-400" />
                    <span>02. Pumice / Rumah Bakteri Berpori</span>
                  </span>
                  {activeLayer === 2 && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-950 text-white font-bold animate-pulse">
                      TERPILIH
                    </span>
                  )}
                </button>

                {/* Layer 1: Bacteria Starter */}
                <button
                  type="button"
                  onClick={() => setActiveLayer(1)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg transition-all text-xs font-mono font-bold border flex items-center justify-between ${
                    activeLayer === 1
                      ? "bg-emerald-400 text-zinc-950 border-emerald-200 ring-4 ring-emerald-400/50 shadow-lg scale-102 z-20 font-black"
                      : "bg-emerald-700/80 text-emerald-100 border-emerald-600 opacity-60 hover:opacity-100"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-950" />
                    <span>01. Bakteri Starter (Dasar Kaca)</span>
                  </span>
                  {activeLayer === 1 && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-950 text-white font-bold animate-pulse">
                      TERPILIH
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-zinc-400 text-center mt-3 flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Klik lapisan di atas untuk mengaktifkan sorotan penjelasan.</span>
          </p>
        </div>

        {/* Detailed Inspector List (7 Cols) */}
        <div className="lg:col-span-7 space-y-3 flex flex-col justify-center">
          {SUBSTRATE_LAYERS.map((layer) => {
            const isSelected = activeLayer === layer.level;
            return (
              <div
                key={layer.level}
                onClick={() => setActiveLayer(layer.level)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-emerald-50/80 border-2 border-emerald-500 shadow-md ring-4 ring-emerald-500/15 scale-101"
                    : "bg-zinc-50 hover:bg-zinc-100/80 border-zinc-200/90 opacity-80 hover:opacity-100"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-8 h-8 rounded-xl font-mono font-black text-sm flex items-center justify-center shrink-0 transition-all ${
                        isSelected
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-110"
                          : "bg-zinc-200 text-zinc-700"
                      }`}
                    >
                      0{layer.level}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={`font-bold text-sm sm:text-base ${isSelected ? "text-emerald-950" : "text-zinc-950"}`}>
                          {layer.name}
                        </h4>
                        {isSelected && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-600 text-white font-mono text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>AKTIF</span>
                          </span>
                        )}
                      </div>
                      <p className={`text-xs font-mono font-medium ${isSelected ? "text-emerald-700 font-semibold" : "text-zinc-500"}`}>
                        {layer.role}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2.5 py-1 rounded-full border shrink-0 font-bold ${
                      isSelected
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                        : "bg-zinc-100 text-zinc-600 border-zinc-200"
                    }`}
                  >
                    {layer.tag}
                  </span>
                </div>

                {isSelected && (
                  <div className="mt-3 pt-3 border-t border-emerald-200/80 text-xs text-zinc-800 leading-relaxed animate-in fade-in duration-200">
                    <p>{layer.description}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Warning Box */}
      <div className="mt-6 p-4 rounded-xl bg-amber-50/70 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Aturan Emas Menuang Aqua Soil:</p>
          <p className="mt-0.5 text-amber-800 leading-relaxed">
            <strong>JANGAN PERNAH mencuci aqua soil aktif</strong> dengan air sebelum dituangkan ke dalam tangki. Butiran tanah vulkanik ini berpori rapuh dan akan langsung hancur menjadi bubur lumpur pekat jika diaduk dengan air!
          </p>
        </div>
      </div>
    </div>
  );
}
