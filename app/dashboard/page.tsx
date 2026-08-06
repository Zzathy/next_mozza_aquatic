"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard Mozza Aquatic</h1>
      <p className="mb-8">Welcome!</p>

      <Button
        variant="destructive"
        onClick={() => signOut({ callbackUrl: "/login" })}
      >
        Logout
      </Button>
    </div>
  );
}
