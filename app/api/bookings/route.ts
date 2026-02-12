// app/api/bookings/route.ts

import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"; // эсвэл чамай JWT verify ашиглаж болох

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Token байхгүй байна" },
        { status: 401 }
      );
    }
    const token = authHeader.split(" ")[1];
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json(
        { error: "Token буруу эсвэл хүчингүй" },
        { status: 403 }
      );
    }

    const userId = decoded.id;

    const { searchParams } = new URL(req.url);

    const event_hall_id = searchParams.get("event_hall_id");
    const date = searchParams.get("date");
    const status = searchParams.get("status");

    const filters: any = {
      userid: userId,
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

    const allBookings = await prisma.booking.findMany({
      where: {
        performersid: { not: null },
        status: { in: ["pending", "approved"] },
      },
      select: {
        id: true,
        performersid: true,
        date: true,
        starttime: true,
        status: true,
      },
    });

    return NextResponse.json(
      {
        bookings: results,
        allBookings,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET bookings error:", error);
    return NextResponse.json({ error: "Серверийн алдаа" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Token байхгүй" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    let user: any;
    try {
      user = jwt.verify(token, process.env.JWT_SECRET || "secretKey");
      // user.email, user.id гэх мэт token-аас гаргаж авах
    } catch (err) {
      return NextResponse.json({ error: "Token буруу байна" }, { status: 401 });
    }

    const { hallId, bookings, status } = await req.json();
    if (!hallId || !bookings || !Array.isArray(bookings)) {
      return NextResponse.json(
        { error: "Танхим болон bookings array шаардлагатай" },
        { status: 400 }
      );
    }

    const createdBookings = [];

    for (const b of bookings) {
      const { date, type } = b;
      if (!date || !type) continue;

      let starttime = "",
        endtime = "";
      if (type === "am") {
        starttime = "08:00";
        endtime = "14:00";
      } else if (type === "pm") {
        starttime = "18:00";
        endtime = "23:00";
      } else {
        starttime = "09:00";
        endtime = "24:00";
      }

      const booking = await prisma.booking.create({
        data: {
          userid: user.id, // token-аас гаргасан user id
          // хүсвэл email-ийг хадгалах
          hallid: Number(hallId),
          hostid: null, // хэрэгтэй бол өөрчлөх
          ordereddate: new Date(),
          date: new Date(date),
          starttime,
          endtime,
          status: (status as any) || "pending", // Use status from request, default to pending
        },
      });

      createdBookings.push(booking);
    }

    return NextResponse.json(
      {
        message: "Захиалгууд амжилттай хадгалагдлаа",
        bookings: createdBookings,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ error: "Серверийн алдаа" }, { status: 500 });
  }
}
