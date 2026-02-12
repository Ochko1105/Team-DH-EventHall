/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type HostType = {
  id: number;
  name: string;
  title: string;
  image: string;
  rating: number;
  status: "Боломжтой" | "Захиалагдсан" | "Хүлээгдэж байна";
  tags: string[];
  price: number;
};

interface HostCardProps {
  host: HostType;
  selectedBooking?: any;
}

const handleBooking = async (hostId: number, selectedBooking: any) => {
  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("Захиалга хийхийн тулд эхлээд нэвтэрнэ үү.");
    return;
  }

  if (!selectedBooking) {
    toast.error("Та эхлээд Event Hall-оос сонголт хийнэ үү.");
    return;
  }

  const bookingPromise = fetch("/api/hosts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      hostId,
      hallId: selectedBooking.hallid,
      starttime: selectedBooking.starttime,
      bookeddate: selectedBooking.date,
    }),
  }).then(async (res) => {
    const data = await res.json();
    if (!data.success) {
      throw new Error(data.message || "Алдаа гарлаа!");
    }
    return data;
  });

  toast.promise(bookingPromise, {
    loading: "Захиалга илгээж байна...",
    success:
      "Хөтлөгч захиалах хүсэлт явууллаа. Таньд мэдэгдэл ирнэ, Dashboard хэсгээс харна уу!",
    error: (err) => err.message || "Захиалга илгээхэд алдаа гарлаа.",
  });
};

export default function HostCard({ host, selectedBooking }: HostCardProps) {
  const isBooked = host.status === "Захиалагдсан";

  const getStatusStyles = () => {
    switch (host.status) {
      case "Боломжтой":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Захиалагдсан":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    }
  };
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/host/${host.id}`)}
      className="bg-zinc-900 cursor-pointer p-5 sm:p-6 rounded-2xl border border-zinc-800 text-white hover:border-zinc-700 transition-all duration-300 flex flex-col"
    >
      {/* Profile Image */}
      <img
        src={host.image || "/placeholder.svg"}
        alt={host.name}
        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full mx-auto object-cover ring-2 ring-zinc-800"
      />

      {/* Name & Title */}
      <h2 className="text-center mt-4 font-semibold text-lg sm:text-xl text-white">
        {host.name}
      </h2>
      <p className="text-center text-sm text-zinc-400">{host.title}</p>

      {/* Tags */}
      <div className="flex justify-center items-center gap-2 flex-wrap mt-4">
        {host.tags.map((tag, idx) => (
          <span
            key={idx}
            className="text-xs bg-blue-500/10 py-1.5 px-3 border border-blue-500/20 rounded-full text-blue-400"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Rating */}
      <p className="text-center mt-4 font-medium text-zinc-300">
        <span className="text-amber-400">★</span> {host.rating}/5
      </p>

      {/* Status Badge */}
      <div className="flex justify-center mt-3">
        <span
          className={`text-xs font-medium px-3 py-1.5 rounded-full border ${getStatusStyles()}`}
        >
          {host.status}
        </span>
      </div>

      {/* Price */}
      <p className="text-center text-blue-400 py-5 font-bold text-xl sm:text-2xl">
        {Number(host.price).toLocaleString()}₮
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-auto">
        <Link
          href={`/host/${host.id}`}
          className="flex-1 bg-zinc-800 border border-zinc-700 text-zinc-300 py-2.5 rounded-xl hover:bg-zinc-700 hover:text-white text-sm text-center transition-colors"
        >
          Профайл үзэх
        </Link>

        <div className="relative flex-1 group">
          <button
            disabled={isBooked}
            onClick={() => !isBooked && handleBooking(host.id, selectedBooking)}
            className={`w-full py-2.5  cursor-pointer rounded-xl text-sm font-medium transition-all duration-200 ${
              isBooked
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500 text-white"
            }`}
          >
            Захиалах
          </button>

          {isBooked && (
            <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 bg-red-600 text-xs text-white px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Захиалагдсан
              <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-red-600" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
