import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import KatalogClient from "./KatalogClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Katalog & Cek Stok Produk | Mozza Aquatic Banyuwangi",
  description:
    "Cek ketersediaan stok fisik ikan hias, tanaman aquascape, pakan, dan peralatan akuarium secara real-time di Mozza Aquatic Banyuwangi.",
  openGraph: {
    title: "Katalog & Cek Stok Produk | Mozza Aquatic",
    description:
      "Cek ketersediaan stok fisik ikan hias, tanaman aquascape, pakan, dan peralatan akuarium secara real-time di Mozza Aquatic Banyuwangi.",
    type: "website",
  },
};

export default async function KatalogPage() {
  const [rawCategories, rawProducts] = await Promise.all([
    prisma.category.findMany({
      orderBy: { id: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: { id: "desc" },
      select: {
        id: true,
        name: true,
        slug: true,
        brand: true,
        categoryId: true,
        description: true,
        isService: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        purchaseItems: {
          where: { remainingStock: { gt: 0 } },
          select: { remainingStock: true },
        },
      },
    }),
  ]);

  const products = rawProducts.map((p) => {
    const calculatedStock = p.isService
      ? 999
      : (p.purchaseItems || []).reduce(
          (sum, item) => sum + item.remainingStock,
          0
        );

    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      brand: p.brand,
      categoryId: p.categoryId,
      category: p.category,
      description: p.description,
      isService: p.isService,
      stock: calculatedStock,
    };
  });

  const storePhone = process.env.NEXT_PUBLIC_STORE_WHATSAPP || "6281234567890";

  return (
    <KatalogClient
      initialProducts={products}
      categories={rawCategories}
      storePhone={storePhone}
    />
  );
}
