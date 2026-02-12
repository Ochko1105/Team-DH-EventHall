import React, { useEffect, useState } from "react";
import TimeSlot from "./time-slot";

const TimeTable = ({ hallData }: { hallData: any }) => {
  const [slotsByDate, setSlotsByDate] = useState<
    {
      date: string;
      dayName: string;
      slots: {
        id: number;
        time: string;
        status: string;
        price?: number;
      }[];
    }[]
  >([]);

  const handleSlotClick = async (slot: {
    id: number;
    time: string;
    status: string;
    date: string;
  }) => {
    if (slot.status === "booked") {
      alert("Энэ цаг аль хэдийн захиалсан байна!");
      return;
    }

    if (
      !confirm(
        `${hallData?.name} дээр ${slot.date} өдөр ${slot.time} цагийг захиалах уу?`
      )
    )
      return;

    const res = await fetch("/api/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slotId: slot.id,
      }),
    });

    const data = await res.json();
    console.log("BOOK RESPONSE:", data);

    if (res.ok) {
      alert("Амжилттай захиаллаа!");
      fetchSlots();
    } else {
      alert(data.error || "Алдаа гарлаа");
    }
  };

  const fetchSlots = async () => {
    if (!hallData?.id) return;

    try {
      const res = await fetch("/api/time-slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hallId: hallData.id }),
      });

      const data = await res.json();
      console.log("Fetched slots:", data);
      console.log(
        "Booked slots:",
        data.filter((s: any) => s.status === "booked")
      );

      // Group slots by date
      const slotsByDateMap = new Map<string, any[]>();

      if (Array.isArray(data)) {
        data.forEach((slot: any) => {
          console.log(
            `Slot ${slot.id}: status=${slot.status}, time=${slot.time}, date=${slot.date}`
          );
          if (!slotsByDateMap.has(slot.date)) {
            slotsByDateMap.set(slot.date, []);
          }
          slotsByDateMap.get(slot.date)?.push(slot);
        });
      }

      // Convert to array and add day names
      const dayNames = ["Ням", "Дав", "Мяг", "Лха", "Пүр", "Баа", "Бям"];
      const organized = Array.from(slotsByDateMap.entries()).map(
        ([date, slots]) => {
          const dateObj = new Date(date + "T00:00:00");
          return {
            date,
            dayName: dayNames[dateObj.getDay()],
            slots,
          };
        }
      );

      setSlotsByDate(organized);
    } catch (error) {
      console.error("Error fetching slots:", error);
      setSlotsByDate([]);
    }
  };

  useEffect(() => {
    if (hallData?.id) {
      console.log("Fetching slots for hall:", hallData.id);
      fetchSlots();
    }
  }, [hallData?.id]);

  // Get all unique time slots
  const allTimeSlots = Array.from(
    new Set(
      slotsByDate.flatMap((dateGroup) =>
        dateGroup.slots.map((slot) => slot.time)
      )
    )
  ).sort();

  return (
    <div className="w-full px-40 my-20">
      <div className="bg-gray-500 rounded-sm p-6">
        <h3 className="text-2xl font-bold text-white border-b-2 border-blue-500 pb-4 mb-6">
          Цаг захиалах
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-400">
            <thead>
              <tr className="bg-gray-600">
                <th className="border border-gray-400 p-3 text-left font-semibold text-white min-w-[100px]">
                  Цаг
                </th>
                {slotsByDate.map((dateGroup, index) => (
                  <th
                    key={index}
                    className="border border-gray-400 p-3 text-center font-semibold text-white min-w-[120px]"
                  >
                    <div>{dateGroup.dayName}</div>
                    <div className="text-sm font-normal text-gray-300">
                      {new Date(
                        dateGroup.date + "T00:00:00"
                      ).toLocaleDateString("mn-MN", {
                        month: "numeric",
                        day: "numeric",
                      })}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allTimeSlots.length > 0 ? (
                allTimeSlots.map((time, timeIndex) => (
                  <tr key={timeIndex} className="hover:bg-gray-600">
                    <td className="border border-gray-400 p-3 font-medium text-white">
                      {time}
                    </td>
                    {slotsByDate.map((dateGroup, dateIndex) => {
                      const slot = dateGroup.slots.find((s) => s.time === time);
                      return (
                        <td
                          key={dateIndex}
                          className="border border-gray-400 p-2"
                        >
                          {slot ? (
                            <TimeSlot
                              data={{
                                ...slot,
                                id: slot.id.toString(),
                                price: slot.price || 0,
                              }}
                              onClick={() =>
                                handleSlotClick({
                                  ...slot,
                                  date: dateGroup.date,
                                })
                              }
                            />
                          ) : (
                            <div className="text-gray-400 text-center text-sm">
                              -
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={slotsByDate.length + 1}
                    className="border border-gray-400 p-4 text-center text-gray-300"
                  >
                    Loading slots...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TimeTable;
