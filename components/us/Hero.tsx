/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Users, DollarSign, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import ImageWithFallback from "./Fallback";
import { Button } from "../ui/button";

export const Hero = () => {
  const [originalHalls, setOriginalHalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch("/api/event-halls");
        const data = await res.json();

        if (data) {
          setOriginalHalls(data.data);
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };

    getData();
  }, []);

  return (
    <section className="bg-black text-white w-full min-h-screen flex flex-col justify-start  overflow-hidden py-16 lg:py-20">
      <div className="container mx-auto px-4 text-center">
        {/* Main Hero Text */}
        <h2
          className="font-extrabold text-5xl lg:text-8xl mb-4 animate-fade-in-up"
          style={{ animationDelay: "200ms" }}
        >
          Онцлох Танхим
        </h2>
        <p
          className="max-w-3xl mx-auto lg:text-lg text-[14px] text-blue-400 animate-fade-in-up"
          style={{ animationDelay: "400ms" }}
        >
          Таны арга хэмжээнд тохирох тансаг, өргөн болон тухтай заалуудыг эндээс
          олно уу. Том танхимаас эхлээд цэцэрлэгт хүрээлэнгийн жижиг заал
          хүртэл— танай арга хэмжээнд яг тохирсон орон зайг санал болгож байна.
        </p>
      </div>

      {/* Featured Cards Grid */}
      <div className="container mx-auto hidden md:flex px-4 mt-12 lg:mt-20">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
          {originalHalls.slice(0, 6).map((hall, index) => (
            <div
              key={hall.id}
              className="bg-neutral-900 cursor-pointer rounded-lg overflow-hidden transform hover:shadow-xl hover:scale-[1.02] transition-transform duration-200"
              style={{ animationDelay: `${600 + index * 100}ms` }}
              onClick={() => router.push(`/event-halls/${hall.id}`)}
            >
              <div className="relative h-48 w-full">
                <ImageWithFallback
                  src={hall.images?.[0] || "/eventhalldefault.jpg"}
                  fallbackSrc="/eventhalldefault.jpg"
                  alt={hall.name}
                />
              </div>

              <div className="p-5">
                <h3 className="text-xl font-bold text-white">{hall.name}</h3>
                <p className="text-sm text-neutral-400 mt-1 truncate">
                  {hall.location}
                </p>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-neutral-800 text-sm text-neutral-300">
                  {/* Capacity */}
                  <div
                    className="flex items-center gap-1.5"
                    title="Хүний багтаамж"
                  >
                    <Users className="w-4 h-4 text-neutral-400" />
                    <span className="text-sm">{hall.capacity} хүн</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-1.5" title="Цагийн үнэ">
                    <DollarSign className="w-4 h-4 text-neutral-400" />
                    <span>{hall.price?.[0]}₮ / цаг</span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center  gap-1.5" title="Үнэлгээ">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{hall.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="container md:hidden flex mx-auto px-4 mt-12 lg:mt-20">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
          {originalHalls.slice(0, 4).map((hall, index) => (
            <div
              key={hall.id}
              className="bg-neutral-900 h-full flex flex-col cursor-pointer rounded-lg overflow-hidden transform hover:shadow-xl justify-between hover:scale-[1.02] transition-transform duration-200"
              style={{ animationDelay: `${600 + index * 100}ms` }}
              onClick={() => router.push(`/event-halls/${hall.id}`)}
            >
              <div className="relative h-40 w-full">
                <ImageWithFallback
                  src={hall.images?.[0] || "/eventhalldefault.jpg"}
                  fallbackSrc="/eventhalldefault.jpg"
                  alt={hall.name}
                />
              </div>

              <div className="p-3">
                <h3 className="text-l font-bold text-white">{hall.name}</h3>
                <p className="text-[14px] text-neutral-400 mt-1 truncate">
                  {hall.location}
                </p>
              </div>
              <div className="p-2  flex justify-end mt-auto">
                <Button
                  onClick={() => router.push(`/event-halls/${hall.id}`)}
                  className=" cursor-pointer mt-auto w-full bg-neutral-800 hover:bg-neutral-700 text-white py-2 rounded-lg"
                >
                  Дэлгэрэнгүй
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
