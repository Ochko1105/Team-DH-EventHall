/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { CarouselMy } from "@/components/us/CarouselMy";
import { Hero } from "@/components/us/Hero";
import { WhyChooseUs } from "@/components/us/WhyChooseUs";
import { LayoutFooter } from "@/components/us/LayoutFooter";
import { useEffect, useRef, useState } from "react";
import Loader from "@/app/LoadingAnimation";

// remove <React.StrictMode> wrapper in development

export default function Page() {
  const [originalHalls, setOriginalHalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false); // ✅ track if we already fetched

  useEffect(() => {
    if (hasFetched.current) return; // exit if already fetched

    const getData = async () => {
      const res = await fetch("/api/event-halls");
      const data = await res.json();
      setOriginalHalls(data?.data || []);
      setLoading(false);
      hasFetched.current = true; // mark as fetched
    };

    getData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <main className="h-screen overflow-y-scroll snap-y snap-mandatory ">
      <section className=" snap-start snap-always overflow-hidden">
        <CarouselMy halls={originalHalls} />
      </section>

      {originalHalls && originalHalls.length > 0 && (
        <>
          <section className="snap-start">
            <Hero />
          </section>

          <section className="h-screen snap-start">
            <WhyChooseUs />
          </section>

          <section className=" snap-start">
            <LayoutFooter />
          </section>
        </>
      )}
    </main>
  );
}
