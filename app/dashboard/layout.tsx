"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  MonitorSmartphone,
  FileText,
  Package,
  ShoppingCart,
  CreditCard,
  AlertTriangle,
  LogOut,
} from "lucide-react";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Kasir", href: "/dashboard/kasir", icon: MonitorSmartphone },
    { name: "Riwayat Penjualan", href: "/dashboard/penjualan", icon: FileText },
    { name: "Data Produk", href: "/dashboard/produk", icon: Package },
    { name: "Pembelian", href: "/dashboard/pembelian", icon: ShoppingCart },
    { name: "Pengeluaran", href: "/dashboard/pengeluaran", icon: CreditCard },
    { name: "Barang Rusak", href: "/dashboard/kerusakan", icon: AlertTriangle },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r shadow-sm flex flex-col justify-between">
        <div>
          {/* Logo / Brand */}
          <div className="h-16 flex items-center px-6 border-b">
            <h1 className="text-xl font-bold text-blue-600">Mozza Aquatic</h1>
          </div>

          {/* Menu Navigasi */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathName === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700 font-semibold"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-400"}`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User / Logout */}
        <div className="p-4 border-t">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            Keluar (Logout)
          </button>
        </div>
      </aside>

      {/* KONTEN UTAMA (Children) */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
