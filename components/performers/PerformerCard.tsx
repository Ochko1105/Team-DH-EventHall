/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface PerformerCardProps {
  performer: any;
  availability: string;
  availabilityColor: string;
  isBooked: boolean;
  isBooking: boolean;
  onBook: (id: number) => void;
}

export default function PerformerCard({
  performer,
  availability,
  availabilityColor,
  isBooked,
  isBooking,
  onBook,
}: PerformerCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/performers/${performer.id}`)}
      className="bg-neutral-900 cursor-pointer rounded-lg overflow-hidden hover:scale-[1.02] transition"
    >
      <div className="relative h-90 bg-neutral-800">
        {performer.image ? (
          <Image
            src={performer.image}
            alt={performer.name}
            fill
            className="object-cover"
            unoptimized
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://via.placeholder.com/400x300?text=No+Image";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-500">
            No Image
          </div>
        )}

        <div
          className={`absolute top-3 left-3 ${availabilityColor} text-white px-3 py-1 rounded-full text-xs font-semibold`}
        >
          {availability}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold mb-1">{performer.name}</h3>

        <p className="text-neutral-400 text-sm mb-3 truncate">
          {performer.performance_type || performer.genre}
        </p>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <FaStar className="text-yellow-400" />
            <span className="font-semibold">
              {performer.popularity
                ? Number(performer.popularity).toLocaleString()
                : "N/A"}
            </span>
            <span className="text-xs text-gray-400">Viberate</span>
          </div>

          <div className="text-lg font-bold text-blue-600">
            {Number(performer.price).toLocaleString()}₮
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/performers/${performer.id}`)}
            className="flex-1 cursor-pointer px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition text-sm"
          >
            Дэлгэрэнгүй
          </button>

          <Button
            onClick={() => onBook(performer.id)}
            disabled={isBooked || isBooking}
            className={`flex-1 cursor-pointer text-white ${
              isBooked
                ? "bg-gray-700 cursor-not-allowed opacity-50"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isBooking
              ? "Захиалж байна..."
              : isBooked
              ? "Захиалагдсан"
              : "Захиалах"}
          </Button>
        </div>
      </div>
    </div>
  );
}
