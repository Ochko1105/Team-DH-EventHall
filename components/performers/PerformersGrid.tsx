/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Skeleton } from "@/components/ui/skeleton";
import PerformerCard from "./PerformerCard";

interface PerformersGridProps {
  performers: any[];
  isLoading: boolean;
  bookingPerformer: number | null;
  getPerformerAvailability: (id: number) => string;
  getAvailabilityColor: (availability: string) => string;
  isPerformerBooked: (id: number) => boolean;
  onBook: (id: number) => void;
}

export default function PerformersGrid({
  performers,
  isLoading,
  bookingPerformer,
  getPerformerAvailability,
  getAvailabilityColor,
  isPerformerBooked,
  onBook,
}: PerformersGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="bg-neutral-900 rounded-lg overflow-hidden"
          >
            <Skeleton className="h-60 w-full" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-6 w-1/3" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 flex-1" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (performers.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <div className="text-neutral-400 text-lg mb-2">
          Уучлаарай, уран бүтээлч олдсонгүй
        </div>
        <div className="text-neutral-500 text-sm">
          Шүүлтүүрийг өөрчилж дахин оролдоно уу
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {performers.map((performer) => (
        <PerformerCard
          key={performer.id}
          performer={performer}
          availability={getPerformerAvailability(performer.id)}
          availabilityColor={getAvailabilityColor(
            getPerformerAvailability(performer.id)
          )}
          isBooked={isPerformerBooked(performer.id)}
          isBooking={bookingPerformer === performer.id}
          onBook={onBook}
        />
      ))}
    </div>
  );
}
