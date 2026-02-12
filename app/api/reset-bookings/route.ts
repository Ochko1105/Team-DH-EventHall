import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    // Delete booking by id
    const deletedBooking = await prisma.booking.delete({
      where: { id: Number(id) }, // id-ийн type Number бол Number(id), String бол 그대로
    });

    return NextResponse.json({
      message: `Booking with ID ${id} deleted successfully`,
      booking: deletedBooking,
    });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json(
      { error: "Failed to delete booking" },
      { status: 500 }
    );
  }
}
