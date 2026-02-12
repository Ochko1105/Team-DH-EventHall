import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const hallId = req.nextUrl.searchParams.get("hallId");

    if (!hallId) {
      return NextResponse.json(
        { message: "hallId is required" },
        { status: 400 }
      );
    }

    const hall = await prisma.event_halls.findUnique({
      where: { id: Number(hallId) },
      select: { price: true },
    });

    if (!hall) {
      return NextResponse.json({ message: "Hall not found" }, { status: 404 });
    }

    return NextResponse.json({
      price: hall.price, // Int[]
    });
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
