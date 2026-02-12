/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

import DateForm from "./DateForm";
import { publicFetcher } from "@/lib/fetcherpublic";
import useSWR from "swr";
import generateCalendar from "@/lib/generatecalendar";

interface TimeSlotBooking {
  date: string;
  starttime: string;
  hallid: number | string;
  price?: number;
  salePrice?: number;
}

export function BookingCalendar({
  hallId,
  eventHallData,
}: {
  hallId: number | string;
  eventHallData: any;
}) {
  const { data, isLoading } = useSWR("/api/booking-all", publicFetcher);

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selected, setSelected] = useState<
    { date: string; type: "am" | "pm" | "udur" }[]
  >([]);
  const [storedSlots, setStoredSlots] = useState<Record<string, number>>({});

  useEffect(() => {
    const stored = JSON.parse(
      localStorage.getItem("selectedSlotPrices") || "{}"
    );
    setStoredSlots(stored);
  }, []);

  const bookings: TimeSlotBooking[] =
    data?.filter((b: TimeSlotBooking) => b.hallid == hallId) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
      </div>
    );
  }

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else setCurrentMonth(currentMonth + 1);
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else setCurrentMonth(currentMonth - 1);
  };

  const TimeBox = ({
    type,
    day,
    salePrice,
  }: {
    type: "am" | "pm" | "udur";
    day: number;
    salePrice?: number;
  }) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;

    const labelMap = {
      am: "Өглөө",
      pm: "Орой",
      udur: "Өдөрөөр нь",
    };
    const label = labelMap[type];

    const isPast = new Date(dateStr).getTime() < new Date(todayStr).getTime();
    const dayBookings = bookings.filter(
      (b) => new Date(b.date).toISOString().split("T")[0] === dateStr
    );

    const isAmBooked = dayBookings.some(
      (b) => Number.parseInt(b.starttime.split(":")[0], 10) === 8
    );
    const isPmBooked = dayBookings.some(
      (b) => Number.parseInt(b.starttime.split(":")[0], 10) === 18
    );
    const isUdureBooked = dayBookings.some(
      (b) => Number.parseInt(b.starttime.split(":")[0], 10) === 9
    );

    let isAvailable = !isPast;
    if (
      (type === "am" && (isAmBooked || isUdureBooked)) ||
      (type === "pm" && (isPmBooked || isUdureBooked)) ||
      (type === "udur" && (isUdureBooked || isAmBooked || isPmBooked))
    ) {
      isAvailable = false;
    }

    const isSelected =
      selected.some((sel) => sel.date === dateStr && sel.type === type) ||
      storedSlots.hasOwnProperty(`${dateStr}-udur`); // ✅ энд шууд udur type

    // Check if this slot has a sale
    const hasSale = salePrice !== undefined && salePrice > 0;
    const handleSelect = (day: number, type: "am" | "pm" | "udur") => {
      const newDate = `${currentYear}-${String(currentMonth + 1).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;
      setSelected((prev) => {
        const exists = prev.find((s) => s.date === newDate && s.type === type);
        if (exists)
          return prev.filter((s) => !(s.date === newDate && s.type === type));
        const newSelected = prev.filter((s) => !(s.date === newDate));
        return [...newSelected, { date: newDate, type }];
      });
    };

    return (
      <button
        onClick={() => handleSelect(day, type)}
        disabled={!isAvailable || isPast}
        className={`w-full rounded-md border p-1 text-center text-[10px] sm:text-xs font-medium h-7 sm:h-8 flex items-center justify-center transition-all ${
          isSelected
            ? "bg-emerald-500/40 text-white border-emerald-500"
            : hasSale && isAvailable
            ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 hover:bg-emerald-500/30"
            : isAvailable
            ? "bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-600"
            : "bg-neutral-950 text-neutral-700 border-neutral-900 cursor-not-allowed line-through"
        }`}
      >
        {label}
      </button>
    );
  };

  const daysOfWeek = ["Да", "Мя", "Лха", "Пү", "Ба", "Бя", "Ня"];
  const weeks = generateCalendar(currentYear, currentMonth);

  const monthNames = [
    "1-р сар",
    "2-р сар",
    "3-р сар",
    "4-р сар",
    "5-р сар",
    "6-р сар",
    "7-р сар",
    "8-р сар",
    "9-р сар",
    "10-р сар",
    "11-р сар",
    "12-р сар",
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      {/* Calendar Section */}
      <div className="w-full lg:flex-1 border border-neutral-800 rounded-xl p-4 lg:p-6 bg-black">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-white">
            {currentYear} оны {monthNames[currentMonth]}
          </h2>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevMonth}
              className="h-8 w-8 text-neutral-400 hover:text-white hover:bg-neutral-800"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextMonth}
              className="h-8 w-8 text-neutral-400 hover:text-white hover:bg-neutral-800"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-4 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-neutral-900 border border-neutral-800" />
            <span>Сул</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-white" />
            <span>Сонгосон</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-neutral-950 border border-neutral-900" />
            <span>Боломжгүй</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500" />
            <span className="text-emerald-400">Хямдралтай</span>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 text-center font-medium text-neutral-500 mb-2 text-xs">
          {daysOfWeek.map((d) => (
            <div key={d} className="py-2">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {weeks.map((week: { day: number; current: boolean }[], i: number) =>
            week.map((dayObj, j) => {
              const { day, current } = dayObj;
              if (!current) {
                return (
                  <div
                    key={`${i}-${j}`}
                    className="min-h-[90px] sm:min-h-[100px] bg-neutral-950 rounded-lg p-1.5 text-neutral-700 text-xs"
                  >
                    <div className="font-medium">{day}</div>
                  </div>
                );
              }

              const dateStr = `${currentYear}-${String(
                currentMonth + 1
              ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const isPast =
                new Date(dateStr).getTime() < new Date(todayStr).getTime();
              const isToday = dateStr === todayStr;

              return (
                <div
                  key={`${i}-${j}`}
                  className={`min-h-[90px] sm:min-h-[100px] border rounded-lg p-1.5 flex flex-col gap-1 transition-colors ${
                    isPast
                      ? "bg-neutral-950 border-neutral-900"
                      : isToday
                      ? "bg-neutral-900 border-white/20"
                      : "bg-neutral-900/50 border-neutral-800 hover:border-neutral-700"
                  }`}
                >
                  <div
                    className={`text-xs font-semibold mb-0.5 ${
                      isPast
                        ? "text-neutral-600"
                        : isToday
                        ? "text-white"
                        : "text-neutral-300"
                    }`}
                  >
                    {day}
                    {isToday && (
                      <span className="ml-1 text-[9px] text-neutral-500">
                        Өнөөдөр
                      </span>
                    )}
                  </div>
                  <TimeBox type="am" day={day} />
                  <TimeBox type="pm" day={day} />
                  <TimeBox type="udur" day={day} />
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* DateForm Section */}
      <div className="w-full lg:w-80">
        <DateForm
          eventHallData={eventHallData}
          selected={selected}
          setSelected={setSelected}
          hallId={hallId}
        />
      </div>
    </div>
  );
}

export default BookingCalendar;
