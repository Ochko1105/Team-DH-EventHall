/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { Star, Mail, Phone, Calendar, Users, Award } from "lucide-react";

type HostDetail = {
  id: number;
  name: string;
  title: string;
  image: string;
  rating: number;
  status: string;
  tags: string[];
  intro: string;
  experience: string;
  email?: string | null;
  phone?: string | null;
  price?: number;
  specialties?: string[];
  achievements?: string[];
};

export default function HostProfilePage() {
  const { id } = useParams();
  const [host, setHost] = useState<HostDetail | null>(null);
  const [similarHosts, setSimilarHosts] = useState<HostDetail[]>([]);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/hosts?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        const h = data.find((x: any) => x.id === Number(id));
        if (h) {
          // Convert specialties & achievements if needed
          h.specialties = h.tags || [];
          h.achievements = h.achievements || [
            "Олон улсын болон дотоодын эвентүүдэд тогтмол оролцсон.",
            "Тайзны ажиллагааг мэргэжлийн түвшинд удирддаг.",
            "Үзэгчтэй харилцах чадвараараа ялгардаг.",
          ];
          h.experience = h.experience || h.intro;
          h.priceRange = h.price ? `${h.price.toLocaleString()}₮` : "—";

          setHost(h);
        }
      });
  }, [id]);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/hosts`)
      .then((res) => res.json())
      .then((allHosts) => {
        const current = allHosts.find((h: any) => h.id === Number(id));
        if (!current) return;

        const filtered = allHosts
          .filter((h: any) => h.id !== current.id)
          .filter((h: any) =>
            h.tags.some((tag: string) => current.tags.includes(tag))
          )
          .slice(0, 6);

        setSimilarHosts(filtered);
      });
  }, [id]);

  if (!host) return <div className="text-white p-10">уншиж байна...</div>;

  return (
    <div>
      <div className="min-h-screen bg-black relative overflow-hidden px-10 pt-25">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,20,30,0.4),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3...')]"></div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8">
            {/* LEFT CARD */}
            <div>
              <div className="bg-[rgba(20,22,27,0.6)] backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
                {/* IMAGE */}
                <div className="relative mb-6">
                  <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                    <img
                      src={host.image}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div
                    className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-linear-to-r from-blue-600 to-blue-700 
                                  text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg"
                  >
                    {host.status}
                  </div>
                </div>

                {/* NAME, TITLE */}
                <div className="text-center space-y-3 mt-8">
                  <h1 className="text-3xl font-bold text-white">{host.name}</h1>
                  <p className="text-lg text-white/60">{host.title}</p>

                  {/* RATING */}
                  <div className="flex items-center justify-center gap-2">
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-5 h-5 fill-current" />
                      <span className="text-lg font-semibold">
                        {host.rating}
                      </span>
                    </div>
                    <span className="text-white/60">/ 5.0</span>
                  </div>

                  {/* PRICE */}
                  <div className="pt-4">
                    <div className="text-sm text-white/50 mb-1">
                      Үнийн хүрээ
                    </div>
                    <div className="text-2xl font-bold bg-linear-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
                      {host.price
                        ? host.price.toLocaleString() + "₮"
                        : "Тохиролцоно"}
                    </div>
                  </div>
                </div>

                <button
                  className="w-full mt-8 h-14 rounded-xl bg-linear-to-r from-blue-600 to-blue-700 
                                   hover:from-blue-500 hover:to-blue-600 text-white font-semibold text-lg 
                                   shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] 
                                   transition-all duration-300"
                >
                  Захиалах
                </button>

                {/* CONTACT */}
                <div className="mt-6 space-y-3">
                  <div className="bg-[#1F222A] rounded-xl px-4 py-3 border border-white/5 flex items-center gap-3">
                    <Mail className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-white/80">
                      {host.email || "Имэйл байхгүй"}
                    </span>
                  </div>
                  <div className="bg-[#1F222A] rounded-xl px-4 py-3 border border-white/5 flex items-center gap-3">
                    <Phone className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-white/80">
                      {host.phone || "Утас байхгүй"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="space-y-6">
              {/* INTRO */}
              <div className="bg-[rgba(20,22,27,0.6)] backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6 text-blue-400" />
                  Танилцуулга
                </h2>
                <p className="text-white/70 leading-relaxed text-lg">
                  {host.intro}
                </p>
              </div>

              {/* EXPERIENCE */}
              <div className="bg-[rgba(20,22,27,0.6)] backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-blue-400" />
                  Туршлага
                </h2>
                <p className="text-white/70 leading-relaxed text-lg">
                  {host.experience}
                </p>
              </div>

              {/* TAGS */}
              <div className="bg-[rgba(20,22,27,0.6)] backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6 text-amber-400" />
                  Төрөл
                </h2>
                <div className="flex flex-wrap gap-3">
                  {host.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-[#1F222A] border border-white/10 rounded-full px-5 py-2 text-sm text-white/90"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* SIMILAR HOSTS — TAG-BASED */}
              <div className="bg-[rgba(20,22,27,0.6)] backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Төстэй хөтлөгчид
                </h2>

                {!similarHosts?.length ? (
                  <p className="text-white/50">Төстэй хөтлөгч олдсонгүй.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 gap-4">
                    {similarHosts.map((item) => (
                      <div
                        key={item.id}
                        className="bg-[#1F222A] rounded-2xl p-4 border border-white/10 hover:border-blue-500/30 transition cursor-pointer"
                      >
                        <img
                          src={item.image}
                          className="w-full h-[180px] object-cover rounded-xl"
                        />
                        <h3 className="mt-3 text-lg font-semibold text-white">
                          {item.name}
                        </h3>
                        <p className="text-white/60 text-sm">{item.title}</p>

                        <div className="mt-2 text-white text-sm">
                          ⭐ {item.rating} / 5.0
                        </div>

                        <a
                          href={`/host/${item.id}`}
                          className="block mt-3 text-center bg-linear-to-r from-blue-600 to-blue-700  rounded-lg py-2 text-white hover:bg-blue-700 transition"
                        >
                          Профайл
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
