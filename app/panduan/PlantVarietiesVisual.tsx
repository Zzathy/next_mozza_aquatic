"use client";

import React, { useState } from "react";
import { Leaf, Layers, CheckCircle2, AlertTriangle, ArrowRight, Compass } from "lucide-react";
import Link from "next/link";
import { PLANT_MORPHOLOGIES, PLANT_ZONES } from "./guide-data";

export default function PlantVarietiesVisual() {
  const [tab, setTab] = useState<"morphology" | "zonasi">("morphology");
  const [activeMorphId, setActiveMorphId] = useState<string>("epifit");
  const [activeZoneId, setActiveZoneId] = useState<string>("foreground");

  const currentMorph = PLANT_MORPHOLOGIES.find((m) => m.id === activeMorphId) || PLANT_MORPHOLOGIES[0];
  const currentZone = PLANT_ZONES.find((z) => z.id === activeZoneId) || PLANT_ZONES[0];

  return (
    <div className="rounded-2xl sm:rounded-3xl bg-white border border-zinc-200/90 p-6 sm:p-8 shadow-xs space-y-6">
      {/* Top Header & Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-zinc-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2">
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            <span>Botani Aquascape &amp; Tata Kelola Flora</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-950 tracking-tight">
            Morfologi Bentuk &amp; Zonasi Ketinggian Tanaman Air
          </h3>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-2xl leading-relaxed">
            Pahami anatomi biologis tanaman bawah air (Epifit, Rhizome, Rosette, Stem) serta aturan penempatannya (Foreground, Midground, Background) agar tumbuh subur dan harmonis.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-zinc-100 p-1.5 rounded-xl border border-zinc-200">
          <button
            type="button"
            onClick={() => setTab("morphology")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              tab === "morphology"
                ? "bg-zinc-950 text-white shadow-xs"
                : "text-zinc-600 hover:text-zinc-950"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>4 Morfologi Bentuk</span>
          </button>
          <button
            type="button"
            onClick={() => setTab("zonasi")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              tab === "zonasi"
                ? "bg-zinc-950 text-white shadow-xs"
                : "text-zinc-600 hover:text-zinc-950"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>3 Zonasi Ketinggian</span>
          </button>
        </div>
      </div>

      {tab === "morphology" ? (
        /* ================= MORFOLOGI TANAMAN ================= */
        <div className="space-y-6">
          {/* Morphology Selector Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {PLANT_MORPHOLOGIES.map((morph) => {
              const isSelected = activeMorphId === morph.id;
              return (
                <button
                  key={morph.id}
                  type="button"
                  onClick={() => setActiveMorphId(morph.id)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? "bg-zinc-950 text-white border-zinc-950 shadow-md ring-2 ring-emerald-500/30 scale-102"
                      : "bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200"
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider block opacity-70">
                      {morph.latinType}
                    </span>
                    <h4 className="font-bold text-xs sm:text-sm mt-0.5">{morph.name}</h4>
                  </div>
                  <span
                    className={`mt-2 text-[9px] font-mono px-2 py-0.5 rounded-full self-start font-semibold ${
                      isSelected ? "bg-zinc-800 text-emerald-400" : "bg-zinc-200 text-zinc-700"
                    }`}
                  >
                    {morph.tag}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Morphology Showcase Card */}
          <div className="rounded-2xl bg-white border border-zinc-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 items-center">
            {/* Image Box */}
            <div className="md:col-span-5 relative h-64 sm:h-72 w-full bg-zinc-950 flex items-center justify-center p-4 overflow-hidden group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentMorph.image}
                alt={currentMorph.name}
                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-black/80 text-white backdrop-blur-md border border-white/20 font-bold">
                {currentMorph.tag}
              </span>
            </div>

            {/* Description Box */}
            <div className="md:col-span-7 p-6 sm:p-7 space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 font-bold">
                  {currentMorph.latinType}
                </span>
                <h3 className="text-xl font-bold text-zinc-950">{currentMorph.name}</h3>
                <p className="text-xs text-zinc-600 mt-2 leading-relaxed">{currentMorph.definition}</p>
              </div>

              {/* Key Rule Warning Box */}
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Aturan Kunci:</strong> {currentMorph.keyRule}
                </span>
              </div>

              {/* Characteristics */}
              <div className="space-y-1.5 text-xs text-zinc-700">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold block">
                  KARAKTERISTIK BIOLOGIS:
                </span>
                {currentMorph.characteristics.map((c, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>

              {/* Plant Examples */}
              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                <span className="text-zinc-500 font-medium">Contoh Spesies:</span>
                <span className="font-bold text-zinc-900 text-right">{currentMorph.examples.join(", ")}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ================= ZONASI KETINGGIAN TANAMAN ================= */
        <div className="space-y-6">
          {/* Zone Selector Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PLANT_ZONES.map((zone) => {
              const isSelected = activeZoneId === zone.id;
              return (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => setActiveZoneId(zone.id)}
                  className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? "bg-zinc-950 text-white border-zinc-950 shadow-md ring-2 ring-emerald-500/30 scale-102"
                      : "bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200"
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider block opacity-70">
                      Tinggi: {zone.heightRange}
                    </span>
                    <h4 className="font-bold text-sm mt-0.5">{zone.name}</h4>
                  </div>
                  <span
                    className={`mt-2 text-[10px] font-mono px-2 py-0.5 rounded-full self-start font-semibold ${
                      isSelected ? "bg-zinc-800 text-emerald-400" : "bg-zinc-200 text-zinc-700"
                    }`}
                  >
                    {zone.role}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Zone Showcase Card */}
          <div className="rounded-2xl bg-white border border-zinc-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 items-center">
            {/* Image Box */}
            <div className="md:col-span-5 relative h-64 sm:h-72 w-full bg-zinc-950 flex items-center justify-center p-4 overflow-hidden group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentZone.image}
                alt={currentZone.name}
                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-black/80 text-white backdrop-blur-md border border-white/20 font-bold">
                Ketinggian: {currentZone.heightRange}
              </span>
            </div>

            {/* Description Box */}
            <div className="md:col-span-7 p-6 sm:p-7 space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 font-bold">
                  ZONA {currentZone.zoneType.toUpperCase()}
                </span>
                <h3 className="text-xl font-bold text-zinc-950">{currentZone.name}</h3>
                <p className="text-xs text-zinc-600 mt-2 leading-relaxed">{currentZone.description}</p>
              </div>

              {/* Placement Tip */}
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 space-y-1">
                <span className="font-mono text-[10px] uppercase font-bold text-zinc-500 block">
                  TIPS PENANAMAN &amp; PEMANGKASAN:
                </span>
                <p className="leading-relaxed">{currentZone.placementTip}</p>
              </div>

              {/* Plant Examples */}
              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                <span className="text-zinc-500 font-medium">Spesies Populer:</span>
                <span className="font-bold text-zinc-900 text-right">{currentZone.examples.join(", ")}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Link to Catalog */}
      <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <span className="text-zinc-600 text-center sm:text-left">
          Ingin memilih tanaman epifit, karpet, atau stem plants yang cocok untuk tangki Anda?
        </span>
        <Link
          href="/katalog"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-semibold transition-all shadow-xs shrink-0"
        >
          <span>Cek Stok Tanaman di Katalog</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
