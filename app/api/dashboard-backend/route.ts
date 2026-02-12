import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ error: "No token" }, { status: 401 });

    const token = authHeader.replace("Bearer ", "");

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = decoded.id;

    // ---- Бүгдийг буцаах, distinct байхгүй ----
    const bookings = await prisma.booking.findMany({
      where: { userid: userId },
      include: {
        event_halls: true,
        performers: true,
        hosts: true,
      },
      orderBy: { date: "asc" },
    });

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
