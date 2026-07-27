import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const now = new Date();
    const year = searchParams.get("year")
      ? Number(searchParams.get("year"))
      : now.getFullYear();
    const month = searchParams.get("month")
      ? Number(searchParams.get("month")) - 1
      : now.getMonth();

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);

    const sales = await prisma.sale.findMany({
      where: { createdAt: { gte: startDate, lte: endDate } },
      select: { id: true, createdAt: true, finalAmount: true },
    });

    const totalOmset = sales.reduce((sum, sale) => sum + sale.finalAmount, 0);
    const totalTransaksi = sales.length;

    const expenses = await prisma.expense.aggregate({
      where: { transactionDate: { gte: startDate, lte: endDate } },
      _sum: { amount: true },
    });
    const totalPengeluaran = expenses._sum.amount || 0;

    const purchases = await prisma.purchase.aggregate({
      where: { createdAt: { gte: startDate, lte: endDate } },
      _sum: { finalAmount: true },
    });
    const totalBelanjaStok = purchases._sum.finalAmount || 0;

    const saleItems = await prisma.saleItem.findMany({
      where: { sale: { createdAt: { gte: startDate, lte: endDate } } },
      select: {
        quantity: true,
        costPrice: true,
        productId: true,
        subTotal: true,
      },
    });
    const totalModal = saleItems.reduce(
      (acc, item) => acc + item.quantity * item.costPrice,
      0,
    );

    const activeStocks = await prisma.purchaseItem.findMany({
      where: { remainingStock: { gt: 0 } },
      select: { remainingStock: true, buyPrice: true },
    });
    const totalAsetGudang = activeStocks.reduce(
      (acc, item) => acc + item.remainingStock * item.buyPrice,
      0,
    );

    const labaKotor = totalOmset - totalModal;
    const labaBersih = labaKotor - totalPengeluaran;
    const uangMasuk = totalOmset;
    const uangKeluar = totalBelanjaStok + totalPengeluaran;
    const selisihKas = uangMasuk - uangKeluar;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dailyTrend = Array.from({ length: daysInMonth }, (_, i) => ({
      date: `${year}-${String(month + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`,
      omset: 0,
      transaksi: 0,
    }));

    sales.forEach((sale) => {
      const dayIndex = sale.createdAt.getDate() - 1;
      dailyTrend[dayIndex].omset += sale.finalAmount;
      dailyTrend[dayIndex].transaksi += 1;
    });

    const topProductsMap: Record<
      number,
      { quantity: number; revenue: number }
    > = {};
    saleItems.forEach((item) => {
      if (!topProductsMap[item.productId]) {
        topProductsMap[item.productId] = { quantity: 0, revenue: 0 };
      }
      topProductsMap[item.productId].quantity += item.quantity;
      topProductsMap[item.productId].revenue += item.subTotal;
    });

    const productIds = Object.keys(topProductsMap).map(Number);
    const productsData = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true },
    });

    const topSellingProducts = productsData
      .map((p) => ({
        id: p.id,
        name: p.name,
        soldQuantity: topProductsMap[p.id].quantity,
        revenue: topProductsMap[p.id].revenue,
      }))
      .sort((a, b) => b.soldQuantity - a.soldQuantity)
      .slice(0, 5);

    const allPhysicalProducts = await prisma.product.findMany({
      where: { isService: false },
      select: {
        id: true,
        name: true,
        purchaseItems: {
          where: { remainingStock: { gt: 0 } },
          select: { remainingStock: true },
        },
      },
    });

    const lowStockAlerts = allPhysicalProducts
      .map((p) => {
        const totalStock = p.purchaseItems.reduce(
          (sum, item) => sum + item.remainingStock,
          0,
        );
        return { id: p.id, name: p.name, currentStock: totalStock };
      })
      .filter((p) => p.currentStock <= 10)
      .sort((a, b) => a.currentStock - b.currentStock);

    return NextResponse.json(
      {
        data: {
          periode: `${year}-${String(month + 1).padStart(2, "0")}`,
          totalTransaksi,

          labaRugi: {
            totalOmset,
            totalModal,
            totalPengeluaran,
            labaKotor,
            labaBersih,
          },
          arusKas: { uangMasuk, uangKeluar, selisihKas },
          aset: { totalAsetGudang },

          insights: {
            topSellingProducts,
            lowStockAlerts,
          },

          chartData: dailyTrend,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Gagal memuat data dashboard";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
