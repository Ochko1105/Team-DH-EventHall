import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { verifyHallOwner } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { hallId, date, timeSlot, price } = body;

    const parsedHallId = Number(hallId);
    if (!parsedHallId || isNaN(parsedHallId)) {
      return NextResponse.json({ message: "Invalid hallId" }, { status: 400 });
    }

    const ownerId = await verifyHallOwner(req, parsedHallId);

    const parsedDate = new Date(date);
    if (!date || isNaN(parsedDate.getTime())) {
      return NextResponse.json({ message: "Invalid date" }, { status: 400 });
    }

    const parsedPrice =
      price !== undefined && price !== null ? Number(price) : null;

    if (price !== undefined && price !== null && isNaN(parsedPrice!)) {
      return NextResponse.json({ message: "Invalid price" }, { status: 400 });
    }

    const timeMap: Record<string, { start: string; end: string }> = {
      am: { start: "09:00", end: "12:00" },
      pm: { start: "13:00", end: "17:00" },
      udur: { start: "18:00", end: "22:00" },
    };

    const slot = timeMap[timeSlot];
    if (!slot) {
      return NextResponse.json(
        { message: "Invalid time slot" },
        { status: 400 },
      );
    }

    const booking = await prisma.$transaction(async (tx) => {
      const existing = await tx.booking.findUnique({
        where: {
          hallid_date_starttime_endtime: {
            hallid: parsedHallId,
            date: parsedDate,
            starttime: slot.start,
            endtime: slot.end,
          },
        },
      });

      if (existing) {
        return tx.booking.update({
          where: { id: existing.id },
          data: { PlusPrice: parsedPrice },
        });
      }

      return tx.booking.create({
        data: {
          hallid: parsedHallId,
          userid: ownerId,
          date: parsedDate,
          starttime: slot.start,
          endtime: slot.end,
          status: "pending",
          PlusPrice: parsedPrice,
        },
      });
    });

    return NextResponse.json(
      {
        message: "Booking processed successfully",
        booking,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("POST /pricing error:", error);

    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (error.message === "INVALID_TOKEN") {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 },
      );
    }

    if (error.message === "FORBIDDEN") {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    if (error.message === "NOT_FOUND") {
      return NextResponse.json({ message: "Hall not found" }, { status: 404 });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { message: "Booking already exists for this slot" },
          { status: 409 },
        );
      }
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
