/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function EventHallsSkeleton() {
  const [skeletonCount, setSkeletonCount] = useState(6);

  useEffect(() => {
    const cardMinWidth = 280;
    const cols = Math.floor(window.innerWidth / cardMinWidth) || 1;
    setSkeletonCount(Math.max(6, cols * 2));
  }, []);

  return (
    <>
      {Array.from({ length: skeletonCount }).map((_, i) => (
        <div
          key={i}
          className="flex-1 min-w-70 max-w-117.5 w-full
                     bg-neutral-900 rounded-lg overflow-hidden shadow-xl
                     flex flex-col"
        >
          <div className="relative w-full h-60 bg-neutral-800">
            <Skeleton className="absolute inset-0 h-full w-full bg-neutral-800" />
          </div>

          <div className="p-4 space-y-2 flex-1 flex flex-col">
            <Skeleton className="h-6 w-3/5 rounded-md bg-neutral-700" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-3 w-1/2 rounded-md bg-neutral-700" />
              <Skeleton className="h-3 w-10 rounded-md bg-neutral-700" />
            </div>
            <div className="flex justify-between items-center h-10 mt-1">
              <Skeleton className="h-4 w-24 rounded-md bg-neutral-700" />
              <Skeleton className="h-4 w-16 rounded-md bg-neutral-700" />
            </div>
            <Skeleton className="h-8 w-full mt-auto rounded-lg bg-neutral-700" />
          </div>
        </div>
      ))}
    </>
  );
}
