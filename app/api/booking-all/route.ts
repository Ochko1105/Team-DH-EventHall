import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const event_hall_id = searchParams.get("event_hall_id");
    const date = searchParams.get("date");
    const status = searchParams.get("status");

    // Query conditions - зөвхөн PlusPrice null байгаа booking-ууд
    const filters: any = {
      PlusPrice: null, // 🔥 зөвхөн null байгаа booking-ууд
    };

    if (event_hall_id) filters.hallid = Number(event_hall_id);
    if (status) filters.status = status;
    if (date) filters.date = new Date(date);

    const results = await prisma.booking.findMany({
      where: filters,
      include: {
        event_halls: true,
      },
      orderBy: { id: "desc" },
    });

    // Performers-ийн availability шалгахдаа мөн PlusPrice null
    const allBookings = await prisma.booking.findMany({
      where: {
        performersid: { not: null },
        status: { in: ["pending", "approved"] },
        PlusPrice: null, // 🔥 зөвхөн null
      },
      select: {
        id: true,
        performersid: true,
        date: true,
        starttime: true,
        status: true,
      },
    });

    return NextResponse.json({
      bookings: results,
      allBookings: allBookings,
    });
  } catch (error) {
    console.error("GET bookings error:", error);
    return NextResponse.json({ error: "Серверийн алдаа" }, { status: 500 });
  }
}
