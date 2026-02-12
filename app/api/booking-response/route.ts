import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const bookingId = searchParams.get("bookingId");
  const action = searchParams.get("action"); // approve эсвэл decline

  if (!bookingId || !action) {
    return NextResponse.json(
      { success: false, message: "Мэдээлэл дутуу байна" },
      { status: 400 }
    );
  }

  const booking = await prisma.booking.update({
    where: { id: Number(bookingId) },
    data: {
      status: action === "approve" ? "approved" : "cancelled",
    },
    include: {
      User: true,
      performers: true,
      event_halls: true,
    },
  });

  // Хэрэглэгчид email мэдэгдэл
  await sendEmail({
    email: booking.User.email,
    name: booking.User.name,
    content: `Таны захиалга ${booking.performers?.name}-д ${
      action === "approve"
        ? "баталгаажлаа цагийг хөгжилтэй өнгөрүүлээрэй! манайхаар зочилсонд баярлалаа. үнсэе!"
        : "татгалзлаа уучлаарай. та өөр захиалга хийхийг хүсвэл манай вэбсайтаар зочлоорой"
    }. `,
  });

  return NextResponse.json({
    success: true,
    message: `Booking ${action} боллоо`,
    booking,
  });
}
async function sendEmail({
  email,
  name,
  content,
}: {
  email: string;
  name: string;
  content: string;
}) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Eventlux" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Таны захиалгын хүсэлтэнд хариу ирлээ",
    html: `
      <p>Сайн байна уу, ${name}?</p>
      <p>${content}</p>
    `,
  });
}
