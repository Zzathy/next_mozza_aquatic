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

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  category?: Category;
  categoryId: number;
  price: number;
  minStock: number;
  description: string | null;
  isService?: boolean;
}

export default function ProductPage() {
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [minStock, setMinStock] = useState("");
  const [description, setDescription] = useState("");

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
    setCategoryId("");
    setPrice("");
    setMinStock("");
    setDescription("");
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
    } catch (error) {
      console.error(error);
      alert("Gagal menambah kategori baru!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        name,
        categoryId: Number(categoryId),
        price: Number(price),
        minStock: Number(minStock),
        description,
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
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Gagal memproses data produk.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (product: Product) => {
    setEditingProductId(product.id);
    setName(product.name);
    setCategoryId(String(product.categoryId || product.category?.id || ""));
    setPrice(String(product.price));
    setMinStock(String(product.minStock));
    setDescription(product.description || "");
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
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus produk.");
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchQuery = p.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchCategory =
        selectedCategory === "all" ||
        String(p.categoryId || p.category?.id) === selectedCategory;
      return matchQuery && matchCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
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
            Atur nama, kategori, harga jual, dan batas peringatan stok minimal.
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
                  ? "Perbarui informasi produk dan harga jual di bawah."
                  : "Tambahkan produk baru ke dalam database master Mozza Aquatic."}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleProductSubmit} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-bold text-gray-700">
                  Nama Produk
                </Label>
                <Input
                  id="name"
                  placeholder="Misal: Manfish Platinum, Pakan Agaru, Anubias"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10 text-sm rounded-xl font-medium"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-bold text-gray-700">
                    Kategori Produk
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
                    <SelectValue placeholder="Pilih Kategori Produk" />
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
                    Harga Jual (Rp)
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
                  placeholder="Catatan pakan, ukuran ikan, atau garansi"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-10 text-sm rounded-xl font-medium"
                />
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
            placeholder="Cari produk..."
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

        {/* KATEGORI FILTER */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
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

      {/* TABEL MASTER PRODUK */}
      <div className="border-2 border-gray-200/90 rounded-2xl bg-white shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/80 border-b border-gray-200 hover:bg-gray-50/80">
              <TableHead className="py-3.5 px-4 text-xs font-extrabold text-gray-700 uppercase">
                Nama Produk
              </TableHead>
              <TableHead className="py-3.5 px-4 text-xs font-extrabold text-gray-700 uppercase">
                Kategori
              </TableHead>
              <TableHead className="py-3.5 px-4 text-xs font-extrabold text-gray-700 uppercase text-right">
                Harga Jual
              </TableHead>
              <TableHead className="py-3.5 px-4 text-xs font-extrabold text-gray-700 uppercase text-center">
                Min. Stok
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
                    <div className="font-bold text-sm text-gray-900">
                      {product.name}
                    </div>
                    {product.description && (
                      <div className="text-xs text-gray-400 truncate max-w-xs mt-0.5">
                        {product.description}
                      </div>
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
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      {product.minStock} pcs
                    </span>
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
                <TableCell colSpan={5} className="text-center py-16 text-gray-400">
                  <AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-30 text-gray-400" />
                  <p className="font-bold text-gray-700 text-base">
                    Tidak ada produk ditemukan
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Coba sesuaikan kata kunci pencarian atau ubah filter kategori.
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