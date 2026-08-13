"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, History, Save } from "lucide-react";
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

interface Product {
  id: number;
  name: string;
  price: number;
}

interface MigrationItem {
  productId: string;
  quantity: number;
  buyPrice: number;
  sellPrice: number;
}

export default function SalesMigrationPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [transactionDate, setTransactionDate] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [notes, setNotes] = useState("Input data Historis");

  const [items, setItems] = useState<MigrationItem[]>([
    { productId: "", quantity: 1, buyPrice: 0, sellPrice: 0 },
  ]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((json) => {
        if (json.data) setProducts(json.data);
      })
      .catch(console.error);
  }, []);

  const handleAddItem = () => {
    setItems([
      ...items,
      { productId: "", quantity: 1, buyPrice: 0, sellPrice: 0 },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionDate) return alert("Tanggal transaksi wajib diisi!");
    if (items.some((item) => !item.productId))
      return alert("Pastikan semua baris sudah dipilih produknya!");

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
      if (!res.ok)
        throw new Error(data.error || "Gagal melakukan migrasi data");

      alert("Data historis berhasil masuk tanpa merusak stok fisik!");

      setTransactionDate("");
      setCustomerName("");
      setItems([{ productId: "", quantity: 1, buyPrice: 0, sellPrice: 0 }]);
    } catch (error: unknown) {
      if (error instanceof Error) alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
          <History className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">
            Migrasi Data Lama (Time Machine)
          </h1>
          <p className="text-gray-500 text-sm">
            Input nota masa lalu. Sistem akan otomatis bikin kulakan fiktif dan
            penjualan tanpa merubah sisa stok gudang hari ini.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Tanggal Transaksi Lama <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Nama Pelanggan
            </label>
            <Input
              type="text"
              placeholder="Kosongkan jika tidak ada"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Catatan Tambahan
            </label>
            <Input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-[30%]">Produk</TableHead>
                <TableHead className="w-[15%]">Qty</TableHead>
                <TableHead className="w-[20%]">
                  Harga Modal/Beli Satuan
                </TableHead>
                <TableHead className="w-[20%]">Harga Jual Satuan</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={item.productId}
                      onChange={(e) =>
                        handleItemChange(index, "productId", e.target.value)
                      }
                      required
                    >
                      <option value="" disabled>
                        Pilih Produk...
                      </option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(index, "quantity", e.target.value)
                      }
                      required
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      placeholder="HPP saat itu"
                      value={item.buyPrice || ""}
                      onChange={(e) =>
                        handleItemChange(index, "buyPrice", e.target.value)
                      }
                      required
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Harga jual saat itu"
                      value={item.sellPrice || ""}
                      onChange={(e) =>
                        handleItemChange(index, "sellPrice", e.target.value)
                      }
                      required
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(index)}
                      disabled={items.length === 1}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
            <Button type="button" variant="outline" onClick={handleAddItem}>
              <Plus className="w-4 h-4 mr-2" /> Tambah Baris Produk
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? (
                "Memproses Migrasi..."
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" /> Simpan Data Historis
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
