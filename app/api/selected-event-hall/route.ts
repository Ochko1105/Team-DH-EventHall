import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { eventHallId } = await request.json();

    if (!eventHallId) {
      return NextResponse.json(
        { error: "Event hall ID is required" },
        { status: 400 }
      );
    }

    if (isNaN(Number(eventHallId))) {
      return NextResponse.json(
        { error: "Invalid event hall ID" },
        { status: 400 }
      );
    }

    const selectedEventHall = await prisma.event_halls.findUnique({
      where: { id: Number(eventHallId) },
    });

    if (!selectedEventHall) {
      return NextResponse.json(
        { error: "Event hall not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: selectedEventHall });
  } catch (error) {
    console.error("Error fetching event hall:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch event hall",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
