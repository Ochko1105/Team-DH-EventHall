/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    // 1. Extract Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authorization header missing or invalid" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

    if (!decoded.id) {
      return NextResponse.json(
        { error: "Invalid token payload", payload: decoded },
        { status: 401 }
      );
    }

    // 3. Fetch user from database
    const user = await prisma.mruser.findUnique({
      where: { id: decoded.id }, // FIXED
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 4. Return user data
    return NextResponse.json({ user });
  } catch (error: any) {
    console.error("TOKEN VERIFY ERROR:", error);

    return NextResponse.json(
      { error: "Invalid or expired token", details: error.message },
      { status: 401 }
    );
  }
}
