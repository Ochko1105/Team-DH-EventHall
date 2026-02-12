import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const { userid } = await request.json();

  const results = await prisma.booking.findMany({
    where: { userid: userid },
    include: {
      event_halls: true, // event hall-ийн мэдээллийг оруулах
    },
    orderBy: { id: "desc" },
  });

  // JSON-д шаардлагатай талбаруудыг ил тодоор оруулах
  const bookingsWithStatus = results.map((booking) => ({
    id: booking.id,
    date: booking.date,
    hallid: booking.hallid,
    starttime: booking.starttime,
    endtime: booking.endtime,
    status: booking.status, // status нэмлээ
    event_halls: booking.event_halls,
  }));

  return new Response(JSON.stringify({ bookings: bookingsWithStatus }));
}
