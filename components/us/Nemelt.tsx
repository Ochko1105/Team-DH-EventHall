"use client";
import React, { useState } from "react";

const LOCATIONS = [
  "Баянгол",
  "Баянзүрх",
  "Сонгино хайрхан",
  "Сүхбаатар",
  "Хан-Уул",
  "Чингэлтэй",
  "Төв → Зуунмод",
  "Архангай → Эрдэнэзэлбулган",
  "Дархан-Уул → Дархан",
];

export default function FilterSidebar() {
  const MIN = 500;
  const MAX = 5000;

  const [location, setLocation] = useState("");
  const [openLoc, setOpenLoc] = useState(false);

  const [price, setPrice] = useState(1500);
  const [capacity, setCapacity] = useState("");

  const resetFilters = () => {
    setLocation("");
    setPrice(1500);
    setCapacity("");
  };

  return (
    <aside className="w-[540px] h-[600px] bg-[#1F2024] text-gray-200 rounded-2xl p-6 shadow-lg border border-[#2f2f36] relative">
      <h2 className="text-2xl font-semibold mb-6">Filter Event Halls</h2>

      {/* LOCATION */}
      <label className="block mb-6 relative">
        <div className="mb-2 text-gray-300">Location</div>

        {/* SELECT BUTTON */}
        <button
          onClick={() => setOpenLoc(!openLoc)}
          className="w-full bg-[#2A2B2F] px-3 py-3 rounded-xl flex justify-between items-center text-left"
        >
          <span className="text-gray-300">{location || "Сум/дүүрэг…"}</span>

          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${
              openLoc ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* DROPDOWN */}
        {openLoc && (
          <div className="absolute z-20 mt-2 w-full bg-[#444548] rounded-xl shadow-xl py-2">
            {LOCATIONS.map((loc) => (
              <div
                key={loc}
                onClick={() => {
                  setLocation(loc);
                  setOpenLoc(false);
                }}
                className="px-4 py-2 cursor-pointer hover:bg-white/10 flex justify-between items-center"
              >
                <span>{loc}</span>

                {location === loc && (
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        )}
      </label>

      {/* PRICE */}
      <div className="mb-6">
        <div className="mb-2 text-gray-300">Price Range</div>

        <input
          type="range"
          min={MIN}
          max={MAX}
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full slider-thumb"
        />

        <div className="flex justify-between mt-3 text-sm text-gray-300">
          <span>${MIN}</span>
          <span>${MAX}</span>
        </div>
      </div>

      {/* CAPACITY */}
      <label className="block mb-6">
        <div className="mb-2 text-gray-300">Capacity</div>

        <div className="flex items-center gap-3 bg-[#2A2B2F] px-3 py-3 rounded-xl">
          <svg
            className="w-5 h-5 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              stroke="currentColor"
              strokeWidth="1.5"
              d="M12 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4z"
            />
            <path
              stroke="currentColor"
              strokeWidth="1.5"
              d="M6 20v-1a4 4 0 014-4h4a4 4 0 014 4v1"
            />
          </svg>

          <input
            type="number"
            min={0}
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            placeholder="Min. guests"
            className="bg-transparent outline-none w-full placeholder:text-gray-400 text-sm"
          />
        </div>
      </label>

      {/* BUTTONS */}
      <div className="flex flex-col gap-3">
        <button className="bg-blue-600 py-3 rounded-xl text-white font-medium hover:bg-blue-500">
          Apply Filters
        </button>

        <button
          onClick={resetFilters}
          className="border border-blue-600 text-blue-400 py-3 rounded-xl hover:bg-white/5"
        >
          Reset Filters
        </button>
      </div>
    </aside>
  );
}
