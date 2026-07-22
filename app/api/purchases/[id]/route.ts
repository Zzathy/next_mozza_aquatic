import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface PurchaseItemInput {
  productId: number | string;
  qty: number | string;
  buyPrice: number | string;
  expiredDate?: string | null;
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
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

    const existingPurchase = await prisma.purchase.findUnique({
      where: { id: parseInt(id) },
      include: {
        purchaseItems: true,
      },
    });

    if (!existingPurchase) {
      return NextResponse.json(
        { success: false, message: "Pembelian tidak ditemukan" },
        { status: 404 },
      );
    }

    const hasSoldItems = existingPurchase.purchaseItems.some(
      (item) => item.initialStock !== item.remainingStock,
    );

    if (items && items.length > 0 && hasSoldItems) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Tidak dapat mengubah items karena beberapa item sudah terjual",
        },
        { status: 400 },
      );
    }

    let updatedPurchase;
    if (items && items.length > 0 && !hasSoldItems) {
      updatedPurchase = await prisma.$transaction(async (tx) => {
        await tx.purchaseItem.deleteMany({
          where: { purchaseId: parseInt(id) },
        });

        return await tx.purchase.update({
          where: { id: parseInt(id) },
          data: {
            supplierName,
            supplierPhone,
            notes,
            totalAmount: parseInt(totalAmount) || existingPurchase.totalAmount,
            discount: parseInt(discount) || existingPurchase.discount,
            finalAmount: parseInt(finalAmount) || existingPurchase.finalAmount,
            paymentStatus: paymentStatus || existingPurchase.paymentStatus,
            paidAmount: parseInt(paidAmount) || existingPurchase.paidAmount,
            dueAmount: parseInt(dueAmount) || existingPurchase.dueAmount,
            purchaseItems: {
              create: items.map((item: PurchaseItemInput) => ({
                productId: parseInt(item.productId.toString()),
                initialStock: parseInt(item.qty.toString()),
                remainingStock: parseInt(item.qty.toString()),
                buyPrice: parseInt(item.buyPrice.toString()),
                expiredDate: item.expiredDate
                  ? new Date(item.expiredDate)
                  : null,
              })),
            },
          },
          include: { purchaseItems: true },
        });
      });
    } else {
      updatedPurchase = await prisma.purchase.update({
        where: { id: parseInt(id) },
        data: {
          supplierName:
            supplierName !== undefined
              ? supplierName
              : existingPurchase.supplierName,
          supplierPhone:
            supplierPhone !== undefined
              ? supplierPhone
              : existingPurchase.supplierPhone,
          notes: notes !== undefined ? notes : existingPurchase.notes,
          totalAmount:
            totalAmount !== undefined
              ? parseInt(totalAmount)
              : existingPurchase.totalAmount,
          discount:
            discount !== undefined
              ? parseInt(discount)
              : existingPurchase.discount,
          finalAmount:
            finalAmount !== undefined
              ? parseInt(finalAmount)
              : existingPurchase.finalAmount,
          paymentStatus:
            paymentStatus !== undefined
              ? paymentStatus
              : existingPurchase.paymentStatus,
          paidAmount:
            paidAmount !== undefined
              ? parseInt(paidAmount)
              : existingPurchase.paidAmount,
          dueAmount:
            dueAmount !== undefined
              ? parseInt(dueAmount)
              : existingPurchase.dueAmount,
        },
      });
    }

    return NextResponse.json({ success: true, data: updatedPurchase });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Gagal update pembelian" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const existingPurchase = await prisma.purchase.findUnique({
      where: { id: parseInt(id) },
      include: {
        purchaseItems: true,
      },
    });

    if (!existingPurchase) {
      return NextResponse.json(
        { success: false, message: "Pembelian tidak ditemukan" },
        { status: 404 },
      );
    }

    const hasSoldItems = existingPurchase.purchaseItems.some(
      (item) => item.initialStock !== item.remainingStock,
    );

    if (hasSoldItems) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Tidak dapat menghapus pembelian karena beberapa item sudah terjual",
        },
        { status: 400 },
      );
    }

    await prisma.$transaction([
      prisma.purchaseItem.deleteMany({ where: { purchaseId: parseInt(id) } }),
      prisma.purchase.delete({ where: { id: parseInt(id) } }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Pembelian berhasil dihapus",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Gagal hapus pembelian" },
      { status: 500 },
    );
  }
}
