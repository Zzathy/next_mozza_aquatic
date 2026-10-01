"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle, Eye, ListOrdered } from "lucide-react";
import { SETUP_STEPS, SetupStep } from "./guide-data";

export default function SetupStepsExplorer() {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"stepper" | "timeline">("stepper");

  const currentStep: SetupStep = SETUP_STEPS[activeIdx];

  const handlePrev = () => {
    setActiveIdx((prev) => (prev > 0 ? prev - 1 : SETUP_STEPS.length - 1));
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev < SETUP_STEPS.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="space-y-6">
      {/* Header & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 font-mono">
            ROADMAP STEP-BY-STEP
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight mt-1">
            10 Tahapan Eksekusi: Dari Fondasi Hingga Biosfer Abadi
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Panduan sekuensial terbagi menjadi Fase Konstruksi Fisik (Langkah 01–05) dan Fase Keseimbangan Biologis (Langkah 06–10).
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-zinc-100/90 p-1.5 rounded-xl border border-zinc-200">
          <button
            type="button"
            onClick={() => setViewMode("stepper")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "stepper"
                ? "bg-zinc-950 text-white shadow-xs"
                : "text-zinc-600 hover:text-zinc-950"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Fokus Per Langkah</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("timeline")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "timeline"
                ? "bg-zinc-950 text-white shadow-xs"
                : "text-zinc-600 hover:text-zinc-950"
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Semua Langkah (1–10)</span>
          </button>
        </div>
      </div>

      {viewMode === "stepper" ? (
        /* ================= STEPPER VIEW (INTERACTIVE SHOWCASE) ================= */
        <div className="space-y-6">
          {/* Top Horizontal Step Selector Bar */}
          <div className="p-3 rounded-2xl bg-white border border-zinc-200/90 shadow-xs overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 min-w-max">
              {SETUP_STEPS.map((s, idx) => {
                const isActive = activeIdx === idx;
                const isConstruction = s.phase === "Konstruksi";

                return (
                  <button
                    key={s.number}
                    type="button"
                    onClick={() => setActiveIdx(idx)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs transition-all ${
                      isActive
                        ? "bg-zinc-950 text-white font-bold shadow-md scale-102"
                        : "bg-zinc-50 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 border border-zinc-200/80"
                    }`}
                  >
                    <span
                      className={`font-mono text-[11px] px-1.5 py-0.5 rounded ${
                        isActive
                          ? "bg-zinc-800 text-white"
                          : isConstruction
                          ? "bg-zinc-200 text-zinc-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {s.number}
                    </span>
                    <span className="truncate max-w-[130px] font-medium">{s.title.split(" ")[0]} {s.title.split(" ")[1] || ""}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Step Showcase Card (Spacious Split 2-Columns) */}
          <div className="rounded-2xl sm:rounded-3xl bg-white border border-zinc-200 shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left: Uncropped Large Photo Display (6 cols) */}
            <div className="lg:col-span-6 relative bg-zinc-950 flex items-center justify-center min-h-[360px] sm:min-h-[460px] lg:min-h-[520px] overflow-hidden group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentStep.image}
                alt={currentStep.title}
                className={`w-full h-full ${
                  currentStep.number === "04"
                    ? "object-contain bg-zinc-950 p-2 sm:p-4"
                    : "object-contain sm:object-cover"
                } group-hover:scale-102 transition-transform duration-500`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Floating badges on top of photo */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-zinc-950/90 text-white backdrop-blur-md border border-white/20 shadow-md">
                  LANGKAH {currentStep.number} / 10
                </span>
                <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-white/90 text-zinc-900 backdrop-blur-md font-bold shadow-md">
                  Fase {currentStep.phase}
                </span>
              </div>
            </div>

            {/* Right: Comprehensive Explanation & Controls (6 cols) */}
            <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 font-bold block mb-1">
                    FASE {currentStep.phase.toUpperCase()} • LANGKAH KE-{parseInt(currentStep.number, 10)}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-950 tracking-tight">
                    {currentStep.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-zinc-500 mt-1">
                    {currentStep.subtitle}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed bg-zinc-50 p-4 rounded-xl border border-zinc-200/80">
                  {currentStep.summary}
                </p>

                {/* Checklist Breakdown */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold block">
                    INSTRUKSI DETAIL:
                  </span>
                  <ul className="space-y-2 text-xs text-zinc-700">
                    {currentStep.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Critical Tip Callout */}
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    <strong>Tips Krusial:</strong> {currentStep.criticalTip}
                  </span>
                </div>
              </div>

              {/* Prev / Next Navigation Buttons */}
              <div className="pt-4 border-t border-zinc-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Sebelumnya</span>
                </button>

                <div className="text-xs font-mono text-zinc-400">
                  {activeIdx + 1} dari {SETUP_STEPS.length}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <span>Langkah Berikutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ================= TIMELINE VIEW (FULL SEQUENTIAL STORY) ================= */
        <div className="space-y-8 relative">
          {SETUP_STEPS.map((step, idx) => {
            const isEven = idx % 2 === 1;

            return (
              <div
                key={step.number}
                className="rounded-2xl sm:rounded-3xl bg-white border border-zinc-200/90 shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch"
              >
                {/* Photo Side */}
                <div
                  className={`lg:col-span-6 relative bg-zinc-950 flex items-center justify-center ${
                    step.number === "04"
                      ? "min-h-[380px] sm:min-h-[480px]"
                      : "min-h-[260px] sm:min-h-[340px]"
                  } overflow-hidden group ${
                    isEven ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={step.image}
                    alt={step.title}
                    className={`w-full h-full ${
                      step.number === "04"
                        ? "object-contain bg-zinc-950 p-2 sm:p-4"
                        : "object-cover"
                    } group-hover:scale-102 transition-transform duration-500`}
                  />
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-zinc-950/90 text-white backdrop-blur-md border border-white/20">
                      LANGKAH {step.number}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/90 text-zinc-900 font-bold">
                      Fase {step.phase}
                    </span>
                  </div>
                </div>

                {/* Content Side */}
                <div
                  className={`lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-4 ${
                    isEven ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-zinc-950">{step.title}</h3>
                      <p className="text-xs font-medium text-zinc-500 mt-0.5">{step.subtitle}</p>
                    </div>

                    <p className="text-xs text-zinc-700 leading-relaxed bg-zinc-50 p-3.5 rounded-xl border border-zinc-200/70">
                      {step.summary}
                    </p>

                    <ul className="space-y-1.5 text-xs text-zinc-600">
                      {step.details.map((detail, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/80 text-[11px] text-zinc-800">
                    <strong className="text-zinc-950">Tips Krusial:</strong> {step.criticalTip}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
