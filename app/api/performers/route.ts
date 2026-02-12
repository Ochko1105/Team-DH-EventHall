import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const performers = await prisma.performers.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ performers });
  } catch (error) {
    console.error("Error fetching performers:", error);
    return NextResponse.json(
      { error: "Failed to fetch performers" },
      { status: 500 }
    );
  }
}
