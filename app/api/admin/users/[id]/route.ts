import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Update user
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id);
    const body = await request.json();

    // Don't allow updating passwords directly through this endpoint
    if (body.password) {
      delete body.password;
    }

    const updatedUser = await prisma.mruser.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id);

    // Delete associated bookings first
    await prisma.booking.deleteMany({
      where: { userid: id },
    });

    // Delete the user
    await prisma.mruser.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
