import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function GET() {
  try {
    const passwordSA = await bcrypt.hash("superadmin_mozza", 10);
    const passwordA = await bcrypt.hash("admin_mozza", 10);
    const passwordP = await bcrypt.hash("pegawai_mozza", 10);

    const users = [
      { username: "superadmin", password: passwordSA, role: "Superadmin" },
      { username: "admin", password: passwordA, role: "Admin" },
      { username: "pegawai", password: passwordP, role: "Pegawai" },
    ];

    for (const u of users) {
      await prisma.user.upsert({
        where: { username: u.username },
        update: {},
        create: u,
      });
    }

    return NextResponse.json(
      {
        message:
          "3 Akun berhasil disuntik ke database! Password: superadmin_mozza, admin_mozza, pegawai_mozza",
      },
      { status: 200 },
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Gagal bikin akun";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
