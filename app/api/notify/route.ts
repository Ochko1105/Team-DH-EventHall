import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, name, content } = await req.json();

    if (!email || !name || !content) {
      return NextResponse.json(
        { success: false, message: "Шаардлагатай өгөгдөл дутуу байна" },
        { status: 400 }
      );
    }

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
      from: `"Event Hall" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Танд мэдэгдэл ирлээ",
      html: `
        <p>Сайн байна уу, ${name}?</p>
        <p>${content}</p>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Email амжилттай илгээлээ!",
    });
  } catch (error) {
    console.error("Email error:", error);

    return NextResponse.json(
      { success: false, message: "Email илгээж чадсангүй", error: `${error}` },
      { status: 500 }
    );
  }
}
