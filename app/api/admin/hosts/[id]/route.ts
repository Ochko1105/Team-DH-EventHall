import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Update host
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id);
    const body = await request.json();

    const updatedHost = await prisma.hosts.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({
      success: true,
      data: updatedHost,
    });
  } catch (error) {
    console.error("Error updating host:", error);
    return NextResponse.json(
      { error: "Failed to update host" },
      { status: 500 }
    );
  }
}

// Delete host
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id);

    // Delete associated bookings first
    await prisma.booking.deleteMany({
      where: { hostid: id },
    });

    // Delete the host
    await prisma.hosts.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Host deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting host:", error);
    return NextResponse.json(
      { error: "Failed to delete host" },
      { status: 500 }
    );
  }
}
