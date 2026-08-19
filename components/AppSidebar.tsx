"use client";

import Link from "next/link";
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
    <aside className="w-64 bg-white border-r shadow-sm flex flex-col justify-between print:hidden">
      <div>
        <div className="h-16 flex items-center px-6 border-b">
          <h1 className="text-xl font-bold text-blue-600">Mozza Aquatic</h1>
        </div>

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
  );
}
