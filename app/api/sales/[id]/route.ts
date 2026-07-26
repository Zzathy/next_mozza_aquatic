import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;
    const saleId = Number(resolvedParams.id);

    await prisma.$transaction(async (tx) => {
      const sale = await tx.sale.findUnique({
        where: { id: saleId },
        include: {
          saleItems: {
            include: { product: true },
          },
        },
      });

      if (!sale) {
        throw new Error("Nota tidak ditemukan.");
      }

      for (const item of sale.saleItems) {
        if (!item.product.isService) {
          const lastPurchase = await tx.purchaseItem.findFirst({
            where: { productId: item.productId },
            orderBy: { createdAt: "desc" },
          });

          if (lastPurchase) {
            await tx.purchaseItem.update({
              where: { id: lastPurchase.id },
              data: {
                remainingStock: lastPurchase.remainingStock + item.quantity,
              },
            });
          }
        }
      }

      await tx.saleItem.deleteMany({
        where: { saleId: sale.id },
      });

      await tx.sale.delete({
        where: { id: sale.id },
      });
    });

    return NextResponse.json(
      { message: "Nota berhasil dibatalkan dan stok telah dikembalikan." },
      { status: 200 },
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan saat menghapus nota";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
