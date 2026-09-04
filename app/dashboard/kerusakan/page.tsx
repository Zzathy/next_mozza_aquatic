"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Search,
  Plus,
  Trash2,
  Wrench,
  AlertTriangle,
  PackageX,
  Sparkles,
  Wallet,
  AlertCircle,
  X,
  CheckCircle2,
  Info,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
  stock: number;
  isService: boolean;
}

interface DamageLog {
  id: number;
  productId: number;
  quantity: number;
  status: string;
  totalCost: number;
  notes: string | null;
  createdAt: string;
  product: { name: string };
  expense?: { amount: number; description: string } | null;
}

export default function DamageLogPage() {
  const { success, error: showError } = useToast();
  const [logs, setLogs] = useState<DamageLog[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAPI = useCallback(async () => {
    const [logsRes, productRes] = await Promise.all([
      fetch("/api/damage-logs"),
      fetch("/api/products"),
    ]);
    const logsJson = await logsRes.json();
    const productsJson = await productRes.json();
    return { logsData: logsJson.data, productsData: productsJson.data };
  }, []);

  const reloadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { logsData, productsData } = await fetchAPI();
      setLogs(logsData || []);
      setProducts(
        (productsData || []).filter(
          (p: Product) => !p.isService && p.stock > 0,
        ),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchAPI]);

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || Number(quantity) <= 0) return;

    const selectedProduct = products.find(
      (p) => p.id === Number(selectedProductId),
    );
    if (selectedProduct && Number(quantity) > selectedProduct.stock) {
      showError(
        `Stok tidak cukup! Sisa stok ${selectedProduct.name} hanya ${selectedProduct.stock}.`,
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/damage-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: Number(selectedProductId),
          quantity: Number(quantity),
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mencatat barang rusak");

      setIsModalOpen(false);
      setSelectedProductId("");
      setQuantity("");
      setNotes("");
      reloadData();
      success("Laporan barang rusak berhasil dicatat!");
    } catch (error: unknown) {
      if (error instanceof Error) showError(error.message);
      else showError("Gagal mencatat barang rusak.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRepair = async (id: number, productName: string) => {
    if (
      !confirm(
        `Barang ${productName} sudah berhasil diperbaiki?\nStok akan dikembalikan ke inventaris dan beban kerugian akan disesuaikan.`,
      )
    )
      return;

    try {
      const res = await fetch(`/api/damage-logs/${id}`, { method: "PATCH" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memperbarui status");

      reloadData();
      success(`Barang ${productName} berhasil diperbaiki & stok dikembalikan!`);
    } catch (error: unknown) {
      if (error instanceof Error) showError(error.message);
      else showError("Gagal mengubah status kerusakan");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus catatan kerusakan ini secara permanen?")) return;

    try {
      const res = await fetch(`/api/damage-logs/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menghapus log");

      reloadData();
      success("Catatan kerusakan berhasil dihapus!");
    } catch (error: unknown) {
      if (error instanceof Error) showError(error.message);
      else showError("Gagal menghapus catatan");
    }
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchStatus =
        statusFilter === "all" ||
        log.status.toLowerCase() === statusFilter.toLowerCase();
      const matchSearch =
        searchQuery === "" ||
        log.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.notes && log.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchStatus && matchSearch;
    });
  }, [logs, statusFilter, searchQuery]);

  const summary = useMemo(() => {
    const totalLoss = logs.reduce((acc, log) => {
      if (log.status.toLowerCase() === "rusak") {
        return acc + (log.totalCost || 0);
      }
      return acc;
    }, 0);
    const damagedItemsCount = logs.reduce((acc, log) => {
      if (log.status.toLowerCase() === "rusak") {
        return acc + (log.quantity || 0);
      }
      return acc;
    }, 0);
    const repairedCount = logs.filter((l) => l.status.toLowerCase() !== "rusak").length;

    return {
      totalLoss,
      damagedItemsCount,
      repairedCount,
    };
  }, [logs]);

  const selectedProductObj = useMemo(() => {
    return products.find((p) => String(p.id) === selectedProductId);
  }, [products, selectedProductId]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-5 sm:space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
              <PackageX className="w-3.5 h-3.5" />
              Penyusutan Inventaris
            </span>
            <span className="text-xs text-gray-500">
              Total {logs.length} riwayat insiden
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">
            Laporan Kerusakan & Kematian Ikan
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Pencatatan barang pecah, ikan mati, atau kadaluarsa untuk otomatis memotong stok & catat beban rugi toko.
          </p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="h-11 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold shadow-md shadow-rose-500/25 active:scale-95 transition-all self-start sm:self-auto flex items-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Catat Barang Rusak / Mati</span>
          </Button>

          <DialogContent className="sm:max-w-[460px] rounded-3xl p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-rose-600" />
                <span>Catat Barang Rusak / Mati</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500">
                Stok fisik akan berkurang dan biaya modalnya otomatis dicatat sebagai beban rugi.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-gray-700">Pilih Produk (Fisik)</Label>
                <Select
                  value={selectedProductId}
                  onValueChange={(val) => setSelectedProductId(val || "")}
                  required
                >
                  <SelectTrigger className="h-10 text-sm rounded-xl font-medium w-full">
                    <SelectValue placeholder="Pilih produk yang rusak/mati" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.name} (Tersedia: {p.stock})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedProductObj && (
                  <p className="text-[11px] font-semibold text-blue-600 flex items-center gap-1">
                    <Info className="w-3 h-3" /> Stok saat ini di gudang: {selectedProductObj.stock} pcs
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="qty" className="text-xs font-bold text-gray-700">
                  Jumlah Rusak / Mati (Pcs)
                </Label>
                <Input
                  id="qty"
                  type="number"
                  min="1"
                  max={selectedProductObj ? selectedProductObj.stock : undefined}
                  placeholder="Misal: 2"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="h-10 text-sm rounded-xl font-bold font-mono"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="notes" className="text-xs font-bold text-gray-700">
                  Keterangan / Penyebab Kerusakan
                </Label>
                <Input
                  id="notes"
                  type="text"
                  placeholder="Misal: Pecah saat unboxing, ikan mati adaptasi suhu"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="h-10 text-sm rounded-xl font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl h-10 px-4 text-xs font-bold"
                  onClick={() => setIsModalOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !selectedProductId}
                  className="rounded-xl h-10 px-5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Laporan"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border-2 border-gray-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Total Kerugian Riil
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-black text-rose-600 tracking-tight font-mono">
              Rp {summary.totalLoss.toLocaleString("id-ID")}
            </div>
            <p className="text-xs font-semibold text-gray-400 mt-1">
              Beban kerugian barang rusak aktif
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border-2 border-gray-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Total Barang Rusak
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <PackageX className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-black text-gray-900 tracking-tight font-mono">
              {summary.damagedItemsCount} Pcs
            </div>
            <p className="text-xs font-semibold text-gray-400 mt-1">
              Barang fisik atau ikan yang mati
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border-2 border-gray-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Berhasil Diselamatkan / Servis
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-black text-emerald-600 tracking-tight font-mono">
              {summary.repairedCount} Insiden
            </div>
            <p className="text-xs font-semibold text-gray-400 mt-1">
              Telah diperbaiki & stoknya kembali
            </p>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl border-2 border-gray-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Cari nama produk atau catatan..."
            className="pl-10 pr-8 h-10 bg-gray-50 border-gray-300 text-sm font-medium rounded-xl focus-visible:bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
          {[
            { id: "all", label: "Semua Insiden" },
            { id: "rusak", label: "Rusak / Mati" },
            { id: "diperbaiki", label: "Sudah Diperbaiki" },
          ].map((item) => {
            const isSelected = statusFilter === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setStatusFilter(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-rose-600 text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* TABEL DATA KERUSAKAN */}
      <div className="border-2 border-gray-200/90 rounded-2xl bg-white shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/80 border-b border-gray-200 hover:bg-gray-50/80">
              <TableHead className="py-3.5 px-4 text-xs font-extrabold text-gray-700 uppercase">
                Tanggal
              </TableHead>
              <TableHead className="py-3.5 px-4 text-xs font-extrabold text-gray-700 uppercase">
                Produk
              </TableHead>
              <TableHead className="py-3.5 px-4 text-xs font-extrabold text-gray-700 uppercase text-center">
                Jumlah
              </TableHead>
              <TableHead className="py-3.5 px-4 text-xs font-extrabold text-gray-700 uppercase text-right">
                Beban Kerugian
              </TableHead>
              <TableHead className="py-3.5 px-4 text-xs font-extrabold text-gray-700 uppercase text-center">
                Status
              </TableHead>
              <TableHead className="py-3.5 px-4 text-xs font-extrabold text-gray-700 uppercase">
                Keterangan
              </TableHead>
              <TableHead className="py-3.5 px-4 text-xs font-extrabold text-gray-700 uppercase text-center w-[120px]">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-16 text-gray-400">
                  <div className="w-8 h-8 border-3 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="font-bold text-gray-700 text-sm">
                    Memuat laporan kerusakan...
                  </p>
                </TableCell>
              </TableRow>
            ) : filteredLogs.length > 0 ? (
              filteredLogs.map((log) => {
                const isDamaged = log.status.toLowerCase() === "rusak";
                return (
                  <TableRow
                    key={log.id}
                    className="hover:bg-rose-50/30 border-b border-gray-100 transition-colors"
                  >
                    <TableCell className="py-3.5 px-4 text-xs font-semibold text-gray-600 font-mono">
                      {new Date(log.createdAt).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="py-3.5 px-4 font-bold text-sm text-gray-900">
                      {log.product.name}
                    </TableCell>
                    <TableCell className="py-3.5 px-4 text-center font-bold text-sm text-rose-600 font-mono">
                      {log.quantity} pcs
                    </TableCell>
                    <TableCell className="py-3.5 px-4 text-right font-black text-sm text-gray-950 font-mono">
                      Rp {log.totalCost.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                          isDamaged
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}
                      >
                        {isDamaged ? (
                          <AlertTriangle className="w-3.5 h-3.5" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                        {log.status.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell className="py-3.5 px-4 text-xs text-gray-600 max-w-xs truncate">
                      {log.notes || "-"}
                    </TableCell>
                    <TableCell className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {isDamaged && (
                          <button
                            onClick={() => handleRepair(log.id, log.product.name)}
                            className="p-1.5 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Tandai Sudah Diperbaiki (Stok Kembali)"
                          >
                            <Wrench className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(log.id)}
                          className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Hapus Catatan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-16 text-gray-400">
                  <AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-30 text-gray-400" />
                  <p className="font-bold text-gray-700 text-base">
                    Tidak ada laporan kerusakan ditemukan
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Semua stok barang dan ikan dalam kondisi baik.
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
