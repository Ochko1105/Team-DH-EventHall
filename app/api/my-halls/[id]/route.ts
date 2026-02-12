import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

// Update hall
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const decoded = jwt.verify(token, jwtSecret) as any;
    const userId = decoded.id;
    const { id } = await params;
    const hallId = parseInt(id);

    // Verify user is a hallowner
    const user = await prisma.mruser.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== "hallowner") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Verify the hall belongs to this user
    const hall = await prisma.event_halls.findUnique({
      where: { id: hallId },
    });

    if (!hall || hall.owner_id !== userId) {
      return NextResponse.json(
        { error: "Hall not found or access denied" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const updatedHall = await prisma.event_halls.update({
      where: { id: hallId },
      data: body,
    });

    return NextResponse.json({
      success: true,
      hall: updatedHall,
    });
  } catch (error) {
    console.error("Error updating hall:", error);
    return NextResponse.json(
      { error: "Failed to update hall" },
      { status: 500 }
    );
  }
}

// Get single hall
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const { id } = await params;

    const decoded = jwt.verify(token, jwtSecret) as any;
    const userId = decoded.id;
    const hallId = parseInt(id);

    const hall = await prisma.event_halls.findUnique({
      where: { id: hallId },
      include: {
        booking: {
          include: {
            User: {
              select: {
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    if (!hall || hall.owner_id !== userId) {
      return NextResponse.json(
        { error: "Hall not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      hall,
    });
  } catch (error) {
    console.error("Error fetching hall:", error);
    return NextResponse.json(
      { error: "Failed to fetch hall" },
      { status: 500 }
    );
  }
}
