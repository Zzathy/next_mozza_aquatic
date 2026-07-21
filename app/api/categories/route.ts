import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Impor dari file lib/prisma.ts

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal ambil data" },
      { status: 500 },
    );
  }
}
