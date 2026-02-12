import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const performer = await prisma.performers.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!performer) {
      return NextResponse.json(
        { error: "Performer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ performer });
  } catch (error) {
    console.error("Error fetching performer:", error);
    return NextResponse.json(
      { error: "Failed to fetch performer" },
      { status: 500 }
    );
  }
}
