// "use client";
// import React from "react";
// import { TimeSlotBooking } from "./DayCalendar";

// interface TimeBoxProps {
//   type: "am" | "pm" | "udur";
//   day: number;
//   currentYear: number;
//   currentMonth: number;
//   todayStr: string;
//   bookings: TimeSlotBooking[];
//   selected: { date: string; type: "am" | "pm" | "udur" }[];
//   prices?: { am: number; pm: number; udur: number };
//   salePrice?: number;
//   hallId: number | string;
//   setSelected: React.Dispatch<
//     React.SetStateAction<{ date: string; type: "am" | "pm" | "udur" }[]>
//   >;
// }

// export const TimeBox = ({
//   type,
//   day,
//   currentYear,
//   currentMonth,
//   todayStr,
//   bookings,
//   selected,
//   setSelected,
//   salePrice,
//   prices,
// }: TimeBoxProps) => {
//   const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(
//     2,
//     "0"
//   )}-${String(day).padStart(2, "0")}`;

//   const labelMap = {
//     am: "Өглөө",
//     pm: "Орой",
//     udur: "Өдөрөөр нь",
//   };
//   const label = labelMap[type];

//   // ✅ Button өнгөний логик

//   const isPast = new Date(dateStr).getTime() < new Date(todayStr).getTime();

//   // тухайн өдөрт хийгдсэн захиалгууд
//   const dayBookings = bookings.filter(
//     (b) => new Date(b.date).toISOString().split("T")[0] === dateStr
//   );

//   const isAmBooked = dayBookings.some((b) =>
//     ["08:00", "09:00", "10:00", "11:00"].includes(b.starttime)
//   );
//   const isPmBooked = dayBookings.some((b) =>
//     ["18:00", "19:00", "20:00", "21:00"].includes(b.starttime)
//   );
//   const isUdureBooked = dayBookings.some((b) =>
//     [
//       "09:00",
//       "10:00",
//       "11:00",
//       "12:00",
//       "13:00",
//       "14:00",
//       "15:00",
//       "16:00",
//       "17:00",
//     ].includes(b.starttime)
//   );

//   let isAvailable = !isPast;
//   if (
//     (type === "am" && (isAmBooked || isUdureBooked)) ||
//     (type === "pm" && (isPmBooked || isUdureBooked)) ||
//     (type === "udur" && (isUdureBooked || isAmBooked || isPmBooked))
//   ) {
//     isAvailable = false;
//   }

//   const isSelected = selected.some(
//     (sel) => sel.date === dateStr && sel.type === type
//   );

//   const hasSale = salePrice !== undefined && salePrice > 0;
//   const priceLabel = hasSale ? ` +${salePrice}₮` : "";

//   const handleSelect = (day: number, type: "am" | "pm" | "udur") => {
//     const newDate = `${currentYear}-${String(currentMonth + 1).padStart(
//       2,
//       "0"
//     )}-${String(day).padStart(2, "0")}`;
//     setSelected((prev) => {
//       const exists = prev.find((s) => s.date === newDate && s.type === type);
//       if (exists)
//         return prev.filter((s) => !(s.date === newDate && s.type === type));
//       const newSelected = prev.filter((s) => s.date !== newDate);
//       return [...newSelected, { date: newDate, type }];
//     });
//   };

//   return (
//     <button
//       onClick={() => handleSelect(day, type)}
//       disabled={!isAvailable || isPast}
//       className={`w-full rounded-md border p-1 text-center text-[10px] sm:text-xs font-medium h-7 sm:h-8 flex items-center justify-center transition-all ${
//         isSelected
//           ? "bg-white text-black border-white"
//           : hasSale && isAvailable
//           ? "bg-emerald-500/20 border border-emerald-500 text-emerald-400 hover:bg-emerald-500/30"
//           : isAvailable
//           ? "bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-600"
//           : "bg-neutral-950 text-neutral-700 border-neutral-900 cursor-not-allowed line-through"
//       }`}
//     >
//       {label}
//       {priceLabel}
//     </button>
//   );
// };
