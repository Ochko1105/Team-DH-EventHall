import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { searchValue } = body;

    if (!searchValue) {
      return NextResponse.json(
        { error: "No searchValue provided" },
        { status: 400 }
      );
    }

    // 1) Event Halls хайлт
    const halls = prisma.event_halls.findMany({
      where: {
        OR: [
          { name: { contains: searchValue, mode: "insensitive" } },
          { location: { contains: searchValue, mode: "insensitive" } },
          { description: { contains: searchValue, mode: "insensitive" } },
          { phonenumber: { contains: searchValue, mode: "insensitive" } },
          { capacity: { contains: searchValue, mode: "insensitive" } },

          // Array field хайлт
          { suitable_events: { has: searchValue } },
          { menu: { has: searchValue } },
          { advantages: { has: searchValue } },
          { informations_about_hall: { has: searchValue } },
          { additional_informations: { has: searchValue } },
        ],
      },
      orderBy: { id: "asc" },
    });

    // 2) Performers хайлт
    const performers = prisma.performers.findMany({
      where: {
        OR: [
          { name: { contains: searchValue, mode: "insensitive" } },
          { bio: { contains: searchValue, mode: "insensitive" } },
          { genre: { contains: searchValue, mode: "insensitive" } },
          { performance_type: { contains: searchValue, mode: "insensitive" } },
          { contact_phone: { contains: searchValue, mode: "insensitive" } },
          { contact_email: { contains: searchValue, mode: "insensitive" } },
        ],
      },
      orderBy: { id: "asc" },
    });

    // 3) Hosts хайлт
    const hosts = prisma.hosts.findMany({
      where: {
        OR: [
          { name: { contains: searchValue, mode: "insensitive" } },
          { email: { contains: searchValue, mode: "insensitive" } },
          { phone: { contains: searchValue, mode: "insensitive" } },
        ],
      },
      orderBy: { id: "asc" },
    });

    // ---- гурван query-г зэрэг гүйцэтгэх ----
    const [hallResults, performerResults, hostResults] = await Promise.all([
      halls,
      performers,
      hosts,
    ]);

    return NextResponse.json({
      message: "success",
      halls: hallResults,
      performers: performerResults,
      hosts: hostResults,
    });
  } catch (error) {
    console.error("Error searching:", error);
    return NextResponse.json(
      { error: "Failed to search data" },
      { status: 500 }
    );
  }
}
