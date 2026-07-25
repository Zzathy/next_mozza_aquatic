import { prisma } from "../lib/prisma";

async function main() {
  console.log("Seeding database...");

  await prisma.purchaseItem.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const catFish = await prisma.category.create({
    data: { name: "Ikan", slug: "ikan" },
  });
  const catFood = await prisma.category.create({
    data: { name: "Pakan", slug: "pakan" },
  });
  const catTool = await prisma.category.create({
    data: { name: "Alat", slug: "alat" },
  });
  const catPlant = await prisma.category.create({
    data: { name: "Tanaman", slug: "tanaman" },
  });

  const p1 = await prisma.product.create({
    data: {
      name: "Manfish Platinum",
      slug: "manfish-platinum",
      categoryId: catFish.id,
      price: 15000,
    },
  });
  const p2 = await prisma.product.create({
    data: {
      name: "Guppy",
      slug: "guppy",
      categoryId: catFish.id,
      price: 5000,
    },
  });
  const p3 = await prisma.product.create({
    data: {
      name: "Takari S",
      slug: "takari-s",
      categoryId: catFood.id,
      price: 5000,
    },
  });
  const p4 = await prisma.product.create({
    data: {
      name: "Agaru Floating",
      slug: "agaru-floating",
      categoryId: catFood.id,
      price: 10000,
    },
  });
  const p5 = await prisma.product.create({
    data: {
      name: "Kandila Z-20",
      slug: "kandila-z-20",
      categoryId: catTool.id,
      price: 40000,
    },
  });
  const p6 = await prisma.product.create({
    data: {
      name: "Kandila ECO-103",
      slug: "kandila-eco-103",
      categoryId: catTool.id,
      price: 85000,
    },
  });
  const p7 = await prisma.product.create({
    data: {
      name: "Anubias Nana",
      slug: "anubias-nana",
      categoryId: catPlant.id,
      price: 50000,
    },
  });
  const p8 = await prisma.product.create({
    data: {
      name: "Bucephalandra",
      slug: "bucephalandra",
      categoryId: catPlant.id,
      price: 35000,
    },
  });

  await prisma.purchase.create({
    data: {
      supplierName: "Mas Ndut Tulungagung",
      entryDate: new Date("2026-07-01T10:00:00Z"),
      totalAmount: 205000,
      finalAmount: 205000,
      paymentStatus: "Lunas",
      purchaseItems: {
        create: [
          {
            productId: p1.id,
            initialStock: 25,
            remainingStock: 10,
            buyPrice: 5000,
          },
          {
            productId: p2.id,
            initialStock: 50,
            remainingStock: 50,
            buyPrice: 1600,
          },
        ],
      },
    },
  });

  console.log("Database seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
