"use client";
import { use, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FilterSidebar from "@/components/performers/FilterSidebar";
import PerformersGrid from "@/components/performers/PerformersGrid";
import {
  usePerformers,
  useGenres,
  useBookings,
  usePerformerBooking,
} from "@/hooks/usePerformersData";
import {
  isPerformerBooked as checkPerformerBooked,
  getPerformerAvailability as checkPerformerAvailability,
  getAvailabilityColor as getAvailabilityColorUtil,
  filterPerformers,
  sortPerformers,
} from "@/lib/performersUtils";

const PerformersPage = ({
  searchParams,
}: {
  searchParams: Promise<{ booking?: string }>;
}) => {
  const params = use(searchParams);

  const bookingIdFromUrl = params?.booking;

  const { performers, isLoading } = usePerformers();
  const genres = useGenres();
  const {
    bookings,
    allBookings,
    selectedBooking,
    isLoadingBookings,
    bookingRefs,
    handleBookingSelect,
  } = useBookings(bookingIdFromUrl ?? null);
  const { bookingPerformer, bookPerformer } = usePerformerBooking();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>(
    []
  );
  const [minPopularity, setMinPopularity] = useState<number>(0);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(100000000);
  const [sortBy, setSortBy] = useState<string>("popularity");
  const [isGenreOpen, setIsGenreOpen] = useState(false);

  const isPerformerBookedFn = (performerId: number) =>
    checkPerformerBooked(performerId, selectedBooking, allBookings);
  const getPerformerAvailability = (performerId: number) =>
    checkPerformerAvailability(performerId, selectedBooking, allBookings);
  const getAvailabilityColor = (availability: string) =>
    getAvailabilityColorUtil(availability);
  const handleBookPerformer = (performerId: number) =>
    bookPerformer(performerId, selectedBooking);

  const clearFilters = () => {
    setSelectedGenres([]);
    setSelectedAvailability([]);
    setMinPopularity(0);
    setMinPrice(0);
    setMaxPrice(100000000);
    setSortBy("popularity");
  };

  const filteredPerformers = filterPerformers(
    performers,
    selectedGenres,
    selectedAvailability,
    minPopularity,
    minPrice,
    maxPrice,
    getPerformerAvailability
  );
  const sortedPerformers = sortPerformers(filteredPerformers, sortBy);

  return (
    <div className="min-h-screen w-full bg-black text-white px-4 sm:px-8 pt-28">
      <div className="flex gap-8">
        <div className="w-80 shrink-0 hidden lg:block">
          <div className="sticky top-28">
            <FilterSidebar
              bookings={bookings}
              isLoadingBookings={isLoadingBookings}
              selectedBooking={selectedBooking}
              onBookingSelect={handleBookingSelect}
              bookingRefs={bookingRefs}
              genres={genres}
              selectedGenres={selectedGenres}
              setSelectedGenres={setSelectedGenres}
              selectedAvailability={selectedAvailability}
              setSelectedAvailability={setSelectedAvailability}
              minPopularity={minPopularity}
              setMinPopularity={setMinPopularity}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              isGenreOpen={isGenreOpen}
              setIsGenreOpen={setIsGenreOpen}
              clearFilters={clearFilters}
              isPopover={false}
            />
          </div>
        </div>
        <div className="flex-1 w-full flex-row">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold md:text-4xl">
              Уран бүтээлчид хайх
            </h1>
            <div className=" sm:hidden items-center gap-3 md:hidden hidden lg:flex">
              <label className="text-sm text-gray-400">Эрэмбэлэх:</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-50 bg-neutral-800 text-white border-neutral-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 text-white border-neutral-700">
                  <SelectItem value="popularity">Алдартай байдал</SelectItem>
                  <SelectItem value="price-high">Үнэ: Ихээс бага</SelectItem>
                  <SelectItem value="price-low">Үнэ: Багаас их</SelectItem>
                  <SelectItem value="name">Нэр</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="lg:hidden items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="gap-2 bg-white text-black hover:bg-neutral-200">
                    <Filter className="h-4 w-4" />
                    Шүүлтүүр
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-neutral-900 text-white border border-neutral-800 p-0">
                  <FilterSidebar
                    bookings={bookings}
                    isLoadingBookings={isLoadingBookings}
                    selectedBooking={selectedBooking}
                    onBookingSelect={handleBookingSelect}
                    bookingRefs={bookingRefs}
                    genres={genres}
                    selectedGenres={selectedGenres}
                    setSelectedGenres={setSelectedGenres}
                    selectedAvailability={selectedAvailability}
                    setSelectedAvailability={setSelectedAvailability}
                    minPopularity={minPopularity}
                    setMinPopularity={setMinPopularity}
                    minPrice={minPrice}
                    setMinPrice={setMinPrice}
                    maxPrice={maxPrice}
                    setMaxPrice={setMaxPrice}
                    isGenreOpen={isGenreOpen}
                    setIsGenreOpen={setIsGenreOpen}
                    clearFilters={clearFilters}
                    isPopover={true}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="mb-4 text-gray-400 text-sm">
            {isLoading ? (
              <Skeleton className="h-5 w-40" />
            ) : (
              `${sortedPerformers.length} уран бүтээлч олдлоо`
            )}
          </div>
          <PerformersGrid
            performers={sortedPerformers}
            isLoading={isLoading}
            bookingPerformer={bookingPerformer}
            getPerformerAvailability={getPerformerAvailability}
            getAvailabilityColor={getAvailabilityColor}
            isPerformerBooked={isPerformerBookedFn}
            onBook={handleBookPerformer}
          />
        </div>
      </div>
    </div>
  );
};
export default PerformersPage;
