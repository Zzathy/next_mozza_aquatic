import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      brand,
      categoryId,
      description,
      price,
      minStock,
      isActive,
      isService,
    } = body;

    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: "Produk tidak ditemukan" },
        { status: 404 },
      );
    }

    const cleanBrand =
      brand !== undefined
        ? brand
          ? String(brand).trim()
          : null
        : existingProduct.brand;
    let newSlug = existingProduct.slug;

    if (
      (name && name !== existingProduct.name) ||
      (brand !== undefined && cleanBrand !== existingProduct.brand)
    ) {
      const targetName = name || existingProduct.name;
      const fullNameForSlug = cleanBrand ? `${cleanBrand} ${targetName}` : targetName;
      newSlug = fullNameForSlug
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      const checkSlug = await prisma.product.findUnique({
        where: { slug: newSlug },
      });

      if (checkSlug && checkSlug.id !== parseInt(id)) {
        return NextResponse.json(
          { success: false, message: "Produk dengan nama dan merk ini sudah ada" },
          { status: 409 },
        );
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name: name || existingProduct.name,
        brand: cleanBrand,
        slug: newSlug,
        categoryId: categoryId
          ? parseInt(categoryId)
          : existingProduct.categoryId,
        description:
          description !== undefined ? description : existingProduct.description,
        price: price !== undefined ? parseInt(price) : existingProduct.price,
        minStock:
          minStock !== undefined
            ? parseInt(minStock)
            : existingProduct.minStock,
        isActive:
          isActive !== undefined ? Boolean(isActive) : existingProduct.isActive,
        isService:
          isService !== undefined
            ? Boolean(isService)
            : existingProduct.isService,
      },
    });

    return NextResponse.json({ success: true, data: updatedProduct });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal update produk" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({
      success: true,
      message: "Produk berhasil dihapus",
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        return NextResponse.json(
          {
            success: false,
            message:
              "Gagal! Produk ini udah pernah ditransaksikan. Tolong non-aktifkan (isActive: false) saja lewat fitur Edit.",
          },
          { status: 400 },
        );
      }
    }

    return NextResponse.json(
      { success: false, message: "Gagal hapus produk" },
      { status: 500 },
    );
  }
}
