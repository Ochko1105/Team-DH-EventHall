"use client";

import { use, useEffect, useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function QRScanPage({
  searchParams,
}: {
  searchParams: Promise<{
    bookingId?: string;
    hallId?: string;
    totalPrice?: string;
  }>;
}) {
  const params = use(searchParams);
  const [status, setStatus] = useState<"processing" | "success" | "error">(
    "processing"
  );

  useEffect(() => {
    const notifyComputer = async () => {
      try {
        const bookingId = params.bookingId;
        const hallId = params.hallId;
        const totalPrice = params.totalPrice;

        if (!bookingId) {
          setStatus("error");
          return;
        }

        // Send notification to server to trigger computer display
        const response = await fetch("/api/qr-scan-notify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookingId,
            hallId,
            totalPrice,
            timestamp: Date.now(),
          }),
        });

        if (response.ok) {
          setStatus("success");
          // Auto-close after 1 second
          setTimeout(() => {
            window.close();
            // If window.close() doesn't work (some browsers block it), redirect to empty page
            window.location.href = "about:blank";
          }, 1000);
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error("Error notifying computer:", error);
        setStatus("error");
      }
    };

    notifyComputer();
  }, [params]);

  // Minimal UI - just show a quick flash
  if (status === "processing") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping mx-auto"></div>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-red-500 rounded-full flex items-center justify-center mx-auto">
          <span className="text-red-500 text-2xl">✕</span>
        </div>
      </div>
    </div>
  );
}
