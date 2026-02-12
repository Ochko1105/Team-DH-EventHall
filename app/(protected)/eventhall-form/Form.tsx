"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChangeEvent, useState } from "react";
import Link from "next/link";
import { TrashIcon } from "lucide-react";

export default function Form() {
  const [name, setName] = useState<string>("");
  const [hallName, setHallName] = useState<string>("");
  const [suitableEvents, setSuitableEvents] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [rating, setRating] = useState<string>("");
  const [menu, setMenu] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [locationLink, setLocationLink] = useState<string>("");
  const [parkingCapacity, setParkingCapacity] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [additional, setAdditional] = useState<string>("");
  const [aboutHall, setAboutHall] = useState<string>("");
  const [advantages, setAdvantages] = useState<string>("");
  const [booking, setBooking] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [capacity, setCapacity] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleAddImage = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (images.length + files.length > 5) {
      alert("Хамгийн ихдээ 5 зураг оруулна");
      return;
    }

    setImages((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const deleteImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const base64Images = await Promise.all(
        images.map((img) => fileToBase64(img))
      );

      const res = await fetch("/api/form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          hallName,
          suitableEvents,
          price,
          rating,
          menu,
          location,
          locationLink,
          parkingCapacity,
          description,
          additional,
          aboutHall,
          advantages,
          booking,
          capacity,
          phoneNumber,
          email,
          images: base64Images,
        }),
      });

      const data = await res.json();
      alert(data.message);
      setImages([]);
    } catch (err) {
      console.error(err);
      alert("Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-5 bg-linear-to-r from-black via-slate-900 to-black py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-10">
          <h1 className="text-4xl font-bold text-center text-blue-600 mb-12">
            ✨ Event Hall
          </h1>

          <form onSubmit={handleSubmit} className="space-y-14">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-blue-600 border-b border-white/10 pb-2">
                Холбоо барих мэдээлэл
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Input
                  placeholder="Холбоо барих хүний нэр"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-white/10"
                />
                <Input
                  placeholder="Утасны дугаар"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="border-white/10"
                />
                <Input
                  //   type="email"
                  placeholder="И-мэйл"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-white/10"
                />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-blue-600 border-b border-white/10 pb-2">
                Заалны үндсэн мэдээлэл
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  placeholder="Танхимын нэр"
                  value={hallName}
                  onChange={(e) => setHallName(e.target.value)}
                  className="border-white/10"
                />
                <Input
                  placeholder="Багтаамж"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="border-white/10"
                />
                <Textarea
                  placeholder="Тохиромжтой эвентүүд"
                  value={suitableEvents}
                  onChange={(e) => setSuitableEvents(e.target.value)}
                  className="border-white/10"
                />
                <Textarea
                  placeholder="Меню"
                  value={menu}
                  onChange={(e) => setMenu(e.target.value)}
                  className="border-white/10"
                />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-blue-600 border-b border-white/10 pb-2">
                Үнэ ба үнэлгээ
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                <Input
                  placeholder="Үнэ"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="border-white/10"
                />
                <Input
                  placeholder="Үнэлгээ (4.5/5)"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="border-white/10"
                />
                <Input
                  placeholder="Авто зогсоолын багтаамж"
                  value={parkingCapacity}
                  onChange={(e) => setParkingCapacity(e.target.value)}
                  className="border-white/10"
                />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-blue-600 border-b border-white/10 pb-2">
                Дэлгэрэнгүй тайлбар
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Textarea
                  placeholder="Тайлбар"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border-white/10"
                />
                <Textarea
                  placeholder="Танхимын талаарх мэдээлэл"
                  value={aboutHall}
                  onChange={(e) => setAboutHall(e.target.value)}
                  className="border-white/10"
                />
                <Textarea
                  placeholder="Давуу талууд"
                  value={advantages}
                  onChange={(e) => setAdvantages(e.target.value)}
                  className="border-white/10"
                />
                <Textarea
                  placeholder="Нэмэлт боломжууд"
                  value={additional}
                  onChange={(e) => setAdditional(e.target.value)}
                  className="border-white/10"
                />
                <Textarea
                  placeholder="Захиалгын мэдээлэл"
                  value={booking}
                  onChange={(e) => setBooking(e.target.value)}
                  className="border-white/10"
                />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-blue-600 border-b border-white/10 pb-2">
                Байршил
              </h2>
              <Textarea
                placeholder="Хаяг байршил"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border-white/10"
              />
              <Textarea
                placeholder="Google Maps link"
                value={locationLink}
                onChange={(e) => setLocationLink(e.target.value)}
                className="border-white/10"
              />
            </div>

            {/* Images */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-blue-600 border-b border-white/10 pb-2">
                Зургууд
              </h2>

              <div className="flex flex-wrap gap-4">
                {/* Uploaded images */}
                {images.map((img, i) => {
                  const preview = URL.createObjectURL(img);

                  return (
                    <div key={i} className="relative group">
                      <img
                        src={preview}
                        className="w-50 h-35 object-cover rounded-xl"
                        onLoad={() => URL.revokeObjectURL(preview)}
                      />
                    </div>
                  );
                })}

                {/* Hidden input */}
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleAddImage}
                  className=""
                />

                {/* Upload box */}

                <label
                  htmlFor="image-upload"
                  className={`flex items-center justify-center rounded-xl border border-dashed border-white/30 cursor-pointer transition-all hover:border-blue-500
        ${
          images.length === 0
            ? "w-full h-45 text-4xl text-gray-400"
            : "w-50 h-35 text-2xl text-gray-400"
        }
      `}
                >
                  +
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-8">
              <Button
                type="submit"
                disabled={loading}
                className="h-14 text-lg bg-blue-600 text-white hover:bg-blue-900 duration-300 transition-all"
              >
                {loading ? "Бүртгэж байна..." : "Бүртгүүлэх"}
              </Button>

              <Link href="/home">
                <Button
                  variant="outline"
                  className="h-14 border-white/20 text-white duration-300 hover:bg-white transition-all"
                >
                  ⬅ Нүүр хуудас
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
