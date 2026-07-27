import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;
    const logId = Number(resolvedParams.id);

    await prisma.$transaction(async (tx) => {
      const log = await tx.damageLog.findUnique({
        where: { id: logId },
      });

      if (!log) throw new Error("Data log tidak ditemukan");
      if (log.status === "Diperbaiki")
        throw new Error("Barang ini sudah berstatus diperbaiki");

      const lastPurchase = await tx.purchaseItem.findFirst({
        where: { productId: log.productId },
        orderBy: { createdAt: "desc" },
      });

      if (lastPurchase) {
        await tx.purchaseItem.update({
          where: { id: lastPurchase.id },
          data: { remainingStock: lastPurchase.remainingStock + log.quantity },
        });
      }

      if (log.expenseId) {
        await tx.expense.delete({
          where: { id: log.expenseId },
        });
      }

      await tx.damageLog.update({
        where: { id: log.id },
        data: { status: "Diperbaiki" },
      });
    });

    return NextResponse.json(
      {
        message:
          "Barang berhasil diperbaiki, stok dan laba telah dikembalikan.",
      },
      { status: 200 },
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Gagal memperbarui status";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;
    const logId = Number(resolvedParams.id);

    await prisma.$transaction(async (tx) => {
      const log = await tx.damageLog.findUnique({
        where: { id: logId },
      });

      if (!log) throw new Error("Data log tidak ditemukan");

      if (log.status === "Rusak") {
        const lastPurchase = await tx.purchaseItem.findFirst({
          where: { productId: log.productId },
          orderBy: { createdAt: "desc" },
        });

        if (lastPurchase) {
          await tx.purchaseItem.update({
            where: { id: lastPurchase.id },
            data: {
              remainingStock: lastPurchase.remainingStock + log.quantity,
            },
          });
        }

        if (log.expenseId) {
          await tx.expense.delete({
            where: { id: log.expenseId },
          });
        }
      }

      await tx.damageLog.delete({
        where: { id: log.id },
      });
    });

    return NextResponse.json(
      { message: "Data laporan kerusakan berhasil dibatalkan (dihapus)." },
      { status: 200 },
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Gagal menghapus log";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
