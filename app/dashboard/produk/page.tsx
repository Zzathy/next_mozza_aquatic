"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Plus,
  Trash2,
  Pencil,
  Search,
  Package,
  Layers,
  X,
  Sparkles,
  Tag,
  AlertCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast-context";
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

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  brand?: string | null;
  category?: Category;
  categoryId: number;
  price: number;
  minStock: number;
  stock?: number;
  description: string | null;
  isActive?: boolean;
  isService?: boolean;
}

type SortField = "name" | "brand" | "price" | "category" | "stock" | "minStock";
type SortOrder = "asc" | "desc";

export default function ProductPage() {
  const { success, error } = useToast();
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>("all");

  const [sortField, setSortField] = useState<SortField | null>("brand");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [minStock, setMinStock] = useState("");
  const [description, setDescription] = useState("");
  const [isService, setIsService] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const [newCategoryName, setNewCategoryName] = useState("");

  const fetchProductsAPI = async () => {
    const res = await fetch("/api/products");
    if (!res.ok) throw new Error("Gagal ambil data");
    const json = await res.json();
    return json.data || [];
  };

  const fetchCategoriesAPI = async () => {
    const res = await fetch("/api/categories");
    if (!res.ok) throw new Error("Gagal ambil data");
    const json = await res.json();
    return json.data || [];
  };

  const refreshProducts = useCallback(async () => {
    try {
      const data = await fetchProductsAPI();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const refreshCategories = useCallback(async () => {
    try {
      const data = await fetchCategoriesAPI();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
    refreshCategories();
  }, [refreshProducts, refreshCategories]);

  const resetForm = () => {
    setEditingProductId(null);
    setName("");
    setBrand("");
    setCategoryId("");
    setPrice("");
    setMinStock("");
    setDescription("");
    setIsService(false);
    setIsActive(true);
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName }),
      });

      if (!response.ok) throw new Error("Gagal menambah kategori");

      const resData = await response.json();
      await refreshCategories();

      setCategoryId(String(resData.data?.id || ""));
      setNewCategoryName("");
      setIsCategoryModalOpen(false);
      success("Kategori baru berhasil ditambahkan!");
    } catch (err) {
      console.error(err);
      error("Gagal menambah kategori baru!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        name: name.trim(),
        brand: brand.trim() || null,
        categoryId: Number(categoryId),
        price: Number(price),
        minStock: Number(minStock),
        description: description.trim() || null,
        isService,
        isActive,
      };

      const url = editingProductId
        ? `/api/products/${editingProductId}`
        : "/api/products";
      const method = editingProductId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menyimpan produk");
      }

      await refreshProducts();
      setIsProductModalOpen(false);
      resetForm();
      success(
        editingProductId
          ? "Data produk berhasil diperbarui!"
          : "Produk baru berhasil disimpan!",
      );
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        error(err.message);
      } else {
        error("Gagal memproses data produk.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (product: Product) => {
    setEditingProductId(product.id);
    setName(product.name);
    setBrand(product.brand || "");
    setCategoryId(String(product.categoryId || product.category?.id || ""));
    setPrice(String(product.price));
    setMinStock(String(product.minStock));
    setDescription(product.description || "");
    setIsService(Boolean(product.isService));
    setIsActive(product.isActive !== false);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Apakah yakin ingin menghapus produk ini?")) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Gagal hapus produk");
      await refreshProducts();
      success("Produk berhasil dihapus!");
    } catch (err) {
      console.error(err);
      error("Gagal menghapus produk.");
    }
  };

  const availableBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    products.forEach((p) => {
      if (p.brand && p.brand.trim() !== "") {
        brandsSet.add(p.brand.trim());
      }
    });
    return Array.from(brandsSet).sort();
  }, [products]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchQuery =
        p.name.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.category?.name && p.category.name.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q));

      const matchCategory =
        selectedCategory === "all" ||
        String(p.categoryId || p.category?.id) === selectedCategory;

      const matchBrand =
        selectedBrandFilter === "all" ||
        (selectedBrandFilter === "no-brand" && (!p.brand || p.brand.trim() === "")) ||
        p.brand?.toLowerCase() === selectedBrandFilter.toLowerCase();

      return matchQuery && matchCategory && matchBrand;
    });

    if (sortField) {
      result = [...result].sort((a, b) => {
        if (sortField === "brand") {
          const aVal = a.brand || "";
          const bVal = b.brand || "";
          if (!aVal && bVal) return 1;
          if (aVal && !bVal) return -1;
          return sortOrder === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }
        if (sortField === "name") {
          return sortOrder === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        }
        if (sortField === "category") {
          const aVal = a.category?.name || "";
          const bVal = b.category?.name || "";
          return sortOrder === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }
        if (sortField === "price") {
          return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
        }
        if (sortField === "stock") {
          const aVal = a.isService ? 999999 : (a.stock ?? 0);
          const bVal = b.isService ? 999999 : (b.stock ?? 0);
          return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
        }
        if (sortField === "minStock") {
          return sortOrder === "asc"
            ? a.minStock - b.minStock
            : b.minStock - a.minStock;
        }
        return 0;
      });
    }

    return result;
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedBrandFilter,
    sortField,
    sortOrder,
  ]);

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 ml-1 inline opacity-60" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="w-3.5 h-3.5 text-blue-600 ml-1 inline stroke-[2.5]" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-blue-600 ml-1 inline stroke-[2.5]" />
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-5 sm:space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              <Package className="w-3.5 h-3.5" />
              Master Data
            </span>
            <span className="text-xs text-gray-500">
              Total {products.length} item terdaftar
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">
            Katalog & Master Produk
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Atur merk, nama model, kategori, harga jual, dan batas peringatan stok minimal.
          </p>
        </div>

        {/* MODAL TRIGGER */}
        <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
          <Button
            onClick={() => {
              resetForm();
              setIsProductModalOpen(true);
            }}
            className="h-11 px-5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold shadow-md shadow-blue-500/25 active:scale-95 transition-all self-start sm:self-auto flex items-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Tambah Produk Baru</span>
          </Button>

          <DialogContent className="sm:max-w-[520px] rounded-3xl p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span>
                  {editingProductId ? "Ubah Data Produk" : "Tambah Produk Baru"}
                </span>
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500">
                {editingProductId
                  ? "Perbarui informasi produk, merk, dan harga jual di bawah."
                  : "Tambahkan produk baru ke dalam database master Mozza Aquatic."}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleProductSubmit} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="brand" className="text-xs font-bold text-gray-700">
                    Merk / Brand (Opsional)
                  </Label>
                  <Input
                    id="brand"
                    placeholder="Misal: Kandila, Takari, Agaru"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="h-10 text-sm rounded-xl font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-bold text-gray-700">
                    Nama / Model Produk <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Misal: ECO-103, Floating M, Guppy"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-10 text-sm rounded-xl font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-bold text-gray-700">
                    Kategori Produk <span className="text-rose-500">*</span>
                  </Label>
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(true)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Kategori Baru
                  </button>
                </div>
                <Select
                  value={categoryId}
                  onValueChange={(val) => setCategoryId(val || "")}
                  required
                >
                  <SelectTrigger className="h-10 text-sm rounded-xl font-medium w-full">
                    <SelectValue placeholder="Pilih Kategori Produk">
                      {categories.find((cat) => String(cat.id) === categoryId)?.name}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="price" className="text-xs font-bold text-gray-700">
                    Harga Jual (Rp) <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    placeholder="Contoh: 15000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="h-10 text-sm rounded-xl font-bold font-mono"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="minStock" className="text-xs font-bold text-gray-700">
                    Min. Stok Kritis
                  </Label>
                  <Input
                    id="minStock"
                    type="number"
                    min="0"
                    placeholder="Contoh: 5"
                    value={minStock}
                    onChange={(e) => setMinStock(e.target.value)}
                    className="h-10 text-sm rounded-xl font-bold font-mono"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs font-bold text-gray-700">
                  Deskripsi / Keterangan (Opsional)
                </Label>
                <Input
                  id="description"
                  placeholder="Catatan pakan, watt mesin, atau garansi"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-10 text-sm rounded-xl font-medium"
                />
              </div>

              {/* TOGGLE JASA / LAYANAN & STATUS AKTIF */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <label className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-200 cursor-pointer hover:bg-gray-100/70 transition-colors">
                  <input
                    type="checkbox"
                    checked={isService}
                    onChange={(e) => setIsService(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">Jasa / Layanan</span>
                    <span className="text-[11px] text-gray-500 font-medium">Tanpa stok fisik (setting/servis)</span>
                  </div>
                </label>

                {editingProductId && (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-200">
                    <div>
                      <span className="text-xs font-bold text-gray-900 block">Status Produk</span>
                      <span className="text-[11px] text-gray-500 font-medium">Aktif untuk dijual</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsActive(!isActive)}
                      className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all ${
                        isActive
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-gray-200 text-gray-600 border border-gray-300"
                      }`}
                    >
                      {isActive ? "Aktif" : "Nonaktif"}
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl h-10 px-4 text-xs font-bold"
                  onClick={() => setIsProductModalOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-xl h-10 px-5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs"
                >
                  {isLoading
                    ? "Menyimpan..."
                    : editingProductId
                      ? "Simpan Perubahan"
                      : "Simpan Produk"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* MODAL KATEGORI BARU */}
      <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
        <DialogContent className="sm:max-w-[420px] rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
              <Tag className="w-4 h-4 text-blue-600" />
              <span>Tambah Kategori Baru</span>
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCategorySubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-gray-700">Nama Kategori</Label>
              <Input
                placeholder="Misal: Tanaman, Pakan, Filter, Hardscape"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="h-10 text-sm rounded-xl font-medium"
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl text-xs font-bold"
                onClick={() => setIsCategoryModalOpen(false)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold"
              >
                {isLoading ? "Menyimpan..." : "Simpan Kategori"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl border-2 border-gray-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* SEARCH INPUT */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Cari model atau merk..."
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

        {/* KATEGORI & MERK FILTER */}
        <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto no-scrollbar">
          {/* FILTER MERK DROPDOWN */}
          {availableBrands.length > 0 && (
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-xs font-bold text-gray-400 hidden sm:inline">Merk:</span>
              <Select
                value={selectedBrandFilter}
                onValueChange={(val) => setSelectedBrandFilter(val || "all")}
              >
                <SelectTrigger className="h-9 text-xs font-extrabold rounded-xl w-[130px] bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Semua Merk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Merk</SelectItem>
                  <SelectItem value="no-brand">Tanpa Merk</SelectItem>
                  {availableBrands.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* KATEGORI BUTTONS */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === "all"
                  ? "bg-[#2563EB] text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Semua
            </button>

            {categories.map((cat) => {
              const isSelected = selectedCategory === String(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(String(cat.id))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    isSelected
                      ? "bg-[#2563EB] text-white shadow-xs"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* TABEL MASTER PRODUK */}
      <div className="border-2 border-gray-200/90 rounded-2xl bg-white shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/80 border-b border-gray-200 hover:bg-gray-50/80">
              <TableHead
                onClick={() => handleSort("name")}
                className="py-3.5 px-4 text-xs font-extrabold text-gray-700 uppercase cursor-pointer select-none hover:text-blue-600 transition-colors"
              >
                Nama / Model {renderSortIcon("name")}
              </TableHead>
              <TableHead
                onClick={() => handleSort("brand")}
                className="py-3.5 px-4 text-xs font-extrabold text-gray-700 uppercase cursor-pointer select-none hover:text-blue-600 transition-colors"
              >
                Merk {renderSortIcon("brand")}
              </TableHead>
              <TableHead
                onClick={() => handleSort("category")}
                className="py-3.5 px-4 text-xs font-extrabold text-gray-700 uppercase cursor-pointer select-none hover:text-blue-600 transition-colors"
              >
                Kategori {renderSortIcon("category")}
              </TableHead>
              <TableHead
                onClick={() => handleSort("price")}
                className="py-3.5 px-4 text-xs font-extrabold text-gray-700 uppercase text-right cursor-pointer select-none hover:text-blue-600 transition-colors"
              >
                Harga Jual {renderSortIcon("price")}
              </TableHead>
              <TableHead
                onClick={() => handleSort("stock")}
                className="py-3.5 px-4 text-xs font-extrabold text-gray-700 uppercase text-center cursor-pointer select-none hover:text-blue-600 transition-colors"
              >
                Sisa Stok {renderSortIcon("stock")}
              </TableHead>
              <TableHead className="py-3.5 px-4 text-xs font-extrabold text-gray-700 uppercase text-center w-[120px]">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow
                  key={product.id}
                  className="hover:bg-blue-50/40 border-b border-gray-100 transition-colors"
                >
                  <TableCell className="py-3.5 px-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-gray-900">
                        {product.name}
                      </span>
                      {product.isService && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-300">
                          Jasa
                        </span>
                      )}
                      {product.isActive === false && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 border border-gray-300">
                          Nonaktif
                        </span>
                      )}
                    </div>
                    {product.description && (
                      <div className="text-xs text-gray-400 truncate max-w-xs mt-0.5">
                        {product.description}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="py-3.5 px-4">
                    {product.brand ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-black bg-blue-50 text-blue-700 border border-blue-200">
                        <Tag className="w-3 h-3 text-blue-600" />
                        {product.brand}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 font-medium italic">
                        -
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
                      {product.category?.name || "Umum"}
                    </span>
                  </TableCell>
                  <TableCell className="py-3.5 px-4 text-right font-black text-sm text-gray-950 font-mono">
                    Rp {product.price.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="py-3.5 px-4 text-center">
                    {product.isService ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
                        Jasa (∞)
                      </span>
                    ) : (
                      <div>
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-black font-mono border ${
                            (product.stock ?? 0) <= 0
                              ? "bg-rose-100 text-rose-800 border-rose-300"
                              : (product.stock ?? 0) <= product.minStock
                                ? "bg-amber-100 text-amber-900 border-amber-300 font-extrabold"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                        >
                          {product.stock ?? 0} pcs
                        </span>
                        {product.minStock > 0 && (
                          <span className="block text-[10px] text-gray-400 mt-0.5 font-semibold">
                            Min: {product.minStock} pcs
                          </span>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleEditClick(product)}
                        className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Edit Produk"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Hapus Produk"
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
                    Tidak ada produk ditemukan
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Coba sesuaikan kata kunci pencarian atau ubah filter merk / kategori.
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