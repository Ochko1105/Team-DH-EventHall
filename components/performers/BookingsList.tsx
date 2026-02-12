"use client";
import { Skeleton } from "@/components/ui/skeleton";

interface BookingsListProps {
  bookings: any[];
  isLoading: boolean;
  selectedBooking: any;
  onBookingSelect: (booking: any) => void;
  bookingRefs: React.MutableRefObject<{ [key: number]: HTMLDivElement | null }>;
}

export default function BookingsList({
  bookings,
  isLoading,
  selectedBooking,
  onBookingSelect,
  bookingRefs,
}: BookingsListProps) {
  return (
    <div className="max-h-60 overflow-y-auto pr-2 space-y-3 custom-scroll">
      {isLoading
        ? Array.from({ length: 2 }).map((_, index) => (
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
        : bookings?.map((b: any) => (
            <div
              key={b.id}
              ref={(el) => {
                bookingRefs.current[b.id] = el;
              }}
              onClick={() => onBookingSelect(b)}
              className={`rounded-xl bg-neutral-800/60 border p-4 hover:bg-neutral-800/80 transition-colors backdrop-blur-sm cursor-pointer ${
                selectedBooking?.id === b.id
                  ? "border-blue-500 bg-neutral-800/80"
                  : "border-neutral-700/40"
              }`}
            >
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
          ))}
    </div>
  );
}
