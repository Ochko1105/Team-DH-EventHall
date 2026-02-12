"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
        ? defaultValue
        : [min, max],
    [value, defaultValue, min, max]
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none",
        className
      )}
      {...props}
    >
      {/* TRACK */}
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative h-2 w-full grow overflow-hidden rounded-full bg-[#1e293b]"
      >
        {/* RANGE */}
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute h-full bg-blue-500"
        />
      </SliderPrimitive.Track>

      {/* THUMBS */}
      {Array.from({ length: _values.length }, (_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          data-slot="slider-thumb"
          className="
            block h-5 w-5 rounded-full bg-white border-2 border-blue-500
         
            transition-all
            focus-visible:outline-none
            focus-visible:ring-4 focus-visible:ring-blue-300
          "
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
