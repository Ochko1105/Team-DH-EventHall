"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

interface EventHall {
  id: number;
  name: string;
  location: string | null;
  location_link: string | null;
  description: string | null;
  capacity: string | null;
  images: string[];
}

interface MapContentProps {
  eventHalls: EventHall[];
}

// @ts-ignore - Dynamic import with no SSR
const MapContent = dynamic<MapContentProps>(() => import("./MapContent"), {
  ssr: false,
  loading: () => (
    <div className="h-96 w-full bg-gray-800 rounded-lg flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p>Loading map...</p>
      </div>
    </div>
  ),
});

export const Map = () => {
  const [eventHalls, setEventHalls] = useState<EventHall[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventHalls = async () => {
      try {
        const response = await fetch("/api/event-halls");
        const data = await response.json();
        setEventHalls(data.data || []);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching event halls:", err);
        setError("Failed to load event halls");
        setIsLoading(false);
      }
    };

    fetchEventHalls();
  }, []);

  if (isLoading) {
    return (
      <div className="h-96 w-full bg-gray-800 rounded-lg flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-96 w-full bg-gray-800 rounded-lg flex items-center justify-center">
        <div className="text-red-400 text-center">
          <p className="text-xl mb-2">⚠️</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return <MapContent eventHalls={eventHalls} />;
};
