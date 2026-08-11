import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: "desc" },
      include: {
        category: true,
        purchaseItems: {
          where: { remainingStock: { gt: 0 } },
          select: { remainingStock: true },
        },
      },
    });

    const data = products.map((product) => {
      const currentStock = product.isService
        ? 999
        : (product.purchaseItems || []).reduce(
            (sum, item) => sum + item.remainingStock,
            0,
          );

      return {
        ...product,
        stock: currentStock,
      };
    });

    return NextResponse.json({ success: true, data: data });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Gagal ambil data" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      categoryId,
      description,
      price,
      minStock,
      isActive,
      isService,
    } = body;

    if (!name || !categoryId) {
      return NextResponse.json(
        { success: false, message: "Semua field harus diisi" },
        { status: 400 },
      );
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    const existingProduct = await prisma.product.findUnique({
      where: { slug: slug },
    });

    if (existingProduct) {
      return NextResponse.json(
        {
          success: false,
          message: "Produk ini sudah terdaftar di master data!",
        },
        { status: 409 }, // 409 = Conflict
      );
    }

    const newProduct = await prisma.product.create({
      data: {
        name: name,
        slug: slug,
        categoryId: parseInt(categoryId),
        description: description || null,
        price: parseInt(price) || 0,
        minStock: parseInt(minStock) || 0,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
        isService: isService !== undefined ? Boolean(isService) : undefined,
      },
    });

    return NextResponse.json({ success: true, data: newProduct });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal buat produk" },
      { status: 500 },
    );
  }
}
