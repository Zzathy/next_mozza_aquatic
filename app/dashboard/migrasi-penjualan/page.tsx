"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Plus,
  Trash2,
  History,
  Save,
  Sparkles,
  Calendar,
  User,
  FileText,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Boxes,
  HelpCircle,
  Tag,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/toast-context";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  stock?: number;
  category?: Category;
}

interface MigrationItem {
  productId: string;
  quantity: number | string;
  buyPrice: number | string;
  sellPrice: number | string;
  isPackage?: boolean;
}

interface RecentMigrationSale {
  id: number;
  invoiceNumber: string;
  customerName: string | null;
  finalAmount: number;
  createdAt: string;
  saleItems: {
    quantity: number;
    product: { name: string };
  }[];
}

export default function SalesMigrationPage() {
  const { success, error: showError } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [recentMigrations, setRecentMigrations] = useState<RecentMigrationSale[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingRecent, setIsFetchingRecent] = useState(false);

  // Form State
  const [transactionDate, setTransactionDate] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [notes, setNotes] = useState("Input data Historis (Buku Kas Lama)");

  const [items, setItems] = useState<MigrationItem[]>([
    { productId: "", quantity: 1, buyPrice: "", sellPrice: "", isPackage: false },
  ]);

  const loadRecentMigrations = useCallback(async () => {
    setIsFetchingRecent(true);
    try {
      const res = await fetch("/api/sales?search=MIG-S");
      if (res.ok) {
        const json = await res.json();
        setRecentMigrations((json.data || []).slice(0, 5));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetchingRecent(false);
    }
  }, []);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((json) => {
        if (json.data) setProducts(json.data);
      })
      .catch(console.error);

    loadRecentMigrations();
  }, [loadRecentMigrations]);

  // Quick Date Helpers
  const setQuickDate = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    const dateStr = d.toISOString().split("T")[0];
    setTransactionDate(dateStr);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      { productId: "", quantity: 1, buyPrice: "", sellPrice: "", isPackage: false },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(
      newItems.length > 0
        ? newItems
        : [{ productId: "", quantity: 1, buyPrice: "", sellPrice: "", isPackage: false }],
    );
  };

  const handleProductSelect = (index: number, productId: string) => {
    const selectedProd = products.find((p) => String(p.id) === productId);
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      productId,
      // Auto-fill harga jual dari master data jika belum diisi
      sellPrice: selectedProd ? selectedProd.price : newItems[index].sellPrice,
      // Kosongkan modal agar placeholder cerdas x2 / x3 muncul sebagai panduan
      buyPrice: newItems[index].buyPrice || "",
    };
    setItems(newItems);
  };

  const handleTogglePackage = (index: number) => {
    const newItems = [...items];
    const current = newItems[index];
    newItems[index] = { ...current, isPackage: !current.isPackage };
    setItems(newItems);
  };

  const handleItemChange = (
    index: number,
    field: keyof MigrationItem,
    value: string | number,
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  // Helper untuk deteksi kategori dan estimasi x2 / x3
  const getProductCategoryInfo = useCallback(
    (productId: string) => {
      const prod = products.find((p) => String(p.id) === productId);
      const catName = (prod?.category?.name || "").toLowerCase();
      const isLiving =
        catName.includes("ikan") ||
        catName.includes("tanaman") ||
        catName.includes("fish") ||
        catName.includes("plant");

      return {
        prod,
        catName: prod?.category?.name || "Umum",
        isLiving,
        defaultRatio: isLiving ? "x3" : "x2",
      };
    },
    [products],
  );

  const calculateRowEstimates = useCallback(
    (item: MigrationItem) => {
      const { isLiving } = getProductCategoryInfo(item.productId);
      const sell = Number(item.sellPrice) || 0;
      if (sell <= 0) {
        return {
          x2: 0,
          x3: 0,
          recommended: 0,
          ratio: isLiving ? "x3" : "x2",
        };
      }

      // Pembulatan cerdas: kelipatan 500 / 1000 / 5000 terdekat
      const roundSmart = (val: number) => {
        if (val <= 10000) return Math.round(val / 500) * 500;
        if (val <= 35000) return Math.round(val / 500) * 500;
        if (val <= 80000) return Math.round(val / 1000) * 1000;
        return Math.round(val / 5000) * 5000;
      };

      const x2 = roundSmart(sell / 2);
      const x3 = roundSmart(sell / 3);
      const recommended = isLiving ? x3 : x2;

      return {
        x2,
        x3,
        recommended,
        ratio: isLiving ? "x3" : "x2",
      };
    },
    [getProductCategoryInfo],
  );

  // Live Batch Calculation
  const metrics = useMemo(() => {
    let totalRevenue = 0;
    let totalCost = 0;
    let totalQty = 0;

    items.forEach((item) => {
      const qty = Math.max(1, Number(item.quantity) || 1);
      const sell = Number(item.sellPrice) || 0;
      const { recommended } = calculateRowEstimates(item);
      const buy =
        item.buyPrice !== "" && item.buyPrice !== undefined
          ? Number(item.buyPrice)
          : recommended;

      totalQty += qty;

      if (item.isPackage) {
        totalRevenue += sell;
        totalCost += buy;
      } else {
        totalRevenue += sell * qty;
        totalCost += buy * qty;
      }
    });

    const grossProfit = totalRevenue - totalCost;
    const marginPercent =
      totalRevenue > 0 ? Math.round((grossProfit / totalRevenue) * 100) : 0;

    return {
      totalQty,
      totalRevenue,
      totalCost,
      grossProfit,
      marginPercent,
    };
  }, [items, calculateRowEstimates]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionDate) {
      showError("Pilih tanggal transaksi lama terlebih dahulu!");
      return;
    }
    if (items.some((item) => !item.productId)) {
      showError("Pastikan semua baris sudah dipilih nama produknya!");
      return;
    }

    setIsLoading(true);
    try {
      const payloadItems = items.map((item) => {
        const qty = Math.max(1, Number(item.quantity) || 1);
        const sell = Number(item.sellPrice) || 0;
        const { recommended } = calculateRowEstimates(item);
        const buy =
          item.buyPrice !== "" && item.buyPrice !== undefined
            ? Number(item.buyPrice)
            : recommended;

        if (item.isPackage) {
          return {
            productId: Number(item.productId),
            quantity: qty,
            sellPrice: Math.round(sell / qty),
            buyPrice: Math.round(buy / qty),
            subTotal: sell,
            totalCost: buy,
          };
        }

        return {
          productId: Number(item.productId),
          quantity: qty,
          sellPrice: sell,
          buyPrice: buy,
          subTotal: sell * qty,
          totalCost: buy * qty,
        };
      });

      const res = await fetch("/api/sales-migration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionDate,
          customerName,
          notes,
          items: payloadItems,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal melakukan migrasi data");

      success("Batch transaksi masa lalu berhasil direkam ke Laporan Laba Rugi!");

      // Reset form
      setCustomerName("");
      setNotes("Input data Historis (Buku Kas Lama)");
      setItems([{ productId: "", quantity: 1, buyPrice: "", sellPrice: "", isPackage: false }]);
      loadRecentMigrations();
    } catch (error: unknown) {
      if (error instanceof Error) showError(error.message);
      else showError("Gagal memproses migrasi data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-5 sm:space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
              <History className="w-3.5 h-3.5" />
              Time Machine Studio
            </span>
            <span className="text-xs text-gray-500">
              Sistem Input Batch Nota Historis
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">
            Migrasi Penjualan Masa Lalu
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Input nota fisik lampau. Dilengkapi asisten estimasi modal x2 & x3, opsi paket promo, dan kalkulasi laba instan per nota.
          </p>
        </div>

        {/* SECURITY BADGE */}
        <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl px-4 py-2.5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-black text-emerald-950">Stok Fisik Aman 100%</p>
            <p className="text-[11px] text-emerald-700 font-medium">
              Sistem otomatis menyeimbangkan faktur masuk & keluar 0-stock
            </p>
          </div>
        </div>
      </div>

      {/* 2-COLUMN SPLIT STUDIO LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: THE WORKSPACE FORM (8 COLUMNS) */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* CARD 1: INFORMASI WAKTU & PELANGGAN BATCH */}
            <div className="bg-white p-5 rounded-3xl border-2 border-gray-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <h3 className="text-sm font-extrabold text-gray-900">
                    Waktu & Identitas Nota Fisik
                  </h3>
                </div>
                {/* QUICK DATE PILLS */}
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  <span className="text-[11px] font-bold text-gray-400 mr-1">Cepat:</span>
                  {[
                    { label: "Kemarin", days: 1 },
                    { label: "3 Hari lalu", days: 3 },
                    { label: "1 Minggu lalu", days: 7 },
                    { label: "1 Bulan lalu", days: 30 },
                  ].map((chip) => (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() => setQuickDate(chip.days)}
                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-gray-100 hover:bg-purple-50 hover:text-purple-700 text-gray-600 transition-colors"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                    <span>Tanggal Transaksi</span>
                    <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    type="date"
                    value={transactionDate}
                    onChange={(e) => setTransactionDate(e.target.value)}
                    className="h-10 text-sm font-semibold rounded-xl"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-gray-700">
                    Nama Pembeli (Opsional)
                  </Label>
                  <Input
                    type="text"
                    placeholder="Misal: Pelanggan Tetap / Pak Joko"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="h-10 text-sm rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-gray-700">
                    Sumber / Catatan Nota
                  </Label>
                  <Input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Contoh: Buku Kas Bon No. 42"
                    className="h-10 text-sm rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* CARD 2: TABEL BARANG DENGAN HELPER X2 & X3 SERTA MODE PAKET */}
            <div className="bg-white rounded-3xl border-2 border-gray-200/90 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50/80 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
                    <Boxes className="w-3.5 h-3.5 text-purple-600" />
                    Daftar Barang dalam Nota Fisik
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Pilih produk, tentukan harga jual, dan gunakan panduan modal x2 / x3
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-bold flex items-center gap-1.5 transition-colors border border-purple-200"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah Baris
                </button>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50/50">
                    <TableRow>
                      <TableHead className="py-2.5 px-3 text-xs font-bold text-gray-700 w-[30%]">
                        Produk & Kategori
                      </TableHead>
                      <TableHead className="py-2.5 px-3 text-xs font-bold text-gray-700 w-[12%] text-center">
                        Qty
                      </TableHead>
                      <TableHead className="py-2.5 px-3 text-xs font-bold text-gray-700 w-[26%] text-right">
                        Harga Jual (Rp)
                      </TableHead>
                      <TableHead className="py-2.5 px-3 text-xs font-bold text-gray-700 w-[27%] text-right">
                        Modal Beli / HPP (Rp)
                      </TableHead>
                      <TableHead className="py-2.5 px-3 text-xs font-bold text-gray-700 text-center w-[5%]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, index) => {
                      const { catName, isLiving, defaultRatio } = getProductCategoryInfo(item.productId);
                      const currentSell = Number(item.sellPrice) || 0;
                      const estimates = calculateRowEstimates(item);

                      const buyValue =
                        item.buyPrice !== "" && item.buyPrice !== undefined
                          ? Number(item.buyPrice)
                          : estimates.recommended;

                      const rowQty = Math.max(1, Number(item.quantity) || 1);
                      const rowRevenue = item.isPackage ? currentSell : currentSell * rowQty;
                      const rowCost = item.isPackage ? buyValue : buyValue * rowQty;
                      const rowProfit = rowRevenue - rowCost;
                      const rowMargin =
                        rowRevenue > 0 ? Math.round((rowProfit / rowRevenue) * 100) : 0;

                      return (
                        <TableRow
                          key={index}
                          className="border-b border-gray-100 hover:bg-purple-50/20"
                        >
                          {/* 1. PRODUK & KATEGORI + TOGGLE PAKET */}
                          <TableCell className="p-2.5 align-top">
                            <Select
                              value={item.productId}
                              onValueChange={(val) => handleProductSelect(index, val || "")}
                              required
                            >
                              <SelectTrigger className="h-9 text-xs rounded-xl font-medium w-full">
                                <SelectValue placeholder="Pilih Produk..." />
                              </SelectTrigger>
                              <SelectContent>
                                {products.map((p) => (
                                  <SelectItem key={p.id} value={String(p.id)}>
                                    {p.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            {item.productId && (
                              <div className="flex items-center justify-between mt-1.5 gap-1.5 flex-wrap">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 border border-gray-200 truncate max-w-[120px]">
                                  {catName}
                                </span>

                                <button
                                  type="button"
                                  onClick={() => handleTogglePackage(index)}
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition-all border ${
                                    item.isPackage
                                      ? "bg-amber-100 text-amber-900 border-amber-300 font-extrabold shadow-2xs"
                                      : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                                  }`}
                                  title="Klik jika item ini dijual paketan/borongan (misal: 3 ekor Rp 10.000)"
                                >
                                  {item.isPackage ? "📦 Mode Paket" : "🏷️ Satuan"}
                                </button>
                              </div>
                            )}
                          </TableCell>

                          {/* 2. QTY */}
                          <TableCell className="p-2.5 align-top">
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                handleItemChange(index, "quantity", e.target.value)
                              }
                              className="h-9 text-xs font-mono font-bold text-center rounded-xl"
                              required
                            />
                            {item.isPackage && (
                              <span className="text-[9px] font-bold text-amber-700 block text-center mt-1">
                                Isi Paket
                              </span>
                            )}
                          </TableCell>

                          {/* 3. HARGA JUAL */}
                          <TableCell className="p-2.5 align-top">
                            <Input
                              type="number"
                              min="0"
                              placeholder={
                                item.isPackage ? "Total Jual Nota" : "Harga Jual Satuan"
                              }
                              value={item.sellPrice}
                              onChange={(e) =>
                                handleItemChange(index, "sellPrice", e.target.value)
                              }
                              className="h-9 text-xs font-mono font-bold text-right rounded-xl"
                              required
                            />
                            <div className="mt-1 text-[10px] font-bold text-gray-400 text-right">
                              {item.isPackage ? (
                                <span className="text-amber-700">
                                  Total {rowQty} pcs: Rp {currentSell.toLocaleString("id-ID")}
                                </span>
                              ) : (
                                <span>
                                  Subtotal: Rp {rowRevenue.toLocaleString("id-ID")}
                                </span>
                              )}
                            </div>
                          </TableCell>

                          {/* 4. MODAL BELI (HPP) DENGAN PANDUAN X2 & X3 */}
                          <TableCell className="p-2.5 align-top">
                            <Input
                              type="number"
                              min="0"
                              placeholder={
                                currentSell > 0
                                  ? `Est: ${estimates.recommended.toLocaleString("id-ID")}`
                                  : "Rp Modal"
                              }
                              value={item.buyPrice}
                              onChange={(e) =>
                                handleItemChange(index, "buyPrice", e.target.value)
                              }
                              className="h-9 text-xs font-mono font-bold text-right rounded-xl"
                            />

                            {/* QUICK HELPER CHIPS X2 & X3 */}
                            {currentSell > 0 && (
                              <div className="flex items-center justify-end gap-1 mt-1.5 flex-wrap">
                                <span className="text-[10px] font-bold text-gray-400 mr-0.5">
                                  Pilih:
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleItemChange(index, "buyPrice", estimates.x2)}
                                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold border transition-colors ${
                                    Number(item.buyPrice) === estimates.x2
                                      ? "bg-purple-600 text-white border-purple-600 shadow-2xs"
                                      : "bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-700 border-gray-200"
                                  }`}
                                  title="Modal x2 (Harga jual dibagi 2, dibulatkan)"
                                >
                                  x2: {estimates.x2.toLocaleString("id-ID")}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleItemChange(index, "buyPrice", estimates.x3)}
                                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold border transition-colors ${
                                    Number(item.buyPrice) === estimates.x3
                                      ? "bg-purple-600 text-white border-purple-600 shadow-2xs"
                                      : "bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-700 border-gray-200"
                                  }`}
                                  title="Modal x3 (Harga jual dibagi 3, dibulatkan)"
                                >
                                  x3: {estimates.x3.toLocaleString("id-ID")}
                                </button>
                              </div>
                            )}

                            {/* PROFIT INDICATOR */}
                            {currentSell > 0 && (
                              <div className="mt-1 text-[10px] font-bold text-emerald-600 flex items-center justify-end gap-1">
                                <span>
                                  Untung: +Rp {rowProfit.toLocaleString("id-ID")} ({rowMargin}%)
                                </span>
                              </div>
                            )}
                          </TableCell>

                          {/* 5. AKSI HAPUS BARIS */}
                          <TableCell className="p-2.5 text-center align-top">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(index)}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                              title="Hapus Baris"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* BATCH CALCULATION SUMMARY FOOTER (ITUNG-ITUNGAN SATU NOTA) */}
              <div className="p-4 border-t border-gray-200 bg-gray-50/90 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-3 rounded-2xl border border-gray-200/80 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                    Total Omset Nota
                  </span>
                  <span className="text-base sm:text-lg font-black font-mono text-gray-950 block mt-0.5">
                    Rp {metrics.totalRevenue.toLocaleString("id-ID")}
                  </span>
                  <span className="text-[10px] text-gray-500 font-semibold">
                    {metrics.totalQty} pcs barang
                  </span>
                </div>

                <div className="bg-white p-3 rounded-2xl border border-gray-200/80 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                    Total Modal (HPP)
                  </span>
                  <span className="text-base sm:text-lg font-black font-mono text-gray-700 block mt-0.5">
                    Rp {metrics.totalCost.toLocaleString("id-ID")}
                  </span>
                  <span className="text-[10px] text-gray-500 font-semibold">
                    Estimasi modal masuk
                  </span>
                </div>

                <div className="bg-white p-3 rounded-2xl border border-gray-200/80 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                    Laba Kotor Nota
                  </span>
                  <span className="text-base sm:text-lg font-black font-mono text-emerald-600 block mt-0.5">
                    +Rp {metrics.grossProfit.toLocaleString("id-ID")}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold">
                    Omset - Modal
                  </span>
                </div>

                <div className="bg-white p-3 rounded-2xl border border-gray-200/80 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 block">
                    Margin Keuntungan
                  </span>
                  <span className="text-base sm:text-lg font-black font-mono text-purple-600 block mt-0.5">
                    {metrics.marginPercent}% Untung
                  </span>
                  <span className="text-[10px] text-purple-700 font-semibold">
                    Rasio keuntungan batch
                  </span>
                </div>
              </div>

              {/* ACTION FOOTER */}
              <div className="p-4 border-t border-gray-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>
                    Batch siap disimpan: {items.length} macam produk ({metrics.totalQty} pcs)
                  </span>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !transactionDate}
                  className="w-full sm:w-auto h-11 px-7 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-md shadow-purple-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4 stroke-[2.5]" />
                  <span>
                    {isLoading ? "Menyimpan ke Laba Rugi..." : "Simpan Batch Nota Ini"}
                  </span>
                </Button>
              </div>
            </div>
          </form>

          {/* CARD 3: RECENT MIGRATIONS HISTORY */}
          <div className="bg-white rounded-3xl border-2 border-gray-200/90 shadow-xs p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                <History className="w-3.5 h-3.5 text-purple-600" />
                5 Transaksi Migrasi Terakhir
              </h3>
              <button
                onClick={loadRecentMigrations}
                className="text-xs text-purple-600 font-bold hover:text-purple-700"
              >
                Segarkan
              </button>
            </div>

            {isFetchingRecent ? (
              <p className="text-xs text-gray-400 py-3 text-center">Memuat riwayat migrasi...</p>
            ) : recentMigrations.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {recentMigrations.map((m) => (
                  <div
                    key={m.id}
                    className="py-2.5 flex items-center justify-between text-xs hover:bg-gray-50/80 px-2 rounded-xl"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-purple-600">
                          {m.invoiceNumber}
                        </span>
                        <span className="text-gray-700 font-semibold">
                          {m.customerName || "Pelanggan Umum"}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {new Date(m.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}{" "}
                        • {m.saleItems.length} jenis produk
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-black text-gray-900">
                        Rp {m.finalAmount.toLocaleString("id-ID")}
                      </p>
                      <span className="text-[10px] font-bold text-emerald-600">
                        Tercatat
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 py-3 text-center">
                Belum ada data migrasi yang tersimpan.
              </p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE TIME-MACHINE CALCULATION & RECEIPT PREVIEW (4 COLUMNS) */}
        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-6">
          {/* SIMULASI LABA RUGI NOTA */}
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 text-white p-6 rounded-3xl shadow-xl border border-neutral-800 space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" /> Live Impact
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800/60">
                Kalkulasi Otomatis
              </span>
            </div>

            <div className="space-y-3">
              {/* OMSET */}
              <div>
                <p className="text-xs font-semibold text-neutral-400">Total Omset Nota Ini</p>
                <div className="text-2xl font-black font-mono text-white mt-0.5">
                  Rp {metrics.totalRevenue.toLocaleString("id-ID")}
                </div>
              </div>

              {/* MODAL HPP */}
              <div className="flex justify-between items-center text-xs pt-1 border-t border-neutral-800 text-neutral-400">
                <span>Total Modal (HPP):</span>
                <span className="font-mono font-bold text-neutral-200">
                  Rp {metrics.totalCost.toLocaleString("id-ID")}
                </span>
              </div>

              {/* ESTIMASI LABA KOTOR */}
              <div className="p-3.5 rounded-2xl bg-neutral-800/60 border border-neutral-700/60 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">
                    Estimasi Laba Kotor
                  </p>
                  <p className="text-lg font-black font-mono text-emerald-400">
                    +Rp {metrics.grossProfit.toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 rounded-xl bg-emerald-950 border border-emerald-800/60 text-emerald-400 font-extrabold text-xs font-mono">
                    {metrics.marginPercent}% Margin
                  </span>
                </div>
              </div>
            </div>

            {/* MEKANISME WIDGET */}
            <div className="pt-2 border-t border-neutral-800 text-neutral-400 text-xs space-y-2">
              <p className="font-bold text-neutral-300 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
                Panduan Cepat Time Machine:
              </p>
              <ul className="space-y-1.5 text-[11px] text-neutral-400 leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Barang / Alat</strong>: Klik chip <code>x2</code> untuk modal setengah harga jual.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Ikan / Tanaman</strong>: Klik chip <code>x3</code> untuk modal sepertiga harga jual.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Promo Paket</strong>: Aktifkan <code>📦 Mode Paket</code> jika jual rombongan (misal: 3 ekor Rp 10k).
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
