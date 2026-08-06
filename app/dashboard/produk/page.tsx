"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
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
  price: number;
  minStock: number;
  description: string | null;
}

export default function ProductPage() {
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

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

  const refreshProducts = async () => {
    try {
      const data = await fetchProductsAPI();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const refreshCategories = async () => {
    try {
      const data = await fetchCategoriesAPI();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProductsAPI()
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => console.error(err));

    fetchCategoriesAPI()
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => console.error(err));
  });

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newCategoryName }),
      });

      if (!response.ok) throw new Error("Gagal nyimpen kategori");

      const resData = await response.json();
      const createdCategory = resData.data;

      await refreshCategories();

      setCategoryId(String(createdCategory.id));
      setIsCategoryModalOpen(false);
      setNewCategoryName("");

      alert("Kategori berhasil ditambahkan");
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan kategori");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const isEditing = editingProductId !== null;

      const url = isEditing
        ? `/api/products/${editingProductId}`
        : "/api/products";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          categoryId: Number(categoryId),
          price: Number(price),
          minStock: Number(minStock),
          description: description || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal nyimpan produk");
      }

      alert(`Produk berhasil ${isEditing ? "diperbarui" : "ditambahkan!"}`);

      resetForm();
      setIsProductModalOpen(false);

      await refreshProducts();
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error: ", err);
        alert(err.message);
      } else {
        alert("Terjadi kesalahan yang tidak diketahui");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (product: Product) => {
    setEditingProductId(product.id);
    setName(product.name);

    setCategoryId(product.category ? String(product.category.id) : "");

    setPrice(String(product.price));
    setMinStock(String(product.minStock));
    setDescription(product.description || "");

    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Yakin mau hapus produk ini?")) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Gagal hapus produk");
      alert("Produk berhasil dihapus");

      await refreshProducts();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus produk");
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Master Data Produk</h1>
          <p className="text-gray-500 text-sm">
            Kelola daftar produk dan jasa toko.
          </p>
        </div>

        {/* Modal Produk Utama */}
        <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
          <Button
            onClick={() => {
              resetForm(); // Pastiin form kosong pas mau nambah baru
              setIsProductModalOpen(true);
            }}
          >
            + Tambah Produk
          </Button>

          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              {/* Judul modalnya dibikin dinamis cuy! */}
              <DialogTitle>
                {editingProductId ? "Edit Data Produk" : "Tambah Produk Baru"}
              </DialogTitle>
              <DialogDescription>
                {editingProductId
                  ? "Ubah detail barang di bawah ini."
                  : "Masukkan detail barang untuk master data."}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleProductSubmit} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nama Produk</Label>
                <Input
                  id="name"
                  placeholder="Misal: Pakan Ikan Koi 1Kg"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Input Kategori ala Filament */}
              <div className="grid gap-2">
                <Label>Kategori</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Select
                      value={categoryId}
                      onValueChange={(val) => setCategoryId(val || "")}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Kategori" />
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
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setIsCategoryModalOpen(true)}
                    title="Tambah Kategori Baru"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Harga Jual (Rp)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="minStock">Min. Stok (Alert)</Label>
                  <Input
                    id="minStock"
                    type="number"
                    value={minStock}
                    onChange={(e) => setMinStock(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Keterangan (Opsional)</Label>
                <Input
                  id="description"
                  placeholder="Deskripsi singkat produk"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <Button type="submit" disabled={isLoading} className="mt-4">
                {isLoading
                  ? "Menyimpan..."
                  : editingProductId
                    ? "Simpan Perubahan"
                    : "Simpan Produk"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Modal Kategori (Numpang di atas modal produk) */}
      <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Tambah Kategori Baru</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCategorySubmit} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Nama Kategori</Label>
              <Input
                placeholder="Misal: Pakan, Obat, Aksesoris"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCategoryModalOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Menyimpan..." : "Simpan Kategori"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Tabel Master Data */}
      <div className="border rounded-lg bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Produk</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead className="text-right">Harga</TableHead>
              <TableHead className="text-center">Min. Stok</TableHead>
              <TableHead className="w-[100px] text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category?.name || "-"}</TableCell>
                  <TableCell className="text-right">
                    Rp {product.price.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="text-center">
                    {product.minStock}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      {/* Tombol Edit */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(product)}
                        title="Edit Data"
                      >
                        <Pencil className="w-4 h-4 text-blue-500" />
                      </Button>

                      {/* Tombol Hapus */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteProduct(product.id)}
                        title="Hapus Data"
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
                  colSpan={5}
                  className="text-center h-24 text-gray-500"
                >
                  Belum ada data produk.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
