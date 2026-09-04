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
} from "lucide-react";

export default function AppSidebar() {
  const pathName = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as { role?: string })?.role;

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
    <aside className="w-64 bg-white border-r border-gray-200 text-gray-800 flex flex-col justify-between shrink-0 print:hidden select-none shadow-[2px_0_8px_rgba(0,0,0,0.02)]">
      <div>
        {/* LOGO BRANDING */}
        <div className="h-20 flex items-center gap-3 px-4 border-b border-gray-100 bg-white">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-gray-200 bg-black shrink-0 shadow-xs">
            <Image
              src="/mozza_logo.png"
              alt="Mozza Aquatic"
              fill
              sizes="48px"
              className="object-contain p-0.5"
              priority
            />
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-extrabold text-gray-950 leading-tight tracking-tight truncate">
              Mozza Aquatic
            </h1>
            <p className="text-xs font-semibold text-gray-500 tracking-wide">
              Aquascape & Fish Store
            </p>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathName === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
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

      {/* USER / LOGOUT */}
      <div className="p-4 border-t border-gray-100 bg-white">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2.5 px-3 py-2 w-full rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 border border-transparent transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Keluar (Logout)
        </button>
      </div>
    </aside>
  );
}
