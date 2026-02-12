/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/immutability */
"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface Hall {
  id: number;
  name: string;
  location: string;
  duureg: string;
  capacity: string;
  rating: number | string;
  price: number | number[];
  images: string[];
}

const PRICE = [
  "0",
  "30,000",
  "50,000",
  "80,000",
  "100,000",
  "150,000",
  "200,000",
  "250,000",
  "300,000",
  "400,000",
  "500,000",

  "Хязгааргүй",
];

interface EventHallsPageProps {
  originalData: Hall[];
  onFilterChange: (filtered: Hall[]) => void;
}

export default function EventHallsPage({
  originalData,
  onFilterChange,
}: EventHallsPageProps) {
  const MAX = 10000000; // max price for "Хязгааргүй"

  const [district, setDistrict] = useState("all");
  const [capacity, setCapacity] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(MAX);
  const [districts, setDistricts] = useState<string[]>([]);

  // get unique districts
  useEffect(() => {
    const uniqueDistricts = Array.from(
      new Set(originalData.map((hall) => hall.duureg))
    );
    setDistricts(uniqueDistricts);
  }, [originalData]);

  // apply filters whenever inputs change
  useEffect(() => {
    applyFilters();
  }, [district, minPrice, maxPrice, capacity]);

  // parse price string to number
  const parsePrice = (str: string) =>
    str === "Хязгааргүй" ? MAX : Number(str.replace(/,/g, ""));

  const applyFilters = () => {
    let filtered = [...originalData];

    // DISTRICT FILTER
    if (district !== "all") {
      filtered = filtered.filter((hall) => hall.duureg === district);
    }

    // CAPACITY FILTER
    if (capacity) {
      filtered = filtered.filter((hall) => {
        const [maxCap] = String(hall.capacity).split("-").map(Number);
        return maxCap <= Number(capacity);
      });
    }

    // PRICE FILTER (use second price if exists)
    filtered = filtered.filter((hall) => {
      const hallPrice = Array.isArray(hall.price)
        ? hall.price[1] ?? hall.price[0]
        : hall.price;

      return hallPrice >= minPrice && hallPrice <= maxPrice;
    });

    onFilterChange(filtered);
  };

  const resetFilters = () => {
    setDistrict("all");
    setCapacity("");
    setMinPrice(0);
    setMaxPrice(MAX);
    onFilterChange(originalData);
  };

  return (
    <aside className="w-full bg-neutral-900 text-gray-200 rounded-lg mt-10 p-6 shadow-lg">
      <h2 className="text-2xl font-semibold mb-6">Filter Event Halls</h2>

      <div className="space-y-6">
        {/* DISTRICT */}
        <div>
          <label className="block mb-1">Дүүрэг</label>
          <Select value={district} onValueChange={setDistrict}>
            <SelectTrigger className="filter-input w-full">
              <SelectValue placeholder="Дүүрэг сонгох…" />
            </SelectTrigger>

            <SelectContent className="filter-dropdown bg-neutral-900 w-52">
              <SelectItem value="all">Бүх дүүрэг</SelectItem>
              {districts.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* MIN PRICE */}
        <div>
          <label className="block mb-1">Хамгийн бага үнэ</label>
          <Select
            value={PRICE.find((p) => parsePrice(p) === minPrice) || ""}
            onValueChange={(v) => {
              const value = parsePrice(v);
              setMinPrice(value);
              if (value > maxPrice) setMaxPrice(MAX); // reset max if min > max
            }}
          >
            <SelectTrigger className="filter-input w-full">
              <SelectValue placeholder="Доод үнэ…" />
            </SelectTrigger>

            <SelectContent className="filter-dropdown bg-neutral-900 w-52">
              {PRICE.filter((p) => p !== "Хязгааргүй").map((p) => (
                <SelectItem key={p} value={p}>
                  {p}₮
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* MAX PRICE */}
        <div>
          <label className="block mb-1">Хамгийн их үнэ</label>
          <Select
            value={PRICE.find((p) => parsePrice(p) === maxPrice) || ""}
            onValueChange={(v) => {
              const value = parsePrice(v);
              setMaxPrice(value);
              if (value < minPrice) setMinPrice(0); // reset min if max < min
            }}
          >
            <SelectTrigger className="filter-input w-full">
              <SelectValue placeholder="Дээд үнэ…" />
            </SelectTrigger>

            <SelectContent className="filter-dropdown bg-neutral-900 w-52">
              {PRICE.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}₮
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* CAPACITY */}
        <div>
          <label className="block mb-1">Багтаамж</label>
          <div className="filter-input flex items-center gap-2">
            <Users className="text-gray-400" />
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="Хүний тоо хамгийн ихдээ"
              className="bg-transparent outline-none w-full text-gray-200"
            />
          </div>
        </div>

        {/* RESET */}
        <button
          onClick={resetFilters}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
        >
          Шүүлтүүр цэвэрлэх
        </button>
      </div>
    </aside>
  );
}
