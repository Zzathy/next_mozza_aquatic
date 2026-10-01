"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, MessageCircle, Store, Menu, X, BookOpen, Layers } from "lucide-react";
import StoreInfoModal from "./StoreInfoModal";

interface PublicNavbarProps {
  savedCount?: number;
  onOpenWishlist?: () => void;
  onOpenStoreInfo?: () => void;
  storePhone?: string;
}

export default function PublicNavbar({
  savedCount = 0,
  onOpenWishlist,
  onOpenStoreInfo,
  storePhone = "6281234567890",
}: PublicNavbarProps) {
  const pathname = usePathname();
  const [internalStoreInfoOpen, setInternalStoreInfoOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const [localSavedCount] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("mozza_catalog_wishlist");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) return parsed.length;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return 0;
  });

  const isHome = pathname === "/";
  const isKatalog = pathname.startsWith("/katalog");
  const isPanduan = pathname.startsWith("/panduan");

  const effectiveSavedCount = savedCount > 0 ? savedCount : localSavedCount;

  const handleOpenStore = () => {
    if (onOpenStoreInfo) {
      onOpenStoreInfo();
    } else {
      setInternalStoreInfoOpen(true);
    }
    setIsMobileNavOpen(false);
  };

  const handleDirectWhatsApp = () => {
    const cleanPhone = storePhone.replace(/[^0-9]/g, "");
    const message = isPanduan
      ? "Halo Mozza Aquatic Banyuwangi, saya sedang membaca Panduan Aquascape di website dan ingin konsultasi mengenai setting tangki impian saya."
      : "Halo Mozza Aquatic Banyuwangi, saya ingin menanyakan informasi toko dan ketersediaan produk.";
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <>
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
                Aquascape &amp; Ornamental Fish
              </p>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-zinc-100/80 border border-zinc-200/80 p-1.5 rounded-full shadow-xs">
            <Link
              href="/"
              className={`px-4 py-1.5 rounded-full text-xs transition-all ${
                isHome
                  ? "font-semibold text-white bg-zinc-950 shadow-xs"
                  : "font-medium text-zinc-600 hover:text-zinc-950"
              }`}
            >
              Beranda
            </Link>
            <Link
              href="/katalog"
              className={`px-4 py-1.5 rounded-full text-xs transition-all ${
                isKatalog
                  ? "font-semibold text-white bg-zinc-950 shadow-xs"
                  : "font-medium text-zinc-600 hover:text-zinc-950"
              }`}
            >
              Katalog Stok
            </Link>
            <Link
              href="/panduan"
              className={`px-4 py-1.5 rounded-full text-xs transition-all ${
                isPanduan
                  ? "font-semibold text-white bg-zinc-950 shadow-xs"
                  : "font-medium text-zinc-600 hover:text-zinc-950"
              }`}
            >
              Panduan Aquascape
            </Link>
            <button
              type="button"
              onClick={handleOpenStore}
              className="px-4 py-1.5 rounded-full text-xs font-medium text-zinc-600 hover:text-zinc-950 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Lokasi Toko</span>
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Wishlist Button (Always present for uniform layout across all pages) */}
            {onOpenWishlist ? (
              <button
                type="button"
                onClick={onOpenWishlist}
                aria-label="Produk Disimpan"
                className="relative p-2.5 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 hover:text-zinc-950 transition-all shadow-xs cursor-pointer"
              >
                <Heart
                  className={`w-4 h-4 transition-transform ${
                    effectiveSavedCount > 0 ? "fill-rose-500 text-rose-500 scale-105" : ""
                  }`}
                />
                {effectiveSavedCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-zinc-950 text-white font-bold text-[10px] flex items-center justify-center shadow-xs">
                    {effectiveSavedCount}
                  </span>
                )}
              </button>
            ) : (
              <Link
                href="/katalog"
                aria-label="Lihat Produk Disimpan di Katalog"
                className="relative p-2.5 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 hover:text-zinc-950 transition-all shadow-xs cursor-pointer flex items-center justify-center"
              >
                <Heart
                  className={`w-4 h-4 transition-transform ${
                    effectiveSavedCount > 0 ? "fill-rose-500 text-rose-500 scale-105" : ""
                  }`}
                />
                {effectiveSavedCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-zinc-950 text-white font-bold text-[10px] flex items-center justify-center shadow-xs">
                    {effectiveSavedCount}
                  </span>
                )}
              </Link>
            )}

            {/* Quick WhatsApp Contact (Desktop) */}
            <button
              type="button"
              onClick={handleDirectWhatsApp}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-medium text-xs shadow-xs transition-all active:scale-98 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
              <span>Chat WhatsApp</span>
            </button>

            {/* Mobile Navigation Toggle (Hamburger) */}
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              aria-label="Menu Navigasi"
              className="md:hidden p-2 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-700 hover:text-zinc-950 transition-colors"
            >
              {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Menu */}
        {isMobileNavOpen && (
          <div className="md:hidden border-t border-zinc-100 bg-white/95 px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top-2 duration-200 shadow-lg">
            <Link
              href="/"
              onClick={() => setIsMobileNavOpen(false)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isHome ? "bg-zinc-950 text-white" : "text-zinc-700 hover:bg-zinc-100"
              }`}
            >
              <span>Beranda</span>
            </Link>
            <Link
              href="/katalog"
              onClick={() => setIsMobileNavOpen(false)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isKatalog ? "bg-zinc-950 text-white" : "text-zinc-700 hover:bg-zinc-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Katalog Stok</span>
              </div>
            </Link>
            <Link
              href="/panduan"
              onClick={() => setIsMobileNavOpen(false)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isPanduan ? "bg-zinc-950 text-white" : "text-zinc-700 hover:bg-zinc-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Panduan Aquascape</span>
              </div>
            </Link>
            <button
              type="button"
              onClick={handleOpenStore}
              className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition-colors text-left"
            >
              <Store className="w-4 h-4" />
              <span>Lokasi &amp; Info Toko</span>
            </button>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleDirectWhatsApp}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-950 text-white text-xs font-semibold"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                <span>Chat WhatsApp</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Internal Store Info Modal */}
      <StoreInfoModal
        isOpen={internalStoreInfoOpen}
        onClose={() => setInternalStoreInfoOpen(false)}
        storePhone={storePhone}
      />
    </>
  );
}
