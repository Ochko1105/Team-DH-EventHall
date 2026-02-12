import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const forms = await prisma.form.findMany({
      orderBy: { id: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: forms,
    });
  } catch (error) {
    console.error("Error fetching forms:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch forms" },
      { status: 500 }
    );
  }
}
