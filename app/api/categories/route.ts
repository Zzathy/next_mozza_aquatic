import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const newCategory = await prisma.category.create({
      data: { name, slug },
    });

    return NextResponse.json({ success: true, data: newCategory });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal buat kategori" },
      { status: 500 },
    );
  }
}
