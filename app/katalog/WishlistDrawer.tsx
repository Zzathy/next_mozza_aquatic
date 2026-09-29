"use client";

import React from "react";
import { X, Trash2, MessageCircle, Heart } from "lucide-react";
import ProductVisual from "./ProductVisual";
import { CatalogProduct } from "./types";

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedProducts: CatalogProduct[];
  onRemoveItem: (id: number) => void;
  onClearAll: () => void;
  onOpenDetail: (product: CatalogProduct) => void;
  storePhone?: string;
}

export default function WishlistDrawer({
  isOpen,
  onClose,
  savedProducts,
  onRemoveItem,
  onClearAll,
  onOpenDetail,
  storePhone = "6281234567890",
}: WishlistDrawerProps) {
  if (!isOpen) return null;

  const handleInquireAllWhatsApp = () => {
    if (savedProducts.length === 0) return;

    const itemsList = savedProducts
      .map((p, idx) => {
        const brand = p.brand ? ` [${p.brand}]` : "";
        const stockInfo = p.stock > 0 ? `(Stok katalog: ${p.stock} pcs)` : `(Stok tercatat kosong)`;
        return `${idx + 1}. *${p.name}*${brand} - ${stockInfo}`;
      })
      .join("\n");

    const message = `Halo Mozza Aquatic Banyuwangi, saya berencana mampir ke toko dan ingin menanyakan ketersediaan beberapa produk berikut:\n\n${itemsList}\n\nApakah barang-barang ini masih ready di etalase toko hari ini? Terima kasih!`;

    const cleanPhone = storePhone.replace(/[^0-9]/g, "");
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-white border-l border-zinc-200 h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-500 border border-rose-200">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-950">Produk Disimpan</h3>
              <p className="text-xs text-zinc-500">
                {savedProducts.length} produk dalam daftar pantauan Anda
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {savedProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500">
              <div className="w-16 h-16 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400 mb-3">
                <Heart className="w-7 h-7" />
              </div>
              <p className="font-semibold text-zinc-900">Belum Ada Produk Disimpan</p>
              <p className="text-xs text-zinc-500 mt-1 max-w-xs leading-relaxed">
                Klik ikon hati pada kartu produk untuk menyimpan barang yang ingin Anda tanyakan atau beli di toko Mozza Aquatic.
              </p>
            </div>
          ) : (
            savedProducts.map((p) => {
              const isReady = p.stock > 3;
              const isLow = p.stock > 0 && p.stock <= 3;
              const isOut = p.stock <= 0;

              return (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 hover:border-zinc-300 transition-colors group"
                >
                  <div
                    onClick={() => {
                      onOpenDetail(p);
                      onClose();
                    }}
                    className="w-14 h-14 rounded-lg overflow-hidden shrink-0 cursor-pointer bg-zinc-100 border border-zinc-200"
                  >
                    <ProductVisual
                      categorySlug={p.category?.slug}
                      categoryName={p.category?.name}
                      productName={p.name}
                      imageUrl={p.imageUrl}
                      className="w-full h-full"
                    />
                  </div>

                  <div
                    onClick={() => {
                      onOpenDetail(p);
                      onClose();
                    }}
                    className="flex-1 min-w-0 cursor-pointer"
                  >
                    <h4 className="text-xs font-bold text-zinc-950 truncate group-hover:text-zinc-700">
                      {p.name}
                    </h4>
                    <p className="text-[10px] text-zinc-500 truncate">
                      {p.category?.name} {p.brand ? `• ${p.brand}` : ""}
                    </p>
                    <div className="mt-1 flex items-center gap-1.5">
                      {isReady && (
                        <span className="text-[10px] font-medium text-zinc-800 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Ready ({p.stock} pcs)
                        </span>
                      )}
                      {isLow && (
                        <span className="text-[10px] font-medium text-zinc-800 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Sisa {p.stock} pcs
                        </span>
                      )}
                      {isOut && (
                        <span className="text-[10px] font-medium text-zinc-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                          Stok Habis
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveItem(p.id)}
                    className="p-2 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-zinc-200/60 transition-colors"
                    title="Hapus produk"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        {savedProducts.length > 0 && (
          <div className="p-5 border-t border-zinc-200 bg-zinc-50 space-y-2.5">
            <button
              type="button"
              onClick={handleInquireAllWhatsApp}
              className="w-full py-3 px-4 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
              <span>Tanya Semua ke WhatsApp ({savedProducts.length})</span>
            </button>

            <button
              type="button"
              onClick={onClearAll}
              className="w-full py-2 px-3 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50 text-xs transition-colors"
            >
              Kosongkan Daftar Simpan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
