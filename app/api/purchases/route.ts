import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const purchases = await prisma.purchase.findMany({
      orderBy: { id: "desc" },
      include: {
        purchaseItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: purchases });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal ambil data" },
      { status: 500 },
    );
  }
}

interface PurchaseItemInput {
  productId: number | string;
  qty: number | string;
  buyPrice: number | string;
  expiredDate?: string | null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      supplierName,
      supplierPhone,
      notes,
      totalAmount,
      discount,
      finalAmount,
      paymentStatus,
      paidAmount,
      dueAmount,
      items,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Items harus diisi" },
        { status: 400 },
      );
    }

    const newPurchase = await prisma.purchase.create({
      data: {
        supplierName,
        supplierPhone,
        notes,
        totalAmount: parseInt(totalAmount) || 0,
        discount: parseInt(discount) || 0,
        finalAmount: parseInt(finalAmount) || 0,
        paymentStatus: paymentStatus || "Lunas",
        paidAmount: parseInt(paidAmount) || 0,
        dueAmount: parseInt(dueAmount) || 0,

        purchaseItems: {
          create: items.map((item: PurchaseItemInput) => ({
            productId: parseInt(item.productId.toString()),
            initialStock: parseInt(item.qty.toString()),
            remainingStock: parseInt(item.qty.toString()),
            buyPrice: parseInt(item.buyPrice.toString()),
            expiredDate: item.expiredDate ? new Date(item.expiredDate) : null,
          })),
        },
      },
      include: {
        purchaseItems: true,
      },
    });

    return NextResponse.json({ success: true, data: newPurchase });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal buat pembelian" },
      { status: 500 },
    );
  }
}
