import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Get all performers with genres
    const performers = await prisma.performers.findMany({
      select: {
        genre: true,
      },
      where: {
        genre: {
          not: null,
        },
      },
    });

    // Extract unique genres
    const genresSet = new Set<string>();
    performers.forEach((performer) => {
      if (performer.genre) {
        // Split by comma, slash, or other separators
        const genres = performer.genre.split(/[,\/]/).map((g) => g.trim());
        genres.forEach((genre) => {
          if (genre) genresSet.add(genre);
        });
      }
    });

    // Convert to sorted array
    const genres = Array.from(genresSet).sort();

    return NextResponse.json({ genres });
  } catch (error) {
    console.error("Error fetching genres:", error);
    return NextResponse.json(
      { error: "Failed to fetch genres" },
      { status: 500 }
    );
  }
}
