"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  MonitorSmartphone,
  FileText,
  Package,
  ShoppingCart,
  CreditCard,
  AlertTriangle,
  ArrowLeftRight,
  LogOut,
  UserCheck,
  ShieldAlert,
  X,
} from "lucide-react";

interface AppSidebarProps {
  onCloseMobile?: () => void;
}

export default function AppSidebar({ onCloseMobile }: AppSidebarProps) {
  const pathName = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as { role?: string })?.role || "Owner";
  const userName = session?.user?.name || (role === "Pegawai" ? "Kasir Toko" : "Administrator");

  const allMenuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      adminOnly: false,
    },
    {
      name: "Kasir",
      href: "/dashboard/kasir",
      icon: MonitorSmartphone,
      adminOnly: false,
    },
    {
      name: "Riwayat Penjualan",
      href: "/dashboard/penjualan",
      icon: FileText,
      adminOnly: false,
    },
    {
      name: "Barang Rusak",
      href: "/dashboard/kerusakan",
      icon: AlertTriangle,
      adminOnly: false,
    },
    {
      name: "Data Produk",
      href: "/dashboard/produk",
      icon: Package,
      adminOnly: true,
    },
    {
      name: "Pembelian",
      href: "/dashboard/pembelian",
      icon: ShoppingCart,
      adminOnly: true,
    },
    {
      name: "Pengeluaran",
      href: "/dashboard/pengeluaran",
      icon: CreditCard,
      adminOnly: true,
    },
    {
      name: "Migrasi Penjualan",
      href: "/dashboard/migrasi-penjualan",
      icon: ArrowLeftRight,
      adminOnly: true,
    },
  ];

  const menuItems = allMenuItems.filter((item) => {
    if (role === "Pegawai" && item.adminOnly) {
      return false;
    }
    return true;
  });

  return (
    <aside className="w-64 h-full bg-white border-r border-gray-200 text-gray-800 flex flex-col justify-between shrink-0 select-none shadow-[2px_0_8px_rgba(0,0,0,0.02)]">
      <div>
        {/* LOGO BRANDING */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-gray-200 bg-black shrink-0 shadow-xs">
              <Image
                src="/mozza_logo.png"
                alt="Mozza Aquatic"
                fill
                sizes="44px"
                className="object-contain p-0.5"
                priority
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-extrabold text-gray-950 leading-tight tracking-tight truncate">
                Mozza Aquatic
              </h1>
              <p className="text-[11px] font-semibold text-gray-400 tracking-wide truncate">
                Aquascape & Fish Store
              </p>
            </div>
          </div>

          {/* CLOSE BUTTON FOR MOBILE DRAWER */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              title="Tutup Menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-190px)]">
          {menuItems.map((item) => {
            const isActive = pathName === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-[#2563EB] text-white shadow-sm shadow-blue-500/20"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-400"}`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* USER PROFILE & LOGOUT */}
      <div className="p-3.5 border-t border-gray-100 bg-gray-50/80 space-y-2">
        {/* Profile Tag */}
        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl bg-white border border-gray-200/80 shadow-2xs">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
            role === "Owner"
              ? "bg-purple-100 text-purple-700 border border-purple-200"
              : "bg-blue-100 text-blue-700 border border-blue-200"
          }`}>
            {role === "Owner" ? <ShieldAlert className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-extrabold text-gray-900 truncate">
              {userName}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${role === "Owner" ? "bg-purple-500" : "bg-emerald-500"}`} />
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                {role}
              </span>
            </div>
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center justify-center gap-2 px-3 py-2 w-full rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-transparent transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Keluar Sesi
        </button>
      </div>
    </aside>
  );
}
