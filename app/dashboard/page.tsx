"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  Wallet,
  Package,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Database,
  Award,
} from "lucide-react";

interface DashboardData {
  periode: string;
  totalTransaksi: number;
  labaRugi: {
    totalOmset: number;
    totalModal: number;
    totalPengeluaran: number;
    labaKotor: number;
    labaBersih: number;
  };
  arusKas: {
    uangMasuk: number;
    uangKeluar: number;
    selisihKas: number;
  };
  aset: {
    totalAsetGudang: number;
  };
  insights: {
    topSellingProducts: {
      id: number;
      name: string;
      soldQuantity: number;
      revenue: number;
    }[];
    lowStockAlerts: { id: number; name: string; currentStock: number }[];
  };
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((json) => {
        if (json.data) setData(json.data);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 animate-pulse">
            Menghitung performa bisnis...
          </p>
        </div>
      </div>
    );
  }

  if (!data) return <div className="p-8">Gagal memuat data.</div>;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Beranda Analytics</h1>
        <p className="text-gray-500 mt-1">
          Rekapan otomatis bulan ini ({data.periode}).
        </p>
      </div>

      {/* HIGHLIGHT METRIK KEUANGAN */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Omset / Pendapatan Kotor */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                Total Omset
              </p>
              <h3 className="text-2xl font-bold text-gray-800">
                Rp {data.labaRugi.totalOmset.toLocaleString("id-ID")}
              </h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            {data.totalTransaksi} transaksi bulan ini
          </p>
        </div>

        {/* Laba Bersih */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                Laba Bersih
              </p>
              <h3
                className={`text-2xl font-bold ${data.labaRugi.labaBersih >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                Rp {data.labaRugi.labaBersih.toLocaleString("id-ID")}
              </h3>
            </div>
            <div
              className={`p-3 rounded-lg ${data.labaRugi.labaBersih >= 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
            >
              <Wallet className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Setelah dikurangi modal & pengeluaran
          </p>
        </div>

        {/* Selisih Arus Kas */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                Uang Masuk - Keluar
              </p>
              <h3
                className={`text-2xl font-bold ${data.arusKas.selisihKas >= 0 ? "text-emerald-600" : "text-orange-600"}`}
              >
                Rp {data.arusKas.selisihKas.toLocaleString("id-ID")}
              </h3>
            </div>
            <div className="p-3 bg-gray-100 text-gray-600 rounded-lg">
              {data.arusKas.selisihKas >= 0 ? (
                <ArrowUpRight className="w-6 h-6 text-emerald-600" />
              ) : (
                <ArrowDownRight className="w-6 h-6 text-orange-600" />
              )}
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">Arus kas bersih saat ini</p>
        </div>

        {/* Aset Gudang */}
        <div className="bg-white p-6 rounded-xl border shadow-sm border-indigo-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                Nilai Aset Gudang
              </p>
              <h3 className="text-2xl font-bold text-indigo-700">
                Rp {data.aset.totalAsetGudang.toLocaleString("id-ID")}
              </h3>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
              <Database className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Estimasi modal ngendap di stok fisik
          </p>
        </div>
      </div>

      {/* BAGIAN BAWAH: INSIGHTS & WARNING */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Produk Terlaris */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="p-5 border-b bg-amber-50 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            <h3 className="font-semibold text-amber-900">
              Produk Paling Laris
            </h3>
          </div>
          <div className="p-0">
            {data.insights.topSellingProducts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Belum ada data penjualan bulan ini.
              </div>
            ) : (
              <div className="divide-y">
                {data.insights.topSellingProducts.map((p, index) => (
                  <div
                    key={p.id}
                    className="p-4 flex justify-between items-center hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <p className="font-medium text-gray-800">{p.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">
                        {p.soldQuantity} Terjual
                      </p>
                      <p className="text-xs text-gray-500">
                        Omset: Rp {p.revenue.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Peringatan Stok */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="p-5 border-b bg-red-50 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold text-red-800">
              Stok Kritis (Segera Restock!)
            </h3>
          </div>
          <div className="p-0">
            {data.insights.lowStockAlerts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Package className="w-10 h-10 mx-auto mb-2 opacity-20" />
                <p>Semua stok produk masih aman.</p>
              </div>
            ) : (
              <div className="divide-y">
                {data.insights.lowStockAlerts.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 flex justify-between items-center hover:bg-gray-50"
                  >
                    <p className="font-medium text-gray-800">{p.name}</p>
                    <span className="inline-block px-3 py-1 bg-red-100 text-red-700 font-bold rounded-full text-sm">
                      Sisa {p.currentStock}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
