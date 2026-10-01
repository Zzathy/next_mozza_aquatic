"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  RotateCcw,
  MessageCircle,
  Package,
  Layers,
  Leaf,
  Fish,
  Wrench,
  Utensils,
} from "lucide-react";
import PublicNavbar from "@/components/PublicNavbar";
import ProductCard from "./ProductCard";
import ProductDetailModal from "./ProductDetailModal";
import WishlistDrawer from "./WishlistDrawer";
import StoreInfoModal from "@/components/StoreInfoModal";
import { CatalogCategory, CatalogProduct, StockFilter, SortOption } from "./types";

interface KatalogClientProps {
  initialProducts: CatalogProduct[];
  categories: CatalogCategory[];
  storePhone?: string;
}

export default function KatalogClient({
  initialProducts,
  categories,
  storePhone = "6281234567890",
}: KatalogClientProps) {
  // Filters & Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedStock, setSelectedStock] = useState<StockFilter>("all");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>("default");

  // UI Dialog states
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isStoreInfoOpen, setIsStoreInfoOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // LocalStorage Wishlist
  const [savedIds, setSavedIds] = useState<number[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("mozza_catalog_wishlist");
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const saveToLocalStorage = (newIds: number[]) => {
    setSavedIds(newIds);
    try {
      localStorage.setItem("mozza_catalog_wishlist", JSON.stringify(newIds));
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleSave = (product: CatalogProduct) => {
    if (savedIds.includes(product.id)) {
      saveToLocalStorage(savedIds.filter((id) => id !== product.id));
    } else {
      saveToLocalStorage([...savedIds, product.id]);
    }
  };

  const handleRemoveSavedItem = (id: number) => {
    saveToLocalStorage(savedIds.filter((item) => item !== id));
  };

  const handleClearSaved = () => {
    saveToLocalStorage([]);
  };

  // Extract unique brands for brand tag filter
  const availableBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    initialProducts.forEach((p) => {
      if (p.brand && p.brand.trim() !== "") {
        brandsSet.add(p.brand.trim());
      }
    });
    return Array.from(brandsSet).sort();
  }, [initialProducts]);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    initialProducts.forEach((p) => {
      counts[p.categoryId] = (counts[p.categoryId] || 0) + 1;
    });
    return counts;
  }, [initialProducts]);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Filter Category
    if (selectedCategoryId !== null) {
      result = result.filter((p) => p.categoryId === selectedCategoryId);
    }

    // Filter Brand
    if (selectedBrand !== null) {
      result = result.filter((p) => p.brand === selectedBrand);
    }

    // Filter Stock Availability
    if (selectedStock === "ready") {
      result = result.filter((p) => p.stock > 3);
    } else if (selectedStock === "low") {
      result = result.filter((p) => p.stock > 0 && p.stock <= 3);
    } else if (selectedStock === "out") {
      result = result.filter((p) => p.stock <= 0);
    }

    // Filter Search Query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p) => {
        const nameMatch = p.name.toLowerCase().includes(q);
        const brandMatch = p.brand ? p.brand.toLowerCase().includes(q) : false;
        const catMatch = p.category?.name ? p.category.name.toLowerCase().includes(q) : false;
        const descMatch = p.description ? p.description.toLowerCase().includes(q) : false;
        return nameMatch || brandMatch || catMatch || descMatch;
      });
    }

    // Sorting
    if (sortOption === "stock-desc") {
      result.sort((a, b) => b.stock - a.stock);
    } else if (sortOption === "stock-asc") {
      result.sort((a, b) => a.stock - b.stock);
    } else if (sortOption === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "name-desc") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
  }, [
    initialProducts,
    selectedCategoryId,
    selectedBrand,
    selectedStock,
    searchQuery,
    sortOption,
  ]);

  // Saved products objects
  const savedProducts = useMemo(() => {
    return initialProducts.filter((p) => savedIds.includes(p.id));
  }, [initialProducts, savedIds]);

  // Current active category object
  const currentCategory = useMemo(() => {
    if (selectedCategoryId === null) return null;
    return categories.find((c) => c.id === selectedCategoryId) || null;
  }, [categories, selectedCategoryId]);

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategoryId(null);
    setSelectedStock("all");
    setSelectedBrand(null);
    setSortOption("default");
  };

  const isAnyFilterActive =
    searchQuery.trim() !== "" ||
    selectedCategoryId !== null ||
    selectedStock !== "all" ||
    selectedBrand !== null;

  // Category Icon helper
  const getCategoryIcon = (slugOrName: string) => {
    const s = slugOrName.toLowerCase();
    if (s.includes("tanam") || s.includes("plant")) return <Leaf className="w-4 h-4 text-zinc-600" />;
    if (s.includes("ikan") || s.includes("fish")) return <Fish className="w-4 h-4 text-zinc-600" />;
    if (s.includes("pakan") || s.includes("food")) return <Utensils className="w-4 h-4 text-zinc-600" />;
    if (s.includes("alat") || s.includes("tool")) return <Wrench className="w-4 h-4 text-zinc-600" />;
    return <Package className="w-4 h-4 text-zinc-600" />;
  };

  // WhatsApp Floating Button Handler
  const handleFloatingWhatsApp = () => {
    const cleanPhone = storePhone.replace(/[^0-9]/g, "");
    const message = "Halo Mozza Aquatic Banyuwangi, saya sedang melihat katalog produk di website dan ingin bertanya stok serta info toko.";
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  // Render Sidebar Content
  const renderSidebarFilters = () => (
    <div className="space-y-7">
      {/* Search Input in Sidebar */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
          Pencarian Produk
        </label>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari ikan, tanaman, alat..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 text-xs text-zinc-900 placeholder-zinc-400 transition-all outline-hidden"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Categories (W&B Plantify style) */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            Kategori
          </span>
          <span className="text-[10px] text-zinc-400 font-mono">
            {categories.length} KATEGORI
          </span>
        </div>

        <div className="space-y-1">
          {/* Semua Kategori */}
          <button
            type="button"
            onClick={() => {
              setSelectedCategoryId(null);
              setIsMobileFilterOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all ${
              selectedCategoryId === null
                ? "bg-zinc-950 text-white font-semibold shadow-xs"
                : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
            }`}
          >
            <div className="flex items-center gap-2.5 truncate">
              <Layers className={`w-4 h-4 ${selectedCategoryId === null ? "text-white" : "text-zinc-500"}`} />
              <span>Semua Kategori</span>
            </div>
            <span className="text-[10px] font-mono opacity-80">
              {initialProducts.length}
            </span>
          </button>

          {/* Dynamic Categories */}
          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            const count = categoryCounts[cat.id] || 0;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategoryId(cat.id);
                  setIsMobileFilterOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                  isSelected
                    ? "bg-zinc-950 text-white font-semibold shadow-xs"
                    : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className={isSelected ? "text-white" : ""}>
                    {getCategoryIcon(cat.slug || cat.name)}
                  </span>
                  <span className="truncate">{cat.name}</span>
                </div>
                <span className="text-[10px] font-mono opacity-80">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stock Availability Filter */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            Ketersediaan Stok Fisik
          </span>
        </div>

        <div className="space-y-1">
          {[
            { id: "all", label: "Semua Ketersediaan", dot: "bg-zinc-400" },
            { id: "ready", label: "Ready Stock (> 3 unit)", dot: "bg-emerald-500" },
            { id: "low", label: "Sisa Sedikit (1 - 3 unit)", dot: "bg-amber-500" },
            { id: "out", label: "Stok Habis Sementara", dot: "bg-zinc-400" },
          ].map((item) => {
            const isSelected = selectedStock === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSelectedStock(item.id as StockFilter);
                  setIsMobileFilterOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs transition-all ${
                  isSelected
                    ? "bg-zinc-100 text-zinc-950 font-semibold border border-zinc-300"
                    : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-2 h-2 rounded-full ${item.dot}`} />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Brand / Merk Filter Pills */}
      {availableBrands.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              Merk / Brand
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedBrand(null)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                selectedBrand === null
                  ? "bg-zinc-950 text-white font-bold border border-zinc-950 shadow-xs"
                  : "bg-zinc-100 text-zinc-600 hover:text-zinc-950 border border-zinc-200"
              }`}
            >
              SEMUA
            </button>
            {availableBrands.map((brand) => {
              const isSelected = selectedBrand === brand;
              return (
                <button
                  key={brand}
                  type="button"
                  onClick={() => {
                    setSelectedBrand(isSelected ? null : brand);
                    setIsMobileFilterOpen(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all uppercase ${
                    isSelected
                      ? "bg-zinc-950 text-white font-bold border border-zinc-950 shadow-xs"
                      : "bg-zinc-100 text-zinc-600 hover:text-zinc-950 border border-zinc-200"
                  }`}
                >
                  {brand}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Reset Button */}
      {isAnyFilterActive && (
        <button
          type="button"
          onClick={resetFilters}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-medium text-zinc-600 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Semua Filter</span>
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fbfbfb] text-zinc-900 selection:bg-zinc-200 selection:text-zinc-950">
      {/* Navbar */}
      <PublicNavbar
        savedCount={savedIds.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenStoreInfo={() => setIsStoreInfoOpen(true)}
        storePhone={storePhone}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Mobile Filter & Search Bar */}
        <div className="lg:hidden mb-6 flex items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari ikan, tanaman, alat..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 placeholder-zinc-400 shadow-xs outline-hidden"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-medium transition-all shadow-xs ${
              isAnyFilterActive
                ? "bg-zinc-950 text-white border-zinc-950"
                : "bg-white text-zinc-700 border-zinc-200"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filter</span>
            {isAnyFilterActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            )}
          </button>
        </div>

        {/* 2-Column Layout */}
        <div className="flex gap-8 items-start">
          {/* Left Sidebar (Desktop Only) */}
          <aside className="hidden lg:block w-64 shrink-0 sticky top-24">
            <div className="p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-xs">
              <div className="flex items-center gap-2 pb-4 mb-4 border-b border-zinc-100">
                <SlidersHorizontal className="w-4 h-4 text-zinc-700" />
                <h3 className="font-bold text-sm text-zinc-950">Filters</h3>
                <span className="ml-auto text-[9px] font-mono uppercase tracking-wider text-zinc-400">
                  KATALOG
                </span>
              </div>
              {renderSidebarFilters()}
            </div>
          </aside>

          {/* Right Content Area */}
          <div className="flex-1 min-w-0">
            {/* Header: Title + Active Pills + Sort Bar */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
                    {currentCategory ? currentCategory.name : "Katalog Mozza Aquatic"}
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                    Cek ketersediaan stok fisik produk langsung di galeri toko Mozza Aquatic Banyuwangi.
                  </p>
                </div>

                {/* Right: Counter & Sorting */}
                <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                    {filteredProducts.length} HASIL
                  </span>

                  {/* Sort Dropdown */}
                  <div className="relative">
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value as SortOption)}
                      className="appearance-none bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-800 text-xs py-2 pl-3 pr-8 rounded-xl shadow-xs outline-hidden cursor-pointer transition-colors"
                    >
                      <option value="default">Urutan: Standar</option>
                      <option value="stock-desc">Stok: Terbanyak</option>
                      <option value="stock-asc">Stok: Tersedikit</option>
                      <option value="name-asc">Nama: A - Z</option>
                      <option value="name-desc">Nama: Z - A</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Active Filter Chips */}
              {isAnyFilterActive && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {selectedCategoryId !== null && currentCategory && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800 border border-zinc-200 shadow-xs">
                      <span>Kategori: {currentCategory.name}</span>
                      <button
                        type="button"
                        onClick={() => setSelectedCategoryId(null)}
                        className="hover:text-zinc-950"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {selectedStock !== "all" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800 border border-zinc-200 shadow-xs">
                      <span>
                        Stok:{" "}
                        {selectedStock === "ready"
                          ? "Ready Stock"
                          : selectedStock === "low"
                          ? "Sisa Sedikit"
                          : "Habis"}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedStock("all")}
                        className="hover:text-zinc-950"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {selectedBrand !== null && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800 border border-zinc-200 shadow-xs">
                      <span>Merk: {selectedBrand}</span>
                      <button
                        type="button"
                        onClick={() => setSelectedBrand(null)}
                        className="hover:text-zinc-950"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {searchQuery.trim() !== "" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800 border border-zinc-200 shadow-xs">
                      <span>Cari: &quot;{searchQuery}&quot;</span>
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="hover:text-zinc-950"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-xs text-zinc-500 hover:text-zinc-950 hover:underline transition-colors pl-1"
                  >
                    Hapus Semua
                  </button>
                </div>
              )}
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-center rounded-2xl bg-white border border-zinc-200 p-8 shadow-xs">
                <div className="w-16 h-16 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400 mb-3">
                  <Package className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-lg text-zinc-950">Tidak Ada Produk Ditemukan</h3>
                <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-sm">
                  Coba ubah kata kunci pencarian atau sesuaikan filter kategori dan status ketersediaan.
                </p>
                {isAnyFilterActive && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="mt-4 px-4 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-xs transition-colors"
                  >
                    Reset Filter
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isSaved={savedIds.includes(product.id)}
                    onToggleSave={handleToggleSave}
                    onOpenDetail={(p) => setSelectedProduct(p)}
                    storePhone={storePhone}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating WhatsApp Bubble */}
      <button
        type="button"
        onClick={handleFloatingWhatsApp}
        aria-label="Chat WhatsApp Admin Mozza"
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-white hover:bg-zinc-50 text-zinc-950 border border-zinc-200 shadow-xl shadow-zinc-400/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center group"
      >
        <MessageCircle className="w-5 h-5 text-emerald-600 fill-emerald-600/20" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-semibold px-0 group-hover:px-2">
          Chat WhatsApp
        </span>
      </button>

      {/* Mobile Filters Slide-over / Sheet */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />
          <div className="relative w-full max-w-xs bg-white border-r border-zinc-200 h-full shadow-2xl p-5 overflow-y-auto flex flex-col z-10 animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-zinc-700" />
                <h3 className="font-bold text-sm text-zinc-950">Filter Katalog</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-950"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {renderSidebarFilters()}
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        isSaved={selectedProduct ? savedIds.includes(selectedProduct.id) : false}
        onToggleSave={handleToggleSave}
        storePhone={storePhone}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        savedProducts={savedProducts}
        onRemoveItem={handleRemoveSavedItem}
        onClearAll={handleClearSaved}
        onOpenDetail={(p) => setSelectedProduct(p)}
        storePhone={storePhone}
      />

      {/* Store Info & Location Modal */}
      <StoreInfoModal
        isOpen={isStoreInfoOpen}
        onClose={() => setIsStoreInfoOpen(false)}
        storePhone={storePhone}
      />
    </div>
  );
}
