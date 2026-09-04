import React from "react";
import AppSidebar from "@/components/AppSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#F3F4F6] overflow-hidden print:h-auto print:bg-white text-gray-900">
      <AppSidebar />

      <main className="flex-1 overflow-y-auto print:overflow-visible bg-[#F3F4F6]">
        {children}
      </main>
    </div>
  );
}
