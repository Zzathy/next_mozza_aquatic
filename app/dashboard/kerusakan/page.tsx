"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Trash2, Wrench, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/dialog";

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
  const [logs, setLogs] = useState<DamageLog[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAPI = async () => {
    const [logsRes, productRes] = await Promise.all([
      fetch("/api/damage-logs"),
      fetch("/api/products"),
    ]);
    const logsJson = await logsRes.json();
    const productsJson = await productRes.json();
    return { logsData: logsJson.data, productsData: productsJson.data };
  };

  const reloadData = async () => {
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
  };

  useEffect(() => {
    fetchAPI()
      .then(({ logsData, productsData }) => {
        setLogs(logsData || []);
        setProducts(
          (productsData || []).filter(
            (p: Product) => !p.isService && p.stock > 0,
          ),
        );
      })
      .catch(console.error)
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || Number(quantity) <= 0) return;

    const selectedProduct = products.find(
      (p) => p.id === Number(selectedProductId),
    );
    if (selectedProduct && Number(quantity) > selectedProduct.stock) {
      alert(
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

      alert("Barang rusak berhasil dicatat!");
      setIsModalOpen(false);

      setSelectedProductId("");
      setQuantity("");
      setNotes("");
      fetchAPI();
    } catch (error: unknown) {
      if (error instanceof Error) alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRepair = async (id: number, productName: string) => {
    if (
      !confirm(
        `Barang ${productName} sudah berhasil diperbaiki?\nStok akan dikembalikan dan catatan kerugian akan dihapus.`,
      )
    )
      return;

    try {
      const res = await fetch(`/api/damage-logs/${id}`, { method: "PATCH" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memperbarui status");

      alert("Status berhasil diubah menjadi Diperbaiki!");
      fetchAPI();
    } catch (error: unknown) {
      if (error instanceof Error) alert(error.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus catatan ini secara permanen?")) return;

    try {
      const res = await fetch(`/api/damage-logs/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menghapus log");

      alert("Catatan berhasil dihapus!");
      fetchAPI();
    } catch (error: unknown) {
      if (error instanceof Error) alert(error.message);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            Laporan Barang Rusak
          </h1>
          <p className="text-gray-500 text-sm">
            Catat penyusutan stok akibat barang rusak, mati, atau hilang.
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-red-600 hover:bg-red-700"
        >
          <Plus className="w-4 h-4 mr-2" /> Catat Barang Rusak
        </Button>
      </div>

      {/* TABEL DATA */}
      <div className="border rounded-lg bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Produk</TableHead>
              <TableHead className="text-center">Qty</TableHead>
              <TableHead className="text-right">Total Kerugian</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Catatan</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center h-24 text-gray-500"
                >
                  Memuat data...
                </TableCell>
              </TableRow>
            ) : logs.length > 0 ? (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    {new Date(log.createdAt).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="font-medium">
                    {log.product.name}
                  </TableCell>
                  <TableCell className="text-center font-bold text-red-500">
                    {log.quantity}
                  </TableCell>
                  <TableCell className="text-right">
                    Rp {log.totalCost.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${
                        log.status.toLowerCase() === "rusak"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {log.status.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm">
                    {log.notes || "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      {log.status.toLowerCase() === "rusak" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-blue-600 border-blue-200 hover:bg-blue-50"
                          onClick={() => handleRepair(log.id, log.product.name)}
                          title="Tandai Sudah Diperbaiki (Stok Kembali)"
                        >
                          <Wrench className="w-3 h-3 mr-1" /> Perbaiki
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:bg-red-50"
                        onClick={() => handleDelete(log.id)}
                        title="Hapus Catatan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center h-24 text-gray-500"
                >
                  Belum ada laporan barang rusak.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* MODAL TAMBAH BARANG RUSAK */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Catat Barang Rusak</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Pilih Produk</label>
              {/* Kita pake select bawaan HTML dulu biar gampang, kalo lu pake komponen Shadcn Select juga gas */}
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                required
              >
                <option value="" disabled>
                  -- Pilih Produk (Fisik) --
                </option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Sisa Stok: {p.stock})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Jumlah Rusak / Mati</label>
              <Input
                type="number"
                min="1"
                placeholder="Misal: 2"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Keterangan / Penyebab
              </label>
              <Input
                type="text"
                placeholder="Misal: Pecah saat dikirim, Ikan mati, dll"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !selectedProductId}
                className="bg-red-600 hover:bg-red-700"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Catatan"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
