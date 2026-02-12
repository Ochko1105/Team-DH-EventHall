/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/home");
        return;
      }

      try {
        const res = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Хэрэглэгчийн мэдээлэл татаж чадсангүй");
        }

        const data = await res.json();
        setUser(data.user);
        setName(data.user.name || "");
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("/api/editProfile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Алдаа гарлаа");
      }

      setUser(data.user);
      setSuccess("Амжилттай хадгалагдлаа");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-black text-white">
        Түр хүлээнэ үү...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-black text-white pt-28 px-4">
      <div
        className="max-w-2xl mx-auto bg-neutral-900/90 backdrop-blur
                   border border-neutral-800/80
                   rounded-3xl p-10 shadow-2xl"
      >
        {/* PROFILE HEADER */}
        <div className="flex items-center gap-4 mb-10">
          <div
            className="w-14 h-14 rounded-full
                       bg-linear-to-br from-blue-500 to-purple-600
                       flex items-center justify-center
                       text-xl font-bold"
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>

          <div>
            <h1 className="text-2xl font-bold">Миний профайл</h1>
            <p className="text-sm text-neutral-400">
              Хувийн мэдээллээ энд засварлана
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* EMAIL */}
          <div>
            <label className="text-sm text-neutral-400">И-мэйл</label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full mt-2 bg-neutral-800/70 text-neutral-400 px-4 py-3
                         rounded-xl border border-neutral-700
                         cursor-not-allowed"
            />
          </div>

          {/* NAME */}
          <div>
            <label className="text-sm text-neutral-400">Нэр</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
                setSuccess(null);
              }}
              className="w-full mt-2 bg-neutral-800/70 text-white px-4 py-3
                         rounded-xl border border-neutral-700
                         focus:border-blue-500 focus:ring-2
                         focus:ring-blue-500/20
                         outline-none transition"
            />
          </div>

          {/* ERROR */}
          {error && (
            <div
              className="flex items-center gap-2 bg-red-500/10
                         border border-red-500/30
                         text-red-400 text-sm
                         rounded-xl px-4 py-3"
            >
              <XCircle size={18} /> {error}
            </div>
          )}

          {/* SUCCESS */}
          {success && (
            <div
              className="flex items-center gap-2 bg-green-500/10
                         border border-green-500/30
                         text-green-400 text-sm
                         rounded-xl px-4 py-3"
            >
              <CheckCircle size={18} /> {success}
            </div>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={saving || !!success}
            className={
              "w-full py-3 rounded-2xl font-semibold transition-all " +
              (success
                ? "bg-green-600 cursor-not-allowed"
                : "bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 active:scale-[0.99]")
            }
          >
            {saving
              ? "Хадгалж байна..."
              : success
              ? "Хадгалагдлаа"
              : "Хадгалах"}
          </button>
        </form>
      </div>
    </div>
  );
}
