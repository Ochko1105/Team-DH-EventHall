import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

/**
 * POST: User Sign-Up
 * Purpose: Handles user registration, password hashing, and initial JWT generation.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, password, role } = body;

    // 1. Basic validation: Ensure required fields are present
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 },
      );
    }

    // 2. Check for existing user to prevent duplicate accounts
    const existingUser = await prisma.mruser.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 },
      );
    }

    /** * 3. Role Assignment Logic
     * Default role is 'customer'.
     * If an Auth token is provided, we decode it to check if the requester
     * has 'admin' rights to assign specific roles (like 'hallowner').
     */
    let userRole = "customer";
    const authHeader = request.headers.get("authorization");

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        // Only allow role specification if the requester is an admin
        if (decoded.role === "admin" && role) {
          userRole = role;
        }
      } catch (err) {
        // If token is invalid/expired, proceed with default 'customer' role
      }
    }

    /**
     * 4. Password Hashing (Security Priority)
     * We use bcrypt with 10 salt rounds.
     * Reason: During early development, the database was set to public access.
     * Hashing ensures that even if DB records are viewed, passwords remain unreadable.
     */
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 5. Database Insertion: Create the user record
    const user = await prisma.mruser.create({
      data: {
        name,
        phone,
        email,
        password: hashedPassword,
        role: userRole,
      },
    });

    /**
     * 6. Auto-login: Generate JWT
     * We include the user's ID and Role in the payload for front-end access control.
     */
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined in environment variables.");
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      jwtSecret,
      { expiresIn: "20d" },
    );

    // 7. Remove sensitive password field before returning user data
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { user: userWithoutPassword, token },
      { status: 201 },
    );
  } catch (error) {
    console.error("Sign-Up API Error:", error);
    return NextResponse.json(
      {
        error: "An internal server error occurred.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
