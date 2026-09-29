"use client";

import React from "react";
import { X, MapPin, Clock, Phone, Sparkles, MessageCircle, Navigation } from "lucide-react";

interface StoreInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  storePhone?: string;
}

export default function StoreInfoModal({
  isOpen,
  onClose,
  storePhone = "6281234567890",
}: StoreInfoModalProps) {
  if (!isOpen) return null;

  const handleOpenMaps = () => {
    window.open("https://maps.google.com/?q=Mozza+Aquatic+Banyuwangi", "_blank", "noopener,noreferrer");
  };

  const handleWhatsApp = () => {
    const cleanPhone = storePhone.replace(/[^0-9]/g, "");
    const message = "Halo Mozza Aquatic, saya ingin bertanya alamat toko dan jam operasional untuk berkunjung hari ini.";
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />

      <div className="relative w-full max-w-lg rounded-2xl sm:rounded-3xl bg-white border border-zinc-200 shadow-2xl p-6 sm:p-7 z-10 text-zinc-800 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 border border-zinc-200 p-0.5 shadow-xs">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/mozza_logo_bw.png"
                  alt="Mozza Aquatic"
                  className="w-7 h-7 object-contain"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-lg font-bold text-zinc-950">Mozza Aquatic</h3>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <p className="text-xs text-zinc-500">Aquascape & Ornamental Fish Gallery</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Rows */}
        <div className="space-y-3 text-xs">
          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
            <MapPin className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-zinc-900">Alamat Toko</p>
              <p className="text-zinc-600 mt-0.5 leading-relaxed">
                Banyuwangi, Jawa Timur, Indonesia
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
            <Clock className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-zinc-900">Jam Operasional</p>
              <p className="text-zinc-600 mt-0.5 leading-relaxed">
                Buka Setiap Hari: 09.00 - 21.00 WIB
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
            <Phone className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-zinc-900">Kontak & Pemesanan</p>
              <p className="text-zinc-600 mt-0.5 leading-relaxed">
                WhatsApp: +62 812-3456-7890 (Layanan Fast Respon)
              </p>
            </div>
          </div>
        </div>

        {/* Highlight Services */}
        <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs space-y-2">
          <p className="font-semibold text-zinc-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Layanan Toko Kami
          </p>
          <ul className="grid grid-cols-2 gap-2 text-zinc-600 text-[11px]">
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Ikan Hias Karantina Sehat
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Tanaman Aquascape Segar
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Peralatan Aquascape & Co2
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Konsultasi & Setting Tank
            </li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleOpenMaps}
            className="flex-1 py-3 px-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 hover:text-zinc-950 font-medium text-xs flex items-center justify-center gap-2 border border-zinc-200 transition-colors"
          >
            <Navigation className="w-4 h-4 text-zinc-600" />
            <span>Petunjuk Arah (Maps)</span>
          </button>

          <button
            type="button"
            onClick={handleWhatsApp}
            className="flex-1 py-3 px-4 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
            <span>Chat WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
