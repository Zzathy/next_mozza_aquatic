"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  FileText,
  LayoutDashboard,
  CreditCard,
  AlertTriangle,
  Grid,
  ShoppingCart,
} from "lucide-react";

interface MobileBottomNavProps {
  onOpenMenu: () => void;
}

export default function MobileBottomNav({ onOpenMenu }: MobileBottomNavProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as { role?: string })?.role || "Owner";

  const isKasirActive = pathname === "/dashboard/kasir";
  const isDashboardActive = pathname === "/dashboard";
  const isPenjualanActive = pathname === "/dashboard/penjualan";
  const isRightActive =
    role === "Pegawai"
      ? pathname === "/dashboard/kerusakan"
      : pathname === "/dashboard/pengeluaran";

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-gray-200/90 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgba(0,0,0,0.08)] print:hidden">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2 relative">
        {/* 1. DASHBOARD / RINGKASAN */}
        <Link
          href="/dashboard"
          className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all active:scale-90 select-none ${
            isDashboardActive ? "text-[#2563EB]" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <div
            className={`p-1 rounded-xl transition-all ${
              isDashboardActive ? "bg-blue-50 text-[#2563EB]" : ""
            }`}
          >
            <LayoutDashboard className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span
            className={`text-[10px] tracking-tight ${
              isDashboardActive ? "font-black text-[#2563EB]" : "font-semibold text-gray-500"
            }`}
          >
            Ringkasan
          </span>
        </Link>

        {/* 2. RIWAYAT PENJUALAN */}
        <Link
          href="/dashboard/penjualan"
          className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all active:scale-90 select-none ${
            isPenjualanActive ? "text-[#2563EB]" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <div
            className={`p-1 rounded-xl transition-all ${
              isPenjualanActive ? "bg-blue-50 text-[#2563EB]" : ""
            }`}
          >
            <FileText className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span
            className={`text-[10px] tracking-tight ${
              isPenjualanActive ? "font-black text-[#2563EB]" : "font-semibold text-gray-500"
            }`}
          >
            Penjualan
          </span>
        </Link>

        {/* 3. KASIR (THE STAR ⭐ - PROMINENT CENTER ELEVATED BUTTON) */}
        <div className="flex-1 flex flex-col items-center justify-center relative -top-3 z-10">
          <Link
            href="/dashboard/kasir"
            aria-label="Buka Kasir POS"
            className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl ring-4 ring-[#F3F4F6] active:scale-90 transition-all ${
              isKasirActive
                ? "bg-gradient-to-tr from-blue-700 via-blue-600 to-blue-500 shadow-blue-500/50 scale-105"
                : "bg-gradient-to-tr from-blue-600 to-blue-500 shadow-blue-500/30 hover:scale-105"
            }`}
          >
            <ShoppingCart className="w-6 h-6 stroke-[2.5]" />
          </Link>
          <span
            className={`text-[10px] tracking-tight mt-1 ${
              isKasirActive ? "font-black text-[#2563EB]" : "font-bold text-gray-700"
            }`}
          >
            Kasir
          </span>
        </div>

        {/* 4. PENGELUARAN / KERUSAKAN */}
        {role === "Pegawai" ? (
          <Link
            href="/dashboard/kerusakan"
            className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all active:scale-90 select-none ${
              isRightActive ? "text-amber-600" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <div
              className={`p-1 rounded-xl transition-all ${
                isRightActive ? "bg-amber-50 text-amber-600" : ""
              }`}
            >
              <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span
              className={`text-[10px] tracking-tight ${
                isRightActive ? "font-black text-amber-600" : "font-semibold text-gray-500"
              }`}
            >
              Kerusakan
            </span>
          </Link>
        ) : (
          <Link
            href="/dashboard/pengeluaran"
            className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all active:scale-90 select-none ${
              isRightActive ? "text-rose-600" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <div
              className={`p-1 rounded-xl transition-all ${
                isRightActive ? "bg-rose-50 text-rose-600" : ""
              }`}
            >
              <CreditCard className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span
              className={`text-[10px] tracking-tight ${
                isRightActive ? "font-black text-rose-600" : "font-semibold text-gray-500"
              }`}
            >
              Pengeluaran
            </span>
          </Link>
        )}

        {/* 5. MENU LAIN (MEMBUKA BOTTOM SHEET APP GRID) */}
        <button
          type="button"
          onClick={onOpenMenu}
          className="flex-1 flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-gray-600 transition-all active:scale-90 select-none"
        >
          <div className="p-1 rounded-xl">
            <Grid className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[10px] font-semibold text-gray-500 tracking-tight">
            Menu Lain
          </span>
        </button>
      </div>
    </div>
  );
}
