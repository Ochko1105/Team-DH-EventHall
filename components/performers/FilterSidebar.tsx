/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import BookingsList from "./BookingsList";
import PerformerFilters from "./PerformerFilters";

interface FilterSidebarProps {
  bookings: any[];
  isLoadingBookings: boolean;
  selectedBooking: any;
  onBookingSelect: (booking: any) => void;
  bookingRefs: React.MutableRefObject<{ [key: number]: HTMLDivElement | null }>;
  genres: string[];
  selectedGenres: string[];
  setSelectedGenres: (genres: string[]) => void;
  selectedAvailability: string[];
  setSelectedAvailability: (availability: string[]) => void;
  minPopularity: number;
  setMinPopularity: (value: number) => void;
  minPrice: number;
  setMinPrice: (value: number) => void;
  maxPrice: number;
  setMaxPrice: (value: number) => void;
  isGenreOpen: boolean;
  setIsGenreOpen: (value: boolean) => void;
  isPopover?: boolean;
  clearFilters: () => void;
}

export default function FilterSidebar({
  bookings,
  isLoadingBookings,
  selectedBooking,
  onBookingSelect,
  bookingRefs,
  genres,
  selectedGenres,
  setSelectedGenres,
  selectedAvailability,
  setSelectedAvailability,
  minPopularity,
  setMinPopularity,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  isGenreOpen,
  setIsGenreOpen,
  clearFilters,
  isPopover = false,
}: FilterSidebarProps) {
  return (
    <div
      className={`w-full bg-neutral-900 rounded-lg flex flex-col ${
        isPopover ? "max-h-[80vh] overflow-y-auto p-3" : "p-6"
      }`}
    >
      <h2 className="text-xl font-bold text-white mb-4">
        Таны захиалсан Event hall
      </h2>

      <BookingsList
        bookings={bookings}
        isLoading={isLoadingBookings}
        selectedBooking={selectedBooking}
        onBookingSelect={onBookingSelect}
        bookingRefs={bookingRefs}
      />

      <PerformerFilters
        clearFilters={clearFilters}
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
      />
    </div>
  );
}
