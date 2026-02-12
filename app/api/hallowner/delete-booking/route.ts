import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    // 1️⃣ Token шалгах
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const ownerId = decoded.id;

    // 2️⃣ Body-аас мэдээлэл авах
    const { hallId, date, timeSlot, price } = await req.json();

    if (!hallId || isNaN(Number(hallId))) {
      return NextResponse.json({ message: "Invalid hallId" }, { status: 400 });
    }

    // 3️⃣ TimeSlot mapping
    const timeMap: Record<string, { start: string; end: string }> = {
      am: { start: "09:00", end: "12:00" },
      pm: { start: "13:00", end: "17:00" },
      udur: { start: "18:00", end: "22:00" },
    };

    const slot = timeMap[timeSlot];
    if (!slot) {
      return NextResponse.json(
        { message: "Invalid time slot" },
        { status: 400 }
      );
    }

    // 4️⃣ Owner мөн эсэхийг шалгах
    const hall = await prisma.event_halls.findFirst({
      where: { id: Number(hallId), owner_id: ownerId },
    });
    if (!hall) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    // 5️⃣ Тухайн date + timeSlot дээр байгаа booking-ийг хайх
    let booking = await prisma.booking.findFirst({
      where: {
        hallid: Number(hallId),
        date: new Date(date),
        starttime: slot.start,
        endtime: slot.end,
      },
    });

    if (booking) {
      // 6️⃣ Байгаа booking-ийг update хийх
      booking = await prisma.booking.update({
        where: { id: booking.id },
        data: { PlusPrice: price ?? null },
      });
    } else {
      // 7️⃣ Байхгүй бол шинэ booking үүсгэх
      booking = await prisma.booking.create({
        data: {
          hallid: Number(hallId),
          userid: ownerId,
          date: new Date(date),
          starttime: slot.start,
          endtime: slot.end,
          status: "pending",
          PlusPrice: price ?? null,
        },
      });
    }

    return NextResponse.json({
      message: "Booking processed successfully",
      booking,
    });
  } catch (error) {
    console.error("POST /pricing error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
