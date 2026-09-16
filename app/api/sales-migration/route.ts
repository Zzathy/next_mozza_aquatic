import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface MigrationItem {
  productId: number;
  quantity: number;
  buyPrice: number;
  sellPrice: number;
  subTotal?: number;
  totalCost?: number;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { transactionDate, customerName, notes, items } = body;

    if (!transactionDate || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Data migrasi tidak lengkap" },
        { status: 400 },
      );
    }

    const pastDate = new Date(transactionDate);

    let totalPurchaseCost = 0;
    let totalSaleAmount = 0;

    items.forEach((item: MigrationItem) => {
      const itemSaleTotal = item.subTotal !== undefined ? Number(item.subTotal) : Number(item.sellPrice) * Number(item.quantity);
      const itemCostTotal = item.totalCost !== undefined ? Number(item.totalCost) : Number(item.buyPrice) * Number(item.quantity);
      totalPurchaseCost += itemCostTotal;
      totalSaleAmount += itemSaleTotal;
    });

    const result = await prisma.$transaction(async (tx) => {
      const purchase = await tx.purchase.create({
        data: {
          supplierName: "Migrasi History (Auto)",
          entryDate: pastDate,
          totalAmount: totalPurchaseCost,
          finalAmount: totalPurchaseCost,
          paidAmount: totalPurchaseCost,
          paymentStatus: "Lunas",
          createdAt: pastDate,
        },
      });

      const purchaseItemsData = items.map((item: MigrationItem) => ({
        purchaseId: purchase.id,
        productId: item.productId,
        initialStock: item.quantity,
        remainingStock: 0,
        buyPrice: item.buyPrice,
        createdAt: pastDate,
      }));

      await tx.purchaseItem.createMany({ data: purchaseItemsData });

      const sale = await tx.sale.create({
        data: {
          invoiceNumber: `MIG-S-${Date.now()}`,
          customerName: customerName || "Pelanggan Migrasi",
          totalAmount: totalSaleAmount,
          finalAmount: totalSaleAmount,
          paidAmount: totalSaleAmount,
          paymentStatus: "Lunas",
          notes: notes || "Input Data Historis",
          createdAt: pastDate,
        },
      });

      // 5. SALE ITEM
      const saleItemsData = items.map((item: MigrationItem) => {
        const itemSubTotal = item.subTotal !== undefined ? Number(item.subTotal) : Number(item.sellPrice) * Number(item.quantity);
        return {
          saleId: sale.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.sellPrice,
          costPrice: item.buyPrice,
          subTotal: itemSubTotal,
        };
      });

      await tx.saleItem.createMany({ data: saleItemsData });

      return { purchase, sale };
    });

    return NextResponse.json(
      {
        message: "Data historis berhasil dimigrasi (Purchase & Sale selesai)",
        data: result,
      },
      { status: 201 },
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
