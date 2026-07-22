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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Nama kategori harus diisi" },
        { status: 400 },
      );
    }

    const newCategory = await prisma.category.create({
      data: { name },
    });

    return NextResponse.json({ success: true, data: newCategory });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal buat kategori" },
      { status: 500 },
    );
  }
}
