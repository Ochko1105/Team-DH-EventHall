"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, ArrowLeft } from "lucide-react";

export default function EditHallPage() {
  const router = useRouter();
  const params = useParams();
  const hallId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hall, setHall] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    capacity: "",
    description: "",
    phonenumber: "",
    location_link: "",
    duureg: "",
    parking_capacity: 0,
    rating: "",
  });

  useEffect(() => {
    fetchHall();
  }, [hallId]);

  const fetchHall = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/home");
        return;
      }

      const res = await fetch(`/api/hallowner/my-halls/${hallId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setHall(data.hall);
        setFormData({
          name: data.hall.name || "",
          location: data.hall.location || "",
          capacity: data.hall.capacity || "",
          description: data.hall.description || "",
          phonenumber: data.hall.phonenumber || "",
          location_link: data.hall.location_link || "",
          duureg: data.hall.duureg || "",
          parking_capacity: data.hall.parking_capacity || 0,
          rating: data.hall.rating || "",
        });
      } else {
        router.push("/hallowner-dashboard");
      }
    } catch (error) {
      console.error("Error fetching hall:", error);
      router.push("/hallowner-dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/hallowner/my-halls/${hallId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Амжилттай хадгалагдлаа!");
        router.push("/hallowner-dashboard");
      } else {
        alert("Алдаа гарлаа. Дахин оролдоно уу.");
      }
    } catch (error) {
      console.error("Error saving:", error);
      alert("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Уншиж байна...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <main className="container mx-auto p-4 md:p-8 max-w-4xl">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Буцах
          </button>
          <h1 className="text-4xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Танхим засах
          </h1>
        </div>

        <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">Нэр *</label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="bg-neutral-800 border-neutral-700"
                placeholder="Танхимын нэр"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium mb-2">Байршил</label>
              <Input
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="bg-neutral-800 border-neutral-700"
                placeholder="Хаяг"
              />
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-sm font-medium mb-2">Багтаамж</label>
              <Input
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: e.target.value })
                }
                className="bg-neutral-800 border-neutral-700"
                placeholder="Хүний тоо"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Тайлбар</label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="bg-neutral-800 border-neutral-700 min-h-32"
                placeholder="Танхимын тухай дэлгэрэнгүй мэдээлэл"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Утасны дугаар
              </label>
              <Input
                value={formData.phonenumber}
                onChange={(e) =>
                  setFormData({ ...formData, phonenumber: e.target.value })
                }
                className="bg-neutral-800 border-neutral-700"
                placeholder="99001122"
              />
            </div>

            {/* District */}
            <div>
              <label className="block text-sm font-medium mb-2">Дүүрэг</label>
              <Input
                value={formData.duureg}
                onChange={(e) =>
                  setFormData({ ...formData, duureg: e.target.value })
                }
                className="bg-neutral-800 border-neutral-700"
                placeholder="Дүүргийн нэр"
              />
            </div>

            {/* Parking */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Зогсоолын багтаамж
              </label>
              <Input
                type="number"
                value={formData.parking_capacity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    parking_capacity: parseInt(e.target.value) || 0,
                  })
                }
                className="bg-neutral-800 border-neutral-700"
                placeholder="0"
              />
            </div>

            {/* Location Link */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Байршлын холбоос
              </label>
              <Input
                value={formData.location_link}
                onChange={(e) =>
                  setFormData({ ...formData, location_link: e.target.value })
                }
                className="bg-neutral-800 border-neutral-700"
                placeholder="Google Maps линк"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-blue-600 hover:bg-blue-500 py-6 text-lg"
              >
                <Save className="w-5 h-5 mr-2" />
                {saving ? "Хадгалж байна..." : "Хадгалах"}
              </Button>
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="bg-neutral-800 border-neutral-700 py-6"
              >
                Цуцлах
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
