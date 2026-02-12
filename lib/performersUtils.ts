// Utility functions for performers page

export const isPerformerBooked = (
  performerId: number,
  selectedBooking: any,
  allBookings: any[]
): boolean => {
  if (!selectedBooking) return false;

  return allBookings.some((booking) => {
    const bookingDate = new Date(booking.date).toISOString().split("T")[0];
    const selectedDate = new Date(selectedBooking.date)
      .toISOString()
      .split("T")[0];

    return (
      booking.performersid === performerId &&
      bookingDate === selectedDate &&
      booking.starttime === selectedBooking.starttime &&
      booking.status !== "cancelled"
    );
  });
};

export const getPerformerAvailability = (
  performerId: number,
  selectedBooking: any,
  allBookings: any[]
): string => {
  if (!selectedBooking) return "Сонголт хийнэ үү";

  const performerBooking = allBookings.find((booking) => {
    const bookingDate = new Date(booking.date).toISOString().split("T")[0];
    const selectedDate = new Date(selectedBooking.date)
      .toISOString()
      .split("T")[0];

    return (
      booking.performersid === performerId &&
      bookingDate === selectedDate &&
      booking.starttime === selectedBooking.starttime &&
      booking.status !== "cancelled"
    );
  });

  if (!performerBooking) return "Боломжтой";

  if (performerBooking.status === "pending") return "Хүлээгдэж байна";
  if (performerBooking.status === "approved") return "Захиалагдсан";

  return "Боломжтой";
};

export const getAvailabilityColor = (availability: string): string => {
  switch (availability) {
    case "Боломжтой":
      return "bg-green-600";
    case "Хүлээгдэж байна":
      return "bg-yellow-600";
    case "Захиалагдсан":
      return "bg-red-600";
    default:
      return "bg-gray-600";
  }
};

export const filterPerformers = (
  performers: any[],
  selectedGenres: string[],
  selectedAvailability: string[],
  minPopularity: number,
  minPrice: number,
  maxPrice: number,
  getPerformerAvailabilityFn: (id: number) => string
): any[] => {
  return performers.filter((performer) => {
    const genreMatch =
      selectedGenres.length === 0 ||
      selectedGenres.some((genre) => performer.genre?.includes(genre));

    const performerAvailability = getPerformerAvailabilityFn(performer.id);
    const availabilityMatch =
      selectedAvailability.length === 0 ||
      selectedAvailability.includes(performerAvailability);

    const popularityMatch = (performer.popularity || 0) >= minPopularity;
    const priceMatch =
      Number(performer.price) >= minPrice &&
      Number(performer.price) <= maxPrice;

    return genreMatch && availabilityMatch && popularityMatch && priceMatch;
  });
};

export const sortPerformers = (performers: any[], sortBy: string): any[] => {
  return [...performers].sort((a, b) => {
    if (sortBy === "popularity")
      return (b.popularity || 0) - (a.popularity || 0);
    if (sortBy === "price-low") return Number(a.price) - Number(b.price);
    if (sortBy === "price-high") return Number(b.price) - Number(a.price);
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });
};
