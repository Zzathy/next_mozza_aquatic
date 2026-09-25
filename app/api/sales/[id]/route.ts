import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;
    const saleId = Number(resolvedParams.id);
    const body = await req.json().catch(() => ({}));
    const amountToPay = body.amount !== undefined ? Number(body.amount) : null;

    const sale = await prisma.sale.findUnique({
      where: { id: saleId },
    });

    if (!sale) {
      return NextResponse.json(
        { error: "Nota tidak ditemukan" },
        { status: 404 },
      );
    }

    if (sale.dueAmount <= 0) {
      return NextResponse.json(
        { error: "Nota ini sudah berstatus lunas" },
        { status: 400 },
      );
    }

    const pay =
      amountToPay !== null ? Math.min(amountToPay, sale.dueAmount) : sale.dueAmount;
    const newPaidAmount = sale.paidAmount + pay;
    const newDueAmount = Math.max(0, sale.finalAmount - newPaidAmount);
    const newStatus = newDueAmount === 0 ? "Lunas" : "DP";

    const updatedSale = await prisma.sale.update({
      where: { id: saleId },
      data: {
        paidAmount: newPaidAmount,
        dueAmount: newDueAmount,
        paymentStatus: newStatus,
      },
    });

    return NextResponse.json(
      {
        message: `Pembayaran sebesar Rp ${pay.toLocaleString("id-ID")} berhasil dicatat! Status: ${newStatus}`,
        data: updatedSale,
      },
      { status: 200 },
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Gagal memproses pelunasan nota";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

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
