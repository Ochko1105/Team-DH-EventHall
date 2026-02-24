import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import Joi from "joi";

// DTO & Validation Schema
const userUpdateSchema = Joi.object({
  name: Joi.string().min(1).max(50),
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^\+?\d{10,15}$/),
}).required();

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = parseInt((await params).id);
    const body = await request.json();

    // Joi validation → зөвхөн зөвшөөрөгдсөн талбарууд
    const { error, value: validatedBody } = userUpdateSchema.validate(body);
    if (error) {
      return NextResponse.json(
        { error: `Validation failed: ${error.message}` },
        { status: 400 },
      );
    }

    // Prisma update → зөвшөөрөгдсөн талбарууд л дамжина
    const updatedUser = await prisma.mruser.update({
      where: { id },
      data: validatedBody,
    });

    return NextResponse.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
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
      { status: 500 },
    );
  }
}
