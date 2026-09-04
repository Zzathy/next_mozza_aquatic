"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MonitorSmartphone,
  FileText,
  LayoutDashboard,
  Grid,
} from "lucide-react";

interface MobileBottomNavProps {
  onOpenMenu: () => void;
}

export default function MobileBottomNav({ onOpenMenu }: MobileBottomNavProps) {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Kasir",
      href: "/dashboard/kasir",
      icon: MonitorSmartphone,
    },
    {
      name: "Penjualan",
      href: "/dashboard/penjualan",
      icon: FileText,
    },
    {
      name: "Ringkasan",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-200/90 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgba(0,0,0,0.06)] print:hidden">
      <div className="grid grid-cols-4 h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 transition-all active:scale-90 select-none ${
                isActive ? "text-[#2563EB]" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? "bg-blue-50 text-[#2563EB]" : ""
                }`}
              >
                <Icon className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span
                className={`text-[11px] tracking-tight ${
                  isActive ? "font-black text-[#2563EB]" : "font-semibold text-gray-500"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}

        {/* TOMBOL MENU DRAWER */}
        <button
          type="button"
          onClick={onOpenMenu}
          className="flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-gray-600 transition-all active:scale-90 select-none"
        >
          <div className="p-1 rounded-xl">
            <Grid className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[11px] font-semibold text-gray-500 tracking-tight">
            Menu Lain
          </span>
        </button>
      </div>
    </div>
  );
}
