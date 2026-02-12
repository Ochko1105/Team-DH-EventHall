/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FaStar,
  FaEnvelope,
  FaPhone,
  FaArrowLeft,
  FaPlay,
  FaPause,
  FaVolumeUp,
} from "react-icons/fa";
import Image from "next/image";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function PerformerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [performer, setPerformer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(30);
  const playerRef = useRef<any>(null);

  // Fetch performer data
  useEffect(() => {
    const fetchPerformer = async () => {
      try {
        const res = await fetch(`/api/performers/${params.id}`);
        const data = await res.json();
        setPerformer(data.performer);
      } catch (error) {
        console.error("Error fetching performer:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPerformer();
  }, [params.id]);

  // Load YouTube IFrame API safely
  useEffect(() => {
    if (window.YT && window.YT.Player) return;

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";

    const firstScriptTag = document.getElementsByTagName("script")[0];
    if (firstScriptTag && firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
      document.head.appendChild(tag);
    }
  }, []);

  // Extract video ID from URL
  const getYouTubeVideoId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Initialize YouTube player
  useEffect(() => {
    if (!performer?.music_url) return;
    const videoId = getYouTubeVideoId(performer.music_url);
    if (!videoId) return;

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;

      playerRef.current = new window.YT.Player("youtube-player", {
        height: "0",
        width: "0",
        videoId,
        playerVars: { autoplay: 1, controls: 0, loop: 1, playlist: videoId },
        events: {
          onReady: (event: any) => {
            event.target.setVolume(volume);
            event.target.playVideo();
            setIsPlaying(true);
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING)
              setIsPlaying(true);
            else if (event.data === window.YT.PlayerState.PAUSED)
              setIsPlaying(false);
          },
        },
      });
    };

    if (window.YT && window.YT.Player) initPlayer();
    else window.onYouTubeIframeAPIReady = initPlayer;

    return () => playerRef.current?.destroy();
  }, [performer]);

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) playerRef.current.pauseVideo();
    else playerRef.current.playVideo();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    playerRef.current?.setVolume(newVolume);
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "Боломжтой":
        return "bg-green-600";
      case "Хүлээгдэж байна":
        return "bg-yellow-600";
      case "Захиалагдсан":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Уншиж байна...</div>
      </div>
    );

  if (!performer)
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Уран бүтээлч олдсонгүй</h1>
          <button
            onClick={() => router.push("/performers/dashboard-to-performers")}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors"
          >
            Буцах
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white">
      {performer.music_url && <div id="youtube-player"></div>}

      {performer.music_url && (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3">
          <button
            onClick={togglePlay}
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all transform hover:scale-110"
            title={isPlaying ? "Зогсоох" : "Тоглуулах"}
          >
            {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
          </button>

          <div className="bg-gray-900 p-3 rounded-lg shadow-lg flex items-center gap-2">
            <FaVolumeUp className="text-blue-400" />
            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24 accent-blue-600"
            />
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => router.push("/performers/dashboard-to-performers")}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <FaArrowLeft /> Буцах
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-lg overflow-hidden sticky top-8">
              <div className="relative h-120 bg-gray-800">
                <Image
                  src={performer.image || "https://via.placeholder.com/400x600"}
                  alt={performer.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div
                  className={`absolute top-4 right-4 ${getAvailabilityColor(
                    performer.availability || "Боломжтой"
                  )} text-white px-4 py-2 rounded-full text-sm font-semibold`}
                >
                  {performer.availability || "Боломжтой"}
                </div>
              </div>

              <div className="p-6">
                <h1 className="text-3xl font-bold mb-2">{performer.name}</h1>
                <p className="text-gray-400 mb-4">
                  {performer.performance_type || performer.genre}
                </p>

                <div className="flex items-center gap-2 mb-6">
                  <FaStar className="text-yellow-400 text-xl" />
                  <span className="text-2xl font-semibold">
                    {performer.popularity
                      ? Number(performer.popularity).toLocaleString()
                      : "N/A"}
                  </span>
                  <span className="text-gray-400 text-sm">Viberate</span>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors font-semibold text-lg">
                  Захиалах
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-lg p-8">
              <section className="mb-8">
                <h2 className="text-2xl text-blue-400 font-bold mb-4">
                  Танилцуулга
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {performer.bio ||
                    "Энэ уран бүтээлчийн талаар мэдээлэл байхгүй байна."}
                </p>
              </section>

              {performer.best_songs?.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-2xl text-blue-400 font-bold mb-4">
                    Шилдэг дуунууд
                  </h2>
                  <div className="space-y-3">
                    {performer.best_songs.map((song: string, index: number) => (
                      <div
                        key={index}
                        className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <FaStar className="text-yellow-400" />
                          <h3 className="text-lg font-semibold">{song}</h3>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {performer.genre && (
                <section className="mb-8">
                  <h2 className="text-2xl text-blue-400 font-bold mb-4">
                    Төрөл
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {performer.genre
                      .split(",")
                      .map((g: string, index: number) => (
                        <span
                          key={index}
                          className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm"
                        >
                          {g.trim()}
                        </span>
                      ))}
                  </div>
                </section>
              )}

              {performer.performance_type && (
                <section className="mb-8">
                  <h2 className="text-2xl text-blue-400 font-bold mb-4">
                    Тоглолтын төрөл
                  </h2>
                  <p className="text-gray-300">{performer.performance_type}</p>
                </section>
              )}

              <section className="mb-8">
                <h2 className="text-2xl text-blue-400 font-bold mb-4">
                  Холбоо барих мэдээлэл
                </h2>
                <div className="space-y-4">
                  {performer.contact_email && (
                    <div className="flex items-center gap-3">
                      <FaEnvelope className="text-blue-500 text-xl" />
                      <a
                        href={`mailto:${performer.contact_email}`}
                        className="text-gray-300 hover:text-white transition-colors"
                      >
                        {performer.contact_email}
                      </a>
                    </div>
                  )}
                  {performer.contact_phone && (
                    <div className="flex items-center gap-3">
                      <FaPhone className="text-blue-500 text-xl" />
                      <a
                        href={`tel:${performer.contact_phone}`}
                        className="text-gray-300 hover:text-white transition-colors"
                      >
                        {performer.contact_phone}
                      </a>
                    </div>
                  )}
                </div>
              </section>

              <section>
                <h2 className="text-2xl text-blue-400 font-bold mb-4">
                  Дэлгэрэнгүй
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className={`p-4 rounded-lg ${getAvailabilityColor(
                      performer.availability
                    )}`}
                  >
                    <h3 className="text-blue-600 text-sm mb-1">
                      Боломжтой эсэх
                    </h3>
                    <p className="font-semibold">
                      {performer.availability || "Боломжтой"}
                    </p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-gray-400 text-sm mb-1">Элссэн огноо</h3>
                    <p className="font-semibold">
                      {performer.created_at
                        ? new Date(performer.created_at).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
