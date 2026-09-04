"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Search,
  Trash2,
  Eye,
  FileText,
  AlertCircle,
  FileDown,
  Receipt,
  Sparkles,
  User,
  Calendar,
  Wallet,
  X,
  Clock,
  CheckCircle2,
  Clock3,
  AlertTriangle,
} from "lucide-react";
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
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast-context";

interface SaleItem {
  id: number;
  quantity: number;
  unitPrice: number;
  subTotal: number;
  product: {
    name: string;
    isService: boolean;
  };
}

interface Sale {
  id: number;
  invoiceNumber: string;
  customerName: string | null;
  customerPhone: string | null;
  notes: string | null;
  totalAmount: number;
  discount: number;
  finalAmount: number;
  paidAmount: number;
  dueAmount: number;
  paymentStatus: string;
  createdAt: string;
  saleItems: SaleItem[];
}

export default function SalesPage() {
  const { success, error: showError } = useToast();
  const [sales, setSales] = useState<Sale[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const fetchSalesAPI = useCallback(async (query = "") => {
    const url = query ? `/api/sales?search=${encodeURIComponent(query)}` : "/api/sales";
    const res = await fetch(url);
    if (!res.ok) throw new Error("Gagal mengambil riwayat transaksi");
    const json = await res.json();
    return json.data || [];
  }, []);

  const loadSales = useCallback(async (query = "") => {
    setIsLoading(true);
    try {
      const data = await fetchSalesAPI(query);
      setSales(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchSalesAPI]);

  useEffect(() => {
    loadSales();
  }, [loadSales]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      loadSales(searchQuery);
    }
  };

  const handleVoid = async (id: number, invoice: string) => {
    if (
      !confirm(
        `HATI-HATI!\nAnda yakin ingin membatalkan nota ${invoice}?\nStok barang fisik akan otomatis dikembalikan ke inventaris.`,
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/sales/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Gagal membatalkan transaksi");

      loadSales(searchQuery);
      if (selectedSale?.id === id) {
        setIsModalOpen(false);
      }
      success("Nota berhasil dibatalkan dan stok telah dikembalikan!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        showError(error.message);
      } else {
        showError("Gagal membatalkan nota transaksi");
      }
    }
  };

  const filteredSales = useMemo(() => {
    return sales.filter((s) => {
      const matchStatus =
        statusFilter === "all" ||
        s.paymentStatus.toLowerCase() === statusFilter.toLowerCase();
      const matchSearch =
        searchQuery === "" ||
        s.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.customerName &&
          s.customerName.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchStatus && matchSearch;
    });
  }, [sales, statusFilter, searchQuery]);

  const summary = useMemo(() => {
    const totalRevenue = sales.reduce((acc, s) => acc + (s.finalAmount || 0), 0);
    const totalPaid = sales.reduce((acc, s) => acc + (s.paidAmount || 0), 0);
    const totalDue = sales.reduce((acc, s) => acc + (s.dueAmount || 0), 0);
    return {
      totalTransactions: sales.length,
      totalRevenue,
      totalPaid,
      totalDue,
    };
  }, [sales]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Lunas":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Lunas
          </span>
        );
      case "DP":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-700 border border-amber-200">
            <Clock3 className="w-3.5 h-3.5" />
            DP / Bertahap
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3.5 h-3.5" />
            {status}
          </span>
        );
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-5 sm:space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              <Receipt className="w-3.5 h-3.5" />
              Penjualan Toko
            </span>
            <span className="text-xs text-gray-500">
              Total {sales.length} nota transaksi
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">
            Riwayat Penjualan & Nota
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Pantau seluruh invoice, rincian pembayaran pelanggan, cetak ulang, dan batalkan transaksi.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/api/sales/export"
            target="_blank"
            className="h-11 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md shadow-emerald-500/20 active:scale-95 transition-all inline-flex items-center gap-2"
          >
            <FileDown className="w-4 h-4 stroke-[2.5]" />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border-2 border-gray-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Total Penjualan Kotor
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-black text-gray-950 tracking-tight font-mono">
              Rp {summary.totalRevenue.toLocaleString("id-ID")}
            </div>
            <p className="text-xs font-semibold text-gray-400 mt-1">
              Dari {summary.totalTransactions} transaksi tercatat
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border-2 border-gray-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Kas Diterima (Lunas / DP)
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
              Arus uang masuk nyata dari kasir
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border-2 border-gray-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Piutang / Sisa Belum Bayar
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-black text-rose-600 tracking-tight font-mono">
              Rp {summary.totalDue.toLocaleString("id-ID")}
            </div>
            <p className="text-xs font-semibold text-gray-400 mt-1">
              Sisa kekurangan pembayaran pelanggan
            </p>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl border-2 border-gray-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Cari No. Nota atau Pelanggan..."
            className="pl-10 pr-8 h-10 bg-gray-50 border-gray-300 text-sm font-medium rounded-xl focus-visible:bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                loadSales("");
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* STATUS FILTER TABS */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
          {[
            { id: "all", label: "Semua Nota" },
            { id: "Lunas", label: "Lunas" },
            { id: "DP", label: "DP / Sebagian" },
            { id: "Belum Bayar", label: "Belum Bayar" },
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

      {/* TABEL DATA TRANSAKSI */}
      <div className="border-2 border-gray-200/90 rounded-2xl bg-white shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/80 border-b border-gray-200 hover:bg-gray-50/80">
              <TableHead className="py-3.5 px-4 text-xs font-extrabold text-gray-700 uppercase">
                Waktu & Tanggal
              </TableHead>
              <TableHead className="py-3.5 px-4 text-xs font-extrabold text-gray-700 uppercase">
                No. Invoice
              </TableHead>
              <TableHead className="py-3.5 px-4 text-xs font-extrabold text-gray-700 uppercase">
                Pelanggan
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-16 text-gray-400">
                  <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="font-bold text-gray-700 text-sm">
                    Memuat riwayat penjualan...
                  </p>
                </TableCell>
              </TableRow>
            ) : filteredSales.length > 0 ? (
              filteredSales.map((sale) => (
                <TableRow
                  key={sale.id}
                  className="hover:bg-blue-50/40 border-b border-gray-100 transition-colors"
                >
                  <TableCell className="py-3.5 px-4 text-xs font-semibold text-gray-600 font-mono">
                    {new Date(sale.createdAt).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell className="py-3.5 px-4 font-mono font-bold text-sm text-[#2563EB]">
                    {sale.invoiceNumber}
                  </TableCell>
                  <TableCell className="py-3.5 px-4">
                    <div className="font-bold text-sm text-gray-900">
                      {sale.customerName || "Pelanggan Umum"}
                    </div>
                    {sale.customerPhone && (
                      <div className="text-xs text-gray-400 font-mono">
                        {sale.customerPhone}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="py-3.5 px-4 text-right font-black text-sm text-gray-950 font-mono">
                    Rp {sale.finalAmount.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="py-3.5 px-4 text-center">
                    {getStatusBadge(sale.paymentStatus)}
                  </TableCell>
                  <TableCell className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedSale(sale);
                          setIsModalOpen(true);
                        }}
                        className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Lihat Rincian Nota"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleVoid(sale.id, sale.invoiceNumber)}
                        className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Batal Transaksi (Void & Kembalikan Stok)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-16 text-gray-400">
                  <AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-30 text-gray-400" />
                  <p className="font-bold text-gray-700 text-base">
                    Tidak ada transaksi penjualan ditemukan
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Coba sesuaikan kata kunci pencarian atau ubah status filter.
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* MODAL DETAIL NOTA */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl rounded-3xl p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span>Detail Nota: {selectedSale?.invoiceNumber}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Rincian barang, diskon, dan status pelunasan transaksi ini.
            </DialogDescription>
          </DialogHeader>

          {selectedSale && (
            <div className="space-y-5 pt-2">
              {/* Info Pelanggan & Waktu */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50/80 p-4 rounded-2xl border border-gray-200 text-sm">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Pelanggan
                  </p>
                  <p className="font-black text-gray-900 text-base">
                    {selectedSale.customerName || "Pelanggan Umum"}
                  </p>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">
                    {selectedSale.customerPhone || "Tanpa No. WhatsApp"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Waktu Transaksi
                  </p>
                  <p className="font-bold text-gray-800 text-sm">
                    {new Date(selectedSale.createdAt).toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                  <div className="mt-1.5">
                    {getStatusBadge(selectedSale.paymentStatus)}
                  </div>
                </div>
              </div>

              {/* Tabel Barang yang Dibeli */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Daftar Barang yang Dibeli
                </h4>
                <div className="border border-gray-200 rounded-2xl overflow-hidden">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="py-2.5 px-3 text-xs font-bold text-gray-700">Produk</TableHead>
                        <TableHead className="py-2.5 px-3 text-xs font-bold text-gray-700 text-center">Qty</TableHead>
                        <TableHead className="py-2.5 px-3 text-xs font-bold text-gray-700 text-right">Harga Satuan</TableHead>
                        <TableHead className="py-2.5 px-3 text-xs font-bold text-gray-700 text-right">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedSale.saleItems.map((item) => (
                        <TableRow key={item.id} className="border-b border-gray-100">
                          <TableCell className="py-3 px-3">
                            <div className="font-bold text-sm text-gray-900">
                              {item.product.name}
                            </div>
                            {item.product.isService && (
                              <span className="inline-block mt-0.5 text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md">
                                Jasa / Servis
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="py-3 px-3 text-center font-bold text-sm text-gray-700 font-mono">
                            {item.quantity}
                          </TableCell>
                          <TableCell className="py-3 px-3 text-right text-xs font-medium text-gray-600 font-mono">
                            Rp {item.unitPrice.toLocaleString("id-ID")}
                          </TableCell>
                          <TableCell className="py-3 px-3 text-right font-black text-sm text-gray-950 font-mono">
                            Rp {item.subTotal.toLocaleString("id-ID")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Rincian Pembayaran */}
              <div className="flex justify-end">
                <div className="w-72 bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600 text-xs">
                    <span>Subtotal Barang:</span>
                    <span className="font-mono font-semibold">
                      Rp {selectedSale.totalAmount.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between text-emerald-600 text-xs font-semibold">
                    <span>Potongan / Diskon:</span>
                    <span className="font-mono">
                      - Rp {selectedSale.discount.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between font-black text-base border-t border-gray-200 pt-2 text-gray-950">
                    <span>Total Akhir:</span>
                    <span className="text-[#2563EB] font-mono">
                      Rp {selectedSale.finalAmount.toLocaleString("id-ID")}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-2 mt-2 space-y-1">
                    <div className="flex justify-between text-gray-600 text-xs">
                      <span>Uang Diterima:</span>
                      <span className="font-mono font-bold text-gray-900">
                        Rp {selectedSale.paidAmount.toLocaleString("id-ID")}
                      </span>
                    </div>
                    {selectedSale.dueAmount > 0 && (
                      <div className="flex justify-between font-bold text-xs text-rose-600 bg-rose-50 p-2 rounded-xl border border-rose-200">
                        <span>Sisa Kekurangan:</span>
                        <span className="font-mono">
                          Rp {selectedSale.dueAmount.toLocaleString("id-ID")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Catatan Kasir */}
              {selectedSale.notes && (
                <div className="bg-amber-50/80 border border-amber-200 p-3.5 rounded-2xl text-xs flex gap-2.5 items-start">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-amber-900">Catatan Kasir: </span>
                    <span className="text-amber-800">{selectedSale.notes}</span>
                  </div>
                </div>
              )}

              {/* Tombol aksi modal */}
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <Button
                  variant="ghost"
                  className="rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold"
                  onClick={() => handleVoid(selectedSale.id, selectedSale.invoiceNumber)}
                >
                  <Trash2 className="w-4 h-4 mr-1.5" />
                  Batalkan Transaksi (Void)
                </Button>
                <Button
                  className="rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold px-5"
                  onClick={() => setIsModalOpen(false)}
                >
                  Tutup
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
