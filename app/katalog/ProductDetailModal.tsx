"use client";

import React from "react";
import { X, MessageCircle, Heart, Store, Share2 } from "lucide-react";
import ProductVisual from "./ProductVisual";
import { CatalogProduct } from "./types";

interface ProductDetailModalProps {
  product: CatalogProduct | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (product: CatalogProduct) => void;
  storePhone?: string;
}

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
  isSaved,
  onToggleSave,
  storePhone = "6281234567890",
}: ProductDetailModalProps) {
  if (!isOpen || !product) return null;

  const stock = product.stock;
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 3;
  const isReady = stock > 3;

  const handleWhatsAppInquiry = () => {
    const brandText = product.brand ? ` (Merk: ${product.brand})` : "";
    const categoryText = product.category?.name ? ` [${product.category.name}]` : "";
    const stockNote = isOutOfStock
      ? "Keterangan di katalog saat ini tercatat kosong, apakah ada rencana restock dalam waktu dekat?"
      : `Keterangan di katalog tercatat ready ${stock} unit. Apakah barang ini masih bisa dibeli langsung di toko hari ini?`;

    const message = `Halo Mozza Aquatic Banyuwangi, saya tertarik dengan produk:\n\n*${product.name}*${brandText}${categoryText}\n\n${stockNote}\n\nMohon informasinya ya, terima kasih!`;

    const cleanPhone = storePhone.replace(/[^0-9]/g, "");
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      alert("Tautan katalog berhasil disalin!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-xl rounded-2xl sm:rounded-3xl bg-white border border-zinc-200 shadow-2xl shadow-zinc-950/20 overflow-hidden z-10 my-8 flex flex-col max-h-[90vh]">
        {/* Header Visual */}
        <div className="relative">
          <ProductVisual
            categorySlug={product.category?.slug}
            categoryName={product.category?.name}
            productName={product.name}
            imageUrl={product.imageUrl}
            className="h-56 sm:h-64 w-full"
          />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white text-zinc-600 hover:text-zinc-950 backdrop-blur-md transition-colors z-20 border border-zinc-200 shadow-xs"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Stock Badge */}
          <div className="absolute top-4 left-4 z-20">
            {isReady && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/95 text-zinc-900 border border-zinc-200 shadow-xs backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Ready Stock di Toko
              </span>
            )}
            {isLowStock && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/95 text-zinc-800 border border-zinc-200 shadow-xs backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Sisa Sedikit ({stock} unit)
              </span>
            )}
            {isOutOfStock && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/95 text-zinc-500 border border-zinc-200 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-zinc-400" />
                Stok Habis Sementara
              </span>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 flex flex-col gap-5 text-zinc-700">
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold text-zinc-500 mb-1">
              {product.category?.name || "Kategori"} {product.brand ? `• ${product.brand}` : ""}
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-950 tracking-tight">
              {product.name}
            </h2>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200/80 flex flex-col">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Kategori</span>
              <span className="font-semibold text-zinc-900 mt-0.5">{product.category?.name}</span>
            </div>
            <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200/80 flex flex-col">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Merk / Brand</span>
              <span className="font-semibold text-zinc-900 mt-0.5">{product.brand || "Original"}</span>
            </div>
            <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200/80 flex flex-col col-span-2 sm:col-span-1">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Stok Fisik</span>
              <span className={`font-semibold mt-0.5 ${isOutOfStock ? "text-zinc-400" : "text-zinc-900"}`}>
                {isOutOfStock ? "0 Unit (Habis)" : `${stock} Unit Tersedia`}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Deskripsi Produk
            </h4>
            <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-line bg-zinc-50 p-3.5 rounded-xl border border-zinc-200/80">
              {product.description ||
                "Produk berkualitas untuk kebutuhan aquascape & ikan hias Anda. Kunjungi langsung galeri toko Mozza Aquatic di Banyuwangi atau hubungi admin via WhatsApp untuk memastikan ketersediaan barang dan konsultasi gratis."}
            </p>
          </div>

          {/* Store Offline Notice */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-700">
            <Store className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-zinc-900">Tersedia di Toko Fisik Mozza Aquatic</p>
              <p className="text-[11px] text-zinc-500 mt-0.5 leading-snug">
                Data ketersediaan stok tersinkronisasi langsung dengan sistem kasir toko. Disarankan konfirmasi via WhatsApp terlebih dahulu sebelum datang ke toko.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 bg-zinc-50 border-t border-zinc-200 flex items-center gap-3">
          <button
            type="button"
            onClick={() => onToggleSave(product)}
            className={`p-3 rounded-xl border transition-all ${
              isSaved
                ? "bg-rose-50 text-rose-500 border-rose-200"
                : "bg-white hover:bg-zinc-100 text-zinc-600 border-zinc-200"
            }`}
            title={isSaved ? "Hapus dari simpanan" : "Simpan produk"}
          >
            <Heart className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className="p-3 rounded-xl bg-white hover:bg-zinc-100 text-zinc-600 hover:text-zinc-950 border border-zinc-200 transition-colors"
            title="Bagikan Tautan"
          >
            <Share2 className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleWhatsAppInquiry}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-sm shadow-xs transition-all active:scale-98"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
            <span>{isOutOfStock ? "Tanya Rencana Restock" : "Tanya / Keep via WhatsApp"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
