import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    const form = await prisma.form.findUnique({ where: { id } });

    if (!form)
      return NextResponse.json({ message: "Form not found" }, { status: 404 });

    // 2. Form-ийг event_halls-д нэмэх
    const newEventHall = await prisma.event_halls.create({
      data: {
        name: form.hallname,
        location: form.location,
        phonenumber: form.number,
        images: form.images,
        capacity: null,
        description: null,
        suitable_events: [],
        menu: [],
        parking_capacity: null,
        additional_informations: [],
        informations_about_hall: [],
        advantages: [],
        price: [],
        rating: null,
      },
    });

    // 3. Form-ийг устгах (хүсвэл идэвхжүүлж болно)
    // await prisma.form.delete({ where: { id: formId } });

    return NextResponse.json({
      message: "Form added to event_halls",
      newEventHall,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
