import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { requestId, status } = await req.json(); // action: "accept" | "decline"

    if (!requestId || !status) {
      return NextResponse.json(
        { message: "requestId and action required" },
        { status: 400 }
      );
    }

    // Enum-д тааруулж status тохируулах
    let statusEnum: "pending" | "approved" | "cancelled";

    if (status === "approved") {
      statusEnum = "approved";
    } else if (status === "cancelled") {
      statusEnum = "cancelled";
    } else {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: Number(requestId) },
      data: { status },
    });

    return NextResponse.json({ success: true, booking: updatedBooking });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to update booking" },
      { status: 500 }
    );
  }
}
