import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { performerId, hallId, starttime, bookeddate } = await req.json();

    if (!performerId || !hallId) {
      return NextResponse.json(
        { success: false, message: "performerId болон hallId шаардлагатай." },
        { status: 400 }
      );
    }

    // ---- TOKEN шалгах ----
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token байхгүй байна." },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.id;
    console.log({ userId });

    // ---- Хэрэглэгчийн мэдээлэл авах ----
    const user = await prisma.mruser.findUnique({
      where: { id: userId },
      select: { email: true, name: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Хэрэглэгч олдсонгүй" },
        { status: 404 }
      );
    }

    // ---- hallId ба performerId хослолыг шалгах ----
    const existingBooking = await prisma.booking.findFirst({
      where: {
        hallid: hallId,
        performersid: performerId,
        date: new Date(bookeddate),
        starttime, // эсвэл >=, <= нөхцлөөр цаг давхардлыг шалгах
      },
    });

    if (existingBooking) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Энэ Event Hall дээр энэ уран бүтээлч тухайн өдөр аль хэдийн захиалагдсан байна.",
        },
        { status: 409 }
      );
    }

    // ---- hallId-тэй performerId нь null booking байгаа эсэхийг шалгах ----
    // ---- hallId-тэй performerId нь null booking (ЗӨВХӨН тухайн хэрэглэгчийнх) ----
    let booking = await prisma.booking.findFirst({
      where: {
        hallid: hallId,
        performersid: null,
        userid: userId, // ⭐ ЭНД нэмнэ
      },
      include: {
        performers: true,
        event_halls: true,
        User: true,
      },
    });

    if (booking) {
      // Update хийх
      booking = await prisma.booking.update({
        where: { id: booking.id },
        data: {
          userid: userId, // ⭐ ЭНЭ ЧУХАЛ
          performersid: performerId,
          starttime,
          status: "pending",
        },
        include: {
          performers: true,
          event_halls: true,
          User: true,
        },
      });
    } else {
      // Шинэ booking үүсгэх
      booking = await prisma.booking.create({
        data: {
          userid: userId,
          hallid: hallId,
          performersid: performerId,
          ordereddate: new Date(),
          date: new Date(bookeddate),
          starttime,
          status: "pending",
        },
        include: {
          performers: true, // ✅ include
          event_halls: true,
          User: true,
        },
      });
    }

    // ---- Performer-д email илгээх ----
    if (booking.performers?.contact_email) {
      const performerEmailContent = `
        <p>Сайн байна уу, ${booking.performers.name}?</p>
        <p>Хэрэглэгч <strong>${
          booking.User.name
        }</strong> Таньд Event lux  захиалга хүсэлт илгээсэн байна:</p>
        <ul>
          <li>Event hall: ${booking.event_halls?.name}</li>
          <li>Огноо: ${new Date(booking.date).toLocaleDateString()}</li>
          <li>Эхлэх цаг: ${booking.starttime || "Тодорхойгүй"}</li>
        </ul>
        <p>Захиалга баталгаажуулахын тулд доорх товч дээр дарна уу:</p>
        <p>
          <a href="${
            process.env.NEXT_PUBLIC_BASE_URL
          }/booking-response?bookingId=${
        booking.id
      }&action=approve" style="padding:10px 20px; background-color:green; color:white; text-decoration:none; border-radius:5px; margin-left:10px;">Approve</a>
          <a href="${
            process.env.NEXT_PUBLIC_BASE_URL
          }/booking-response?bookingId=${
        booking.id
      }&action=decline" style="padding:10px 20px; background-color:red; color:white; text-decoration:none; border-radius:5px; margin-left:10px;">Decline</a>
        </p>
      `;

      await sendEmail({
        email: booking.performers.contact_email,
        name: booking.performers.name,
        content: performerEmailContent,
      });
    }

    console.log({ booking });
    return NextResponse.json({
      success: true,
      message: "Уран бүтээлч амжилттай захиалагдлаа!",
      booking,
    });
  } catch (error: any) {
    console.error("Booking API Error:", error);
    return NextResponse.json(
      { success: false, message: "Алдаа гарлаа", error: error.message },
      { status: 500 }
    );
  }
}

// ---- Email илгээх функц ----
async function sendEmail({ email, name, content }: any) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Event lux" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Танд шинэ захиалга ирлээ",
      html: content,
    });
  } catch (err) {
    console.error("Email send error:", err);
  }
}
