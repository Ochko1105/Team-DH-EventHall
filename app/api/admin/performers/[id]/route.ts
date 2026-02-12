import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Update performer
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id);
    const body = await request.json();

    const updatedPerformer = await prisma.performers.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({
      success: true,
      data: updatedPerformer,
    });
  } catch (error) {
    console.error("Error updating performer:", error);
    return NextResponse.json(
      { error: "Failed to update performer" },
      { status: 500 }
    );
  }
}

// Delete performer
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id);

    // Delete associated bookings first
    await prisma.booking.deleteMany({
      where: { performersid: id },
    });

    // Delete the performer
    await prisma.performers.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Performer deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting performer:", error);
    return NextResponse.json(
      { error: "Failed to delete performer" },
      { status: 500 }
    );
  }
}
