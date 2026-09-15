"use client";

import React, { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import MobileBottomNav from "@/components/MobileBottomNav";
import MobileMenuSheet from "@/components/MobileMenuSheet";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { ShieldCheck, User } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuSheetOpen, setIsMenuSheetOpen] = useState(false);
  const { data: session } = useSession();
  const role = (session?.user as { role?: string })?.role || "Owner";

  return (
    <div className="flex h-screen bg-[#F3F4F6] overflow-hidden print:h-auto print:bg-white text-gray-900 relative">
      {/* DESKTOP SIDEBAR (KHUSUS LAYAR KOMPUTER / TABLET BESAR) */}
      <div className="hidden lg:block h-full print:hidden">
        <AppSidebar />
      </div>

      {/* MOBILE MENU SHEET (PENGGANTI SIDEBAR DI HP - ALA BOTTOM SHEET NATIVE APP) */}
      <MobileMenuSheet
        isOpen={isMenuSheetOpen}
        onClose={() => setIsMenuSheetOpen(false)}
      />

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* MOBILE APP HEADER (CLEAN & NATIVE STYLE) */}
        <header className="lg:hidden h-14 bg-white border-b border-gray-200 px-4 flex items-center justify-between shrink-0 print:hidden shadow-2xs">
          {/* BRANDING KIRI */}
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-xl overflow-hidden border border-gray-200 bg-black shadow-xs">
              <Image
                src="/mozza_logo.png"
                alt="Mozza Logo"
                fill
                sizes="32px"
                className="object-contain p-0.5"
                priority
              />
            </div>
            <div>
              <span className="font-black text-sm text-gray-950 tracking-tight block leading-tight">
                Mozza Aquatic
              </span>
              <span className="text-[10px] font-semibold text-gray-400 block tracking-wide">
                Banyuwangi Store
              </span>
            </div>
          </div>

          {/* PROFIL BADGE KANAN (SENTUH UNTUK BUKA MENU LAIN) */}
          <button
            onClick={() => setIsMenuSheetOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 border border-gray-200 hover:bg-gray-200/80 active:scale-95 transition-all text-xs font-bold"
          >
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center text-white ${
                role === "Owner" ? "bg-purple-600" : "bg-blue-600"
              }`}
            >
              {role === "Owner" ? (
                <ShieldCheck className="w-2.5 h-2.5" />
              ) : (
                <User className="w-2.5 h-2.5" />
              )}
            </div>
            <span className="text-gray-700 text-[11px] font-extrabold">{role}</span>
          </button>
        </header>

        {/* PAGE CONTENT WITH SAFE BOTTOM PADDING ON MOBILE FOR BOTTOM NAV */}
        <main className="flex-1 overflow-y-auto print:overflow-visible bg-[#F3F4F6] pb-24 lg:pb-0">
          {children}
        </main>

        {/* MOBILE BOTTOM NAVIGATION BAR (DENGAN KASIR BINTANG UTAMA DI TENGAH) */}
        <MobileBottomNav onOpenMenu={() => setIsMenuSheetOpen(true)} />
      </div>
    </div>
  );
}
