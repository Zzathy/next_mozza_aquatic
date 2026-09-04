"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Wallet,
  Package,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Database,
  Award,
  ShoppingCart,
  Calendar,
  Sparkles,
  ArrowRight,
  Receipt,
  Scale,
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
      <div className="flex h-full min-h-[500px] items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-base font-semibold text-gray-700">
            Menghitung ringkasan bisnis...
          </p>
          <p className="text-xs text-gray-400 mt-1">Mozza Aquatic Banyuwangi</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-gray-500">
        <AlertCircle className="w-12 h-12 mx-auto mb-2 text-rose-500 opacity-60" />
        <p className="text-base font-bold text-gray-800">
          Gagal memuat ringkasan data.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700"
        >
          Coba Muat Ulang
        </button>
      </div>
    );
  }

  const highestRevenue =
    data.insights.topSellingProducts.length > 0
      ? Math.max(...data.insights.topSellingProducts.map((p) => p.revenue))
      : 1;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* BANNER HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-7 text-white shadow-xl border border-slate-800">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ringkasan Operasional Toko</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white">
              Dashboard Mozza Aquatic
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              Pantau arus kas, laba bersih, dan kesehatan stok tokomu secara
              real-time untuk periode{" "}
              <span className="text-blue-300 font-bold">{data.periode}</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold">
              <Calendar className="w-4 h-4 text-blue-300" />
              <span>{data.periode}</span>
            </div>
            <Link
              href="/dashboard/kasir"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold shadow-lg shadow-blue-600/30 transition-all active:scale-95"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Buka Kasir Sekarang</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4 KARTU UTAMA FINANSIAL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
        {/* TOTAL OMSET */}
        <div className="bg-white p-5 rounded-2xl border-2 border-gray-200/90 shadow-xs hover:border-blue-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Total Omset
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-gray-950 tracking-tight">
              Rp {data.labaRugi.totalOmset.toLocaleString("id-ID")}
            </div>
            <p className="text-xs font-semibold text-gray-500 mt-1.5 flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5 text-blue-600" />
              <span>{data.totalTransaksi} transaksi penjualan</span>
            </p>
          </div>
        </div>

        {/* LABA BERSIH */}
        <div className="bg-white p-5 rounded-2xl border-2 border-gray-200/90 shadow-xs hover:border-emerald-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Laba Bersih
            </span>
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                data.labaRugi.labaBersih >= 0
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-rose-50 text-rose-600"
              }`}
            >
              <Wallet className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-3">
            <div
              className={`text-2xl font-black tracking-tight ${
                data.labaRugi.labaBersih >= 0
                  ? "text-emerald-600"
                  : "text-rose-600"
              }`}
            >
              Rp {data.labaRugi.labaBersih.toLocaleString("id-ID")}
            </div>
            <p className="text-xs font-semibold text-gray-500 mt-1.5">
              Setelah dikurangi modal & operasional
            </p>
          </div>
        </div>

        {/* ARUS KAS BERSIH */}
        <div className="bg-white p-5 rounded-2xl border-2 border-gray-200/90 shadow-xs hover:border-cyan-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Arus Kas Bersih
            </span>
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                data.arusKas.selisihKas >= 0
                  ? "bg-cyan-50 text-cyan-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {data.arusKas.selisihKas >= 0 ? (
                <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
              ) : (
                <ArrowDownRight className="w-5 h-5 stroke-[2.5]" />
              )}
            </div>
          </div>
          <div className="mt-3">
            <div
              className={`text-2xl font-black tracking-tight ${
                data.arusKas.selisihKas >= 0 ? "text-cyan-800" : "text-amber-800"
              }`}
            >
              Rp {data.arusKas.selisihKas.toLocaleString("id-ID")}
            </div>
            <p className="text-xs font-semibold text-gray-500 mt-1.5">
              Uang Masuk - Uang Keluar kasir
            </p>
          </div>
        </div>

        {/* NILAI ASET GUDANG */}
        <div className="bg-white p-5 rounded-2xl border-2 border-gray-200/90 shadow-xs hover:border-indigo-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Nilai Aset Stok
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Database className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-indigo-900 tracking-tight">
              Rp {data.aset.totalAsetGudang.toLocaleString("id-ID")}
            </div>
            <p className="text-xs font-semibold text-gray-500 mt-1.5">
              Estimasi modal ngendap di fisik produk
            </p>
          </div>
        </div>
      </div>

      {/* RINCIAN LABA RUGI & ARUS KAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* KARTU BREAKDOWN LABA RUGI */}
        <div className="bg-white p-6 rounded-3xl border-2 border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-gray-900">
                  Rincian Laba & Rugi
                </h3>
                <p className="text-xs text-gray-500">Perhitungan bisnis bulan ini</p>
              </div>
            </div>
            <span className="text-xs font-extrabold bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
              Laba Bersih: Rp {data.labaRugi.labaBersih.toLocaleString("id-ID")}
            </span>
          </div>

          <div className="mt-5 space-y-3.5">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-gray-600">Total Omset (Penjualan)</span>
              <span className="font-bold text-gray-900">
                + Rp {data.labaRugi.totalOmset.toLocaleString("id-ID")}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-gray-600">Modal Pokok Penjualan (HPP)</span>
              <span className="font-bold text-rose-600">
                - Rp {data.labaRugi.totalModal.toLocaleString("id-ID")}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-100">
              <span className="font-semibold text-gray-700">Laba Kotor</span>
              <span className="font-extrabold text-gray-950">
                Rp {data.labaRugi.labaKotor.toLocaleString("id-ID")}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-gray-600">Biaya Pengeluaran Toko</span>
              <span className="font-bold text-rose-600">
                - Rp {data.labaRugi.totalPengeluaran.toLocaleString("id-ID")}
              </span>
            </div>

            <div className="flex justify-between items-center pt-3 border-t-2 border-dashed border-gray-200">
              <span className="font-extrabold text-base text-gray-900">
                Laba Bersih Akhir
              </span>
              <span
                className={`text-xl font-black ${
                  data.labaRugi.labaBersih >= 0
                    ? "text-emerald-600"
                    : "text-rose-600"
                }`}
              >
                Rp {data.labaRugi.labaBersih.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>

        {/* KARTU BREAKDOWN ARUS KAS */}
        <div className="bg-white p-6 rounded-3xl border-2 border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-gray-900">
                  Arus Kas Toko (Cashflow)
                </h3>
                <p className="text-xs text-gray-500">Mutasi fisik uang kas masuk & keluar</p>
              </div>
            </div>
            <span className="text-xs font-extrabold bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
              Net Kasir
            </span>
          </div>

          <div className="mt-5 space-y-3.5">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-gray-600">Uang Diterima Penjualan (Kas Masuk)</span>
              <span className="font-bold text-emerald-600">
                + Rp {data.arusKas.uangMasuk.toLocaleString("id-ID")}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-gray-600">Total Pengeluaran Toko (Kas Keluar)</span>
              <span className="font-bold text-rose-600">
                - Rp {data.arusKas.uangKeluar.toLocaleString("id-ID")}
              </span>
            </div>

            <div className="pt-8">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-500 block uppercase">
                    Saldo Bersih Arus Kas
                  </span>
                  <span
                    className={`text-xl font-black mt-0.5 block ${
                      data.arusKas.selisihKas >= 0
                        ? "text-cyan-800"
                        : "text-amber-800"
                    }`}
                  >
                    Rp {data.arusKas.selisihKas.toLocaleString("id-ID")}
                  </span>
                </div>
                <div
                  className={`px-3 py-1 rounded-xl text-xs font-bold ${
                    data.arusKas.selisihKas >= 0
                      ? "bg-cyan-100 text-cyan-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {data.arusKas.selisihKas >= 0 ? "Surplus Kas" : "Defisit Kas"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION BAWAH: PRODUK TERLARIS & PERINGATAN STOK */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PRODUK PALING LARIS */}
        <div className="bg-white rounded-3xl border-2 border-gray-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-amber-50/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Award className="w-4 h-4 stroke-[2.5]" />
              </div>
              <h3 className="font-extrabold text-gray-900 text-base">
                Produk Paling Laris
              </h3>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
              Bulan Ini
            </span>
          </div>

          <div className="p-4">
            {data.insights.topSellingProducts.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <Package className="w-12 h-12 mx-auto mb-2 opacity-30 text-gray-500" />
                <p className="text-sm font-semibold text-gray-600">
                  Belum ada data transaksi penjualan bulan ini
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.insights.topSellingProducts.map((p, index) => {
                  const percent = Math.min(
                    100,
                    Math.round((p.revenue / highestRevenue) * 100),
                  );

                  return (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/80 hover:bg-amber-50/30 transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-7 h-7 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-black shrink-0">
                            #{index + 1}
                          </span>
                          <p className="font-bold text-sm text-gray-900 truncate">
                            {p.name}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-sm font-extrabold text-gray-900">
                            {p.soldQuantity} Terjual
                          </span>
                          <span className="text-xs font-semibold text-gray-500 block">
                            Rp {p.revenue.toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>

                      {/* PROGRESS BAR VISUAL */}
                      <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* PERINGATAN STOK KRITIS */}
        <div className="bg-white rounded-3xl border-2 border-gray-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-rose-50/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 stroke-[2.5]" />
              </div>
              <h3 className="font-extrabold text-gray-900 text-base">
                Peringatan Stok Kritis
              </h3>
            </div>
            <Link
              href="/dashboard/pembelian"
              className="text-xs font-bold text-rose-700 hover:text-rose-800 hover:underline"
            >
              Kulakan Sekarang &rarr;
            </Link>
          </div>

          <div className="p-4">
            {data.insights.lowStockAlerts.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <Package className="w-12 h-12 mx-auto mb-2 opacity-30 text-emerald-500" />
                <p className="text-sm font-bold text-gray-700">
                  Semua stok produk masih aman!
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Tidak ada produk yang berada di bawah batas minimum stok.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {data.insights.lowStockAlerts.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-2xl bg-rose-50/40 border border-rose-200/80 flex items-center justify-between gap-3 hover:bg-rose-50 transition-all"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-gray-900 truncate">
                        {p.name}
                      </p>
                      <span className="text-xs font-semibold text-rose-600">
                        Perlu restock segera
                      </span>
                    </div>

                    <span className="inline-flex items-center px-3 py-1 bg-rose-100 text-rose-800 font-extrabold rounded-xl text-xs shrink-0">
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
