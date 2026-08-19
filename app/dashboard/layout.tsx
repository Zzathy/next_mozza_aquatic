import React from "react";
import AppSidebar from "@/components/AppSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden print:h-auto print:bg-white">
      <AppSidebar />

      <main className="flex-1 overflow-y-auto print:overflow-visible">
        {children}
      </main>
    </div>
  );
}
