import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Update event hall
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id);

    const body = await request.json();

    const updatedHall = await prisma.event_halls.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({
      success: true,
      data: updatedHall,
    });
  } catch (error) {
    console.error("Error updating event hall:", error);
    return NextResponse.json(
      { error: "Failed to update event hall" },
      { status: 500 }
    );
  }
}

// Delete event hall
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id);

    // Delete associated bookings first
    await prisma.booking.deleteMany({
      where: { hallid: id },
    });

    // Delete the event hall
    await prisma.event_halls.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Event hall deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting event hall:", error);
    return NextResponse.json(
      { error: "Failed to delete event hall" },
      { status: 500 }
    );
  }
}
