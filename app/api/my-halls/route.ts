import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

// Get all halls for the logged-in hall owner
export async function GET(request: NextRequest) {
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

    // Verify user is a hallowner
    const user = await prisma.mruser.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== "hallowner") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Get all halls owned by this user
    const halls = await prisma.event_halls.findMany({
      where: { owner_id: userId },
      orderBy: { created_at: "desc" },
      include: {
        booking: {
          select: {
            id: true,
            status: true,
            ordereddate: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      halls,
    });
  } catch (error) {
    console.error("Error fetching halls:", error);
    return NextResponse.json(
      { error: "Failed to fetch halls" },
      { status: 500 }
    );
  }
}
