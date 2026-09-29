"use client";

import React from "react";
import { MessageCircle, Heart, Info } from "lucide-react";
import ProductVisual from "./ProductVisual";
import { CatalogProduct } from "./types";

interface ProductCardProps {
  product: CatalogProduct;
  isSaved: boolean;
  onToggleSave: (product: CatalogProduct) => void;
  onOpenDetail: (product: CatalogProduct) => void;
  storePhone?: string;
}

export default function ProductCard({
  product,
  isSaved,
  onToggleSave,
  onOpenDetail,
  storePhone = "6281234567890",
}: ProductCardProps) {
  const stock = product.stock;
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 3;
  const isReady = stock > 3;

  // WhatsApp click handler
  const handleWhatsAppInquiry = (e: React.MouseEvent) => {
    e.stopPropagation();
    const brandText = product.brand ? ` (Merk: ${product.brand})` : "";
    const categoryText = product.category?.name ? ` [${product.category.name}]` : "";
    const stockNote = isOutOfStock
      ? "Keterangan di katalog saat ini tercatat kosong, apakah ada rencana restock?"
      : `Keterangan di katalog tercatat ready ${stock} unit. Apakah barang ini masih bisa dibeli langsung di toko hari ini?`;

    const message = `Halo Mozza Aquatic Banyuwangi, saya ingin menanyakan ketersediaan produk:\n\n*${product.name}*${brandText}${categoryText}\n\n${stockNote}\n\nTerima kasih!`;

    const cleanPhone = storePhone.replace(/[^0-9]/g, "");
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      onClick={() => onOpenDetail(product)}
      className="group relative flex flex-col justify-between rounded-2xl bg-white border border-zinc-200/90 hover:border-zinc-400 hover:shadow-xl hover:shadow-zinc-200/50 transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Visual Area with badges */}
      <div className="relative">
        <ProductVisual
          categorySlug={product.category?.slug}
          categoryName={product.category?.name}
          productName={product.name}
          imageUrl={product.imageUrl}
          className="h-48 sm:h-52 w-full"
        />

        {/* Top Badges Bar */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-20">
          {/* Stock Availability Pill */}
          <div className="pointer-events-auto">
            {isReady && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide bg-white/95 text-zinc-900 border border-zinc-200 shadow-xs backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Ready Stock
              </span>
            )}
            {isLowStock && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide bg-white/95 text-zinc-800 border border-zinc-200 shadow-xs backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Sisa {stock} unit
              </span>
            )}
            {isOutOfStock && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide bg-white/95 text-zinc-400 border border-zinc-200 shadow-xs backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                Stok Habis
              </span>
            )}
          </div>

          {/* Bookmark / Wishlist Heart Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(product);
            }}
            aria-label={isSaved ? "Hapus dari simpanan" : "Simpan produk"}
            className={`pointer-events-auto p-2 rounded-full backdrop-blur-md transition-all duration-200 shadow-xs ${
              isSaved
                ? "bg-rose-50 text-rose-500 border border-rose-200"
                : "bg-white/90 text-zinc-400 hover:text-zinc-950 hover:bg-white border border-zinc-200"
            }`}
          >
            <Heart
              className={`w-4 h-4 transition-transform duration-200 ${
                isSaved ? "fill-rose-500 scale-110" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-4">
        <div>
          {/* Eyebrow: Category & Brand */}
          <div className="flex items-center justify-between gap-2 text-[10px] tracking-wider uppercase font-semibold text-zinc-500 mb-1.5">
            <span className="truncate">
              {product.category?.name || "Kategori"}
              {product.brand ? ` • ${product.brand}` : ""}
            </span>
            {product.isService && (
              <span className="px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700 text-[9px] border border-zinc-200">
                Layanan
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold text-zinc-950 tracking-tight leading-snug line-clamp-1 group-hover:text-zinc-700 transition-colors">
            {product.name}
          </h3>

          {/* Description */}
          <p className="mt-1 text-xs text-zinc-600 line-clamp-2 leading-relaxed">
            {product.description ||
              "Produk tersedia untuk pembelian langsung di toko fisik Mozza Aquatic Banyuwangi."}
          </p>

          {/* Spec Pills */}
          <div className="mt-3.5 pt-3 border-t border-zinc-100 grid grid-cols-2 gap-2 text-[10px] uppercase font-mono tracking-wider">
            <div className="bg-zinc-50 px-2.5 py-1.5 rounded-lg border border-zinc-200/80 flex flex-col">
              <span className="text-[9px] text-zinc-400 font-mono">Ketersediaan</span>
              <span className={`font-semibold ${isOutOfStock ? "text-zinc-400" : "text-zinc-900"}`}>
                {isOutOfStock ? "KOSONG" : `${stock} TERSEDIA`}
              </span>
            </div>
            <div className="bg-zinc-50 px-2.5 py-1.5 rounded-lg border border-zinc-200/80 flex flex-col">
              <span className="text-[9px] text-zinc-400 font-mono">Merk / Tipe</span>
              <span className="font-semibold text-zinc-800 truncate">
                {product.brand || "ORIGINAL"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button: WhatsApp Inquiry */}
        <div className="pt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={handleWhatsAppInquiry}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl font-semibold text-xs transition-all duration-200 shadow-xs ${
              isOutOfStock
                ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-600 border border-zinc-200"
                : "bg-zinc-950 hover:bg-zinc-800 text-white active:scale-98"
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
            <span>{isOutOfStock ? "Tanya Restock WA" : "Tanya Stok di WA"}</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail(product);
            }}
            title="Lihat Detail Produk"
            className="p-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-950 border border-zinc-200/80 transition-colors"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
