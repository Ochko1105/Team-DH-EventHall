"use client";

import TimeSlot, { DataType } from "./time-slot";

interface DayColumnProps {
  dayName: string;
  times: DataType[];
  onSlotClick: (slot: DataType) => void;
}

export default function DayColumn({
  dayName,
  times,
  onSlotClick,
}: DayColumnProps) {
  return (
    <div className="min-w-[200px] border rounded-lg bg-white shadow-sm">
      <div className="p-2 font-semibold text-center border-b bg-gray-100">
        {dayName}
      </div>

      <div className="p-2 flex flex-col gap-2 text-black">
        {times.map((slot, index) => (
          <TimeSlot key={index} data={slot} onClick={() => onSlotClick(slot)} />
        ))}
      </div>
    </div>
  );
}
