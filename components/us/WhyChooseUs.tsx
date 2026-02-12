import React, { useEffect, useRef } from "react";
import { Layers, CalendarCheck, Music, ShieldCheck } from "lucide-react";
import { useInView } from "react-intersection-observer";

const features = [
  {
    icon: <Layers className="w-10 h-10 text-blue-500" />,
    title: "Өргөн сонголт",
    description:
      "Бидний платформд жижиг хувийн өрөөнөөс эхлээд том заал хүртэлх төрөл бүрийн чанартай танхимуудыг нэг дороос хайж, захиалах боломжтой.",
  },
  {
    icon: <CalendarCheck className="w-10 h-10 text-blue-500" />,
    title: "Хялбар захиалга",
    description:
      "Бидний ухаалаг платформ таныг танхимын боломжийг шалгах, үнийн санал авах, хамгийн тохиромжтой газраа хэдхэн минутанд захиалах боломжийг олгодог.",
  },
  {
    icon: <Music className="w-10 h-10 text-blue-500" />,
    title: "Мэргэжлийн уран бүтээлчид",
    description:
      "Таны арга хэмжээг мэргэжлийн хөгжмийн баг, DJ, бусад үзвэр үйлчилгээ үзүүлэгчдээс сонгон илүү чанартай, хөгжилтэй болгоно.",
  },
  {
    icon: <ShieldCheck className="w-10 h-10 text-blue-500" />,
    title: "Баталгаатай & Найдвартай",
    description:
      "Манай платформ дахь бүх танхим болон уран бүтээлчид баталгаажсан тул та хамгийн өндөр чанар, найдвартай үйлчилгээг авна.",
  },
];

export const WhyChooseUs = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { ref, inView } = useInView({ threshold: 0.2 });
  const fadeRef = useRef<number | null>(null); // requestAnimationFrame id

  // Smooth fade function using requestAnimationFrame
  const fadeVolume = (target: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (fadeRef.current) cancelAnimationFrame(fadeRef.current);

    const step = () => {
      const diff = target - audio.volume;
      if (Math.abs(diff) < 0.01) {
        audio.volume = target;
        return;
      }
      // Smooth easing: volume += diff * 0.05
      audio.volume += diff * 0.05;
      fadeRef.current = requestAnimationFrame(step);
    };

    fadeRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Start muted so autoplay works
    audio.muted = true;
    audio.volume = 0;

    // Start playing silently
    audio.play().catch(() => {});

    if (inView) {
      audio.muted = false; // unmute
      fadeVolume(1); // fade in
    } else {
      fadeVolume(0); // fade out
    }
  }, [inView]);

  return (
    <section
      ref={ref}
      className="relative text-white min-h-screen flex flex-col justify-center overflow-hidden  py-12 bg-cover bg-center bg-fixed"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2070&auto=format&fit=crop')",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70 z-0" />

      {/* Background Music */}
      <audio ref={audioRef} loop playsInline>
        {/* <source src="/song.mp3" type="audio/mpeg" /> */}
      </audio>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-2 lg:mb-16">
          <h2 className="font-extrabold text-2xl lg:text-5xl mb-4 md:mt-0 mt-3">
            Яагаад биднийг сонгох естой вэ?
          </h2>
          <p className="max-w-2xl mx-auto text-[14px] lg:text-lg text-neutral-400">
            Бид таны арга хэмжээг төлөвлөх процессыг хялбар, онцгой болгох
            бүхнийг нэг дороос шийдэж өгдөг.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-8 gap-3">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="text-center p-3 bg-black/50 backdrop-blur-sm rounded-lg border border-neutral-800 transition-transform hover:scale-105 hover:bg-black/60"
            >
              <div className="flex  justify-center mb-2">{feature.icon}</div>
              <h3 className="lg:text-xl text-[17px]  font-bold mb-1">
                {feature.title}
              </h3>
              <p className="text-neutral-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
