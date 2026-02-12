import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Get all data for admin dashboard
export async function GET() {
  try {
    const [eventHalls, performers, hosts, users, bookings] = await Promise.all([
      prisma.event_halls.findMany({
        orderBy: { created_at: "desc" },
      }),
      prisma.performers.findMany({
        orderBy: { created_at: "desc" },
      }),
      prisma.hosts.findMany({
        orderBy: { id: "desc" },
      }),
      prisma.mruser.findMany({
        orderBy: { createdat: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          phone: true,
          createdat: true,
          // Don't send passwords
        },
      }),
      prisma.booking.findMany({
        orderBy: { date: "desc" },
        include: {
          User: {
            select: {
              name: true,
              email: true,
            },
          },
          event_halls: {
            select: {
              name: true,
            },
          },
          performers: {
            select: {
              name: true,
            },
          },
          hosts: {
            select: {
              name: true,
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        eventHalls,
        performers,
        hosts,
        users,
        bookings,
      },
    });
  } catch (error) {
    console.error("Error fetching admin data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
