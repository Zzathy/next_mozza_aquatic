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
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
  brand?: string | null;
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
  const [paymentMethod, setPaymentMethod] = useState<"Tunai" | "QRIS">("Tunai");

  const [activeReceipt, setActiveReceipt] = useState<ReceiptData | null>(null);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

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
    setPaymentMethod("Tunai");
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
      const q = searchQuery.toLowerCase();
      const matchQuery =
        p.name.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.category?.name && p.category.name.toLowerCase().includes(q));
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

  const executeCheckout = async (
    customPaid?: string,
    customMethod?: "Tunai" | "QRIS",
  ) => {
    if (cart.length === 0) {
      showError("Keranjang masih kosong!");
      return;
    }

    const effectivePaid = customPaid !== undefined ? customPaid : paidAmount;
    const effectiveMethod = customMethod !== undefined ? customMethod : paymentMethod;
    const paidNum = Number(effectivePaid) || 0;
    const changeAmount = Math.max(0, paidNum - finalAmount);

    setIsLoading(true);
    try {
      const payload = {
        customerName: customerName.trim() || undefined,
        customerPhone: customerPhone.trim() || undefined,
        notes: notes.trim() || undefined,
        paymentMethod: effectiveMethod,
        discount: Number(discount),
        paidAmount: paidNum,
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
        invoice: data.data?.invoiceNumber || data.data?.invoice || "INV-SUCCESS",
        date: new Date().toLocaleString("id-ID"),
        customer: customerName.trim() || null,
        paymentMethod: effectiveMethod,
        items: cart.map((c) => ({
          name: c.product.brand
            ? `[${c.product.brand}] ${c.product.name}`
            : c.product.name,
          qty: c.quantity,
          price: c.product.price,
          subTotal: c.product.price * c.quantity,
        })),
        total: finalAmount,
        paid: paidNum,
        change: changeAmount,
        notes: notes.trim() || null,
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
      setPaymentMethod("Tunai");
      setIsCheckoutModalOpen(false);
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

  const handleQuickExactCash = () => {
    if (cart.length === 0) return;
    executeCheckout(String(finalAmount), "Tunai");
  };

  return (
    <div className="flex h-full min-h-0 bg-[#F3F4F6] text-gray-900 overflow-hidden select-none relative">
      {/* AREA KIRI: KATALOG PRODUK */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-gray-200 bg-[#F8FAFC] print:hidden h-full">
        {/* TOP BAR HEADER */}
        <header className="px-4 lg:px-6 py-3.5 border-b border-gray-200 bg-white shadow-xs flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg lg:text-2xl font-black text-gray-950 tracking-tight">
              Katalog Produk
            </h1>
            <p className="text-xs text-gray-400 font-semibold hidden sm:block">
              Pilih item untuk menambah pesanan kasir
            </p>
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
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
                      <div className="flex items-center gap-1.5 min-w-0">
                        {product.brand && (
                          <span className="text-[11px] font-black px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-200 truncate">
                            {product.brand}
                          </span>
                        )}
                        <span className="text-xs uppercase font-extrabold tracking-wider text-gray-500 truncate">
                          {product.category?.name || "Umum"}
                        </span>
                      </div>
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
        {/* FLOATING STICKY CART BAR DI MOBILE SAAT BROWSE KATALOG */}
        {cart.length > 0 && !isMobileCartOpen && (
          <div className="lg:hidden fixed bottom-20 left-3 right-3 z-30 animate-in slide-in-from-bottom-4 duration-200">
            <button
              type="button"
              onClick={() => setIsMobileCartOpen(true)}
              className="w-full h-13 px-4 rounded-2xl bg-gray-900 text-white shadow-2xl flex items-center justify-between border border-gray-800 active:scale-98 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#2563EB] flex items-center justify-center font-bold text-white shadow-xs">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-black block leading-tight">
                    {cart.length} Macam ({cart.reduce((s, i) => s + i.quantity, 0)} pcs)
                  </span>
                  <span className="text-[11px] font-bold text-blue-400 font-mono">
                    Rp {finalAmount.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2563EB] text-white font-black text-xs shadow-xs">
                <span>Lihat Pesanan & Bayar</span>
                <span className="font-mono font-black">&rarr;</span>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* AREA KANAN: PESANAN / BILLING CART (RESPONSIF DESKTOP & MOBILE DRAWER) */}
      {/* OVERLAY DI MOBILE */}
      {isMobileCartOpen && (
        <div
          onClick={() => setIsMobileCartOpen(false)}
          className="fixed inset-0 bg-black/60 z-50 lg:hidden backdrop-blur-xs"
        />
      )}

      <div
        className={`fixed top-0 bottom-0 right-0 z-50 lg:static w-full sm:w-[400px] lg:w-[380px] xl:w-[420px] flex flex-col bg-white border-l border-gray-200 shrink-0 shadow-2xl lg:shadow-xl print:hidden transition-transform duration-300 ease-in-out ${
          isMobileCartOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        {/* CART HEADER (COMPACT & CLEAN) */}
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
              <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="font-extrabold text-gray-900 text-sm leading-tight">
                Pesanan Kasir
              </h2>
              <p className="text-[11px] font-medium text-gray-400">
                {cart.length} macam ({cart.reduce((s, i) => s + i.quantity, 0)} pcs)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded-lg border border-rose-200 transition-colors flex items-center gap-1"
                title="Kosongkan seluruh pesanan"
              >
                <Trash2 className="w-3 h-3" />
                Reset
              </button>
            )}
            <button
              onClick={() => setIsMobileCartOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              title="Tutup Keranjang"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CART ITEMS LIST (COMPACT SLEEK POS RECEIPT ROWS) */}
        <div className="flex-1 overflow-y-auto p-2.5 sm:p-3 space-y-1.5 bg-[#F8FAFC]">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                <ShoppingCart className="w-8 h-8 opacity-40 text-gray-500" />
              </div>
              <p className="font-bold text-gray-700 text-sm">
                Belum Ada Pesanan
              </p>
              <p className="text-xs text-gray-400 mt-1 max-w-[220px]">
                Pilih produk di katalog sebelah kiri untuk memulai transaksi
              </p>
            </div>
          ) : (
            cart.map((item) => {
              const itemTotal = item.product.price * item.quantity;

              return (
                <div
                  key={item.product.id}
                  className="group flex items-center justify-between p-2.5 rounded-xl bg-white border border-gray-200/80 hover:border-blue-300 transition-all gap-2 shadow-2xs"
                >
                  {/* Left: Product & Brand & Price */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {item.product.brand && (
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                          {item.product.brand}
                        </span>
                      )}
                      <h4 className="font-bold text-xs text-gray-900 truncate">
                        {item.product.name}
                      </h4>
                    </div>
                    <div className="text-[11px] text-gray-400 font-semibold mt-0.5 font-mono">
                      @Rp {item.product.price.toLocaleString("id-ID")}
                    </div>
                  </div>

                  {/* Middle: Compact Stepper Controls */}
                  <div className="flex items-center bg-gray-100 rounded-lg p-0.5 border border-gray-200 shrink-0">
                    <button
                      onClick={() => updateQuantity(item.product.id, -1)}
                      className="w-6 h-6 flex items-center justify-center rounded-md bg-white text-gray-700 hover:bg-gray-50 active:scale-90 transition-all font-bold shadow-2xs"
                    >
                      <Minus className="w-3 h-3 stroke-[2.5]" />
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
                      className="w-8 text-center text-xs font-black font-mono text-gray-900 bg-transparent border-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none p-0"
                    />
                    <button
                      onClick={() => updateQuantity(item.product.id, 1)}
                      className="w-6 h-6 flex items-center justify-center rounded-md bg-white text-blue-600 hover:bg-gray-50 active:scale-90 transition-all font-bold shadow-2xs"
                    >
                      <Plus className="w-3 h-3 stroke-[2.5]" />
                    </button>
                  </div>

                  {/* Right: Subtotal & Delete */}
                  <div className="text-right shrink-0 flex items-center gap-1.5">
                    <span className="font-black text-xs text-gray-950 font-mono">
                      Rp {itemTotal.toLocaleString("id-ID")}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-gray-300 hover:text-rose-600 p-1 rounded-md transition-colors"
                      title="Hapus item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* COMPACT BOTTOM SUMMARY & CHECKOUT BAR (HANYA ~115PX) */}
        <div className="p-3.5 pb-8 sm:pb-3.5 border-t border-gray-200 bg-white space-y-2 shadow-lg shrink-0">
          {/* Subtotal & Diskon inline */}
          <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
            <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} pcs)</span>
            <span className="font-bold text-gray-800 font-mono">
              Rp {subTotal.toLocaleString("id-ID")}
            </span>
          </div>

          {Number(discount) > 0 && (
            <div className="flex justify-between items-center text-xs text-emerald-600 font-semibold">
              <span>Diskon</span>
              <span className="font-mono">- Rp {Number(discount).toLocaleString("id-ID")}</span>
            </div>
          )}

          {/* Total Pembayaran Besar & Jelas */}
          <div className="flex justify-between items-baseline pt-1 border-t border-gray-100">
            <span className="text-xs font-black uppercase tracking-wider text-gray-700">Total</span>
            <span className="text-2xl font-black tracking-tight text-[#2563EB] font-mono">
              Rp {finalAmount.toLocaleString("id-ID")}
            </span>
          </div>

          {/* Action Buttons: ⚡ Uang Pas (Instant 1-Click) & 💳 Bayar Pesanan (Open Modal) */}
          <div className="grid grid-cols-5 gap-2 pt-1">
            <button
              type="button"
              disabled={cart.length === 0 || isLoading}
              onClick={handleQuickExactCash}
              className="col-span-2 h-11 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#2563EB] font-black text-xs border border-blue-200 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              title="Bayar dengan uang pas tunai langsung (1 klik)"
            >
              <Banknote className="w-4 h-4" />
              <span>Uang Pas</span>
            </button>

            <button
              type="button"
              disabled={cart.length === 0 || isLoading}
              onClick={() => {
                setPaidAmount(String(finalAmount));
                setIsCheckoutModalOpen(true);
              }}
              className="col-span-3 h-11 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/25 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4 stroke-[2.5]" />
              <span>Bayar Pesanan</span>
              <span className="font-mono font-black">&rarr;</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODAL DIALOG PEMBAYARAN KASIR (CHECKOUT DIALOG) */}
      <Dialog open={isCheckoutModalOpen} onOpenChange={setIsCheckoutModalOpen}>
        <DialogContent className="sm:max-w-[460px] rounded-3xl p-6 max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-gray-900 flex items-center gap-2">
              <Banknote className="w-5 h-5 text-blue-600" />
              <span>Pembayaran Kasir</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Pilih metode pembayaran dan konfirmasi uang dari pelanggan.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* TOTAL BOX */}
            <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block">
                Total yang Harus Dibayar
              </span>
              <span className="text-3xl font-black font-mono text-[#2563EB] block mt-0.5">
                Rp {finalAmount.toLocaleString("id-ID")}
              </span>
              <span className="text-[11px] text-gray-500 mt-1 block font-medium">
                {cart.length} macam barang ({cart.reduce((s, i) => s + i.quantity, 0)} pcs)
              </span>
            </div>

            {/* PAYMENT METHOD TOGGLE */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-gray-700">Metode Pembayaran</Label>
              <div className="flex items-center gap-2 p-1 rounded-xl bg-gray-100 border border-gray-200">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("Tunai")}
                  className={`flex-1 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                    paymentMethod === "Tunai"
                      ? "bg-white text-gray-900 shadow-xs"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <Banknote className="w-4 h-4 text-emerald-600" />
                  <span>💵 Tunai (Cash)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("QRIS");
                    setPaidAmount(String(finalAmount));
                  }}
                  className={`flex-1 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                    paymentMethod === "QRIS"
                      ? "bg-[#2563EB] text-white shadow-xs"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <span>📱 QRIS / Transfer</span>
                </button>
              </div>
            </div>

            {/* TUNAI PAYMENT SECTION */}
            {paymentMethod === "Tunai" ? (
              <div className="space-y-2 bg-gray-50/80 p-3.5 rounded-2xl border border-gray-200">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="cash-input" className="text-xs font-bold text-gray-700">
                    Uang Diterima (Rp)
                  </Label>
                  <Input
                    id="cash-input"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value)}
                    className="w-44 h-10 text-right text-base font-black font-mono bg-white border-gray-300 rounded-xl"
                    autoFocus
                  />
                </div>

                {/* QUICK CASH BUTTONS */}
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={setExactPayment}
                    className="h-9 px-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#2563EB] font-black text-[11px] border border-blue-200 transition-colors"
                  >
                    Uang Pas
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickNominal(50000)}
                    className="h-9 px-1 rounded-lg bg-white hover:bg-gray-100 text-gray-800 font-extrabold text-[11px] border border-gray-200 transition-colors"
                  >
                    50.000
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickNominal(100000)}
                    className="h-9 px-1 rounded-lg bg-white hover:bg-gray-100 text-gray-800 font-extrabold text-[11px] border border-gray-200 transition-colors"
                  >
                    100.000
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickNominal(200000)}
                    className="h-9 px-1 rounded-lg bg-white hover:bg-gray-100 text-gray-800 font-extrabold text-[11px] border border-gray-200 transition-colors"
                  >
                    200.000
                  </button>
                </div>

                {/* KEMBALIAN / KURANG BAYAR */}
                {kembalian > 0 ? (
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl mt-1">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Kembalian Pelanggan
                    </span>
                    <span className="text-base font-black font-mono">
                      Rp {kembalian.toLocaleString("id-ID")}
                    </span>
                  </div>
                ) : dueAmount > 0 && paidNum > 0 ? (
                  <div className="flex items-center justify-between text-xs font-bold text-rose-800 bg-rose-50 border border-rose-200 px-3 py-2 rounded-xl mt-1">
                    <span className="flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-rose-600" /> Kurang Bayar (Catat DP)
                    </span>
                    <span className="text-base font-black font-mono">
                      Rp {dueAmount.toLocaleString("id-ID")}
                    </span>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 text-center space-y-1">
                <p className="text-xs font-bold text-blue-900">
                  Pembayaran Non-Tunai (QRIS / Transfer Bank)
                </p>
                <p className="text-[11px] text-blue-600">
                  Pastikan pelanggan telah menunjukkan bukti transfer / notifikasi QRIS berhasil senilai{" "}
                  <strong>Rp {finalAmount.toLocaleString("id-ID")}</strong>.
                </p>
              </div>
            )}

            {/* OPTIONAL: DISKON & PELANGGAN & CATATAN */}
            <div className="space-y-2 pt-1 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-[11px] font-bold text-gray-500">Nama Pelanggan</Label>
                  <Input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Umum / Member"
                    className="h-9 text-xs rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] font-bold text-gray-500">Diskon (Rp)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="h-9 text-xs font-mono font-bold text-right rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] font-bold text-gray-500">Catatan Struk (Opsional)</Label>
                <Input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Titipan, garansi 3 hari"
                  className="h-9 text-xs rounded-xl"
                />
              </div>
            </div>

            {/* MODAL ACTION BUTTONS */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCheckoutModalOpen(false)}
                className="h-11 px-4 rounded-xl text-xs font-bold"
              >
                Kembali
              </Button>
              <Button
                type="button"
                disabled={isLoading}
                onClick={() => executeCheckout(paidAmount, paymentMethod)}
                className="flex-1 h-11 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span>Memproses...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Selesaikan & Cetak Struk</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ReceiptPrint data={activeReceipt} />
    </div>
  );
}
