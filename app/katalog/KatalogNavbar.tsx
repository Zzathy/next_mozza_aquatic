"use client";

import React from "react";
import Link from "next/link";
import { Heart, MessageCircle, Store } from "lucide-react";

interface KatalogNavbarProps {
  savedCount: number;
  onOpenWishlist: () => void;
  onOpenStoreInfo: () => void;
  storePhone?: string;
}

export default function KatalogNavbar({
  savedCount,
  onOpenWishlist,
  onOpenStoreInfo,
  storePhone = "6281234567890",
}: KatalogNavbarProps) {
  const handleDirectWhatsApp = () => {
    const cleanPhone = storePhone.replace(/[^0-9]/g, "");
    const message = "Halo Mozza Aquatic Banyuwangi, saya ingin menanyakan informasi toko dan ketersediaan produk.";
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/katalog" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 rounded-xl bg-zinc-100 border border-zinc-200 p-0.5 shadow-xs group-hover:border-zinc-300 transition-colors">
            <div className="w-full h-full bg-white rounded-[9px] flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/mozza_logo_bw.png"
                alt="Mozza Aquatic"
                className="w-6 h-6 object-contain"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-zinc-950 group-hover:text-zinc-700 transition-colors">
                Mozza Aquatic
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
            <p className="text-[10px] font-medium tracking-wide uppercase text-zinc-500">
              Katalog & Cek Stok
            </p>
          </div>
        </Link>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 bg-zinc-100/80 border border-zinc-200/80 p-1.5 rounded-full">
          <Link
            href="/"
            className="px-4 py-1.5 rounded-full text-xs font-medium text-zinc-600 hover:text-zinc-950 transition-colors"
          >
            Beranda
          </Link>
          <Link
            href="/katalog"
            className="px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-zinc-950 shadow-xs transition-all"
          >
            Katalog Stok
          </Link>
          <Link
            href="/panduan"
            className="px-4 py-1.5 rounded-full text-xs font-medium text-zinc-600 hover:text-zinc-950 transition-colors"
          >
            Panduan
          </Link>
          <button
            type="button"
            onClick={onOpenStoreInfo}
            className="px-4 py-1.5 rounded-full text-xs font-medium text-zinc-600 hover:text-zinc-950 transition-colors flex items-center gap-1.5"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Lokasi Toko</span>
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Wishlist / Saved Items Button */}
          <button
            type="button"
            onClick={onOpenWishlist}
            aria-label="Produk Disimpan"
            className="relative p-2.5 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 hover:text-zinc-950 transition-all shadow-xs"
          >
            <Heart
              className={`w-4 h-4 transition-transform ${
                savedCount > 0 ? "fill-rose-500 text-rose-500 scale-105" : ""
              }`}
            />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-zinc-950 text-white font-bold text-[10px] flex items-center justify-center shadow-xs">
                {savedCount}
              </span>
            )}
          </button>

          {/* Quick WhatsApp Contact */}
          <button
            type="button"
            onClick={handleDirectWhatsApp}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-medium text-xs shadow-xs transition-all active:scale-98"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
            <span>Chat WhatsApp</span>
          </button>
        </div>
      </div>
    </header>
  );
}
