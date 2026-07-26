import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const sales = await prisma.sale.findMany({
      where: {
        OR: [
          { invoiceNumber: { contains: search } },
          { customerName: { contains: search } },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        saleItems: {
          include: {
            product: {
              select: { name: true, isService: true },
            },
          },
        },
      },
    });

    return NextResponse.json({ data: sales }, { status: 200 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Terjadi kesalahan pada server";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerPhone,
      notes,
      discount = 0,
      paidAmount = 0,
      items,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Item keranjang tidak boleh kosong" },
        { status: 400 },
      );
    }

    const date = new Date();
    const dateString = date.toISOString().slice(0, 10).replace(/-/g, "");
    const saleCountToday = await prisma.sale.count({
      where: { invoiceNumber: { startsWith: `INV-${dateString}` } },
    });
    const invoiceNumber = `INV-${dateString}-${String(saleCountToday + 1).padStart(4, "0")}`;

    let subTotal = 0;
    for (const item of items) {
      subTotal += item.quantity * item.price;
    }
    const finalAmount = subTotal - discount;

    let actualPaidAmount = paidAmount;
    let dueAmount = finalAmount - actualPaidAmount;

    if (dueAmount < 0) {
      actualPaidAmount = finalAmount;
      dueAmount = 0;
    }

    let paymentStatus = "Lunas";
    if (dueAmount > 0) {
      paymentStatus = actualPaidAmount > 0 ? "DP" : "Belum Bayar";
    }

    const result = await prisma.$transaction(async (tx) => {
      const sale = await tx.sale.create({
        data: {
          invoiceNumber,
          customerName,
          customerPhone,
          notes,
          totalAmount: subTotal,
          discount,
          finalAmount,
          paidAmount,
          dueAmount,
          paymentStatus,
        },
      });

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(
            `Produk dengan ID ${item.productId} tidak ditemukan.`,
          );
        }

        let itemCostPrice = 0;

        if (!product.isService) {
          const availablePurchases = await tx.purchaseItem.findMany({
            where: {
              productId: item.productId,
              remainingStock: { gt: 0 },
            },
            orderBy: { createdAt: "asc" },
          });

          const totalAvailableStock = availablePurchases.reduce(
            (sum, p) => sum + p.remainingStock,
            0,
          );
          if (totalAvailableStock < item.quantity) {
            throw new Error(
              `Stok ${product.name} tidak cukup! (Diminta: ${item.quantity}, Tersedia: ${totalAvailableStock})`,
            );
          }

          let remainingToFulfill = item.quantity;
          let totalCost = 0;

          for (const purchase of availablePurchases) {
            if (remainingToFulfill <= 0) break;

            const qtyToTake = Math.min(
              remainingToFulfill,
              purchase.remainingStock,
            );

            await tx.purchaseItem.update({
              where: { id: purchase.id },
              data: { remainingStock: purchase.remainingStock - qtyToTake },
            });

            totalCost += qtyToTake * purchase.buyPrice;
            remainingToFulfill -= qtyToTake;
          }

          itemCostPrice = Math.round(totalCost / item.quantity);
        }

        await tx.saleItem.create({
          data: {
            saleId: sale.id,
            productId: item.productId,
            quantity: item.quantity,
            costPrice: itemCostPrice,
            unitPrice: item.price,
            subTotal: item.quantity * item.price,
          },
        });
      }

      return sale;
    });

    return NextResponse.json(
      { message: "Transaksi kasir berhasil disimpan", data: result },
      { status: 201 },
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan saat menyimpan transaksi";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
