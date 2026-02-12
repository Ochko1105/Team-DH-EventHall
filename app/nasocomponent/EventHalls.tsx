/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin, Star, Users, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import EventHallsSkeleton from "@/components/us/EventHallSkeleton";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import EventHallsPage from "./EventHallFilter";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import OrderEventHall from "./OrderEventHall";
import ImageWithFallback from "@/components/us/Fallback";

export default function EventHalls() {
  const [originalHalls, setOriginalHalls] = useState<any[]>([]);
  const [filteredHalls, setFilteredHalls] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [timeFilter, setTimeFilter] = useState<string>("");
  const [checktoken, setChecktoken] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const res = await fetch("/api/event-halls");
        const data = await res.json();
        if (data) {
          setOriginalHalls(data.data);
          setFilteredHalls(data.data);
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchHalls();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("token");
      if (token) setChecktoken(true);
      try {
        const res = await fetch("/api/booking-all");
        const data = await res.json();
        const bookingsData = data.bookings || [];
        // Event Hall booking filter (performerId байхгүй)
        const uniqueBookings = bookingsData.filter(
          (b: { date: string; hallid: number }, index: number, self: any[]) =>
            index ===
            self.findIndex((x) => x.date === b.date && x.hallid === b.hallid)
        );

        setBookings(uniqueBookings);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBookings();
  }, []);

  // -----------------------------
  // Filter halls by selected date
  // -----------------------------

  useEffect(() => {
    if (!date) return;

    const pad = (n: number) => n.toString().padStart(2, "0");
    const selectedDateStr = `${date.getFullYear()}-${pad(
      date.getMonth() + 1
    )}-${pad(date.getDate())}`;

    // Өдрийн booking-ууд
    let dailyBookings = bookings.filter((b) => {
      const bookingDate = new Date(b.date);
      const bookingDateStr = `${bookingDate.getFullYear()}-${pad(
        bookingDate.getMonth() + 1
      )}-${pad(bookingDate.getDate())}`;
      return bookingDateStr === selectedDateStr;
    });

    // Цагийн шүүлт
    if (timeFilter === "morning") {
      dailyBookings = dailyBookings.filter(
        (b) => parseInt(b.starttime.split(":")[0]) < 12
      );
    } else if (timeFilter === "afternoon") {
      dailyBookings = dailyBookings.filter(
        (b) => parseInt(b.starttime.split(":")[0]) >= 12
      );
    }

    const bookedHallIds = dailyBookings.map((b) => b.hallid);

    const availableHalls = originalHalls.filter(
      (hall) => !bookedHallIds.includes(hall.id)
    );

    setFilteredHalls(availableHalls);
  }, [date, bookings, originalHalls, timeFilter]);

  // -----------------------------
  // Sorting
  // -----------------------------
  useEffect(() => {
    const sorted = [...filteredHalls];
    if (sortBy === "price-low") {
      sorted.sort((a, b) => {
        const priceA = Array.isArray(a.price) ? Math.min(...a.price) : a.price;
        const priceB = Array.isArray(b.price) ? Math.min(...b.price) : b.price;
        return priceA - priceB;
      });
    } else if (sortBy === "price-high") {
      sorted.sort((a, b) => {
        const priceA = Array.isArray(a.price) ? Math.min(...a.price) : a.price;
        const priceB = Array.isArray(b.price) ? Math.min(...b.price) : b.price;
        return priceB - priceA;
      });
    } else if (sortBy === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    setFilteredHalls(sorted);
  }, [sortBy]);

  return (
    <div className="flex mt-3">
      <div className="w-full min-h-screen mt-16 md:mt-25 bg-black text-white flex flex-col md:flex-row gap-6 md:px-8 px-5">
        {/* FILTER SECTION */}
        <div className="w-full md:w-fit">
          {/* MOBILE FILTER */}
          <div className="md:hidden flex justify-between items-center mt-8 mb-6 w-full">
            <h1 className="text-3xl font-bold">Ивэнт холл хайх</h1>

            <Popover>
              <PopoverTrigger asChild>
                <Button className="flex items-center gap-2 bg-white px-6 text-black hover:bg-neutral-200 py-2">
                  <Filter size={16} /> Шүүлтүүр
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-80 max-w-[90vw] bg-neutral-900 text-white border border-neutral-800 p-4 rounded-lg shadow-lg flex flex-col max-h-[80vh] overflow-y-auto mx-auto z-100">
                <EventHallsPage
                  originalData={originalHalls}
                  onFilterChange={setFilteredHalls}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* DESKTOP FILTER */}
          <div className="hidden md:block w-80">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={{ before: new Date() }}
              className="cursor-pointer rounded-md shadow-sm w-80 bg-neutral-900 text-gray-200"
            />

            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className=" cursor-pointer w-full mt-4 bg-neutral-900 text-white border-neutral-700">
                <SelectValue placeholder="Цагийн нарийвчлал" />
              </SelectTrigger>
              <SelectContent className="w-80">
                <SelectGroup>
                  <SelectItem value="morning">Үдээс өмнө</SelectItem>
                  <SelectItem value="afternoon">Үдээс хойш</SelectItem>
                  <SelectItem value="all">Өдөрөөр нь</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <EventHallsPage
              originalData={originalHalls}
              onFilterChange={setFilteredHalls}
            />
            {checktoken && <OrderEventHall />}
          </div>
        </div>

        {/* EVENT HALLS GRID */}
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold mb-0 md:mb-4 md:flex hidden">
              Эвэнт халлc
            </h1>

            <div className=" cursor-pointer items-center gap-3 md:flex hidden">
              <label className="text-sm text-gray-400">
                Үнээр нь эрэмбэлэх:
              </label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="filter-input w-52 bg-neutral-900">
                  <SelectValue placeholder="Багаас их" />
                </SelectTrigger>
                <SelectContent className="filter-dropdown bg-neutral-900 w-52">
                  <SelectItem
                    value="price-high"
                    className="focus:bg-neutral-700 focus:text-white cursor-pointer"
                  >
                    Үнэ: Ихээс бага
                  </SelectItem>
                  <SelectItem
                    value="price-low"
                    className="focus:bg-neutral-700 focus:text-white cursor-pointer"
                  >
                    Үнэ: Багаас их
                  </SelectItem>
                  <SelectItem
                    value="name"
                    className="focus:bg-neutral-700 focus:text-white cursor-pointer"
                  >
                    Нэр
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading && <EventHallsSkeleton />}
            {!loading &&
              filteredHalls?.map((hall) => (
                <div
                  key={hall.id}
                  onClick={() => router.push(`/event-halls/${hall.id}`)}
                  className="bg-neutral-900 cursor-pointer rounded-lg overflow-hidden hover:scale-[1.02] transition-transform duration-200 flex flex-col"
                >
                  <div className="relative h-60 bg-neutral-800">
                    <ImageWithFallback
                      src={hall.images?.[0] || "/eventhalldefault.jpg"}
                      fallbackSrc="/eventhalldefault.jpg"
                      alt={hall.name}
                    />
                  </div>

                  <div className="p-4 space-y-2 flex-1 flex flex-col">
                    <h2 className="text-lg font-bold truncate">{hall.name}</h2>

                    <div className="flex items-center justify-between text-gray-400 text-sm">
                      <div className="flex items-center gap-1 truncate w-[80%]">
                        <span className="flex items-center gap-1">
                          <MapPin className="z-50" size={14} />
                          {hall.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star size={14} />
                        <span>{hall.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-gray-400 text-sm mt-2">
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>{hall.capacity} хүн</span>
                      </div>
                      <span className="font-semibold">${hall.price[1]}</span>
                    </div>

                    <Button
                      onClick={() => router.push(`/event-halls/${hall.id}`)}
                      className=" cursor-pointer mt-auto w-full bg-neutral-800 hover:bg-neutral-700 text-white py-2 rounded-lg"
                    >
                      Дэлгэрэнгүй
                    </Button>
                  </div>
                </div>
              ))}
            {!loading && filteredHalls?.length === 0 && (
              <div className="col-span-full text-center mt-10 text-neutral-400 text-lg">
                Тухайн өдөрт боломжтой эвэнт холл олдсонгүй.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
