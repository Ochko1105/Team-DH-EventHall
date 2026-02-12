"use client";

import { useRouter } from "next/navigation";
import useSWR from "swr";
import Image from "next/image";

import {
  Calendar,
  MapPin,
  Phone,
  Search,
  Plus,
  Sparkles,
  Users,
  ChevronDown,
  MicVocal,
  Mic,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import HallCarousel from "./Hallcarousel";
import Loader from "@/app/LoadingAnimation";

// FETCHER

async function fetcher(url: string) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token");

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch");

  const data = await res.json();

  return data.bookings;
}

// DASHBOARD COMPONENT

export default function Dashboard() {
  const router = useRouter();

  const {
    data: bookings,
    isLoading,
    error,
  } = useSWR("/api/dashboard-backend", fetcher);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    console.error("Dashboard error:", error);
    return (
      <div className="p-10">
        <h1 className="text-3xl font-bold text-white mb-4">Алдаа гарлаа</h1>
        <p className="text-white/70 text-xl">
          {error.message || "Мэдээлэл татахад алдаа гарлаа"}
        </p>
      </div>
    );
  }

  if (!bookings || bookings.length === 0)
    return (
      <div className="mt-50">
        <p className="text-white/70 text-xl">
          Танд одоогоор идэвхтэй захиалга алга байна.
        </p>
      </div>
    );

  // Group booking logic
  const grouped = bookings.reduce((acc: any, curr: any) => {
    const key = `${curr.hallid}-${curr.date}-${curr.starttime}`;

    if (!acc[key]) {
      acc[key] = {
        hall: curr.event_halls,
        hallBooking: null,
        performers: [],
        hosts: [],
      };
    }

    if (!curr.performersid && !curr.hostid) acc[key].hallBooking = curr;
    else if (curr.performersid) acc[key].performers.push(curr);
    else if (curr.hostid) acc[key].hosts.push(curr);

    return acc;
  }, {});

  // UI START (EVENTLUX HIGH-END DASHBOARD)

  console.log({ grouped });
  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      {/* CONTENT */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* KPI CARDS */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {[
            {
              title: "Таны идэвхтэй арга хэмжээ",
              value: Object.keys(grouped).length,
              sub: "Захиалсан танхим",
              color: "from-blue-500/20 to-blue-600/20",
            },
            {
              title: "Хүлээгдэж буй хүсэлт",
              value: bookings.filter((b: any) => b.status === "pending").length,

              sub: "Дуучид болон Хөтлөгчид",
              color: "from-purple-500/20 to-purple-600/20",
            },
            {
              title: "Баталгаажсан уран бүтээлчид",
              value: bookings.filter((b: any) => b.status === "approved")
                .length,

              sub: "Бэлэн",
              color: "from-green-500/20 to-green-600/20",
            },
          ].map((kpi, i) => (
            <div
              key={i}
              className={`rounded-3xl p-6 bg-linear-to-r${kpi.color} border border-white/10 backdrop-blur-xl shadow-[0_0_30px_rgba(76,139,255,0.15)]`}
            >
              <p className="text-white/60 text-sm">{kpi.title}</p>
              <p className="text-4xl font-bold my-2 text-white">{kpi.value}</p>
              <p className="text-xs text-white/40">{kpi.sub}</p>
            </div>
          ))}
        </div>

        {/* BOOKINGS GRID */}
        <h2 className="text-2xl text-white font-bold mb-6">
          Таны захиалсан арга хэмжээний танхим
        </h2>

        {/* Search */}
        {/* <div className="relative hidden md:block mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            placeholder="Арга хэмжээ, дуучид хайх..."
            className="w-72 rounded-2xl border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/40 focus:shadow-[0_0_20px_rgba(76,139,255,0.3)]"
          />
        </div> */}
        <div className="space-y-6">
          {Object.entries(grouped).map(([key, group]: any) => {
            const hallBooking = group.hallBooking;
            const performers = group.performers;
            const hosts = group.hosts;
            const hallId = group.hall?.id;

            const date =
              hallBooking?.date ||
              (performers.length > 0 ? performers[0].date : null) ||
              (hosts.length > 0 ? hosts[0].date : null);

            const startTime =
              hallBooking?.starttime ||
              (performers.length > 0 ? performers[0].starttime : null) ||
              (hosts.length > 0 ? hosts[0].starttime : null);

            // Get the booking ID for navigation (prefer hallBooking, fallback to first performer/host booking)
            const bookingId =
              hallBooking?.id || performers[0]?.id || hosts[0]?.id;

            return (
              <div
                key={key}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-linear-to-r from-white/5 to-white/5 backdrop-blur-xl transition-all hover:border-blue-500/30 hover:shadow-[0_0_40px_rgba(76,139,255,0.2)] "
              >
                {/* --- TOP AREA: BANNER + INFO --- */}
                <div className="flex flex-col md:flex-row gap-6 p-6">
                  {/* Banner Image */}
                  <div className="relative h-48 w-full overflow-hidden rounded-2xl md:h-auto md:w-80">
                    <div className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110">
                      <HallCarousel images={group.hall?.images} />
                    </div>

                    <div className="absolute inset-0 bg-linear-to-r from-black/60 to-transparent" />
                  </div>

                  {/* Event Info */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="mb-3 flex items-start justify-between gap-4">
                        <div>
                          <h3 className="mb-1 text-2xl font-bold text-white">
                            {group.hall?.name}
                          </h3>
                          <p className="text-sm text-white/60">
                            {group.hall?.location}
                          </p>
                        </div>

                        <span className="rounded-xl px-4 py-1.5 text-xs font-semibold bg-emerald-500/20 text-emerald-400">
                          Баталгаажсан
                        </span>
                      </div>

                      <div className="mb-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-white/70">
                          <Calendar className="h-4 w-4 text-blue-400" />
                          <span>
                            {date ? new Date(date).toLocaleDateString() : "-"} •{" "}
                            {startTime ?? "-"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/70">
                          <MapPin className="h-4 w-4 text-blue-400" />
                          <span>{group.hall?.duureg}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/70">
                          <Phone className="h-4 w-4 text-blue-400" />
                          <span>{group.hall?.phonenumber}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- EXPANDED DETAILS --- */}
                <div className="border-t border-white/5 bg-white/5 p-6">
                  <div className="mb-6">
                    <h4 className="mb-2 text-lg font-semibold text-white">
                      Дэлгэрэнгүй
                    </h4>
                    <p className="text-sm leading-relaxed text-white/70">
                      {group.hall?.description}
                    </p>
                  </div>

                  {/* Performers Section */}
                  <div>
                    <h4 className="mb-4 text-lg font-semibold text-white">
                      Урьсан уран бүтээлчид
                    </h4>

                    {/* If no performers */}
                    {performers.length === 0 && (
                      <p className="text-white/50 text-sm">
                        Одоогоор урьсан уран бүтээлч байхгүй байна.
                      </p>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {performers.map((p: any) => (
                        <div
                          key={p.id}
                          className="rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:border-blue-400/40 hover:bg-white/10 "
                        >
                          <div className="mb-3 flex items-center gap-3">
                            <Avatar className="h-12 w-12 border border-white/20">
                              <AvatarImage src={p.performers?.image} />
                              <AvatarFallback>PF</AvatarFallback>
                            </Avatar>

                            <div className="flex-1 overflow-hidden">
                              <p className="truncate text-sm font-semibold text-white">
                                {p.performers?.name}
                              </p>
                              <p className="text-xs text-white/50">
                                {p.performers?.genre}
                              </p>
                            </div>
                          </div>

                          <span
                            className={`mb-3 inline-block rounded-lg px-3 py-1 text-xs font-medium ${
                              p.status === "approved"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : p.status === "pending"
                                ? "bg-amber-500/20 text-amber-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {p.status}
                          </span>

                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full rounded-xl border-white/10 bg-white/5 text-xs text-white hover:border-blue-500/40 hover:bg-blue-500/10"
                          >
                            Профайл үзэх
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hosts Section */}
                  <div className="mt-8">
                    <h4 className="mb-4 text-lg font-semibold text-white">
                      Урьсан хөтлөгчид
                    </h4>

                    {/* If no hosts */}
                    {hosts.length === 0 && (
                      <p className="text-white/50 text-sm">
                        Одоогоор урьсан хөтлөгч байхгүй байна.
                      </p>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {hosts.map((h: any) => {
                        return (
                          <div
                            key={h.id}
                            className="rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:border-purple-400/40 hover:bg-white/10 "
                          >
                            <div className="mb-3 flex items-center gap-3">
                              <Avatar className="h-12 w-12 border border-white/20">
                                <AvatarImage src={h.hosts?.image} />
                                <AvatarFallback>HT</AvatarFallback>
                              </Avatar>

                              <div className="flex-1 overflow-hidden">
                                <p className="truncate text-sm font-semibold text-white">
                                  {h.hosts?.name}
                                </p>
                                <p className="text-xs text-white/50">
                                  {h.hosts?.title}
                                </p>
                              </div>
                            </div>

                            <span
                              className={`mb-3 inline-block rounded-lg px-3 py-1 text-xs font-medium ${
                                h.status === "approved"
                                  ? "bg-emerald-500/20 text-emerald-400"
                                  : h.status === "pending"
                                  ? "bg-amber-500/20 text-amber-400"
                                  : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {h.status}
                            </span>

                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full rounded-xl border-white/10 bg-white/5 text-xs text-white hover:border-purple-500/40 hover:bg-purple-500/10"
                            >
                              Профайл үзэх
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6">
                    {bookingId && (
                      <Button
                        className="hidden sm:flex items-center gap-2 rounded-2xl px-6 py-2 text-sm font-semibold text-black hover:scale-105"
                        onClick={() =>
                          router.push(`/performers?booking=${bookingId}`)
                        }
                      >
                        <MicVocal className="h-4 w-4" />
                        Дуучид захиалах
                      </Button>
                    )}

                    {bookingId && (
                      <Button
                        className="hidden sm:flex items-center gap-2 rounded-2xl px-6 py-2 text-sm font-semibold text-black hover:scale-105"
                        onClick={() =>
                          router.push(`/host?booking=${bookingId}`)
                        }
                      >
                        <Mic className="h-4 w-4" />
                        Хөтлөгч захиалах
                      </Button>
                    )}
                  </div>

                  {/* Add Artists / Hosts */}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
