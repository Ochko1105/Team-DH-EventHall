"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Star, Users } from "lucide-react";

import { Button } from "../ui/button";
import FilterSidebar from "../us/Nemelt";

const EventHallsListing = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [eventHalls, setEventHalls] = React.useState<any[]>([]);
  const getEventHallData = async () => {
    try {
      const res = await fetch("/api/event-halls");
      if (!res.ok) {
        console.error("API error:", res.status, res.statusText);
        return;
      }
      const data = await res.json();

      setEventHalls(data.data || []);
    } catch (error) {
      console.error("Error fetching event halls:", error);
    }
  };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getEventHallData();
  }, []);

  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const eventHallOnclick = (hall: any) => {
    if (!hall?.id) {
      console.error("Event hall ID is missing:", hall);
      return;
    }
    router.push(`/event-halls/${hall.id}`);
  };
  return (
    <div className="text-black">
      <div className="w-full h-screen bg-black">
        <div className="flex gap-10 px-20 py-20 ">
          <FilterSidebar />

          {/*  */}
          <div className="flex flex-wrap gap-8">
            {eventHalls.map((hall, i) => (
              <div
                key={i}
                className="w-[300px] h-[500px] bg-neutral-800 rounded-2xl"
              >
                <img
                  className="w-full h-[230px] rounded-2xl"
                  src={hall.images}
                />
                ç
                <div className="px-4 py-4 space-y-1">
                  <a className="text-white text-2xl font-semibold">
                    {hall.name}
                  </a>
                  <div className=" flex gap-2 items-center">
                    <MapPin className="text-neutral-400" />
                    <a className="text-neutral-400 text-xl font-medium mt-4 truncate">
                      {hall.location}
                    </a>
                  </div>

                  <div className="justify-between flex">
                    <div className="flex gap-2 items-center">
                      <Users className="text-neutral-400" />
                      <a className="text-neutral-400 text-xl font-medium truncate">
                        {hall.capacity}
                      </a>
                    </div>
                    <a className="text-blue-500 text-xl font-medium">
                      {hall.menu[0]}
                    </a>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Star className="text-blue-500" />
                    <a className="text-blue-500 text-xl font-medium">4.8/5</a>
                  </div>

                  <Button
                    onClick={() => eventHallOnclick(hall)}
                    className="w-full h-10 text-base mt-6 hover:bg-white hover:text-black transition-all duration-300"
                  >
                    View details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default EventHallsListing;
