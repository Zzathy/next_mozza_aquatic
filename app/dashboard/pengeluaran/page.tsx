"use client";

import { Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  const [expenses, setExpenses] = useState<Expense[]>([]);

  const refreshData = async () => {
    try {
      const res = await fetch("/api/expenses");
      if (!res.ok) throw new Error("Gagal ambil data");
      const json = await res.json();
      setExpenses(json.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetch("/api/expenses")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal ambil data");
        return res.json();
      })
      .then((json) => {
        setExpenses(json.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

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
        throw new Error(errorData.error || "Gagal nyimpen data");
      }

      alert("Pengeluaran berhasil dicatat!");

      setCategory("");
      setDescription("");
      setAmount("");
      setIsModalOpen(false);

      await refreshData();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error:", error);
        alert(error.message);
      } else {
        alert("Terjadi kesalahan yang tidak diketahui");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah anda yakin ingin menghapus pengeluaran ini?")) return;

    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus data");
      }

      alert("Data berhasil dihapus!");
      await refreshData();
    } catch (error) {
      console.log(error);
      alert("Terjadi kesalahan saat menghapus data");
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Catatan Pengeluaran</h1>
          <p className="text-gray-500 text-sm">
            Kelola biaya operasional harian.
          </p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <Button onClick={() => setIsModalOpen(true)}>
            + Tambah Pengeluaran
          </Button>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Tambah Pengeluaran</DialogTitle>
              <DialogDescription>
                Masukkan detail pengeluaran baru di sini.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Kategori</Label>
                <Select
                  value={category}
                  onValueChange={(value) => setCategory(value || "")}
                  required
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Pilih kategori pengeluaran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Operasional">
                      Operasional (Listrik, PDAM, dll)
                    </SelectItem>
                    <SelectItem value="Marketing">
                      Marketing (Iklan, Spanduk)
                    </SelectItem>
                    <SelectItem value="Gaji">Gaji Karyawan</SelectItem>
                    <SelectItem value="Aset">Aset / Inventaris Toko</SelectItem>
                    <SelectItem value="Lain-lain">Lain-lain</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Keterangan</Label>
                <Input
                  id="description"
                  placeholder="Misal: Beli plastik packing"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount">Nominal (Rp)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Misal: 50000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={isLoading} className="mt-4">
                {isLoading ? "Menyimpan..." : "Simpan Pengeluaran"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Keterangan</TableHead>
              <TableHead className="text-right">Nominal</TableHead>
              <TableHead className="w-[80px] text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.length > 0 ? (
              expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>
                    {new Date(expense.transactionDate).toLocaleDateString(
                      "id-ID",
                    )}
                  </TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell className="text-right font-medium">
                    Rp {expense.amount.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(expense.id)}
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center h-24 text-gray-500"
                >
                  Belum ada data pengeluaran.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
