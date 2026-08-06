import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const expenses = await prisma.expense.findMany({
      where: {
        OR: [
          { category: { contains: search } },
          { description: { contains: search } },
        ],
      },
      orderBy: {
        transactionDate: "desc",
      },
    });

    return NextResponse.json({ data: expenses }, { status: 200 });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Gagal mengambil data pengeluaran";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { category, amount, description, transactionDate } = body;

    if (!category || amount === undefined) {
      return NextResponse.json(
        { error: "Kategori dan nominal wajib diisi" },
        { status: 400 },
      );
    }

    const expense = await prisma.expense.create({
      data: {
        category,
        amount: Number(amount),
        description,
        transactionDate: transactionDate
          ? new Date(transactionDate)
          : new Date(),
      },
    });

    return NextResponse.json(
      { message: "Pengeluaran berhasil dicatat", data: expense },
      { status: 201 },
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Gagal menyimpan pengeluaran";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
