"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  User,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Banknote,
  Percent,
  X,
  Fish,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReceiptPrint, { ReceiptData } from "@/components/ReceiptPrint";
import { useToast } from "@/components/ui/toast-context";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  category?: Category;
  categoryId: number;
  isService: boolean;
  stock: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export default function CashierPage() {
  const { success, error: showError } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [discount, setDiscount] = useState("0");
  const [paidAmount, setPaidAmount] = useState("0");

  const [activeReceipt, setActiveReceipt] = useState<ReceiptData | null>(null);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [resProd, resCat] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
      ]);

      if (resProd.ok) {
        const json = await resProd.json();
        setProducts(json.data || []);
      }
      if (resCat.ok) {
        const jsonCat = await resCat.json();
        setCategories(jsonCat.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function startFetching() {
      try {
        const [resProd, resCat] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/categories"),
        ]);
        if (!ignore && resProd.ok && resCat.ok) {
          const jsonProd = await resProd.json();
          const jsonCat = await resCat.json();
          setProducts(jsonProd.data || []);
          setCategories(jsonCat.data || []);
        }
      } catch (err) {
        console.error(err);
      }
    }
    startFetching();
    return () => {
      ignore = true;
    };
  }, []);

  const addToCart = (product: Product) => {
    if (!product.isService && product.stock <= 0) {
      showError("Stok barang ini sudah habis!");
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        if (!product.isService && existing.quantity >= product.stock) {
          showError(`Stok tidak mencukupi! Sisa stok hanya ${product.stock}.`);
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
              showError(
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

  const setExactQuantity = (productId: number, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          if (!item.product.isService && qty > item.product.stock) {
            showError(`Maksimal stok tersedia hanya ${item.product.stock}!`);
            return { ...item, quantity: item.product.stock };
          }
          return { ...item, quantity: qty };
        }
        return item;
      }),
    );
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    if (cart.length === 0) return;
    if (!confirm("Kosongkan keranjang transaksi?")) return;
    setCart([]);
    setCustomerName("");
    setCustomerPhone("");
    setNotes("");
    setDiscount("0");
    setPaidAmount("0");
  };

  const subTotal = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
  }, [cart]);

  const discountNum = Number(discount) || 0;
  const finalAmount = Math.max(0, subTotal - discountNum);
  const paidNum = Number(paidAmount) || 0;
  const dueAmount = finalAmount - paidNum;
  const kembalian = paidNum - finalAmount;

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory =
        selectedCategory === "all" || p.categoryId === selectedCategory;
      return matchQuery && matchCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const setExactPayment = () => {
    setPaidAmount(String(finalAmount));
  };

  const setQuickNominal = (amount: number) => {
    setPaidAmount(String(amount));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      showError("Keranjang masih kosong!");
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

      const receiptPayload: ReceiptData = {
        invoice: data.data?.invoice || "MIG-S-PENDING",
        date: new Date().toLocaleString("id-ID"),
        customer: customerName || null,
        items: cart.map((c) => ({
          name: c.product.name,
          qty: c.quantity,
          price: c.product.price,
          subTotal: c.product.price * c.quantity,
        })),
        total: finalAmount,
        paid: Number(paidAmount),
        change: kembalian,
        notes: notes || null,
      };

      setActiveReceipt(receiptPayload);

      setTimeout(() => {
        window.print();
      }, 150);

      // Refresh data produk
      await loadData();

      // Reset form
      setCart([]);
      setCustomerName("");
      setCustomerPhone("");
      setNotes("");
      setDiscount("0");
      setPaidAmount("0");
      setIsMobileCartOpen(false);
      success("Transaksi berhasil diproses & nota dicetak!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        showError(error.message);
      } else {
        showError("Terjadi kesalahan sistem.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 bg-[#F3F4F6] text-gray-900 overflow-hidden select-none relative">
      {/* AREA KIRI: KATALOG PRODUK */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-gray-200 bg-[#F8FAFC] print:hidden h-full">
        {/* TOP BAR HEADER */}
        <header className="px-4 lg:px-6 py-3.5 border-b border-gray-200 bg-white shadow-xs flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                KASIR MOZZA
              </span>
              <span className="text-xs font-medium text-gray-500 hidden sm:inline">
                Mozza Aquatic
              </span>
            </div>
            <h1 className="text-xl lg:text-2xl font-black text-gray-900 tracking-tight mt-0.5">
              Katalog Produk
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* SEARCH BAR */}
            <div className="relative w-48 sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Cari produk..."
                className="pl-9 pr-8 h-10 bg-gray-50 border-gray-300 text-gray-900 text-sm placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:bg-white rounded-xl shadow-xs transition-all font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* FLOATING CART BUTTON FOR MOBILE/TABLET */}
            <button
              onClick={() => setIsMobileCartOpen(true)}
              className="lg:hidden relative h-10 px-3.5 rounded-xl bg-[#2563EB] text-white flex items-center gap-1.5 font-bold text-xs shadow-md shadow-blue-500/25 shrink-0 active:scale-95 transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Keranjang</span>
              {cart.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center -mr-1">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* KATEGORI PILLS (TOMBOL BESAR, MUDAH DITEKAN DI TOUCHSCREEN/MOUSE) */}
        <div className="px-6 py-3 border-b border-gray-200 bg-white/80 backdrop-blur-sm flex items-center gap-2.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedCategory === "all"
                ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/25"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 border border-gray-200"
            }`}
          >
            <Layers className="w-4 h-4" />
            Semua ({products.length})
          </button>

          {categories.map((cat) => {
            const count = products.filter((p) => p.categoryId === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isSelected
                    ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/25"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 border border-gray-200"
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* GRID PRODUK (KARTU BESAR & TEKS SANGAT JELAS) */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => {
              const isOutOfStock = !product.isService && product.stock <= 0;
              const cartItem = cart.find((i) => i.product.id === product.id);
              const inCartQty = cartItem?.quantity || 0;

              return (
                <div
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className={`group relative flex flex-col justify-between rounded-2xl p-4.5 border-2 transition-all duration-150 select-none min-h-[140px] ${
                    isOutOfStock
                      ? "bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed grayscale"
                      : inCartQty > 0
                        ? "bg-blue-50/80 border-[#2563EB] shadow-md ring-2 ring-blue-500/20 cursor-pointer"
                        : "bg-white border-gray-200/90 hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5 cursor-pointer active:scale-[0.98]"
                  }`}
                >
                  {/* BADGE DI DALAM KERANJANG (BESAR & TEGAS) */}
                  {inCartQty > 0 && (
                    <div className="absolute -top-3 -right-2.5 bg-[#2563EB] text-white text-xs font-black min-w-7 h-7 px-1.5 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white animate-in zoom-in-75">
                      {inCartQty}x
                    </div>
                  )}

                  <div>
                    {/* TOP INFO & BADGE */}
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="text-xs uppercase font-extrabold tracking-wider text-gray-600 truncate">
                        {product.category?.name || "Umum"}
                      </span>
                      {product.isService ? (
                        <span className="text-xs font-bold bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-md">
                          Jasa
                        </span>
                      ) : (
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                            product.stock > 10
                              ? "bg-emerald-100 text-emerald-800"
                              : product.stock > 0
                                ? "bg-amber-100 text-amber-800 font-extrabold"
                                : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {product.stock > 0
                            ? `Stok: ${product.stock}`
                            : "Habis"}
                        </span>
                      )}
                    </div>

                    {/* NAMA PRODUK BESAR & TEGAS */}
                    <h3 className="font-bold text-base text-gray-900 group-hover:text-blue-600 line-clamp-2 leading-snug">
                      {product.name}
                    </h3>
                  </div>

                  {/* HARGA & TOMBOL TAMBAH */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-end justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-gray-600 block uppercase">
                        Harga Satuan
                      </span>
                      <span className="text-lg font-black text-gray-950">
                        Rp {product.price.toLocaleString("id-ID")}
                      </span>
                    </div>

                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                        inCartQty > 0
                          ? "bg-[#2563EB] text-white shadow-sm"
                          : "bg-gray-100 text-gray-700 group-hover:bg-[#2563EB] group-hover:text-white"
                      }`}
                    >
                      <Plus className="w-5 h-5 stroke-[2.5]" />
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredProducts.length === 0 && (
              <div className="col-span-full py-20 text-center text-gray-500">
                <Fish className="w-16 h-16 mx-auto mb-3 opacity-30 text-gray-400" />
                <p className="text-lg font-bold text-gray-700">
                  Produk tidak ditemukan
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Coba kata kunci pencarian lain atau pilih kategori Semua
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AREA KANAN: PESANAN / BILLING CART (RESPONSIF DESKTOP & MOBILE DRAWER) */}
      {/* OVERLAY DI MOBILE */}
      {isMobileCartOpen && (
        <div
          onClick={() => setIsMobileCartOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-xs"
        />
      )}

      <div
        className={`fixed top-0 bottom-0 right-0 z-40 lg:static w-full sm:w-[420px] xl:w-[460px] flex flex-col bg-white border-l border-gray-200 shrink-0 shadow-2xl lg:shadow-xl print:hidden transition-transform duration-300 ease-in-out ${
          isMobileCartOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        {/* CART HEADER */}
        <div className="px-4 lg:px-5 py-3.5 border-b border-gray-200 flex items-center justify-between bg-gray-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold">
              <ShoppingCart className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="font-extrabold text-gray-900 text-base">
                Pesanan Kasir
              </h2>
              <p className="text-xs font-medium text-gray-500">
                {cart.length} item dipilih
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-xl border border-rose-200 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Kosongkan
              </button>
            )}
            <button
              onClick={() => setIsMobileCartOpen(false)}
              className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              title="Tutup Keranjang"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CART ITEMS LIST */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8FAFC]">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
              <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                <ShoppingCart className="w-10 h-10 opacity-40 text-gray-500" />
              </div>
              <p className="font-bold text-gray-700 text-base">
                Belum Ada Pesanan
              </p>
              <p className="text-xs text-gray-500 mt-1 max-w-[240px]">
                Silakan sentuh atau klik produk di katalog sebelah kiri untuk
                memulai pesanan pelanggan
              </p>
            </div>
          ) : (
            cart.map((item) => {
              const itemTotal = item.product.price * item.quantity;

              return (
                <div
                  key={item.product.id}
                  className="bg-white border-2 border-gray-200/80 hover:border-gray-300 p-3.5 rounded-2xl shadow-xs transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-sm text-gray-900 truncate">
                        {item.product.name}
                      </h4>
                      <div className="text-xs font-semibold text-gray-500 mt-0.5">
                        Rp {item.product.price.toLocaleString("id-ID")} / item
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-base text-gray-900">
                        Rp {itemTotal.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>

                  {/* KONTROL KUANTITAS (TOMBOL BESAR & MUDAH DITEKAN) */}
                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-100">
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-gray-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition-colors"
                      title="Hapus produk ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center bg-gray-100 rounded-xl border border-gray-300/80 p-1">
                      <button
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-gray-800 shadow-xs hover:bg-gray-50 active:scale-95 transition-all font-bold"
                      >
                        <Minus className="w-4 h-4 stroke-[2.5]" />
                      </button>

                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          setExactQuantity(
                            item.product.id,
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className="w-12 text-center text-sm font-extrabold text-gray-900 bg-transparent border-0 focus:ring-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />

                      <button
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-blue-600 shadow-xs hover:bg-gray-50 active:scale-95 transition-all font-bold"
                      >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* CUSTOMER & PAYMENT FOOTER */}
        <div className="p-4 border-t border-gray-200 bg-white space-y-3 shadow-lg">
          {/* NAMA & CATATAN PELANGGAN */}
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <User className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                className="h-9 text-xs pl-8 bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 rounded-xl font-medium focus-visible:ring-blue-600 focus-visible:bg-white"
                placeholder="Pelanggan (opsional)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
            <div className="relative">
              <FileText className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                className="h-9 text-xs pl-8 bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 rounded-xl font-medium focus-visible:ring-blue-600 focus-visible:bg-white"
                placeholder="Catatan struk"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          {/* KALKULASI HARGA */}
          <div className="space-y-1.5 pt-1 text-xs">
            <div className="flex justify-between text-gray-500 font-medium">
              <span>Subtotal</span>
              <span className="font-bold text-gray-800 text-sm">
                Rp {subTotal.toLocaleString("id-ID")}
              </span>
            </div>

            <div className="flex justify-between items-center text-gray-500 font-medium">
              <span className="flex items-center gap-1">
                <Percent className="w-3.5 h-3.5 text-gray-400" /> Diskon (Rp)
              </span>
              <div className="w-32">
                <Input
                  type="number"
                  min="0"
                  className="h-8 text-right text-xs bg-gray-50 border-gray-300 text-gray-900 rounded-lg pr-2 font-bold focus-visible:ring-blue-600 focus-visible:bg-white"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-between items-baseline pt-2 border-t border-gray-200">
              <span className="text-sm font-extrabold text-gray-900">
                Total Pembayaran
              </span>
              <span className="text-2xl font-black tracking-tight text-[#2563EB]">
                Rp {finalAmount.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          {/* INPUT PEMBAYARAN */}
          <div className="pt-2 border-t border-gray-100 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-extrabold text-gray-800 flex items-center gap-1.5">
                <Banknote className="w-4 h-4 text-emerald-600" />
                Uang Diterima (Rp)
              </span>

              <div className="w-40">
                <Input
                  type="number"
                  min="0"
                  placeholder="0"
                  className="h-10 text-right text-base font-black bg-gray-50 border-gray-300 text-gray-950 rounded-xl focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:bg-white"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                />
              </div>
            </div>

            {/* QUICK NOMINAL BUTTONS (MUDAH DIKLIK) */}
            <div className="grid grid-cols-4 gap-1.5 text-xs">
              <button
                type="button"
                onClick={setExactPayment}
                className="py-1.5 px-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#2563EB] font-bold border border-blue-200 transition-colors text-center"
              >
                Uang Pas
              </button>
              <button
                type="button"
                onClick={() => setQuickNominal(50000)}
                className="py-1.5 px-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold border border-gray-200 transition-colors text-center"
              >
                50.000
              </button>
              <button
                type="button"
                onClick={() => setQuickNominal(100000)}
                className="py-1.5 px-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold border border-gray-200 transition-colors text-center"
              >
                100.000
              </button>
              <button
                type="button"
                onClick={() => setQuickNominal(200000)}
                className="py-1.5 px-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold border border-gray-200 transition-colors text-center"
              >
                200.000
              </button>
            </div>

            {/* KEMBALIAN / KURANG BAYAR */}
            {kembalian > 0 ? (
              <div className="flex items-center justify-between text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Kembalian
                </span>
                <span className="text-base font-black">
                  Rp {kembalian.toLocaleString("id-ID")}
                </span>
              </div>
            ) : dueAmount > 0 && paidNum > 0 ? (
              <div className="flex items-center justify-between text-xs font-bold text-rose-800 bg-rose-50 border border-rose-200 px-3 py-2 rounded-xl">
                <span className="flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600" /> Kurang Bayar
                </span>
                <span className="text-base font-black">
                  Rp {dueAmount.toLocaleString("id-ID")}
                </span>
              </div>
            ) : null}

            {/* TOMBOL BAYAR UTAMA */}
            <Button
              className="w-full h-12 text-base font-black bg-[#2563EB] hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 active:scale-[0.99] transition-all rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={cart.length === 0 || isLoading}
              onClick={handleCheckout}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Menyimpan Transaksi...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Selesaikan & Cetak Struk</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>

      <ReceiptPrint data={activeReceipt} />
    </div>
  );
}
