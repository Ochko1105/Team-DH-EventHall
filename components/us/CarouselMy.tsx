/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel as CarouselDefault } from "@/components/ui/carousel"; // default export
import type { CarouselApi } from "@/components/ui/carousel"; // type only
import {
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"; // named exports
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface HallType {
  id: number;
  name: string;
  description: string;
  duureg: string;
  title: string;
  rating: number;
  images: string[];
}

export const CarouselMy = ({ halls }: { halls?: HallType[] }) => {
  const [api, setApi] = React.useState<CarouselApi>();

  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const plugin = React.useRef(Autoplay({ delay: 4500 }));

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => setCurrent(api.selectedScrollSnap() + 1));
  }, [api]);

  return (
    <div className="relative w-full h-[60vh] sm:h-screen">
      <CarouselDefault
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full h-full"
      >
        <CarouselContent className="w-full h-full">
          {halls?.slice(0, 5).map((el: HallType) => (
            <CarouselCard key={el.id} el={el} Mockimages={Mockimages} />
          ))}
        </CarouselContent>

        <CarouselPrevious className="hidden sm:flex absolute top-1/2 left-6 lg:left-10 -translate-y-1/2 items-center justify-center z-20" />
        <CarouselNext className="hidden sm:flex absolute top-1/2 right-6 lg:right-10 -translate-y-1/2 items-center justify-center z-20" />
      </CarouselDefault>

      <div className="absolute hidden lg:flex bottom-6 left-0 right-0  justify-center z-30">
        <div className="flex gap-2">
          {Array.from({ length: count }).map((_, index) => (
            <button
              onClick={() => api?.scrollTo(index)}
              key={index}
              aria-label={`Go to slide ${index + 1}`}
              className={`rounded-full h-3 w-3 sm:h-4 sm:w-4 ${
                index + 1 === current ? "bg-white" : "bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
const Mockimages = [
  { title: "zurag1", src: "/zurag1.jpg" },
  { title: "zurag2", src: "/zurag2.jpg" },
  { title: "zurag3", src: "/zurag3.jpg" },
];

const CarouselCard = ({
  el,
  Mockimages,
}: {
  el: HallType;
  Mockimages: any[];
}) => {
  const router = useRouter();
  return (
    <CarouselItem className="relative w-full h-[60vh] sm:h-screen p-0 cursor-pointer">
      <Card className="w-full h-full p-0 border-0 ml-[16] shadow-none rounded-none relative">
        {/* <Image
          src={
            el.images[0] ||
            "https://img.freepik.com/premium-vector/image-icon-design-vector-template_1309674-943.jpg"
          }
          alt={el.name}
          fill={true}
          priority
          sizes="100vw"
          className="objec
          t-cover"
        /> */}

        <Image
          src={`${Mockimages[el.id % Mockimages.length].src}`}
          alt={el.name}
          fill={true}
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />

        <CardContent className="hidden sm:flex flex-col absolute top-8/17 left-[6%] lg:left-[12%] -translate-y-1/3 text-white">
          <p className="mb-0 font-medium text-sm lg:text-base [text-shadow:0_1px_3px_rgb(0_0_0/0.5)]">
            Танхим:
          </p>
          <h1 className="font-extrabold text-4xl lg:text-6xl [text-shadow:0_2px_4px_rgb(0_0_0/0.5)]">
            {el.name}
          </h1>
          <div className="flex items-center text-base mt-2 [text-shadow:0_1px_3px_rgb(0_0_0/0.5)]">
            <svg
              className="w-6 h-6 text-yellow-400 mr-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 26 25"
              fill="none"
            >
              <path
                d="M12.9999 1.33337L16.6049 8.63671L24.6666 9.81504L18.8333 15.4967L20.2099 23.5234L12.9999 19.7317L5.78992 23.5234L7.16658 15.4967L1.33325 9.81504L9.39492 8.63671L12.9999 1.33337Z"
                fill="#FDE047"
                stroke="#FDE047"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{el.rating}</span>
            <span className="text-gray-300 ml-1">/10</span>
          </div>
          <p className="mt-2 lg:mt-4 text-base lg:text-lg max-w-[320px] lg:max-w-125 [text-shadow:0_1px_3px_rgb(0_0_0/0.5)] truncate">
            {el.description}
          </p>
          <button
            onClick={() => router.push(`/event-halls/${el.id}`)}
            className="mt-4 w-fit bg-white/90 text-black font-bold py-2 px-6 rounded-md hover:bg-white transition-colors"
          >
            Мэдээлэл
          </button>
        </CardContent>

        <CardContent className="sm:hidden absolute inset-0 mt-0 flex flex-col justify-center p-6 text-white z-10">
          <p className="mb-1 font-medium text-[14px] [text-shadow:0_1px_3px_rgb(0_0_0/0.5)]">
            Танхим:
          </p>
          <h1 className="font-bold text-2xl mb-1 [text-shadow:0_2px_4px_rgb(0_0_0/0.5)]">
            {el.name}
          </h1>
          <div className="flex items-center text-[14px] mb-2 [text-shadow:0_1px_3px_rgb(0_0_0/0.5)]">
            <svg
              className="w-5 h-5 text-yellow-400 mr-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 26 25"
              fill="none"
            >
              <path
                d="M12.9999 1.33337L16.6049 8.63671L24.6666 9.81504L18.8333 15.4967L20.2099 23.5234L12.9999 19.7317L5.78992 23.5234L7.16658 15.4967L1.33325 9.81504L9.39492 8.63671L12.9999 1.33337Z"
                fill="#FDE047"
                stroke="#FDE047"
              />
            </svg>
            <span>{el.rating}</span>
            <span className="text-gray-300 ml-1">/10</span>
          </div>
          <p className="text-[14px] line-clamp-3 [text-shadow:0_1px_3px_rgb(0_0_0/0.5)]">
            {el.description}
          </p>
          <button
            onClick={() => router.push(`/event-halls/${el.id}`)}
            className="mt-3 w-fit bg-white/90 text-black font-bold py-1.5 px-4 rounded-md text-sm hover:bg-white transition-colors"
          >
            Мэдээлэл
          </button>
        </CardContent>
      </Card>
    </CarouselItem>
  );
};
