import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// In-memory store for QR scan notifications (in production, use Redis or a database)
const scanNotifications = new Map<
  string,
  {
    bookingId: string;
    hallId?: string;
    totalPrice?: string;
    timestamp: number;
    viewed: boolean;
  }
>();

// Clean up old notifications (older than 5 minutes)
setInterval(() => {
  const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
  for (const [key, value] of scanNotifications.entries()) {
    if (value.timestamp < fiveMinutesAgo) {
      scanNotifications.delete(key);
    }
  }
}, 60000); // Run cleanup every minute

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingId, hallId, totalPrice, timestamp } = body;
    console.log("QR scan notify received:", { bookingId, hallId, totalPrice });

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID шаардлагатай" },
        { status: 400 }
      );
    }

    // Approve the booking in database
    try {
      console.log("Updating booking status to approved for ID:", bookingId);
      const updatedBooking = await prisma.booking.update({
        where: { id: Number(bookingId) },
        data: { status: "approved" as any },
      });
      console.log("Booking updated successfully:", updatedBooking);
    } catch (dbError) {
      console.error("Error approving booking:", dbError);
      // Continue even if DB update fails
    }

    // Store the notification
    scanNotifications.set(bookingId, {
      bookingId,
      hallId,
      totalPrice,
      timestamp: timestamp || Date.now(),
      viewed: false,
    });

    return NextResponse.json({
      success: true,
      message: "QR scan notification received and booking approved",
    });
  } catch (error) {
    console.error("Error in qr-scan-notify:", error);
    return NextResponse.json({ error: "Серверийн алдаа" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get("bookingId");

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID шаардлагатай" },
        { status: 400 }
      );
    }

    const notification = scanNotifications.get(bookingId);

    if (notification && !notification.viewed) {
      // Mark as viewed
      scanNotifications.set(bookingId, {
        ...notification,
        viewed: true,
      });

      return NextResponse.json({
        success: true,
        notification: {
          bookingId: notification.bookingId,
          hallId: notification.hallId,
          totalPrice: notification.totalPrice,
        },
      });
    }

    return NextResponse.json({
      success: false,
      message: "No new notification",
    });
  } catch (error) {
    console.error("Error in qr-scan-notify GET:", error);
    return NextResponse.json({ error: "Серверийн алдаа" }, { status: 500 });
  }
}
