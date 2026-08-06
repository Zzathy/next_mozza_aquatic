import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;
    const expenseId = Number(resolvedParams.id);

    await prisma.expense.delete({
      where: { id: expenseId },
    });

    return NextResponse.json(
      { message: "Data pengeluaran berhasil dihapus" },
      { status: 200 },
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Gagal menghapus pengeluaran";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
