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

    const hallIdNum = Number(hallId);
    if (Number.isNaN(hallIdNum)) {
      return NextResponse.json(
        { message: "hallId must be a number" },
        { status: 400 }
      );
    }

    // Зөвхөн PlusPrice-тэй booking-уудыг date, starttime, PlusPrice-тэй авна
    const bookings = await prisma.booking.findMany({
      where: {
        hallid: hallIdNum, // ✅ schema-д байгаа нэрээр
        PlusPrice: { not: null }, // ✅ schema-д байгаа нэрээр
      },
      select: {
        date: true,
        starttime: true, // ✅ жижиг үсэгтэй starttime
        PlusPrice: true,
      },
      orderBy: { date: "asc" },
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
