"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Package,
  ShoppingCart,
  CreditCard,
  AlertTriangle,
  LayoutDashboard,
  FileText,
  MonitorSmartphone,
  LogOut,
  X,
  ShieldCheck,
  User,
  ChevronRight,
} from "lucide-react";

interface MobileMenuSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenuSheet({ isOpen, onClose }: MobileMenuSheetProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as { role?: string })?.role || "Owner";
  const userName = session?.user?.name || (role === "Pegawai" ? "Kasir Toko" : "Administrator");

  if (!isOpen) return null;

  const allApps = [
    {
      name: "Kasir POS",
      desc: "Transaksi kasir & nota",
      href: "/dashboard/kasir",
      icon: MonitorSmartphone,
      color: "bg-blue-600 text-white",
      adminOnly: false,
    },
    {
      name: "Riwayat Nota",
      desc: "Cek penjualan & void",
      href: "/dashboard/penjualan",
      icon: FileText,
      color: "bg-indigo-50 text-indigo-600 border border-indigo-200",
      adminOnly: false,
    },
    {
      name: "Barang Rusak",
      desc: "Ikan mati & klaim rusak",
      href: "/dashboard/kerusakan",
      icon: AlertTriangle,
      color: "bg-amber-50 text-amber-600 border border-amber-200",
      adminOnly: false,
    },
    {
      name: "Dashboard Laba",
      desc: "Analisis omset & kas",
      href: "/dashboard",
      icon: LayoutDashboard,
      color: "bg-cyan-50 text-cyan-700 border border-cyan-200",
      adminOnly: false,
    },
    {
      name: "Master Produk",
      desc: "Katalog, stok & harga",
      href: "/dashboard/produk",
      icon: Package,
      color: "bg-blue-50 text-blue-600 border border-blue-200",
      adminOnly: true,
    },
    {
      name: "Kulakan Stok",
      desc: "Barang masuk supplier",
      href: "/dashboard/pembelian",
      icon: ShoppingCart,
      color: "bg-emerald-50 text-emerald-600 border border-emerald-200",
      adminOnly: true,
    },
    {
      name: "Pengeluaran",
      desc: "Beban biaya operasional",
      href: "/dashboard/pengeluaran",
      icon: CreditCard,
      color: "bg-rose-50 text-rose-600 border border-rose-200",
      adminOnly: true,
    },
  ];

  const filteredApps = allApps.filter((app) => {
    if (role === "Pegawai" && app.adminOnly) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 lg:hidden print:hidden">
      {/* BACKDROP BLUR */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* BOTTOM SHEET CONTAINER */}
      <div className="fixed bottom-0 left-0 right-0 max-h-[85vh] bg-white rounded-t-[32px] shadow-2xl border-t border-gray-100 flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom duration-300 pb-[env(safe-area-inset-bottom)]">
        {/* DRAG HANDLE BAR */}
        <div className="pt-3 pb-2 flex justify-center">
          <div className="w-12 h-1.5 rounded-full bg-gray-300" />
        </div>

        {/* SHEET HEADER & USER PROFILE CARD */}
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/70 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs ${
                role === "Owner"
                  ? "bg-purple-600 text-white"
                  : "bg-blue-600 text-white"
              }`}
            >
              {role === "Owner" ? <ShieldCheck className="w-5 h-5" /> : <User className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-sm text-gray-900 leading-tight truncate">
                {userName}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  {role} Toko
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 active:scale-95 transition-all text-xs font-bold flex items-center gap-1"
              title="Keluar Akun"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SHEET CONTENT: MODERN APP GRID */}
        <div className="p-5 overflow-y-auto space-y-4 max-h-[calc(85vh-140px)]">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-gray-400 block mb-3">
              Semua Modul & Pengaturan Toko
            </span>

            <div className="grid grid-cols-2 gap-3">
              {filteredApps.map((app) => {
                const isActive = pathname === app.href;
                const Icon = app.icon;

                return (
                  <Link
                    key={app.name}
                    href={app.href}
                    onClick={onClose}
                    className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between gap-3 active:scale-95 ${
                      isActive
                        ? "bg-blue-50/80 border-[#2563EB] shadow-xs"
                        : "bg-white border-gray-200/80 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-xs ${app.color}`}>
                        <Icon className="w-5 h-5 stroke-[2.2]" />
                      </div>
                      <ChevronRight className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-gray-300"}`} />
                    </div>

                    <div>
                      <h4 className="font-extrabold text-sm text-gray-900 leading-tight">
                        {app.name}
                      </h4>
                      <p className="text-[11px] font-medium text-gray-400 line-clamp-1 mt-0.5">
                        {app.desc}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/80 text-center">
            <p className="text-xs font-bold text-gray-700">Mozza Aquatic Banyuwangi</p>
            <p className="text-[11px] text-gray-400 mt-0.5">POS & Store Management Web-App</p>
          </div>
        </div>
      </div>
    </div>
  );
}
