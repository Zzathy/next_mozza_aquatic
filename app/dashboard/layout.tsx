"use client";

import React, { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import Image from "next/image";
import { Menu } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F3F4F6] overflow-hidden print:h-auto print:bg-white text-gray-900 relative">
      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:block h-full print:hidden">
        <AppSidebar />
      </div>

      {/* MOBILE DRAWER OVERLAY */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity print:hidden"
        />
      )}

      {/* MOBILE DRAWER SIDEBAR */}
      <div
        className={`fixed top-0 bottom-0 left-0 z-50 transition-transform duration-300 ease-in-out lg:hidden print:hidden ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AppSidebar onCloseMobile={() => setIsMobileOpen(false)} />
      </div>

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* MOBILE TOP BAR */}
        <header className="lg:hidden h-14 bg-white border-b border-gray-200 px-4 flex items-center justify-between shrink-0 print:hidden shadow-xs">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-2 rounded-xl text-gray-700 hover:bg-gray-100 active:scale-95 transition-all"
              title="Buka Menu"
            >
              <Menu className="w-5 h-5 stroke-[2.5]" />
            </button>
            <div className="flex items-center gap-2">
              <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-gray-200 bg-black">
                <Image
                  src="/mozza_logo.png"
                  alt="Mozza Logo"
                  fill
                  sizes="28px"
                  className="object-contain p-0.5"
                />
              </div>
              <span className="font-extrabold text-sm text-gray-900 tracking-tight">
                Mozza Aquatic
              </span>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto print:overflow-visible bg-[#F3F4F6]">
          {children}
        </main>
      </div>
    </div>
  );
}
