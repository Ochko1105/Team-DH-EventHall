"use client";

export type DataType = {
  id: string;
  time: string;
  price: number;
  status: string;
};

interface TimeSlotProps {
  data: DataType;
  onClick: () => void;
}

export default function TimeSlot({ data, onClick }: TimeSlotProps) {
  const { time, price, status } = data;
  const isBooked = status === "booked";

  return (
    <div
      onClick={() => !isBooked && onClick()}
      className={`flex justify-between items-center p-2 rounded border text-sm
        ${
          isBooked
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-green-50 hover:bg-green-100 cursor-pointer"
        }
      `}
    >
      <div className="font-medium">{time}</div>

      {isBooked ? (
        <div className="text-red-500 font-semibold">захиалсан</div>
      ) : (
        <div className="flex flex-col items-end">
          <span className="text-green-600 font-semibold">● sale</span>
          {/* <span className="text-gray-700">{price.toLocaleString()} ₮</span> */}
        </div>
      )}
    </div>
  );
}
