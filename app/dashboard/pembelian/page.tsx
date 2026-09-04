"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Plus,
  Trash2,
  Pencil,
  Search,
  Truck,
  Sparkles,
  Phone,
  FileText,
  AlertCircle,
  X,
  Wallet,
  Calendar,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [supplierName, setSupplierName] = useState("");
  const [supplierPhone, setSupplierPhone] = useState("");
  const [notes, setNotes] = useState("");

  const [cart, setCart] = useState<PurchaseItem[]>([]);

  const [discount, setDiscount] = useState("0");
  const [paidAmount, setPaidAmount] = useState("0");

  const totalAmount = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + (Number(item.qty) || 0) * (Number(item.buyPrice) || 0),
      0,
    );
  }, [cart]);

  const finalAmount = useMemo(() => {
    return Math.max(0, totalAmount - (Number(discount) || 0));
  }, [totalAmount, discount]);

  const dueAmount = useMemo(() => {
    return Math.max(0, finalAmount - (Number(paidAmount) || 0));
  }, [finalAmount, paidAmount]);

  const paymentStatus = dueAmount > 0 ? "Hutang" : "Lunas";

  const fetchPurchasesAPI = useCallback(async () => {
    const res = await fetch("/api/purchases");
    if (!res.ok) throw new Error("Gagal ambil data pembelian");
    const json = await res.json();
    return json.data || [];
  }, []);

  const fetchProductsAPI = useCallback(async () => {
    const res = await fetch("/api/products");
    if (!res.ok) throw new Error("Gagal ambil data produk");
    const json = await res.json();
    return json.data || [];
  }, []);

  const refreshData = useCallback(async () => {
    try {
      const data = await fetchPurchasesAPI();
      setPurchases(data);
    } catch (err) {
      console.error(err);
    }
  }, [fetchPurchasesAPI]);

  useEffect(() => {
    setIsFetching(true);
    Promise.all([fetchPurchasesAPI(), fetchProductsAPI()])
      .then(([purchasesData, productsData]) => {
        setPurchases(purchasesData);
        setProducts(productsData);
      })
      .catch(console.error)
      .finally(() => setIsFetching(false));
  }, [fetchPurchasesAPI, fetchProductsAPI]);

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
    setCart([{ productId: "", qty: "1", buyPrice: "0", expiredDate: "" }]);
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
      qty: String(item.initialStock || item.qty || 1),
      buyPrice: String(item.buyPrice),
      expiredDate: item.expiredDate ? item.expiredDate.split("T")[0] : "",
    }));
    setCart(mappedCart);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
    if (!confirm("Yakin ingin menghapus nota pembelian (kulakan) ini?")) return;

    try {
      const res = await fetch(`/api/purchases/${id}`, { method: "DELETE" });
      const resData = await res.json();

      if (!res.ok) throw new Error(resData.message || "Gagal hapus data");

      refreshData();
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  const filteredPurchases = useMemo(() => {
    return purchases.filter((p) => {
      const matchStatus =
        statusFilter === "all" ||
        p.paymentStatus.toLowerCase() === statusFilter.toLowerCase();
      const matchSearch =
        searchQuery === "" ||
        (p.supplierName &&
          p.supplierName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.supplierPhone && p.supplierPhone.includes(searchQuery)) ||
        (p.notes && p.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchStatus && matchSearch;
    });
  }, [purchases, statusFilter, searchQuery]);

  const summary = useMemo(() => {
    const totalSpent = purchases.reduce((acc, p) => acc + (p.finalAmount || 0), 0);
    const totalPaid = purchases.reduce((acc, p) => acc + (p.paidAmount || 0), 0);
    const totalDebt = purchases.reduce((acc, p) => acc + Math.max(0, (p.finalAmount || 0) - (p.paidAmount || 0)), 0);
    return {
      totalPurchases: purchases.length,
      totalSpent,
      totalPaid,
      totalDebt,
    };
  }, [purchases]);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              <Truck className="w-3.5 h-3.5" />
              Kulakan & Restock
            </span>
            <span className="text-xs text-gray-500">
              Total {purchases.length} faktur masuk
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">
            Barang Masuk (Kulakan)
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Catat pengadaan stok toko, modal pokok produk, hutang ke supplier, dan riwayat faktur.
          </p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <Button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="h-11 px-5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold shadow-md shadow-blue-500/25 active:scale-95 transition-all self-start sm:self-auto flex items-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Tambah Faktur Kulakan</span>
          </Button>

          <DialogContent className="sm:max-w-4xl rounded-3xl p-6 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span>
                  {editingId ? "Edit Faktur Kulakan" : "Faktur Pembelian Baru"}
                </span>
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500">
                Masukkan identitas supplier dan daftar item barang yang masuk ke gudang.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-5 pt-2">
              {/* Info Supplier */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/80 p-4 rounded-2xl border border-gray-200">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-gray-700">Nama Supplier / Agen</Label>
                  <Input
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    placeholder="Misal: Agen Ikan Kediri / Distributor Agaru"
                    className="h-10 text-sm rounded-xl font-medium bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-gray-700">No. WhatsApp Supplier</Label>
                  <Input
                    value={supplierPhone}
                    onChange={(e) => setSupplierPhone(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="h-10 text-sm rounded-xl font-mono bg-white"
                  />
                </div>
              </div>

              {/* Keranjang Belanja */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Daftar Barang Masuk
                  </Label>
                  <button
                    type="button"
                    onClick={addCartItem}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Tambah Baris
                  </button>
                </div>

                <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="py-2.5 px-3 text-xs font-bold text-gray-700">Produk</TableHead>
                        <TableHead className="py-2.5 px-3 text-xs font-bold text-gray-700 w-28 text-center">Qty</TableHead>
                        <TableHead className="py-2.5 px-3 text-xs font-bold text-gray-700 w-44 text-right">Harga Modal/Pcs</TableHead>
                        <TableHead className="py-2.5 px-3 text-xs font-bold text-gray-700 w-36">Expired</TableHead>
                        <TableHead className="py-2.5 px-3 text-xs font-bold text-gray-700 w-12 text-center"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cart.map((item, index) => (
                        <TableRow key={index} className="border-b border-gray-100">
                          <TableCell className="p-2">
                            <Select
                              value={item.productId}
                              onValueChange={(val) =>
                                updateCartItem(index, "productId", val || "")
                              }
                              required
                            >
                              <SelectTrigger className="h-9 text-xs rounded-xl font-medium w-full">
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
                          <TableCell className="p-2">
                            <Input
                              type="number"
                              min="1"
                              required
                              value={item.qty}
                              onChange={(e) =>
                                updateCartItem(index, "qty", e.target.value)
                              }
                              className="h-9 text-xs font-mono font-bold text-center rounded-xl"
                            />
                          </TableCell>
                          <TableCell className="p-2">
                            <Input
                              type="number"
                              min="0"
                              required
                              value={item.buyPrice}
                              onChange={(e) =>
                                updateCartItem(index, "buyPrice", e.target.value)
                              }
                              className="h-9 text-xs font-mono font-bold text-right rounded-xl"
                            />
                          </TableCell>
                          <TableCell className="p-2">
                            <Input
                              type="date"
                              value={item.expiredDate}
                              onChange={(e) =>
                                updateCartItem(index, "expiredDate", e.target.value)
                              }
                              className="h-9 text-xs rounded-xl font-mono"
                            />
                          </TableCell>
                          <TableCell className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => removeCartItem(index)}
                              disabled={cart.length === 1}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 disabled:opacity-30"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Ringkasan & Pembayaran */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/90 p-4 rounded-2xl border border-gray-200">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-gray-700">Catatan Pengadaan</Label>
                  <Input
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Contoh: Titipan pengiriman via ekspedisi, tempo 14 hari"
                    className="h-10 text-xs rounded-xl bg-white"
                  />
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Subtotal Barang:</span>
                    <span className="font-mono font-bold">
                      Rp {totalAmount.toLocaleString("id-ID")}
                    </span>
                  </div>

                  <div className="flex justify-between items-center gap-2">
                    <span className="text-emerald-700 font-semibold">Diskon Supplier (Rp):</span>
                    <Input
                      type="number"
                      className="w-32 h-8 text-right font-mono font-bold rounded-lg bg-white"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-between items-center font-black text-sm border-t border-gray-200 pt-2 text-gray-950">
                    <span>Total Tagihan:</span>
                    <span className="text-[#2563EB] font-mono">
                      Rp {finalAmount.toLocaleString("id-ID")}
                    </span>
                  </div>

                  <div className="flex justify-between items-center gap-2 pt-1">
                    <span className="text-gray-700 font-bold">Uang Dibayar (Rp):</span>
                    <Input
                      type="number"
                      className="w-32 h-8 text-right font-mono font-bold rounded-lg bg-white"
                      value={paidAmount}
                      onChange={(e) => setPaidAmount(e.target.value)}
                    />
                  </div>

                  <div
                    className={`flex justify-between items-center font-bold text-xs p-2 rounded-xl border ${
                      dueAmount > 0
                        ? "bg-rose-50 text-rose-700 border-rose-200"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}
                  >
                    <span>Status:</span>
                    <span>
                      {paymentStatus}{" "}
                      {dueAmount > 0
                        ? `(Hutang Rp ${dueAmount.toLocaleString("id-ID")})`
                        : "Lengkap"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl text-xs font-bold"
                  onClick={() => setIsModalOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold px-5"
                >
                  {isLoading ? "Menyimpan..." : "Simpan Pembelian"}
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
              Total Pengadaan
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-black text-gray-950 tracking-tight font-mono">
              Rp {summary.totalSpent.toLocaleString("id-ID")}
            </div>
            <p className="text-xs font-semibold text-gray-400 mt-1">
              Dari {summary.totalPurchases} nota kulakan tercatat
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border-2 border-gray-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Sudah Dibayar
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-black text-emerald-600 tracking-tight font-mono">
              Rp {summary.totalPaid.toLocaleString("id-ID")}
            </div>
            <p className="text-xs font-semibold text-gray-400 mt-1">
              Kas riil keluar untuk modal kulakan
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border-2 border-gray-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Tanggungan Hutang Supplier
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-black text-rose-600 tracking-tight font-mono">
              Rp {summary.totalDebt.toLocaleString("id-ID")}
            </div>
            <p className="text-xs font-semibold text-gray-400 mt-1">
              Total kewajiban tempo pembayaran
            </p>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl border-2 border-gray-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Cari nama supplier atau catatan..."
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
            { id: "all", label: "Semua Faktur" },
            { id: "Lunas", label: "Lunas" },
            { id: "Hutang", label: "Hutang / Tempo" },
          ].map((item) => {
            const isSelected = statusFilter === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setStatusFilter(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-[#2563EB] text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* TABEL DATA KULAKAN */}
      <div className="border-2 border-gray-200/90 rounded-2xl bg-white shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/80 border-b border-gray-200 hover:bg-gray-50/80">
              <TableHead className="py-3.5 px-4 text-xs font-extrabold text-gray-700 uppercase">
                Tanggal
              </TableHead>
              <TableHead className="py-3.5 px-4 text-xs font-extrabold text-gray-700 uppercase">
                Supplier & Kontak
              </TableHead>
              <TableHead className="py-3.5 px-4 text-xs font-extrabold text-gray-700 uppercase">
                Jumlah Barang
              </TableHead>
              <TableHead className="py-3.5 px-4 text-xs font-extrabold text-gray-700 uppercase text-right">
                Total Tagihan
              </TableHead>
              <TableHead className="py-3.5 px-4 text-xs font-extrabold text-gray-700 uppercase text-center">
                Status
              </TableHead>
              <TableHead className="py-3.5 px-4 text-xs font-extrabold text-gray-700 uppercase text-center w-[110px]">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isFetching ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-16 text-gray-400">
                  <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="font-bold text-gray-700 text-sm">
                    Memuat riwayat kulakan...
                  </p>
                </TableCell>
              </TableRow>
            ) : filteredPurchases.length > 0 ? (
              filteredPurchases.map((p) => {
                const totalItemQty = p.purchaseItems.reduce(
                  (sum, item) => sum + Number(item.qty || item.initialStock || 0),
                  0,
                );

                return (
                  <TableRow
                    key={p.id}
                    className="hover:bg-blue-50/40 border-b border-gray-100 transition-colors"
                  >
                    <TableCell className="py-3.5 px-4 text-xs font-semibold text-gray-600 font-mono">
                      {new Date(p.entryDate).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="py-3.5 px-4">
                      <div className="font-bold text-sm text-gray-900">
                        {p.supplierName || "Supplier Tanpa Nama"}
                      </div>
                      {p.supplierPhone && (
                        <div className="text-xs text-gray-400 font-mono">
                          {p.supplierPhone}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
                        {p.purchaseItems.length} Produk ({totalItemQty} pcs)
                      </span>
                    </TableCell>
                    <TableCell className="py-3.5 px-4 text-right font-black text-sm text-gray-950 font-mono">
                      Rp {p.finalAmount.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                          p.paymentStatus === "Lunas"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        {p.paymentStatus === "Lunas" ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5" />
                        )}
                        {p.paymentStatus}
                      </span>
                    </TableCell>
                    <TableCell className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleEditClick(p)}
                          className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit Faktur"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Hapus Faktur"
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
                <TableCell colSpan={6} className="text-center py-16 text-gray-400">
                  <AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-30 text-gray-400" />
                  <p className="font-bold text-gray-700 text-base">
                    Belum ada data kulakan
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Klik tombol Tambah Faktur Kulakan untuk mencatat stok barang masuk.
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
