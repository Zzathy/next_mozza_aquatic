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
  AlertCircle,
  TrendingUp,
  Wallet,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  Clock,
  Boxes,
  HelpCircle,
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

interface Product {
  id: number;
  name: string;
  price: number;
  stock?: number;
}

interface MigrationItem {
  productId: string;
  quantity: number;
  buyPrice: number;
  sellPrice: number;
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
    { productId: "", quantity: 1, buyPrice: 0, sellPrice: 0 },
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
      { productId: "", quantity: 1, buyPrice: 0, sellPrice: 0 },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems.length > 0 ? newItems : [{ productId: "", quantity: 1, buyPrice: 0, sellPrice: 0 }]);
  };

  const handleProductSelect = (index: number, productId: string) => {
    const selectedProd = products.find((p) => String(p.id) === productId);
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      productId,
      // Auto-fill harga jual dari master data jika ada
      sellPrice: selectedProd ? selectedProd.price : newItems[index].sellPrice,
      // Estimasi modal HPP 70% sebagai default placeholder jika belum diisi
      buyPrice: newItems[index].buyPrice || (selectedProd ? Math.round(selectedProd.price * 0.7) : 0),
    };
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

  // Live Calculations
  const metrics = useMemo(() => {
    let totalRevenue = 0;
    let totalCost = 0;
    let totalQty = 0;

    items.forEach((item) => {
      const qty = Number(item.quantity) || 0;
      const sell = Number(item.sellPrice) || 0;
      const buy = Number(item.buyPrice) || 0;

      totalQty += qty;
      totalRevenue += sell * qty;
      totalCost += buy * qty;
    });

    const grossProfit = totalRevenue - totalCost;
    const marginPercent = totalRevenue > 0 ? Math.round((grossProfit / totalRevenue) * 100) : 0;

    return {
      totalQty,
      totalRevenue,
      totalCost,
      grossProfit,
      marginPercent,
    };
  }, [items]);

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
      const res = await fetch("/api/sales-migration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionDate,
          customerName,
          notes,
          items: items.map((item) => ({
            productId: Number(item.productId),
            quantity: Number(item.quantity),
            buyPrice: Number(item.buyPrice),
            sellPrice: Number(item.sellPrice),
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal melakukan migrasi data");

      success("Transaksi masa lalu berhasil direkam ke Laporan Laba Rugi!");

      // Reset form
      setCustomerName("");
      setNotes("Input data Historis (Buku Kas Lama)");
      setItems([{ productId: "", quantity: 1, buyPrice: 0, sellPrice: 0 }]);
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
              Rekap Pembukuan Buku Kas Manual
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">
            Migrasi Penjualan Masa Lalu
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Catat omset nota masa lalu sebelum sistem ini dibuat. Laba/rugi dan arus kas terhitung akurat tanpa mengganggu stok fisik saat ini.
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
              Sistem menyeimbangkan faktur masuk & keluar 0-stock
            </p>
          </div>
        </div>
      </div>

      {/* 2-COLUMN SPLIT STUDIO LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: THE WORKSPACE FORM (8 COLUMNS) */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* CARD 1: INFORMASI WAKTU & PELANGGAN */}
            <div className="bg-white p-5 rounded-3xl border-2 border-gray-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <h3 className="text-sm font-extrabold text-gray-900">
                    Waktu Transaksi Masa Lalu
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
                    <span>Tanggal Nota</span>
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
                    Catatan Pembukuan
                  </Label>
                  <Input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Sumber buku catatan kas"
                    className="h-10 text-sm rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* CARD 2: TABEL BARANG DENGAN AUTO-FILL & LIVE PROFIT */}
            <div className="bg-white rounded-3xl border-2 border-gray-200/90 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50/80 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
                    <Boxes className="w-3.5 h-3.5 text-purple-600" />
                    Daftar Produk yang Terjual
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Pilih produk untuk otomatis memuat harga jual standar toko
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

              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow>
                    <TableHead className="py-2.5 px-3 text-xs font-bold text-gray-700 w-[34%]">
                      Produk
                    </TableHead>
                    <TableHead className="py-2.5 px-3 text-xs font-bold text-gray-700 w-[14%] text-center">
                      Qty
                    </TableHead>
                    <TableHead className="py-2.5 px-3 text-xs font-bold text-gray-700 w-[23%] text-right">
                      Modal Beli (HPP)
                    </TableHead>
                    <TableHead className="py-2.5 px-3 text-xs font-bold text-gray-700 w-[23%] text-right">
                      Harga Jual
                    </TableHead>
                    <TableHead className="py-2.5 px-3 text-xs font-bold text-gray-700 text-center w-[60px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, index) => {
                    const profitPerItem = (Number(item.sellPrice) || 0) - (Number(item.buyPrice) || 0);
                    return (
                      <TableRow key={index} className="border-b border-gray-100 hover:bg-purple-50/20">
                        <TableCell className="p-2.5">
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
                          {profitPerItem !== 0 && item.productId && (
                            <div className="mt-1 text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                              <span>Laba kotor: +Rp {profitPerItem.toLocaleString("id-ID")}/pcs</span>
                            </div>
                          )}
                        </TableCell>

                        <TableCell className="p-2.5">
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
                        </TableCell>

                        <TableCell className="p-2.5">
                          <Input
                            type="number"
                            min="0"
                            placeholder="Rp Modal"
                            value={item.buyPrice || ""}
                            onChange={(e) =>
                              handleItemChange(index, "buyPrice", e.target.value)
                            }
                            className="h-9 text-xs font-mono font-bold text-right rounded-xl"
                            required
                          />
                        </TableCell>

                        <TableCell className="p-2.5">
                          <Input
                            type="number"
                            min="0"
                            placeholder="Rp Jual"
                            value={item.sellPrice || ""}
                            onChange={(e) =>
                              handleItemChange(index, "sellPrice", e.target.value)
                            }
                            className="h-9 text-xs font-mono font-bold text-right rounded-xl"
                            required
                          />
                        </TableCell>

                        <TableCell className="p-2.5 text-center">
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

              {/* ACTION FOOTER */}
              <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>
                    Total {metrics.totalQty} pcs barang dalam nota migrasi ini
                  </span>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !transactionDate}
                  className="w-full sm:w-auto h-11 px-7 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-md shadow-purple-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4 stroke-[2.5]" />
                  <span>
                    {isLoading ? "Menyimpan ke Laba Rugi..." : "Simpan Transaksi Masa Lalu"}
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
                <p className="text-xs font-semibold text-neutral-400">Total Omset Penjualan</p>
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
                Bagaimana Time Machine bekerja?
              </p>
              <ul className="space-y-1.5 text-[11px] text-neutral-400 leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                  <span>Sistem membuat faktur kulakan fiktif tanggal lampau senilai modal.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                  <span>Faktur penjualan diterbitkan serentak menghabiskan stok fiktif tersebut (sisa 0).</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                  <span>Laporan Laba/Rugi bulanan langsung mencatat omset & laba historis.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
