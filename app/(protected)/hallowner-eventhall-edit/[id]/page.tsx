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
  Edit,
} from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookingCalendar } from "@/components/event-halls/HallownerDayCalendar";
import { toast } from "sonner";

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
  owner_id?: number | null;
  price?: number[];
}

export default function SelectedEventHall() {
  const params = useParams();
  const router = useRouter();
  const eventHallId = params.id as string;

  const [eventHallData, setEventHallData] = useState<EventHall | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<string>("");
  const [editFormData, setEditFormData] = useState<any>({});

  // Check if current user is the owner

  useEffect(() => {
    const checkOwnership = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setCurrentUserId(data.user.id);

          // Check if user is owner after eventHallData is loaded
          if (eventHallData && data.user.id === eventHallData.owner_id) {
            setIsOwner(true);
          }
        }
      } catch (error) {
        console.error("Error checking ownership:", error);
      }
    };

    checkOwnership();
  }, [eventHallData]);

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

  const handleOpenEditDialog = (section: string, data: any) => {
    setEditingSection(section);
    setEditFormData(data);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`/api/hallowner/my-halls/${eventHallId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editFormData),
      });

      if (res.ok) {
        // Refresh the data
        await getSelectedEventHall();
        setEditDialogOpen(false);
        alert("Амжилттай хадгалагдлаа!");
      } else {
        alert("Алдаа гарлаа. Дахин оролдоно уу.");
      }
    } catch (error) {
      console.error("Error saving:", error);
      alert("Алдаа гарлаа. Дахин оролдоно уу.");
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
      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSection === "description" && "Тайлбар засах"}
              {editingSection === "location" && "Байршил засах"}
              {editingSection === "capacity" && "Хүчин чадал засах"}
              {editingSection === "parking" && "Зогсоол засах"}
              {editingSection === "phone" && "Утас засах"}
              {editingSection === "suitable_events" &&
                "Тохиромжтой эвентүүд засах"}
              {editingSection === "additional_info" && "Нэмэлт мэдээлэл засах"}
              {editingSection === "hall_info" && "Танхимын мэдээлэл засах"}
              {editingSection === "images" && "Зургууд засах"}
            </DialogTitle>
            <DialogDescription>
              Өөрчлөлт хийсний дараа хадгалах товчийг дарна уу.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {editingSection === "description" && (
              <div>
                <label className="text-sm font-medium">Тайлбар</label>
                <Textarea
                  value={editFormData.description || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      description: e.target.value,
                    })
                  }
                  className="mt-2 min-h-32"
                  placeholder="Танхимын тухай дэлгэрэнгүй мэдээлэл"
                />
              </div>
            )}

            {editingSection === "location" && (
              <div>
                <label className="text-sm text-white font-medium">
                  Байршил
                </label>
                <Input
                  value={editFormData.location || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      location: e.target.value,
                    })
                  }
                  className="mt-2"
                  placeholder="Хаяг"
                />
              </div>
            )}

            {editingSection === "capacity" && (
              <div>
                <label className="text-sm font-medium">Хүчин чадал</label>
                <Input
                  value={editFormData.capacity || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      capacity: e.target.value,
                    })
                  }
                  className="mt-2"
                  placeholder="Хүний тоо"
                />
              </div>
            )}

            {editingSection === "parking" && (
              <div>
                <label className="text-sm font-medium">
                  Зогсоолын багтаамж
                </label>
                <Input
                  type="number"
                  value={editFormData.parking_capacity || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      parking_capacity: parseInt(e.target.value) || 0,
                    })
                  }
                  className="mt-2"
                  placeholder="Машины тоо"
                />
              </div>
            )}

            {editingSection === "phone" && (
              <div>
                <label className="text-sm font-medium">Утасны дугаар</label>
                <Input
                  value={editFormData.phonenumber || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      phonenumber: e.target.value,
                    })
                  }
                  className="mt-2"
                  placeholder="99001122"
                />
              </div>
            )}

            {editingSection === "suitable_events" && (
              <div>
                <label className="text-sm font-medium">
                  Тохиромжтой эвентүүд (таслалаар тусгаарлана)
                </label>
                <Textarea
                  value={
                    Array.isArray(editFormData.suitable_events)
                      ? editFormData.suitable_events.join(", ")
                      : ""
                  }
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      suitable_events: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter((s) => s),
                    })
                  }
                  className="mt-2 min-h-24"
                  placeholder="Хурим, Төрсөн өдөр, Одонгийн найр..."
                />
              </div>
            )}

            {editingSection === "additional_info" && (
              <div>
                <label className="text-sm font-medium">
                  Нэмэлт мэдээлэл (мөр бүрт нэг)
                </label>
                <Textarea
                  value={
                    Array.isArray(editFormData.additional_informations)
                      ? editFormData.additional_informations.join("\n")
                      : ""
                  }
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      additional_informations: e.target.value
                        .split("\n")
                        .filter((s) => s.trim()),
                    })
                  }
                  className="mt-2 min-h-32"
                  placeholder="Мөр бүрт нэг мэдээлэл бичнэ үү"
                />
              </div>
            )}

            {editingSection === "hall_info" && (
              <div>
                <label className="text-sm font-medium">
                  Танхимын мэдээлэл (мөр бүрт нэг)
                </label>
                <Textarea
                  value={
                    Array.isArray(editFormData.informations_about_hall)
                      ? editFormData.informations_about_hall.join("\n")
                      : ""
                  }
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      informations_about_hall: e.target.value
                        .split("\n")
                        .filter((s) => s.trim()),
                    })
                  }
                  className="mt-2 min-h-32"
                  placeholder="Мөр бүрт нэг мэдээлэл бичнэ үү"
                />
              </div>
            )}

            {editingSection === "images" && (
              <div>
                <label className="text-sm font-medium">
                  Зургийн URL-ууд (мөр бүрт нэг)
                </label>
                <Textarea
                  value={
                    Array.isArray(editFormData.images)
                      ? editFormData.images.join("\n")
                      : ""
                  }
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      images: e.target.value
                        .split("\n")
                        .filter((s) => s.trim()),
                    })
                  }
                  className="mt-2 min-h-32"
                  placeholder="Мөр бүрт нэг зургийн URL бичнэ үү"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Цуцлах
            </Button>
            <Button onClick={handleSaveEdit}>Хадгалах</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
        />

        {/* Clean gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-background/20" />

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
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
              <div className="flex items-center   md:mb-3 mb-4">
                <MapPin className="w-4 h-4" />
                <p className=" text-foreground/60 flex items-center gap-2 truncate">
                  {eventHallData.location}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Minimal navigation controls */}
        {eventHallData.images.length > 1 && (
          <>
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
          </>
        )}

        {/* Image counter */}
        <div className="absolute top-6 right-6 text-sm text-foreground/60 font-medium">
          {currentImageIndex + 1} / {eventHallData.images.length}
        </div>
      </section>

      <section className="max-w-400 mx-auto px-6 -mt-10 relative z-10 group">
        <div className="flex gap-2 pb-4 items-center relative">
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
          {isOwner && (
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                handleOpenEditDialog("images", { images: eventHallData.images })
              }
              className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm"
            >
              <Edit className="h-4 w-4 mr-1" />
              Засах
            </Button>
          )}
        </div>
      </section>

      <section className="max-w-400 mx-auto px-6 mt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <InfoCard
            icon={<MapPin className="h-4 w-4 text-white" />}
            label="Байршил"
            value={eventHallData.location || "—"}
            link={eventHallData.localtion_link}
            isOwner={isOwner}
            onEdit={() =>
              handleOpenEditDialog("location", {
                location: eventHallData.location,
              })
            }
          />
          <InfoCard
            icon={<Users className="h-4 w-4" />}
            label="Хүчин чадал"
            value={eventHallData.capacity || "—"}
            isOwner={isOwner}
            onEdit={() =>
              handleOpenEditDialog("capacity", {
                capacity: eventHallData.capacity,
              })
            }
          />
          <InfoCard
            icon={<Car className="h-4 w-4" />}
            label="Зогсоол"
            value={
              eventHallData.parking_capacity
                ? `${eventHallData.parking_capacity} машины`
                : "—"
            }
            isOwner={isOwner}
            onEdit={() =>
              handleOpenEditDialog("parking", {
                parking_capacity: eventHallData.parking_capacity,
              })
            }
          />
          <div>
            <InfoCard
              icon={<Phone className="h-4 w-4" />}
              label="Утас"
              value={eventHallData.phonenumber || "—"}
              isPhone
              isOwner={isOwner}
              onEdit={() =>
                handleOpenEditDialog("phone", {
                  phonenumber: eventHallData.phonenumber,
                })
              }
            />
          </div>
        </div>
      </section>

      <section className="max-w-400 mx-auto px-6 mt-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Description */}
          <div className="lg:col-span-2 space-y-10">
            {/* Description */}
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Тайлбар</h2>
                {isOwner && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      handleOpenEditDialog("description", {
                        description: eventHallData.description,
                      })
                    }
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Засах
                  </Button>
                )}
              </div>
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
                        className="inline-flex text-muted-foreground items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-sm"
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
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">
                    Тохиромжтой эвентүүд
                  </h2>
                  {isOwner && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        handleOpenEditDialog("suitable_events", {
                          suitable_events: eventHallData.suitable_events,
                        })
                      }
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Засах
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {eventHallData.suitable_events.map((event, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 rounded-full border border-border text-sm text-muted-foreground"
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
                isOwner={isOwner}
                onEdit={() =>
                  handleOpenEditDialog("additional_info", {
                    additional_informations:
                      eventHallData.additional_informations,
                  })
                }
              />
            )}
            {eventHallData.informations_about_hall.length > 0 && (
              <DetailCard
                title="Танхимын мэдээлэл"
                items={eventHallData.informations_about_hall}
                isOwner={isOwner}
                onEdit={() =>
                  handleOpenEditDialog("hall_info", {
                    informations_about_hall:
                      eventHallData.informations_about_hall,
                  })
                }
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
        <BookingCalendar
          eventHallData={eventHallData}
          hallId={eventHallId}
          isOwner={isOwner}
        />
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
  isOwner,
  onEdit,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  link?: string;
  isPhone?: boolean;
  isOwner?: boolean;
  onEdit?: () => void;
}) {
  const content = (
    <div className="p-4 rounded-xl bg-card border border-border hover:border-foreground/20 transition-colors group relative">
      <div className="flex items-center gap-2 mb-2 text-muted-foreground">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wide text-white">
          {label}
        </span>
      </div>
      <p className="font-medium flex items-center gap-1.5 text-muted-foreground">
        {value}

        {link && (
          <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </p>
      {label === "Утас" && (
        <div className="mt-10">
          <span className="bg-transparent text-transparent">aaaaaaa</span>
        </div>
      )}

      {isOwner && onEdit && (
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onEdit();
          }}
          className="absolute top-2 right-2 h-7 w-7 p-0"
        >
          <Edit className="h-3.5 w-3.5" />
        </Button>
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

function DetailCard({
  title,
  items,
  isOwner,
  onEdit,
}: {
  title: string;
  items: string[];
  isOwner?: boolean;
  onEdit?: () => void;
}) {
  return (
    <div className="p-5 rounded-xl bg-card border border-border relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">{title}</h3>
        {isOwner && onEdit && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onEdit}
            className="h-7 w-7 p-0"
          >
            <Edit className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
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
