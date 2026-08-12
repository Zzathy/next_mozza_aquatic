"use client";

import { useState, useEffect } from "react";
import { Search, Trash2, Eye, FileText, AlertCircle } from "lucide-react";
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
  const [sales, setSales] = useState<Sale[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const fetchSalesAPI = async (query = "") => {
    const url = query ? `/api/sales?search=${query}` : "/api/sales";
    const res = await fetch(url);
    if (!res.ok) throw new Error("Gagal mengambil riwayat transaksi");
    const json = await res.json();
    return json.data || [];
  };

  const loadSales = async (query = "") => {
    setIsLoading(true);
    try {
      const data = await fetchSalesAPI(query);
      setSales(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesAPI()
      .then((data) => {
        setSales(data);
      })
      .catch(console.error)
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      loadSales(searchQuery);
    }
  };

  const handleVoid = async (id: number, invoice: string) => {
    if (
      !confirm(
        `HATI-HATI!\nAnda yakin ingin membatalkan nota ${invoice}?\nStok barang akan otomatis dikembalikan.`,
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/sales/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Gagal membatalkan transaksi");

      alert("Nota berhasil dibatalkan dan stok telah dikembalikan!");
      loadSales(searchQuery);
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Lunas":
        return "bg-green-100 text-green-700";
      case "DP":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-red-100 text-red-700";
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Riwayat Transaksi</h1>
          <p className="text-gray-500 text-sm">
            Kelola daftar penjualan, cek detail nota, dan batal transaksi.
          </p>
        </div>

        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Cari No. Nota atau Pelanggan (Enter)"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
      </div>

      {/* TABEL DATA */}
      <div className="border rounded-lg bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>No. Invoice</TableHead>
              <TableHead>Pelanggan</TableHead>
              <TableHead className="text-right">Total Transaksi</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center w-[120px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center h-24 text-gray-500"
                >
                  Memuat data...
                </TableCell>
              </TableRow>
            ) : sales.length > 0 ? (
              sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>
                    {new Date(sale.createdAt).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell className="font-semibold text-blue-600">
                    {sale.invoiceNumber}
                  </TableCell>
                  <TableCell>{sale.customerName || "-"}</TableCell>
                  <TableCell className="text-right font-bold">
                    Rp {sale.finalAmount.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(sale.paymentStatus)}`}
                    >
                      {sale.paymentStatus}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Lihat Detail"
                        onClick={() => {
                          setSelectedSale(sale);
                          setIsModalOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Batal Transaksi (Void)"
                        onClick={() => handleVoid(sale.id, sale.invoiceNumber)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center h-24 text-gray-500"
                >
                  Data transaksi tidak ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* MODAL DETAIL NOTA */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Detail Nota: {selectedSale?.invoiceNumber}
            </DialogTitle>
          </DialogHeader>

          {selectedSale && (
            <div className="space-y-6 py-2">
              {/* Info Pelanggan & Waktu */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Pelanggan</p>
                  <p className="font-semibold">
                    {selectedSale.customerName || "Noname / Umum"}
                  </p>
                  <p className="text-gray-600">
                    {selectedSale.customerPhone || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Waktu Transaksi</p>
                  <p className="font-semibold">
                    {new Date(selectedSale.createdAt).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              {/* Tabel Barang yang Dibeli */}
              <div>
                <h4 className="font-semibold mb-3">Daftar Pembelian</h4>
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader className="bg-gray-100">
                      <TableRow>
                        <TableHead>Produk</TableHead>
                        <TableHead className="text-center">Qty</TableHead>
                        <TableHead className="text-right">Harga</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedSale.saleItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            {item.product.name}
                            {item.product.isService && (
                              <span className="ml-2 text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                                Jasa
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {item.quantity}
                          </TableCell>
                          <TableCell className="text-right">
                            Rp {item.unitPrice.toLocaleString("id-ID")}
                          </TableCell>
                          <TableCell className="text-right font-medium">
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
                <div className="w-64 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>
                      Rp {selectedSale.totalAmount.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Diskon:</span>
                    <span>
                      Rp {selectedSale.discount.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-base border-t pt-2">
                    <span>Total Akhir:</span>
                    <span className="text-blue-600">
                      Rp {selectedSale.finalAmount.toLocaleString("id-ID")}
                    </span>
                  </div>

                  <div className="border-t pt-2 mt-2 space-y-1">
                    <div className="flex justify-between text-gray-600">
                      <span>Dibayar:</span>
                      <span>
                        Rp {selectedSale.paidAmount.toLocaleString("id-ID")}
                      </span>
                    </div>
                    {selectedSale.dueAmount > 0 && (
                      <div className="flex justify-between font-bold text-red-500 bg-red-50 p-1 rounded">
                        <span>Kekurangan:</span>
                        <span>
                          Rp {selectedSale.dueAmount.toLocaleString("id-ID")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Catatan Kasir */}
              {selectedSale.notes && (
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-sm flex gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                  <p className="text-yellow-800">
                    <strong>Catatan Kasir:</strong> {selectedSale.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
