"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, CalendarIcon } from "lucide-react";
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

interface Product {
  id: number;
  name: string;
}

interface PurchaseItem {
  productId: string;
  qty: string;
  buyPrice: string;
  expiredDate?: string;
}

interface PurchaseData {
  id: number;
  supplierName: string | null;
  supplierPhone: string | null;
  entryDate: string;
  notes: string | null;
  discount: number;
  paidAmount: number;
  finalAmount: number;
  paymentStatus: string;
  purchaseItems: {
    productId: number;
    initialStock: number;
    buyPrice: number;
    expiredDate: string | null;
    qty?: number;
  }[];
}

export default function PurchasePage() {
  const [purchases, setPurchases] = useState<PurchaseData[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [supplierName, setSupplierName] = useState("");
  const [supplierPhone, setSupplierPhone] = useState("");
  const [notes, setNotes] = useState("");

  const [cart, setCart] = useState<PurchaseItem[]>([]);

  const [discount, setDiscount] = useState("0");
  const [paidAmount, setPaidAmount] = useState("0");

  const totalAmount = cart.reduce(
    (sum, item) => sum + (Number(item.qty) || 0) * (Number(item.buyPrice) || 0),
    0,
  );
  const finalAmount = totalAmount - (Number(discount) || 0);
  const dueAmount = finalAmount - (Number(paidAmount) || 0);
  const paymentStatus = dueAmount > 0 ? "Hutang" : "Lunas";

  const fetchPurchasesAPI = async () => {
    const res = await fetch("/api/purchases");
    if (!res.ok) throw new Error("Gagal ambil data pembelian");
    const json = await res.json();
    return json.data || [];
  };

  const fetchProductsAPI = async () => {
    const res = await fetch("/api/products");
    if (!res.ok) throw new Error("Gagal ambil data produk");
    const json = await res.json();
    return json.data || [];
  };

  const refreshData = async () => {
    try {
      const data = await fetchPurchasesAPI();
      setPurchases(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPurchasesAPI().then(setPurchases).catch(console.error);

    fetchProductsAPI().then(setProducts).catch(console.error);
  }, []);

  const addCartItem = () => {
    setCart([
      ...cart,
      { productId: "", qty: "1", buyPrice: "0", expiredDate: "" },
    ]);
  };

  const removeCartItem = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const updateCartItem = (
    index: number,
    field: keyof PurchaseItem,
    value: string,
  ) => {
    const newCart = [...cart];
    newCart[index] = { ...newCart[index], [field]: value };
    setCart(newCart);
  };

  const resetForm = () => {
    setEditingId(null);
    setSupplierName("");
    setSupplierPhone("");
    setNotes("");
    setDiscount("0");
    setPaidAmount("0");
    setCart([{ productId: "", qty: "1", buyPrice: "0", expiredDate: "" }]); // Default 1 baris kosong
  };

  const handleEditClick = (purchase: PurchaseData) => {
    setEditingId(purchase.id);
    setSupplierName(purchase.supplierName || "");
    setSupplierPhone(purchase.supplierPhone || "");
    setNotes(purchase.notes || "");
    setDiscount(String(purchase.discount));
    setPaidAmount(String(purchase.paidAmount));

    const mappedCart = purchase.purchaseItems.map((item) => ({
      productId: String(item.productId),
      qty: String(item.initialStock),
      buyPrice: String(item.buyPrice),
      expiredDate: item.expiredDate ? item.expiredDate.split("T")[0] : "", // Ambil YYYY-MM-DD
    }));
    setCart(mappedCart);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi murni frontend
    if (cart.length === 0 || cart.some((item) => !item.productId)) {
      alert("Pilih minimal 1 produk di keranjang!");
      return;
    }

    setIsLoading(true);

    try {
      const isEditing = editingId !== null;
      const url = isEditing ? `/api/purchases/${editingId}` : "/api/purchases";
      const method = isEditing ? "PUT" : "POST";

      const payload = {
        supplierName,
        supplierPhone,
        notes,
        totalAmount,
        discount: Number(discount),
        finalAmount,
        paymentStatus,
        paidAmount: Number(paidAmount),
        dueAmount,
        items: cart,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.message || "Gagal menyimpan pembelian");
      }

      alert(`Pembelian berhasil ${isEditing ? "diperbarui" : "disimpan"}!`);
      setIsModalOpen(false);
      refreshData();
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin mau hapus nota kulakan ini?")) return;

    try {
      const res = await fetch(`/api/purchases/${id}`, { method: "DELETE" });
      const resData = await res.json();

      if (!res.ok) throw new Error(resData.message || "Gagal hapus data");

      alert("Berhasil dihapus!");
      refreshData();
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Barang Masuk (Kulakan)</h1>
          <p className="text-gray-500 text-sm">
            Catat pembelian barang dari supplier ke toko.
          </p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <Button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
          >
            + Tambah Pembelian
          </Button>

          <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Nota Pembelian" : "Nota Pembelian Baru"}
              </DialogTitle>
              <DialogDescription>
                Masukkan detail supplier dan keranjang belanja.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="grid gap-6 py-4">
              {/* Info Supplier */}
              <div className="grid grid-cols-2 gap-4 border-b pb-4">
                <div className="grid gap-2">
                  <Label>Nama Supplier</Label>
                  <Input
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    placeholder="Misal: Agen Makmur"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>No. HP Supplier</Label>
                  <Input
                    value={supplierPhone}
                    onChange={(e) => setSupplierPhone(e.target.value)}
                    placeholder="0812xxx"
                  />
                </div>
              </div>

              {/* Keranjang Belanja */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-base font-semibold">
                    Daftar Barang
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addCartItem}
                  >
                    + Tambah Baris
                  </Button>
                </div>

                <div className="border rounded-md">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead>Produk</TableHead>
                        <TableHead className="w-24">Qty</TableHead>
                        <TableHead className="w-40">Harga Modal/Pcs</TableHead>
                        <TableHead className="w-40">
                          Expired (Opsional)
                        </TableHead>
                        <TableHead className="w-16"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cart.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Select
                              value={item.productId}
                              onValueChange={(val) =>
                                updateCartItem(index, "productId", val || "")
                              }
                              required
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih Produk" />
                              </SelectTrigger>
                              <SelectContent>
                                {products.map((p) => (
                                  <SelectItem key={p.id} value={String(p.id)}>
                                    {p.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="1"
                              required
                              value={item.qty}
                              onChange={(e) =>
                                updateCartItem(index, "qty", e.target.value)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              required
                              value={item.buyPrice}
                              onChange={(e) =>
                                updateCartItem(
                                  index,
                                  "buyPrice",
                                  e.target.value,
                                )
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="date"
                              value={item.expiredDate}
                              onChange={(e) =>
                                updateCartItem(
                                  index,
                                  "expiredDate",
                                  e.target.value,
                                )
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeCartItem(index)}
                              disabled={cart.length === 1} // Jangan hapus kalo sisa 1 baris
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Ringkasan & Pembayaran */}
              <div className="grid grid-cols-2 gap-8 border-t pt-4 bg-gray-50 p-4 rounded-lg">
                <div className="grid gap-2">
                  <Label>Catatan</Label>
                  <Input
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Catatan tambahan (opsional)"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium">
                      Rp {totalAmount.toLocaleString("id-ID")}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 mt-2">Diskon (Rp)</span>
                    <Input
                      type="number"
                      className="w-32 h-8 text-right"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-between items-center font-bold text-base border-t pt-2">
                    <span>Total Tagihan</span>
                    <span>Rp {finalAmount.toLocaleString("id-ID")}</span>
                  </div>

                  <div className="flex justify-between items-center text-sm pt-2">
                    <span className="text-gray-500">Uang Dibayar (Rp)</span>
                    <Input
                      type="number"
                      className="w-32 h-8 text-right"
                      value={paidAmount}
                      onChange={(e) => setPaidAmount(e.target.value)}
                    />
                  </div>

                  <div
                    className={`flex justify-between items-center font-bold text-sm ${dueAmount > 0 ? "text-red-500" : "text-green-600"}`}
                  >
                    <span>Status Pembayaran</span>
                    <span>
                      {paymentStatus}{" "}
                      {dueAmount > 0
                        ? `(Kurang Rp ${dueAmount.toLocaleString("id-ID")})`
                        : ""}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Menyimpan..." : "Simpan Pembelian"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabel Data */}
      <div className="border rounded-lg bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Item Qty</TableHead>
              <TableHead className="text-right">Total Tagihan</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="w-[100px] text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchases.length > 0 ? (
              purchases.map((p) => {
                const totalItemQty = p.purchaseItems.reduce(
                  (sum, item) => sum + Number(item.qty || item.initialStock),
                  0,
                );

                return (
                  <TableRow key={p.id}>
                    <TableCell>
                      {new Date(p.entryDate).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell className="font-medium">
                      {p.supplierName || "Tanpa Nama"}
                    </TableCell>
                    <TableCell>
                      {p.purchaseItems.length} Macam ({totalItemQty} Pcs)
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      Rp {p.finalAmount.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${p.paymentStatus === "Lunas" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                      >
                        {p.paymentStatus}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(p)}
                        >
                          <Pencil className="w-4 h-4 text-blue-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(p.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center h-24 text-gray-500"
                >
                  Belum ada riwayat barang masuk.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
