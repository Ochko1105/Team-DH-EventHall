"use client";

import type React from "react";
import Image from "next/image";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  MapPin,
  Phone,
  Car,
  Users,
  ChevronLeft,
  ChevronRight,
  Check,
  Star,
  ArrowUpRight,
  Router,
} from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { BookingCalendar } from "@/components/event-halls/DayCalendar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EventHall {
  id: number;
  name: string;
  location?: string | null;
  capacity?: string | null;
  description?: string | null;
  suitable_events: string[];
  images: string[];
  phonenumber?: string | null;
  menu: string[];
  parking_capacity?: number | null;
  additional_informations: string[];
  informations_about_hall: string[];
  advantages: string[];
  localtion_link?: string;
  rating?: number;
}

export default function SelectedEventHall() {
  const params = useParams();
  const eventHallId = params.id as string;

  const [eventHallData, setEventHallData] = useState<EventHall | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const getSelectedEventHall = useCallback(async () => {
    if (!eventHallId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/selected-event-hall`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventHallId }),
      });
      const data = await res.json();
      console.log(data.data);
      setEventHallData(data.data);
    } catch (error) {
      console.error("Error fetching event hall:", error);
    } finally {
      setIsLoading(false);
    }
  }, [eventHallId]);

  useEffect(() => {
    getSelectedEventHall();
  }, [getSelectedEventHall]);

  const nextImage = () => {
    if (eventHallData?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % eventHallData.images.length);
    }
  };

  const prevImage = () => {
    if (eventHallData?.images) {
      setCurrentImageIndex(
        (prev) =>
          (prev - 1 + eventHallData.images.length) % eventHallData.images.length
      );
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!eventHallData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Event hall not found</p>
      </div>
    );
  }
  const Mockimages = [{ src: "/zurag1.jpg" }];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative h-[70vh] w-full overflow-hidden">
        {eventHallData.id === 3 && (
          <div>
            {Mockimages.map((_, index) => (
              <Image
                src={`${_.src}`}
                key={index}
                alt="Special Image"
                width={1200}
                height={800}
                priority
                quality={100}
                className="absolute inset-0 h-full w-full object-cover transition-all duration-500"
              />
            ))}
          </div>
        )}
        <Image
          width={1200}
          height={800}
          priority
          quality={100}
          src={
            eventHallData.images[currentImageIndex] ||
            "/placeholder.svg?height=800&width=1200&query=luxury event hall interior"
          }
          alt={eventHallData.name}
          className="h-full w-full object-cover transition-all duration-500"
        />{" "}
        {/* Clean gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-background/20" />
        {/* Hero Content */}
        <div className="sticky bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="max-w-400 mx-auto">
            <div className="flex items-center gap-2 mb-3">
              {eventHallData.rating && (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/80">
                  <Star className="w-4 h-4 fill-foreground text-foreground" />
                  {eventHallData.rating}
                </span>
              )}
              <span className="text-foreground/40">·</span>
              <span className="text-sm text-foreground/60">Premium Venue</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {eventHallData.name}
            </h1>

            {eventHallData.location && (
              <div>
                {" "}
                <div className="flex items-center   md:mb-3 mb-4">
                  <MapPin className="w-4 h-4" />
                  <p className=" text-foreground/60 flex items-center gap-2 truncate">
                    {eventHallData.location}
                  </p>
                </div>{" "}
              </div>
            )}
          </div>
        </div>
        {/* Minimal navigation controls */}
        {eventHallData.images.length > 1 && (
          <div>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center hover:bg-background/80 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center hover:bg-background/80 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
        {/* Image counter */}
        <div className="absolute top-6 right-6 text-sm text-foreground/60 font-medium">
          {currentImageIndex + 1} / {eventHallData.images.length}
        </div>
      </section>

      <section className="max-w-400 mx-auto px-6 -mt-10 relative z-10">
        <div className="flex gap-2  pb-4">
          {eventHallData.id === 3 ? (
            <div>
              {Mockimages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative h-16 w-24 shrink-0 rounded-lg overflow-hidden transition-all mr-5 ${
                    index === currentImageIndex ? "ring-2 ring-foreground" : ""
                  }`}
                >
                  <Image
                    quality={100}
                    width={40}
                    height={40}
                    src={_.src}
                    alt={`View ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          ) : (
            <div>
              {" "}
              {eventHallData.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`relative h-16 w-24 shrink-0 rounded-lg overflow-hidden transition-all ${
                    idx === currentImageIndex
                      ? "ring-2 ring-foreground"
                      : "opacity-50 hover:opacity-80"
                  }`}
                >
                  <Image
                    quality={100}
                    width={24}
                    height={16}
                    src={img || "/placeholder.svg"}
                    alt={`View ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="max-w-400 mx-auto px-6 mt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <InfoCard
            icon={<MapPin color="white" className="h-4 w-4" />}
            label="Байршил"
            value={eventHallData.location || "—"}
            link={eventHallData.localtion_link}
          />
          <InfoCard
            icon={<Users className="h-4 w-4 " color="white" />}
            label="Хүчин чадал"
            value={eventHallData.capacity || "—"}
          />
          <InfoCard
            icon={<Car color="white" className="h-4 w-4" />}
            label="Зогсоол"
            value={
              eventHallData.parking_capacity
                ? `${eventHallData.parking_capacity} машины`
                : "—"
            }
          />
          <div>
            <InfoCard
              icon={<Phone color="white" className="h-4 w-4" />}
              label="Утас"
              value={eventHallData.phonenumber || "—"}
              isPhone
            />
          </div>
        </div>
      </section>

      <section className="max-w-400 mx-auto px-6 mt-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Description */}
          <div className="lg:col-span-2 space-y-10">
            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Тайлбар</h2>
              <p className="text-muted-foreground leading-relaxed">
                {eventHallData.description}
              </p>

              {eventHallData.advantages.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-sm font-medium text-white uppercase tracking-wide mb-4">
                    Давуу талууд
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {eventHallData.advantages.map((adv, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center text-muted-foreground gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-sm"
                      >
                        <Check className="w-3.5 h-3.5" />
                        {adv}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Suitable Events */}
            {eventHallData.suitable_events.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Тохиромжтой эвентүүд
                </h2>
                <div className="flex flex-wrap gap-2">
                  {eventHallData.suitable_events.map((event, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 text-muted-foreground rounded-full border border-border text-sm"
                    >
                      {event}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {eventHallData.additional_informations.length > 0 && (
              <DetailCard
                title="Нэмэлт мэдээлэл"
                items={eventHallData.additional_informations}
              />
            )}
            {eventHallData.informations_about_hall.length > 0 && (
              <DetailCard
                title="Танхимын мэдээлэл"
                items={eventHallData.informations_about_hall}
              />
            )}
          </div>
        </div>
      </section>

      <section className="max-w-400 mx-auto px-6 mt-20 mb-24">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold">Захиалгын хуанли</h2>
          <p className="mt-2 text-muted-foreground">
            Өөрт тохирох өдөр, цагаа сонгоно уу
          </p>
        </div>
        <BookingCalendar eventHallData={eventHallData} hallId={eventHallId} />
      </section>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
  link,
  isPhone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  link?: string;
  isPhone?: boolean;
}) {
  const content = (
    <div className="p-4 rounded-xl bg-card border border-border hover:border-foreground/20 transition-colors group">
      <div className="flex items-center gap-2 mb-2 text-muted-foreground">
        {icon}
        <span className="text-xs text-white font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="font-medium text-muted-foreground flex items-center gap-1.5">
        {value}

        {link && (
          <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </p>
      {label === "Утас" && (
        <div className="mt-6">
          {" "}
          <span className="bg-transparent text-transparent">aaaaaaa</span>
        </div>
      )}
    </div>
  );

  if (link) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  if (isPhone && value !== "—") {
    return <a href={`tel:${value}`}>{content}</a>;
  }

  return content;
}

function DetailCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="p-5 rounded-xl bg-card border border-border">
      <h3 className="font-semibold mb-4">{title}</h3>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-sm">
            <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-foreground/40 shrink-0" />
            <span className="text-muted-foreground">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <Skeleton className="h-[70vh] w-full" />
      <div className="max-w-400 mx-auto px-6  relative z-10 mt-23"></div>
      <div className="max-w-400 mx-auto px-6 mt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
      <div className="max-w-400 mx-auto px-6 mt-16 grid lg:grid-cols-3 gap-8">
        <Skeleton className="lg:col-span-2 h-64 rounded-xl" />
        <div className="space-y-6">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
