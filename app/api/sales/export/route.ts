import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        saleItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    let csvContent =
      "ID Transaksi,Tanggal,Pelanggan,Total Belanja,Status Pembayaran,Catatan,Daftar Item\n";

    sales.forEach((sale) => {
      const dateStr = new Date(sale.createdAt).toLocaleString("id-ID");
      const customer = sale.customerName || "Umum";
      const notes = sale.notes ? sale.notes.replace(/,/g, " ") : "-";

      const itemsList = sale.saleItems
        .map((i) => `${i.product.name} (${i.quantity}x)`)
        .join(" | ");

      const row = [
        `"${sale.invoiceNumber}"`,
        `"${dateStr}"`,
        `"${customer}"`,
        sale.finalAmount,
        `"${sale.paymentStatus}"`,
        `"${notes}"`,
        `"${itemsList}"`,
      ].join(",");

      csvContent += row + "\n";
    });

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="laporan-penjualan-mozza-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error) {
    console.error("Gagal export data:", error);
    return NextResponse.json(
      { error: "Gagal mendownload laporan" },
      { status: 500 },
    );
  }
}
