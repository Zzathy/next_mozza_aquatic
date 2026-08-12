"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  User,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Product {
  id: number;
  name: string;
  price: number;
  category?: { name: string };
  isService: boolean;
  stock: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export default function CashierPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [discount, setDiscount] = useState("0");
  const [paidAmount, setPaidAmount] = useState("0");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Gagal ambil produk");
        const json = await res.json();
        setProducts(json.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = (product: Product) => {
    if (!product.isService && product.stock <= 0) {
      alert("Stok barang ini sudah habis!");
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        if (!product.isService && existing.quantity >= product.stock) {
          alert(`Stok tidak mencukupi! Sisa stok hanya ${product.stock}.`);
          return prev;
        }
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;

            if (
              !item.product.isService &&
              delta > 0 &&
              newQty > item.product.stock
            ) {
              alert(
                `Stok maksimal ${item.product.name} hanya ${item.product.stock}!`,
              );
              return item;
            }

            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const clearCart = () => {
    if (!confirm("Kosongkan keranjang?")) return;
    setCart([]);
    setCustomerName("");
    setCustomerPhone("");
    setNotes("");
    setDiscount("0");
    setPaidAmount("0");
  };

  const subTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const finalAmount = subTotal - (Number(discount) || 0);
  const dueAmount = finalAmount - (Number(paidAmount) || 0);
  const kembalian = (Number(paidAmount) || 0) - finalAmount;

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Keranjang masih kosong!");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        customerName,
        customerPhone,
        notes,
        discount: Number(discount),
        paidAmount: Number(paidAmount),
        items: cart.map((c) => ({
          productId: c.product.id,
          quantity: c.quantity,
          price: c.product.price,
        })),
      };

      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal menyimpan transaksi");
      }

      alert("Transaksi Berhasil Disimpan!");

      const resProducts = await fetch("/api/products");
      const jsonProducts = await resProducts.json();
      setProducts(jsonProducts.data || []);

      setCart([]);
      setCustomerName("");
      setCustomerPhone("");
      setNotes("");
      setDiscount("0");
      setPaidAmount("0");
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Terjadi kesalahan sistem.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-50 overflow-hidden">
      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Kasir Mozza</h1>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Cari produk..."
              className="pl-9 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-10">
            {filteredProducts.map((product) => {
              const isOutOfStock = !product.isService && product.stock <= 0;

              return (
                <div
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className={`bg-white border rounded-xl p-4 flex flex-col justify-between h-32 transition-all 
                    ${
                      isOutOfStock
                        ? "opacity-50 cursor-not-allowed bg-gray-100 grayscale"
                        : "cursor-pointer hover:border-blue-500 hover:shadow-md active:scale-95"
                    }
                  `}
                >
                  <div>
                    <h3 className="font-semibold text-gray-800 line-clamp-2 leading-tight">
                      {product.name}
                    </h3>
                    {product.isService && (
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full mt-1 inline-block">
                        Jasa
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-end mt-2">
                    <div className="text-blue-600 font-bold">
                      Rp {product.price.toLocaleString("id-ID")}
                    </div>
                    {!product.isService && (
                      <div
                        className={`text-xs font-semibold ${product.stock > 5 ? "text-green-600" : "text-red-500"}`}
                      >
                        Stok: {product.stock}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {filteredProducts.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-10">
                Produk tidak ditemukan.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KANAN: KERANJANG (CART) */}
      <div className="w-96 bg-white border-l shadow-xl flex flex-col z-10">
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <h2 className="font-bold flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" /> Pesanan Saat Ini
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCart}
            className="text-red-500 h-8"
          >
            <Trash2 className="w-4 h-4 mr-1" /> Kosongkan
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <ShoppingCart className="w-12 h-12 mb-2 opacity-20" />
              <p>Belum ada barang dipilih</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="bg-white p-3 rounded-lg border shadow-sm flex flex-col gap-2"
              >
                <div className="flex justify-between font-medium text-sm">
                  <span className="line-clamp-1 pr-2">{item.product.name}</span>
                  <span>
                    Rp{" "}
                    {(item.product.price * item.quantity).toLocaleString(
                      "id-ID",
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Rp {item.product.price.toLocaleString("id-ID")} / pcs
                  </span>
                  <div className="flex items-center gap-3 bg-gray-100 rounded-md p-1">
                    <button
                      onClick={() => updateQuantity(item.product.id, -1)}
                      className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:bg-gray-50 active:scale-95"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-semibold w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, 1)}
                      className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-blue-600 hover:bg-gray-50 active:scale-95"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t bg-white p-4 space-y-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <User className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                className="h-8 text-xs pl-8"
                placeholder="Nama Pelanggan (Opsional)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
            <div className="relative flex-1">
              <FileText className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                className="h-8 text-xs pl-8"
                placeholder="Catatan (Opsional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>Rp {subTotal.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Diskon (Rp)</span>
              <Input
                type="number"
                className="h-7 w-24 text-right text-xs"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-between items-end border-t pt-2 pb-1">
            <span className="font-bold text-gray-800">Total</span>
            <span className="text-2xl font-black text-blue-600">
              Rp {finalAmount.toLocaleString("id-ID")}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">Uang Diterima</span>
            <Input
              type="number"
              className="h-9 w-32 text-right font-bold"
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
            />
          </div>

          {kembalian > 0 ? (
            <div className="flex justify-between text-sm text-green-600 font-bold bg-green-50 p-2 rounded-md">
              <span>Kembalian</span>
              <span>Rp {kembalian.toLocaleString("id-ID")}</span>
            </div>
          ) : dueAmount > 0 && Number(paidAmount) > 0 ? (
            <div className="flex justify-between text-sm text-red-500 font-bold bg-red-50 p-2 rounded-md">
              <span>Kurang Bayar (Hutang)</span>
              <span>Rp {dueAmount.toLocaleString("id-ID")}</span>
            </div>
          ) : null}

          <Button
            className="w-full h-12 text-lg font-bold mt-2"
            disabled={cart.length === 0 || isLoading}
            onClick={handleCheckout}
          >
            {isLoading ? "Memproses..." : "Bayar Sekarang"}
          </Button>
        </div>
      </div>
    </div>
  );
}
