/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { X, Calendar, Clock, QrCode } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface DateFormProps {
  selected: { date: string; type: "am" | "pm" | "udur" }[];
  setSelected: React.Dispatch<
    React.SetStateAction<{ date: string; type: "am" | "pm" | "udur" }[]>
  >;
  hallId: number | string;
  eventHallData: any;
}

export default function DateForm({
  selected,
  setSelected,
  hallId,
  eventHallData,
}: DateFormProps) {
  const [prices, setPrices] = useState<{
    am: number;
    pm: number;
    udur: number;
  }>({
    am: 0,
    pm: 0,
    udur: 0,
  });
  // map selected slot (full date-time string) -> resolved price for that exact slot
  const [pricesBySelection, setPricesBySelection] = useState<
    Record<string, number>
  >({});
  const typeLabels = {
    am: "Өглөө (08:00-12:00)",
    pm: "Орой (18:00-22:00)",
    udur: "Өдөр (09:00-18:00)",
  };
  const slotPrices = {
    am: eventHallData.price[0],
    pm: eventHallData.price[1],
    udur: eventHallData.price[2],
  };

  const getPrices = async () => {
    try {
      // 1️⃣ Үндсэн slot үнийг авах
      const res = await fetch(`/api/event-halls/prices?hallId=${hallId}`);
      const data = await res.json();

      const basePrices = {
        am: data.price?.[0] ?? 0,
        pm: data.price?.[1] ?? 0,
        udur: data.price?.[2] ?? 0,
      };

      // base үнийг set хийх
      setPrices(basePrices);

      // 2️⃣ UpdatedPrice-г авах ба динамк update хийх
      await getUpdatedPrices(basePrices);
    } catch (err) {
      console.error("Error fetching prices:", err);
    }
  };

  const getUpdatedPrices = async (basePrices: {
    am: number;
    pm: number;
    udur: number;
  }) => {
    try {
      const res = await fetch(`/api/event-halls/updatedprice?hallId=${hallId}`);
      const data = await res.json();

      // Build a mapping of selected slot (full date-time string) -> resolved price
      const selectionPrices: Record<string, number> = {};

      // Helper to turn a date string into HH:MM format matching booking.starttime
      const getTimeString = (dateStr: string) => {
        const d = new Date(dateStr);
        const hh = String(d.getHours()).padStart(2, "0");
        const mm = String(d.getMinutes()).padStart(2, "0");
        return `${hh}:${mm}`;
      };

      // Build a per-date/type updated price map from bookings. This handles
      // bookings where starttime may be any minute (e.g. 12:25) and ensures
      // we classify hour 12 as 'am' (08:00-12:59 => am) to match UI labels.
      const updatedMap: Record<
        string,
        { am: number; pm: number; udur: number }
      > = {};
      (data.bookings || []).forEach((b: any) => {
        const dateKey = new Date(b.date).toDateString();
        if (!updatedMap[dateKey])
          updatedMap[dateKey] = {
            am: basePrices.am,
            pm: basePrices.pm,
            udur: basePrices.udur,
          };
        const startHour = Number(b.starttime.split(":")[0]);
        // treat 08..12 as morning (Өглөө)
        if (startHour >= 8 && startHour <= 12)
          updatedMap[dateKey].am = b.PlusPrice ?? updatedMap[dateKey].am;
        else if (startHour >= 18)
          updatedMap[dateKey].pm = b.PlusPrice ?? updatedMap[dateKey].pm;
        else updatedMap[dateKey].udur = b.PlusPrice ?? updatedMap[dateKey].udur;
      });

      // For each selected slot, resolve price from the per-date/type updated map
      // If selected.date includes a time (contains 'T' or a time component), prefer exact-match logic where possible
      selected.forEach((sel) => {
        const selDateObj = new Date(sel.date);
        const selDateOnly = selDateObj.toDateString();

        // If we have an updated price map for that date, use it for the sel.type
        if (
          updatedMap[selDateOnly] &&
          typeof updatedMap[selDateOnly][sel.type] === "number"
        ) {
          selectionPrices[sel.date] = updatedMap[selDateOnly][sel.type];
        } else {
          // fallback to base per-type price
          selectionPrices[sel.date] = basePrices[sel.type] ?? 0;
        }
      });

      // Keep the per-type `prices` state for UI/other fallbacks, but also set per-selection prices
      setPrices(basePrices);
      setPricesBySelection(selectionPrices);
      console.log("Updated slot prices (per selection):", selectionPrices);
    } catch (err) {
      console.error("Error fetching updated prices:", err);
    }
  };

  // useEffect дотор
  useEffect(() => {
    if (!hallId) return;
    getPrices(); // base price-г авна → дуудах үед getUpdatedPrices-г дуудах
  }, [hallId, selected]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("mn-MN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const calculateTotalPrice = () => {
    return selected.reduce((total, sel) => {
      // If we resolved a specific price for this exact selected slot (date-time), use it.
      // Otherwise fall back to the per-type `prices` state (base price) or `slotPrices`.
      const perSel = pricesBySelection[sel.date];
      if (typeof perSel === "number") return total + perSel;
      return total + (prices[sel.type] ?? slotPrices[sel.type] ?? 0);
    }, 0);
  };
  console.log({ selected });

  const removeSelection = (date: string, type: "am" | "pm" | "udur") => {
    setSelected((prev) =>
      prev.filter((s) => !(s.date === date && s.type === type))
    );
  };
  const router = useRouter();
  const handleSubmit = async () => {
    // 1️⃣ Сонгосон өдөр шалгах
    if (selected.length === 0) return alert("Өдөр сонгоно уу");

    // 2️⃣ Token шалгах
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Захиалга хийхийн тулд эхлээд нэвтэрнэ үү.");
      return;
    }

    // 3️⃣ POST хийх өгөгдөл
    const bookingData = {
      hallId,
      bookings: selected,
      status: "approved",
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // token-г header-д нэмнэ
        },
        body: JSON.stringify(bookingData),
      });

      if (res.ok) {
        toast.success("Захиалга амжилттай илгээгдлээ");
        router.push(`/dashboard`);
      } else {
        const errData = await res.json();
        toast.error("Алдаа гарлаа: " + (errData.error || "Серверийн алдаа"));
      }
    } catch (error) {
      console.error(error);
      alert("Серверийн алдаа гарлаа");
    }
  };

  return (
    <div className="border border-neutral-800 rounded-xl p-4 lg:p-6 bg-black h-fit sticky top-6">
      <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        Сонгосон цагууд
      </h3>

      {selected.length === 0 ? (
        <div className="text-center py-8 text-neutral-500 text-sm">
          <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>Цаг сонгоогүй байна</p>
          <p className="text-xs mt-1">Календараас цагаа сонгоно уу</p>
        </div>
      ) : (
        <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
          {selected.map((sel, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-neutral-900 border border-neutral-800 rounded-lg p-3"
            >
              <div>
                <p className="text-sm font-medium text-white">
                  {formatDate(sel.date)}
                </p>
                <p className="text-xs text-neutral-400">
                  {typeLabels[sel.type]}
                </p>
              </div>
              <button
                onClick={() => removeSelection(sel.date, sel.type)}
                className="p-1 hover:bg-neutral-800 rounded-md transition-colors"
              >
                <X className="h-4 w-4 text-neutral-500 hover:text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {selected.length > 0 && (
        <>
          <div className="border-t border-neutral-800 pt-4 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-400">Нийт сонголт</span>
              <span className="text-white font-medium">
                {selected.length} цаг
              </span>
            </div>

            {/* Total Price */}
            <div className="flex justify-between text-sm mt-2">
              <span className="text-neutral-400">Нийт үнэ</span>
              <span className="text-white font-semibold">
                {" "}
                {calculateTotalPrice().toLocaleString()}₮
              </span>
            </div>
          </div>
          <Button className="w-full bg-neutral-800 text-white hover:bg-neutral-700 font-medium mb-3 flex items-center justify-center gap-2">
            <QrCode className="h-4 w-4" />
            QR уншуулах
          </Button>
          <Button
            onClick={handleSubmit}
            className="w-full bg-white text-black hover:bg-neutral-200 font-medium"
          >
            Захиалга баталгаажуулах
          </Button>
        </>
      )}
    </div>
  );
}
``;
