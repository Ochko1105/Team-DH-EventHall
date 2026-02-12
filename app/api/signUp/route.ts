import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
export const runtime = "nodejs";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, password, role } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Validate role - only allow customer, hallowner, or admin
    const allowedRoles = ["customer", "hallowner", "admin"];
    const userRole = role && allowedRoles.includes(role) ? role : "customer";

    const existingUser = await prisma.mruser.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.mruser.create({
      data: {
        name,
        phone,
        email,
        password: hashedPassword,
        role: userRole,
      },
    });

    // Auto-login: Generate JWT
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error(
        "JWT_SECRET is not defined in the environment variables."
      );
    }
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      jwtSecret,
      { expiresIn: "20d" }
    );

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { user: userWithoutPassword, token },
      { status: 201 }
    );
  } catch (error) {
    console.error("Sign-Up API Error:", error); // Log the full error for debugging
    return NextResponse.json(
      {
        error: "An internal server error occurred.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
