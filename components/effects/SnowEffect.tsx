"use client";

import { useEffect, useState } from "react";

interface Snowflake {
  id: number;
  left: number;
  animationDuration: number;
  animationDelay: number;
  fontSize: number;
  opacity: number;
  animationType: "snowfall" | "snowfall-left" | "snowfall-straight";
}

export default function SnowEffect() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    const createSnowflakes = () => {
      const flakes: Snowflake[] = [];
      const numberOfFlakes = 50; // Number of snowflakes

      for (let i = 0; i < numberOfFlakes; i++) {
        const animationTypes: (
          | "snowfall"
          | "snowfall-left"
          | "snowfall-straight"
        )[] = ["snowfall", "snowfall-left", "snowfall-straight"];

        flakes.push({
          id: i,
          left: Math.random() * 100, // Random position from 0-100%
          animationDuration: Math.random() * 10 + 10, // 10-20 seconds
          animationDelay: Math.random() * 5, // 0-5 seconds delay
          fontSize: Math.random() * 0.8 + 0.5, // 0.5-1.3em
          opacity: Math.random() * 0.6 + 0.4, // 0.4-1.0
          animationType:
            animationTypes[Math.floor(Math.random() * animationTypes.length)],
        });
      }

      setSnowflakes(flakes);
    };

    createSnowflakes();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake"
          style={{
            left: `${flake.left}%`,
            fontSize: `${flake.fontSize}em`,
            opacity: flake.opacity,
            animation: `${flake.animationType} ${flake.animationDuration}s linear ${flake.animationDelay}s infinite`,
          }}
        >
          ❄
        </div>
      ))}
    </div>
  );
}
