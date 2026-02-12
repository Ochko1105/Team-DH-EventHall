import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const eventHalls = await prisma.event_halls.findMany({
      orderBy: { id: "asc" },
    });

    return NextResponse.json({ data: eventHalls });
  } catch (error) {
    console.error("Error fetching event halls:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch event halls",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
