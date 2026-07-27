import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const logs = await prisma.damageLog.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        product: { select: { name: true } },
        expense: { select: { amount: true, description: true } },
      },
    });
    return NextResponse.json({ data: logs }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data log kerusakan" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, quantity, notes } = body;
    const qtyToDeduct = Number(quantity);

    if (!productId || qtyToDeduct <= 0) {
      return NextResponse.json(
        { error: "Produk dan jumlah tidak valid" },
        { status: 400 },
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const availableStocks = await tx.purchaseItem.findMany({
        where: { productId: Number(productId), remainingStock: { gt: 0 } },
        orderBy: { createdAt: "asc" },
      });

      let remainingToDeduct = qtyToDeduct;
      let totalLossCost = 0;

      for (const stock of availableStocks) {
        if (remainingToDeduct <= 0) break;

        const deductedFromThisBatch = Math.min(
          stock.remainingStock,
          remainingToDeduct,
        );

        await tx.purchaseItem.update({
          where: { id: stock.id },
          data: {
            remainingStock: stock.remainingStock - deductedFromThisBatch,
          },
        });

        totalLossCost += deductedFromThisBatch * stock.buyPrice;
        remainingToDeduct -= deductedFromThisBatch;
      }

      if (remainingToDeduct > 0) {
        throw new Error(
          "Stok tidak cukup untuk dipotong sebagai barang rusak/mati",
        );
      }

      const expense = await tx.expense.create({
        data: {
          type: "Pengeluaran",
          category: "Kerugian Stok",
          amount: totalLossCost,
          description: `Kerugian Stok: ${notes || "Barang Rusak/Mati"}`,
          transactionDate: new Date(),
        },
      });

      const damageLog = await tx.damageLog.create({
        data: {
          productId: Number(productId),
          quantity: qtyToDeduct,
          status: "RUSAK",
          totalCost: totalLossCost,
          notes: notes || null,
          expenseId: expense.id,
        },
      });

      return damageLog;
    });

    return NextResponse.json(
      {
        message: "Barang rusak berhasil dicatat dan masuk ke pengeluaran",
        data: result,
      },
      { status: 201 },
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Terjadi kesalahan";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
