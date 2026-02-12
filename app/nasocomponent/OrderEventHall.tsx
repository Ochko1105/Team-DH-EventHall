"use client";

import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrderEventHall() {
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const bookingRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // ----------------------------
  // FETCH BOOKINGS
  // ----------------------------
  useEffect(() => {
    setIsLoadingBookings(true);
    const token = localStorage.getItem("token");

    fetch("/api/bookings", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const bookingsData = data.bookings || [];

        // ----------------------------
        // FILTER: Зөвхөн EVENT HALL bookings авах
        // Performer booking → performersid байгаа
        // Event Hall booking → performersid null
        // ----------------------------
        const uniqueBookings = bookingsData.filter(
          (
            b: { date: any; starttime: any; hallid: any },
            index: any,
            self: any[]
          ) => {
            return (
              index ===
              self.findIndex(
                (x) =>
                  x.date === b.date &&
                  x.starttime === b.starttime &&
                  x.hallid === b.hallid
              )
            );
          }
        );

        setBookings(uniqueBookings);
        setAllBookings(uniqueBookings);

        if (uniqueBookings.length > 0) {
          setSelectedBooking(uniqueBookings[0]); // auto-select first booking
        }
      })
      .finally(() => setIsLoadingBookings(false));
  }, []);

  // ----------------------------
  // SELECT BOOKING
  // ----------------------------
  const handleBookingSelect = (booking: any) => {
    setSelectedBooking(booking);

    setTimeout(() => {
      const el = bookingRefs.current[booking.id];
      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }, 100);
  };

  return (
    <div className="p-6 rounded-2xl mt-5 bg-neutral-900">
      <h2 className="text-xl font-bold text-white mb-4">
        Таны захиалсан Event Hall
      </h2>

      <div className="max-h-60 overflow-y-auto pr-2 space-y-3 custom-scroll">
        {isLoadingBookings ? (
          // LOADING SKELETON
          Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl bg-neutral-800/60 border border-neutral-700/40 p-4"
            >
              <div className="flex justify-between items-center mb-3">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="space-y-2 mb-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-2/3 mt-2" />
            </div>
          ))
        ) : bookings.length === 0 ? (
          <p className="text-neutral-400">
            Та одоогоор Event Hall захиалаагүй байна.
          </p>
        ) : (
          bookings.map((b: any) => (
            <div
              key={b.id}
              ref={(el) => {
                bookingRefs.current[b.id] = el;
              }}
              onClick={() => handleBookingSelect(b)}
              className={`rounded-xl bg-neutral-800/60 border p-4 hover:bg-neutral-800/80 transition-colors backdrop-blur-sm cursor-pointer ${
                selectedBooking?.id === b.id
                  ? "border-blue-500 bg-neutral-800/80"
                  : "border-neutral-700/40"
              }`}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-white">
                  {b.event_halls?.name ?? "Event Hall"}

                  {selectedBooking?.id === b.id && (
                    <span className="ml-2 text-blue-400 text-sm">
                      ✓ Сонгогдсон
                    </span>
                  )}
                </h2>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${
                    b.status === "pending"
                      ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                      : b.status === "approved"
                      ? "bg-green-500/20 text-green-300 border border-green-500/30"
                      : "bg-red-500/20 text-red-300 border border-red-500/30"
                  }`}
                >
                  {b.status}
                </span>
              </div>

              {/* Details */}
              <div className="text-sm text-neutral-300 space-y-1 mb-2">
                <div>
                  <span className="font-medium text-neutral-100">Өдөр:</span>{" "}
                  {new Date(b.date).toLocaleDateString()}
                </div>

                <div>
                  <span className="font-medium text-neutral-100">
                    Эхлэх цаг:
                  </span>{" "}
                  {b.starttime}
                </div>
              </div>

              {/* Description */}
              <p className="text-neutral-400 text-sm mb-2 leading-relaxed">
                {b.event_description}
              </p>

              {/* Location */}
              <div className="text-neutral-500 text-sm flex items-center gap-1">
                <span>📍</span>
                <span className="truncate">{b.event_halls?.location}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
