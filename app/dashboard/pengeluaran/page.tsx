"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Trash2,
  Plus,
  Receipt,
  Search,
  Wallet,
  Calendar,
  AlertCircle,
  X,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

interface Expense {
  id: number;
  transactionDate: string;
  category: string;
  description: string;
  amount: number;
}

export default function ExpensePage() {
  const { success, error: showError } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");

  const [expenses, setExpenses] = useState<Expense[]>([]);

  const fetchExpensesAPI = async () => {
    const res = await fetch("/api/expenses");
    if (!res.ok) throw new Error("Gagal ambil data");
    const json = await res.json();
    return json.data || [];
  };

  const refreshData = useCallback(async () => {
    try {
      const data = await fetchExpensesAPI();
      setExpenses(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: category,
          description: description,
          amount: Number(amount),
          transactionDate: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal menyimpan pengeluaran");
      }

      setCategory("");
      setDescription("");
      setAmount("");
      setIsModalOpen(false);

      await refreshData();
      success("Catatan pengeluaran berhasil disimpan!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        showError(error.message);
      } else {
        showError("Terjadi kesalahan saat menyimpan data");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah anda yakin ingin menghapus catatan pengeluaran ini?"))
      return;

    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus data");
      }

      await refreshData();
      success("Catatan pengeluaran berhasil dihapus!");
    } catch (error) {
      console.error(error);
      showError("Terjadi kesalahan saat menghapus data");
    }
  };

  const totalExpenseAmount = useMemo(() => {
    return expenses.reduce((sum, item) => sum + item.amount, 0);
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const matchSearch =
        e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory =
        selectedCategoryFilter === "all" ||
        e.category.toLowerCase() === selectedCategoryFilter.toLowerCase();
      return matchSearch && matchCategory;
    });
  }, [expenses, searchQuery, selectedCategoryFilter]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-5 sm:space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
              <Receipt className="w-3.5 h-3.5" />
              Beban Operasional
            </span>
            <span className="text-xs text-gray-500">
              Total {expenses.length} transaksi tercatat
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">
            Catatan Pengeluaran Toko
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Catat biaya operasional, utilitas (listrik/PDAM), perlengkapan, dan gaji karyawan.
          </p>
        </div>

        {/* MODAL TRIGGER */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="h-11 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold shadow-md shadow-rose-500/25 active:scale-95 transition-all self-start sm:self-auto flex items-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Catat Pengeluaran Baru</span>
          </Button>

          <DialogContent className="sm:max-w-[460px] rounded-3xl p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-rose-600" />
                <span>Tambah Pengeluaran</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500">
                Masukkan detail pengeluaran untuk dicatat ke arus kas dan laporan laba rugi.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="category" className="text-xs font-bold text-gray-700">
                  Kategori Pengeluaran
                </Label>
                <Select
                  value={category}
                  onValueChange={(value) => setCategory(value || "")}
                  required
                >
                  <SelectTrigger id="category" className="h-10 text-sm rounded-xl font-medium w-full">
                    <SelectValue placeholder="Pilih kategori pengeluaran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Operasional">
                      Operasional (Listrik, PDAM, Internet)
                    </SelectItem>
                    <SelectItem value="Perlengkapan">
                      Perlengkapan (Plastik packing, Oksigen, Box)
                    </SelectItem>
                    <SelectItem value="Marketing">
                      Marketing (Iklan, Spanduk, Konten)
                    </SelectItem>
                    <SelectItem value="Gaji">Gaji Karyawan</SelectItem>
                    <SelectItem value="Aset">Aset / Inventaris Toko</SelectItem>
                    <SelectItem value="Lain-lain">Lain-lain</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs font-bold text-gray-700">
                  Keterangan Pengeluaran
                </Label>
                <Input
                  id="description"
                  placeholder="Misal: Beli plastik packing ukuran 20x40"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-10 text-sm rounded-xl font-medium"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="amount" className="text-xs font-bold text-gray-700">
                  Nominal Pengeluaran (Rp)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  placeholder="Contoh: 50000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-10 text-sm rounded-xl font-bold font-mono"
                  required
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
                  disabled={isLoading}
                  className="rounded-xl h-10 px-5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                >
                  {isLoading ? "Menyimpan..." : "Simpan Pengeluaran"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* SUMMARY CARD PENGELUARAN */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border-2 border-gray-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Total Pengeluaran
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-black text-rose-600 tracking-tight">
              Rp {totalExpenseAmount.toLocaleString("id-ID")}
            </div>
            <p className="text-xs font-semibold text-gray-400 mt-1">
              Dari seluruh riwayat operasional
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border-2 border-gray-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Rata-rata / Catatan
            </span>
            <div className="w-9 h-9 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-black text-gray-900 tracking-tight">
              Rp{" "}
              {expenses.length > 0
                ? Math.round(totalExpenseAmount / expenses.length).toLocaleString("id-ID")
                : 0}
            </div>
            <p className="text-xs font-semibold text-gray-400 mt-1">
              Biaya rata-rata per transaksi
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border-2 border-gray-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Transaksi Terbanyak
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-black text-gray-900 tracking-tight">
              {expenses.length > 0
                ? Array.from(
                    expenses.reduce((map, item) => {
                      map.set(item.category, (map.get(item.category) || 0) + 1);
                      return map;
                    }, new Map<string, number>()),
                  ).sort((a, b) => b[1] - a[1])[0]?.[0] || "Umum"
                : "-"}
            </div>
            <p className="text-xs font-semibold text-gray-400 mt-1">
              Kategori yang paling rutin keluar
            </p>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl border-2 border-gray-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Cari keterangan atau kategori..."
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
          {["all", "Operasional", "Perlengkapan", "Marketing", "Gaji", "Aset", "Lain-lain"].map(
            (cat) => {
              const isSelected = selectedCategoryFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    isSelected
                      ? "bg-rose-600 text-white shadow-xs"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat === "all" ? "Semua Kategori" : cat}
                </button>
              );
            },
          )}
        </div>
      </div>

      {/* TABEL PENGELUARAN */}
      <div className="border-2 border-gray-200/90 rounded-2xl bg-white shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/80 border-b border-gray-200 hover:bg-gray-50/80">
              <TableHead className="py-3.5 px-4 text-xs font-extrabold text-gray-700 uppercase">
                Tanggal
              </TableHead>
              <TableHead className="py-3.5 px-4 text-xs font-extrabold text-gray-700 uppercase">
                Kategori
              </TableHead>
              <TableHead className="py-3.5 px-4 text-xs font-extrabold text-gray-700 uppercase">
                Keterangan
              </TableHead>
              <TableHead className="py-3.5 px-4 text-xs font-extrabold text-gray-700 uppercase text-right">
                Nominal
              </TableHead>
              <TableHead className="py-3.5 px-4 text-xs font-extrabold text-gray-700 uppercase text-center w-[90px]">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExpenses.length > 0 ? (
              filteredExpenses.map((expense) => (
                <TableRow
                  key={expense.id}
                  className="hover:bg-rose-50/30 border-b border-gray-100 transition-colors"
                >
                  <TableCell className="py-3.5 px-4 text-xs font-bold text-gray-600 font-mono">
                    {new Date(expense.transactionDate).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
                      {expense.category}
                    </span>
                  </TableCell>
                  <TableCell className="py-3.5 px-4 font-bold text-sm text-gray-900">
                    {expense.description}
                  </TableCell>
                  <TableCell className="py-3.5 px-4 text-right font-black text-sm text-rose-600 font-mono">
                    Rp {expense.amount.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Hapus Pengeluaran"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-16 text-gray-400">
                  <AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-30 text-gray-400" />
                  <p className="font-bold text-gray-700 text-base">
                    Tidak ada catatan pengeluaran
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Belum ada data pengeluaran yang sesuai dengan filter pencarian.
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