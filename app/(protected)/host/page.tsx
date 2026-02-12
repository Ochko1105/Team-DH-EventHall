/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import HostCard from "@/components/us/Host";
import { RotateCcw, Search, UserSearch } from "lucide-react";
import { use, useEffect, useState } from "react";

type HostDB = {
  id: number;
  name: string;
  contact_email: string | null;
  contact_phone: string | null;
  title: string;
  image: string;
  tags: string[];
  rating: number;
  status: "Боломжтой" | "Захиалагдсан" | "Хүлээгдэж байна";
  price: number;
};

const Host = ({
  searchParams,
}: {
  searchParams: Promise<{ booking?: string }>;
}) => {
  const params = use(searchParams);
  const bookingIdFromUrl = params?.booking;

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [availability, setAvailability] = useState<string>("all");
  const [priceRange, setPriceRange] = useState([2000000, 10000000]);
  const [minRating, setMinRating] = useState("0");
  const [maxRating, setMaxRating] = useState("5");

  // Data States
  const [hosts, setHosts] = useState<HostDB[]>([]);
  const [filteredHosts, setFilteredHosts] = useState<HostDB[]>([]);

  // Booking states
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  // FETCH BOOKINGS
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("/api/bookings", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const bookingsData = data.bookings || [];
        setBookings(bookingsData);

        if (bookingIdFromUrl && bookingsData.length > 0) {
          const matchingBooking = bookingsData.find(
            (b: any) => b.id === Number.parseInt(bookingIdFromUrl)
          );
          setSelectedBooking(matchingBooking || bookingsData[0]);
        } else if (bookingsData.length > 0) {
          setSelectedBooking(bookingsData[0]);
        }
      });
  }, [bookingIdFromUrl]);

  // FETCH HOSTS
  useEffect(() => {
    fetch("/api/hosts")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort((a: HostDB, b: HostDB) => b.rating - a.rating);
        setHosts(sorted);
        setFilteredHosts(sorted);
      });
  }, []);

  // APPLY FILTER LOGIC
  const handleFilter = () => {
    let result = [...hosts];

    if (searchQuery.trim() !== "") {
      result = result.filter(
        (h) =>
          h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          h.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedTag !== "all") {
      result = result.filter((h) => h.tags.includes(selectedTag));
    }

    if (availability !== "all") {
      result = result.filter((h) => h.status === availability);
    }

    result = result.filter(
      (h) => h.rating >= Number(minRating) && h.rating <= Number(maxRating)
    );

    result = result.filter(
      (h) => h.price >= priceRange[0] && h.price <= priceRange[1]
    );

    setFilteredHosts(result);
  };

  // RESET FILTERS
  const handleReset = () => {
    setSearchQuery("");
    setSelectedTag("all");
    setAvailability("all");
    setPriceRange([2000000, 10000000]);
    setMinRating("0");
    setMaxRating("5");
    setFilteredHosts(hosts);
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-12 xl:px-24">
      <div className="pt-20 pb-10 sm:pt-24 sm:pb-12 text-center">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
          Хөтлөгч хайх
        </h1>
        <p className="mt-3 text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
          Манай мэргэжлийн хөтлөгчдөөс сонгон захиалаарай
        </p>
      </div>

      {/* FILTER CARD */}
      <div className="rounded-2xl bg-zinc-900/80 p-4 sm:p-6 lg:p-8 border border-zinc-800 backdrop-blur-sm">
        {/* TOP ROW */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* SEARCH INPUT */}
          <div className="relative flex-1">
            <UserSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
            <Input
              type="text"
              placeholder="Хөтлөгч хайх..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 w-full rounded-xl border-zinc-800 bg-zinc-800/50 text-white placeholder:text-zinc-500 pl-12 pr-4 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500"
            />
          </div>

          {/* FILTERS ROW */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* TAG FILTER */}
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="h-12 w-full sm:w-45 rounded-xl border-zinc-800 bg-zinc-800/50 text-white">
                <SelectValue placeholder="Төрөл сонгох" />
              </SelectTrigger>
              <SelectContent className="border-zinc-800 bg-zinc-900 text-white">
                <SelectItem value="all">Бүгд</SelectItem>
                <SelectItem value="Телевизийн хөтлөгч">
                  Телевизийн хөтлөгч
                </SelectItem>
                <SelectItem value="Комеди">Комеди</SelectItem>
                <SelectItem value="Эвент">Эвент</SelectItem>
                <SelectItem value="Энтертайнмент">Энтертайнмент</SelectItem>
              </SelectContent>
            </Select>

            {/* STATUS FILTER */}
            <Select value={availability} onValueChange={setAvailability}>
              <SelectTrigger className="h-12 w-full sm:w-45 rounded-xl border-zinc-800 bg-zinc-800/50 text-white">
                <SelectValue placeholder="Боломжит байдал" />
              </SelectTrigger>
              <SelectContent className="border-zinc-800 bg-zinc-900 text-white">
                <SelectItem value="all">Бүгд</SelectItem>
                <SelectItem value="Боломжтой">Боломжтой</SelectItem>
                <SelectItem value="Захиалагдсан">Захиалагдсан</SelectItem>
                <SelectItem value="Хүлээгдэж байна">Хүлээгдэж байна</SelectItem>
              </SelectContent>
            </Select>

            {/* RESET BUTTON */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleReset}
              className="h-12 w-12 rounded-xl border border-zinc-800 bg-zinc-800/50 text-zinc-400 hover:bg-zinc-700 hover:text-white shrink-0"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div className="flex flex-col lg:flex-row lg:items-end gap-6">
          {/* RATING */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-zinc-400 whitespace-nowrap">
              Үнэлгээ:
            </label>
            <Input
              type="number"
              min="0"
              max="5"
              step="1"
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="h-10 w-16 rounded-lg border-zinc-800 bg-zinc-800/50 text-center text-white focus-visible:ring-1 focus-visible:ring-blue-500"
            />
            <span className="text-zinc-600">—</span>
            <Input
              type="number"
              min="0"
              max="5"
              step="1"
              value={maxRating}
              onChange={(e) => setMaxRating(e.target.value)}
              className="h-10 w-16 rounded-lg border-zinc-800 bg-zinc-800/50 text-center text-white focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500 "
            />
          </div>

          {/* PRICE RANGE */}
          <div className="flex-1 min-w-0">
            <label className="mb-3 block text-sm font-medium text-zinc-400">
              Үнийн хязгаар:{" "}
              <span className="text-white">
                {priceRange[0].toLocaleString()}₮ –{" "}
                {priceRange[1].toLocaleString()}₮
              </span>
            </label>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              min={2000000}
              max={10000000}
              step={100000}
              className="**:[[role=slider]]:bg-blue-500 **:[[role=slider]]:border-blue-500"
            />
          </div>

          {/* SEARCH BUTTON */}
          <Button
            onClick={handleFilter}
            className="h-12 rounded-xl bg-blue-600 hover:bg-blue-500 px-8 text-white font-medium transition-colors shrink-0"
          >
            <Search className="h-4 w-4 mr-2" />
            Хайх
          </Button>
        </div>
      </div>

      {/* RESULTS GRID */}
      <div className="py-12">
        {filteredHosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredHosts.map((host) => (
              <HostCard
                key={host.id}
                host={host}
                selectedBooking={selectedBooking}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-zinc-500 text-lg">Хөтлөгч олдсонгүй</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Host;
